import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { db } from "@/lib/db";
import { leadSchema, looksAutomated, fieldErrors } from "@/lib/validation";
import { rateLimit, pruneRateLimits } from "@/lib/rate-limit";
import { clientIpFrom } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import { adminLeadEmail, acknowledgementEmail, sendMail } from "@/lib/mailer";
import { absoluteUrl } from "@/config/site";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

/**
 * Project enquiry endpoint.
 *
 * Order of operations matters here: the lead is written to the database first,
 * and only then do we try to send notifications. An SMTP outage must never be
 * able to lose an enquiry — that is the one failure mode this form cannot have.
 */
export async function POST(request: Request) {
  const headerList = await headers();
  const ip = clientIpFrom(headerList) ?? "unknown";

  // Two windows: a tight one to stop rapid-fire submissions, and an hourly cap
  // so a single address cannot flood the inbox over a longer period.
  const burst = await rateLimit("lead:burst", ip, 3, 60);
  if (!burst.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many submissions. Please wait a moment and try again.",
      },
      { status: 429, headers: { "Retry-After": String(burst.retryAfterSeconds) } },
    );
  }

  const hourly = await rateLimit("lead:hourly", ip, 10, 3600);
  if (!hourly.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many submissions from this connection. Please email us instead.",
      },
      { status: 429, headers: { "Retry-After": String(hourly.retryAfterSeconds) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 },
    );
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields.",
        fields: fieldErrors(parsed.error),
      },
      { status: 422 },
    );
  }

  const input = parsed.data;

  // Bot submissions are accepted with a success response and stored as SPAM.
  // Returning an error just tells the script to adjust and retry.
  const isSpam = looksAutomated(input);

  const lead = await db.lead.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      phone: input.phone || null,
      company: input.company || null,
      country: input.country || null,
      services: JSON.stringify(input.services ?? []),
      budget: input.budget || null,
      timeline: input.timeline || null,
      message: input.message,
      sourcePage: input.sourcePage || null,
      referrer: input.referrer || null,
      utmSource: input.utmSource || null,
      utmMedium: input.utmMedium || null,
      utmCampaign: input.utmCampaign || null,
      utmTerm: input.utmTerm || null,
      utmContent: input.utmContent || null,
      status: isSpam ? "SPAM" : "NEW",
    },
  });

  if (isSpam) {
    return NextResponse.json({ ok: true, id: lead.id });
  }

  await recordAudit({
    action: "lead.created",
    entity: "Lead",
    entityId: lead.id,
    summary: `New enquiry from ${input.name}`,
  });

  const settings = await getSiteSettings();

  // Notifications are best-effort. Failures are logged by the mailer and never
  // surfaced to the visitor, whose enquiry is already safely stored.
  const adminRecipient = process.env.LEAD_NOTIFICATION_EMAIL || settings.email;
  if (adminRecipient) {
    const message = adminLeadEmail({
      name: input.name,
      email: input.email,
      phone: input.phone,
      company: input.company,
      country: input.country,
      services: input.services ?? [],
      budget: input.budget,
      timeline: input.timeline,
      message: input.message,
      sourcePage: input.sourcePage,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      adminUrl: absoluteUrl(`/admin/leads/${lead.id}`),
    });
    await sendMail({ ...message, to: adminRecipient });
  }

  await sendMail(
    acknowledgementEmail({
      name: input.name,
      email: input.email,
      companyName: settings.companyName,
    }),
  );

  // Opportunistic housekeeping — cheap, and keeps the limiter table small
  // without needing a scheduled job.
  void pruneRateLimits();

  return NextResponse.json({ ok: true, id: lead.id });
}
