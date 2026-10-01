import type { Metadata } from "next";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { Check } from "lucide-react";

import { ProjectForm } from "@/components/sections/project-form";
import { Logo } from "@/components/ui/logo";
import { JsonLd } from "@/components/ui/json-ld";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { getSiteSettings, whatsappLink } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Get a Free Consultation | The Digital Alchemy",
    description:
      "Tell us what you need in four quick questions. A real person reads it and calls or WhatsApps you back with honest advice. No obligation.",
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
  const whatsapp = whatsappLink(settings, "Hi, I would like to talk about a project.");

  // What happens after they send it. The reply time is the owner's to set
  // (Admin → Settings); until then, no time is promised.
  const nextSteps = [
    settings.replyTime
      ? `We call or WhatsApp you within ${settings.replyTime}.`
      : "We call or WhatsApp you on the number you give.",
    "We ask a few questions about your business and what you need.",
    "We suggest a next step, or tell you honestly if we are not the right fit.",
    "If you want to go ahead, you get a written plan and price.",
  ];

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Free consultation", href: "/start-a-project" },
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
                  Get a free consultation.
                </h1>
                <p className="mt-5 max-w-md text-lede text-ink-muted">
                  Four quick questions. It takes under a minute, and a real
                  person reads every one.
                </p>
              </div>

              <ul {...revealProps(80)} className="mt-8 space-y-3">
                {[
                  "No obligation, and no pressure on the first call.",
                  "We will tell you if a smaller project would suit you better.",
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
                <h2 className="eyebrow">What happens next</h2>
                <ol className="mt-3.5 space-y-2.5">
                  {nextSteps.map((item, index) => (
                    <li key={item} className="flex gap-3">
                      <span className="numeric font-mono text-[0.6875rem] leading-6 tracking-[0.14em] text-accent-text">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[0.875rem] leading-relaxed text-ink-muted">
                        {item}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {settings.phone ? (
                <p
                  {...revealProps(170)}
                  className="mt-7 text-[0.9375rem] text-ink-muted"
                >
                  Rather talk now? Call{" "}
                  <a
                    href={`tel:${settings.phoneE164 || settings.phone}`}
                    className="font-medium text-accent-text underline underline-offset-4"
                  >
                    {settings.phone}
                  </a>
                  {whatsapp ? (
                    <>
                      {" "}or{" "}
                      <a
                        href={whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-accent-text underline underline-offset-4"
                      >
                        message us on WhatsApp
                      </a>
                    </>
                  ) : null}
                  .
                </p>
              ) : null}

              {settings.email ? (
                <p
                  {...revealProps(180)}
                  className="mt-3 text-[0.875rem] text-ink-subtle"
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
              <ProjectForm defaultService={service} replyTime={settings.replyTime} />
            </div>
          </div>
        </div>
      </section>

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}
