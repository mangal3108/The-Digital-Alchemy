import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { markets } from "@/content/locations";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section-heading";
import { CtaSection } from "@/components/sections/cta";
import { JsonLd } from "@/components/ui/json-ld";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { BrandImage, getOptionalBrandImage } from "@/components/ui/brand-image";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Locations & Markets | The Digital Alchemy",
    description:
      "Our headquarters in New Delhi and the international markets we serve remotely — United States, Australia, United Kingdom, Canada and UAE.",
    path: "/locations",
  });
}

export default function LocationsPage() {
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Locations", href: "/locations" },
  ];

  const hq = markets.filter((market) => market.type === "headquarters");
  const remote = markets.filter((market) => market.type === "client-market");

  return (
    <>
      <PageHero
        eyebrow="Locations"
        title="One studio. Six markets."
        lede="We are a New Delhi studio. Everywhere else on this page is a market we serve remotely — and each page sets out exactly what that means in practice."
        crumbs={crumbs}
        backdropImage={getOptionalBrandImage("object-globe-etched")}
        backdropOpacity={0.15}
        visual={
          <div
            className="relative"
            style={{
              maskImage:
                "radial-gradient(85% 85% at 50% 50%, #000 55%, transparent 96%)",
              WebkitMaskImage:
                "radial-gradient(85% 85% at 50% 50%, #000 55%, transparent 96%)",
            }}
          >
            <BrandImage
              name="world-etched-light"
              alt=""
              priority
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>
        }
      />

      <Section size="sm" className="relative overflow-hidden">
        <SectionBackdrop name="world-etched-light" from="var(--color-canvas)" opacity={0.14} side="right" />
        <div className="relative">
          <div {...revealProps()}>
            <p className="eyebrow">Where we are</p>
            <MarketList markets={hq} />
          </div>

          <div {...revealProps(80)} className="mt-12">
            <p className="eyebrow">Markets we serve remotely</p>
            <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-muted">
              No offices in these countries, and we do not pretend otherwise. What
              we do have is a working model built for the distance: a held overlap
              window, decisions recorded in writing, and an environment you can
              check whenever you want.
            </p>
            <MarketList markets={remote} />
          </div>
        </div>
      </Section>

      <CtaSection
        title="Working somewhere else?"
        body="We are not limited to these markets — they are simply the ones we work in most. Tell us where you are and we will be straight about whether the time difference works."
        secondary={{ label: "How we work", href: "/about" }}
      />

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}

function MarketList({ markets: list }: { markets: typeof markets }) {
  return (
    <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((market, index) => (
        <li key={market.slug} {...revealProps(index * 50)}>
          <Link
            href={`/locations/${market.slug}`}
            className="group flex h-full flex-col rounded-lg border border-hairline bg-surface p-6 transition-[border-color,box-shadow,transform] duration-[var(--duration-standard)] ease-standard hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    market.type === "headquarters"
                      ? "bg-accent ring-4 ring-accent-soft"
                      : "border border-accent",
                  )}
                />
                <span className="text-title text-ink">{market.country}</span>
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="mt-1.5 size-4 shrink-0 text-ink-subtle transition-[transform,color] duration-[var(--duration-fast)] ease-standard group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text motion-reduce:transition-none"
              />
            </div>

            <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-ink-muted">
              {market.type === "headquarters"
                ? "Our studio. In-person meetings possible across Delhi NCR."
                : market.timezone.detail}
            </p>

            <p className="mt-4 border-t border-hairline pt-3 text-[0.75rem] text-ink-subtle">
              {market.timezone.overlap}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
