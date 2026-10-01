import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";
import { getOptionalBrandImage } from "@/components/ui/brand-image";
import { CtaSection } from "@/components/sections/cta";
import { Metrics } from "@/components/sections/metrics";
import { TechnologySection } from "@/components/sections/technology";
import { JsonLd } from "@/components/ui/json-ld";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema, personSchema } from "@/lib/seo";
import { getSiteSettings, formatAddress } from "@/lib/settings";
import { getTeam } from "@/lib/content";
import { differentiators, processStages } from "@/content/process";
import { markets } from "@/content/locations";
import { parseJson } from "@/lib/utils";
import { PRIMARY_CTA } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "About Our Team in New Delhi | The Digital Alchemy",
    description:
      "A New Delhi team that builds websites, apps and AI tools, and helps businesses get more customers online. How we work, and where we are.",
    path: "/about",
  });
}

/**
 * What a client can count on. Merged from two lists that overlapped ("How we
 * are different" and "What we hold ourselves to"); nothing was dropped except
 * the repetition.
 */
const PRINCIPLES = [
  ...differentiators
    .filter((item) => item.key === "product-thinking" || item.key === "ai-native")
    .map(({ title, body }) => ({ title, body })),
  {
    title: "Design, building and marketing in one team",
    body: "Designers, developers and the people who will market it work together from the first week, so nothing gets lost in a hand-over and nothing is patched on after launch.",
  },
  {
    title: "We tell you early when something is wrong",
    body: "If a plan is wrong or an ad is not working, we tell you. We say it early, while it is still cheap to change.",
  },
  {
    title: "We build things your team can look after",
    body: "Common tools, decisions written down, and accounts in your name. We would rather earn the next project than be the only people who can run what we built.",
  },
  {
    title: "We measure what matters to you",
    body: "Views and clicks are only the start. We track the results your business is judged on, and report what did not improve as well as what did.",
  },
  {
    title: "We finish things properly",
    body: "Error messages, old links kept working, access for everyone, the second version. The dull last part is what separates working software from a demo.",
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
        eyebrow="About us"
        title="A New Delhi team that builds websites, apps and AI tools."
        lede="We help businesses get more customers online and spend less time on repetitive work. One team plans, designs, builds and markets, so nothing gets lost between different companies."
        crumbs={crumbs}
        primaryCta={{ label: PRIMARY_CTA.label, href: PRIMARY_CTA.href }}
        bleedImage={getOptionalBrandImage("hero-about")}
        bleedImageAlt="A design workbench with prototype models"
      />

      {/* ---- 1. Who we are ---- */}
      <Section className="relative overflow-hidden border-y border-hairline bg-surface">
        <SectionBackdrop name="studio-bench" from="var(--color-surface)" opacity={0.18} side="right" />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div {...revealProps()}>
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-3.5 text-display-3 text-ink">
              We build and grow businesses online, from New Delhi.
            </h2>
            <p className="mt-6 font-serif text-[clamp(1.25rem,1rem+1vw,1.625rem)] leading-snug text-ink">
              We want growing businesses to have the kind of websites, apps and
              AI tools that big companies have, without the jargon or the waste.
            </p>
          </div>

          <div
            {...revealProps(80)}
            className="space-y-4 text-[1.0625rem] leading-relaxed text-ink-muted"
          >
            <p>
              We are a team in New Delhi. We build websites, online stores, apps
              and software, set up AI tools that save time, and run online
              marketing that brings in customers.
            </p>
            <p>
              A common problem: a business&apos;s website, apps and marketing were
              set up by different people who never talked to each other. Work gets
              copied by hand, and nobody can say what is working. We bring it all
              into one team.
            </p>
            <p>
              We work closely with you, explain things in plain words, and build
              things your own team can look after.
            </p>
          </div>
        </div>
      </Section>

      {/*
        ---- 2. The team ----
        Profiles come from Admin → Team. Until someone is published, this says
        who you would work with, without inventing names or faces.
      */}
      {team.length ? (
        <Section>
          <SectionHeading
            eyebrow="The team"
            title="The people you would work with."
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
      ) : (
        <Section size="sm">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div {...revealProps()}>
              <p className="eyebrow">The team</p>
              <h2 className="mt-3.5 text-display-3 text-ink">
                The people you would work with.
              </h2>
            </div>
            <p {...revealProps(80)} className="text-[1.0625rem] leading-relaxed text-ink-muted lg:pt-2">
              You work with the same small team from the first call to launch.
              The people who plan and design your project also build it and help
              people find it, so you never have to explain things twice.
            </p>
          </div>
        </Section>
      )}

      {/* ---- 3. Where we are ---- */}
      <Section className="border-y border-hairline bg-surface">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div {...revealProps()}>
            <p className="eyebrow">Where we are</p>
            <h2 className="mt-3.5 text-display-3 text-ink">
              One office, in New Delhi.
            </h2>
            {address ? (
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-muted">
                We are at {address}. It is our only office. We work with clients
                in the other countries remotely, and we say so on each
                country&apos;s page.
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
                      ? "Our office"
                      : "Remote"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---- 4. How we work ---- */}
      <Section>
        <SectionHeading
          eyebrow="How we work"
          title="Four steps, the same for every project."
        />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {processStages.map((stage, index) => (
            <li
              key={stage.step}
              {...revealProps(index * 60)}
              className="border-t border-hairline pt-5"
            >
              <span className="numeric font-mono text-[0.75rem] tracking-[0.14em] text-accent-text">
                {stage.step}
              </span>
              <h3 className="mt-2 text-title text-ink">{stage.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                {stage.summary}
              </p>
            </li>
          ))}
        </ol>

        <h3 className="mt-16 text-title text-ink">What you can count on</h3>
        <ul className="mt-6 grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {PRINCIPLES.map((item, index) => (
            <li key={item.title} {...revealProps(index * 50)} className="flex gap-3">
              <Check aria-hidden="true" className="mt-1.5 size-4 shrink-0 text-accent" />
              <div>
                <p className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-ink">
                  {item.title}
                </p>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Metrics />

      {/* Moved here from the homepage (Phase 5): for the people who ask what we build with. */}
      <TechnologySection />

      <CtaSection
        title="Want to work with us?"
        body="Tell us what you need. We will reply with questions, a suggested next step, or an honest no if we are not the right fit."
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
