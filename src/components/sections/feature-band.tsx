import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { BrandImage, type BrandImageName } from "@/components/ui/brand-image";
import { revealProps } from "@/lib/reveal";
import { cn } from "@/lib/utils";

/**
 * A full-bleed feature band: centred copy, then a photograph edge to edge.
 *
 * This is the page's primary unit, replacing the card grids that used to carry
 * the same content. The difference is hierarchy — a photograph inside a
 * bordered card reads as a mockup, the same photograph running to the viewport
 * edge reads as a product. Size and bleed do the work that borders were doing
 * badly.
 *
 * `dark` inverts the band. A long light page flattens out, and one near-black
 * interruption every few screens is what gives it rhythm; the colour tokens
 * re-bind through `data-surface`, so nothing inside needs a dark variant.
 *
 * Accent comes from an ancestor `data-accent`, so the eyebrow, the link and the
 * rule all pick up whatever the section is about without a bespoke style.
 */
export function FeatureBand({
  eyebrow,
  title,
  body,
  image,
  href,
  linkLabel,
  secondary,
  dark,
  priority,
  imageAlt = "",
  children,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  image?: BrandImageName;
  href?: string;
  linkLabel?: string;
  secondary?: React.ReactNode;
  dark?: boolean;
  priority?: boolean;
  imageAlt?: string;
  /** Rendered under the copy, above the image. For CTAs or extra detail. */
  children?: React.ReactNode;
}) {
  return (
    <div
      data-surface={dark ? "dark" : undefined}
      className={cn(
        "relative overflow-hidden",
        dark ? "bg-ink-900" : "border-y border-hairline bg-surface",
      )}
    >
      <div
        {...revealProps()}
        className="container-page pb-10 pt-16 text-center sm:pb-12 sm:pt-20"
      >
        {eyebrow ? <p className="eyebrow text-accent-text">{eyebrow}</p> : null}
        <h2 className="mx-auto mt-3 max-w-3xl text-display-2 text-ink">
          {title}
        </h2>
        {body ? (
          <p className="mx-auto mt-4 max-w-xl text-lede text-ink-muted">{body}</p>
        ) : null}

        {href && linkLabel ? (
          <Link
            href={href}
            className="group mt-6 inline-flex items-center gap-1.5 text-[1.0625rem] font-medium text-accent-text transition-opacity duration-[var(--duration-fast)] hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
          >
            {linkLabel}
            <ArrowUpRight
              aria-hidden="true"
              className="size-4 transition-transform duration-[var(--duration-fast)] ease-standard group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
            />
          </Link>
        ) : null}

        {secondary}
        {children}
      </div>

      {image ? (
        <div className="relative h-[clamp(15rem,32vw,28rem)] w-full">
          <BrandImage
            name={image}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="100vw"
            imgClassName="object-cover"
          />
          {/* Dissolves the photograph into the band rather than ending it on a
              hard edge. Both stops read from the band's own surface token. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{
              background: dark
                ? "linear-gradient(to top, var(--color-ink-900) 0%, transparent 100%)"
                : "linear-gradient(to top, var(--color-surface) 0%, transparent 100%)",
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
