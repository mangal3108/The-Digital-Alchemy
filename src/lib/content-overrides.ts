import { cache } from "react";

import { db } from "./db";
import { allowedFields, type ContentScope } from "@/content/editable";

/**
 * Resolves admin copy edits over the typed content files.
 *
 * The code is the default; this only replaces fields somebody has deliberately
 * changed. An empty `ContentOverride` table therefore renders the site exactly
 * as the repository says, which is what makes this safe to introduce to a live
 * site: nothing changes until someone changes it.
 *
 * Reads are cached per request, so a page rendering ten overridden strings
 * still makes one query.
 */

export type OverrideMap = Record<string, string>;

/**
 * Every override for one scope, keyed by entry then field.
 *
 * Loaded per scope rather than per entry: a listing page renders twenty
 * services, and twenty queries to apply nothing would be a poor trade for a
 * feature that is usually inactive.
 */
const loadScope = cache(async (scope: ContentScope) => {
  const rows = await db.contentOverride
    .findMany({ where: { scope } })
    .catch(() => []);

  const allowed = allowedFields(scope);
  const byEntry = new Map<string, OverrideMap>();

  for (const row of rows) {
    // A row naming a field the registry does not declare is ignored rather
    // than trusted. Fields get renamed and removed; stale rows should not
    // resurrect copy the code no longer has a slot for.
    if (!allowed.has(row.field)) continue;
    const value = row.value.trim();
    if (!value) continue;

    const entry = byEntry.get(row.entryKey) ?? {};
    entry[row.field] = value;
    byEntry.set(row.entryKey, entry);
  }

  return byEntry;
});

/** The overrides for one entry, or an empty object. */
export async function getOverrides(
  scope: ContentScope,
  entryKey: string,
): Promise<OverrideMap> {
  const byEntry = await loadScope(scope);
  return byEntry.get(entryKey) ?? {};
}

/**
 * Returns `base` with any overridden fields replaced.
 *
 * Shallow by design. Only top-level string fields are editable, so a deep
 * merge would imply a capability the admin does not offer and the registry
 * does not declare.
 */
export function merge<T extends object>(base: T, overrides: OverrideMap): T {
  if (!Object.keys(overrides).length) return base;

  const result = { ...base } as Record<string, unknown>;
  for (const [field, value] of Object.entries(overrides)) {
    // Never introduce a key the base object does not already have: the
    // registry is the contract, but this is the belt to its braces.
    if (field in result) result[field] = value;
  }
  return result as T;
}

/** Convenience for the common case: fetch and apply in one call. */
export async function withOverrides<T extends object>(
  scope: ContentScope,
  entryKey: string,
  base: T,
): Promise<T> {
  return merge(base, await getOverrides(scope, entryKey));
}

/** Applies a scope's overrides across a list, in one query. */
export async function withOverridesAll<T extends object>(
  scope: ContentScope,
  items: T[],
  keyOf: (item: T) => string,
): Promise<T[]> {
  const byEntry = await loadScope(scope);
  if (!byEntry.size) return items;
  return items.map((item) => merge(item, byEntry.get(keyOf(item)) ?? {}));
}
