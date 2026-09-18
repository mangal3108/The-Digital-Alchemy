"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { requirePermission } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { slugify } from "@/lib/utils";

export interface TeamState {
  ok?: boolean;
  error?: string;
  message?: string;
}

function text(formData: FormData, key: string, max = 500): string {
  return String(formData.get(key) ?? "").trim().slice(0, max);
}

export async function saveTeamMember(
  _prev: TeamState,
  formData: FormData,
): Promise<TeamState> {
  const user = await requirePermission("team.manage");

  const id = text(formData, "id", 40);
  const name = text(formData, "name", 120);
  const role = text(formData, "role", 120);

  if (name.length < 2) return { ok: false, error: "Enter a name." };
  if (role.length < 2) return { ok: false, error: "Enter a role." };

  const slug = slugify(text(formData, "slug", 120) || name);
  const clash = await db.teamMember.findFirst({
    where: { slug, ...(id ? { NOT: { id } } : {}) },
    select: { id: true },
  });
  if (clash) return { ok: false, error: `The slug "${slug}" is already in use.` };

  const expertise = text(formData, "expertise", 500)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);

  const linkedin = text(formData, "linkedin", 400);
  if (linkedin && !/^https?:\/\//i.test(linkedin)) {
    return { ok: false, error: "The LinkedIn URL must start with https://" };
  }

  const data = {
    name,
    slug,
    role,
    bio: text(formData, "bio", 1000) || null,
    photoId: text(formData, "photoId", 40) || null,
    linkedin: linkedin || null,
    expertise: JSON.stringify(expertise),
    isPublished: formData.get("isPublished") === "on",
    order: Number(text(formData, "order", 6)) || 0,
  };

  if (id) {
    await db.teamMember.update({ where: { id }, data });
    await recordAudit({
      userId: user.id,
      action: "team.updated",
      entity: "TeamMember",
      entityId: id,
      summary: `${name} — ${role}`,
    });
  } else {
    const created = await db.teamMember.create({ data });
    await recordAudit({
      userId: user.id,
      action: "team.created",
      entity: "TeamMember",
      entityId: created.id,
      summary: `${name} — ${role}`,
    });
  }

  revalidatePath("/about");
  revalidatePath("/admin/team");
  return { ok: true, message: id ? "Saved." : "Team member added." };
}

export async function deleteTeamMember(formData: FormData) {
  const user = await requirePermission("content.delete");
  const id = String(formData.get("id") ?? "");

  const existing = await db.teamMember.findUnique({ where: { id } });
  if (!existing) return;

  await db.teamMember.delete({ where: { id } });

  await recordAudit({
    userId: user.id,
    action: "team.deleted",
    entity: "TeamMember",
    entityId: id,
    summary: `Removed ${existing.name}`,
  });

  revalidatePath("/about");
  revalidatePath("/admin/team");
}
