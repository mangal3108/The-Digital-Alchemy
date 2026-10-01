import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { BrandLogos } from "@/components/ui/brand-logos";
import { Section } from "@/components/ui/section-heading";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { CtaSection } from "@/components/sections/cta";
import { JsonLd } from "@/components/ui/json-ld";
import { ProductStatusBadge } from "@/components/sections/products-preview";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { getPublishedProducts } from "@/lib/content";
import { DashboardMockup } from "@/components/visuals/mockups";
import { getOptionalBrandImage } from "@/components/ui/brand-image";
import { PRIMARY_CTA } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Our Own Software Products | The Digital Alchemy",
    description:
      "Software products we build and run ourselves, alongside our client work. Running our own products keeps our advice honest.",
    path: "/products",
  });
}

export default async function ProductsPage() {
  const products = await getPublishedProducts();
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Our products"
        title={
          products.length
            ? "Software products we build, run and support ourselves."
            : "Our products: our own software, in development."
        }
        lede={
          products.length
            ? "Running our own products keeps us honest about what it really takes: speed, pricing, support, and keeping customers happy."
            : "We build our own software and AI tools alongside client work. It keeps our advice to clients grounded in what actually works."
        }
        crumbs={crumbs}
        primaryCta={
          products.length
            ? undefined
            : { label: PRIMARY_CTA.label, href: PRIMARY_CTA.href }
        }
        bleedImage={getOptionalBrandImage("hero-products")}
        bleedImageAlt=""
        visual={
          /*
            The drawn dashboard that used to sit here carried invented MRR,
            active-user and churn figures on a page about products that are
            still in development. It stays only as a fallback until the
            photograph exists, and goes for good once it does.
          */
          products.length || getOptionalBrandImage("hero-products") ? undefined : (
            <div className="overflow-hidden rounded-lg border border-hairline bg-surface shadow-lg">
              <div className="h-72">
                <DashboardMockup />
              </div>
            </div>
          )
        }
      />

      {/* ---- Technologies strip ---- */}
      <section className="border-b border-hairline bg-surface/60 py-6 sm:py-7">
        <div className="container-page">
          <BrandLogos
            slugs={[
              "nextjs",
              "typescript",
              "postgresql",
              "redis",
              "aws",
              "stripe",
              "docker",
              "openai",
            ]}
            title="Built with modern standards"
            layout="strip"
            size="md"
          />
        </div>
      </section>

      {products.length ? (
        <Section size="sm" className="relative overflow-hidden">
          <SectionBackdrop name="section-ideas-canvas" from="var(--color-canvas)" opacity={0.12} side="center" />
          <div className="relative">
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <li key={product.id} {...revealProps(index * 60)}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="group flex h-full flex-col rounded-lg border border-hairline bg-surface p-6 transition-[border-color,box-shadow,transform] duration-[var(--duration-standard)] ease-standard hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      {product.logo ? (
                        <Image
                          src={product.logo.url}
                          alt=""
                          width={44}
                          height={44}
                          className="size-11 rounded-md object-contain"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="flex size-11 items-center justify-center rounded-md bg-accent-soft text-lg font-semibold text-accent-text"
                        >
                          {product.name.charAt(0)}
                        </span>
                      )}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="mt-1 size-4 shrink-0 text-ink-subtle transition-[transform,color] duration-[var(--duration-fast)] ease-standard group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text motion-reduce:transition-none"
                      />
                    </div>

                    <h2 className="mt-5 text-title text-ink">{product.name}</h2>
                    {product.tagline ? (
                      <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                        {product.tagline}
                      </p>
                    ) : null}

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <ProductStatusBadge status={product.status} />
                      {product.category ? (
                        <span className="text-[0.75rem] text-ink-subtle">
                          {product.category}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : (
        <Section size="sm" className="relative overflow-hidden">
          <SectionBackdrop name="section-ideas-canvas" from="var(--color-canvas)" opacity={0.12} side="center" />
          <div
            {...revealProps()}
            className="relative mx-auto max-w-3xl rounded-lg border border-hairline bg-surface p-7 sm:p-10"
          >
            <h2 className="text-title text-ink">
              In the meantime, we build software and AI tools for other businesses
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
              Online software people pay for monthly, tools that do repetitive
              work automatically, AI assistants and mobile apps. From the first
              plan to payments, launch and growth.
            </p>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-muted">
              See{" "}
              <Link href="/services/saas-development" className="font-medium text-accent-text underline underline-offset-4">
                SaaS development
              </Link>{" "}
              and{" "}
              <Link href="/services/automation-integrations" className="font-medium text-accent-text underline underline-offset-4">
                AI automation
              </Link>
              .
            </p>
          </div>
        </Section>
      )}

      {products.length ? (
        <CtaSection
          title="Have an idea for a software product?"
          body="We take it from a first sample to software customers pay for, and we tell you early if the plan needs to change."
        />
      ) : null}

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}
