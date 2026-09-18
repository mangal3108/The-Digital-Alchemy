import { getPublishedMetrics } from "@/lib/content";
import { CountUp } from "@/components/ui/count-up";
import { revealProps } from "@/lib/reveal";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";

/**
 * Company numbers.
 *
 * Every value comes from the CMS and every metric is unpublished by default,
 * so this band simply does not render until an administrator enters real
 * figures and switches them on. There is no hard-coded fallback on purpose:
 * the previous site showed counters stuck at "1", which is worse than showing
 * nothing at all.
 */
export async function Metrics() {
  const metrics = await getPublishedMetrics();
  if (!metrics.length) return null;

  return (
    <section
      aria-label="Company figures"
      className="relative overflow-hidden border-y border-hairline bg-surface"
    >
      <SectionBackdrop name="plate-bench-aluminium" from="var(--color-surface)" opacity={0.14} side="both" />
      <div className="container-page relative py-12 sm:py-14">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-9 md:grid-cols-4">
          {metrics.map((metric, index) => (
            <div key={metric.id} {...revealProps(index * 60)}>
              <dd className="numeric text-[clamp(2rem,1.4rem+2.2vw,3rem)] font-semibold leading-none text-ink">
                {metric.prefix ? (
                  <span className="text-accent-text">{metric.prefix}</span>
                ) : null}
                <CountUp value={metric.value} />
                {metric.suffix ? (
                  <span className="text-accent-text">{metric.suffix}</span>
                ) : null}
              </dd>
              <dt className="mt-2.5 text-[0.875rem] font-medium text-ink-muted">
                {metric.label}
              </dt>
              {metric.note ? (
                <p className="mt-1 text-[0.75rem] leading-snug text-ink-subtle">
                  {metric.note}
                </p>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
