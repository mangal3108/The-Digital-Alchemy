"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { slugify } from "@/lib/utils";

export interface ClientState {
  ok?: boolean;
  error?: string;
  message?: string;
}

function text(formData: FormData, key: string, max = 300): string {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

function revalidateClients() {
  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/admin/clients");
}

export async function saveClient(
  _prev: ClientState,
  formData: FormData,
): Promise<ClientState> {
  const user = await requirePermission("clients.manage");

  const id = text(formData, "id", 40);
  const name = text(formData, "name", 140);
  if (name.length < 2) return { ok: false, error: "Enter a client name." };

  const slug = slugify(text(formData, "slug", 120) || name);
  if (!slug) return { ok: false, error: "Could not derive a slug." };

  const clash = await db.client.findFirst({
    where: { slug, ...(id ? { NOT: { id } } : {}) },
    select: { id: true },
  });
  if (clash) return { ok: false, error: `The slug "${slug}" is already in use.` };

  const showLogo = formData.get("showLogo") === "on";
  const logoId = text(formData, "logoId", 40) || null;

  // Flagging a logo as approved without attaching one produces a blank slot.
  if (showLogo && !logoId) {
    return { ok: false, error: "Attach a logo before marking it approved." };
  }

  const data = {
    name,
    slug,
    website: text(formData, "website", 400) || null,
    country: text(formData, "country", 80) || null,
    industry: text(formData, "industry", 80) || null,
    logoId,
    showLogo,
    isPublished: formData.get("isPublished") === "on",
    order: Number(text(formData, "order", 6)) || 0,
  };

  if (id) {
    await db.client.update({ where: { id }, data });
    await recordAudit({
      userId: user.id,
      action: "client.updated",
      entity: "Client",
      entityId: id,
      summary: name,
    });
  } else {
    const created = await db.client.create({ data });
    await recordAudit({
      userId: user.id,
      action: "client.created",
      entity: "Client",
      entityId: created.id,
      summary: name,
    });
  }

  revalidateClients();
  return { ok: true, message: id ? "Client saved." : "Client added." };
}

export async function deleteClient(formData: FormData) {
  const user = await requirePermission("content.delete");
  const id = String(formData.get("id") ?? "");

  const existing = await db.client.findUnique({
    where: { id },
    include: { _count: { select: { projects: true } } },
  });
  if (!existing) return;

  // Projects reference the client with SetNull, so deleting is safe, but the
  // audit entry records what it was attached to.
  await db.client.delete({ where: { id } });

  await recordAudit({
    userId: user.id,
    action: "client.deleted",
    entity: "Client",
    entityId: id,
    summary: `Deleted ${existing.name} (${existing._count.projects} project(s) unlinked)`,
  });

  revalidateClients();
}
