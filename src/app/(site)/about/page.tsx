import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { getOptionalBrandImage } from "@/components/ui/brand-image";
import { CtaSection } from "@/components/sections/cta";
import { Metrics } from "@/components/sections/metrics";
import { JsonLd } from "@/components/ui/json-ld";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema, personSchema } from "@/lib/seo";
import { getSiteSettings, formatAddress } from "@/lib/settings";
import { getTeam } from "@/lib/content";
import { differentiators } from "@/content/process";
import { markets } from "@/content/locations";
import { parseJson } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "About — AI Automation, AI-Ready Products & Studio | The Digital Alchemy",
    description:
      "A premier AI automation, AI-ready product and digital engineering studio based in New Delhi. How we build autonomous workflows, scalable architectures, and modern digital software.",
    path: "/about",
  });
}

const VALUES = [
  {
    title: "Say the inconvenient thing early",
    body: "If a scope is wrong, a deadline is unrealistic or a channel is not working, you hear it from us at the point it is still cheap to change — not in a retrospective.",
  },
  {
    title: "Build for the person who maintains it",
    body: "Mainstream tools, documented decisions, accounts in your name. We would rather earn the next project than be the only people who can operate what we built.",
  },
  {
    title: "Measure what actually matters",
    body: "Impressions and page views are inputs. We instrument for the outcomes a business is judged on, and report the ones that did not move as well as the ones that did.",
  },
  {
    title: "Finish things properly",
    body: "Empty states, error states, redirects, accessibility, the second release. The unglamorous last ten per cent is most of what separates working software from a demo.",
  },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const team = await getTeam();
  const address = formatAddress(settings);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ];

  return (
    <>
      <PageHero
        eyebrow="About The Studio"
        title="AI Automation. AI-Ready Products. High-Performance Engineering."
        lede="The Digital Alchemy architects intelligent digital products, enterprise automations, and custom AI systems. We pair Apple-grade craft and interface precision with hardened cloud architecture and agentic automation."
        crumbs={crumbs}
        primaryCta={{ label: "Start an AI Project", href: "/start-a-project" }}
        secondaryCta={{ label: "Explore Services", href: "/services" }}
        bleedImage={getOptionalBrandImage("hero-about")}
        bleedImageAlt="Modern Apple design lab workbench with precision prototyping models"
      />

      {/* ---- Who we are ---- */}
      <Section className="relative overflow-hidden border-y border-hairline bg-surface">
        <SectionBackdrop name="studio-bench" from="var(--color-surface)" opacity={0.18} side="right" />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div {...revealProps()}>
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-3.5 text-display-3 text-ink">
              A studio in New Delhi engineering AI-ready products, intelligent automations, and modern software.
            </h2>
          </div>

          <div
            {...revealProps(80)}
            className="space-y-4 text-[1.0625rem] leading-relaxed text-ink-muted"
          >
            <p>
              We began by building digital platforms and growth engines for ambitious businesses.
              It became clear early on that the true bottleneck to sustainable scale is operational friction
              and disconnected systems — manual workflows that bleed team hours and software built without
              readiness for autonomous intelligence.
            </p>
            <p>
              Today, our studio unifies AI automation, intelligent agent workflows, modern interface
              craft, and full-stack software engineering. We don&apos;t just build static websites or surface-level
              wrappers; we build AI-ready architectures designed to ingest unstructured data, trigger autonomous
              operations, and scale seamlessly.
            </p>
            <p>
              We operate with deliberate craft and senior-level ownership. That means every workflow we automate
              and every AI-ready product we ship is built for production reliability, verifiable ROI, and effortless maintenance.
            </p>
          </div>
        </div>
      </Section>

      {/* ---- Mission ---- */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <div {...revealProps()}>
            <p className="eyebrow">What we are for</p>
            <h2 className="mt-3.5 text-display-3 text-ink">Our mission</h2>
          </div>
          <div {...revealProps(80)}>
            <p className="font-serif text-[clamp(1.375rem,1rem+1.5vw,2rem)] leading-snug text-ink">
              To equip ambitious enterprises and founders with Apple-grade product craft, production-grade AI automation, and AI-ready architectures that unlock compound scale.
            </p>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-muted">
              Most teams are caught between doing things manually forever or adopting fragile point solutions.
              Our mission is to engineer hardened, intelligent systems once — so your business runs faster, smarter, and with zero unnecessary overhead.
            </p>
          </div>
        </div>
      </Section>

      {/* ---- Differentiators ---- */}
      <Section className="relative overflow-hidden border-y border-hairline bg-surface">
        <SectionBackdrop name="section-why-us" from="var(--color-surface)" opacity={0.14} side="left" />
        <div className="relative">
          <SectionHeading
            eyebrow="Our approach"
            title="Four decisions that shape every project."
          />
          <div className="mt-11 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {differentiators.map((item, index) => (
              <div
                key={item.key}
                {...revealProps(index * 60)}
                className="border-t border-hairline pt-5"
              >
                <h3 className="text-title text-ink">{item.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---- Values ---- */}
      <Section className="relative overflow-hidden border-y border-hairline bg-surface">
        <SectionBackdrop name="plate-bench-aluminium" from="var(--color-surface)" opacity={0.15} side="right" />
        <div className="relative">
          <SectionHeading
            eyebrow="How we operate"
            title="What we hold ourselves to."
            lede="Written as behaviour rather than as adjectives, so you can tell whether we are doing it."
          />
          <div className="mt-11 grid gap-5 sm:grid-cols-2">
            {VALUES.map((value, index) => (
              <div
                key={value.title}
                {...revealProps(index * 60)}
                className="rounded-lg border border-hairline bg-canvas p-6"
              >
              <Check aria-hidden="true" className="size-4 text-accent" />
              <h3 className="mt-3.5 text-[1.0625rem] font-semibold tracking-[-0.015em] text-ink">
                {value.title}
              </h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                {value.body}
              </p>
            </div>
          ))}
          </div>
        </div>
      </Section>

      <Metrics />

      {/* ---- Team (CMS driven; hidden until populated) ---- */}
      {team.length ? (
        <Section>
          <SectionHeading
            eyebrow="The team"
            title="The people you would actually be working with."
          />
          <ul className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => {
              const expertise = parseJson<string[]>(member.expertise, []);
              return (
                <li
                  key={member.id}
                  {...revealProps(index * 60)}
                  className="group overflow-hidden rounded-lg border border-hairline bg-surface"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface-2">
                    {member.photo ? (
                      <Image
                        src={member.photo.url}
                        alt={member.photo.alt || member.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover transition-transform duration-[var(--duration-slow)] ease-standard group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center font-display text-4xl text-ink-subtle">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-[1rem] font-semibold tracking-[-0.015em] text-ink">
                      {member.name}
                    </h3>
                    <p className="mt-0.5 text-[0.875rem] text-accent-text">
                      {member.role}
                    </p>
                    {member.bio ? (
                      <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-ink-muted">
                        {member.bio}
                      </p>
                    ) : null}
                    {expertise.length ? (
                      <ul className="mt-3 flex flex-wrap gap-1">
                        {expertise.map((item) => (
                          <li
                            key={item}
                            className="rounded-full bg-surface-2 px-2 py-0.5 text-[0.6875rem] text-ink-muted"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}

      {/* ---- Where we are ---- */}
      <Section className={team.length ? "border-y border-hairline bg-surface" : undefined}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div {...revealProps()}>
            <p className="eyebrow">Where we are</p>
            <h2 className="mt-3.5 text-display-3 text-ink">
              One office. Six markets.
            </h2>
            {address ? (
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                The studio is at {address}. It is our only office — every other
                market on this site is served remotely, and we say so on each of
                those pages rather than implying a local presence.
              </p>
            ) : null}
          </div>

          <ul {...revealProps(80)} className="grid gap-2 sm:grid-cols-2">
            {markets.map((market) => (
              <li
                key={market.slug}
                className="flex items-center gap-3 rounded-md border border-hairline bg-canvas px-4 py-3"
              >
                <span
                  aria-hidden="true"
                  className={
                    market.type === "headquarters"
                      ? "size-2 shrink-0 rounded-full bg-accent ring-4 ring-accent-soft"
                      : "size-2 shrink-0 rounded-full border border-accent"
                  }
                />
                <span className="min-w-0">
                  <span className="block text-[0.9375rem] font-medium text-ink">
                    {market.country}
                  </span>
                  <span className="block text-[0.75rem] text-ink-subtle">
                    {market.type === "headquarters"
                      ? "Studio"
                      : "Served remotely"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaSection
        title="Want to work with us?"
        body="Whether that is as a client or as part of the team, we would rather hear the specific thing you have in mind than a general introduction."
        secondary={{ label: "Careers", href: "/careers" }}
      />

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
      {team.map((member) => (
        <JsonLd
          key={member.id}
          id={`person-schema-${member.id}`}
          data={personSchema({
            name: member.name,
            role: member.role,
            path: "/about",
            image: member.photo?.url,
            linkedin: member.linkedin,
          })}
        />
      ))}
    </>
  );
}
