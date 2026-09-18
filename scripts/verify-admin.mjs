/**
 * Walks every admin route as a signed-in Super Admin and checks each renders.
 *
 * The admin is the half of this project that no visitor exercises, so a broken
 * page there can sit unnoticed indefinitely. A 200 is not enough either: a
 * Next error boundary returns 200 with an error page inside it, and a page
 * whose query throws can render an empty shell. So each route is checked for
 * its own heading and for the absence of an error boundary.
 *
 * The session is minted straight into the database and deleted afterwards,
 * which is the same approach `capture-ui.mjs` uses.
 *
 * Usage: node scripts/verify-admin.mjs [baseUrl]
 */
import { createHash, randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const BASE = process.argv[2] || "http://localhost:3100";

/** Every admin route, with a string that proves the page actually rendered. */
const ROUTES = [
  ["/admin", "Good to see you"],
  ["/admin/leads", "Leads"],
  ["/admin/projects", "Projects"],
  ["/admin/products", "Products"],
  ["/admin/posts", "Insights"],
  ["/admin/testimonials", "Testimonials"],
  ["/admin/clients", "Clients"],
  ["/admin/team", "Team"],
  ["/admin/faqs", "FAQ"],
  ["/admin/careers", "Careers"],
  ["/admin/content", "Page copy"],
  ["/admin/media", "Media"],
  ["/admin/metrics", "Metrics"],
  ["/admin/seo", "SEO"],
  ["/admin/redirects", "Redirects"],
  ["/admin/settings", "Settings"],
  ["/admin/users", "Users"],
  ["/admin/audit", "Audit"],
];

/** Text that means Next caught an exception rather than rendering the page. */
const ERROR_MARKERS = [
  "Application error",
  "a client-side exception",
  "Internal Server Error",
  "This page could not be found",
];

const db = new PrismaClient();
let sessionId = null;
let failures = 0;

try {
  const user = await db.user.findFirst({ where: { role: "SUPER_ADMIN" } });
  if (!user) {
    console.error("\n  No SUPER_ADMIN user. Run `npm run db:seed` first.\n");
    process.exit(1);
  }

  const token = randomBytes(32).toString("base64url");
  const created = await db.session.create({
    data: {
      userId: user.id,
      tokenHash: createHash("sha256").update(token).digest("hex"),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      userAgent: "verify-admin",
    },
  });
  sessionId = created.id;

  console.log(`\n  signed in as ${user.email} (${user.role})\n`);

  for (const [path, marker] of ROUTES) {
    let status = 0;
    let note = "";

    try {
      const res = await fetch(BASE + path, {
        headers: { cookie: `tda_session=${token}` },
        redirect: "manual",
      });
      status = res.status;

      if (status === 200) {
        const html = await res.text();
        const errored = ERROR_MARKERS.find((m) => html.includes(m));
        if (errored) {
          note = `error boundary: ${errored}`;
        } else if (!html.includes(marker)) {
          note = `rendered without "${marker}"`;
        }
      } else if (status === 307 || status === 302) {
        // Redirected while holding a valid Super Admin session: the session was
        // rejected, which is a real failure rather than expected auth.
        note = "redirected despite a valid session";
      } else {
        note = "unexpected status";
      }
    } catch (error) {
      note = error.message.slice(0, 60);
    }

    const ok = status === 200 && !note;
    if (!ok) failures++;
    console.log(`  ${String(status).padEnd(4)} ${path.padEnd(22)} ${ok ? "ok" : `FAIL — ${note}`}`);
  }

  // The login page must stay reachable *without* a session, and the admin must
  // still refuse anonymous requests — a check that the guard works at all.
  const anon = await fetch(BASE + "/admin", { redirect: "manual" });
  const anonOk = anon.status === 307 || anon.status === 302;
  if (!anonOk) failures++;
  console.log(
    `\n  ${String(anon.status).padEnd(4)} ${"/admin (no session)".padEnd(22)} ` +
      (anonOk ? "ok — redirected to login" : "FAIL — admin served without auth"),
  );
} finally {
  if (sessionId) await db.session.delete({ where: { id: sessionId } }).catch(() => {});
  await db.$disconnect();
}

console.log(
  failures === 0
    ? "\n  Every admin route renders for a signed-in Super Admin.\n"
    : `\n  ${failures} admin route(s) failing.\n`,
);
process.exit(failures === 0 ? 0 : 1);
