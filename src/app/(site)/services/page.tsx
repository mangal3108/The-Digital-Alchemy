import type { Metadata } from "next";
import { getOptionalBrandImage } from "@/components/ui/brand-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  services,
  SERVICE_GROUPS,
  getServicesByGroup,
  serviceHref,
  type ServiceGroup,
} from "@/content/services";
import { withOverridesAll } from "@/lib/content-overrides";
import { engagementModels } from "@/content/engagement";
import { processStages } from "@/content/process";

import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { CtaSection } from "@/components/sections/cta";
import { FaqSection } from "@/components/ui/faq";
import { JsonLd } from "@/components/ui/json-ld";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { FlowSteps } from "@/components/visuals/flow-diagram";
import { getScopedFaqs } from "@/lib/content";

const GROUP_ORDER: ServiceGroup[] = [
  "development",
  "design",
  "growth",
  "technology",
];

const FAQS = [
  {
    question: "Can we start with just one service?",
    answer:
      "Yes, and most clients do. A website, an audit or a single piece of software is a normal starting point. The advantage of the range is that when the work touches something else — search visibility, an integration, a campaign to fill it — that is a conversation rather than a new supplier.",
  },
  {
    question: "Do you work on retainer or per project?",
    answer:
      "Both. Build work is usually project-based with a defined scope; marketing, social and SEO work on a monthly retainer because they compound. Longer product work often becomes a dedicated team or product partnership. We recommend the model that suits the work rather than the one that suits us.",
  },
  {
    question: "How do you price?",
    answer:
      "Project work is quoted against a written scope after a discovery conversation, so you see a costed plan before committing. Retainers are a monthly fee against agreed deliverables. We do not price marketing as a percentage of ad spend, because that creates an incentive to recommend spending more.",
  },
  {
    question: "What if we already have a developer or agency?",
    answer:
      "That is common and usually fine. We work alongside in-house teams and other suppliers regularly. What matters is that ownership of each area is clear from the start — overlapping responsibility with no boundary is what makes those arrangements fail.",
  },
  {
    question: "Do you work with businesses outside India?",
    answer:
      "Yes. We are based in New Delhi and work remotely with clients in the United States, Australia, the United Kingdom, Canada and the UAE. Each market page sets out the real time-zone overlap and how contracting and invoicing work there.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Services — AI Automation, Software, Design & Growth | The Digital Alchemy",
    description:
      "AI automation & intelligent workflows, AI-ready SaaS development, web and mobile platforms, UI/UX design, and compound search growth engineering.",
    path: "/services",
  });
}

export default async function ServicesPage() {

  // FAQs added under the admin's "general" scope belong here. Without this the
  // scope existed in the dashboard with nothing reading it, so anything written
  // there was saved, listed, and never shown to anyone.
  const faqs = [
    ...FAQS,
    ...(await getScopedFaqs("general")).map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  ];
  // Resolved once for the whole page, then looked up per group — the groups
  // render inside a map callback, which cannot await.
  const resolved = await withOverridesAll(
    "service",
    services,
    (service) => service.slug,
  );
  const bySlug = new Map(resolved.map((service) => [service.slug, service]));
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
  ];

  return (
    <>
      <PageHero
        eyebrow="Services & Capabilities"
        title="AI automation. Software engineering. Digital scale."
        lede="AI automation, modern software engineering, product design, and compound growth under one roof. We architect autonomous, AI-ready digital platforms that eliminate operational friction and scale effortlessly."
        crumbs={crumbs}
        primaryCta={{ label: "Start an AI Project", href: "/start-a-project" }}
        secondaryCta={{ label: "How we work", href: "/about" }}
        bleedImage={getOptionalBrandImage("hero-services")}
        bleedImageAlt=""
      />

      {/* ---- The connected model ---- */}
      <Section size="sm" className="relative overflow-hidden border-y border-hairline bg-surface">
        <SectionBackdrop name="section-technology" from="var(--color-surface)" opacity={0.16} side="right" />
        <div className="relative">
          <div {...revealProps()} className="max-w-2xl">
            <p className="eyebrow">The model</p>
            <h2 className="mt-3 text-title text-ink">
              Each stage informs the next, and the last one feeds the first.
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
              The people who will have to market a product are in the room while
              it is being designed. The engineers know what the campaign
              promised. That is the whole argument for a combined team.
            </p>
          </div>

          <FlowSteps
            className="mt-9"
            steps={processStages.map((stage) => ({
              label: stage.title,
              detail: stage.summary,
            }))}
          />
        </div>
      </Section>

      {/* ---- Service groups ---- */}
      {GROUP_ORDER.map((group, groupIndex) => {
        const services = getServicesByGroup(group).map(
          (service) => bySlug.get(service.slug) ?? service,
        );
        const meta = SERVICE_GROUPS[group];

        return (
          <Section
            key={group}
            id={group}
            className={groupIndex % 2 === 1 ? "bg-surface" : undefined}
          >
            <SectionHeading
              eyebrow={`0${groupIndex + 1} — ${meta.label}`}
              title={meta.blurb}
            />

            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <li key={service.slug} {...revealProps(index * 50)}>
                  <Link
                    href={serviceHref(service.slug)}
                    className="group flex h-full flex-col rounded-lg border border-hairline bg-canvas p-6 transition-[border-color,box-shadow,transform] duration-[var(--duration-standard)] ease-standard hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-ink">
                        {service.name}
                      </h3>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-ink-subtle transition-[transform,color] duration-[var(--duration-fast)] ease-standard group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text motion-reduce:transition-none"
                      />
                    </div>
                    <p className="mt-2.5 flex-1 text-[0.875rem] leading-relaxed text-ink-muted">
                      {service.summary}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        );
      })}

      {/* ---- Engagement models ---- */}
      <Section id="engagement" className="relative overflow-hidden border-y border-hairline bg-surface">
        <SectionBackdrop name="section-why-us" from="var(--color-surface)" opacity={0.14} side="left" />
        <div className="relative">
          <SectionHeading
            eyebrow="Engagement models"
            title="How working together is usually structured."
            lede="The right model depends on how defined the work is and how long it runs. We will recommend one rather than defaulting to whichever bills most."
          />

          <div className="mt-11 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {engagementModels.map((model, index) => (
              <div
                key={model.key}
                {...revealProps(index * 60)}
                className="flex flex-col rounded-lg border border-hairline bg-canvas p-6"
              >
                <h3 className="text-title text-ink">{model.name}</h3>
                <p className="mt-2 text-[0.875rem] font-medium text-accent-text">
                  {model.bestFor}
                </p>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {model.description}
                </p>
                <ul className="mt-5 space-y-1.5 border-t border-hairline pt-4">
                  {model.characteristics.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[0.8125rem] text-ink-muted"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.45rem] size-1 shrink-0 rounded-full bg-accent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <FaqSection items={faqs} title="Questions about working with us" />

      <CtaSection
        title="Not sure which of these you need?"
        body="That is a normal place to start. Describe the problem rather than the solution and we will tell you what we would actually recommend."
        secondary={{ label: "Read about our process", href: "/about" }}
      />

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
      <JsonLd id="faq-schema" data={faqSchema(faqs)} />
    </>
  );
}
