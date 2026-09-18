import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Realistic device frames, drawn from scratch.
 *
 * These are original constructions in CSS — no vendor artwork is reproduced.
 * A device silhouette is a functional shape; the aluminium gradients, bezel
 * proportions, hinge and stand geometry here are all built rather than traced,
 * which also means they stay sharp at any resolution, invert correctly on the
 * dark bands, and cost nothing to download.
 *
 * Every frame is decorative and marked aria-hidden — the surrounding section
 * carries the meaning.
 */

/* ==========================================================================
   Shared surface treatments
   ========================================================================== */

/** Brushed-aluminium edge: a bright top lip, mid body, darker underside. */
const ALUMINIUM =
  "linear-gradient(180deg, #f4f5f6 0%, #dcdee1 6%, #c8ccd0 45%, #b3b8bd 88%, #9aa0a6 100%)";

/** Same alloy seen edge-on, so the highlight runs horizontally. */
const ALUMINIUM_EDGE =
  "linear-gradient(90deg, #9aa0a6 0%, #d8dbde 4%, #eceef0 12%, #d2d6da 50%, #eceef0 88%, #d8dbde 96%, #9aa0a6 100%)";

/** Warmer alloy for the phone rail, so it reads as a different metal. */
const TITANIUM =
  "linear-gradient(145deg, #6f6f74 0%, #cfcfd4 18%, #9b9ba1 38%, #e6e6ea 55%, #8e8e94 78%, #c8c8cd 92%, #6f6f74 100%)";

/** A diagonal sheen laid over glass. Kept very low contrast. */
function ScreenGlare({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        background:
          "linear-gradient(118deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.10) 26%, rgba(255,255,255,0) 42%, rgba(255,255,255,0) 100%)",
      }}
    />
  );
}

/** Soft elliptical contact shadow, so a device sits on a surface. */
function ContactShadow({
  className,
  intensity = 0.22,
}: {
  className?: string;
  intensity?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[50%] blur-xl",
        className,
      )}
      style={{
        background: `radial-gradient(ellipse at center, rgba(24,18,12,${intensity}) 0%, rgba(24,18,12,0) 72%)`,
      }}
    />
  );
}

/* ==========================================================================
   Laptop
   ========================================================================== */

/**
 * A 16:10 aluminium laptop, open.
 *
 * Proportions are driven by the container width so the whole assembly scales
 * as one object: bezel, notch, hinge and base thickness are all set in `em`
 * against a font-size derived from the frame width.
 */
export function LaptopFrame({
  children,
  className,
  screenClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  screenClassName?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative w-full [container-type:inline-size]", className)}
    >
      {/* 1cqw base unit — everything below scales with the frame. */}
      <div className="[font-size:1cqw]">
        {/* ---- Lid ---- */}
        <div
          className="relative rounded-[1.1em_1.1em_0.35em_0.35em] p-[0.42em] shadow-[0_1.6em_3.2em_-1.4em_rgba(24,18,12,0.45)]"
          style={{ background: ALUMINIUM }}
        >
          {/* Bezel */}
          <div className="relative overflow-hidden rounded-[0.8em] bg-[#0a0a0c] p-[0.5em] pt-[0.95em]">
            {/* Notch */}
            <span className="absolute left-1/2 top-0 h-[0.72em] w-[13%] -translate-x-1/2 rounded-b-[0.34em] bg-[#0a0a0c]" />
            {/* Camera */}
            <span className="absolute left-1/2 top-[0.22em] size-[0.26em] -translate-x-1/2 rounded-full bg-[#1c1c22]" />

            {/* Screen */}
            <div
              className={cn(
                "relative aspect-[16/10] w-full overflow-hidden rounded-[0.32em] bg-surface",
                screenClassName,
              )}
            >
              {children}
              <ScreenGlare />
            </div>
          </div>
        </div>

        {/* ---- Base ---- */}
        <div className="relative">
          {/* Hinge shadow under the lid */}
          <div
            className="mx-auto h-[0.28em] w-[99%] rounded-b-[0.2em]"
            style={{
              background:
                "linear-gradient(180deg, #7d838a 0%, #b6bbc0 55%, #cfd3d7 100%)",
            }}
          />
          {/* Deck slab, very slightly wider than the lid */}
          <div
            className="relative mx-auto h-[0.7em] w-[102%] rounded-b-[0.5em]"
            style={{ background: ALUMINIUM_EDGE }}
          >
            {/* Front lip cutout */}
            <span className="absolute left-1/2 top-0 h-[0.22em] w-[14%] -translate-x-1/2 rounded-b-[0.16em] bg-[rgba(120,126,133,0.55)]" />
          </div>
        </div>

        <ContactShadow className="-bottom-[0.9em] h-[1.4em] w-[86%]" />
      </div>
    </div>
  );
}

