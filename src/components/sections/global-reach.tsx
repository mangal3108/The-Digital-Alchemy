import Link from "next/link";

import { Section, SectionHeading } from "@/components/ui/section-heading";
import { revealProps } from "@/lib/reveal";
import { markets } from "@/content/locations";
import { Globe, type GlobeMarker } from "@/components/visuals/globe";
import { BrandImage } from "@/components/ui/brand-image";

/**
 * Markets served.
 *
 * The globe renders real country geometry rather than a decorative wireframe —
 * the six markets are highlighted on the actual map, with the studio in New
 * Delhi marked distinctly from the countries we serve remotely.
 *
 * The globe is decorative in the accessibility sense; the list beside it is the
 * real content, carries the links, and is what small screens get.
 */
export function GlobalReach() {
  const globeMarkers: GlobeMarker[] = markets.map((market) => ({
    code: market.isoNumeric,
    name: market.country,
    lat: market.coordinates.lat,
    lon: market.coordinates.lon,
    isHome: market.type === "headquarters",
  }));

  return (
    <Section className="bg-surface">
      <SectionHeading
        eyebrow="Where we work"
        title="Built in India. Working globally."
        lede="One studio in New Delhi, working remotely with clients in six markets. We are precise about that distinction — these are the places we serve, not places we have offices."
      />

      <div className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        {/* ---- Globe ----
            The rendered map sits behind the live globe as atmosphere, masked
            and heavily faded so it reads as depth rather than a second image.
            The interactive globe stays the subject — it carries the real
            country data and the actual markets. */}
        <div {...revealProps()} className="relative hidden justify-center sm:flex">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-[0.16]"
            style={{
              maskImage:
                "radial-gradient(60% 60% at 50% 50%, transparent 38%, #000 78%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(60% 60% at 50% 50%, transparent 38%, #000 78%, transparent 100%)",
            }}
          >
            <BrandImage
              name="world-etched-light"
              alt=""
              sizes="40vw"
              className="w-[128%] max-w-none"
            />
          </div>

          <div className="w-full max-w-[30rem]">
            <Globe markers={globeMarkers} />
          </div>
        </div>

        {/* ---- The actual content ---- */}
        <div {...revealProps(90)}>
          <ul className="divide-y divide-hairline border-y border-hairline">
            {markets.map((market) => (
              <li key={market.slug}>
                <Link
                  href={`/locations/${market.slug}`}
                  className="group flex items-center justify-between gap-4 py-4 transition-colors duration-[var(--duration-fast)] hover:bg-canvas focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={
                        market.type === "headquarters"
                          ? "size-2 shrink-0 rounded-full bg-accent ring-4 ring-accent-soft"
                          : "size-2 shrink-0 rounded-full border border-accent"
                      }
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-[1.0625rem] font-medium text-ink">
                        {market.country}
                      </span>
                      <span className="block text-[0.8125rem] text-ink-subtle">
                        {market.type === "headquarters"
                          ? "Studio — Uttam Nagar, New Delhi"
                          : `Clients served remotely · ${market.timezone.overlap}`}
                      </span>
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-ink-subtle transition-transform duration-[var(--duration-fast)] ease-standard group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-[0.875rem] leading-relaxed text-ink-muted">
            Every engagement outside India runs remotely, with a held overlap
            window for calls and decisions recorded in writing. Each market page
            sets out the actual time-zone overlap and how contracting works
            there.
          </p>
        </div>
      </div>
    </Section>
  );
}
