import Image from "next/image";
import { Button } from "@/components/ui/button";
import { revealProps } from "@/lib/reveal";
import { HeroScene } from "@/components/visuals/hero-scene";
import { AmbientColorField } from "@/components/visuals/alchemy-core";
import { IllustrativeNote } from "@/components/ui/brand-image";
import { PRIMARY_CTA, SECONDARY_CTA } from "@/config/site";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";

/**
 * Homepage hero.
 *
 * Neutral ground, colour introduced deliberately: three words in the headline
 * carry an accent each, the core behind the composition holds the full
 * palette, and four barely-visible colour fields keep the white from reading
 * as flat. Everything else is near-black on warm white.
 *
 * The primary call to action is black rather than an accent — the accent is
 * reserved for what a section is *about*, and every service page reclaims it.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <AmbientColorField className="top-0 h-[52rem]" />
      <SectionBackdrop
        name="plate-bench-aluminium"
        from="var(--color-canvas)"
        opacity={0.14}
        side="both"
      />
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="container-page relative pb-16 pt-8 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-12">
        {/* Background visual positioned in the open negative space on the right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 right-[-8%] sm:-top-8 sm:right-[-4%] lg:-top-12 lg:right-[-2%] xl:right-[1%] z-0 w-[290px] sm:w-[400px] md:w-[480px] lg:w-[560px] xl:w-[620px] aspect-square select-none"
        >
          <div
            className="relative size-full opacity-40 sm:opacity-55 lg:opacity-90 transition-opacity duration-700 animate-in fade-in zoom-in-95 duration-1000"
            style={{
              maskImage:
                "radial-gradient(circle at 50% 50%, #000 40%, rgba(0,0,0,0.85) 60%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(circle at 50% 50%, #000 40%, rgba(0,0,0,0.85) 60%, transparent 75%)",
            }}
          >
            <Image
              src="/images/hero/hero-alchemy-art.jpg"
              alt="Digital Alchemy AI network core visual"
              fill
              priority
              sizes="(max-width: 640px) 290px, (max-width: 1024px) 480px, 620px"
              className="object-contain mix-blend-multiply"
            />
          </div>
        </div>

        <div className="relative z-10">
          <div className="max-w-3xl lg:max-w-4xl">
            <h1
              {...revealProps(30, 16)}
              className="text-[2.125rem] leading-[1.06] tracking-[-0.035em] sm:text-[2.85rem] sm:leading-[1.02] md:text-display-1 text-ink font-medium"
            >
              We engineer{" "}
              <span className="text-gradient-apple font-semibold">AI-ready products</span> &amp;{" "}
              <span className="text-gradient-siri font-semibold">intelligent automations</span> that scale.
            </h1>

            <p
              {...revealProps(90, 16)}
              className="mt-5 sm:mt-6 max-w-2xl text-base sm:text-lede text-ink-muted leading-relaxed"
            >
              From custom AI agents and autonomous operational workflows to AI-ready SaaS platforms, web applications, and compound growth engines — we build high-performance digital systems that give modern companies an unfair advantage.
            </p>

            <div
              {...revealProps(140, 14)}
              className="mt-6 sm:mt-7 flex flex-wrap items-center gap-1.5 sm:gap-2"
            >
              <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface/85 px-2.5 py-1 text-[0.72rem] sm:text-[0.75rem] font-medium text-ink-muted shadow-xs">
                <span className="size-1.5 rounded-full bg-blue-500" />
                AI Automation &amp; Agents
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface/85 px-2.5 py-1 text-[0.72rem] sm:text-[0.75rem] font-medium text-ink-muted shadow-xs">
                <span className="size-1.5 rounded-full bg-purple-500" />
                AI-Ready SaaS Platforms
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface/85 px-2.5 py-1 text-[0.72rem] sm:text-[0.75rem] font-medium text-ink-muted shadow-xs">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Autonomous Workflows
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface/85 px-2.5 py-1 text-[0.72rem] sm:text-[0.75rem] font-medium text-ink-muted shadow-xs">
                <span className="size-1.5 rounded-full bg-amber-500" />
                Full-Stack Engineering
              </span>
            </div>

            <div
              {...revealProps(180, 16)}
              className="mt-7 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <Button href={PRIMARY_CTA.href} size="lg" withArrow className="w-full sm:w-auto justify-center">
                {PRIMARY_CTA.label}
              </Button>
              <Button href={SECONDARY_CTA.href} variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
                Explore our work
              </Button>
            </div>

            {/*
              Markets, stated precisely. New Delhi is the only office; every
              other market is served remotely, and the wording says so.
            */}
            <p
              {...revealProps(240, 12)}
              className="mt-7 sm:mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[0.6875rem] sm:text-[0.75rem] uppercase tracking-[0.1em] sm:tracking-[0.12em] text-ink-subtle"
            >
              <span>Based in New Delhi</span>
              <span aria-hidden="true" className="text-hairline-strong">
                /
              </span>
              <span>Working with clients worldwide</span>
            </p>
          </div>

          <div
            {...revealProps(120, 24)}
            className="relative mt-10 lg:mt-14"
          >
            <HeroScene />
            {/*
              The screens carry invented revenue, headcount and customer
              figures. Everywhere else the site refuses to show numbers it
              cannot evidence, so this says plainly what it is.
            */}
            <IllustrativeNote className="mt-5 text-center" />
          </div>
        </div>
      </div>
    </section>
  );
}
