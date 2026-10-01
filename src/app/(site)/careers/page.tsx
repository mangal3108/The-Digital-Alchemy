import type { Metadata } from "next";
import { getPublishedJobs } from "@/lib/content";
import { EMPLOYMENT_TYPE_LABELS, WORKPLACE_LABELS } from "@/content/careers";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { BrandLogos } from "@/components/ui/brand-logos";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { JsonLd } from "@/components/ui/json-ld";
import { Button } from "@/components/ui/button";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { getSiteSettings } from "@/lib/settings";

import { getOptionalBrandImage } from "@/components/ui/brand-image";
import { SectionBackdrop } from "@/components/visuals/section-backdrop";

/**
 * Re-render every five minutes.
 *
 * Admin saves call `revalidatePath("/careers")`, which covers edits. It does
 * not cover the other way a listing changes: a closing date passing. That is a
 * clock event with no save behind it, so without a time-based revalidate an
 * expired role stays listed until somebody happens to edit something.
 */
export const revalidate = 300;


export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Careers and Jobs in New Delhi | The Digital Alchemy",
    description:
      "Jobs at a small New Delhi team building websites, apps, AI tools and online marketing. Open roles are listed here, and we read speculative applications.",
    path: "/careers",
  });
}

const WHAT_WE_LOOK_FOR = [
  {
    title: "Range over specialism, early on",
    body: "In a small team, range matters. A designer who knows what is expensive to build, and an engineer who can read an analytics report, are worth more than two specialists.",
  },
  {
    title: "Finishing things",
    body: "Taking something from eighty per cent to truly done is the rarest skill we hire for. That means the edge cases, the error states, access for everyone, and the second pass.",
  },
  {
    title: "Writing clearly",
    body: "Most of our work with clients in other time zones happens in writing. Being able to explain a decision in a paragraph matters more than being able to present it.",
  },
  {
    title: "Saying when something is wrong",
    body: "We would rather hear that a plan will not work in week one than discover it in week six. That only happens if people feel able to say it.",
  },
];

export default async function CareersPage() {
  const settings = await getSiteSettings();
  const jobs = await getPublishedJobs();
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Careers", href: "/careers" },
  ];

  const applyHref = settings.email
    ? `mailto:${settings.email}?subject=${encodeURIComponent("Application — The Digital Alchemy")}`
    : "/contact";

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Careers: join a small team doing work you can be proud of."
        lede="We are not always hiring, and we would rather say so plainly than keep a careers page open forever. When we have a job, it is listed here."
        crumbs={crumbs}
        primaryCta={
          jobs.length
            ? { label: "View open roles", href: "#roles" }
            : { label: "Send an introduction", href: applyHref }
        }
        bleedImage={getOptionalBrandImage("hero-careers")}
        bleedImageAlt="A quiet workspace with a desk chair in daylight"
      />

      {/* ---- Tools our team works with strip ---- */}
      <section className="border-b border-hairline bg-surface/60 py-6 sm:py-7">
        <div className="container-page">
          <BrandLogos
            slugs={[
              "react",
              "nextjs",
              "typescript",
              "nodejs",
              "python",
              "figma",
              "aws",
              "docker",
              "tailwind",
            ]}
            title="Tools and technologies our team works in daily"
            layout="strip"
            size="md"
          />
        </div>
      </section>

      {/*
        Roles come from the CMS. When none are open the page says so plainly
        rather than running a permanently open advert — which is the same
        position it held before there was a CMS behind it.
      */}
      {jobs.length ? (
        <Section id="roles" size="sm" className="border-y border-hairline bg-surface">
          <SectionHeading
            eyebrow="Open roles"
            title={`${jobs.length} role${jobs.length === 1 ? "" : "s"} open right now.`}
          />
          <ul className="mt-9 grid gap-4">
            {jobs.map((job, index) => (
              <li key={job.id} {...revealProps(index * 60)}>
                <Link
                  href={`/careers/${job.slug}`}
                  className="group flex flex-col gap-3 rounded-lg border border-hairline bg-canvas p-6 transition-[border-color,box-shadow,transform] duration-[var(--duration-standard)] ease-standard hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:hover:translate-y-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="min-w-0">
                    <span className="block text-title text-ink">{job.title}</span>
                    <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-ink-muted">
                      {job.summary}
                    </span>
                    <span className="mt-3 block font-mono text-[0.75rem] uppercase tracking-[0.1em] text-ink-subtle">
                      {EMPLOYMENT_TYPE_LABELS[job.employmentType] ?? job.employmentType}
                      {" · "}
                      {WORKPLACE_LABELS[job.workplace] ?? job.workplace}
                      {job.location ? ` · ${job.location}` : ""}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 shrink-0 text-ink-subtle transition-[transform,color] duration-[var(--duration-fast)] ease-standard group-hover:translate-x-0.5 group-hover:text-accent-text motion-reduce:transition-none"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section size="sm" className="border-y border-hairline bg-surface">
        <div
          {...revealProps()}
          className="mx-auto max-w-3xl rounded-lg border border-hairline bg-canvas p-7 sm:p-9"
        >
          <p className="eyebrow">Open roles</p>
          <h2 className="mt-3 text-title text-ink">
            {jobs.length
              ? "Not quite the right role?"
              : "No advertised vacancies at the moment."}
          </h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            We still read speculative applications. If you are genuinely good at design, development or marketing, send us
            something specific, not a general CV. Show us a project you launched,
            a problem you solved, or something you built because you wanted it to
            exist.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button href={applyHref} withArrow>
              Send an introduction
            </Button>
          </div>
        </div>
      </Section>

      <Section className="relative overflow-hidden">
        <SectionBackdrop name="studio-seats" from="var(--color-canvas)" opacity={0.16} side="right" />
        <div className="relative">
          <SectionHeading
            eyebrow="What we look for"
            title="What actually gets someone hired here."
          />
          <div className="mt-11 grid gap-5 sm:grid-cols-2">
            {WHAT_WE_LOOK_FOR.map((item, index) => (
              <div
                key={item.title}
                {...revealProps(index * 60)}
                className="rounded-lg border border-hairline bg-surface p-6"
              >
                <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="relative overflow-hidden border-t border-hairline bg-surface">
        <SectionBackdrop name="plate-bench-light" from="var(--color-surface)" opacity={0.18} side="left" />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div {...revealProps()}>
            <p className="eyebrow">How we hire</p>
            <h2 className="mt-3.5 text-display-3 text-ink">
              Short, and paid where it should be.
            </h2>
          </div>
          <ol {...revealProps(80)} className="space-y-5">
            {[
              {
                title: "A conversation",
                body: "About what you have built and what you want to be doing. Not a quiz.",
              },
              {
                title: "A practical exercise",
                body: "Short, realistic, and related to the actual role. If it takes more than a couple of hours, we pay for your time.",
              },
              {
                title: "A working session",
                body: "You spend time with the people you would work with, on something real, so both sides can judge properly.",
              },
              {
                title: "An offer, or a straight no",
                body: "With the reasoning either way. Being left to guess after three rounds is a bad experience and we try not to create it.",
              },
            ].map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="numeric font-mono text-[0.6875rem] leading-6 tracking-[0.14em] text-accent-text">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-[1rem] font-semibold tracking-[-0.015em] text-ink">
                    {step.title}
                  </span>
                  <span className="mt-1 block text-[0.9375rem] leading-relaxed text-ink-muted">
                    {step.body}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}
