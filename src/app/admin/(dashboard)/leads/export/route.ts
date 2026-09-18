import { checkPermission } from "@/lib/auth";
import { db, LEAD_STATUSES } from "@/lib/db";
import { recordAudit } from "@/lib/audit";
import { parseJson } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * CSV export of enquiries.
 *
 * This route returns personal data, so it re-checks the permission itself
 * rather than relying on the admin layout — a route handler is not covered by
 * a layout's guard, and this is exactly the kind of endpoint that gets
 * forgotten and left open.
 */

/**
 * Escape a CSV cell. The leading-character check neutralises formula
 * injection: a value beginning with =, +, - or @ is executed by Excel and
 * Sheets when the file is opened, which turns an exported enquiry into a
 * potential attack on whoever opens it.
 */
function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const result = await checkPermission("leads.export");
  if ("error" in result) {
    return new Response(
      result.error === 401 ? "Not signed in" : "Not permitted",
      { status: result.error },
    );
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status");

  const leads = await db.lead.findMany({
    where:
      status && LEAD_STATUSES.includes(status as never)
        ? { status }
        : { NOT: { status: "SPAM" } },
    orderBy: { createdAt: "desc" },
    include: { assignedTo: { select: { name: true } } },
  });

  const headers = [
    "Received",
    "Name",
    "Email",
    "Phone",
    "Company",
    "Country",
    "Services",
    "Budget",
    "Timeline",
    "Message",
    "Status",
    "Assigned to",
    "Source page",
    "Referrer",
    "UTM source",
    "UTM medium",
    "UTM campaign",
  ];

  const rows = leads.map((lead) =>
    [
      lead.createdAt.toISOString(),
      lead.name,
      lead.email,
      lead.phone,
      lead.company,
      lead.country,
      parseJson<string[]>(lead.services, []).join("; "),
      lead.budget,
      lead.timeline,
      lead.message,
      lead.status,
      lead.assignedTo?.name,
      lead.sourcePage,
      lead.referrer,
      lead.utmSource,
      lead.utmMedium,
      lead.utmCampaign,
    ]
      .map(csvCell)
      .join(","),
  );

  // A UTF-8 BOM so Excel opens non-ASCII names correctly rather than mangling
  // them, which it does silently without one.
  const csv = `﻿${headers.map(csvCell).join(",")}\n${rows.join("\n")}\n`;

  await recordAudit({
    userId: result.user.id,
    action: "lead.exported",
    entity: "Lead",
    summary: `Exported ${leads.length} leads${status ? ` (${status})` : ""}`,
  });

  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
