import type { Metadata } from "next";
import { getOptionalBrandImage } from "@/components/ui/brand-image";
import Link from "next/link";
import Image from "next/image";

import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section-heading";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { CtaSection } from "@/components/sections/cta";
import { JsonLd } from "@/components/ui/json-ld";
import { Button } from "@/components/ui/button";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { getCategories, getPublishedPosts } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Insights — Notes on Product, Software & Growth | The Digital Alchemy",
    description:
      "Practical writing on SaaS and software development, web and app builds, design, SEO and digital marketing — from a studio that does the work.",
    path: "/insights",
  });
}

export default async function InsightsPage() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
  ]);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Insights", href: "/insights" },
  ];

  const [featured, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={
          posts.length
            ? "Notes on building and growing digital products."
            : "We are writing this properly rather than quickly."
        }
        lede={
          posts.length
            ? "Written by the people doing the work, about decisions we have actually had to make. No listicles."
            : "Rather than publish filler to fill a blog, articles will appear here as we write them — practical pieces on the decisions that come up in real projects."
        }
        crumbs={crumbs}
        primaryCta={
          posts.length ? undefined : { label: "Start a Project", href: "/start-a-project" }
        }
              bleedImage={getOptionalBrandImage("hero-insights")}
        bleedImageAlt=""
      />

      {posts.length ? (
        <Section size="sm" className="relative overflow-hidden">
          <SectionBackdrop name="hero-insights" from="var(--color-canvas)" opacity={0.12} side="center" />
          <div className="relative">
            {/* Featured article */}
            {featured ? (
            <Link
              href={`/insights/${featured.slug}`}
              {...revealProps()}
              className="group grid gap-6 overflow-hidden rounded-lg border border-hairline bg-surface transition-[box-shadow,border-color] duration-[var(--duration-standard)] hover:border-hairline-strong hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus lg:grid-cols-2"
            >
              {featured.hero ? (
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-2 lg:aspect-auto lg:h-full">
                  <Image
                    src={featured.hero.url}
                    alt={featured.hero.alt || ""}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[var(--duration-slow)] ease-standard group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
              ) : null}

              <div className="flex flex-col justify-center p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="eyebrow">Latest</span>
                  {featured.category ? (
                    <>
                      <span aria-hidden="true" className="text-hairline-strong">·</span>
                      <span className="eyebrow">{featured.category.name}</span>
                    </>
                  ) : null}
                </div>
                <h2 className="mt-3 text-display-3 text-ink">{featured.title}</h2>
                {featured.excerpt ? (
                  <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-muted">
                    {featured.excerpt}
                  </p>
                ) : null}
                <p className="mt-5 text-[0.8125rem] text-ink-subtle">
                  {featured.publishedAt ? formatDate(featured.publishedAt) : null}
                  {" · "}
                  {featured.readingMinutes} min read
                </p>
              </div>
            </Link>
          ) : null}

          {categories.length ? (
            <ul {...revealProps(60)} className="mt-10 flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/insights?category=${category.slug}`}
                    className="inline-flex h-9 items-center rounded-full border border-hairline px-3.5 text-[0.8125rem] font-medium text-ink-muted transition-colors duration-[var(--duration-fast)] hover:border-hairline-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          {rest.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/insights/${post.slug}`}
                  {...revealProps(index * 60)}
                  className="group flex flex-col overflow-hidden rounded-lg border border-hairline bg-surface transition-[box-shadow,border-color,transform] duration-[var(--duration-standard)] ease-standard hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0"
                >
                  {post.hero ? (
                    <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
                      <Image
                        src={post.hero.url}
                        alt={post.hero.alt || ""}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-[var(--duration-slow)] ease-standard group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-5">
                    {post.category ? (
                      <span className="eyebrow">{post.category.name}</span>
                    ) : null}
                    <h3 className="mt-2.5 text-[1.125rem] font-semibold leading-snug tracking-[-0.02em] text-ink">
                      {post.title}
                    </h3>
                    {post.excerpt ? (
                      <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                        {post.excerpt}
                      </p>
                    ) : null}
                    <p className="mt-5 text-[0.8125rem] text-ink-subtle">
                      {post.publishedAt ? formatDate(post.publishedAt) : null}
                      {" · "}
                      {post.readingMinutes} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
          </div>
        </Section>
      ) : (
        <Section size="sm" className="relative overflow-hidden">
          <SectionBackdrop name="hero-insights" from="var(--color-canvas)" opacity={0.12} side="center" />
          <div
            {...revealProps()}
            className="relative mx-auto max-w-3xl rounded-lg border border-hairline bg-surface p-7 sm:p-10"
          >
            <h2 className="text-title text-ink">What will be here</h2>
            <ul className="mt-5 space-y-3">
              {[
                "How we scope a SaaS first release, and what we deliberately leave out.",
                "The checkout and product-page changes that move e-commerce conversion.",
                "What actually causes a site migration to lose search visibility.",
                "Choosing between custom software and configuring something off the shelf.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink-muted"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-accent"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href="/start-a-project" withArrow>
                Ask us directly instead
              </Button>
            </div>
            <p className="mt-7 border-t border-hairline pt-5 text-[0.8125rem] leading-relaxed text-ink-subtle">
              Note for the site administrator: articles written under
              Admin → Insights appear here once published.
            </p>
          </div>
        </Section>
      )}

      <CtaSection
        title="Have a question we have not written about?"
        body="Ask it directly. We would rather answer the specific version of your question than point you at a general article."
        secondary={{ label: "See our services", href: "/services" }}
      />

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}
