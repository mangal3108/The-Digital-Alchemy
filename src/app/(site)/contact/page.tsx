import type { Metadata } from "next";
import Image from "next/image";
import whatsappQr from "@/content/generated/whatsapp-qr.json";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { Mail, QrCode, MapPin, MessageCircle, Phone, Clock } from "lucide-react";

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

const FAQS = [
  {
    question: "How quickly will you reply?",
    answer:
      "A real person reads every enquiry and comes back to you. We deliberately do not publish a guaranteed response time, because committing to one we cannot always meet is worse than being honest — but enquiries do not sit for days.",
  },
  {
    question: "What should I include?",
    answer:
      "What you are trying to build or fix, roughly what you are working with in terms of budget and timing, and anything already in place — a site, a product, an agency. That is enough for us to give a useful first response rather than a generic one.",
  },
  {
    question: "Do you take on small projects?",
    answer:
      "Yes, when the scope is clear and the outcome is worth doing properly. If a project is too small for us to do well, we will say so rather than take it and under-serve it.",
  },
  {
    question: "Can we talk before committing to anything?",
    answer:
      "Of course. The first conversation is about understanding the problem, and there is no obligation attached to it. If we are not the right team we will usually be able to say so on that call.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: "Contact — Discuss AI Automation & AI-Ready Products | The Digital Alchemy",
    description: `Get in touch with ${settings.companyName} to discuss custom AI automation, AI-ready SaaS platforms, and modern digital engineering. Serving clients worldwide from New Delhi.`,
    path: "/contact",
  });
}

export default async function ContactPage() {

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
  const settings = await getSiteSettings();
  const address = formatAddress(settings);
  const whatsapp = whatsappLink(
    settings,
    "Hi — I would like to talk about a project.",
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
              Four short questions, then the details. It takes about two
              minutes, and it means our first reply is useful rather than a
              request for more information.
            </p>
          </div>
        </div>
      </section>

      <Section size="sm">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:gap-14">
          <div {...revealProps()}>
            <ProjectForm />
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
                    <MessageCircle
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-accent"
                    />
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
                      Our only office. Clients elsewhere are served remotely.
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
                Working from another market?
              </h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">
                We are in New Delhi (IST). If you are in the US, UK, Canada,
                Australia or the UAE, our market pages set out the actual
                overlap in working hours.
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
