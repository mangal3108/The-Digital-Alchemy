import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";

import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/ui/json-ld";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { getJobBySlug, getPublishedJobs } from "@/lib/content";
import { getSiteSettings, formatAddress } from "@/lib/settings";
import { siteConfig } from "@/config/site";
import {
  EMPLOYMENT_TYPE_LABELS,
  WORKPLACE_LABELS,
  SCHEMA_EMPLOYMENT_TYPE,
} from "@/content/careers";

/**
 * Re-render every five minutes.
 *
 * Admin saves call `revalidatePath("/careers")`, which covers edits. It does
 * not cover the other way a listing changes: a closing date passing. That is a
 * clock event with no save behind it, so without a time-based revalidate an
 * expired role stays listed until somebody happens to edit something.
 */
export const revalidate = 300;


/**
 * A single open role.
 *
 * Rendered from the CMS, so this route exists only while the role is published
 * and inside its closing date — `getJobBySlug` enforces both, and anything else
 * 404s rather than showing a stale listing.
 */

export async function generateStaticParams() {
  const jobs = await getPublishedJobs();
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return {};

  return buildMetadata({
    title: job.metaTitle || `${job.title} | Careers | ${siteConfig.name}`,
    description: job.metaDescription || job.summary,
    path: `/careers/${slug}`,
  });
}

/** Newline-separated TEXT, which is how the model stores these lists. */
function lines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();

  const settings = await getSiteSettings();
  const address = formatAddress(settings);

  const responsibilities = lines(job.responsibilities);
  const requirements = lines(job.requirements);

  const applyHref = job.applyUrl
    ? job.applyUrl
    : job.applyEmail
      ? `mailto:${job.applyEmail}?subject=${encodeURIComponent(`Application — ${job.title}`)}`
      : "/contact";

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Careers", href: "/careers" },
    { name: job.title, href: `/careers/${slug}` },
  ];

  /**
   * JobPosting structured data. This is what makes the role eligible for
   * Google Jobs, and the reason the admin requires an application route before
   * a role can be published.
   *
   * `baseSalary` is omitted entirely unless a range was entered. A fabricated
   * or placeholder salary in structured data is worse than none — it is a
   * machine-readable claim to a candidate about what the job pays.
   */
  const jobSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || job.summary,
    datePosted: (job.publishedAt ?? job.createdAt).toISOString(),
    employmentType: SCHEMA_EMPLOYMENT_TYPE[job.employmentType] ?? job.employmentType,
    hiringOrganization: {
      "@type": "Organization",
      name: siteConfig.name,
      sameAs: siteConfig.url,
    },
    directApply: Boolean(job.applyEmail && !job.applyUrl),
  };

  if (job.closesAt) jobSchema.validThrough = job.closesAt.toISOString();

  if (job.workplace === "REMOTE") {
    jobSchema.jobLocationType = "TELECOMMUTE";
    jobSchema.applicantLocationRequirements = {
      "@type": "Country",
      name: settings.addressCountry || "India",
    };
  } else if (address) {
    jobSchema.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: settings.addressStreet || undefined,
        addressLocality: settings.addressLocality || undefined,
        addressRegion: settings.addressRegion || undefined,
        postalCode: settings.addressPostalCode || undefined,
        addressCountry: settings.addressCountry || "IN",
      },
    };
  }

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title={job.title}
        lede={job.summary}
        crumbs={crumbs}
        primaryCta={{ label: "Apply for this role", href: applyHref }}
        secondaryCta={{ label: "All roles", href: "/careers" }}
      />

      <Section size="sm" className="border-y border-hairline bg-surface">
        <dl
          {...revealProps()}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            ["Employment", EMPLOYMENT_TYPE_LABELS[job.employmentType] ?? job.employmentType],
            ["Workplace", WORKPLACE_LABELS[job.workplace] ?? job.workplace],
            ["Location", job.location || address || "New Delhi, India"],
            // Only rendered when a range was actually entered.
            ...(job.salaryRange ? [["Salary", job.salaryRange]] : []),
          ].map(([label, value]) => (
            <div key={label} className="border-t border-hairline pt-4">
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-subtle">
                {label}
              </dt>
              <dd className="mt-1.5 text-[0.9375rem] font-medium text-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {job.description ? (
        <Section size="sm">
          <div
            {...revealProps()}
            className="prose-tda max-w-prose whitespace-pre-line"
          >
            {job.description}
          </div>
        </Section>
      ) : null}

      {responsibilities.length || requirements.length ? (
        <Section size="sm" className="border-t border-hairline bg-surface">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {responsibilities.length ? (
              <div {...revealProps()}>
                <h2 className="text-title text-ink">What you would be doing</h2>
                <ul className="mt-5 space-y-3">
                  {responsibilities.map((item) => (
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
              </div>
            ) : null}

            {requirements.length ? (
              <div {...revealProps(80)}>
                <h2 className="text-title text-ink">What we are looking for</h2>
                <ul className="mt-5 space-y-3">
                  {requirements.map((item) => (
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
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      <Section size="sm" className="border-t border-hairline">
        <div
          {...revealProps()}
          className="mx-auto max-w-2xl rounded-lg border border-hairline bg-surface p-7 text-center sm:p-9"
        >
          <h2 className="text-title text-ink">Interested?</h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
            Send something specific rather than a general CV — a project you
            shipped, a problem you solved, or something you built because you
            wanted it to exist.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button href={applyHref} withArrow>
              Apply for this role
            </Button>
            <Button href="/about" variant="secondary">
              How we work
            </Button>
          </div>
          {job.closesAt ? (
            <p className="mt-5 text-[0.875rem] text-ink-subtle">
              Applications close on{" "}
              {job.closesAt.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              .
            </p>
          ) : null}
        </div>
      </Section>

      <JsonLd id="job-schema" data={jobSchema} />
      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}
