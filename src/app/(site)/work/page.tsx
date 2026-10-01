import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { BrandLogos } from "@/components/ui/brand-logos";
import { Section } from "@/components/ui/section-heading";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { CtaSection } from "@/components/sections/cta";
import { JsonLd } from "@/components/ui/json-ld";
import { WorkGrid } from "@/components/sections/work-grid";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { getPublishedProjects } from "@/lib/content";
import { getOptionalBrandImage } from "@/components/ui/brand-image";
import { PRIMARY_CTA } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Our Work and Case Studies | The Digital Alchemy",
    description:
      "Websites, apps, AI tools and marketing we have built, published only with each client's permission. Ask us for examples on a call.",
    path: "/work",
  });
}

export default async function WorkPage() {
  const projects = await getPublishedProjects();
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Work", href: "/work" },
  ];

  const categories = Array.from(
    new Set(projects.map((project) => project.category)),
  );

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title={
          projects.length
            ? "Work we have built, and what it changed."
            : "Our work: see examples on a short call."
        }
        lede={
          projects.length
            ? "The problem each client brought us, what we built, and the results they saw."
            : "We publish a client's work only with their permission. Until the first case studies are ready, we are glad to walk you through examples like the thing you have in mind."
        }
        crumbs={crumbs}
        primaryCta={
          projects.length
            ? undefined
            : { label: PRIMARY_CTA.label, href: PRIMARY_CTA.href }
        }
        bleedImage={getOptionalBrandImage("hero-work")}
        bleedImageAlt=""
      />

      {/* ---- Stack & Platforms strip ---- */}
      <section className="border-b border-hairline bg-surface/60 py-6 sm:py-7">
        <div className="container-page">
          <BrandLogos
            slugs={[
              "nextjs",
              "react",
              "nodejs",
              "typescript",
              "aws",
              "postgresql",
              "stripe",
              "shopify",
              "google-ads",
              "meta",
            ]}
            title="Platforms & technologies featured across our work"
            layout="strip"
            size="md"
          />
        </div>
      </section>

      {projects.length ? (
        <Section size="sm" className="relative overflow-hidden">
          <SectionBackdrop name="hero-work" from="var(--color-canvas)" opacity={0.12} side="center" />
          <div className="relative">
            <WorkGrid projects={projects} categories={categories} />
          </div>
        </Section>
      ) : (
        <Section size="sm" className="relative overflow-hidden">
          <SectionBackdrop name="hero-work" from="var(--color-canvas)" opacity={0.12} side="center" />
          <div
            {...revealProps()}
            className="relative mx-auto max-w-3xl rounded-lg border border-hairline bg-surface p-7 sm:p-10"
          >
            <h2 className="text-title text-ink">
              What we can show you on a call
            </h2>
            <ul className="mt-5 space-y-3.5">
              {[
                "Work close to what you need, including projects we are not allowed to publish.",
                "How we would approach your own website, app or marketing.",
                "A written plan afterwards, so you can judge how we think before you decide anything.",
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
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-muted">
              Use the button at the top, or the call and WhatsApp options at
              the bottom of this page. Case studies will appear here as clients
              approve them.
            </p>
          </div>
        </Section>
      )}

      {/* One call to action: the hero's while there is no work to show, this
          one once there is. */}
      {projects.length ? (
        <CtaSection
          title="Have something similar in mind?"
          body="Tell us the problem you are trying to solve. We will tell you how we would approach it and whether we are the right team for it."
        />
      ) : null}

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}
