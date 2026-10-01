import Image from "next/image";
import { getLogos } from "@/content/logos";
import { clsx } from "clsx";

export interface BrandLogosProps {
  /** Array of logo slugs registered in src/content/logos.ts */
  slugs: readonly string[];
  /** Optional title shown above the logos row/strip (e.g. "Platforms we work with") */
  title?: string;
  /** Layout mode: 'strip' for a clean horizontal band, 'grid' for card grids, 'inline' for compact rows */
  layout?: "strip" | "grid" | "inline";
  /** Size variant: 'sm' (24px mark), 'md' (32px mark), 'lg' (40px mark) */
  size?: "sm" | "md" | "lg";
  /** Background context: 'light' or 'dark' */
  theme?: "light" | "dark";
  /** Show brand name text label underneath or beside the logo */
  showLabels?: boolean;
  /** Optional wrapper className */
  className?: string;
  /** Center align items */
  centered?: boolean;
}

export function BrandLogos({
  slugs,
  title,
  layout = "strip",
  size = "md",
  theme = "light",
  showLabels = true,
  className,
  centered = true,
}: BrandLogosProps) {
  const logos = getLogos(slugs);

  if (!logos.length) return null;

  const markSizes = {
    sm: { box: "h-6", imgWidth: 24, imgHeight: 24, text: "text-[0.75rem]" },
    md: { box: "h-8", imgWidth: 32, imgHeight: 32, text: "text-[0.8125rem]" },
    lg: { box: "h-10", imgWidth: 40, imgHeight: 40, text: "text-[0.875rem]" },
  }[size];

  return (
    <div
      className={clsx(
        "w-full",
        layout === "strip" && "py-4",
        className
      )}
    >
      {title ? (
        <p
          className={clsx(
            "text-eyebrow tracking-wider uppercase mb-4",
            centered && "text-center",
            theme === "dark" ? "text-ink-subtle" : "text-ink-muted"
          )}
        >
          {title}
        </p>
      ) : null}

      <div
        className={clsx(
          "flex flex-wrap items-center gap-4 sm:gap-6",
          centered && "justify-center",
          layout === "grid" && "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4"
        )}
      >
        {logos.map((logo) => {
          // Choose appropriate file based on theme & brand guidelines
          const isDark = theme === "dark";
          let src = logo.files.color;
          let needsLightChip = false;

          if (isDark) {
            if (logo.files.white) {
              src = logo.files.white;
            } else if (logo.files.mono) {
              src = logo.files.mono;
            } else {
              // Full-color mark that requires light background contrast per guidelines
              needsLightChip = true;
            }
          }

          return (
            <div
              key={logo.slug}
              className={clsx(
                "group inline-flex flex-col items-center justify-center transition-opacity duration-200",
                layout === "grid"
                  ? "p-3 rounded-lg border border-hairline bg-surface/60 text-center"
                  : "px-3 py-1.5 rounded-md",
                needsLightChip && isDark && "bg-white/90 p-2 rounded-md shadow-xs"
              )}
              title={`${logo.name} (Official mark)`}
            >
              <div
                className={clsx(
                  "relative flex items-center justify-center",
                  markSizes.box
                )}
                style={{ minWidth: markSizes.imgWidth }}
              >
                <Image
                  src={src}
                  alt={logo.name}
                  width={markSizes.imgWidth}
                  height={markSizes.imgHeight}
                  className="max-h-full w-auto object-contain select-none"
                  loading="lazy"
                />
              </div>

              {showLabels ? (
                <span
                  className={clsx(
                    "mt-1.5 font-medium whitespace-nowrap tracking-tight select-none",
                    markSizes.text,
                    needsLightChip && isDark
                      ? "text-neutral-900 font-semibold"
                      : isDark
                      ? "text-ink-subtle group-hover:text-ink"
                      : "text-ink-muted group-hover:text-ink"
                  )}
                >
                  {logo.name}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
