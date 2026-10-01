import type { Metadata } from "next";
import { BrandImage, getOptionalBrandImage } from "@/components/ui/brand-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { withOverridesAll } from "@/lib/content-overrides";
import { industries } from "@/content/industries";
import { getIndustryAccent } from "@/content/accents";
import { getIndustryImage } from "@/content/service-imagery";
import { PageHero } from "@/components/sections/page-hero";
import { BrandLogos } from "@/components/ui/brand-logos";
import { Section } from "@/components/ui/section-heading";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { CtaSection } from "@/components/sections/cta";
import { JsonLd } from "@/components/ui/json-ld";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Industries We Help | The Digital Alchemy",
    description:
      "What we do for clinics, shops, restaurants, coaching institutes, real estate, finance firms, online brands and startups. Get a free consultation.",
    path: "/industries",
  });
}

export default async function IndustriesPage() {
  const resolvedIndustries = await withOverridesAll("industry", industries, (i) => i.slug);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Industries", href: "/industries" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Industries we help, and what we can do for each."
        lede="Clinics, shops, restaurants, coaching institutes, property businesses and more. Each industry has its own rules and busy seasons, and each page explains how we would help a business like yours."
        crumbs={crumbs}
              bleedImage={getOptionalBrandImage("hero-industries")}
        bleedImageAlt=""
      />

      {/* ---- Industry platform overview strip ---- */}
      <section className="border-b border-hairline bg-surface/60 py-6 sm:py-7">
        <div className="container-page">
          <BrandLogos
            slugs={[
              "shopify",
              "woocommerce",
              "stripe",
              "razorpay",
              "whatsapp",
              "aws",
              "google-ads",
              "meta",
            ]}
            title="Platforms & ecosystems we build for across sectors"
            layout="strip"
            size="md"
          />
        </div>
      </section>

      <Section size="sm" className="relative overflow-hidden">
        <SectionBackdrop name="plate-bench-aluminium" from="var(--color-canvas)" opacity={0.12} side="center" />
        <div className="relative">
          {/* Said once, plainly, rather than implied across nine pages. */}
          <p
            {...revealProps()}
            className="max-w-3xl rounded-md border border-hairline bg-surface p-5 text-[0.9375rem] leading-relaxed text-ink-muted"
          >
            A note on these pages: they explain how we would approach each
            industry and the problems common in it. They are not a claim to a
            client list we cannot show you. Where a client has allowed us to
            publish their work, it appears on the right page. Where not, the page
            says nothing rather than suggest otherwise.
          </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resolvedIndustries.map((industry, index) => (
            <li
              key={industry.slug}
              data-accent={getIndustryAccent(industry.slug)}
              {...revealProps(index * 50)}
            >
              <Link
                href={`/industries/${industry.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-hairline bg-surface transition-[border-color,box-shadow,transform] duration-[var(--duration-standard)] ease-standard hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0"
              >
                {/*
                  These cards were text only, which is why the page read as a
                  list rather than a section. Each sector now leads with its own
                  hardware and its own accent.
                */}
                <div className="relative h-40 shrink-0 overflow-hidden">
                  <BrandImage
                    name={getIndustryImage(industry.slug)!}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    imgClassName="object-cover transition-transform duration-[var(--duration-slow)] ease-standard group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
                    style={{
                      background:
                        "linear-gradient(to top, var(--color-surface) 0%, transparent 100%)",
                    }}
                  />
                </div>

                <div className="flex flex-1 flex-col p-6 pt-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-title text-ink">{industry.name}</h2>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-1.5 size-4 shrink-0 text-ink-subtle transition-[transform,color] duration-[var(--duration-fast)] ease-standard group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text motion-reduce:transition-none"
                  />
                </div>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {industry.summary}
                </p>
                {/* The three things we can do for this kind of business. */}
                <ul className="mt-4 flex-1 space-y-1.5">
                  {industry.examples.map((example) => (
                    <li
                      key={example.title}
                      className="flex items-start gap-2 text-[0.875rem] text-ink-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.5rem] size-1 shrink-0 rounded-full bg-accent"
                      />
                      {example.title}
                    </li>
                  ))}
                </ul>
                <span
                  aria-hidden="true"
                  className="mt-4 block h-0.5 w-10 rounded-full bg-accent transition-[width] duration-[var(--duration-slow)] ease-standard group-hover:w-16"
                />
                </div>
              </Link>
            </li>
          ))}
        </ul>
        </div>
      </Section>

      <CtaSection
        title="Not on the list?"
        body="Your industry matters less than your problem. Tell us about it, and we will tell you honestly whether we can help."
      />

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}
