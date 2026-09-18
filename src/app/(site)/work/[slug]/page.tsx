import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Quote } from "lucide-react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Section } from "@/components/ui/section-heading";
import { CtaSection } from "@/components/sections/cta";
import { JsonLd } from "@/components/ui/json-ld";
import { Button } from "@/components/ui/button";
import { revealProps } from "@/lib/reveal";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { getAdjacentProject, getProjectBySlug } from "@/lib/content";
import { getServices, serviceHref } from "@/content/services";
import { getTechnologies } from "@/content/technology";
import { parseJson } from "@/lib/utils";
import { PROJECT_CATEGORY_LABELS, type ProjectCategory } from "@/lib/db";
import { BrowserFrame, WebsiteMockup } from "@/components/visuals/mockups";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return buildMetadata({
    title: `${project.title} — Case Study | The Digital Alchemy`,
    description:
      project.summary ||
      `How we approached ${project.title}, and what changed as a result.`,
    path: `/work/${slug}`,
    image: project.hero?.url,
  });
}

/** Narrative sections, rendered only where the CMS holds content. */
const STORY_FIELDS = [
  { key: "challenge", label: "The challenge" },
  { key: "strategy", label: "Strategy" },
  { key: "research", label: "Research" },
  { key: "design", label: "Design" },
  { key: "technology", label: "Technology" },
  { key: "development", label: "Development" },
  { key: "marketing", label: "Marketing" },
  { key: "outcome", label: "Outcome" },
] as const;

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const next = await getAdjacentProject(slug);
  const services = getServices(parseJson<string[]>(project.services, []));
  const technologies = getTechnologies(parseJson<string[]>(project.techStack, []));
  const client = project.client?.name ?? project.clientName;
  const testimonial = project.testimonials[0];
  const categoryLabel =
    PROJECT_CATEGORY_LABELS[project.category as ProjectCategory] ??
    project.category;

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Work", href: "/work" },
    { name: project.title, href: `/work/${slug}` },
  ];

  const meta: [string, string | null][] = [
    ["Client", client],
    ["Industry", project.industry],
    ["Market", project.country],
    ["Year", project.year ? String(project.year) : null],
    ["Duration", project.durationText],
    ["Category", categoryLabel],
  ];

  return (
    <>
      {/* ---- Hero ---- */}
      <section className="border-b border-hairline">
        <div className="container-page pb-12 pt-8 sm:pb-14">
          <Breadcrumb crumbs={crumbs} className="mb-8" />

          <div {...revealProps()} className="max-w-3xl">
            <p className="eyebrow">{categoryLabel}</p>
            <h1 className="mt-4 text-display-2 text-ink">{project.title}</h1>
            {project.summary ? (
              <p className="mt-5 text-lede text-ink-muted">{project.summary}</p>
            ) : null}
          </div>

          {project.websiteUrl ? (
            <div {...revealProps(120)} className="mt-7">
              <Button href={project.websiteUrl} variant="secondary">
                Visit the live site
                <ExternalLink aria-hidden="true" className="size-4" />
              </Button>
            </div>
          ) : null}
        </div>

        <div className="container-page pb-12">
          <div
            {...revealProps(80, 22)}
            className="relative aspect-[16/9] overflow-hidden rounded-lg border border-hairline bg-surface-2"
          >
            {project.hero ? (
              <Image
                src={project.hero.url}
                alt={project.hero.alt || project.title}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-8">
                <BrowserFrame className="w-full max-w-3xl" url={project.slug}>
                  <WebsiteMockup className="p-4" />
                </BrowserFrame>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---- Body with sticky metadata ---- */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] lg:gap-16">
          {/* Metadata */}
          <aside className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
            <dl className="divide-y divide-hairline border-y border-hairline">
              {meta
                .filter(([, value]) => Boolean(value))
                .map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4 py-3">
                    <dt className="text-[0.8125rem] text-ink-subtle">{label}</dt>
                    <dd className="text-right text-[0.875rem] font-medium text-ink">
                      {value}
                    </dd>
                  </div>
                ))}
            </dl>

            {services.length ? (
              <div className="mt-7">
                <p className="eyebrow">Services</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={serviceHref(service.slug)}
                        className="inline-block rounded-full border border-hairline px-2.5 py-1 text-[0.75rem] text-ink-muted transition-colors duration-[var(--duration-fast)] hover:border-hairline-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {technologies.length ? (
              <div className="mt-7">
                <p className="eyebrow">Technology</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {technologies.map((tech) => (
                    <li
                      key={tech.key}
                      className="rounded-full bg-surface-2 px-2.5 py-1 text-[0.75rem] text-ink-muted"
                    >
                      {tech.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>

          {/* Narrative */}
          <div className="min-w-0">
            {STORY_FIELDS.map((field, index) => {
              const value = project[field.key];
              if (!value) return null;
              return (
                <section
                  key={field.key}
                  {...revealProps(index * 40)}
                  className="mb-11 last:mb-0"
                >
                  <h2 className="text-title text-ink">{field.label}</h2>
                  <div className="mt-3 space-y-4">
                    {value.split(/\n{2,}/).map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-[1.0625rem] leading-relaxed text-ink-muted"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Results — only when verified figures exist */}
            {project.results.length ? (
              <section {...revealProps()} className="mb-11">
                <h2 className="text-title text-ink">Results</h2>
                <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                  {project.results.map((result) => (
                    <div
                      key={result.id}
                      className="rounded-lg border border-hairline bg-surface p-5"
                    >
                      <dd className="numeric text-[2rem] font-semibold leading-none text-ink">
                        {result.value}
                      </dd>
                      <dt className="mt-2.5 text-[0.875rem] font-medium text-ink-muted">
                        {result.label}
                      </dt>
                      {result.note ? (
                        <p className="mt-1.5 text-[0.75rem] leading-snug text-ink-subtle">
                          {result.note}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {/* Gallery */}
            {project.media.length ? (
              <section {...revealProps()} className="mb-11">
                <h2 className="text-title text-ink">Gallery</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {project.media.map((item) => (
                    <figure key={item.id}>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-hairline bg-surface-2">
                        <Image
                          src={item.media.url}
                          alt={item.media.alt || item.caption || ""}
                          fill
                          sizes="(max-width: 640px) 100vw, 45vw"
                          className="object-cover"
                        />
                      </div>
                      {item.caption ? (
                        <figcaption className="mt-2 text-[0.8125rem] text-ink-subtle">
                          {item.caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Testimonial */}
            {testimonial ? (
              <figure
                {...revealProps()}
                className="rounded-lg border border-hairline bg-surface p-7"
              >
                <Quote aria-hidden="true" className="size-5 text-accent" />
                <blockquote className="mt-4 font-serif text-[1.375rem] leading-snug text-ink">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-hairline pt-4">
                  {testimonial.photo ? (
                    <Image
                      src={testimonial.photo.url}
                      alt=""
                      width={40}
                      height={40}
                      className="size-10 rounded-full object-cover"
                    />
                  ) : null}
                  <span>
                    <span className="block text-[0.9375rem] font-medium text-ink">
                      {testimonial.authorName}
                    </span>
                    <span className="block text-[0.8125rem] text-ink-subtle">
                      {[testimonial.position, testimonial.company]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ) : null}
          </div>
        </div>
      </Section>

      {/* ---- Next project ---- */}
      {next ? (
        <section className="border-t border-hairline bg-surface">
          <div className="container-page py-10">
            <Link
              href={`/work/${next.slug}`}
              className="group flex flex-col gap-2 rounded-md py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:flex-row sm:items-center sm:justify-between"
            >
              <span>
                <span className="eyebrow">Next project</span>
                <span className="mt-2 block text-title text-ink">
                  {next.title}
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="size-5 shrink-0 text-ink-subtle transition-transform duration-[var(--duration-fast)] ease-standard group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              />
            </Link>
          </div>
        </section>
      ) : null}

      <CtaSection
        title="Working on something similar?"
        body="Tell us about it. We will tell you how we would approach it and what we would want to know first."
        secondary={{ label: "See all work", href: "/work" }}
      />

      <JsonLd id="breadcrumb-schema" data={breadcrumbSchema(crumbs)} />
    </>
  );
}
