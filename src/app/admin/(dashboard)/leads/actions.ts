"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { leadStatusSchema } from "@/lib/validation";

export interface ActionState {
  ok?: boolean;
  error?: string;
  message?: string;
}

export async function updateLeadStatus(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requirePermission("leads.manage");

  const id = String(formData.get("id") ?? "");
  const parsed = leadStatusSchema.safeParse(formData.get("status"));

  if (!id || !parsed.success) {
    return { ok: false, error: "Invalid status." };
  }

  const existing = await db.lead.findUnique({
    where: { id },
    select: { status: true, name: true },
  });
  if (!existing) return { ok: false, error: "Lead not found." };

  await db.lead.update({ where: { id }, data: { status: parsed.data } });

  await recordAudit({
    userId: user.id,
    action: "lead.status_changed",
    entity: "Lead",
    entityId: id,
    summary: `${existing.name}: ${existing.status} → ${parsed.data}`,
    meta: { from: existing.status, to: parsed.data },
  });

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");

  return { ok: true, message: `Status updated to ${parsed.data}.` };
}

export async function assignLead(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requirePermission("leads.manage");

  const id = String(formData.get("id") ?? "");
  const raw = String(formData.get("assignedToId") ?? "");
  const assignedToId = raw === "" ? null : raw;

  if (!id) return { ok: false, error: "Lead not found." };

  if (assignedToId) {
    const exists = await db.user.findUnique({
      where: { id: assignedToId },
      select: { id: true },
    });
    if (!exists) return { ok: false, error: "That user no longer exists." };
  }

  await db.lead.update({ where: { id }, data: { assignedToId } });

  await recordAudit({
    userId: user.id,
    action: "lead.assigned",
    entity: "Lead",
    entityId: id,
    summary: assignedToId ? "Lead assigned" : "Lead unassigned",
  });

  revalidatePath(`/admin/leads/${id}`);
  return { ok: true, message: "Assignment saved." };
}

export async function addLeadNote(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requirePermission("leads.manage");

  const leadId = String(formData.get("leadId") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (!leadId) return { ok: false, error: "Lead not found." };
  if (body.length < 2) return { ok: false, error: "Write a note first." };
  if (body.length > 5000) return { ok: false, error: "That note is too long." };

  await db.leadNote.create({
    data: { leadId, userId: user.id, body },
  });

  await recordAudit({
    userId: user.id,
    action: "lead.note_added",
    entity: "Lead",
    entityId: leadId,
    summary: "Internal note added",
  });

  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true, message: "Note added." };
}

export async function deleteLead(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Deletion is more destructive than a status change, so it needs the
  // stronger permission rather than leads.manage.
  const user = await requirePermission("content.delete");

  const id = String(formData.get("id") ?? "");
  const lead = await db.lead.findUnique({
    where: { id },
    select: { name: true, email: true },
  });
  if (!lead) return { ok: false, error: "Lead not found." };

  await db.lead.delete({ where: { id } });

  await recordAudit({
    userId: user.id,
    action: "lead.deleted",
    entity: "Lead",
    entityId: id,
    summary: `Deleted enquiry from ${lead.name} (${lead.email})`,
  });

  revalidatePath("/admin/leads");
  return { ok: true, message: "Lead deleted." };
}
