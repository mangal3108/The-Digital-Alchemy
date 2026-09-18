import type { Metadata } from "next";

import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section-heading";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { CtaSection } from "@/components/sections/cta";
import { JsonLd } from "@/components/ui/json-ld";
import { WorkGrid } from "@/components/sections/work-grid";
import { Button } from "@/components/ui/button";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { getPublishedProjects } from "@/lib/content";
import { parseJson } from "@/lib/utils";
import { getOptionalBrandImage } from "@/components/ui/brand-image";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Our Work — AI Automations & Production Systems | The Digital Alchemy",
    description:
      "Case studies, autonomous workflows, AI-ready platforms, and software systems built by The Digital Alchemy.",
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

  // Only used to show which capabilities the published work covers.
  const serviceCoverage = new Set(
    projects.flatMap((project) => parseJson<string[]>(project.services, [])),
  );

  return (
    <>
      <PageHero
        eyebrow="Portfolio & Systems"
        title={
          projects.length
            ? "Production systems & AI automations, verified."
            : "Case studies & AI systems, coming as clients approve them."
        }
        lede={
          projects.length
            ? "The operational challenges brought to us, the AI automations and architectures engineered, and the measurable business impact delivered."
            : "We publish client work only with explicit permission, and metrics only when independently verified. Real production software, autonomous workflows, and measured commercial outcomes."
        }
        crumbs={crumbs}
        primaryCta={
          projects.length
            ? undefined
            : { label: "Start an AI Project", href: "/start-a-project" }
        }
        bleedImage={getOptionalBrandImage("hero-work")}
        bleedImageAlt="Architectural glass and matte black anodised prism block"
      />

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
              What we can show you in the meantime
            </h2>
            <ul className="mt-5 space-y-3.5">
              {[
                "A walkthrough of relevant projects on a call, including work under NDA that we cannot publish here.",
                "References from clients working in a similar sector or at a similar stage.",
                "A written approach to your specific problem, so you can judge the thinking rather than the portfolio.",
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

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/start-a-project" withArrow>
                Start a Project
              </Button>
              <Button href="/services" variant="secondary">
                Explore services
              </Button>
            </div>

            <p className="mt-7 border-t border-hairline pt-5 text-[0.8125rem] leading-relaxed text-ink-subtle">
              Note for the site administrator: case studies added under
              Admin → Projects appear here automatically, with filtering by
              category. Results only display when you enter verified figures.
            </p>
          </div>
        </Section>
      )}

      {serviceCoverage.size ? null : null}

      <CtaSection
        title="Have something similar in mind?"
        body="Tell us the problem you are trying to solve. We will tell you how we would approach it and whether we are the right team for it."
        secondary={{ label: "See our services", href: "/services" }}
      />

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}
