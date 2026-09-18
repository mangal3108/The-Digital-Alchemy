import Link from "next/link";

import { requirePermission } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Badge,
  Card,
  EmptyState,
  PageHeader,
  TableWrap,
  Td,
  Th,
} from "@/components/admin/ui";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata = { title: "Audit log" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

/** Actions that deserve visual weight when scanning the log. */
function toneFor(action: string): "neutral" | "accent" | "success" | "danger" {
  if (action.includes("deleted")) return "danger";
  if (action.includes("login_failed")) return "danger";
  if (action.includes("published")) return "success";
  if (action.startsWith("user.") || action.startsWith("settings.")) {
    return "accent";
  }
  return "neutral";
}

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; entity?: string }>;
}) {
  await requirePermission("audit.view");
  const { page, entity } = await searchParams;

  const currentPage = Math.max(1, Number(page) || 1);
  const where = entity ? { entity } : {};

  const [entries, total, entities] = await Promise.all([
    db.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { user: { select: { name: true, email: true } } },
    }),
    db.auditLog.count({ where }),
    db.auditLog.groupBy({ by: ["entity"], _count: { _all: true } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        title="Audit log"
        description="A record of consequential actions — publishing, deletion, permission changes, lead status updates and sign-ins."
      />

      <ul className="mb-4 flex flex-wrap gap-1.5">
        <li>
          <Link
            href="/admin/audit"
            className={cn(
              "inline-flex h-9 items-center rounded-full px-3.5 text-[0.8125rem] font-medium transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
              !entity
                ? "bg-ink text-ink-inverse"
                : "border border-hairline text-ink-muted hover:text-ink",
            )}
          >
            All
          </Link>
        </li>
        {entities.map((row) => (
          <li key={row.entity}>
            <Link
              href={`/admin/audit?entity=${row.entity}`}
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[0.8125rem] font-medium transition-colors duration-[var(--duration-fast)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                entity === row.entity
                  ? "bg-ink text-ink-inverse"
                  : "border border-hairline text-ink-muted hover:text-ink",
              )}
            >
              {row.entity}
              <span className="numeric text-[0.6875rem] opacity-70">
                {row._count._all}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Card>
        {entries.length ? (
          <>
            <TableWrap>
              <thead>
                <tr>
                  <Th>When</Th>
                  <Th>Who</Th>
                  <Th>Action</Th>
                  <Th>Detail</Th>
                  <Th>IP</Th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <Td>
                      <span className="whitespace-nowrap text-[0.8125rem]">
                        {formatDateTime(entry.createdAt)}
                      </span>
                    </Td>
                    <Td>
                      <span className="text-[0.8125rem]">
                        {entry.user?.name ?? "System"}
                      </span>
                      {entry.user ? (
                        <span className="block text-[0.6875rem] text-ink-subtle">
                          {entry.user.email}
                        </span>
                      ) : null}
                    </Td>
                    <Td>
                      <Badge tone={toneFor(entry.action)}>{entry.action}</Badge>
                    </Td>
                    <Td>
                      <span className="text-[0.8125rem]">
                        {entry.summary ?? entry.entity}
                      </span>
                    </Td>
                    <Td>
                      <span className="font-mono text-[0.75rem] text-ink-subtle">
                        {entry.ip ?? "—"}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>

            {totalPages > 1 ? (
              <nav
                aria-label="Pagination"
                className="flex items-center justify-between gap-3 px-5 py-3.5"
              >
                <p className="text-[0.8125rem] text-ink-subtle">
                  Page {currentPage} of {totalPages} · {total} entries
                </p>
                <div className="flex gap-2">
                  {currentPage > 1 ? (
                    <Link
                      href={`/admin/audit?page=${currentPage - 1}${entity ? `&entity=${entity}` : ""}`}
                      className="inline-flex h-9 items-center rounded-md border border-hairline px-3 text-[0.8125rem] font-medium text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                    >
                      Previous
                    </Link>
                  ) : null}
                  {currentPage < totalPages ? (
                    <Link
                      href={`/admin/audit?page=${currentPage + 1}${entity ? `&entity=${entity}` : ""}`}
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
            title="Nothing logged yet"
            description="Entries appear as content is published, leads change status and users sign in."
          />
        )}
      </Card>
    </>
  );
}
