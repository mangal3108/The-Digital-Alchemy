"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

export interface FaqState {
  ok?: boolean;
  error?: string;
  message?: string;
}

const SCOPES = ["general", "service", "industry", "location"] as const;

function text(formData: FormData, key: string, max = 4000): string {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

function revalidateFaqs(scopeType: string, scopeKey: string | null) {
  if (scopeType === "service" && scopeKey) revalidatePath(`/services/${scopeKey}`);
  if (scopeType === "industry" && scopeKey) revalidatePath(`/industries/${scopeKey}`);
  if (scopeType === "location" && scopeKey) revalidatePath(`/locations/${scopeKey}`);
  // "general" has two homes rather than one page keyed by slug.
  if (scopeType === "general") {
    revalidatePath("/contact");
    revalidatePath("/services");
  }
  revalidatePath("/admin/faqs");
}

export async function saveFaq(
  _prev: FaqState,
  formData: FormData,
): Promise<FaqState> {
  const user = await requirePermission("faqs.manage");

  const id = text(formData, "id", 40);
  const question = text(formData, "question", 300);
  const answer = text(formData, "answer", 4000);
  const scopeType = text(formData, "scopeType", 20);
  const scopeKey = text(formData, "scopeKey", 120) || null;

  if (question.length < 5) return { ok: false, error: "Enter a question." };
  if (answer.length < 10) return { ok: false, error: "Enter an answer." };
  if (!SCOPES.includes(scopeType as never)) {
    return { ok: false, error: "Choose where this FAQ appears." };
  }
  if (scopeType !== "general" && !scopeKey) {
    return { ok: false, error: "Choose which page this FAQ belongs to." };
  }

  const data = {
    question,
    answer,
    scopeType,
    scopeKey,
    isPublished: formData.get("isPublished") === "on",
    order: Number(text(formData, "order", 6)) || 0,
  };

  if (id) {
    await db.faq.update({ where: { id }, data });
    await recordAudit({
      userId: user.id,
      action: "faq.updated",
      entity: "Faq",
      entityId: id,
      summary: question.slice(0, 80),
    });
  } else {
    const created = await db.faq.create({ data });
    await recordAudit({
      userId: user.id,
      action: "faq.created",
      entity: "Faq",
      entityId: created.id,
      summary: question.slice(0, 80),
    });
  }

  revalidateFaqs(scopeType, scopeKey);
  return { ok: true, message: id ? "FAQ saved." : "FAQ added." };
}

export async function deleteFaq(formData: FormData) {
  const user = await requirePermission("faqs.manage");
  const id = String(formData.get("id") ?? "");

  const existing = await db.faq.findUnique({ where: { id } });
  if (!existing) return;

  await db.faq.delete({ where: { id } });

  await recordAudit({
    userId: user.id,
    action: "faq.deleted",
    entity: "Faq",
    entityId: id,
    summary: existing.question.slice(0, 80),
  });

  revalidateFaqs(existing.scopeType, existing.scopeKey);
}
