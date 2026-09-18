import * as React from "react";
import { cn } from "@/lib/utils";
import { PhoneFrame } from "./devices";
import { SERIES_COLORS } from "@/content/accents";

/**
 * Interface mockups built from markup rather than screenshots.
 *
 * Everything here renders from design tokens, so the frames stay pin-sharp on
 * any display, invert correctly inside a dark band, weigh almost nothing, and
 * never go stale the way an exported PNG does. Real project imagery replaces
 * these on case-study pages once assets are uploaded through the CMS.
 *
 * All of it is decorative: every frame is aria-hidden, and the surrounding
 * section carries the text that actually communicates the point.
 */

// ---------------------------------------------------------------------------
// Browser
// ---------------------------------------------------------------------------

export function BrowserFrame({
  children,
  url = "thedigitalalchemy.co.in",
  className,
  compact,
}: {
  children?: React.ReactNode;
  url?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "overflow-hidden rounded-lg border border-hairline bg-surface shadow-lg",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 border-b border-hairline bg-[#f0eeeb] px-3",
          compact ? "h-7" : "h-9",
        )}
      >
        {/* Real traffic-light colours — grey dots are the giveaway that a
            browser mockup was drawn rather than observed. */}
        <div className="flex gap-1.5">
          <span className="size-2 rounded-full bg-[#ff5f57]" />
          <span className="size-2 rounded-full bg-[#febc2e]" />
          <span className="size-2 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-2 flex h-5 flex-1 items-center rounded-full bg-white px-2.5 shadow-[inset_0_1px_2px_rgba(24,18,12,0.06)]">
          <span className="truncate font-mono text-[9px] text-ink-subtle">
            {url}
          </span>
        </div>
      </div>
      <div className="bg-surface">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Phone
// ---------------------------------------------------------------------------

/**
 * Kept as the shared name used across service pages, project cards and case
 * studies — the implementation is now the realistic phone in `devices.tsx`, so
 * upgrading it lifted every one of those surfaces at once.
 */
export function DeviceFrame({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <PhoneFrame className={className}>{children}</PhoneFrame>;
}

// ---------------------------------------------------------------------------
// Panels and primitives
// ---------------------------------------------------------------------------

export function Panel({
  children,
  className,
  title,
}: {
  children?: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-md border border-hairline bg-surface p-3 shadow-md",
        className,
      )}
    >
      {title ? (
        <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-subtle">
          {title}
        </p>
      ) : null}
      {children}
    </div>
  );
}

