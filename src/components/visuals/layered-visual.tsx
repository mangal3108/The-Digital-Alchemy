"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery, usePrefersMotion } from "@/lib/use-media-query";
import {
  BrandImage,
  IllustrativeNote,
  isIllustrative,
  type BrandImageName,
} from "@/components/ui/brand-image";

/**
 * A brand image composed into the page rather than parked in a card.
 *
 * Three things separate this from `<img>` in a rounded rectangle:
 *
 *  1. **The edge is feathered.** A mask fades the image into the page
 *     background, so it reads as part of the layout instead of a pasted
 *     photograph. This is the single biggest difference between a site that
 *     looks designed and one that looks assembled.
 *  2. **Live UI sits in front of it.** The overlay is real markup from the
 *     design system — same tokens, same type — at a different parallax depth,
 *     which ties the rendered image to the interface around it.
 *  3. **The layers separate on scroll.** A few pixels of differential movement
 *     is enough to read as depth; more than that reads as a gimmick.
 *
 * Degrades in order: no parallax under reduced motion, on coarse pointers, or
 * on narrow viewports — the composition still holds, it just stops moving.
 */

export type MaskVariant = "feather" | "vignette" | "bleed-right" | "none";

const MASKS: Record<MaskVariant, string | undefined> = {
  // Soft on all four sides — for images sitting inside a content column.
  feather:
    "radial-gradient(115% 115% at 50% 45%, #000 52%, rgba(0,0,0,0.85) 72%, transparent 97%)",
  // Stronger centre focus, used on dark bands.
  vignette:
    "radial-gradient(85% 95% at 50% 50%, #000 45%, rgba(0,0,0,0.72) 70%, transparent 96%)",
  // Runs off the right edge of the viewport.
  "bleed-right":
    "linear-gradient(to right, transparent 0%, #000 14%, #000 100%)",
  none: undefined,
};

export function LayeredVisual({
  name,
  alt,
  overlay,
  overlayClassName,
  mask = "feather",
  className,
  imageClassName,
  priority,
  sizes,
  /** Pixels of differential travel between the image and the overlay. */
  depth = 18,
  showIllustrativeNote = true,
}: {
  name: BrandImageName;
  alt: string;
  overlay?: React.ReactNode;
  overlayClassName?: string;
  mask?: MaskVariant;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  depth?: number;
  showIllustrativeNote?: boolean;
}) {
  const rootRef = React.useRef<HTMLElement>(null);
  // Subscribed rather than read once, so resizing across the breakpoint or
  // switching to a mouse picks the enhancement up.
  const motionOk = usePrefersMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const wide = useMediaQuery("(min-width: 768px)");
  const parallax = motionOk && fine && wide;

  React.useEffect(() => {
    if (!parallax) return;
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    let queued = false;

    const update = () => {
      queued = false;
      const rect = root.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      // -1 when the element is entering from below, +1 when leaving upward.
      const progress = Math.max(
        -1,
        Math.min(1, (rect.top + rect.height / 2 - viewport / 2) / viewport),
      );
      root.style.setProperty("--layer-a", `${(progress * depth).toFixed(2)}px`);
      root.style.setProperty(
        "--layer-b",
        `${(progress * -depth * 0.85).toFixed(2)}px`,
      );
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [parallax, depth]);

  const maskImage = MASKS[mask];
  const needsNote = showIllustrativeNote && isIllustrative(name);

  return (
    <figure
      ref={rootRef}
      className={cn("relative", className)}
      style={
        { "--layer-a": "0px", "--layer-b": "0px" } as React.CSSProperties
      }
    >
      <div className="relative">
        {/* Base image layer */}
        <div
          className={cn("relative overflow-hidden", imageClassName)}
          style={{
            transform: "translate3d(0, var(--layer-a), 0)",
            willChange: parallax ? "transform" : undefined,
            ...(maskImage
              ? {
                  maskImage,
                  WebkitMaskImage: maskImage,
                }
              : {}),
          }}
        >
          <BrandImage
            name={name}
            alt={alt}
            priority={priority}
            sizes={sizes ?? "(max-width: 768px) 100vw, 55vw"}
          />

          {/* Faint measure grid, tying the render to the interface language. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(var(--color-ink)_1px,transparent_1px),linear-gradient(90deg,var(--color-ink)_1px,transparent_1px)] [background-size:44px_44px]"
          />
        </div>

        {/* Live interface layer, moving against the image */}
        {overlay ? (
          <div
            className={cn("absolute", overlayClassName)}
            style={{
              transform: "translate3d(0, var(--layer-b), 0)",
              willChange: parallax ? "transform" : undefined,
            }}
          >
            {overlay}
          </div>
        ) : null}
      </div>

      {needsNote ? (
        <figcaption className="mt-3">
          <IllustrativeNote />
        </figcaption>
      ) : null}
    </figure>
  );
}
