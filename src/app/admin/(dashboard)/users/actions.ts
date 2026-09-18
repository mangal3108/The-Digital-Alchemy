"use server";

import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";

import { db } from "@/lib/db";
import { requirePermission, hashPassword, getCurrentUser } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { ROLES, type Role } from "@/lib/rbac";
import { passwordSchema } from "@/lib/validation";

export interface UserState {
  ok?: boolean;
  error?: string;
  message?: string;
  /** Shown once, never stored in readable form. */
  generatedPassword?: string;
}

function isValidRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export async function createUser(
  _prev: UserState,
  formData: FormData,
): Promise<UserState> {
  const actor = await requirePermission("users.manage");

  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "EDITOR");
  const suppliedPassword = String(formData.get("password") ?? "");

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (name.length < 2) return { ok: false, error: "Enter a name." };
  if (!isValidRole(role)) return { ok: false, error: "Unknown role." };

  if (suppliedPassword) {
    const parsed = passwordSchema.safeParse(suppliedPassword);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Weak password." };
    }
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return { ok: false, error: "That email already has an account." };

  // If no password is supplied we generate a strong one and show it once,
  // rather than inventing a weak default like "changeme".
  const password = suppliedPassword || randomBytes(18).toString("base64url");

  const created = await db.user.create({
    data: {
      email,
      name,
      role,
      passwordHash: await hashPassword(password),
      isActive: true,
    },
  });

  await recordAudit({
    userId: actor.id,
    action: "user.created",
    entity: "User",
    entityId: created.id,
    summary: `Created ${email} as ${role}`,
  });

  revalidatePath("/admin/users");

  return {
    ok: true,
    message: `Account created for ${email}.`,
    generatedPassword: suppliedPassword ? undefined : password,
  };
}

export async function updateUser(
  _prev: UserState,
  formData: FormData,
): Promise<UserState> {
  const actor = await requirePermission("users.manage");

  const id = String(formData.get("id") ?? "");
  const role = String(formData.get("role") ?? "");
  const isActive = formData.get("isActive") === "on";

  if (!isValidRole(role)) return { ok: false, error: "Unknown role." };

  const target = await db.user.findUnique({ where: { id } });
  if (!target) return { ok: false, error: "User not found." };

  // Guard against locking everyone out: the last active super admin cannot be
  // demoted or deactivated, and nobody can strip their own super-admin role.
  if (target.role === "SUPER_ADMIN" && (role !== "SUPER_ADMIN" || !isActive)) {
    const remaining = await db.user.count({
      where: { role: "SUPER_ADMIN", isActive: true, NOT: { id } },
    });
    if (remaining === 0) {
      return {
        ok: false,
        error:
          "This is the only active Super Admin. Promote someone else before changing this account.",
      };
    }
  }

  if (target.id === actor.id && role !== "SUPER_ADMIN" && actor.role === "SUPER_ADMIN") {
    return { ok: false, error: "You cannot remove your own Super Admin role." };
  }

  await db.user.update({ where: { id }, data: { role, isActive } });

  // Deactivating someone should log them out immediately, not at token expiry.
  if (!isActive) {
    await db.session.deleteMany({ where: { userId: id } });
  }

  await recordAudit({
    userId: actor.id,
    action: "user.updated",
    entity: "User",
    entityId: id,
    summary: `${target.email}: role ${target.role} → ${role}, ${isActive ? "active" : "deactivated"}`,
  });

  revalidatePath("/admin/users");
  return { ok: true, message: "User updated." };
}

export async function resetUserPassword(
  _prev: UserState,
  formData: FormData,
): Promise<UserState> {
  const actor = await requirePermission("users.manage");
  const id = String(formData.get("id") ?? "");

  const target = await db.user.findUnique({ where: { id } });
  if (!target) return { ok: false, error: "User not found." };

  const password = randomBytes(18).toString("base64url");
  await db.user.update({
    where: { id },
    data: { passwordHash: await hashPassword(password) },
  });

  // Existing sessions are invalidated — a password reset that leaves old
  // sessions alive does not actually revoke access.
  await db.session.deleteMany({ where: { userId: id } });

  await recordAudit({
    userId: actor.id,
    action: "user.password_reset",
    entity: "User",
    entityId: id,
    summary: `Reset password for ${target.email}`,
  });

  revalidatePath("/admin/users");
  return {
    ok: true,
    message: `Password reset for ${target.email}.`,
    generatedPassword: password,
  };
}

export async function changeOwnPassword(
  _prev: UserState,
  formData: FormData,
): Promise<UserState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const next = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next !== confirm) return { ok: false, error: "Passwords do not match." };

  const parsed = passwordSchema.safeParse(next);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Weak password." };
  }

  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(next) },
  });

  await recordAudit({
    userId: user.id,
    action: "user.password_changed",
    entity: "User",
    entityId: user.id,
    summary: "Changed own password",
  });

  return { ok: true, message: "Password changed." };
}
