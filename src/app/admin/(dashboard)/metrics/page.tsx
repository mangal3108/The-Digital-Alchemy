import { requirePermission } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, PageHeader } from "@/components/admin/ui";
import { MetricRow } from "./metric-row";

export const metadata = { title: "Metrics" };
export const dynamic = "force-dynamic";

/**
 * Company figures.
 *
 * Every metric starts unpublished with an empty value. The public site renders
 * the band only when at least one is published with a real value, so there is
 * no path by which an invented statistic reaches a visitor. The previous site
 * displayed counters stuck at "1"; this is the structural fix for that.
 */
export default async function MetricsPage() {
  await requirePermission("metrics.manage");
  const metrics = await db.metric.findMany({ orderBy: { order: "asc" } });

  const published = metrics.filter(
    (metric) => metric.isPublished && metric.value.trim() !== "",
  ).length;

  return (
    <>
      <PageHeader
        title="Metrics"
        description="Shown on the homepage and About page. A metric only appears publicly once it has a real value and is switched on."
      />

      <Card
        title="Company figures"
        description={
          published
            ? `${published} currently visible on the site.`
            : "None are visible yet — the metrics band is hidden entirely."
        }
      >
        <ul className="divide-y divide-hairline">
          {metrics.map((metric) => (
            <MetricRow
              key={metric.id}
              metric={{
                id: metric.id,
                key: metric.key,
                label: metric.label,
                value: metric.value,
                prefix: metric.prefix ?? "",
                suffix: metric.suffix ?? "",
                note: metric.note ?? "",
                isPublished: metric.isPublished,
                order: metric.order,
              }}
            />
          ))}
        </ul>
      </Card>

      <p className="mt-4 max-w-2xl text-[0.8125rem] leading-relaxed text-ink-subtle">
        A note on these: only publish figures you could evidence if a client
        asked. Numbers that cannot be substantiated are the fastest way to lose
        credibility with the kind of buyer this site is written for.
      </p>
    </>
  );
}
