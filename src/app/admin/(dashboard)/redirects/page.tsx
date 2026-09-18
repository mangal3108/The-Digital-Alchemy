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
import { formatDate } from "@/lib/utils";
import { RedirectForm } from "./redirect-form";
import { deleteRedirect, toggleRedirect } from "./actions";

export const metadata = { title: "Redirects" };
export const dynamic = "force-dynamic";

/**
 * Redirect manager.
 *
 * These take effect immediately — they are resolved at request time by the
 * catch-all route, not baked into a build. That matters during a migration,
 * when a missed URL needs fixing in minutes rather than at the next deploy.
 */
export default async function RedirectsPage() {
  await requirePermission("redirects.manage");

  const redirects = await db.redirect.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
  });

  const active = redirects.filter((rule) => rule.isActive).length;

  return (
    <>
      <PageHeader
        title="Redirects"
        description="Preserves the search history of URLs that have moved. Applied at request time, so changes are live immediately."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Card
          title="Rules"
          description={`${active} active of ${redirects.length}.`}
        >
          {redirects.length ? (
            <TableWrap>
              <thead>
                <tr>
                  <Th>From</Th>
                  <Th>To</Th>
                  <Th>Code</Th>
                  <Th>Status</Th>
                  <Th>Added</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {redirects.map((rule) => (
                  <tr key={rule.id}>
                    <Td>
                      <code className="font-mono text-[0.8125rem] text-ink">
                        {rule.source}
                      </code>
                      {rule.note ? (
                        <span className="block text-[0.75rem] text-ink-subtle">
                          {rule.note}
                        </span>
                      ) : null}
                    </Td>
                    <Td>
                      <code className="font-mono text-[0.8125rem] text-ink">
                        {rule.destination}
                      </code>
                    </Td>
                    <Td>{rule.statusCode}</Td>
                    <Td>
                      <Badge tone={rule.isActive ? "success" : "neutral"}>
                        {rule.isActive ? "Active" : "Off"}
                      </Badge>
                    </Td>
                    <Td>
                      <span className="whitespace-nowrap text-[0.8125rem]">
                        {formatDate(rule.createdAt)}
                      </span>
                    </Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <form action={toggleRedirect}>
                          <input type="hidden" name="id" value={rule.id} />
                          <button
                            type="submit"
                            className="rounded-md border border-hairline px-2.5 py-1 text-[0.75rem] font-medium text-ink-muted transition-colors duration-[var(--duration-fast)] hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                          >
                            {rule.isActive ? "Disable" : "Enable"}
                          </button>
                        </form>
                        <form action={deleteRedirect}>
                          <input type="hidden" name="id" value={rule.id} />
                          <button
                            type="submit"
                            className="rounded-md border border-hairline px-2.5 py-1 text-[0.75rem] font-medium text-danger transition-colors duration-[var(--duration-fast)] hover:border-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          ) : (
            <EmptyState
              title="No redirects"
              description="Add one whenever a URL changes, so the search visibility it earned carries across."
            />
          )}
        </Card>

        <div>
          <RedirectForm />

          <div className="mt-4 rounded-lg border border-hairline bg-surface p-5">
            <p className="text-[0.875rem] font-semibold text-ink">
              About the status code
            </p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">
              Use 301 for anything permanent — it passes ranking signals to the
              new URL. Use 302 only while a page is temporarily elsewhere.
            </p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-muted">
              Note that permanent redirects are served as HTTP 308, the
              method-preserving equivalent of 301. Search engines treat the two
              identically.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
