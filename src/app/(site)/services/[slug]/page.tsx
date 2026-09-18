import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";

import {
  getService,
  serviceSlugs,
  serviceHref,
  getServices,
  SERVICE_GROUPS,
} from "@/content/services";
import { getTechnologies } from "@/content/technology";
import { getEngagementModels } from "@/content/engagement";
import { withOverrides } from "@/lib/content-overrides";
import { getServiceDiagram } from "@/content/diagrams";

import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { FaqSection } from "@/components/ui/faq";
import { CtaSection } from "@/components/sections/cta";
import { ProjectCard } from "@/components/ui/project-card";
import { JsonLd } from "@/components/ui/json-ld";
import { FlowDiagram, FlowSteps } from "@/components/visuals/flow-diagram";
import { ServiceVisualScene } from "@/components/visuals/service-visuals";
import { getServiceImage } from "@/content/service-imagery";
import { getServiceAccent } from "@/content/accents";
import { TextLink } from "@/components/ui/button";
import { revealProps } from "@/lib/reveal";

import {
  buildMetadata,
  breadcrumbSchema,
  faqSchema,
  serviceSchema,
} from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";
import { getProjectsForService, getScopedFaqs } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const serviceBase = getService(slug);
  // Metadata runs in its own pass, so it has to resolve overrides too —
  // otherwise an edited meta title never reaches the document head.
  const service = serviceBase
    ? await withOverrides("service", slug, serviceBase)
    : null;
  if (!service) return {};

  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: serviceHref(slug),
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const base = getService(slug);
  if (!base) notFound();
  // Admin copy edits sit over the typed content file. With no overrides this
  // is the same object the code exports.
  const service = await withOverrides("service", slug, base);

  const settings = await getSiteSettings();
  const technologies = getTechnologies(service.technologies);
  const engagement = getEngagementModels(service.engagement);
  const related = getServices(service.related);
  const diagram = getServiceDiagram(slug);
  const projects = await getProjectsForService(slug, 3);
  const heroImage = getServiceImage(slug);
  const accent = getServiceAccent(slug);

  // Registry FAQs plus anything an administrator has attached to this service.
  const extraFaqs = await getScopedFaqs("service", slug);
  const faqs = [
    ...service.faqs,
    ...extraFaqs.map((faq) => ({ question: faq.question, answer: faq.answer })),
  ];

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: service.name, href: serviceHref(slug) },
  ];

  return (
    // One attribute gives this page its identity: buttons, chips, charts,
    // focus rings and the hero scene all re-bind to the service accent.
    <div data-accent={accent}>
      <PageHero
        eyebrow={service.eyebrow}
        title={service.title}
        lede={service.lede}
        crumbs={crumbs}
        primaryCta={{ label: service.ctaLabel, href: "/start-a-project" }}
        secondaryCta={{ label: "See how we work", href: "/about" }}
        bleedImage={heroImage}
        bleedImageAlt=""
        visual={
          // Only where no photograph exists for this service. The built CSS
          // scene makes a weaker hero, so it is the fallback rather than the
          // norm — every service has a photograph today.
          heroImage ? undefined : (
            <div className="h-72 sm:h-80">
              <ServiceVisualScene visual={service.visual} />
            </div>
          )
        }
      />

      {/* ---- Who it is for ---- */}
      <Section size="sm" className="border-y border-hairline bg-surface">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
          <div {...revealProps()}>
            <p className="eyebrow">Who this is for</p>
            <h2 className="mt-3 text-title text-ink">
              You will get the most from this if you recognise one of these.
            </h2>
          </div>
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {service.whoFor.map((item, index) => (
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

      {/* ---- Problems ---- */}
      <Section>
        <SectionHeading
          eyebrow="Problems we solve"
          title="What usually brings people to us."
        />
        <div className="mt-11 grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {service.problems.map((problem, index) => (
            <div
              key={problem.title}
              {...revealProps(index * 60)}
              className="border-t border-hairline pt-5"
            >
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-ink">
                {problem.title}
              </h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                {problem.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Diagram ---- */}
      {diagram ? (
        <Section className="bg-surface">
          <SectionHeading eyebrow="How it works" title={diagram.title} lede={diagram.lede} />
          <div className="mt-10">
            {diagram.layers ? (
              <FlowDiagram layers={diagram.layers} caption={diagram.caption} />
            ) : null}
            {diagram.steps ? <FlowSteps steps={diagram.steps} /> : null}
          </div>
        </Section>
      ) : null}

      {/* ---- Capabilities ---- */}
      <Section>
        <SectionHeading
          eyebrow="What we deliver"
          title="The work, in detail."
          lede={`Not every engagement needs all of this. We scope to what the project actually requires and tell you what we would leave out.`}
        />
        <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.capabilities.map((capability, index) => (
            <div
              key={capability.title}
              {...revealProps(Math.min(index, 6) * 50)}
              className="rounded-lg border border-hairline bg-surface p-5"
            >
              <h3 className="text-[1rem] font-semibold tracking-[-0.015em] text-ink">
                {capability.title}
              </h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
                {capability.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Process + deliverables ---- */}
      <Section className="border-y border-hairline bg-surface">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)]">
          <div>
            <SectionHeading eyebrow="Process" title="How the engagement runs." />
            <ol className="mt-9">
              {service.process.map((step, index) => (
                <li
                  key={step.step}
                  {...revealProps(index * 50)}
                  className="relative flex gap-4 pb-7 last:pb-0"
                >
                  <div className="flex flex-col items-center">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-hairline-strong bg-canvas font-mono text-[0.6875rem] text-ink">
                      {step.step}
                    </span>
                    {index < service.process.length - 1 ? (
                      <span
                        aria-hidden="true"
                        className="mt-1 w-px flex-1 bg-hairline-strong"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[1rem] font-semibold tracking-[-0.015em] text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div {...revealProps(80)}>
            <p className="eyebrow">What you receive</p>
            <ul className="mt-4 space-y-2.5">
              {service.deliverables.map((deliverable) => (
                <li
                  key={deliverable}
                  className="flex items-start gap-2.5 text-[0.9375rem] leading-relaxed text-ink-muted"
                >
                  <Check
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-accent"
                  />
                  {deliverable}
                </li>
              ))}
            </ul>

            {engagement.length ? (
              <>
                <p className="eyebrow mt-10">How we usually work on this</p>
                <ul className="mt-4 space-y-3">
                  {engagement.map((model) => (
                    <li
                      key={model.key}
                      className="rounded-md border border-hairline bg-canvas p-4"
                    >
                      <p className="text-[0.9375rem] font-medium text-ink">
                        {model.name}
                      </p>
                      <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-muted">
                        {model.bestFor}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      </Section>

      {/* ---- Technology ---- */}
      {technologies.length ? (
        <Section>
          <SectionHeading
            eyebrow="Technology"
            title="What we typically build this with."
            lede="Chosen per project. If your team already runs something that works, we would rather extend it than replace it for the sake of preference."
          />
          <ul className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {technologies.map((tech, index) => (
              <li
                key={tech.key}
                {...revealProps(Math.min(index, 8) * 40)}
                className="rounded-md border border-hairline bg-surface p-4"
              >
                <p className="text-[0.9375rem] font-medium text-ink">
                  {tech.name}
                </p>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-muted">
                  {tech.usedFor}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ---- Related work (only when published) ---- */}
      {projects.length ? (
        <Section className="bg-surface">
          <SectionHeading
            eyebrow="Related work"
            title="Projects involving this service."
          />
          <div className="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </Section>
      ) : null}

      <FaqSection
        items={faqs}
        title={`${service.name} — questions we are asked`}
        lede="If something here is not covered, ask us directly. We would rather answer before you commit than after."
      />

      {/* ---- Related services ---- */}
      {related.length ? (
        <Section>
          <SectionHeading
            eyebrow="Related services"
            title="What this usually connects to."
            lede="Most engagements combine several of these. The links below are the combinations that come up most often with this service."
          />
          <ul className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <li key={item.slug} {...revealProps(index * 50)}>
                <Link
                  href={serviceHref(item.slug)}
                  className="group flex h-full flex-col rounded-lg border border-hairline bg-surface p-5 transition-[border-color,box-shadow,transform] duration-[var(--duration-standard)] ease-standard hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0"
                >
                  <span className="eyebrow">
                    {SERVICE_GROUPS[item.group].label}
                  </span>
                  <span className="mt-2.5 text-[1.0625rem] font-semibold tracking-[-0.015em] text-ink">
                    {item.name}
                  </span>
                  <span className="mt-1.5 flex-1 text-[0.875rem] leading-relaxed text-ink-muted">
                    {item.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <TextLink href="/services">See all services</TextLink>
          </div>
        </Section>
      ) : null}

      <CtaSection
        title={service.ctaLabel}
        body={`Tell us what you have in mind. We will come back with questions, a suggested approach, or an honest answer that ${service.name.toLowerCase()} is not what you need.`}
        ctaLabel="Start a Project"
        secondary={{ label: "All services", href: "/services" }}
      />

      <JsonLd
        id="service-schema"
        data={serviceSchema({
          name: service.name,
          description: service.metaDescription,
          path: serviceHref(slug),
          companyName: settings.companyName,
        })}
      />
      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
      <JsonLd id="faq-schema" data={faqSchema(faqs)} />
    </div>
  );
}
