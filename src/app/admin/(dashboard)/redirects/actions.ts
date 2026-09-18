"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { redirectSchema, fieldErrors } from "@/lib/validation";

export interface RedirectState {
  ok?: boolean;
  error?: string;
  message?: string;
  fields?: Record<string, string>;
}

export async function createRedirect(
  _prev: RedirectState,
  formData: FormData,
): Promise<RedirectState> {
  const user = await requirePermission("redirects.manage");

  const parsed = redirectSchema.safeParse({
    source: formData.get("source"),
    destination: formData.get("destination"),
    statusCode: formData.get("statusCode"),
    isActive: formData.get("isActive") === "on",
    note: formData.get("note"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Check the fields below.", fields: fieldErrors(parsed.error) };
  }

  const { source, destination, statusCode, isActive, note } = parsed.data;

  // A redirect pointing at itself is an infinite loop, and it is an easy
  // mistake to make when normalising trailing slashes.
  if (source === destination) {
    return { ok: false, error: "Source and destination are the same." };
  }

  // One hop of loop detection: if the destination itself redirects back here.
  const reverse = await db.redirect.findFirst({
    where: { isActive: true, source: destination, destination: source },
  });
  if (reverse) {
    return {
      ok: false,
      error: "That would create a redirect loop with an existing rule.",
    };
  }

  const existing = await db.redirect.findUnique({ where: { source } });
  if (existing) {
    return { ok: false, error: "A redirect already exists for that path." };
  }

  const created = await db.redirect.create({
    data: { source, destination, statusCode, isActive, note: note || null },
  });

  await recordAudit({
    userId: user.id,
    action: "redirect.created",
    entity: "Redirect",
    entityId: created.id,
    summary: `${source} → ${destination} (${statusCode})`,
  });

  revalidatePath("/admin/redirects");
  return { ok: true, message: "Redirect added." };
}

export async function toggleRedirect(formData: FormData) {
  const user = await requirePermission("redirects.manage");
  const id = String(formData.get("id") ?? "");

  const existing = await db.redirect.findUnique({ where: { id } });
  if (!existing) return;

  await db.redirect.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });

  await recordAudit({
    userId: user.id,
    action: existing.isActive ? "redirect.disabled" : "redirect.enabled",
    entity: "Redirect",
    entityId: id,
    summary: `${existing.source} → ${existing.destination}`,
  });

  revalidatePath("/admin/redirects");
}

export async function deleteRedirect(formData: FormData) {
  const user = await requirePermission("redirects.manage");
  const id = String(formData.get("id") ?? "");

  const existing = await db.redirect.findUnique({ where: { id } });
  if (!existing) return;

  await db.redirect.delete({ where: { id } });

  await recordAudit({
    userId: user.id,
    action: "redirect.deleted",
    entity: "Redirect",
    entityId: id,
    summary: `Removed ${existing.source} → ${existing.destination}`,
  });

  revalidatePath("/admin/redirects");
}
