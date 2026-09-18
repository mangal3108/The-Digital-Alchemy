import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin } from "lucide-react";

import { withOverrides } from "@/lib/content-overrides";
import { getMarket, marketSlugs } from "@/content/locations";
import { getServices, serviceHref } from "@/content/services";
import { getMarketAccent } from "@/content/accents";

import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { FaqSection } from "@/components/ui/faq";
import { CtaSection } from "@/components/sections/cta";
import { JsonLd } from "@/components/ui/json-ld";
import { revealProps } from "@/lib/reveal";
import {
  buildMetadata,
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
} from "@/lib/seo";
import { getScopedFaqs } from "@/lib/content";
import { BrandImage, getOptionalBrandImage } from "@/components/ui/brand-image";
import { getSiteSettings, formatAddress } from "@/lib/settings";

export const dynamicParams = false;

export function generateStaticParams() {
  return marketSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const marketBase = getMarket(slug);
  // Metadata runs in its own pass, so it has to resolve overrides too —
  // otherwise an edited meta title never reaches the document head.
  const market = marketBase
    ? await withOverrides("location", slug, marketBase)
    : null;
  if (!market) return {};

  return buildMetadata({
    title: market.metaTitle,
    description: market.metaDescription,
    path: `/locations/${slug}`,
  });
}

export default async function MarketPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = getMarket(slug);
  if (!base) notFound();
  const market = await withOverrides("location", slug, base);

  const settings = await getSiteSettings();
  const services = getServices(market.services);
  const isHq = market.type === "headquarters";
  const accent = getMarketAccent(slug);

  const extraFaqs = await getScopedFaqs("location", slug);
  const faqs = [
    ...market.faqs,
    ...extraFaqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
  ];

  // LocalBusiness schema belongs on the headquarters page only. Emitting it on
  // a market page we have no premises in would be misrepresentation.
  const localBusiness = isHq ? await localBusinessSchema() : null;

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Locations", href: "/locations" },
    { name: market.country, href: `/locations/${slug}` },
  ];

  return (
    <div data-accent={accent}>
      <PageHero
        eyebrow={market.eyebrow}
        title={market.title}
        lede={market.lede}
        crumbs={crumbs}
        primaryCta={{ label: "Start a Project", href: "/start-a-project" }}
        secondaryCta={{ label: "See our services", href: "/services" }}
        backdropImage={getOptionalBrandImage("world-etched-light")}
        backdropOpacity={0.12}
        visual={
          <div
            className="relative opacity-90"
            style={{
              maskImage:
                "radial-gradient(80% 80% at 50% 50%, #000 50%, transparent 94%)",
              WebkitMaskImage:
                "radial-gradient(80% 80% at 50% 50%, #000 50%, transparent 94%)",
            }}
          >
            <BrandImage
              // The etched aluminium sphere once it exists; until then the
              // original supplied globe, which is the last asset still
              // coming from that set.
              name={getOptionalBrandImage("object-globe-etched") ?? "world-globe-light"}
              alt=""
              priority
              sizes="(max-width: 1024px) 60vw, 40vw"
            />
          </div>
        }
      />

      {/* ---- Presence, stated plainly ---- */}
      <Section size="sm" className="border-y border-hairline bg-surface">
        <div className="grid gap-5 md:grid-cols-2">
          <div
            {...revealProps()}
            className="rounded-lg border border-hairline bg-canvas p-6"
          >
            <div className="flex items-center gap-2.5">
              <MapPin aria-hidden="true" className="size-4 text-accent" />
              <p className="eyebrow">
                {isHq ? "Our office" : "Our presence here"}
              </p>
            </div>
            <p className="mt-3.5 text-[1rem] leading-relaxed text-ink">
              {market.presence}
            </p>
            {isHq ? (
              <p className="mt-3 text-[0.875rem] text-ink-muted">
                {formatAddress(settings)}
              </p>
            ) : null}
          </div>

          <div
            {...revealProps(70)}
            className="rounded-lg border border-hairline bg-canvas p-6"
          >
            <div className="flex items-center gap-2.5">
              <Clock aria-hidden="true" className="size-4 text-accent" />
              <p className="eyebrow">Working hours overlap</p>
            </div>
            <p className="mt-3.5 text-[1rem] font-medium text-ink">
              {market.timezone.overlap}
            </p>
            <p className="mt-1 text-[0.8125rem] text-ink-subtle">
              {market.timezone.label}
            </p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
              {market.timezone.detail}
            </p>
          </div>
        </div>
      </Section>

      {/* ---- Working model ---- */}
      <Section>
        <SectionHeading
          eyebrow="How we work together"
          title={
            isHq
              ? "What working with a local studio actually gets you."
              : "How a remote engagement runs in practice."
          }
        />
        <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {market.workingModel.map((item, index) => (
            <div
              key={item.title}
              {...revealProps(index * 60)}
              className="rounded-lg border border-hairline bg-surface p-6"
            >
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-ink">
                {item.title}
              </h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Practicalities ---- */}
      <Section className="border-y border-hairline bg-surface">
        <SectionHeading
          eyebrow="Practicalities"
          title={`What is specific to ${market.country}.`}
          lede="The details that differ by market — regulation, payment expectations, language and where data is allowed to live."
        />
        <div className="mt-11 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {market.practicalities.map((item, index) => (
            <div
              key={item.title}
              {...revealProps(index * 60)}
              className="border-t border-hairline pt-5"
            >
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-ink">
                {item.title}
              </h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Services ---- */}
      <Section>
        <SectionHeading
          eyebrow="Services"
          title={`What clients in ${market.country} usually ask for.`}
        />
        <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <li key={service.slug} {...revealProps(index * 50)}>
              <Link
                href={serviceHref(service.slug)}
                className="group flex h-full flex-col rounded-lg border border-hairline bg-surface p-5 transition-[border-color,box-shadow,transform] duration-[var(--duration-standard)] ease-standard hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0"
              >
                <span className="text-[1rem] font-semibold tracking-[-0.015em] text-ink">
                  {service.name}
                </span>
                <span className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-ink-muted">
                  {service.summary}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <FaqSection items={faqs} title={`Working with us from ${market.country}`} />

      <CtaSection
        title={`Based in ${market.country}?`}
        body="Tell us what you are planning. We will set out how the engagement would run, including the practical details of working across the time difference."
        secondary={{ label: "All markets", href: "/locations" }}
      />

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
      <JsonLd id="faq-schema" data={faqSchema(faqs)} />
      {localBusiness ? (
        <JsonLd id="local-business-schema" data={localBusiness} />
      ) : null}
    </div>
  );
}
