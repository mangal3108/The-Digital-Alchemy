"use client";

import * as React from "react";

import { BrandImage, type BrandImageName } from "@/components/ui/brand-image";
import { processStages } from "@/content/process";
import type { Accent } from "@/content/accents";
import { cn } from "@/lib/utils";
import { useMediaQuery, usePrefersMotion } from "@/lib/use-media-query";

/**
 * The six stages, told as a scroll narrative rather than a row of cards.
 *
 * The brand idea is a sequence — idea, strategy, design, technology, launch,
 * growth — and a six-column grid renders a sequence as six things happening at
 * once. Here the copy scrolls while one visual stays pinned and changes beneath
 * it, so the page moves through the process at the reader's pace instead of
 * presenting it as a diagram.
 *
 * WHY THE COLOUR RUNS COOL TO WARM
 * Blue through to tangerine, in order. The accent is not decoration on these
 * six: it encodes where you are. By the time the visual is warm you are in
 * growth, and that is legible before you have read a word.
 *
 * WHY NO ANIMATION LIBRARY
 * An IntersectionObserver sets an index; everything else is a CSS opacity
 * transition. Nothing is tweened per frame, so there is no scroll handler on
 * the main thread and nothing to jank.
 *
 * DEGRADATION
 * The pinned visual applies from `lg` up. Below that, and for anyone who
 * prefers reduced motion, every stage renders in document order with its own
 * image inline — the same content, read rather than travelled through. The copy
 * is in the DOM in order either way, so assistive technology is unaffected by
 * which path renders.
 */

/** Each stage's visual and colour. Deliberate pairings, not a cycle. */
const STAGE_VISUALS: { image: BrandImageName; accent: Accent }[] = [
  // Discover — looking very closely at the substrate before committing.
  { image: "object-silicon-wafer", accent: "blue" },
  // Strategise — deciding which parts fit where, one lifted clear.
  { image: "object-machined-forms", accent: "indigo" },
  // Design — five iterations of one part, rough through to resolved.
  { image: "service-product-design", accent: "violet" },
  // Build — the billet actually being cut.
  { image: "service-custom-software-development", accent: "mint" },
  // Launch — the unit going into the rack on its rails.
  { image: "service-saas-development", accent: "coral" },
  // Scale — the same thing many times over, running.
  { image: "service-cloud-solutions", accent: "tangerine" },
];

export function ProcessNarrative() {
  const [active, setActive] = React.useState(0);
  const stageRefs = React.useRef<(HTMLElement | null)[]>([]);

  // Subscribed, not read once: a window resized across the breakpoint has to
  // pick the enhancement up, and an effect with empty deps never would.
  const wide = useMediaQuery("(min-width: 1024px)");
  const motionOk = usePrefersMotion();
  const pinned = wide && motionOk;

  React.useEffect(() => {
    if (!pinned) return;
    const nodes = stageRefs.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;

    // A band across the middle of the viewport. Whichever stage occupies it is
    // the one being read, which is steadier than measuring distance to centre
    // on every scroll event.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = nodes.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [pinned]);

  const current = STAGE_VISUALS[active] ?? STAGE_VISUALS[0]!;

  return (
    <section
      id="process"
      data-surface="dark"
      data-accent={current.accent}
      // Exposed so `scripts/verify-narrative.mjs` can assert which branch
      // rendered. Cheaper than inferring it from the presence of a child, and
      // it makes a failed enhancement obvious in devtools.
      data-pinned={pinned ? "true" : "false"}
      className="relative bg-ink-900"
    >
      <div className="container-page section-y">
        <div className="max-w-2xl">
          <p className="eyebrow text-accent-text">How we work</p>
          <h2 className="mt-3.5 text-display-3 text-ink">
            Six stages, and what you get from each.
          </h2>
          <p className="mt-4 max-w-xl text-lede text-ink-muted">
            The same shape whether we are building a SaaS platform or running a
            growth retainer. What changes is the depth of each stage, not the
            order.
          </p>
        </div>

        <div
          className={cn(
            "mt-14",
            pinned &&
              "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16",
          )}
        >
          {/* ---- The copy, in document order ---- */}
          <ol className="relative">
            {processStages.map((stage, index) => {
              const visual = STAGE_VISUALS[index]!;
              const isActive = pinned && index === active;
              return (
                <li
                  key={stage.step}
                  data-accent={visual.accent}
                  ref={(node) => {
                    stageRefs.current[index] = node;
                  }}
                  className={cn(
                    "relative border-t border-hairline py-10",
                    pinned && "lg:min-h-[68vh] lg:border-t-0 lg:py-[18vh]",
                  )}
                >
                  <div
                    className={cn(
                      "transition-opacity duration-[var(--duration-slow)] ease-standard",
                      pinned && !isActive && "lg:opacity-35",
                    )}
                  >
                    <p className="numeric font-mono text-[0.6875rem] tracking-[0.16em] text-accent-text">
                      {stage.step}
                    </p>
                    <h3 className="mt-3 text-display-3 text-ink">
                      {stage.title}
                    </h3>
                    <p className="mt-3 text-lede text-ink-muted">
                      {stage.summary}
                    </p>
                    <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ink-muted">
                      {stage.detail}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                      {stage.outputs.map((output) => (
                        <li
                          key={output}
                          className="flex items-center gap-2 text-[0.8125rem] text-ink-subtle"
                        >
                          <span
                            aria-hidden="true"
                            className="size-1.5 shrink-0 rounded-full bg-accent"
                          />
                          {output}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Narrow screens get the image inline, in sequence. */}
                  {!pinned ? (
                    <div className="relative mt-7 aspect-[4/3] overflow-hidden rounded-lg">
                      <BrandImage
                        name={visual.image}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        imgClassName="object-cover"
                      />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>

          {/* ---- The pinned visual ---- */}
          {pinned ? (
            <div className="hidden lg:block">
              <div className="sticky top-24 h-[70vh]">
                <div className="relative h-full overflow-hidden rounded-lg">
                  {STAGE_VISUALS.map((visual, index) => (
                    <div
                      key={visual.image}
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-0 transition-opacity duration-[var(--duration-slow)] ease-standard",
                        index === active ? "opacity-100" : "opacity-0",
                      )}
                    >
                      <BrandImage
                        name={visual.image}
                        alt=""
                        fill
                        sizes="50vw"
                        imgClassName="object-cover"
                      />
                    </div>
                  ))}

                  {/* Progress rail: where you are, and how much is left. */}
                  <div
                    aria-hidden="true"
                    className="absolute bottom-5 left-5 right-5 flex gap-1.5"
                  >
                    {STAGE_VISUALS.map((visual, index) => (
                      <span
                        key={visual.image}
                        className={cn(
                          "h-0.5 flex-1 rounded-full transition-colors duration-[var(--duration-slow)]",
                          index <= active ? "bg-accent" : "bg-ink-300/25",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
