import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, ExternalLink } from "lucide-react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Section } from "@/components/ui/section-heading";
import { CtaSection } from "@/components/sections/cta";
import { JsonLd } from "@/components/ui/json-ld";
import { Button } from "@/components/ui/button";
import { ProductStatusBadge } from "@/components/sections/products-preview";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { getProductBySlug } from "@/lib/content";
import { parseJson } from "@/lib/utils";

interface Feature {
  title: string;
  body?: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return buildMetadata({
    title:
      product.metaTitle || `${product.name} | The Digital Alchemy`,
    description:
      product.metaDescription || product.tagline || product.description.slice(0, 160),
    path: `/products/${slug}`,
    image: product.media[0]?.media.url,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const features = parseJson<Feature[]>(product.features, []);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: product.name, href: `/products/${slug}` },
  ];

  return (
    <>
      {/* Product pages lean more "software" than the agency pages — a darker,
          more product-like hero, per the brief. */}
      <section
        data-surface="dark"
        className="relative overflow-hidden bg-canvas text-ink"
      >
        <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="container-page relative pb-14 pt-8 sm:pb-20">
          <Breadcrumb crumbs={crumbs} className="mb-8" />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-center">
            <div {...revealProps()}>
              <div className="flex items-center gap-3.5">
                {product.logo ? (
                  <Image
                    src={product.logo.url}
                    alt=""
                    width={52}
                    height={52}
                    className="size-13 rounded-lg object-contain"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex size-13 items-center justify-center rounded-lg bg-accent-soft text-xl font-semibold text-accent-text"
                  >
                    {product.name.charAt(0)}
                  </span>
                )}
                <ProductStatusBadge status={product.status} />
              </div>

              <h1 className="mt-6 text-display-2 text-ink">{product.name}</h1>
              {product.tagline ? (
                <p className="mt-4 max-w-xl text-lede text-ink-muted">
                  {product.tagline}
                </p>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                {product.websiteUrl ? (
                  <Button href={product.websiteUrl} variant="accent" size="lg">
                    Visit {product.name}
                    <ExternalLink aria-hidden="true" className="size-4" />
                  </Button>
                ) : null}
                {product.pricingUrl ? (
                  <Button
                    href={product.pricingUrl}
                    variant="secondary"
                    size="lg"
                  >
                    Pricing
                  </Button>
                ) : null}
                {product.ctaHref && product.ctaLabel ? (
                  <Button href={product.ctaHref} variant="secondary" size="lg">
                    {product.ctaLabel}
                  </Button>
                ) : null}
              </div>

              {product.platform ? (
                <p className="mt-6 text-[0.8125rem] text-ink-subtle">
                  Available on {product.platform}
                </p>
              ) : null}
            </div>

            {product.media[0] ? (
              <div
                {...revealProps(100, 22)}
                className="relative aspect-[4/3] overflow-hidden rounded-lg border border-hairline bg-surface"
              >
                <Image
                  src={product.media[0].media.url}
                  alt={product.media[0].media.alt || product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {product.description ? (
        <Section size="sm">
          <div
            {...revealProps()}
            className="max-w-prose space-y-4 text-[1.0625rem] leading-relaxed text-ink-muted"
          >
            {product.description.split(/\n{2,}/).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Section>
      ) : null}

      {features.length ? (
        <Section className="border-y border-hairline bg-surface">
          <h2 className="text-display-3 text-ink">What it does</h2>
          <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <li
                key={feature.title}
                {...revealProps(index * 50)}
                className="rounded-lg border border-hairline bg-canvas p-5"
              >
                <Check aria-hidden="true" className="size-4 text-accent" />
                <h3 className="mt-3 text-[1rem] font-semibold tracking-[-0.015em] text-ink">
                  {feature.title}
                </h3>
                {feature.body ? (
                  <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-muted">
                    {feature.body}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {product.media.length > 1 ? (
        <Section>
          <h2 className="text-display-3 text-ink">Screenshots</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {product.media.slice(1).map((item) => (
              <figure key={item.id}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-md border border-hairline bg-surface-2">
                  <Image
                    src={item.media.url}
                    alt={item.media.alt || item.caption || ""}
                    fill
                    sizes="(max-width: 640px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
                {item.caption ? (
                  <figcaption className="mt-2 text-[0.8125rem] text-ink-subtle">
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaSection
        title="Want something like this built?"
        body="We take products from first scope through to billing, launch and the ongoing work of running them."
        secondary={{ label: "SaaS development", href: "/services/saas-development" }}
      />

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}
