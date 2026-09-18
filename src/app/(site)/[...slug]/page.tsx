import { notFound, permanentRedirect, redirect } from "next/navigation";
import { db } from "@/lib/db";

/**
 * Catch-all redirect resolver.
 *
 * Why this and not middleware: redirects are CMS-managed, and middleware runs
 * on the edge runtime where Prisma is not available. Putting the lookup in a
 * catch-all route means an administrator can add a redirect in /admin and it
 * takes effect immediately, with no rebuild and no edge/database workaround.
 *
 * Catch-all segments are the lowest-priority match in the App Router, so this
 * only ever runs for paths nothing else claimed. Anything without a redirect
 * falls through to the branded 404.
 *
 * This is what preserves the search history of the previous WordPress URLs
 * (/services-2/, /contact-2/, /portfolio/ and the rest).
 */
export const dynamic = "force-dynamic";

export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = `/${slug.join("/")}`;

  // Asset-shaped requests (favicon.ico, apple-touch-icon.png, ads.txt and the
  // steady background noise of scanners probing for .php and .env) will never
  // have a redirect. Short-circuit them so they do not each cost a query.
  if (/\.[a-z0-9]{2,5}$/i.test(path)) notFound();

  // Match the stored source with and without a trailing slash, and
  // case-insensitively, so an editor does not have to guess the exact form.
  const candidates = [
    path,
    `${path}/`,
    path.toLowerCase(),
    `${path.toLowerCase()}/`,
  ];

  const rule = await db.redirect
    .findFirst({
      where: { isActive: true, source: { in: candidates } },
    })
    .catch(() => null);

  if (rule) {
    if (rule.statusCode === 302) redirect(rule.destination);
    permanentRedirect(rule.destination);
  }

  notFound();
}
