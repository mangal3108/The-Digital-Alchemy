"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

export interface MetricState {
  ok?: boolean;
  error?: string;
  message?: string;
}

export async function saveMetric(
  _prev: MetricState,
  formData: FormData,
): Promise<MetricState> {
  const user = await requirePermission("metrics.manage");

  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "Metric not found." };

  const value = String(formData.get("value") ?? "").trim().slice(0, 40);
  const prefix = String(formData.get("prefix") ?? "").trim().slice(0, 10);
  const suffix = String(formData.get("suffix") ?? "").trim().slice(0, 10);
  const note = String(formData.get("note") ?? "").trim().slice(0, 200);
  const isPublished = formData.get("isPublished") === "on";

  // Guard rail: publishing an empty metric would render a blank figure.
  if (isPublished && !value) {
    return {
      ok: false,
      error: "Enter a value before publishing this metric.",
    };
  }

  const before = await db.metric.findUnique({ where: { id } });
  if (!before) return { ok: false, error: "Metric not found." };

  await db.metric.update({
    where: { id },
    data: {
      value,
      prefix: prefix || null,
      suffix: suffix || null,
      note: note || null,
      isPublished,
    },
  });

  if (before.isPublished !== isPublished || before.value !== value) {
    await recordAudit({
      userId: user.id,
      action: isPublished ? "metric.published" : "metric.updated",
      entity: "Metric",
      entityId: id,
      summary: `${before.label}: "${before.value}" → "${value}"${
        before.isPublished !== isPublished
          ? ` (${isPublished ? "published" : "hidden"})`
          : ""
      }`,
    });
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/admin/metrics");

  return { ok: true, message: "Saved." };
}
