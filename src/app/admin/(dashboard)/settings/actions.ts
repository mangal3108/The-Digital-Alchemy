"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { SETTING_DEFINITIONS } from "@/lib/settings";

export interface SettingsState {
  ok?: boolean;
  error?: string;
  message?: string;
}

const DEFINITIONS = new Map(
  SETTING_DEFINITIONS.map((definition) => [definition.key, definition]),
);

/**
 * Save site settings.
 *
 * Only keys declared in SETTING_DEFINITIONS are written — a crafted form post
 * cannot introduce arbitrary rows. Values are trimmed and length-capped, and
 * URL-typed fields must be http(s) so a `javascript:` URL can never reach the
 * footer's social links.
 */
export async function saveSettings(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const user = await requirePermission("settings.manage");

  const group = String(formData.get("__group") ?? "");
  const changes: { key: string; value: string }[] = [];

  for (const [rawKey, rawValue] of formData.entries()) {
    if (rawKey.startsWith("__")) continue;
    const definition = DEFINITIONS.get(rawKey);
    if (!definition) continue;
    if (group && definition.group !== group) continue;

    const value = String(rawValue).trim().slice(0, 2000);

    if (definition.type === "url" && value) {
      if (!/^https?:\/\//i.test(value)) {
        return {
          ok: false,
          error: `${definition.label} must start with http:// or https://`,
        };
      }
    }

    if (definition.type === "email" && value) {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
        return { ok: false, error: `${definition.label} is not a valid email.` };
      }
    }

    changes.push({ key: rawKey, value });
  }

  if (!changes.length) return { ok: false, error: "Nothing to save." };

  const existing = await db.siteSetting.findMany({
    where: { key: { in: changes.map((change) => change.key) } },
  });
  const before = new Map(existing.map((row) => [row.key, row.value]));

  await db.$transaction(
    changes.map((change) => {
      const definition = DEFINITIONS.get(change.key)!;
      return db.siteSetting.upsert({
        where: { key: change.key },
        update: { value: change.value },
        create: {
          key: change.key,
          value: change.value,
          label: definition.label,
          group: definition.group,
          type: definition.type,
          hint: definition.hint ?? null,
        },
      });
    }),
  );

  const changed = changes.filter(
    (change) => (before.get(change.key) ?? definitionDefault(change.key)) !== change.value,
  );

  if (changed.length) {
    await recordAudit({
      userId: user.id,
      action: "settings.updated",
      entity: "SiteSetting",
      summary: `Updated ${changed.length} setting${changed.length === 1 ? "" : "s"} in ${group || "settings"}`,
      meta: { keys: changed.map((change) => change.key) },
    });
  }

  // Contact details and analytics IDs appear across the whole site.
  revalidatePath("/", "layout");

  return {
    ok: true,
    message: changed.length ? "Settings saved." : "No changes to save.",
  };
}

function definitionDefault(key: string): string {
  return DEFINITIONS.get(key)?.default ?? "";
}
