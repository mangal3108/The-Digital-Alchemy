"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ProjectCard, type ProjectCardData } from "@/components/ui/project-card";
import { PROJECT_CATEGORY_LABELS, type ProjectCategory } from "@/lib/db";

/**
 * Filterable case-study grid.
 *
 * Filtering happens client-side over an already-rendered list, so it is
 * instant and requires no round trip — the whole set is small enough that
 * paginating would be worse. The filter is a real radio group, so it is
 * keyboard-operable and announces state, and the result count is written to a
 * live region for screen readers.
 */
export function WorkGrid({
  projects,
  categories,
}: {
  projects: ProjectCardData[];
  categories: string[];
}) {
  const [active, setActive] = React.useState<string>("all");

  const filtered = React.useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((project) => project.category === active),
    [projects, active],
  );

  const options = [
    { value: "all", label: "All" },
    ...categories.map((category) => ({
      value: category,
      label:
        PROJECT_CATEGORY_LABELS[category as ProjectCategory] ?? category,
    })),
  ];

  return (
    <>
      <div
        role="radiogroup"
        aria-label="Filter work by category"
        className="flex flex-wrap gap-1.5"
      >
        {options.map((option) => {
          const selected = option.value === active;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setActive(option.value)}
              className={cn(
                "h-10 rounded-full px-4 text-[0.875rem] font-medium",
                "transition-colors duration-[var(--duration-fast)] ease-standard",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                selected
                  ? "bg-ink text-ink-inverse"
                  : "border border-hairline text-ink-muted hover:border-hairline-strong hover:text-ink",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"} shown
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      {!filtered.length ? (
        <p className="mt-10 text-center text-[0.9375rem] text-ink-muted">
          No projects in this category yet.
        </p>
      ) : null}
    </>
  );
}
