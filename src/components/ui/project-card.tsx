import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { cn, parseJson } from "@/lib/utils";
import { revealProps } from "@/lib/reveal";
import { PROJECT_CATEGORY_LABELS, type ProjectCategory } from "@/lib/db";
import { getServices } from "@/content/services";
import { BrowserFrame, WebsiteMockup } from "@/components/visuals/mockups";

export interface ProjectCardData {
  id: string;
  slug: string;
  title: string;
  category: string;
  industry: string | null;
  country: string | null;
  services: string;
  clientName: string | null;
  client: { name: string } | null;
  hero: { url: string; alt: string; width: number | null; height: number | null } | null;
  results?: { id: string; label: string; value: string }[];
}

export function ProjectCard({
  project,
  index = 0,
  size = "default",
}: {
  project: ProjectCardData;
  index?: number;
  size?: "default" | "large";
}) {
  const serviceSlugs = parseJson<string[]>(project.services, []);
  const services = getServices(serviceSlugs).slice(0, 4);
  const client = project.client?.name ?? project.clientName;
  const categoryLabel =
    PROJECT_CATEGORY_LABELS[project.category as ProjectCategory] ??
    project.category;

  return (
    <Link
      href={`/work/${project.slug}`}
      {...revealProps(index * 70)}
      data-analytics="case_study_view"
      className={cn(
        "group flex flex-col overflow-hidden rounded-lg border border-hairline bg-surface",
        "transition-[box-shadow,border-color,transform] duration-[var(--duration-standard)] ease-standard",
        "hover:-translate-y-0.5 hover:border-hairline-strong hover:shadow-lg motion-reduce:hover:translate-y-0",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-surface-2",
          size === "large" ? "aspect-[16/10]" : "aspect-[4/3]",
        )}
      >
        {project.hero ? (
          <Image
            src={project.hero.url}
            alt={project.hero.alt || project.title}
            fill
            sizes={
              size === "large"
                ? "(max-width: 768px) 100vw, 60vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            className="object-cover transition-transform duration-[var(--duration-slow)] ease-standard group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          // No hero uploaded yet: a neutral device frame rather than a stock
          // photo standing in for work we cannot show.
          <div className="flex h-full items-center justify-center p-6">
            <BrowserFrame compact url={`${project.slug}`} className="w-full">
              <WebsiteMockup className="p-2" />
            </BrowserFrame>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="eyebrow">{categoryLabel}</span>
          {project.industry ? (
            <>
              <span aria-hidden="true" className="text-hairline-strong">
                ·
              </span>
              <span className="eyebrow">{project.industry}</span>
            </>
          ) : null}
          {project.country ? (
            <>
              <span aria-hidden="true" className="text-hairline-strong">
                ·
              </span>
              <span className="eyebrow">{project.country}</span>
            </>
          ) : null}
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <h3
            className={cn(
              "text-ink",
              size === "large" ? "text-display-3" : "text-title",
            )}
          >
            {project.title}
          </h3>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-1.5 size-4 shrink-0 text-ink-subtle transition-[transform,color] duration-[var(--duration-fast)] ease-standard group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
          />
        </div>

        {client ? (
          <p className="mt-1 text-[0.875rem] text-ink-subtle">{client}</p>
        ) : null}

        {services.length ? (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {services.map((service) => (
              <li
                key={service.slug}
                className="rounded-full border border-hairline px-2.5 py-1 text-[0.75rem] text-ink-muted"
              >
                {service.name}
              </li>
            ))}
          </ul>
        ) : null}

        {/* Results are shown only when an administrator has entered verified
            figures. No placeholder metrics. */}
        {project.results?.length ? (
          <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-4">
            {project.results.slice(0, 3).map((result) => (
              <div key={result.id}>
                <dd className="numeric text-lg font-semibold text-ink">
                  {result.value}
                </dd>
                <dt className="text-[0.75rem] text-ink-subtle">
                  {result.label}
                </dt>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </Link>
  );
}
