import { cn } from "@/lib/utils";
import {
  AppScreenMockup,
  AreaChart,
  BrowserFrame,
  DeviceFrame,
  Sparkline,
  StatTile,
  TextRows,
} from "./mockups";
import type { ServiceVisual } from "@/content/services";

/**
 * Per-service miniature scenes.
 *
 * Each card gets its own composition rather than an icon in a box, because the
 * point of this section is to show what the work actually looks like.
 *
 * Colour comes entirely from the surrounding `data-accent` scope — these use
 * `--color-accent` and `--color-accent-2` and never name a hue. Drop the same
 * scene into a violet page and it renders violet. That is what lets six cards
 * on the homepage read as six different products while sharing one component.
 *
 * Every scene is decorative and aria-hidden; the card's heading carries the
 * meaning.
 */

/**
 * `bg-accent-soft` is the fallback ground: on an engine without `color-mix()`
 * the tint gradients above are dropped as invalid, and this keeps the scene
 * coloured rather than grey.
 */
const shell =
  "relative h-full w-full overflow-hidden rounded-md bg-accent-soft p-4";

function Scene({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn(shell, className)}>
      {/* The scene's ground is tinted in the service's own two colours.
          This is the largest coloured area on the homepage and the main
          reason six cards read as six different products — the card around
          it stays white, so the colour is contained rather than washed. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(88% 76% at 72% 8%, color-mix(in srgb, var(--color-accent) calc(34% * var(--tint-strength)), transparent) 0%, transparent 74%), radial-gradient(76% 66% at 12% 96%, color-mix(in srgb, var(--color-accent-2) calc(26% * var(--tint-strength)), transparent) 0%, transparent 72%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(var(--color-hairline)_1px,transparent_1px),linear-gradient(90deg,var(--color-hairline)_1px,transparent_1px)] [background-size:22px_22px] opacity-40" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

/** SaaS — a product dashboard assembling in perspective. */
function SaasScene() {
  return (
    <Scene>
      <div className="perspective-near h-full">
        <div
          className="preserve-3d h-full"
          style={{ transform: "rotateX(6deg) rotateY(-11deg)" }}
        >
          <div className="overflow-hidden rounded-sm border border-hairline bg-surface shadow-lg">
            <div className="flex items-center gap-1.5 border-b border-hairline bg-surface-2 px-2 py-1.5">
              <span className="size-2 rounded-[2px] bg-accent" />
              <span className="h-1 w-10 rounded-full bg-surface-3" />
              <span className="ml-auto h-2.5 w-6 rounded-full bg-accent-soft" />
            </div>
            <div className="p-2">
              <div className="grid grid-cols-3 gap-1">
                <StatTile label="MRR" value="—" trend="up" />
                <StatTile label="Seats" value="—" trend="up" />
                <StatTile label="Churn" value="—" trend="flat" />
              </div>
              <div className="mt-1.5 rounded-sm border border-hairline p-1.5">
                <AreaChart id="saas-a" className="h-10" />
              </div>
            </div>
          </div>

          {/* Billing panel floating in front, in the secondary accent */}
          <div
            className="absolute -bottom-1 right-1 w-[52%] rounded-sm border border-hairline bg-surface p-2 shadow-xl"
            style={{ transform: "translateZ(44px)" }}
          >
            <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-ink-subtle">
              Billing
            </p>
            <div className="mt-1.5 space-y-1">
              {["Starter", "Team", "Scale"].map((plan, index) => (
                <div
                  key={plan}
                  className="flex items-center justify-between rounded-[3px] px-1.5 py-1"
                  style={{
                    background:
                      index === 1
                        ? "color-mix(in srgb, var(--color-accent) 20%, transparent)"
                        : "color-mix(in srgb, var(--color-accent-2) 10%, transparent)",
                  }}
                >
                  <span className="text-[8px] font-medium text-ink-muted">
                    {plan}
                  </span>
                  <span
                    className="h-1 w-4 rounded-full"
                    style={{
                      background:
                        index === 1
                          ? "var(--color-accent)"
                          : "var(--color-accent-2)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Scene>
  );
}

/** Software — modular blocks connecting into one platform. */
function SoftwareScene() {
  const modules = [
    "Customers",
    "Sales",
    "Inventory",
    "Finance",
    "Analytics",
    "Automation",
  ];
  return (
    <Scene>
      <div className="flex h-full flex-col justify-center">
        <div className="grid grid-cols-3 gap-1.5">
          {modules.map((module, index) => {
            // Alternating accents so the grid reads as distinct systems
            // rather than six copies of one block.
            const primary = index % 3 === 1;
            return (
              <div
                key={module}
                className="rounded-sm border px-1.5 py-2 text-center"
                style={{
                  borderColor:
                    index === 4
                      ? "var(--color-accent)"
                      : "var(--color-hairline)",
                  background:
                    index === 4
                      ? "color-mix(in srgb, var(--color-accent) 16%, var(--color-surface))"
                      : primary
                        ? "color-mix(in srgb, var(--color-accent-2) 9%, var(--color-surface))"
                        : "var(--color-surface)",
                }}
              >
                <span
                  className="mx-auto block size-2.5 rounded-[3px]"
                  style={{
                    background:
                      index === 4
                        ? "var(--color-accent)"
                        : primary
                          ? "var(--color-accent-2)"
                          : "var(--color-surface-3)",
                  }}
                />
                <span className="mt-1.5 block text-[7.5px] font-medium leading-tight text-ink-muted">
                  {module}
                </span>
              </div>
            );
          })}
        </div>

        <svg
          viewBox="0 0 200 34"
          className="mt-1.5 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M18 0 V12 H100 V0 M100 12 V22 M182 0 V12 H100"
            fill="none"
            stroke="var(--color-accent-2)"
            strokeOpacity="0.55"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="100" cy="26" r="4" fill="var(--color-accent)" />
        </svg>

        <div
          className="mt-1 rounded-sm border px-2 py-1.5 text-center"
          style={{
            borderColor: "var(--color-accent)",
            background:
              "color-mix(in srgb, var(--color-accent) 12%, var(--color-surface))",
          }}
        >
          <span className="text-[8px] font-semibold text-ink">
            One business platform
          </span>
        </div>
      </div>
    </Scene>
  );
}

/** Web — a browser resolving down to a phone. */
function WebScene() {
  return (
    <Scene>
      <div className="relative h-full">
        <BrowserFrame compact url="yourbrand.com" className="w-[86%]">
          <div className="p-2">
            <TextRows rows={[62, 40]} className="[&>div]:h-2" />
            <div className="mt-2 grid grid-cols-3 gap-1">
              {[0, 1, 2].map((card) => (
                <div
                  key={card}
                  className="rounded-[3px] border border-hairline p-1"
                >
                  <span
                    className="block size-2.5 rounded-[2px]"
                    style={{
                      background:
                        card === 1
                          ? "var(--color-accent)"
                          : "color-mix(in srgb, var(--color-accent-2) 40%, transparent)",
                    }}
                  />
                  <TextRows rows={[100, 70]} className="mt-1 [&>div]:h-1" />
                </div>
              ))}
            </div>
          </div>
        </BrowserFrame>

        <DeviceFrame className="absolute -bottom-2 right-0 h-[62%] w-[22%]">
          <div className="p-1.5 pt-3">
            <span
              className="block h-1 w-8 rounded-full"
              style={{ background: "var(--color-accent)" }}
            />
            <TextRows rows={[80, 55]} className="mt-1 [&>div]:h-1" />
            <div className="mt-1.5 space-y-1">
              {[0, 1].map((row) => (
                <div
                  key={row}
                  className="rounded-[3px] border border-hairline p-1"
                >
                  <span
                    className="block h-1 w-full rounded-full"
                    style={{
                      background:
                        row === 0
                          ? "color-mix(in srgb, var(--color-accent-2) 45%, transparent)"
                          : "var(--color-surface-3)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </DeviceFrame>
      </div>
    </Scene>
  );
}

/** Mobile — three screens stepping back in depth. */
function MobileScene() {
  return (
    <Scene>
      <div className="perspective-near flex h-full items-center justify-center">
        <div className="preserve-3d relative flex h-full w-full items-center justify-center">
          <DeviceFrame className="absolute h-[92%] w-[30%] opacity-55">
            <AppScreenMockup variant="profile" />
          </DeviceFrame>
          <div
            className="absolute h-[92%] w-[30%]"
            style={{ transform: "translate3d(-34%, 6%, 0) rotate(-7deg)" }}
          >
            <DeviceFrame className="h-full w-full opacity-85">
              <AppScreenMockup variant="home" />
            </DeviceFrame>
          </div>
          <div
            className="absolute h-[96%] w-[32%]"
            style={{ transform: "translate3d(30%, -4%, 0) rotate(6deg)" }}
          >
            <DeviceFrame className="h-full w-full">
              <AppScreenMockup variant="analytics" />
            </DeviceFrame>
          </div>
        </div>
      </div>
    </Scene>
  );
}

/** Marketing — a funnel narrowing to revenue, graded across both accents. */
function MarketingScene() {
  const stages = [
    { label: "Impressions", width: "100%" },
    { label: "Clicks", width: "76%" },
    { label: "Landing", width: "56%" },
    { label: "Leads", width: "36%" },
    { label: "Customers", width: "20%" },
  ];
  return (
    <Scene>
      <div className="flex h-full flex-col justify-center gap-1.5">
        {stages.map((stage, index) => (
          <div key={stage.label} className="flex items-center gap-2">
            <span className="w-[52px] shrink-0 text-right font-mono text-[7.5px] uppercase tracking-[0.1em] text-ink-subtle">
              {stage.label}
            </span>
            <span
              className="h-3 rounded-[3px]"
              style={{
                width: stage.width,
                // The funnel warms as it narrows — secondary accent at the
                // top, primary at the point of conversion.
                background: `color-mix(in srgb, var(--color-accent) ${25 + index * 19}%, var(--color-accent-2))`,
              }}
            />
          </div>
        ))}
        <div className="mt-1.5 flex items-center gap-2 rounded-sm border border-hairline bg-surface px-2 py-1.5">
          <Sparkline className="w-10" />
          <span className="text-[8px] font-medium text-ink-muted">
            Measured to revenue, not reach
          </span>
        </div>
      </div>
    </Scene>
  );
}

/** Social — a content calendar feeding a growth curve. */
function SocialScene() {
  const filled = new Set([1, 2, 4, 5, 8, 9, 11, 12, 15, 16, 18]);
  return (
    <Scene>
      <div className="flex h-full flex-col justify-center gap-2">
        <div className="rounded-sm border border-hairline bg-surface p-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-ink-subtle">
              Calendar
            </span>
            <span className="h-1 w-6 rounded-full bg-accent-soft" />
          </div>
          <div className="grid grid-cols-7 gap-[3px]">
            {Array.from({ length: 21 }).map((_, index) => (
              <span
                key={index}
                className="aspect-square rounded-[2px]"
                style={{
                  background: filled.has(index)
                    ? index % 5 === 0
                      ? "var(--color-accent)"
                      : index % 3 === 0
                        ? "var(--color-accent-2)"
                        : "color-mix(in srgb, var(--color-accent) 32%, transparent)"
                    : "var(--color-surface-2)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-sm border border-hairline bg-surface p-1.5">
            <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-ink-subtle">
              Reach
            </span>
            <div className="mt-1 flex h-8 items-end gap-1">
              {[30, 45, 38, 62, 55, 78, 70].map((v, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-t-[2px]"
                  style={{
                    height: `${v}%`,
                    background:
                      i % 2 === 0
                        ? "color-mix(in srgb, var(--color-accent) 55%, transparent)"
                        : "color-mix(in srgb, var(--color-accent-2) 55%, transparent)",
                  }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-sm border border-hairline bg-surface p-1.5">
            <span className="font-mono text-[7px] uppercase tracking-[0.1em] text-ink-subtle">
              Engagement
            </span>
            <AreaChart id="social-a" className="mt-1 h-8" />
          </div>
        </div>
      </div>
    </Scene>
  );
}

const SCENES: Partial<Record<ServiceVisual, () => React.JSX.Element>> = {
  saas: SaasScene,
  software: SoftwareScene,
  web: WebScene,
  webapp: SaasScene,
  mobile: MobileScene,
  marketing: MarketingScene,
  social: SocialScene,
};

export function ServiceVisualScene({
  visual,
  className,
}: {
  visual: ServiceVisual;
  className?: string;
}) {
  const Component = SCENES[visual];
  if (!Component) {
    return (
      <Scene className={className}>
        <div className="flex h-full items-center justify-center">
          <span
            className="size-12 rounded-full"
            style={{
              background:
                "linear-gradient(135deg, var(--color-accent), var(--color-accent-2))",
            }}
          />
        </div>
      </Scene>
    );
  }
  return (
    <div className={cn("h-full", className)}>
      <Component />
    </div>
  );
}
