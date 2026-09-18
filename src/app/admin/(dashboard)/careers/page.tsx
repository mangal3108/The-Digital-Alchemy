import { requirePermission } from "@/lib/auth";
import { db } from "@/lib/db";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import {
  AddRoleButton,
  AddRolePanel,
  AddRoleProvider,
  JobEditor,
  type Job,
} from "./job-editor";

export const metadata = { title: "Careers" };
export const dynamic = "force-dynamic";

/**
 * Open roles.
 *
 * The public careers page states plainly that there is nothing open when this
 * table is empty, rather than running a permanently open advert — so an empty
 * list here is a supported state, not a gap to fill.
 *
 * A published role gets its own page and a JobPosting structured-data block,
 * which is what makes it eligible for Google Jobs. That is also why publishing
 * requires an application route: a listing nobody can respond to is worse than
 * no listing.
 */
export default async function CareersAdminPage() {
  await requirePermission("careers.manage");

  const rows = await db.jobOpening.findMany({
    orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }],
  });

  const jobs: Job[] = rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    employmentType: row.employmentType,
    workplace: row.workplace,
    location: row.location ?? "",
    description: row.description,
    responsibilities: row.responsibilities,
    requirements: row.requirements,
    salaryRange: row.salaryRange ?? "",
    applyEmail: row.applyEmail ?? "",
    applyUrl: row.applyUrl ?? "",
    status: row.status,
    closesAt: row.closesAt ? row.closesAt.toISOString().slice(0, 10) : "",
    metaTitle: row.metaTitle ?? "",
    metaDescription: row.metaDescription ?? "",
    orderIndex: row.orderIndex,
  }));

  const published = jobs.filter((job) => job.status === "PUBLISHED").length;

  return (
    <AddRoleProvider>
      <PageHeader
        title="Careers"
        description={
          published
            ? `${published} role${published === 1 ? "" : "s"} live on /careers. Drafts and closed roles stay here and are not published.`
            : "Nothing is live. The careers page says so plainly rather than running an open advert."
        }
        action={<AddRoleButton />}
      />

      <AddRolePanel />

      {jobs.length ? (
        <div className="mt-6 grid gap-3">
          {jobs.map((job) => (
            <JobEditor key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No roles yet"
          description="Add one when you are hiring. Until then the careers page invites speculative applications, which is what it does today."
        />
      )}
    </AddRoleProvider>
  );
}
