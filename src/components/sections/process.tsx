import { Section, SectionHeading } from "@/components/ui/section-heading";
import { revealProps } from "@/lib/reveal";
import { processStages } from "@/content/process";
import { ACCENTS } from "@/content/accents";

/**
 * How an engagement runs.
 *
 * A horizontal journey on wide screens and a vertical timeline on narrow ones
 * — not the same grid squeezed. The connecting rule is drawn with a border
 * rather than an SVG so it reflows for free at any width.
 */
export function ProcessSection() {
  return (
    <Section id="process">
      <SectionHeading
        eyebrow="How we work"
        title="Six stages, and what you get from each."
        lede="The same shape whether we are building a SaaS platform or running a growth retainer. What changes is the depth of each stage, not the order."
      />

      {/* ---- Desktop: horizontal ---- */}
      <ol className="mt-14 hidden lg:grid lg:grid-cols-6">
        {processStages.map((stage, index) => (
          <li
            key={stage.step}
            {...revealProps(index * 70)}
            data-accent={ACCENTS[index % ACCENTS.length]}
            className="group relative pr-5"
          >
            {/* Connector */}
            <div className="relative mb-6 flex items-center">
              <span className="relative z-raised flex size-9 shrink-0 items-center justify-center rounded-full border border-hairline-strong bg-surface font-mono text-[0.6875rem] text-ink transition-colors duration-[var(--duration-standard)] group-hover:border-accent group-hover:bg-accent-soft group-hover:text-accent-text">
                {stage.step}
              </span>
              {index < processStages.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute left-9 right-0 h-px bg-hairline-strong"
                />
              ) : null}
            </div>

            <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-ink">
              {stage.title}
            </h3>
            <p className="mt-1.5 text-[0.875rem] font-medium leading-snug text-ink">
              {stage.summary}
            </p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">
              {stage.detail}
            </p>

            <ul className="mt-3.5 space-y-1">
              {stage.outputs.map((output) => (
                <li
                  key={output}
                  className="flex items-start gap-1.5 text-[0.75rem] text-ink-subtle"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.4rem] size-1 shrink-0 rounded-full bg-accent"
                  />
                  {output}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      {/* ---- Mobile / tablet: vertical timeline ---- */}
      <ol className="mt-10 lg:hidden">
        {processStages.map((stage, index) => (
          <li
            key={stage.step}
            {...revealProps(index * 50)}
            data-accent={ACCENTS[index % ACCENTS.length]}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            <div className="flex flex-col items-center">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-hairline-strong bg-surface font-mono text-[0.6875rem] text-ink">
                {stage.step}
              </span>
              {index < processStages.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="mt-1 w-px flex-1 bg-hairline-strong"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1 pb-1">
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-ink">
                {stage.title}
              </h3>
              <p className="mt-1 text-[0.9375rem] font-medium leading-snug text-ink">
                {stage.summary}
              </p>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
                {stage.detail}
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                {stage.outputs.map((output) => (
                  <li
                    key={output}
                    className="flex items-center gap-1.5 text-[0.75rem] text-ink-subtle"
                  >
                    <span
                      aria-hidden="true"
                      className="size-1 shrink-0 rounded-full bg-accent"
                    />
                    {output}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
