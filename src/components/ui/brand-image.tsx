import Image from "next/image";
import manifest from "@/content/generated/brand-images.json";
import { cn } from "@/lib/utils";

/**
 * Curated brand imagery.
 *
 * Reads dimensions and a blur placeholder from the build-time manifest, so
 * every image reserves its own space and nothing shifts on load. Callers name
 * an asset rather than a path — a missing key is a type error, not a broken
 * image in production.
 */

export type BrandImageName = keyof typeof manifest;

type ManifestEntry = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  illustrative: boolean;
};

const assets = manifest as Record<string, ManifestEntry>;

/**
 * Looks an asset up by name, returning undefined when it has not been built.
 *
 * Lets a page reserve its image slot before the photograph exists. The brief
 * (`docs/image-brief.html`) lists assets that are registered in the build but
 * not yet generated; wiring those in with a literal name would be a type error
 * today and a silent 404 the moment the name were widened to `string`.
 *
 * With this, the slot renders nothing until the file lands in `/images` and
 * `npm run build:images` adds it to the manifest — at which point it appears
 * with no further code change.
 */
export function getOptionalBrandImage(
  name: string,
): BrandImageName | undefined {
  return name in assets ? (name as BrandImageName) : undefined;
}

export function getBrandImage(name: BrandImageName): ManifestEntry {
  return assets[name as string]!;
}

/** True when the asset's screens contain invented figures. */
export function isIllustrative(name: BrandImageName): boolean {
  return assets[name as string]?.illustrative ?? false;
}

export function BrandImage({
  name,
  alt,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority,
  className,
  imgClassName,
  fill,
}: {
  name: BrandImageName;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Fill the parent instead of using the intrinsic aspect ratio. */
  fill?: boolean;
}) {
  const asset = getBrandImage(name);

  if (fill) {
    return (
      <Image
        src={asset.src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={asset.blurDataURL}
        className={cn("object-cover", imgClassName)}
      />
    );
  }

  return (
    <Image
      src={asset.src}
      alt={alt}
      width={asset.width}
      height={asset.height}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={asset.blurDataURL}
      className={cn("h-auto w-full", className, imgClassName)}
    />
  );
}

/**
 * Marks imagery whose on-screen figures are invented.
 *
 * The rest of the site refuses to show numbers it cannot evidence. These
 * product renders contain revenue and user counts that are not ours, so they
 * are labelled wherever they appear at a size where the figures are legible —
 * the alternative is a visitor reading them as our results.
 */
export function IllustrativeNote({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-subtle",
        className,
      )}
    >
      Illustrative interface — not client data
    </p>
  );
}
