import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";

import { TabletFrame } from "@/components/visuals/devices";
import { revealProps } from "@/lib/reveal";
import { markets } from "@/content/locations";
import { processStages } from "@/content/process";
import { getTestimonials } from "@/lib/content";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import captures from "@/content/generated/ui-captures.json";

/**
 * The product, shown rather than described.
 *
 * Replaces a canvas of drawn wireframe cards. Those were placeholder art: they
 * illustrated the *idea* of design work without showing anything that exists,
 * which is precisely what made the page read as unfinished.
 *
 * The screen here is a real screenshot of the running site, taken by
 * `npm run capture:ui`. It is the industries gallery because that is the most
 * visually dense page we have — and because a product shot should show the
 * product doing something, not its quietest screen.
 *
 * Composition follows the Apple pattern the brief asked for: one object,
 * centred, generous space around it, nothing competing. The supporting row
 * underneath is deliberately quiet — journey, reach and proof in one line each,
 * each linking to the section that treats it properly.
 */

const SHOWCASE = captures["tablet-industries" as keyof typeof captures];

export async function ProductShowcase() {
  // Real testimonials only. The section renders whatever exists and says
  // nothing when there is nothing — inventing social proof is the one thing
  // this site refuses to do.
  const testimonials = await getTestimonials(2);

  return (
    <section className="relative overflow-hidden border-y border-hairline bg-surface">
      <SectionBackdrop name="section-ideas-canvas" from="var(--color-surface)" opacity={0.16} side="left" />
      <div className="container-page relative section-y">
        <div {...revealProps()} className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[0.8125rem] font-medium text-blue-600 shadow-xs">
            <span className="size-1.5 rounded-full bg-blue-500" />
            AI-Ready Architecture
          </div>
          <h2 className="mt-2 text-display-2 text-ink">
            One team, one system, <span className="text-gradient-apple font-semibold">every surface</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lede text-ink-muted">
            Strategy, autonomous workflows, design and cloud engineering on a single canvas. From custom AI tooling to production digital experiences.
          </p>
        </div>

        {/* ---- The object ---- */}
        <div
          {...revealProps(100, 24)}
          className="relative mx-auto mt-12 w-full max-w-4xl"
        >
          <TabletFrame>
            {SHOWCASE ? (
              <Image
                src={SHOWCASE.src}
                alt="The industries section of this site, running on a tablet"
                width={SHOWCASE.width}
                height={SHOWCASE.height}
                sizes="(max-width: 1024px) 100vw, 880px"
                className="h-full w-full object-cover object-top"
              />
            ) : null}
          </TabletFrame>
        </div>

        {/* ---- Three quiet claims, each linking to where it is evidenced ---- */}
        <div className="mt-16 grid gap-10 border-t border-hairline pt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* Journey */}
          <div {...revealProps()}>
            <p className="eyebrow">The journey</p>
            <h3 className="mt-3 text-title text-ink">
              Six stages, start to scale.
            </h3>
            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
              {processStages[0]?.title} through to {processStages.at(-1)?.title}
              {" — "}the same shape whether it is a platform or a growth
              retainer.
            </p>
            <Link
              href="/#process"
              className="group mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent-text transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
            >
              See how we work
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-[var(--duration-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
              />
            </Link>
          </div>

          {/* Reach — stated precisely, because only one of these is an office */}
          <div {...revealProps(80)}>
            <p className="eyebrow">Where it runs</p>
            <h3 className="mt-3 text-title text-ink">
              {markets.length} markets, one studio.
            </h3>
            <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
              {markets.map((market) => market.country).join(", ")}. New Delhi is
              the only office; everywhere else is served remotely, which we would
              rather say than imply otherwise.
            </p>
            <Link
              href="/locations"
              className="group mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent-text transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
            >
              Markets we serve
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 transition-transform duration-[var(--duration-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
              />
            </Link>
          </div>

          {/* Proof */}
          <div {...revealProps(160)} className="sm:col-span-2 lg:col-span-1">
            <p className="eyebrow">In their words</p>
            {testimonials.length ? (
              <ul className="mt-3 space-y-5">
                {testimonials.map((testimonial) => (
                  <li key={testimonial.id}>
                    <Quote
                      aria-hidden="true"
                      className="size-4 text-accent"
                    />
                    <blockquote className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                      {testimonial.quote}
                    </blockquote>
                    <p className="mt-2 text-[0.8125rem] text-ink-subtle">
                      {testimonial.authorName}
                      {testimonial.position ? `, ${testimonial.position}` : ""}
                      {testimonial.company ? `, ${testimonial.company}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <h3 className="mt-3 text-title text-ink">
                  Nothing published yet.
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                  Client quotes appear here once they have been given and
                  approved. We would rather show none than write our own.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
