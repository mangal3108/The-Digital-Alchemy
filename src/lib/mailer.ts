import "server-only";

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

/**
 * Email delivery.
 *
 * No credentials are invented. When SMTP environment variables are absent the
 * transport logs the message and reports success, so local development and
 * preview deployments work without a mail account — and the lead is still
 * stored in the database either way. See .env.example for the variables
 * production needs.
 */

export interface MailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

let cachedTransport: Transporter | null | undefined;

function getTransport(): Transporter | null {
  if (cachedTransport !== undefined) return cachedTransport;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    cachedTransport = null;
    return null;
  }

  cachedTransport = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });

  return cachedTransport;
}

/**
 * Header injection guard. A newline in a header value lets an attacker append
 * their own headers, so anything interpolated into one is stripped first.
 */
function sanitiseHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, 300);
}

export async function sendMail(
  message: MailMessage,
): Promise<{ sent: boolean; reason?: string }> {
  const transport = getTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "";

  if (!transport) {
    console.info(
      `[mailer] SMTP not configured — message not sent.\n  to: ${sanitiseHeader(message.to)}\n  subject: ${sanitiseHeader(message.subject)}`,
    );
    return { sent: false, reason: "smtp-not-configured" };
  }

  try {
    await transport.sendMail({
      from: sanitiseHeader(from),
      to: sanitiseHeader(message.to),
      replyTo: message.replyTo ? sanitiseHeader(message.replyTo) : undefined,
      subject: sanitiseHeader(message.subject),
      text: message.text,
      html: message.html,
    });
    return { sent: true };
  } catch (error) {
    // A failed notification must never lose the lead — it is already stored.
    console.error("[mailer] send failed", error);
    return { sent: false, reason: "send-failed" };
  }
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:24px;background:#faf8f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0b0b0d;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e0d8;border-radius:14px;">
    <tr><td style="padding:28px 28px 8px;">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#74747f;">The Digital Alchemy</p>
      <h1 style="margin:0;font-size:20px;line-height:1.3;color:#0b0b0d;">${escapeHtml(title)}</h1>
    </td></tr>
    <tr><td style="padding:12px 28px 28px;font-size:15px;line-height:1.6;color:#35353d;">${bodyHtml}</td></tr>
  </table>
</body></html>`;
}

export interface LeadEmailData {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  country?: string | null;
  services: string[];
  budget?: string | null;
  timeline?: string | null;
  message: string;
  sourcePage?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  adminUrl: string;
}

export function adminLeadEmail(data: LeadEmailData): MailMessage {
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone || "—"],
    ["Company", data.company || "—"],
    ["Country", data.country || "—"],
    ["Services", data.services.length ? data.services.join(", ") : "—"],
    ["Budget", data.budget || "—"],
    ["Timeline", data.timeline || "—"],
    ["Source page", data.sourcePage || "—"],
    [
      "Campaign",
      [data.utmSource, data.utmMedium, data.utmCampaign]
        .filter(Boolean)
        .join(" / ") || "—",
    ],
  ];

  const html = layout(
    "New project enquiry",
    `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:6px 0;width:130px;color:#74747f;font-size:13px;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;font-size:14px;">${escapeHtml(value)}</td></tr>`,
        )
        .join("")}
    </table>
    <p style="margin:20px 0 6px;color:#74747f;font-size:13px;">Message</p>
    <div style="white-space:pre-wrap;background:#faf8f5;border:1px solid #e5e0d8;border-radius:10px;padding:14px;font-size:14px;">${escapeHtml(data.message)}</div>
    <p style="margin:24px 0 0;"><a href="${escapeHtml(data.adminUrl)}" style="display:inline-block;background:#a8431a;color:#ffffff;text-decoration:none;padding:11px 18px;border-radius:10px;font-size:14px;">Open in admin</a></p>`,
  );

  const text = [
    "New project enquiry",
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    data.message,
    "",
    data.adminUrl,
  ].join("\n");

  return {
    to: "",
    subject: `New enquiry — ${data.name}${data.company ? ` (${data.company})` : ""}`,
    html,
    text,
    replyTo: data.email,
  };
}

export function acknowledgementEmail(data: {
  name: string;
  email: string;
  companyName: string;
}): MailMessage {
  const html = layout(
    "Thanks — your project is on our radar",
    `<p style="margin:0 0 14px;">Hello ${escapeHtml(data.name.split(" ")[0] ?? data.name)},</p>
     <p style="margin:0 0 14px;">Thank you for getting in touch. We have your enquiry and a real person will read it — this is not an automated qualification queue.</p>
     <p style="margin:0 0 8px;color:#74747f;font-size:13px;">What happens next</p>
     <ol style="margin:0 0 16px;padding-left:18px;">
       <li style="margin-bottom:6px;">We review what you have sent and look at your existing site or product.</li>
       <li style="margin-bottom:6px;">We come back to you with either questions or a suggested next step.</li>
       <li style="margin-bottom:6px;">If it looks like a fit, we set up a call to talk through scope properly.</li>
       <li>From there, a written proposal with scope, timeline and cost.</li>
     </ol>
     <p style="margin:0 0 14px;">If anything changes in the meantime, just reply to this email.</p>
     <p style="margin:0;color:#74747f;font-size:13px;">— ${escapeHtml(data.companyName)}</p>`,
  );

  const text = `Hello ${data.name},

Thank you for getting in touch. We have your enquiry and a real person will read it.

What happens next:
1. We review what you have sent and look at your existing site or product.
2. We come back to you with either questions or a suggested next step.
3. If it looks like a fit, we set up a call to talk through scope properly.
4. From there, a written proposal with scope, timeline and cost.

If anything changes in the meantime, just reply to this email.

— ${data.companyName}`;

  return {
    to: data.email,
    subject: "We have your enquiry",
    html,
    text,
  };
}