/** Grey bars standing in for text. Width is a percentage. */
export function TextRows({
  rows = [100, 78, 88],
  className,
}: {
  rows?: number[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {rows.map((width, index) => (
        <div
          key={index}
          className="h-1.5 rounded-full bg-surface-3"
          style={{ width: `${width}%` }}
        />
      ))}
    </div>
  );
}

export function StatTile({
  label,
  value,
  trend,
  className,
}: {
  label: string;
  value: string;
  trend?: "up" | "down" | "flat";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-sm border border-hairline bg-surface px-2.5 py-2",
        className,
      )}
    >
      <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-ink-subtle">
        {label}
      </p>
      <p className="numeric mt-1 text-[15px] font-semibold leading-none text-ink">
        {value}
      </p>
      {trend ? (
        <span
          className={cn(
            "mt-1 inline-block h-1 w-6 rounded-full",
            trend === "up" && "bg-secondary",
            trend === "down" && "bg-accent",
            trend === "flat" && "bg-surface-3",
          )}
        />
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Charts — deliberately unlabelled so they cannot be read as real results
// ---------------------------------------------------------------------------

const AREA_POINTS = [18, 26, 22, 34, 30, 46, 42, 58, 54, 70, 76, 88];

export function AreaChart({
  className,
  points = AREA_POINTS,
  /** Any CSS colour. Defaults to the active accent scope. */
  color = "var(--color-accent)",
  id = "area",
}: {
  className?: string;
  points?: number[];
  color?: string;
  id?: string;
}) {
  const width = 200;
  const height = 72;
  const max = Math.max(...points, 1);
  const step = width / (points.length - 1);

  const line = points
    .map((point, index) => {
      const x = index * step;
      const y = height - (point / max) * (height - 8) - 4;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const area = `${line} L${width},${height} L0,${height} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("w-full", className)}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Unique per instance — a shared id would make every chart on the
            page inherit the first one's fill. */}
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.24" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id}-fill)`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * Bars cycle through the series palette rather than sitting in one accent.
 * A chart where every column is the same colour is decoration; distinct
 * colours are the thing that makes it read as data.
 */
export function BarChart({
  className,
  bars = [40, 62, 48, 78, 58, 88, 72],
  multicolour = false,
}: {
  className?: string;
  bars?: number[];
  multicolour?: boolean;
}) {
  return (
    <div className={cn("flex h-16 items-end gap-1.5", className)} aria-hidden="true">
      {bars.map((value, index) => (
        <div
          key={index}
          className={cn(
            "flex-1 rounded-t-[2px]",
            !multicolour &&
              (index === bars.length - 2 ? "bg-accent" : "bg-surface-3"),
          )}
          style={{
            height: `${value}%`,
            ...(multicolour
              ? { background: SERIES_COLORS[index % SERIES_COLORS.length] }
              : {}),
          }}
        />
      ))}
    </div>
  );
}

/** A stacked legend + bars pair, for the analytics scenes. */
export function ChannelBreakdown({
  className,
  channels = [
    { label: "Organic", value: 42, color: "var(--color-mint)" },
    { label: "Paid", value: 28, color: "var(--color-coral)" },
    { label: "Social", value: 18, color: "var(--color-pink)" },
    { label: "Referral", value: 12, color: "var(--color-blue)" },
  ],
}: {
  className?: string;
  channels?: { label: string; value: number; color: string }[];
}) {
  return (
    <div className={cn("space-y-1.5", className)} aria-hidden="true">
      <div className="flex h-2 overflow-hidden rounded-full">
        {channels.map((channel) => (
          <span
            key={channel.label}
            style={{ width: `${channel.value}%`, background: channel.color }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-2.5 gap-y-1">
        {channels.map((channel) => (
          <span
            key={channel.label}
            className="flex items-center gap-1 text-[7.5px] text-ink-subtle"
          >
            <span
              className="size-1.5 rounded-full"
              style={{ background: channel.color }}
            />
            {channel.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Sparkline({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 24"
      className={cn("h-5 w-full", className)}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M0,20 L12,17 L24,19 L36,12 L48,14 L60,8 L72,10 L84,5 L100,3"
        fill="none"
        stroke="var(--color-secondary)"
        strokeWidth="1.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Composite: a small SaaS dashboard
// ---------------------------------------------------------------------------

export function DashboardMockup({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex h-full min-h-0 bg-surface", className)}
    >
      {/* Sidebar */}
      <div className="hidden w-28 shrink-0 border-r border-hairline bg-surface-2 p-2.5 sm:block">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-[3px] bg-accent" />
          <span className="h-1.5 w-10 rounded-full bg-surface-3" />
        </div>
        <div className="mt-4 space-y-1.5">
          {["Overview", "Customers", "Billing", "Reports", "API"].map(
            (item, index) => (
              <div
                key={item}
                className={cn(
                  "flex items-center gap-1.5 rounded-[4px] px-1.5 py-1",
                  index === 0 && "bg-surface",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-[2px]",
                    index === 0 ? "bg-accent" : "bg-surface-3",
                  )}
                />
                <span className="text-[8px] font-medium text-ink-subtle">
                  {item}
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 p-3">
        <div className="flex items-center justify-between">
          <div className="h-2 w-20 rounded-full bg-surface-3" />
          <div className="h-4 w-12 rounded-full bg-accent-soft" />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <StatTile label="MRR" value="—" trend="up" />
          <StatTile label="Active" value="—" trend="up" />
          <StatTile label="Churn" value="—" trend="flat" />
        </div>

        <div className="mt-2.5 rounded-sm border border-hairline p-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ink-subtle">
              Growth
            </span>
            <Sparkline className="w-12" />
          </div>
          <AreaChart className="h-12" />
        </div>

        <div className="mt-2.5 space-y-1.5">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="flex items-center gap-2 rounded-sm border border-hairline px-2 py-1.5"
            >
              <span className="size-4 shrink-0 rounded-full bg-surface-3" />
              <span className="h-1.5 flex-1 rounded-full bg-surface-3" />
              <span className="h-1.5 w-6 rounded-full bg-surface-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Composite: a mobile app screen
// ---------------------------------------------------------------------------

export function AppScreenMockup({
  variant = "home",
  className,
}: {
  variant?: "home" | "analytics" | "profile";
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("h-full bg-surface p-3 pt-5", className)}>
      <div className="flex items-center justify-between">
        <div className="h-2 w-14 rounded-full bg-surface-3" />
        <div className="size-5 rounded-full bg-surface-2" />
      </div>

      {variant === "home" ? (
        <>
          <div className="mt-4 rounded-md bg-ink p-3">
            <div className="h-1.5 w-10 rounded-full bg-ink-600" />
            <div className="numeric mt-2 text-lg font-semibold text-ink-inverse">
              —
            </div>
            <div className="mt-1 h-1 w-16 rounded-full bg-ink-700" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((tile) => (
              <div
                key={tile}
                className="rounded-md border border-hairline p-2.5"
              >
                <span className="block size-5 rounded-[5px] bg-accent-soft" />
                <span className="mt-2 block h-1.5 w-full rounded-full bg-surface-3" />
                <span className="mt-1 block h-1.5 w-2/3 rounded-full bg-surface-3" />
              </div>
            ))}
          </div>
        </>
      ) : null}

      {variant === "analytics" ? (
        <>
          <div className="mt-4 rounded-md border border-hairline p-2.5">
            <AreaChart className="h-16" />
          </div>
          <div className="mt-3 space-y-2">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="flex items-center gap-2">
                <span className="size-6 rounded-md bg-surface-2" />
                <span className="h-1.5 flex-1 rounded-full bg-surface-3" />
                <span className="h-1.5 w-5 rounded-full bg-accent-soft" />
              </div>
            ))}
          </div>
        </>
      ) : null}

      {variant === "profile" ? (
        <>
          <div className="mt-5 flex flex-col items-center">
            <span className="size-12 rounded-full bg-surface-2" />
            <span className="mt-2.5 h-2 w-16 rounded-full bg-surface-3" />
            <span className="mt-1.5 h-1.5 w-24 rounded-full bg-surface-3" />
          </div>
          <div className="mt-4 space-y-1.5">
            {[0, 1, 2, 3, 4].map((row) => (
              <div
                key={row}
                className="flex items-center justify-between rounded-md border border-hairline px-2.5 py-2"
              >
                <span className="h-1.5 w-16 rounded-full bg-surface-3" />
                <span className="size-1.5 rotate-45 border-r border-t border-hairline-strong" />
              </div>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Composite: a marketing website page
// ---------------------------------------------------------------------------

export function WebsiteMockup({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("bg-surface p-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-[3px] bg-accent" />
          <span className="h-1.5 w-10 rounded-full bg-surface-3" />
        </div>
        <div className="hidden gap-2 sm:flex">
          {[0, 1, 2].map((item) => (
            <span key={item} className="h-1.5 w-6 rounded-full bg-surface-3" />
          ))}
          <span className="h-3 w-10 rounded-full bg-ink" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div>
          <TextRows rows={[92, 70]} className="[&>div]:h-2.5" />
          <TextRows rows={[100, 96, 62]} className="mt-3" />
          <div className="mt-3 flex gap-1.5">
            <span className="h-4 w-14 rounded-full bg-ink" />
            <span className="h-4 w-12 rounded-full border border-hairline-strong" />
          </div>
        </div>
        <div className="rounded-md border border-hairline bg-surface-2 p-2">
          <AreaChart className="h-14" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((card) => (
          <div key={card} className="rounded-md border border-hairline p-2">
            <span className="block size-4 rounded-[4px] bg-accent-soft" />
            <TextRows rows={[100, 74]} className="mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
