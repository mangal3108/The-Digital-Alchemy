import { Section, SectionHeading } from "@/components/ui/section-heading";
import { revealProps } from "@/lib/reveal";
import { homeReasons } from "@/content/process";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";

/**
 * Homepage "Why us": three points, each something a client can check for
 * themselves. The longer list lives on /about.
 */
export function WhyUs() {
  return (
    <Section className="relative overflow-hidden bg-surface">
      <SectionBackdrop name="section-why-us" from="var(--color-surface)" opacity={0.16} side="right" />
      <div className="relative">
        <SectionHeading eyebrow="Why work with us" title="What you can expect from us." />

        <div className="mt-11 grid gap-x-10 gap-y-9 md:grid-cols-3">
          {homeReasons.map((item, index) => (
            <div
              key={item.key}
              {...revealProps(index * 70)}
              className="border-t border-hairline pt-6"
            >
              <h3 className="text-title text-ink">{item.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
