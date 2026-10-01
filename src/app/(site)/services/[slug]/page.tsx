import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";

import Image from "next/image";
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
import { BrandLogos } from "@/components/ui/brand-logos";
import { getLogo } from "@/content/logos";

import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { ServiceComparison } from "@/components/sections/service-comparison";
import { FaqSection } from "@/components/ui/faq";
import { CtaSection } from "@/components/sections/cta";
import { ProjectCard } from "@/components/ui/project-card";
import { JsonLd } from "@/components/ui/json-ld";
import { FlowDiagram, FlowSteps } from "@/components/visuals/flow-diagram";
import { ServiceVisualScene } from "@/components/visuals/service-visuals";
import { getServiceImage, getServiceAltText } from "@/content/service-imagery";
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
import { PRIMARY_CTA } from "@/config/site";
import { getProjectsForService, getScopedFaqs } from "@/lib/content";

export const dynamicParams = false;

/** Owner reminders (missing price or timeline) show in development only. */
const showOwnerTodos = process.env.NODE_ENV !== "production";

/** "A dental clinic" becomes "a dental clinic"; "CA" and "AC" are left alone. */
function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

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
        primaryCta={{ label: PRIMARY_CTA.label, href: PRIMARY_CTA.href }}
        bleedImage={heroImage}
        bleedImageAlt={getServiceAltText(slug)}
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

      {/* ---- Platforms & tools strip ---- */}
      {service.technologies && service.technologies.length > 0 ? (
        <section className="border-b border-hairline bg-surface/60 py-6 sm:py-7">
          <div className="container-page">
            <BrandLogos
              slugs={service.technologies}
              title={
                service.group === "customers"
                  ? "Platforms & channels we work with"
                  : "Platforms & technologies we build on"
              }
              layout="strip"
              size="md"
            />
          </div>
        </section>
      ) : null}

      {/*
        The template, in a fixed order for every service:
          1. Hero: what it is, and who it is for
          2. Is this for you? (situations, common problems, which one to pick)
          3. What you get
          4. An example (and real projects, once published)
          5. How it works
          6. Price and timeline
          7. Questions
          8. Related services
          9. Get in touch (button here; WhatsApp and phone in the footer
             band directly below, which every page shares)
        Content lives in src/content/services/*.ts; this file only lays it out.
      */}

      {/* ---- 2. Is this for you? ---- */}
      <Section size="sm" className="border-y border-hairline bg-surface">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
          <div {...revealProps()}>
            <p className="eyebrow">Is this for you?</p>
            <h2 className="mt-3 text-title text-ink">
              It is, if one of these sounds like you.
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

      <Section>
        <SectionHeading
          eyebrow="Sound familiar?"
          title="Why people come to us."
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

      {/* Which one do I need? How this differs from its closest siblings. */}
      <ServiceComparison slug={service.slug} />

      {/* ---- 3. What you get ---- */}
      <Section>
        <SectionHeading
          eyebrow="What you get"
          title="What we do for you."
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

      {/*
        ---- 4. Example ----
        Always labelled as an example. Nobody in it is a client, and it has no
        numbers in it, because an example cannot promise a result. Real client
        work appears below it only once a project is published.
      */}
      <Section className="border-y border-hairline bg-surface">
        <SectionHeading
          eyebrow="Example"
          title={`What this could look like for ${lowerFirst(service.example.business)}.`}
          lede="A typical case, to show the kind of change this makes. It is an example, not a client story."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div
            {...revealProps()}
            className="rounded-lg border border-hairline bg-canvas p-6"
          >
            <p className="eyebrow">Before</p>
            <p className="mt-3 text-[1rem] leading-relaxed text-ink-muted">
              {service.example.before}
            </p>
          </div>
          <div
            {...revealProps(80)}
            className="rounded-lg border border-accent/40 bg-canvas p-6"
          >
            <p className="eyebrow text-accent-text">After</p>
            <p className="mt-3 text-[1rem] leading-relaxed text-ink">
              {service.example.after}
            </p>
          </div>
        </div>
      </Section>

      {projects.length ? (
        <Section>
          <SectionHeading
            eyebrow="Real projects"
            title="Work we have done in this area."
          />
          <div className="mt-11 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </Section>
      ) : null}

      {/* ---- 5. How it works ---- */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)]">
          <div>
            <SectionHeading eyebrow="How it works" title="Step by step." />
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
            <p className="mt-8 border-t border-hairline pt-5 text-[0.9375rem] leading-relaxed text-ink-muted">
              {service.typicalTimeline ? (
                <>
                  <span className="font-medium text-ink">Typical timeline:</span>{" "}
                  {service.typicalTimeline}. We confirm the dates before any work starts.
                </>
              ) : (
                "How long it takes depends on what is included. We give you a timeline before any work starts."
              )}
            </p>
          </div>

          <div {...revealProps(80)}>
            <p className="eyebrow">What you have at the end</p>
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
          </div>
        </div>

        {diagram ? (
          <div className="mt-16 border-t border-hairline pt-12">
            <SectionHeading eyebrow="In more detail" title={diagram.title} lede={diagram.lede} />
            <div className="mt-10">
              {diagram.layers ? (
                <FlowDiagram layers={diagram.layers} caption={diagram.caption} />
              ) : null}
              {diagram.steps ? <FlowSteps steps={diagram.steps} /> : null}
            </div>
          </div>
        ) : null}
      </Section>

      {/* ---- 6. Price and timeline ---- */}
      <Section className="border-y border-hairline bg-surface">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div {...revealProps()}>
            <p className="eyebrow">Price and timeline</p>
            <h2 className="mt-3 text-title text-ink">What it costs.</h2>
            <p className="mt-4 max-w-xl text-lede text-ink-muted">
              {service.priceFrom
                ? `Most projects start from ${service.priceFrom}. Tell us your needs for an exact quote.`
                : "Every project is priced on what it needs. Tell us your needs for an exact quote, with no obligation."}
            </p>
            {service.priceFrom && service.typicalTimeline ? (
              <p className="mt-3 text-[0.9375rem] text-ink-muted">
                <span className="font-medium text-ink">Typical timeline:</span>{" "}
                {service.typicalTimeline}.
              </p>
            ) : null}
            {showOwnerTodos && (!service.priceFrom || !service.typicalTimeline) ? (
              // Development only: a reminder for the site owner. Never built
              // into production pages.
              <p className="mt-5 rounded-md border border-dashed border-hairline-strong p-3 font-mono text-[0.75rem] text-ink-subtle">
                TODO (only visible in development): set{" "}
                {[
                  !service.priceFrom && "a starting price",
                  !service.typicalTimeline && "a typical timeline",
                ]
                  .filter(Boolean)
                  .join(" and ")}{" "}
                in src/content/services or Admin → Page copy.
              </p>
            ) : null}
          </div>

          {engagement.length ? (
            <div {...revealProps(80)}>
              <p className="eyebrow">Ways to work with us</p>
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
            </div>
          ) : null}
        </div>
      </Section>

      {/* ---- 7. Questions ---- */}
      <FaqSection
        items={faqs}
        title={`Questions about ${service.name}`}
      />

      {/* ---- 8. Related services (at most three) ---- */}
      {related.length ? (
        <Section>
          <SectionHeading
            eyebrow="Related services"
            title="Often needed together."
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
                    You need this when {item.needItWhen}
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

      {/*
        ---- For technical teams ----
        Tech names stay out of the main flow: most visitors do not know
        what Redis is and should not have to. Collapsed, so the people who
        do ask can still find it.
      */}
      {technologies.length ? (
        <Section size="sm">
          <details className="group rounded-lg border border-hairline bg-surface">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-[1rem] font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
              For technical teams: what we build this with
              <ChevronDown
                aria-hidden="true"
                className="size-4 shrink-0 text-ink-subtle transition-transform duration-[var(--duration-fast)] group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <div className="border-t border-hairline px-5 py-5">
              <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                Chosen for each project. If your team already uses something that
                works, we would rather build on it than replace it.
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {technologies.map((tech) => {
                  const logo = getLogo(tech.key);
                  return (
                    <li key={tech.key} className="flex items-start gap-3.5 rounded-md border border-hairline bg-canvas p-4">
                      {logo ? (
                        <div className="relative mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-hairline bg-surface p-1.5 shadow-2xs">
                          <Image
                            src={logo.files.color}
                            alt={logo.name}
                            width={22}
                            height={22}
                            className="size-full object-contain"
                          />
                        </div>
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.9375rem] font-medium text-ink">{tech.name}</p>
                        <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-muted">
                          {tech.usedFor}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </details>
        </Section>
      ) : null}

      {/* ---- 9. Get in touch. WhatsApp and phone follow in the footer band. ---- */}
      <CtaSection
        title={`Talk to us about ${service.name}`}
        body={`Tell us what you need. We will reply with questions, a suggested plan, or an honest answer if ${service.name} is not right for you.`}
        ctaLabel={PRIMARY_CTA.label}
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
