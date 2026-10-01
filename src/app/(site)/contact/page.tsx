import type { Metadata } from "next";
import Image from "next/image";
import whatsappQr from "@/content/generated/whatsapp-qr.json";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { Mail, QrCode, MapPin, Phone, Clock } from "lucide-react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Section } from "@/components/ui/section-heading";
import { ProjectForm } from "@/components/sections/project-form";
import { FaqList } from "@/components/ui/faq";
import { JsonLd } from "@/components/ui/json-ld";
import { revealProps } from "@/lib/reveal";
import {
  buildMetadata,
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
} from "@/lib/seo";
import { getSiteSettings, formatAddress, whatsappLink } from "@/lib/settings";
import { getScopedFaqs } from "@/lib/content";

/** The reply-time answer depends on Admin → Settings, so it is built per request. */
function replyFaq(replyTime: string) {
  return {
    question: "How quickly will you reply?",
    answer: replyTime
      ? `We reply within ${replyTime}, by phone or WhatsApp. A real person reads every enquiry.`
      : "A real person reads every enquiry and calls or WhatsApps you back. We do not promise an exact reply time, because breaking a promise is worse than being honest.",
  };
}

const FAQS = [
  {
    question: "What should I include?",
    answer:
      "Just what you need and how to reach you. If you already have a website, an app or an agency, mention it. We will ask the rest when we talk.",
  },
  {
    question: "Do you take on small projects?",
    answer:
      "Yes, when it is clear what is needed and the result is worth doing properly. If a project is too small for us to do well, we will say so instead of taking it and doing it badly.",
  },
  {
    question: "Can we talk before committing to anything?",
    answer:
      "Of course. The first conversation is about understanding your problem, and there is no obligation. If we are not the right team, we can usually tell you on that call.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Contact Us in New Delhi | The Digital Alchemy",
    description: `Talk to ${settings.companyName} about a website, an app, AI tools or getting more customers. Call, WhatsApp or send a message. Based in New Delhi.`,
    path: "/contact",
  });
}

