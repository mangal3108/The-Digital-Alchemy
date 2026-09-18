import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { footerColumns } from "@/content/navigation";
import { getSiteSettings, formatAddress } from "@/lib/settings";
import { PRIMARY_CTA } from "@/config/site";
import { AlchemyCore } from "@/components/visuals/alchemy-core";
import { BrandImage } from "@/components/ui/brand-image";

const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  x: "X",
  behance: "Behance",
  dribbble: "Dribbble",
  github: "GitHub",
};

export async function Footer() {
  const settings = await getSiteSettings();
  const address = formatAddress(settings);
  const socials = Object.entries(settings.social).filter(([, value]) => value);
  const year = new Date().getFullYear();

  return (
    <footer data-surface="dark" className="relative bg-canvas text-ink">
      {/* ---- Closing call to action ---- */}
      <section className="relative overflow-hidden border-b border-hairline">
        {/* Rendered world map as atmosphere behind the closing invitation.
            Masked to fade out well before the text, and dark enough that it
            never competes with it — the copy has to stay the loudest thing
            in this band. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.22]"
          style={{
            maskImage:
              "linear-gradient(to left, #000 0%, rgba(0,0,0,0.55) 42%, transparent 72%)",
            WebkitMaskImage:
              "linear-gradient(to left, #000 0%, rgba(0,0,0,0.55) 42%, transparent 72%)",
          }}
        >
          <BrandImage
            name="world-etched-dark"
            alt=""
            fill
            sizes="100vw"
            imgClassName="object-cover object-right"
          />
        </div>
        <div className="grain absolute inset-0" aria-hidden="true" />
        <div className="container-page relative section-y">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            {/* min-w-0 stops this grid item being sized by its widest
                unbreakable child. Without it the email button below — one
                30-character token — forces the whole band past a 320px
                viewport, and body's overflow-x:clip hides the damage rather
                than revealing it as a scrollbar. */}
            <div className="min-w-0 max-w-2xl">
              <p className="eyebrow">Start an AI Project</p>
              <h2 className="mt-4 text-display-2 text-ink">
                Have an AI-ready product or workflow worth automating?
              </h2>
              <p className="mt-5 max-w-xl text-lede text-ink-muted">
                Tell us what you are building. From autonomous agent pipelines to AI-ready SaaS platforms, we architect intelligent systems engineered to compound in value.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button href={PRIMARY_CTA.href} size="lg" withArrow className="bg-white text-ink hover:bg-white/90">
                  {PRIMARY_CTA.label}
                </Button>
                {settings.email ? (
                  <Button
                    href={`mailto:${settings.email}`}
                    variant="secondary"
                    size="lg"
                    data-analytics="email_click"
                    className="h-auto max-w-full whitespace-normal break-all py-3.5 text-left"
                  >
                    {settings.email}
                  </Button>
                ) : null}
              </div>
            </div>

            {/* The payoff. The core returns here holding the full palette —
                the same object that opened the page, now resolved. It is the
                one place the complete colour system appears at once, which is
                what keeps it feeling like an arrival rather than decoration. */}
            <div className="hidden justify-self-end lg:block">
              <AlchemyCore className="size-64" />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Directory ---- */}
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2.6fr)]">
          <div>
            <Logo className="text-ink" label="The Digital Alchemy Media Private Limited" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              {settings.tagline}. {settings.shortDescription}
            </p>

            <ul className="mt-6 space-y-2.5 text-sm">
              {settings.email ? (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    data-analytics="email_click"
                    className="inline-flex items-center gap-2.5 text-ink-muted transition-colors duration-[var(--duration-fast)] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    <Mail aria-hidden="true" className="size-4 shrink-0" />
                    {settings.email}
                  </a>
                </li>
              ) : null}
              {settings.phone ? (
                <li>
                  <a
                    href={`tel:${settings.phoneE164 || settings.phone}`}
                    data-analytics="phone_click"
                    className="inline-flex items-center gap-2.5 text-ink-muted transition-colors duration-[var(--duration-fast)] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                  >
                    <Phone aria-hidden="true" className="size-4 shrink-0" />
                    {settings.phone}
                  </a>
                </li>
              ) : null}
              {address ? (
                <li className="flex items-start gap-2.5 text-ink-muted">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                  <span>
                    {address}
                    <span className="mt-1 block text-[0.8125rem] text-ink-subtle">
                      Our only office. Other markets are served remotely.
                    </span>
                  </span>
                </li>
              ) : null}
            </ul>

            {socials.length ? (
              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                {socials.map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-ink-muted underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      {SOCIAL_LABELS[key] ?? key}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.label}>
                <p className="eyebrow">{column.label}</p>
                <ul className="mt-3.5 space-y-2">
                  {column.links.map((link) => (
                    <li key={`${column.label}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="text-[0.875rem] text-ink-muted underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="container-page flex flex-col gap-3 py-6 text-[0.8125rem] text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.companyName}. All rights reserved.
          </p>
          <p>
            {settings.footerNote ||
              "Working with clients in India, the United States, Australia and worldwide."}
          </p>
        </div>
      </div>
    </footer>
  );
}
