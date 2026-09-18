"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { login, pruneSessions, clientIpFrom, destroySession } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";
import { recordAudit } from "@/lib/audit";
import { db } from "@/lib/db";

export interface LoginState {
  error?: string;
}

/**
 * Sign-in action.
 *
 * Rate limited per IP, and failures return a single generic message so the
 * form cannot be used to discover which email addresses have accounts.
 */
export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const headerList = await headers();
  const ip = clientIpFrom(headerList) ?? "unknown";

  const limit = await rateLimit("login", ip, 8, 15 * 60);
  if (!limit.allowed) {
    return {
      error: `Too many attempts. Try again in ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`,
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Enter your email address and password." };
  }

  const result = await login(parsed.data.email, parsed.data.password);

  if (!result.ok) {
    await recordAudit({
      action: "auth.login_failed",
      entity: "User",
      summary: `Failed sign-in for ${parsed.data.email}`,
    });
    return { error: result.error };
  }

  const user = await db.user.findUnique({
    where: { email: parsed.data.email.toLowerCase().trim() },
    select: { id: true, name: true },
  });

  await recordAudit({
    userId: user?.id,
    action: "auth.login",
    entity: "User",
    entityId: user?.id,
    summary: `${user?.name ?? parsed.data.email} signed in`,
  });

  void pruneSessions();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
