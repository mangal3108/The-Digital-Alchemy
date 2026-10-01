import type { Metadata } from "next";
import { getOptionalBrandImage } from "@/components/ui/brand-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  services,
  SERVICE_GROUPS,
  SERVICE_GROUP_ORDER,
  getServicesByGroup,
  serviceHref,
} from "@/content/services";
import { withOverridesAll } from "@/lib/content-overrides";
import { engagementModels } from "@/content/engagement";
import { processStages } from "@/content/process";

import { PageHero } from "@/components/sections/page-hero";
import { BrandLogos } from "@/components/ui/brand-logos";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { CtaSection } from "@/components/sections/cta";
import { FaqSection } from "@/components/ui/faq";
import { JsonLd } from "@/components/ui/json-ld";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { FlowSteps } from "@/components/visuals/flow-diagram";
import { getScopedFaqs } from "@/lib/content";
import { ServicePickerSection } from "@/components/sections/service-picker-section";
import { PRIMARY_CTA } from "@/config/site";

const FAQS = [
  {
    question: "Can we start with just one service?",
    answer:
      "Yes. A website, a check-up of your marketing, or one piece of software is a normal place to start. The benefit of one team is that when the work touches something else, like showing up on Google or connecting another app, you have a conversation instead of finding a new supplier.",
  },
  {
    question: "Do you charge per project or monthly?",
    answer:
      "Both. Building something is usually a fixed project with an agreed list of what is included. Marketing, social media and SEO are monthly, because their results build up over time. We suggest the arrangement that suits the work, not the one that suits us.",
  },
  {
    question: "How do you price?",
    answer:
      "For projects, we give you a price for a written plan after a first conversation, so you see the cost before you commit. Monthly work is a fixed monthly fee for an agreed list of work. We never charge a share of your ad spend, because that would reward us for telling you to spend more.",
  },
  {
    question: "What if we already have a developer or agency?",
    answer:
      "That is common, and usually fine. We work alongside your own team or other suppliers. What matters is agreeing at the start who is responsible for what, because unclear responsibilities are what make these arrangements fail.",
  },
  {
    question: "Do you work with businesses outside India?",
    answer:
      "Yes. We are based in New Delhi, and we also take on clients in the United States, Australia, the United Kingdom, Canada and the UAE, working remotely. Each country's page shows the working hours we share and how contracts and invoices work there.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Web, App, AI & Marketing Services | The Digital Alchemy",
    description:
      "Websites, online stores, apps, AI tools and online marketing, grouped by what you need. Not sure? Answer three quick questions. Get a free consultation.",
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
        eyebrow="Our services"
        title="Websites, apps, AI tools and more customers, all from one team."
        lede="Choose by what you need: a website, an app, more customers, less repetitive work, a better look, or someone to keep it all running. Not sure? The questions below will point you in the right direction."
        crumbs={crumbs}
        primaryCta={{ label: PRIMARY_CTA.label, href: PRIMARY_CTA.href }}
        bleedImage={getOptionalBrandImage("hero-services")}
        bleedImageAlt=""
      />

      {/* ---- Platforms strip ---- */}
      <section className="border-b border-hairline bg-surface/60 py-6 sm:py-7">
        <div className="container-page">
          <BrandLogos
            slugs={[
              "google",
              "meta",
              "shopify",
              "wordpress",
              "aws",
              "react",
              "nextjs",
              "figma",
              "stripe",
              "whatsapp",
            ]}
            title="Platforms & tools covered across our services"
            layout="strip"
            size="md"
          />
        </div>
      </section>

      {/* ---- Help me choose: where the menu's "Not sure what you need?" lands ---- */}
      <ServicePickerSection />

      {/* ---- The connected model ---- */}
      <Section size="sm" className="relative overflow-hidden border-y border-hairline bg-surface">
        <SectionBackdrop name="section-technology" from="var(--color-surface)" opacity={0.16} side="right" />
        <div className="relative">
          <div {...revealProps()} className="max-w-2xl">
            <p className="eyebrow">Why one team</p>
            <h2 className="mt-3 text-title text-ink">
              Each step helps the next, and what we learn feeds back in.
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
              The people who will market your website or app help plan it. The
              people who build it know what the ads promised. That is why one
              team works better than several.
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
      {SERVICE_GROUP_ORDER.map((group, groupIndex) => {
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
                      {service.oneLiner}
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
            eyebrow="Ways to work with us"
            title="How working together usually works."
            lede="The right arrangement depends on how clear the work is and how long it lasts. We will suggest one, not whichever earns us most."
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
        title="Still not sure what you need?"
        body="That is a normal place to start. Tell us the problem, not the solution, and we will tell you what we would actually suggest."
      />

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
      <JsonLd id="faq-schema" data={faqSchema(faqs)} />
    </>
  );
}