/* ==========================================================================
   Phone
   ========================================================================== */

/**
 * A phone with a metal rail, uniform thin bezel and a pill cutout.
 *
 * `aspect-[9/19.5]` matches the tall modern form factor. Side buttons are
 * rendered on the rail because their absence is one of the first things that
 * makes a mockup look flat.
 */
export function PhoneFrame({
  children,
  className,
  screenClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  screenClassName?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative aspect-[9/19.5] [container-type:inline-size]",
        className,
      )}
    >
      <div className="relative h-full [font-size:1cqw]">
        {/* Rail */}
        <div
          className="relative h-full rounded-[2.6em] p-[0.42em] shadow-[0_2em_4em_-1.6em_rgba(24,18,12,0.55)]"
          style={{ background: TITANIUM }}
        >
          {/* Buttons */}
          <span className="absolute -left-[0.16em] top-[16%] h-[3.4%] w-[0.34em] rounded-l-[0.16em] bg-[#8b8b91]" />
          <span className="absolute -left-[0.16em] top-[23%] h-[6%] w-[0.34em] rounded-l-[0.16em] bg-[#8b8b91]" />
          <span className="absolute -left-[0.16em] top-[31%] h-[6%] w-[0.34em] rounded-l-[0.16em] bg-[#8b8b91]" />
          <span className="absolute -right-[0.16em] top-[26%] h-[8%] w-[0.34em] rounded-r-[0.16em] bg-[#8b8b91]" />

          {/* Bezel */}
          <div className="relative h-full overflow-hidden rounded-[2.25em] bg-[#08080a] p-[0.28em]">
            {/* Screen */}
            <div
              className={cn(
                "relative h-full overflow-hidden rounded-[2em] bg-surface",
                screenClassName,
              )}
            >
              {children}
              <ScreenGlare className="rounded-[2em]" />
            </div>

            {/* Pill cutout */}
            <span className="absolute left-1/2 top-[1.1em] h-[1.05em] w-[26%] -translate-x-1/2 rounded-full bg-[#08080a]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   Monitor
   ========================================================================== */

/**
 * A desktop monitor on a stand. Used for the Windows screen, so the lineup
 * reads as three genuinely different machines rather than three rectangles.
 */
export function MonitorFrame({
  children,
  className,
  screenClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  screenClassName?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative w-full [container-type:inline-size]", className)}
    >
      <div className="[font-size:1cqw]">
        {/* Panel */}
        <div
          className="relative rounded-[0.9em] p-[0.5em] shadow-[0_1.8em_3.4em_-1.5em_rgba(24,18,12,0.45)]"
          style={{ background: ALUMINIUM }}
        >
          <div className="relative overflow-hidden rounded-[0.6em] bg-[#0a0a0c] p-[0.42em] pb-[1.5em]">
            <div
              className={cn(
                "relative aspect-[16/10] w-full overflow-hidden rounded-[0.28em] bg-surface",
                screenClassName,
              )}
            >
              {children}
              <ScreenGlare />
            </div>
            {/* Chin */}
            <span className="absolute bottom-[0.42em] left-1/2 size-[0.3em] -translate-x-1/2 rounded-full bg-[#2a2a30]" />
          </div>
        </div>

        {/* Neck */}
        <div
          className="mx-auto h-[3.2em] w-[11%] rounded-b-[0.3em]"
          style={{
            background:
              "linear-gradient(90deg, #9aa0a6 0%, #dfe2e5 30%, #eef0f1 50%, #cfd3d7 72%, #9aa0a6 100%)",
          }}
        />
        {/* Foot */}
        <div
          className="mx-auto h-[0.72em] w-[36%] rounded-[0.4em]"
          style={{ background: ALUMINIUM_EDGE }}
        />

        <ContactShadow className="-bottom-[0.7em] h-[1.3em] w-[54%]" />
      </div>
    </div>
  );
}

