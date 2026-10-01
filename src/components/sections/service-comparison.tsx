import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Section, SectionHeading } from "@/components/ui/section-heading";
import { getService, services, serviceHref } from "@/content/services";
import { comparisonSets, getComparisonFor } from "@/content/services/comparisons";
import { revealProps } from "@/lib/reveal";
import { cn } from "@/lib/utils";

/*
 * Checked when this module loads, which includes the production build. The
 * brief's rule is that *every* service page says how it differs from its
 * closest sibling, so a service with no box — or with two — fails the build
 * rather than quietly shipping a page without one.
 */
for (const service of services) {
  const shownOn = comparisonSets.filter((set) => set.showOn.includes(service.slug));
  if (shownOn.length !== 1) {
    throw new Error(
      `Service "${service.slug}" appears in ${shownOn.length} comparison boxes; it needs exactly one.`,
    );
  }
}
for (const set of comparisonSets) {
  for (const slug of [...set.showOn, ...set.rows.map((row) => row.slug)]) {
    if (!getService(slug)) throw new Error(`Comparison "${set.id}" names unknown service "${slug}".`);
  }
  for (const slug of set.showOn) {
    if (!set.rows.some((row) => row.slug === slug)) {
      throw new Error(`Comparison "${set.id}" is shown on "${slug}" but has no row for it.`);
    }
  }
}

/** "Which one do I need?" for one service page, with that service marked. */
export function ServiceComparison({ slug }: { slug: string }) {
  const set = getComparisonFor(slug);
  if (!set) return null;

  return (
    <Section id="which-one">
      <SectionHeading eyebrow="Which one do I need?" title={set.title} />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {set.rows.map((row, index) => {
          const service = getService(row.slug)!;
          const current = row.slug === slug;
          return (
            <li
              key={row.slug}
              {...revealProps(index * 50)}
              className={cn(
                "flex flex-col rounded-lg border p-6",
                current ? "border-accent bg-surface" : "border-hairline bg-canvas",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-ink">
                  {service.name}
                </h3>
                {current ? (
                  <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-[0.75rem] font-medium text-on-accent">
                    This page
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-[1rem] leading-relaxed text-ink">
                Choose this if {row.chooseIf}
              </p>
              <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                <span className="font-medium text-ink">For example: </span>
                {row.example}
              </p>
              {current ? null : (
                <Link
                  href={serviceHref(row.slug)}
                  className="group mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent-text transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
                >
                  About {service.name}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
