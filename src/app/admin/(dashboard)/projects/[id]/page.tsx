import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requirePermission } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { PageHeader, Notice } from "@/components/admin/ui";
import { services } from "@/content/services";
import { parseJson } from "@/lib/utils";
import { ProjectEditor } from "./project-editor";

export const metadata = { title: "Edit project" };
export const dynamic = "force-dynamic";

export default async function ProjectEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const user = await requirePermission("projects.manage");
  const [{ id }, { created }] = await Promise.all([params, searchParams]);

  const isNew = id === "new";

  const project = isNew
    ? null
    : await db.project.findUnique({
        where: { id },
        include: { results: { orderBy: { order: "asc" } } },
      });

  if (!isNew && !project) notFound();

  const [media, clients] = await Promise.all([
    db.media.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { id: true, url: true, filename: true },
    }),
    db.client.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <>
      <Link
        href="/admin/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink-muted underline-offset-4 hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Back to projects
      </Link>

      <PageHeader
        title={isNew ? "New project" : (project?.title ?? "Edit project")}
        description={
          isNew
            ? "Publish only work you have permission to show."
            : `/work/${project?.slug}`
        }
      />

      {created ? <Notice>Project created. Add results and imagery below.</Notice> : null}

      <ProjectEditor
        project={
          project
            ? {
                id: project.id,
                slug: project.slug,
                title: project.title,
                clientId: project.clientId ?? "",
                clientName: project.clientName ?? "",
                category: project.category,
                industry: project.industry ?? "",
                country: project.country ?? "",
                year: project.year ? String(project.year) : "",
                durationText: project.durationText ?? "",
                summary: project.summary,
                challenge: project.challenge ?? "",
                strategy: project.strategy ?? "",
                research: project.research ?? "",
                design: project.design ?? "",
                technology: project.technology ?? "",
                development: project.development ?? "",
                marketing: project.marketing ?? "",
                outcome: project.outcome ?? "",
                websiteUrl: project.websiteUrl ?? "",
                heroId: project.heroId ?? "",
                services: parseJson<string[]>(project.services, []),
                techStack: parseJson<string[]>(project.techStack, []).join(", "),
                isFeatured: project.isFeatured,
                status: project.status,
                order: project.order,
                results: project.results.map((result) => ({
                  id: result.id,
                  label: result.label,
                  value: result.value,
                  note: result.note ?? "",
                })),
              }
            : null
        }
        serviceOptions={services.map((service) => ({
          slug: service.slug,
          name: service.name,
        }))}
        mediaOptions={media}
        clientOptions={clients}
        canDelete={can(user.role, "content.delete")}
      />
    </>
  );
}
