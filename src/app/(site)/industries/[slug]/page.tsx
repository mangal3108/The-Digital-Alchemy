import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";

import { withOverrides } from "@/lib/content-overrides";
import { getIndustry, industrySlugs } from "@/content/industries";
import { getServices, serviceHref } from "@/content/services";
import { getIndustryAccent } from "@/content/accents";
import { getIndustryImage } from "@/content/service-imagery";

import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { FaqSection } from "@/components/ui/faq";
import { CtaSection } from "@/components/sections/cta";
import { ProjectCard } from "@/components/ui/project-card";
import { JsonLd } from "@/components/ui/json-ld";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { getPublishedProjects, getScopedFaqs } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return industrySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industryBase = getIndustry(slug);
  // Metadata runs in its own pass, so it has to resolve overrides too —
  // otherwise an edited meta title never reaches the document head.
  const industry = industryBase
    ? await withOverrides("industry", slug, industryBase)
    : null;
  if (!industry) return {};

  return buildMetadata({
    title: industry.metaTitle,
    description: industry.metaDescription,
    path: `/industries/${slug}`,
  });
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = getIndustry(slug);
  if (!base) notFound();
  const industry = await withOverrides("industry", slug, base);

  const services = getServices(industry.services);
  const accent = getIndustryAccent(slug);
  const heroImage = getIndustryImage(slug);

  // Case studies tagged with this industry. Renders nothing when there are
  // none, which is the honest state today.
  const allProjects = await getPublishedProjects();
  const projects = allProjects
    .filter(
      (project) =>
        project.industry?.toLowerCase() === industry.name.toLowerCase(),
    )
    .slice(0, 3);

  const extraFaqs = await getScopedFaqs("industry", slug);
  const faqs = [
    ...industry.faqs,
    ...extraFaqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
  ];

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Industries", href: "/industries" },
    { name: industry.name, href: `/industries/${slug}` },
  ];

  return (
    <div data-accent={accent}>
      <PageHero
        eyebrow={industry.eyebrow}
        title={industry.title}
        lede={industry.lede}
        crumbs={crumbs}
        primaryCta={{ label: "Start a Project", href: "/start-a-project" }}
        secondaryCta={{ label: "See our services", href: "/services" }}
        bleedImage={heroImage}
        bleedImageAlt=""
      />

      {/* ---- Challenges ---- */}
      <Section className="border-y border-hairline bg-surface">
        <SectionHeading
          eyebrow="What makes this sector different"
          title="The constraints that shape the work."
        />
        <div className="mt-11 grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {industry.challenges.map((challenge, index) => (
            <div
              key={challenge.title}
              {...revealProps(index * 60)}
              className="border-t border-hairline pt-5"
            >
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-ink">
                {challenge.title}
              </h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                {challenge.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Approach ---- */}
      <Section>
        <SectionHeading
          eyebrow="How we approach it"
          title="What we do differently here."
        />
        <div className="mt-11 grid gap-5 sm:grid-cols-2">
          {industry.approach.map((item, index) => (
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

      {/* ---- Practical considerations ---- */}
      <Section size="sm" className="border-y border-hairline bg-surface">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
          <div {...revealProps()}>
            <p className="eyebrow">Things we plan for</p>
            <h2 className="mt-3 text-title text-ink">
              The details that catch teams out in this sector.
            </h2>
          </div>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {industry.considerations.map((item, index) => (
              <li
                key={item}
                {...revealProps(index * 50)}
                className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink-muted"
              >
                <Check
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-accent"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---- Relevant services ---- */}
      <Section>
        <SectionHeading
          eyebrow="Services"
          title="What we are usually asked for here."
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

      {projects.length ? (
        <Section className="bg-surface">
          <SectionHeading
            eyebrow="Related work"
            title={`Projects in ${industry.name.toLowerCase()}.`}
          />
          <div className="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </Section>
      ) : null}

      <FaqSection items={faqs} title={`${industry.name} — common questions`} />

      <CtaSection
        title={`Working in ${industry.name.toLowerCase()}?`}
        body="Tell us what you are trying to fix. We will tell you how we would approach it, and whether we are genuinely the right team."
        secondary={{ label: "All industries", href: "/industries" }}
      />

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
      <JsonLd id="faq-schema" data={faqSchema(faqs)} />
    </div>
  );
}
