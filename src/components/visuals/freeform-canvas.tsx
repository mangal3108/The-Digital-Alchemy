import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Star, FileText, ExternalLink, Paperclip } from "lucide-react";

/**
 * ---------------------------------------------------------------------------
 * Apple Freeform Whiteboard UI Components
 * Inspired by Apple Freeform on iPadOS:
 * - Clean iPad Pro hardware bezel or Freeform window
 * - Top toolbar with canvas title, tool palette & zoom
 * - Subtle dot-grid paper canvas
 * - Vibrant pastel Post-it sticky notes with organic rotations
 * - Polaroid photo cards with tape
 * - Handwritten SVG doodle annotations, marker highlights & arrows
 * ---------------------------------------------------------------------------
 */

/**
 * iPad Frame & Freeform Window Container
 */
export function FreeformWindow({
  title = "Client Stories & Partnerships",
  subtitle = "Whiteboard Canvas",
  children,
  className,
  toolbar = true,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  toolbar?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-2xl md:rounded-3xl",
        "border border-slate-300/80 bg-white/95 shadow-2xl shadow-slate-900/10",
        "ring-1 ring-slate-900/5",
        className,
      )}
    >
      {/* iPad Top Status & Freeform Toolbar */}
      {toolbar && (
        <div className="border-b border-slate-200/90 bg-slate-50/90 px-4 py-3 backdrop-blur-md sm:px-6">
          {/* Top Status Bar (iPad style) */}
          <div className="flex items-center justify-between text-[0.75rem] font-medium text-slate-500">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-[0.7rem] uppercase tracking-wider text-slate-400">
                Freeform Canvas
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block font-mono text-[0.7rem] text-slate-400">
                Zoom 100%
              </span>
              <div className="flex items-center gap-1">
                <span className="inline-block size-1.5 rounded-full bg-slate-300" />
                <span className="inline-block size-1.5 rounded-full bg-slate-300" />
                <span className="inline-block size-1.5 rounded-full bg-slate-300" />
              </div>
            </div>
          </div>

          {/* Main Freeform App Header & Tool Palette */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            {/* Title / Back pill */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-slate-700 shadow-xs border border-slate-200/80">
                <svg
                  className="size-3.5 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="text-[0.8125rem] font-semibold tracking-tight text-slate-800">
                  {title}
                </span>
                <span className="hidden sm:inline text-[0.75rem] text-slate-400">
                  ({subtitle})
                </span>
              </div>
            </div>

            {/* Apple Freeform Tool Icons */}
            <div className="flex items-center gap-1 rounded-xl bg-slate-200/70 p-1">
              {/* Select */}
              <button
                type="button"
                aria-label="Select tool"
                className="flex size-7 items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 3l12 12-5.5.5-2.5 5.5L4 3z" />
                </svg>
              </button>
              {/* Marker / Pen */}
              <button
                type="button"
                aria-label="Draw tool"
                className="flex size-7 items-center justify-center rounded-lg text-slate-500 hover:text-slate-800"
              >
                <svg
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
              {/* Sticky Note */}
              <button
                type="button"
                aria-label="Sticky note tool"
                className="flex size-7 items-center justify-center rounded-lg bg-amber-100 text-amber-800 shadow-xs"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v12a1 1 0 01-1 1h-6l-5 5v-5H4a1 1 0 01-1-1V4z" />
                </svg>
              </button>
              {/* Shapes */}
              <button
                type="button"
                aria-label="Shapes tool"
                className="hidden xs:flex size-7 items-center justify-center rounded-lg text-slate-500 hover:text-slate-800"
              >
                <svg
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="8" strokeWidth={2} />
                </svg>
              </button>
              {/* Text */}
              <button
                type="button"
                aria-label="Text tool"
                className="hidden xs:flex size-7 items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 font-serif font-bold text-xs"
              >
                A
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Freeform Canvas Grid Paper */}
      <div
        className="relative size-full p-4 sm:p-6 md:p-10"
        style={{
          backgroundColor: "#fafaf8",
          backgroundImage:
            "radial-gradient(#d4d4d8 1.1px, transparent 1.1px)",
          backgroundSize: "24px 24px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Sticky Note Color Themes (Post-it tones matching Apple Freeform)
 */
export type StickyColor = "yellow" | "cyan" | "pink" | "lime" | "purple" | "peach";

const STICKY_STYLES: Record<
  StickyColor,
  { bg: string; border: string; text: string; tape: string; accent: string }
> = {
  yellow: {
    bg: "bg-[#FEF9C3]", // Canary yellow
    border: "border-[#FDE047]/60",
    text: "text-amber-950",
    tape: "bg-amber-200/60",
    accent: "#EAB308",
  },
  cyan: {
    bg: "bg-[#E0F2FE]", // Sky cyan
    border: "border-[#BAE6FD]/80",
    text: "text-sky-950",
    tape: "bg-sky-200/60",
    accent: "#0284C7",
  },
  pink: {
    bg: "bg-[#FFE4E6]", // Rose pink
    border: "border-[#FECDD3]/80",
    text: "text-rose-950",
    tape: "bg-rose-200/60",
    accent: "#E11D48",
  },
  lime: {
    bg: "bg-[#DCFCE7]", // Fresh mint
    border: "border-[#BBF7D0]/80",
    text: "text-emerald-950",
    tape: "bg-emerald-200/60",
    accent: "#16A34A",
  },
  purple: {
    bg: "bg-[#F3E8FF]", // Soft lilac
    border: "border-[#E9D5FF]/80",
    text: "text-purple-950",
    tape: "bg-purple-200/60",
    accent: "#9333EA",
  },
  peach: {
    bg: "bg-[#FFEDD5]", // Warm peach
    border: "border-[#FED7AA]/80",
    text: "text-orange-950",
    tape: "bg-orange-200/60",
    accent: "#EA580C",
  },
};

/**
 * Sticky Note Component
 */
export function StickyNote({
  color = "yellow",
  title,
  quote,
  author,
  role,
  company,
  rating = 5,
  badge,
  attachment,
  rotate = 0,
  className,
}: {
  color?: StickyColor;
  title?: string;
  quote: string;
  author?: string;
  role?: string;
  company?: string;
  rating?: number;
  badge?: string;
  attachment?: string;
  rotate?: number;
  className?: string;
}) {
  const theme = STICKY_STYLES[color];

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between rounded-xl p-5 sm:p-6 transition-transform duration-200 hover:scale-[1.02] hover:z-20",
        "shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.06)]",
        theme.bg,
        theme.border,
        theme.text,
        className,
      )}
      style={{
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {/* Washi Tape Header */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute -top-3 left-1/2 -translate-x-1/2 h-5 w-20 rounded-xs backdrop-blur-xs",
          theme.tape,
          "border border-white/40 shadow-xs",
        )}
      />

      <div>
        {/* Top bar with Badge / Rating */}
        <div className="flex items-center justify-between gap-2">
          {badge ? (
            <span className="inline-flex items-center rounded-full bg-white/70 px-2 py-0.5 text-[0.6875rem] font-bold tracking-wide uppercase shadow-2xs">
              {badge}
            </span>
          ) : (
            <span />
          )}

          {rating ? (
            <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3.5",
                    i < rating ? "fill-amber-400 text-amber-500" : "text-slate-300",
                  )}
                />
              ))}
            </div>
          ) : null}
        </div>

        {title ? (
          <h4 className="mt-3 font-display text-[1.0625rem] font-bold tracking-tight">
            {title}
          </h4>
        ) : null}

        <blockquote className="mt-3 text-[0.9375rem] sm:text-[1rem] leading-relaxed font-normal italic opacity-95">
          &ldquo;{quote}&rdquo;
        </blockquote>

        {attachment ? (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white/70 px-2.5 py-1 text-[0.6875rem] font-semibold text-slate-700 shadow-2xs">
            <Paperclip className="size-3 text-slate-500" />
            <span className="truncate max-w-[140px]">{attachment}</span>
          </div>
        ) : null}
      </div>

      {author ? (
        <div className="mt-5 border-t border-black/10 pt-3 flex items-center justify-between">
          <div>
            <p className="text-[0.875rem] font-bold tracking-tight not-italic">
              {author}
            </p>
            {(role || company) && (
              <p className="text-[0.75rem] opacity-75 font-medium">
                {[role, company].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <span
            className="size-6 rounded-full flex items-center justify-center font-bold text-xs bg-white/80 shadow-xs"
            style={{ color: theme.accent }}
          >
            {author.charAt(0)}
          </span>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Sketch Layout Card Component
 */
export function SketchLayoutCard({
  title,
  subtitle,
  children,
  color = "blue",
  rotate = 0,
  tag,
  className,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  color?: "blue" | "emerald" | "amber" | "purple";
  rotate?: number;
  tag?: string;
  className?: string;
}) {
  const colorBorders = {
    blue: "border-blue-300 text-blue-900 bg-blue-50/40",
    emerald: "border-emerald-300 text-emerald-900 bg-emerald-50/40",
    amber: "border-amber-300 text-amber-900 bg-amber-50/40",
    purple: "border-purple-300 text-purple-900 bg-purple-50/40",
  };

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 border-dashed bg-white p-4 shadow-sm transition-transform duration-200 hover:scale-[1.02]",
        "sm:[transform:rotate(var(--rotate-deg))]",
        colorBorders[color],
        className,
      )}
      style={
        {
          "--rotate-deg": `${rotate}deg`,
          transform: `rotate(${rotate * 0.35}deg)`,
        } as React.CSSProperties
      }
    >
      <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
        <h5 className="font-display text-sm font-black tracking-tight text-slate-800 uppercase">
          {title}
        </h5>
        {tag && (
          <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[0.65rem] font-bold text-white uppercase">
            {tag}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-2 text-xs font-medium text-slate-600 leading-relaxed">
          {subtitle}
        </p>
      )}
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

/**
 * Polaroid Photo Card Component
 */
export function PolaroidCard({
  imageSrc,
  alt = "",
  caption,
  subcaption,
  rotate = 0,
  tag,
  className,
}: {
  imageSrc?: string;
  alt?: string;
  caption: string;
  subcaption?: string;
  rotate?: number;
  tag?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-md bg-white p-3.5 pb-4 transition-transform duration-200 hover:scale-[1.02] hover:z-20",
        "border border-slate-200/90 shadow-lg shadow-slate-400/20",
        className,
      )}
      style={{
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {/* Corner Tape */}
      <div
        aria-hidden="true"
        className="absolute -top-2 right-4 h-4 w-12 -rotate-12 bg-amber-100/70 border border-white/50 backdrop-blur-xs shadow-2xs"
      />

      {/* Photo Area */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm bg-slate-100 border border-slate-200/60">
        {imageSrc ? (
          <Image src={imageSrc} alt={alt} fill className="object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200 p-4 text-center">
            <span className="font-mono text-xs font-semibold text-slate-500">
              {caption}
            </span>
          </div>
        )}

        {tag && (
          <span className="absolute bottom-2 left-2 rounded-md bg-slate-900/80 px-2 py-0.5 text-[0.6875rem] font-medium text-white backdrop-blur-xs">
            {tag}
          </span>
        )}
      </div>

      {/* Handwritten / Polaroid Label */}
      <div className="mt-3 px-1 text-center">
        <p className="font-display text-[0.875rem] font-bold tracking-tight text-slate-800">
          {caption}
        </p>
        {subcaption && (
          <p className="mt-0.5 text-[0.75rem] text-slate-500 font-medium">
            {subcaption}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * File Attachment Card (Keynote / Spec doc in Freeform)
 */
export function FreeformFileCard({
  title,
  type = "Architecture Spec",
  meta = "PDF Document · 1.4 MB",
  href,
  rotate = 0,
  className,
}: {
  title: string;
  type?: string;
  meta?: string;
  href?: string;
  rotate?: number;
  className?: string;
}) {
  const CardContent = (
    <div
      className={cn(
        "group relative flex items-center gap-3.5 rounded-xl border border-slate-200 bg-white p-3.5 shadow-md shadow-slate-200/60 transition-transform duration-200 hover:scale-105 hover:border-slate-300",
        className,
      )}
      style={{
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
        <FileText className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="block text-[0.6875rem] font-bold uppercase tracking-wider text-blue-600">
          {type}
        </span>
        <p className="truncate text-[0.875rem] font-semibold text-slate-800">
          {title}
        </p>
        <span className="block text-[0.75rem] text-slate-400 font-medium">
          {meta}
        </span>
      </div>
      {href ? (
        <ExternalLink className="size-4 shrink-0 text-slate-400 group-hover:text-slate-700" />
      ) : null}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block no-underline">
        {CardContent}
      </a>
    );
  }

  return CardContent;
}

/**
 * Hand-drawn Marker Highlight / Doodle Accents
 */
export function MarkerBadge({
  text,
  color = "yellow",
  rotate = 0,
  className,
}: {
  text: string;
  color?: "yellow" | "cyan" | "pink" | "lime" | "purple" | "peach";
  rotate?: number;
  className?: string;
}) {
  const bgMap = {
    yellow: "bg-[#FEF08A] text-amber-950 border-[#FACC15]",
    cyan: "bg-[#BAE6FD] text-sky-950 border-[#7DD3FC]",
    pink: "bg-[#FECDD3] text-rose-950 border-[#FDA4AF]",
    lime: "bg-[#BBF7D0] text-emerald-950 border-[#86EFAC]",
    purple: "bg-[#E9D5FF] text-purple-950 border-[#D8B4FE]",
    peach: "bg-[#FED7AA] text-orange-950 border-[#FB923C]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-3 py-1 text-[0.8125rem] font-bold tracking-tight shadow-xs",
        bgMap[color],
        className,
      )}
      style={{
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {text}
    </span>
  );
}

/**
 * Hand-drawn Squiggly Arrow SVG
 */
export function FreeformArrow({
  direction = "right",
  label,
  className,
}: {
  direction?: "right" | "down" | "curved-left" | "curved-right";
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none flex flex-col items-center select-none",
        className,
      )}
    >
      {label && (
        <span className="font-mono text-[0.6875rem] font-bold uppercase tracking-wider text-slate-500 mb-1">
          {label}
        </span>
      )}
      {direction === "right" && (
        <svg
          className="size-8 text-slate-400 stroke-current"
          fill="none"
          viewBox="0 0 40 24"
        >
          <path
            d="M2 12 C 12 6, 24 16, 36 10 M 28 4 L 37 10 L 29 16"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {direction === "curved-right" && (
        <svg
          className="size-10 text-slate-400 stroke-current"
          fill="none"
          viewBox="0 0 44 44"
        >
          <path
            d="M6 8 C 8 26, 26 34, 38 34 M 30 28 L 38 34 L 30 40"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {direction === "curved-left" && (
        <svg
          className="size-10 text-slate-400 stroke-current"
          fill="none"
          viewBox="0 0 44 44"
        >
          <path
            d="M38 8 C 36 26, 18 34, 6 34 M 14 28 L 6 34 L 14 40"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

/**
 * Compatibility exports for ideas-canvas and visual tests
 */
export interface CanvasItem {
  id: string;
  x: number;
  y: number;
  w: number;
  depth?: number;
  rotate?: number;
  scatter?: { x: number; y: number; rotate: number; scale: number };
  content: React.ReactNode;
  mobile?: boolean;
}

export function CanvasCard({
  children,
  className,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: string;
  label?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white p-4 shadow-sm", className)}>
      {label && <p className="text-xs font-medium text-slate-500 mb-2">{label}</p>}
      {children}
    </div>
  );
}

export function SwatchStrip({ colors }: { colors: string[] }) {
  return (
    <div className="flex gap-1.5">
      {colors.map((c, i) => (
        <span
          key={i}
          className="size-4 rounded-full border border-black/10"
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}

export function FreeformCanvas({
  items,
  aspect = 1.55,
}: {
  items: CanvasItem[];
  aspect?: number;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-200"
      style={{ aspectRatio: aspect }}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${item.w}%`,
            transform: item.rotate ? `rotate(${item.rotate}deg)` : undefined,
          }}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

