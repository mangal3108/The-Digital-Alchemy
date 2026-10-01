import { Section, SectionHeading } from "@/components/ui/section-heading";
import { getService, serviceHref } from "@/content/services";
import { getIndustry } from "@/content/industries";
import { pickerTargets } from "@/content/service-picker";
import { ServicePicker, type PickerService } from "./service-picker";

/**
 * Checked when this module loads, which includes the production build: a
 * recommendation pointing at a renamed service would otherwise send visitors
 * to a 404 from the one component whose whole job is sending them somewhere
 * useful.
 */
const targets = pickerTargets();
for (const slug of targets.services) {
  if (!getService(slug)) throw new Error(`Service picker recommends unknown service "${slug}".`);
}
for (const slug of targets.industries) {
  if (!getIndustry(slug)) throw new Error(`Service picker links to unknown industry "${slug}".`);
}

// Only what the picker can actually show is sent to the browser.
const catalogue: Record<string, PickerService> = Object.fromEntries(
  targets.services.map((slug) => {
    const service = getService(slug)!;
    return [slug, { name: service.name, oneLiner: service.oneLiner, href: serviceHref(slug) }];
  }),
);
const industries: Record<string, string> = Object.fromEntries(
  targets.industries.map((slug) => [slug, getIndustry(slug)!.name]),
);

/** The "Not sure what you need?" section, as placed on the homepage and /services. */
export function ServicePickerSection({ className }: { className?: string }) {
  return (
    <Section id="help-me-choose" className={className}>
      <SectionHeading
        eyebrow="Not sure what you need?"
        title="Answer a few quick questions."
        lede="Tell us about your business and what you want, and we will point you to the one or two services that fit. It takes under a minute, and you do not need to sign up."
      />
      <div className="mt-10">
        <ServicePicker catalogue={catalogue} industries={industries} />
      </div>
    </Section>
  );
}
