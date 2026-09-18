import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import {
  Badge,
  Card,
  EmptyState,
  PageHeader,
  StatCard,
  Td,
  TableWrap,
  Th,
} from "@/components/admin/ui";
import { formatDateTime, parseJson } from "@/lib/utils";
import { LEAD_STATUS_TONES } from "@/components/admin/lead-status";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

/**
 * Admin dashboard.
 *
 * Every figure here is a real count from the database. There are no sample
 * charts and no placeholder numbers — an empty install shows zeros and empty
 * states, which is the honest picture and also the useful one.
 */
export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const [user, { denied }] = await Promise.all([requireUser(), searchParams]);

  const since30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalLeads,
    newLeads,
    recentLeads,
    projectCount,
    publishedProjects,
    productCount,
    postCount,
    publishedPosts,
    testimonialCount,
    mediaCount,
    leadsByStatus,
    topSources,
    topCountries,
  ] = await Promise.all([
    db.lead.count({ where: { NOT: { status: "SPAM" } } }),
    db.lead.count({ where: { status: "NEW" } }),
    db.lead.findMany({
      where: { NOT: { status: "SPAM" } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.project.count(),
    db.project.count({ where: { status: "PUBLISHED" } }),
    db.product.count(),
    db.post.count(),
    db.post.count({ where: { status: "PUBLISHED" } }),
    db.testimonial.count(),
    db.media.count(),
    db.lead.groupBy({
      by: ["status"],
      _count: { _all: true },
      where: { createdAt: { gte: since30Days } },
    }),
    db.lead.groupBy({
      by: ["utmSource"],
      _count: { _all: true },
      where: { NOT: { status: "SPAM" }, createdAt: { gte: since30Days } },
      orderBy: { _count: { utmSource: "desc" } },
      take: 5,
    }),
    db.lead.groupBy({
      by: ["country"],
      _count: { _all: true },
      // `isSet: true`, not `not: null` — see `getScopedFaqs` for why an absent
      // field on MongoDB does not behave like a null one.
      where: { NOT: { status: "SPAM" }, country: { isSet: true } },
      orderBy: { _count: { country: "desc" } },
      take: 5,
    }),
  ]);

  const canSeeLeads = can(user.role, "leads.view");

  return (
    <>
      <PageHeader
        title={`Good to see you, ${user.name.split(" ")[0]}`}
        description="Everything below is live data. Sections stay empty until there is something real to show."
      />

      {denied ? (
        <p
          role="alert"
          className="mb-6 rounded-md border border-danger/30 bg-danger/5 px-3.5 py-2.5 text-[0.8125rem] font-medium text-danger"
        >
          You do not have permission to open that page.
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {canSeeLeads ? (
          <>
            <StatCard
              label="Total enquiries"
              value={totalLeads}
              hint="Excluding spam"
              href="/admin/leads"
            />
            <StatCard
              label="New / unactioned"
              value={newLeads}
              hint={newLeads ? "Waiting on a reply" : "All caught up"}
              href="/admin/leads?status=NEW"
            />
          </>
        ) : null}
        <StatCard
          label="Case studies"
          value={projectCount}
          hint={`${publishedProjects} published`}
          href="/admin/projects"
        />
        <StatCard
          label="Articles"
          value={postCount}
          hint={`${publishedPosts} published`}
          href="/admin/posts"
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={productCount} href="/admin/products" />
        <StatCard
          label="Testimonials"
          value={testimonialCount}
          href="/admin/testimonials"
        />
        <StatCard label="Media files" value={mediaCount} href="/admin/media" />
        <StatCard
          label="Your role"
          value={user.role.replace("_", " ")}
          hint="Permissions are enforced server-side"
        />
      </div>

      {/* ---- Recent enquiries ---- */}
      {canSeeLeads ? (
        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Card
            title="Recent enquiries"
            description="The eight most recent, spam excluded."
            action={
              <Link
                href="/admin/leads"
                className="text-[0.8125rem] font-medium text-accent-text underline-offset-4 hover:underline"
              >
                View all
              </Link>
            }
          >
            {recentLeads.length ? (
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Name</Th>
                    <Th>Interested in</Th>
                    <Th>Status</Th>
                    <Th>Received</Th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => {
                    const services = parseJson<string[]>(lead.services, []);
                    return (
                      <tr key={lead.id}>
                        <Td>
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="font-medium text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                          >
                            {lead.name}
                          </Link>
                          <span className="block text-[0.75rem] text-ink-subtle">
                            {lead.company || lead.email}
                          </span>
                        </Td>
                        <Td>
                          <span className="text-[0.8125rem]">
                            {services.length
                              ? services.slice(0, 2).join(", ") +
                                (services.length > 2
                                  ? ` +${services.length - 2}`
                                  : "")
                              : "—"}
                          </span>
                        </Td>
                        <Td>
                          <Badge tone={LEAD_STATUS_TONES[lead.status] ?? "neutral"}>
                            {lead.status}
                          </Badge>
                        </Td>
                        <Td>
                          <span className="whitespace-nowrap text-[0.8125rem]">
                            {formatDateTime(lead.createdAt)}
                          </span>
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </TableWrap>
            ) : (
              <EmptyState
                title="No enquiries yet"
                description="Submissions from the contact and start-a-project forms will appear here."
              />
            )}
          </Card>

          <div className="grid gap-4">
            <Card title="Lead sources" description="Last 30 days, by campaign source.">
              {topSources.length ? (
                <ul className="divide-y divide-hairline">
                  {topSources.map((row) => (
                    <li
                      key={row.utmSource ?? "direct"}
                      className="flex items-center justify-between px-5 py-2.5 text-[0.875rem]"
                    >
                      <span className="text-ink-muted">
                        {row.utmSource || "Direct / none"}
                      </span>
                      <span className="numeric font-medium text-ink">
                        {row._count._all}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="No source data yet"
                  description="Campaign parameters are captured automatically with each enquiry."
                />
              )}
            </Card>

            <Card title="Countries" description="Where enquiries come from.">
              {topCountries.length ? (
                <ul className="divide-y divide-hairline">
                  {topCountries.map((row) => (
                    <li
                      key={row.country ?? "unknown"}
                      className="flex items-center justify-between px-5 py-2.5 text-[0.875rem]"
                    >
                      <span className="text-ink-muted">{row.country}</span>
                      <span className="numeric font-medium text-ink">
                        {row._count._all}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title="No country data yet"
                  description="Country is an optional field on the enquiry form."
                />
              )}
            </Card>

            <Card title="Pipeline" description="Last 30 days by status.">
              {leadsByStatus.length ? (
                <ul className="divide-y divide-hairline">
                  {leadsByStatus.map((row) => (
                    <li
                      key={row.status}
                      className="flex items-center justify-between px-5 py-2.5"
                    >
                      <Badge tone={LEAD_STATUS_TONES[row.status] ?? "neutral"}>
                        {row.status}
                      </Badge>
                      <span className="numeric text-[0.875rem] font-medium text-ink">
                        {row._count._all}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState title="Nothing in the last 30 days" />
              )}
            </Card>
          </div>
        </div>
      ) : null}

      {/* ---- Setup checklist. Real, checkable state — not a marketing widget. */}
      <Card
        className="mt-6"
        title="Setup"
        description="Things worth completing before launch. Each item reflects real data."
      >
        <ul className="divide-y divide-hairline">
          <ChecklistItem
            done={publishedProjects > 0}
            label="Publish at least one case study"
            href="/admin/projects"
            hint="The work page and homepage stay in their honest empty state until then."
          />
          <ChecklistItem
            done={testimonialCount > 0}
            label="Review the migrated testimonial"
            href="/admin/testimonials"
            hint="One testimonial was carried over from the old site and needs verifying."
          />
          <ChecklistItem
            done={mediaCount > 0}
            label="Upload brand and project imagery"
            href="/admin/media"
          />
          <ChecklistItem
            done={publishedPosts > 0}
            label="Publish a first article"
            href="/admin/posts"
            hint="Supports the service pages for search."
          />
        </ul>
      </Card>
    </>
  );
}

function ChecklistItem({
  done,
  label,
  href,
  hint,
}: {
  done: boolean;
  label: string;
  href: string;
  hint?: string;
}) {
  return (
    <li className="flex items-start gap-3 px-5 py-3.5">
      <span
        aria-hidden="true"
        className={
          done
            ? "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-secondary text-[0.625rem] text-white"
            : "mt-0.5 size-4 shrink-0 rounded-full border border-hairline-strong"
        }
      >
        {done ? "✓" : ""}
      </span>
      <span className="min-w-0 flex-1">
        <Link
          href={href}
          className={
            done
              ? "text-[0.875rem] text-ink-subtle line-through underline-offset-4 hover:underline"
              : "text-[0.875rem] font-medium text-ink underline-offset-4 hover:underline"
          }
        >
          {label}
        </Link>
        {hint && !done ? (
          <span className="mt-0.5 block text-[0.75rem] text-ink-subtle">
            {hint}
          </span>
        ) : null}
      </span>
      <span className="sr-only">{done ? "Complete" : "Not done"}</span>
    </li>
  );
}