/* ==========================================================================
   Windows application chrome
   ========================================================================== */

/**
 * Windows-style application chrome: rounded corners, a light title bar, and
 * minimise / maximise / close glyphs at the trailing edge — the arrangement
 * that makes the platform recognisable at a glance.
 */
export function WindowsWindow({
  children,
  title = "The Digital Alchemy — Admin",
  className,
}: {
  children?: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-full flex-col overflow-hidden bg-[#f3f3f3] [container-type:inline-size]",
        className,
      )}
    >
      <div className="flex h-[8%] min-h-6 items-center gap-2 border-b border-[#e2e2e2] bg-[#f9f9f9] px-2.5">
        {/* App mark */}
        <span className="size-2.5 shrink-0 rounded-[2px] bg-accent" />
        <span className="truncate text-[0.55rem] font-medium text-[#3b3b3b]">
          {title}
        </span>

        {/* Caption buttons, trailing edge */}
        <span className="ml-auto flex items-center gap-3 pr-0.5">
          <span className="block h-px w-2.5 bg-[#5a5a5a]" />
          <span className="block size-2 border border-[#5a5a5a]" />
          <span className="relative block size-2">
            <span className="absolute left-1/2 top-1/2 block h-px w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#5a5a5a]" />
            <span className="absolute left-1/2 top-1/2 block h-px w-2.5 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-[#5a5a5a]" />
          </span>
        </span>
      </div>

      <div className="min-h-0 flex-1 bg-surface">{children}</div>
    </div>
  );
}

/* ==========================================================================
   Browser chrome (macOS style)
   ========================================================================== */

export function BrowserChrome({
  children,
  url = "thedigitalalchemy.co.in",
  className,
}: {
  children?: React.ReactNode;
  url?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex h-full flex-col bg-surface", className)}
    >
      <div className="flex h-[9%] min-h-5 items-center gap-2 border-b border-hairline bg-[#f0eeeb] px-2.5">
        <span className="flex gap-1">
          <span className="size-1.5 rounded-full bg-[#ff5f57]" />
          <span className="size-1.5 rounded-full bg-[#febc2e]" />
          <span className="size-1.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="ml-1.5 flex h-[70%] flex-1 items-center rounded-full bg-white px-2">
          <span className="truncate font-mono text-[0.5rem] text-ink-subtle">
            {url}
          </span>
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

/**
 * A landscape tablet.
 *
 * Uniform bezel on all four sides, which is what separates a tablet from a
 * laptop or a phone at a glance — no notch, no chin, no stand. Built from the
 * same container-query scaling as the other frames, so the whole assembly
 * resizes as one object rather than needing breakpoints.
 */
export function TabletFrame({
  children,
  className,
  screenClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  screenClassName?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative aspect-[4/3] [container-type:inline-size]", className)}
    >
      <div className="relative h-full [font-size:1cqw]">
        <div
          className="relative h-full rounded-[2.2em] p-[0.9em] shadow-[0_3em_6em_-2em_rgba(24,18,12,0.5)]"
          style={{ background: ALUMINIUM }}
        >
          {/* Machined edge highlight, the same trick the other frames use. */}
          <span
            className="pointer-events-none absolute inset-0 rounded-[2.2em]"
            style={{ background: ALUMINIUM_EDGE }}
          />
          <div
            className={cn(
              "relative h-full overflow-hidden rounded-[1.5em] bg-ink-900",
              screenClassName,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
