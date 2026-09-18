import { BrandImage, getOptionalBrandImage } from "@/components/ui/brand-image";
import { cn } from "@/lib/utils";

/**
 * A photograph sitting behind a section's content rather than beside it.
 *
 * Used where a full-bleed band would be wrong: on a page whose job is a form,
 * a large image between the headline and the first field pushes the thing the
 * visitor came for below the fold. The backdrop adds the same material quality
 * without costing any vertical space.
 *
 * Two layers do the work — the image at low opacity, then a scrim that returns
 * the side carrying the text to something close to the raw surface colour. The
 * scrim is the part that matters: at full strength an image behind body copy
 * will quietly drag it under 4.5:1, and nobody notices until someone measures.
 * `npm run verify:contrast` is that measurement; run it after changing
 * `opacity` or `from`.
 *
 * Renders nothing until the asset exists, so a page can reserve the slot while
 * the photograph is still unbuilt.
 */
export function SectionBackdrop({
  name,
  /** Which side the image is allowed to show through. Text goes on the other. */
  side = "right",
  /** Token the scrim resolves from — must match the section's own surface. */
  from = "var(--color-canvas)",
  /** Low by default. Raise only with a contrast run to back it up. */
  opacity = 0.22,
  className,
}: {
  name: string;
  side?: "left" | "right" | "center" | "both";
  from?: string;
  opacity?: number;
  className?: string;
}) {
  const asset = getOptionalBrandImage(name);
  if (!asset) return null;

  const scrim =
    side === "center"
      ? `radial-gradient(ellipse 75% 65% at 50% 50%, color-mix(in srgb, ${from} 35%, transparent) 0%, ${from} 100%)`
      : side === "both"
        ? `linear-gradient(to bottom, ${from} 0%, color-mix(in srgb, ${from} 60%, transparent) 40%, color-mix(in srgb, ${from} 60%, transparent) 60%, ${from} 100%)`
        : `linear-gradient(${side === "right" ? "to right" : "to left"}, ${from} 0%, color-mix(in srgb, ${from} 88%, transparent) 42%, color-mix(in srgb, ${from} 62%, transparent) 100%)`;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {/* Opacity on a wrapper rather than on BrandImage, which takes class
          names but not a style object. */}
      <div className="absolute inset-0" style={{ opacity }}>
        <BrandImage
          name={asset}
          alt=""
          fill
          sizes="100vw"
          imgClassName="object-cover"
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background: scrim,
        }}
      />
    </div>
  );
}
