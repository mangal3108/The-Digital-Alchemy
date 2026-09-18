"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import {
  allowedFields,
  EDITABLE_PAGES,
  type ContentScope,
} from "@/content/editable";

export type ContentState = { ok: boolean; message?: string; error?: string };

const SCOPES: ContentScope[] = ["service", "industry", "location", "page"];

/** Which public paths a change to this entry affects. */
function pathsFor(scope: ContentScope, entryKey: string): string[] {
  switch (scope) {
    case "service":
      // The listing and the homepage showcase both render the summary.
      return [`/services/${entryKey}`, "/services", "/"];
    case "industry":
      return [`/industries/${entryKey}`, "/industries"];
    case "location":
      return [`/locations/${entryKey}`, "/locations"];
    case "page":
      return [entryKey];
  }
}

export async function saveContent(
  _prev: ContentState,
  formData: FormData,
): Promise<ContentState> {
  const user = await requirePermission("content.edit");

  const scope = String(formData.get("scope") ?? "") as ContentScope;
  const entryKey = String(formData.get("entryKey") ?? "").trim();

  if (!SCOPES.includes(scope)) return { ok: false, error: "Unknown content type." };
  if (!entryKey) return { ok: false, error: "Choose a page to edit." };
  if (scope === "page" && !EDITABLE_PAGES.some((p) => p.path === entryKey)) {
    return { ok: false, error: "That page is not editable." };
  }

  const allowed = allowedFields(scope);
  let changed = 0;
  let cleared = 0;

  for (const field of allowed) {
    const raw = formData.get(`field:${field}`);
    if (raw === null) continue;

    const value = String(raw).trim().slice(0, 4000);

    if (!value) {
      // Empty means "use the code default" rather than "publish nothing", so
      // clearing a box restores the repository copy instead of blanking the
      // page. That is the behaviour that makes this reversible.
      const deleted = await db.contentOverride.deleteMany({
        where: { scope, entryKey, field },
      });
      cleared += deleted.count;
      continue;
    }

    await db.contentOverride.upsert({
      where: { scope_entryKey_field: { scope, entryKey, field } },
      create: { scope, entryKey, field, value },
      update: { value },
    });
    changed++;
  }

  await recordAudit({
    userId: user.id,
    action: "content.override",
    entity: "ContentOverride",
    entityId: `${scope}:${entryKey}`,
    summary: `${changed} field${changed === 1 ? "" : "s"} set, ${cleared} reset`.slice(0, 80),
  });

  for (const path of pathsFor(scope, entryKey)) revalidatePath(path);
  revalidatePath("/admin/content");

  return {
    ok: true,
    message: cleared
      ? `Saved. ${cleared} field${cleared === 1 ? "" : "s"} reset to the original copy.`
      : "Saved.",
  };
}

/** Drops every override for one entry, returning it to the code defaults. */
export async function resetContent(formData: FormData) {
  const user = await requirePermission("content.edit");

  const scope = String(formData.get("scope") ?? "") as ContentScope;
  const entryKey = String(formData.get("entryKey") ?? "").trim();
  if (!SCOPES.includes(scope) || !entryKey) return;

  const deleted = await db.contentOverride.deleteMany({ where: { scope, entryKey } });

  await recordAudit({
    userId: user.id,
    action: "content.reset",
    entity: "ContentOverride",
    entityId: `${scope}:${entryKey}`,
    summary: `${deleted.count} field${deleted.count === 1 ? "" : "s"} reset`.slice(0, 80),
  });

  for (const path of pathsFor(scope, entryKey)) revalidatePath(path);
  revalidatePath("/admin/content");
}