export default async function ContactPage() {

  // FAQs added under the admin's "general" scope belong here. Without this the
  // scope existed in the dashboard with nothing reading it, so anything written
  // there was saved, listed, and never shown to anyone.
  const settings = await getSiteSettings();
  const faqs = [
    replyFaq(settings.replyTime),
    ...FAQS,
    ...(await getScopedFaqs("general")).map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
  ];
  const address = formatAddress(settings);
  const whatsapp = whatsappLink(
    settings,
    "Hi, I would like to talk about a project.",
  );
  const localBusiness = await localBusinessSchema();

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-hairline">
        {/*
          A backdrop rather than a bleed band. This page exists to get a form
          filled in, and a full-width photograph between the headline and the
          first field pushes that below the fold.
        */}
        <SectionBackdrop name="hero-contact" from="var(--color-canvas)" opacity={0.16} />

        <div className="container-page relative pb-10 pt-8">
          <Breadcrumb crumbs={crumbs} className="mb-8" />
          <div {...revealProps()} className="max-w-3xl">
            <p className="eyebrow">Contact</p>
            <h1 className="mt-4 text-display-2 text-ink">
              Tell us what you are working on.
            </h1>
            <p className="mt-5 text-lede text-ink-muted">
              Four quick questions, and we call or WhatsApp you back.
              {settings.replyTime ? ` We reply within ${settings.replyTime}.` : ""}{" "}
              Or call, WhatsApp or email us directly.
            </p>
          </div>
        </div>
      </section>

      <Section size="sm">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:gap-14">
          <div {...revealProps()}>
            <ProjectForm replyTime={settings.replyTime} />
          </div>

          <aside {...revealProps(90)} className="lg:pt-2">
            <h2 className="text-title text-ink">Or reach us directly</h2>

            <ul className="mt-5 space-y-4">
              {settings.email ? (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    data-analytics="email_click"
                    className="group flex items-start gap-3 rounded-md text-ink-muted transition-colors duration-[var(--duration-fast)] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span>
                      <span className="block text-[0.75rem] uppercase tracking-[0.1em] text-ink-subtle">
                        Email
                      </span>
                      <span className="block text-[0.9375rem] font-medium">
                        {settings.email}
                      </span>
                    </span>
                  </a>
                </li>
              ) : null}

              {settings.phone ? (
                <li>
                  <a
                    href={`tel:${settings.phoneE164 || settings.phone}`}
                    data-analytics="phone_click"
                    className="group flex items-start gap-3 rounded-md text-ink-muted transition-colors duration-[var(--duration-fast)] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    <Phone aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span>
                      <span className="block text-[0.75rem] uppercase tracking-[0.1em] text-ink-subtle">
                        Phone
                      </span>
                      <span className="block text-[0.9375rem] font-medium">
                        {settings.phone}
                      </span>
                    </span>
                  </a>
                </li>
              ) : null}

              {whatsapp ? (
                <li>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-analytics="whatsapp_click"
                    className="group flex items-start gap-3 rounded-md text-ink-muted transition-colors duration-[var(--duration-fast)] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    <span className="relative mt-0.5 flex size-4 shrink-0 items-center justify-center">
                      <Image
                        src="/logos/whatsapp.svg"
                        alt="WhatsApp"
                        width={16}
                        height={16}
                        className="size-full object-contain"
                      />
                    </span>
                    <span>
                      <span className="block text-[0.75rem] uppercase tracking-[0.1em] text-ink-subtle">
                        WhatsApp
                      </span>
                      <span className="block text-[0.9375rem] font-medium">
                        Message us
                      </span>
                    </span>
                  </a>
                </li>
              ) : null}

              {whatsapp ? (
                /*
                  Scannable from a laptop screen when someone is on a phone,
                  which is the case this exists for. Generated from the number
                  above by `npm run qr`, not cropped from the supplied photo of
                  a phone — that image is angled and glared, and the code on it
                  is WhatsApp's personal "add me as a contact" QR, which is
                  resettable and which WhatsApp itself labels private.
                */
                <li className="flex items-start gap-3 text-ink-muted">
                  <QrCode aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>
                    <span className="block text-[0.75rem] uppercase tracking-[0.1em] text-ink-subtle">
                      Scan to chat
                    </span>
                    <span className="mt-2 block w-fit rounded-md border border-hairline bg-surface p-2.5">
                      <Image
                        src={whatsappQr.src}
                        alt={`QR code that opens a WhatsApp chat with ${settings.phone ?? "us"}`}
                        width={104}
                        height={104}
                        className="size-[104px] [&>*]:fill-ink"
                        unoptimized
                      />
                    </span>
                  </span>
                </li>
              ) : null}

              {address ? (
                <li className="flex items-start gap-3 text-ink-muted">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>
                    <span className="block text-[0.75rem] uppercase tracking-[0.1em] text-ink-subtle">
                      Studio
                    </span>
                    <span className="block text-[0.9375rem] font-medium">
                      {address}
                    </span>
                    <span className="mt-1 block text-[0.8125rem] text-ink-subtle">
                      Our only office. We work with clients elsewhere remotely.
                    </span>
                  </span>
                </li>
              ) : null}

              {settings.businessHours ? (
                <li className="flex items-start gap-3 text-ink-muted">
                  <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>
                    <span className="block text-[0.75rem] uppercase tracking-[0.1em] text-ink-subtle">
                      Hours
                    </span>
                    <span className="block text-[0.9375rem] font-medium">
                      {settings.businessHours}
                    </span>
                  </span>
                </li>
              ) : null}
            </ul>

            <div className="mt-8 rounded-md border border-hairline bg-surface p-5">
              <h3 className="text-[0.9375rem] font-semibold text-ink">
                Outside India?
              </h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
                We are in New Delhi (Indian time). If you are in the US, UK,
                Canada, Australia or the UAE, each country&apos;s page shows the
                working hours we share.
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <Section size="sm" className="border-t border-hairline bg-surface">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div {...revealProps()}>
            <p className="eyebrow">Before you write</p>
            <h2 className="mt-3 text-display-3 text-ink">
              Questions we get asked first.
            </h2>
          </div>
          <FaqList items={faqs} />
        </div>
      </Section>

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
      <JsonLd id="faq-schema" data={faqSchema(faqs)} />
      <JsonLd id="local-business-schema" data={localBusiness} />
    </>
  );
}
