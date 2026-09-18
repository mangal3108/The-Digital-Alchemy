import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { revealProps } from "@/lib/reveal";
import { cn } from "@/lib/utils";
import { BrandImage, type BrandImageName } from "@/components/ui/brand-image";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";

/**
 * Shared hero for interior pages.
 *
 * One component so every service, industry and market page has the same
 * heading hierarchy, breadcrumb placement and rhythm — which is what stops
 * forty pages drifting into forty slightly different layouts.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs,
  primaryCta,
  secondaryCta,
  visual,
  bleedImage,
  bleedImageAlt = "",
  backdropImage,
  backdropOpacity = 0.16,
  className,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  crumbs?: Crumb[];
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  visual?: React.ReactNode;
  /**
   * Renders the hero as a full-bleed band instead of two columns: copy centred,
   * photograph edge to edge beneath it. Matches the homepage feature bands, and
   * suits a single strong image far better than sitting it in a side column at
   * half width.
   */
  bleedImage?: BrandImageName;
  bleedImageAlt?: string;
  /** Atmospheric background photograph layer across the hero. */
  backdropImage?: BrandImageName;
  backdropOpacity?: number;
  className?: string;
}) {
  const bleed = Boolean(bleedImage);
  return (
    <section className={cn("relative overflow-hidden", className)}>
      {backdropImage ? (
        <SectionBackdrop
          name={backdropImage}
          from="var(--color-canvas)"
          opacity={backdropOpacity}
          side="right"
        />
      ) : null}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[32rem]"
        style={{
          background:
            "radial-gradient(58% 46% at 78% 20%, color-mix(in srgb, var(--color-accent) 12%, transparent) 0%, transparent 72%)",
        }}
      />

      <div className="container-page relative pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20">
        {crumbs?.length ? (
          <Breadcrumb crumbs={crumbs} className="mb-8" />
        ) : null}

        <div
          className={cn(
            "grid gap-10",
            visual && !bleed
              ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14"
              : null,
          )}
        >
          <div
            className={cn(
              bleed
                ? "mx-auto max-w-3xl text-center"
                : visual
                  ? "max-w-2xl"
                  : "max-w-3xl",
            )}
          >
            {eyebrow ? (
              <p {...revealProps()} className="eyebrow">
                {eyebrow}
              </p>
            ) : null}

            <h1
              {...revealProps(50, 16)}
              className={cn("text-display-2 text-ink", eyebrow && "mt-4")}
            >
              {title}
            </h1>

            {lede ? (
              <p
                {...revealProps(110, 16)}
                className={cn(
                  "mt-5 text-lede text-ink-muted",
                  bleed ? "mx-auto max-w-xl" : "max-w-xl",
                )}
              >
                {lede}
              </p>
            ) : null}

            {primaryCta || secondaryCta ? (
              <div
                {...revealProps(170, 16)}
                className={cn(
                  "mt-8 flex flex-wrap items-center gap-3",
                  bleed && "justify-center",
                )}
              >
                {primaryCta ? (
                  <Button href={primaryCta.href} size="lg" withArrow>
                    {primaryCta.label}
                  </Button>
                ) : null}
                {secondaryCta ? (
                  <Button
                    href={secondaryCta.href}
                    variant="secondary"
                    size="lg"
                  >
                    {secondaryCta.label}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>

          {visual && !bleed ? (
            <div {...revealProps(120, 22)} className="relative">
              {visual}
            </div>
          ) : null}
        </div>
      </div>

      {bleedImage ? (
        <div className="relative h-[clamp(15rem,32vw,28rem)] w-full overflow-hidden">
          <BrandImage
            name={bleedImage}
            alt={bleedImageAlt}
            fill
            priority
            sizes="100vw"
            imgClassName="object-cover"
          />
          {/* Subtle top edge line */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-hairline-strong/40 to-transparent"
          />
          {/* Dissolves into whatever section follows rather than ending on a
              hard edge. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{
              background:
                "linear-gradient(to top, var(--color-canvas) 0%, color-mix(in srgb, var(--color-canvas) 60%, transparent) 50%, transparent 100%)",
            }}
          />
        </div>
      ) : null}
    </section>
  );
}
