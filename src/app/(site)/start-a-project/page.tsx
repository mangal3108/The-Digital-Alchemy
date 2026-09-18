import type { Metadata } from "next";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { Check } from "lucide-react";

import { ProjectForm } from "@/components/sections/project-form";
import { Logo } from "@/components/ui/logo";
import { JsonLd } from "@/components/ui/json-ld";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";
import { processStages } from "@/content/process";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Start an AI Project — AI Automation & AI-Ready Products | The Digital Alchemy",
    description:
      "Tell us about your project — AI automation, autonomous workflows, AI-ready SaaS platforms, or custom software. Senior engineering scoping with clear ROI.",
    path: "/start-a-project",
  });
}

/**
 * Conversion-focused enquiry page.
 *
 * Deliberately stripped back: no mega menu distractions in the reading order,
 * one action, and supporting content that answers the objections people
 * actually have at this point rather than restating the pitch.
 */
export default async function StartProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const settings = await getSiteSettings();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Start a Project", href: "/start-a-project" },
  ];

  return (
    <>
      <section className="relative overflow-hidden">
        {/*
          Was a hardcoded copper wash left over from the pre-V2 palette, which
          painted this page copper regardless of the accent system. Now the
          accent token, with the photograph behind it once it exists.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[30rem]"
          style={{
            background:
              "radial-gradient(60% 46% at 70% 16%, color-mix(in srgb, var(--color-accent) 13%, transparent) 0%, transparent 72%)",
          }}
        />

        {/* Backdrop, not a band: the form is what this page is for. */}
        <SectionBackdrop name="hero-start-project" from="var(--color-canvas)" opacity={0.16} />

        <div className="container-page relative py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
            {/* ---- Reassurance column ---- */}
            <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
              <div {...revealProps()}>
                <Logo href={null} />
                <h1 className="mt-7 text-display-2 text-ink">
                  Start a project.
                </h1>
                <p className="mt-5 max-w-md text-lede text-ink-muted">
                  Tell us what you are trying to build or fix. We will come
                  back with questions, an approach, or an honest answer that we
                  are not the right team for it.
                </p>
              </div>

              <ul {...revealProps(80)} className="mt-8 space-y-3">
                {[
                  "A real person reads every enquiry — no qualification bot.",
                  "No obligation, and no pressure on the first call.",
                  "We will tell you if a smaller scope would serve you better.",
                  "Your details are used only to reply. No lists, no sharing.",
                ].map((item) => (
                  <li
                    key={item}
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

              <div
                {...revealProps(140)}
                className="mt-9 rounded-lg border border-hairline bg-surface p-5"
              >
                <p className="eyebrow">What happens after</p>
                <ol className="mt-3.5 space-y-2.5">
                  {processStages.slice(0, 3).map((stage) => (
                    <li key={stage.step} className="flex gap-3">
                      <span className="numeric font-mono text-[0.6875rem] leading-6 tracking-[0.14em] text-accent-text">
                        {stage.step}
                      </span>
                      <span className="text-[0.875rem] leading-relaxed text-ink-muted">
                        <span className="font-medium text-ink">
                          {stage.title}.
                        </span>{" "}
                        {stage.summary}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {settings.email ? (
                <p
                  {...revealProps(180)}
                  className="mt-7 text-[0.875rem] text-ink-subtle"
                >
                  Prefer email?{" "}
                  <a
                    href={`mailto:${settings.email}`}
                    data-analytics="email_click"
                    className="text-accent-text underline underline-offset-4"
                  >
                    {settings.email}
                  </a>
                </p>
              ) : null}
            </div>

            {/* ---- The form ---- */}
            <div {...revealProps(60, 20)}>
              <ProjectForm defaultService={service} />
            </div>
          </div>
        </div>
      </section>

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}
