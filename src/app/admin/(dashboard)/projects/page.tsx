import Link from "next/link";

import { requirePermission } from "@/lib/auth";
import { db, PROJECT_CATEGORY_LABELS, type ProjectCategory } from "@/lib/db";
import {
  Badge,
  Card,
  EmptyState,
  PageHeader,
  TableWrap,
  Td,
  Th,
} from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Projects" };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  await requirePermission("projects.manage");

  const projects = await db.project.findMany({
    orderBy: [{ status: "asc" }, { order: "asc" }, { updatedAt: "desc" }],
    include: {
      client: { select: { name: true } },
      _count: { select: { results: true, media: true } },
    },
  });

  const published = projects.filter((p) => p.status === "PUBLISHED").length;

  return (
    <>
      <PageHeader
        title="Projects"
        description="Case studies for the work page. Only published projects appear on the site."
        action={
          <Button href="/admin/projects/new" size="sm" withArrow>
            New project
          </Button>
        }
      />

      {!published ? (
        <div className="mb-5 rounded-md border border-hairline bg-surface px-4 py-3">
          <p className="text-[0.875rem] font-medium text-ink">
            Nothing published yet
          </p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-muted">
            The public work page, the homepage band and the mega menu are all
            showing their honest empty state. They switch over automatically as
            soon as one project is published — no code change needed.
          </p>
        </div>
      ) : null}

      <Card>
        {projects.length ? (
          <TableWrap>
            <thead>
              <tr>
                <Th>Project</Th>
                <Th>Category</Th>
                <Th>Status</Th>
                <Th>Content</Th>
                <Th>Updated</Th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <Td>
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="font-medium text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      {project.title}
                    </Link>
                    <span className="block text-[0.75rem] text-ink-subtle">
                      /work/{project.slug}
                      {project.client?.name || project.clientName
                        ? ` · ${project.client?.name ?? project.clientName}`
                        : ""}
                    </span>
                  </Td>
                  <Td>
                    {PROJECT_CATEGORY_LABELS[
                      project.category as ProjectCategory
                    ] ?? project.category}
                  </Td>
                  <Td>
                    <Badge
                      tone={
                        project.status === "PUBLISHED"
                          ? "success"
                          : project.status === "ARCHIVED"
                            ? "danger"
                            : "neutral"
                      }
                    >
                      {project.status}
                    </Badge>
                    {project.isFeatured ? (
                      <Badge tone="accent" className="ml-1.5">
                        Featured
                      </Badge>
                    ) : null}
                  </Td>
                  <Td>
                    <span className="text-[0.8125rem]">
                      {project._count.results} result
                      {project._count.results === 1 ? "" : "s"} ·{" "}
                      {project._count.media} image
                      {project._count.media === 1 ? "" : "s"}
                    </span>
                  </Td>
                  <Td>
                    <span className="whitespace-nowrap text-[0.8125rem]">
                      {formatDate(project.updatedAt)}
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        ) : (
          <EmptyState
            title="No projects yet"
            description="Add case studies as clients approve them. Publish only work you have permission to show, with results you can evidence."
            action={
              <Button href="/admin/projects/new" size="sm" withArrow>
                Add the first project
              </Button>
            }
          />
        )}
      </Card>
    </>
  );
}
