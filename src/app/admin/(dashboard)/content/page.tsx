import { requirePermission } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageHeader, Notice } from "@/components/admin/ui";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { markets } from "@/content/locations";
import {
  EDITABLE_FIELDS,
  EDITABLE_PAGES,
  SCOPE_LABELS,
  type ContentScope,
} from "@/content/editable";
import { ContentEditor, type EntryValues } from "./content-editor";

export const metadata = { title: "Page copy" };
export const dynamic = "force-dynamic";

/**
 * Page copy.
 *
 * Every heading, lede, summary and meta field on the marketing pages, editable
 * without a deploy. The typed content files remain the default; this only
 * stores fields somebody has changed, so the "Unchanged" state is the code
 * speaking and clearing a box puts it back.
 *
 * Structural content is deliberately not here — process stages, technology
 * entries, service visuals. Changing those is a code change, and pretending
 * otherwise in an admin form would be the wrong promise.
 */
export default async function ContentAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ scope?: string }>;
}) {
  await requirePermission("content.edit");

  const params = await searchParams;
  const scope = (
    ["service", "industry", "location", "page"].includes(params.scope ?? "")
      ? params.scope
      : "service"
  ) as ContentScope;

  const rows = await db.contentOverride.findMany({ where: { scope } });
  const byEntry = new Map<string, Record<string, string>>();
  for (const row of rows) {
    const entry = byEntry.get(row.entryKey) ?? {};
    entry[row.field] = row.value;
    byEntry.set(row.entryKey, entry);
  }

  const fields = EDITABLE_FIELDS[scope];

  /** Defaults read straight from the content files, per scope. */
  const entries: { key: string; label: string; defaults: Record<string, string> }[] =
    scope === "service"
      ? services.map((item) => ({
          key: item.slug,
          label: item.name,
          defaults: pick(item, fields.map((f) => f.name)),
        }))
      : scope === "industry"
        ? industries.map((item) => ({
            key: item.slug,
            label: item.name,
            defaults: pick(item, fields.map((f) => f.name)),
          }))
        : scope === "location"
          ? markets.map((item) => ({
              key: item.slug,
              label: item.country,
              defaults: pick(item, fields.map((f) => f.name)),
            }))
          : EDITABLE_PAGES.map((item) => ({
              key: item.path,
              // Standalone page copy lives in the component, so there is no
              // object to read a default from. The placeholder stays empty and
              // the field simply overrides whatever the component renders.
              label: item.label,
              defaults: {},
            }));

  const editedCount = byEntry.size;

  return (
    <>
      <PageHeader
        title="Page copy"
        description={
          editedCount
            ? `${editedCount} page${editedCount === 1 ? "" : "s"} in this section differ from the repository.`
            : "Nothing here differs from the repository. Every page is showing its original copy."
        }
      />

      <nav className="mt-5 flex flex-wrap gap-1.5">
        {(Object.keys(SCOPE_LABELS) as ContentScope[]).map((key) => (
          <a
            key={key}
            href={`/admin/content?scope=${key}`}
            aria-current={key === scope ? "page" : undefined}
            className={
              key === scope
                ? "h-9 rounded-full bg-accent px-3.5 text-[0.8125rem] font-medium leading-9 text-on-accent"
                : "h-9 rounded-full border border-hairline px-3.5 text-[0.8125rem] font-medium leading-9 text-ink-muted transition-colors hover:border-hairline-strong hover:text-ink"
            }
          >
            {SCOPE_LABELS[key]}
          </a>
        ))}
      </nav>

      {scope === "page" ? (
        <div className="mt-5">
          <Notice>
          These pages keep their wording in the component, so there is no
            original to show as a placeholder here. A field you fill in
            replaces what the page renders; clearing it hands control back to
            the code.
          </Notice>
        </div>
      ) : null}

      <div className="mt-6 grid gap-3">
        {entries.map((entry) => {
          const values: EntryValues = {
            defaults: entry.defaults,
            overrides: byEntry.get(entry.key) ?? {},
          };
          return (
            <ContentEditor
              key={entry.key}
              scope={scope}
              entryKey={entry.key}
              label={entry.label}
              fields={fields}
              values={values}
            />
          );
        })}
      </div>
    </>
  );
}

/** Reads the named string fields off a content object. */
function pick(source: object, names: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const name of names) {
    const value = (source as Record<string, unknown>)[name];
    if (typeof value === "string") out[name] = value;
  }
  return out;
}
