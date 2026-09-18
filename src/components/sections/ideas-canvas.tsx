import { Section, SectionHeading } from "@/components/ui/section-heading";
import { BrandImage, getOptionalBrandImage } from "@/components/ui/brand-image";
import { revealProps } from "@/lib/reveal";
import {
  FreeformCanvas,
  CanvasCard,
  SwatchStrip,
  type CanvasItem,
} from "@/components/visuals/freeform-canvas";
import {
  AreaChart,
  AppScreenMockup,
  BarChart,
  TextRows,
  StatTile,
  WebsiteMockup,
} from "@/components/visuals/mockups";
import { PhoneFrame, BrowserChrome } from "@/components/visuals/devices";

/**
 * "Where ideas take shape."
 *
 * The site's signature interaction. Loose material — a wireframe, a type
 * specimen, colour swatches, a chart, a phone screen — starts scattered and
 * assembles into a coherent product as the section scrolls through. It is the
 * studio's process argued visually instead of described in a list.
 *
 * Each piece carries a different accent, which is the clearest demonstration
 * anywhere on the site that the palette is a system rather than one colour.
 */
export function IdeasCanvas() {
  const items: CanvasItem[] = [
    {
      id: "wireframe",
      x: 17,
      y: 24,
      w: 21,
      depth: 0.2,
      rotate: -3,
      scatter: { x: -22, y: -14, rotate: -14, scale: 0.86 },
      content: (
        <CanvasCard label="Wireframe" accent="indigo">
          <div className="p-3">
            <TextRows rows={[70, 44]} className="[&>div]:h-2.5" />
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="aspect-[4/3] rounded-[3px] border border-dashed border-hairline-strong"
                />
              ))}
            </div>
            <TextRows rows={[100, 82, 60]} className="mt-3" />
          </div>
        </CanvasCard>
      ),
    },
    {
      id: "type",
      x: 42,
      y: 13,
      w: 20,
      depth: 0.45,
      rotate: 2,
      scatter: { x: 10, y: -24, rotate: 9, scale: 0.9 },
      content: (
        <CanvasCard label="Typeface" accent="coral">
          <div className="p-4">
            <p className="font-display text-[2.5rem] leading-none tracking-[-0.04em] text-ink">
              Aa
            </p>
            <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-subtle">
              Display / 560
            </p>
            <div className="mt-3 space-y-1">
              <span className="block h-1.5 w-full rounded-full bg-surface-3" />
              <span className="block h-1.5 w-3/4 rounded-full bg-surface-3" />
            </div>
          </div>
        </CanvasCard>
      ),
      mobile: false,
    },
    {
      id: "swatches",
      x: 71,
      y: 16,
      w: 17,
      depth: 0.3,
      rotate: -2,
      scatter: { x: 24, y: -18, rotate: 12, scale: 0.88 },
      content: (
        <div className="rounded-md bg-surface p-2 shadow-lg">
          <SwatchStrip
            colors={[
              "var(--color-coral)",
              "var(--color-gold)",
              "var(--color-mint)",
              "var(--color-blue)",
              "var(--color-violet)",
              "var(--color-pink)",
            ]}
          />
          <p className="mt-2 px-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-ink-subtle">
            Palette
          </p>
        </div>
      ),
    },
    {
      id: "browser",
      x: 44,
      y: 52,
      w: 40,
      depth: 0.7,
      scatter: { x: 0, y: 26, rotate: -4, scale: 0.82 },
      content: (
        <CanvasCard className="shadow-xl" accent="mint">
          <div className="aspect-[16/10]">
            <BrowserChrome url="yourbrand.com">
              <WebsiteMockup className="h-full p-3" />
            </BrowserChrome>
          </div>
        </CanvasCard>
      ),
    },
    {
      id: "phone",
      x: 15,
      y: 62,
      w: 12,
      depth: 0.9,
      rotate: -5,
      scatter: { x: -18, y: 22, rotate: -16, scale: 0.8 },
      content: (
        <PhoneFrame>
          <AppScreenMockup variant="home" />
        </PhoneFrame>
      ),
    },
    {
      id: "chart",
      x: 80,
      y: 55,
      w: 20,
      depth: 0.55,
      rotate: 3,
      scatter: { x: 22, y: 16, rotate: 11, scale: 0.86 },
      content: (
        <CanvasCard label="Analytics" accent="blue">
          <div className="p-3">
            <AreaChart className="h-12" />
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              <StatTile label="Signups" value="—" trend="up" />
              <StatTile label="Churn" value="—" trend="flat" />
            </div>
          </div>
        </CanvasCard>
      ),
    },
    {
      id: "components",
      x: 27,
      y: 87,
      w: 22,
      depth: 0.4,
      rotate: 2,
      scatter: { x: -14, y: 20, rotate: 8, scale: 0.88 },
      content: (
        <CanvasCard label="Components" accent="violet">
          <div className="flex flex-wrap gap-1.5 p-3">
            <span className="h-6 rounded-full bg-ink px-3 text-[0.5625rem] leading-6 text-ink-inverse">
              Primary
            </span>
            <span className="h-6 rounded-full border border-hairline-strong px-3 text-[0.5625rem] leading-6 text-ink-muted">
              Ghost
            </span>
            <span className="h-6 rounded-full bg-accent px-3 text-[0.5625rem] leading-6 text-on-accent">
              Accent
            </span>
            <span className="h-6 w-full rounded-md border border-hairline bg-surface-2" />
          </div>
        </CanvasCard>
      ),
      mobile: false,
    },
    {
      id: "usage",
      x: 68,
      y: 88,
      w: 18,
      depth: 0.25,
      rotate: -3,
      scatter: { x: 16, y: 22, rotate: -10, scale: 0.9 },
      content: (
        <CanvasCard label="Usage" accent="pink">
          <div className="p-3">
            <BarChart className="h-12" />
          </div>
        </CanvasCard>
      ),
      mobile: false,
    },
  ];

  const ideasPhoto = getOptionalBrandImage("section-ideas-canvas");

  return (
    <Section className="overflow-hidden bg-surface">
      <SectionHeading
        eyebrow="How the work comes together"
        title="Where ideas take shape."
        lede="Strategy, design and engineering are not a relay. They happen on the same canvas — which is why the pieces below arrive loose and end up as one product."
      />

      {ideasPhoto ? (
        /*
          A photograph of an assembly half-built, with the remaining parts still
          loose around it — which is what the copy above actually describes. The
          freeform canvas of drawn cards below it stood in until this existed;
          it read as placeholder art because that is what it was.
        */
        <div
          {...revealProps()}
          className="relative mt-12 aspect-[16/9] overflow-hidden rounded-lg"
        >
          <BrandImage
            name={ideasPhoto}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            imgClassName="object-cover"
          />
        </div>
      ) : (
        <>
      <div {...revealProps()} className="relative mt-12">
        {/* Canvas ground: a faint measure grid, as on a real design surface. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(var(--color-hairline)_1px,transparent_1px),linear-gradient(90deg,var(--color-hairline)_1px,transparent_1px)] [background-size:56px_56px]"
          style={{
            maskImage:
              "radial-gradient(75% 70% at 50% 50%, #000 30%, transparent 88%)",
            WebkitMaskImage:
              "radial-gradient(75% 70% at 50% 50%, #000 30%, transparent 88%)",
          }}
        />

        <FreeformCanvas items={items} aspect={1.55} />
      </div>

      <p className="mt-8 text-center text-[0.875rem] text-ink-subtle lg:mt-4">
        Scroll to watch it assemble.
      </p>
        </>
      )}
    </Section>
  );
}
