import { requirePermission } from "@/lib/auth";
import { PageHeader } from "@/components/admin/ui";
import {
  SETTING_DEFINITIONS,
  SETTING_GROUPS,
  getSettingsMap,
} from "@/lib/settings";
import { SettingsGroupForm } from "./settings-form";

export const metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

/**
 * Central site configuration.
 *
 * These values are the single source of truth for contact details, social
 * profiles and analytics IDs. Nothing in the codebase hard-codes them, so
 * changing a phone number here changes it everywhere it appears, including the
 * structured data.
 */
export default async function SettingsPage() {
  await requirePermission("settings.manage");
  const values = await getSettingsMap();

  return (
    <>
      <PageHeader
        title="Site settings"
        description="Used across the public site, the footer and the structured data. Blank fields are hidden rather than shown empty."
      />

      <div className="grid max-w-3xl gap-4">
        {SETTING_GROUPS.map((group) => {
          const fields = SETTING_DEFINITIONS.filter(
            (definition) => definition.group === group.key,
          ).map((definition) => ({
            key: definition.key,
            label: definition.label,
            type: definition.type,
            hint: definition.hint,
            value: values.get(definition.key) ?? definition.default,
          }));

          return (
            <SettingsGroupForm
              key={group.key}
              group={group.key}
              title={group.label}
              description={group.blurb}
              fields={fields}
            />
          );
        })}
      </div>
    </>
  );
}
