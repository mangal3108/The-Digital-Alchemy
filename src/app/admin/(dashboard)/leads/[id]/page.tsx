import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requirePermission } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { db } from "@/lib/db";
import { Badge, Card, PageHeader } from "@/components/admin/ui";
import { LEAD_STATUS_TONES } from "@/components/admin/lead-status";
import { formatDateTime, parseJson } from "@/lib/utils";
import { LeadControls, LeadNoteForm } from "./lead-controls";

export const metadata = { title: "Lead" };
export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requirePermission("leads.view");
  const { id } = await params;

  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true } },
      notes: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!lead) notFound();

  const services = parseJson<string[]>(lead.services, []);
  const editable = can(user.role, "leads.manage");

  const assignees = editable
    ? await db.user.findMany({
        where: { isActive: true },
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      })
    : [];

  const attribution: [string, string | null][] = [
    ["Source page", lead.sourcePage],
    ["Referrer", lead.referrer],
    ["UTM source", lead.utmSource],
    ["UTM medium", lead.utmMedium],
    ["UTM campaign", lead.utmCampaign],
    ["UTM term", lead.utmTerm],
    ["UTM content", lead.utmContent],
  ];

  const details: [string, string | null][] = [
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Company", lead.company],
    ["Country", lead.country],
    ["Budget", lead.budget],
    ["Timeline", lead.timeline],
  ];

  return (
    <>
      <Link
        href="/admin/leads"
        className="mb-4 inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink-muted underline-offset-4 hover:text-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Back to leads
      </Link>

      <PageHeader
        title={lead.name}
        description={`Received ${formatDateTime(lead.createdAt)}`}
        action={
          <Badge tone={LEAD_STATUS_TONES[lead.status] ?? "neutral"}>
            {lead.status}
          </Badge>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="grid gap-4">
          <Card title="Message">
            <div className="px-5 py-4">
              <p className="whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ink">
                {lead.message}
              </p>
            </div>
          </Card>

          <Card title="Contact details">
            <dl className="divide-y divide-hairline">
              {details
                .filter(([, value]) => Boolean(value))
                .map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-4 px-5 py-2.5"
                  >
                    <dt className="text-[0.8125rem] text-ink-subtle">{label}</dt>
                    <dd className="text-right text-[0.875rem] text-ink">
                      {label === "Email" ? (
                        <a
                          href={`mailto:${value}`}
                          className="text-accent-text underline-offset-4 hover:underline"
                        >
                          {value}
                        </a>
                      ) : label === "Phone" ? (
                        <a
                          href={`tel:${value}`}
                          className="text-accent-text underline-offset-4 hover:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                ))}
              {services.length ? (
                <div className="flex items-baseline justify-between gap-4 px-5 py-2.5">
                  <dt className="text-[0.8125rem] text-ink-subtle">
                    Interested in
                  </dt>
                  <dd className="flex flex-wrap justify-end gap-1">
                    {services.map((service) => (
                      <Badge key={service}>{service}</Badge>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          </Card>

          <Card
            title="Internal notes"
            description="Visible to your team only. Never shown to the enquirer."
          >
            {editable ? (
              <div className="border-b border-hairline px-5 py-4">
                <LeadNoteForm leadId={lead.id} />
              </div>
            ) : null}

            {lead.notes.length ? (
              <ul className="divide-y divide-hairline">
                {lead.notes.map((note) => (
                  <li key={note.id} className="px-5 py-3.5">
                    <p className="whitespace-pre-wrap text-[0.875rem] leading-relaxed text-ink">
                      {note.body}
                    </p>
                    <p className="mt-1.5 text-[0.75rem] text-ink-subtle">
                      {note.user?.name ?? "Unknown"} ·{" "}
                      {formatDateTime(note.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-6 text-center text-[0.875rem] text-ink-subtle">
                No notes yet.
              </p>
            )}
          </Card>
        </div>

        <div className="grid content-start gap-4">
          {editable ? (
            <LeadControls
              leadId={lead.id}
              status={lead.status}
              assignedToId={lead.assignedTo?.id ?? ""}
              assignees={assignees}
              canDelete={can(user.role, "content.delete")}
            />
          ) : null}

          <Card
            title="Attribution"
            description="Captured automatically when the form was submitted."
          >
            <dl className="divide-y divide-hairline">
              {attribution.filter(([, value]) => Boolean(value)).length ? (
                attribution
                  .filter(([, value]) => Boolean(value))
                  .map(([label, value]) => (
                    <div key={label} className="px-5 py-2.5">
                      <dt className="text-[0.75rem] text-ink-subtle">{label}</dt>
                      <dd className="mt-0.5 break-words text-[0.8125rem] text-ink">
                        {value}
                      </dd>
                    </div>
                  ))
              ) : (
                <p className="px-5 py-5 text-[0.8125rem] text-ink-subtle">
                  No campaign data — this enquiry arrived directly.
                </p>
              )}
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}
