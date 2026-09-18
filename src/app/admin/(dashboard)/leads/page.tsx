import Link from "next/link";

import { requirePermission } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db, LEAD_STATUSES } from "@/lib/db";
import {
  Badge,
  Card,
  EmptyState,
  PageHeader,
  TableWrap,
  Td,
  Th,
} from "@/components/admin/ui";
import { LEAD_STATUS_TONES } from "@/components/admin/lead-status";
import { formatDateTime, parseJson } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const user = await requirePermission("leads.view");
  const { status, q, page } = await searchParams;

  const currentPage = Math.max(1, Number(page) || 1);
  const search = (q ?? "").trim();

  const where = {
    ...(status && LEAD_STATUSES.includes(status as never)
      ? { status }
      : { NOT: { status: "SPAM" } }),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { company: { contains: search } },
            { message: { contains: search } },
          ],
        }
      : {}),
  };

  const [leads, total, statusCounts] = await Promise.all([
    db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { assignedTo: { select: { name: true } } },
    }),
    db.lead.count({ where }),
    db.lead.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const countFor = (value: string) =>
    statusCounts.find((row) => row.status === value)?._count._all ?? 0;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildHref = (params: Record<string, string | undefined>) => {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.q) query.set("q", params.q);
    if (params.page && params.page !== "1") query.set("page", params.page);
    const qs = query.toString();
    return `/admin/leads${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Leads"
        description="Enquiries from the contact and start-a-project forms, with the campaign that produced them."
        action={
          can(user.role, "leads.export") && total > 0 ? (
            <a
              href={`/admin/leads/export${status ? `?status=${status}` : ""}`}
              className="inline-flex h-10 items-center rounded-md border border-hairline-strong px-4 text-[0.875rem] font-medium text-ink transition-colors duration-[var(--duration-fast)] hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Export CSV
            </a>
          ) : undefined
        }
      />

      {/* ---- Filters ---- */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <ul className="flex flex-wrap gap-1.5">
          <li>
            <Link
              href={buildHref({ q: search })}
              className={cn(
                "inline-flex h-9 items-center rounded-full px-3.5 text-[0.8125rem] font-medium transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                !status
                  ? "bg-ink text-ink-inverse"
                  : "border border-hairline text-ink-muted hover:text-ink",
              )}
            >
              Active
            </Link>
          </li>
          {LEAD_STATUSES.map((value) => (
            <li key={value}>
              <Link
                href={buildHref({ status: value, q: search })}
                className={cn(
                  "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[0.8125rem] font-medium transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                  status === value
                    ? "bg-ink text-ink-inverse"
                    : "border border-hairline text-ink-muted hover:text-ink",
                )}
              >
                {value}
                <span className="numeric text-[0.6875rem] opacity-70">
                  {countFor(value)}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <form action="/admin/leads" className="flex gap-2">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <label htmlFor="lead-search" className="sr-only">
            Search leads
          </label>
          <input
            id="lead-search"
            name="q"
            type="search"
            defaultValue={search}
            placeholder="Search name, email, company…"
            className="h-10 w-full rounded-md border border-hairline-strong bg-surface px-3.5 text-[0.875rem] text-ink placeholder:text-ink-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus lg:w-72"
          />
          <button
            type="submit"
            className="h-10 shrink-0 rounded-md border border-hairline-strong px-4 text-[0.875rem] font-medium text-ink transition-colors duration-[var(--duration-fast)] hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Search
          </button>
        </form>
      </div>

      <Card>
        {leads.length ? (
          <>
            <TableWrap>
              <thead>
                <tr>
                  <Th>Contact</Th>
                  <Th>Interested in</Th>
                  <Th>Budget</Th>
                  <Th>Source</Th>
                  <Th>Status</Th>
                  <Th>Received</Th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const services = parseJson<string[]>(lead.services, []);
                  return (
                    <tr key={lead.id} className="hover:bg-surface-2/50">
                      <Td>
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="font-medium text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                          {lead.name}
                        </Link>
                        <span className="block text-[0.75rem] text-ink-subtle">
                          {lead.email}
                        </span>
                        {lead.company ? (
                          <span className="block text-[0.75rem] text-ink-subtle">
                            {lead.company}
                          </span>
                        ) : null}
                      </Td>
                      <Td>
                        <span className="text-[0.8125rem]">
                          {services.length ? services.join(", ") : "—"}
                        </span>
                      </Td>
                      <Td>
                        <span className="whitespace-nowrap text-[0.8125rem]">
                          {lead.budget || "—"}
                        </span>
                      </Td>
                      <Td>
                        <span className="text-[0.8125rem]">
                          {lead.utmSource || lead.referrer || "Direct"}
                        </span>
                        {lead.utmCampaign ? (
                          <span className="block text-[0.75rem] text-ink-subtle">
                            {lead.utmCampaign}
                          </span>
                        ) : null}
                      </Td>
                      <Td>
                        <Badge tone={LEAD_STATUS_TONES[lead.status] ?? "neutral"}>
                          {lead.status}
                        </Badge>
                        {lead.assignedTo ? (
                          <span className="mt-1 block text-[0.75rem] text-ink-subtle">
                            {lead.assignedTo.name}
                          </span>
                        ) : null}
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

            {totalPages > 1 ? (
              <nav
                aria-label="Pagination"
                className="flex items-center justify-between gap-3 px-5 py-3.5"
              >
                <p className="text-[0.8125rem] text-ink-subtle">
                  Page {currentPage} of {totalPages} · {total} total
                </p>
                <div className="flex gap-2">
                  {currentPage > 1 ? (
                    <Link
                      href={buildHref({
                        status,
                        q: search,
                        page: String(currentPage - 1),
                      })}
                      className="inline-flex h-9 items-center rounded-md border border-hairline px-3 text-[0.8125rem] font-medium text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      Previous
                    </Link>
                  ) : null}
                  {currentPage < totalPages ? (
                    <Link
                      href={buildHref({
                        status,
                        q: search,
                        page: String(currentPage + 1),
                      })}
                      className="inline-flex h-9 items-center rounded-md border border-hairline px-3 text-[0.8125rem] font-medium text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      Next
                    </Link>
                  ) : null}
                </div>
              </nav>
            ) : null}
          </>
        ) : (
          <EmptyState
            title={search ? "No matching enquiries" : "No enquiries yet"}
            description={
              search
                ? "Try a different search term, or clear the filter."
                : "Submissions from the public forms appear here, with the page and campaign that produced them."
            }
          />
        )}
      </Card>
    </>
  );
}
