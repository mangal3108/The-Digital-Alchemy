"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { revealProps } from "@/lib/reveal";
import {
  TECH_CATEGORIES,
  getTechnologiesByCategory,
  technologies,
  type TechCategory,
} from "@/content/technology";

const CATEGORY_ORDER: TechCategory[] = [
  "frontend",
  "backend",
  "mobile",
  "data",
  "cloud",
  "design",
  "cms",
  "marketing",
  "analytics",
];

/**
 * Technology ecosystem.
 *
 * Deliberately not a logo marquee. Selecting a category explains what we use
 * each tool *for*, which is the only part a prospective client can actually
 * evaluate. Keyboard and pointer reach the same information — the detail panel
 * is driven by selection, not hover.
 */
export function TechnologySection() {
  const [category, setCategory] = React.useState<TechCategory>("frontend");
  const [activeKey, setActiveKey] = React.useState<string | null>(null);

  const items = getTechnologiesByCategory(category);
  const active =
    technologies.find((tech) => tech.key === activeKey) ?? items[0] ?? null;

  return (
    <section id="technology" data-surface="dark" className="relative bg-canvas text-ink">
      {/*
        The photograph sits behind the interaction rather than replacing it.
        The category tabs and the detail panel are the point of this section —
        they explain what each tool is *for*, which a logo marquee cannot — so
        the image is atmosphere underneath, not a thing to look at.

        Two layers do the work: the image at low opacity, then a scrim that
        keeps the left side, where all the text sits, close to the raw surface
        colour. Contrast is measured in `scripts/verify-contrast.mjs` rather
        than eyeballed, because a backdrop that quietly drags body text under
        4.5:1 is exactly the kind of regression nobody notices.
      */}
      <SectionBackdrop
        name="section-technology"
        from="var(--color-canvas)"
        opacity={0.22}
      />

      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="container-page relative section-y">
        <div {...revealProps()} className="max-w-2xl">
          <p className="eyebrow">Technology</p>
          <h2 className="mt-3.5 text-display-3 text-ink">
            The tools, and what we use them for.
          </h2>
          <p className="mt-4 text-lede text-ink-muted">
            We are not attached to any of these. They are chosen per project on
            what the work needs and what your team can maintain after we hand
            it over.
          </p>
        </div>

        {/* Category tabs */}
        <div
          {...revealProps(80)}
          role="tablist"
          aria-label="Technology categories"
          className="mt-9 flex flex-wrap gap-1.5"
        >
          {CATEGORY_ORDER.map((key) => {
            const selected = key === category;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  setCategory(key);
                  setActiveKey(null);
                }}
                className={cn(
                  "h-9 rounded-full px-3.5 text-[0.8125rem] font-medium",
                  "transition-colors duration-[var(--duration-fast)] ease-standard",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  selected
                    ? "bg-accent text-on-accent"
                    : "border border-hairline text-ink-muted hover:border-hairline-strong hover:text-ink",
                )}
              >
                {TECH_CATEGORIES[key].label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          {/* Grid */}
          <div {...revealProps(120)}>
            <p className="text-[0.875rem] text-ink-muted">
              {TECH_CATEGORIES[category].blurb}
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {items.map((tech) => {
                const selected = active?.key === tech.key;
                return (
                  <li key={tech.key}>
                    <button
                      type="button"
                      onClick={() => setActiveKey(tech.key)}
                      onMouseEnter={() => setActiveKey(tech.key)}
                      onFocus={() => setActiveKey(tech.key)}
                      aria-pressed={selected}
                      className={cn(
                        "flex h-full w-full min-h-14 items-center gap-2.5 rounded-md border px-3 py-2.5 text-left",
                        "transition-[border-color,background-color,transform] duration-[var(--duration-fast)] ease-standard",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                        selected
                          ? "border-accent bg-accent-soft"
                          : "border-hairline bg-surface/40 hover:border-hairline-strong",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-2 shrink-0 rounded-[3px]",
                          selected ? "bg-accent" : "bg-ink-subtle",
                        )}
                      />
                      <span className="text-[0.875rem] font-medium text-ink">
                        {tech.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Detail */}
          <div
            {...revealProps(180)}
            className="rounded-lg border border-hairline bg-surface/50 p-6"
          >
            {active ? (
              <>
                <p className="eyebrow">
                  {TECH_CATEGORIES[active.category].label}
                </p>
                <h3 className="mt-3 text-title text-ink">{active.name}</h3>
                <p
                  key={active.key}
                  className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted"
                >
                  {active.usedFor}
                </p>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
