import { Section, SectionHeading } from "@/components/ui/section-heading";
import { revealProps } from "@/lib/reveal";
import { differentiators } from "@/content/process";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";

export function WhyUs() {
  return (
    <Section className="relative overflow-hidden bg-surface">
      <SectionBackdrop name="section-why-us" from="var(--color-surface)" opacity={0.16} side="right" />
      <div className="relative">
        <SectionHeading
          eyebrow="Why work with us"
          title="Four things that actually change the outcome."
          lede="Not adjectives. These are the structural decisions that make a project more likely to work — and they are the ones we would ask about if we were hiring a studio."
        />

      <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2">
        {differentiators.map((item, index) => (
          <div
            key={item.key}
            {...revealProps(index * 70)}
            className="border-t border-hairline pt-6"
          >
            <span className="numeric font-mono text-[0.75rem] tracking-[0.14em] text-accent-text">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-3 text-title text-ink">{item.title}</h3>
            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      {/* The brand idea, stated once, as an equation rather than a slogan. */}
      <div
        {...revealProps(160)}
        className="mt-14 rounded-lg border border-hairline bg-canvas px-6 py-8 text-center sm:px-10"
      >
        <p className="eyebrow">The formula</p>
        <p className="mt-4 font-serif text-[clamp(1.25rem,0.9rem+1.4vw,2rem)] leading-snug text-ink">
          Strategy <span className="text-blue-500 font-sans">+</span> AI Automation{" "}
          <span className="text-purple-500 font-sans">+</span> Engineering{" "}
          <span className="text-emerald-500 font-sans">+</span> Growth{" "}
          <span className="text-amber-500 font-sans">=</span>{" "}
          <span className="text-gradient-apple font-semibold">Digital Alchemy</span>
        </p>
        <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-ink-muted">
          Autonomous workflows, world-class design, robust engineering, and compound search growth. The combination is the whole proposition.
        </p>
      </div>
      </div>
    </Section>
  );
}
