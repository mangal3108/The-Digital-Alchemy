import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section-heading";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { CtaSection } from "@/components/sections/cta";
import { JsonLd } from "@/components/ui/json-ld";
import { ProductStatusBadge } from "@/components/sections/products-preview";
import { Button } from "@/components/ui/button";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { getPublishedProducts } from "@/lib/content";
import { DashboardMockup } from "@/components/visuals/mockups";
import { getOptionalBrandImage } from "@/components/ui/brand-image";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "AI-Ready Products & Autonomous Software | The Digital Alchemy",
    description:
      "AI-ready digital products, autonomous agents, and software platforms engineered and operated by The Digital Alchemy.",
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
        eyebrow="AI-Ready Products"
        title={
          products.length
            ? "Software and AI-ready products we build, run and support."
            : "Our own AI-ready products are in active development."
        }
        lede={
          products.length
            ? "Running our own AI-ready platforms keeps us honest about what shipping actually costs — inference latency, pricing, support, churn, and enterprise reliability."
            : "We architect and ship AI-ready software and autonomous tools alongside client work. It is the fastest way to stay ahead on real-world AI architecture, agentic orchestration, and production engineering."
        }
        crumbs={crumbs}
        primaryCta={
          products.length
            ? undefined
            : { label: "Build an AI product with us", href: "/start-a-project" }
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
              In the meantime, we build AI-ready products for ambitious companies
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
              AI-ready SaaS platforms, autonomous workflow tools, custom agent systems, and mobile applications — from first architectural prompt through to billing, deployment, and autonomous scale.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/services/saas-development" withArrow>
                AI-ready SaaS development
              </Button>
              <Button href="/services/automation-integrations" variant="secondary">
                AI automation &amp; integrations
              </Button>
            </div>
            <p className="mt-7 border-t border-hairline pt-5 text-[0.8125rem] leading-relaxed text-ink-subtle">
              Note for the site administrator: products added under
              Admin → Products appear here once published.
            </p>
          </div>
        </Section>
      )}

      <CtaSection
        title="Building an AI-ready product or automation?"
        body="We take systems from a first prototype to production-grade software customers pay for — and we will tell you early if the architecture needs reshaping."
        secondary={{ label: "AI SaaS development", href: "/services/saas-development" }}
      />

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}
