import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  href: string;
}

/**
 * Breadcrumbs.
 *
 * Rendered as a nav/ol so assistive technology announces the hierarchy, with
 * the current page marked and not linked. The matching BreadcrumbList schema
 * is emitted separately by the page using `breadcrumbSchema()`.
 */
export function Breadcrumb({
  crumbs,
  className,
}: {
  crumbs: Crumb[];
  className?: string;
}) {
  if (crumbs.length < 2) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.8125rem]">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex min-w-0 items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-ink-subtle"
                />
              ) : null}
              {isLast ? (
                <span aria-current="page" className="truncate text-ink-muted">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="truncate text-ink-subtle underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
