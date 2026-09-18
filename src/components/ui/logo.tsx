import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import logoAssets from "@/content/generated/logo.json";

/**
 * Brand lockup.
 *
 * The mark is the company's own logo — a circuit-etched hand holding three
 * cubes — extracted from the supplied JPEG and keyed to transparency by
 * `scripts/build-logo.mjs`. It arrived on flat white, which would have shown
 * as a card on every surface that is not pure white.
 *
 * The wordmark stays live type rather than part of the image. The supplied
 * artwork sets it in navy, which disappears on a dark surface, and raster text
 * at 17px is soft on any display. Setting it in the site's own display face
 * keeps it crisp, recolourable, selectable and searchable.
 *
 * The mark is wider than it is tall, so it is sized by height. Callers that
 * want it smaller should pass a height (`h-6`), not a square (`size-6`).
 */

const MARK = logoAssets["logo-mark"];

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src={MARK.src}
      width={MARK.width}
      height={MARK.height}
      alt=""
      aria-hidden="true"
      priority
      // Without this the optimiser serves a 640px variant for a mark that is
      // never drawn wider than about 40 CSS pixels.
      sizes="48px"
      className={cn("h-8 w-auto shrink-0", className)}
    />
  );
}

export function Logo({
  className,
  href = "/",
  showWordmark = true,
  label = "The Digital Alchemy",
}: {
  className?: string;
  href?: string | null;
  showWordmark?: boolean;
  label?: string;
}) {
  const inner = (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-ink",
        "transition-opacity duration-[var(--duration-fast)] hover:opacity-80",
        className,
      )}
    >
      <LogoMark />
      {showWordmark ? (
        <span className="font-display text-[1.0625rem] font-semibold leading-none tracking-[-0.03em]">
          {label}
        </span>
      ) : null}
    </span>
  );

  if (!href) return inner;

  return (
    <Link
      href={href}
      className="rounded-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
      aria-label={`${label} — home`}
    >
      {inner}
    </Link>
  );
}
