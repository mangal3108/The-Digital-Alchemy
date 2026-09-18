import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { cache } from "react";

import { db } from "./db";
import { can, type Permission, type Role } from "./rbac";

export const SESSION_COOKIE = "tda_session";
const SESSION_TTL_HOURS = 12;
const BCRYPT_ROUNDS = 12;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

// ---------------------------------------------------------------------------
// Passwords
// ---------------------------------------------------------------------------

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

/**
 * The cookie holds a random opaque token; only its SHA-256 hash is stored.
 * A leaked database row therefore cannot be replayed as a session, and
 * revoking access is a row delete rather than waiting for a JWT to expire.
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000);

  const headerList = await headers();
  await db.session.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
      ip: clientIpFrom(headerList),
      userAgent: headerList.get("user-agent")?.slice(0, 255) ?? null,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session
      .deleteMany({ where: { tokenHash: hashToken(token) } })
      .catch(() => undefined);
  }
  cookieStore.delete(SESSION_COOKIE);
}

/** Resolve the signed-in user, or null. Cached per request. */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session
    .findUnique({
      where: { tokenHash: hashToken(token) },
      include: { user: true },
    })
    .catch(() => null);

  if (!session || session.expiresAt < new Date()) return null;
  if (!session.user.isActive) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role as Role,
  };
});

/**
 * Gate for admin pages and server actions. Redirects rather than rendering a
 * partial page, so an unauthenticated request never reaches a data query.
 */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requirePermission(
  permission: Permission,
): Promise<SessionUser> {
  const user = await requireUser();
  if (!can(user.role, permission)) redirect("/admin?denied=1");
  return user;
}

/** Non-redirecting variant for route handlers, which must return a status. */
export async function checkPermission(
  permission: Permission,
): Promise<{ user: SessionUser } | { error: 401 | 403 }> {
  const user = await getCurrentUser();
  if (!user) return { error: 401 };
  if (!can(user.role, permission)) return { error: 403 };
  return { user };
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export type LoginResult =
  | { ok: true }
  | { ok: false; error: string };

export async function login(
  email: string,
  password: string,
): Promise<LoginResult> {
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  // Always run a bcrypt comparison so a missing account and a wrong password
  // take comparable time and cannot be distinguished by response timing.
  const hash =
    user?.passwordHash ??
    "$2a$12$0000000000000000000000000000000000000000000000000000";
  const valid = await verifyPassword(password, hash).catch(() => false);

  if (!user || !valid || !user.isActive) {
    return { ok: false, error: "Incorrect email or password." };
  }

  await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  await createSession(user.id);

  return { ok: true };
}

/** Remove expired sessions. Called opportunistically after login. */
export async function pruneSessions(): Promise<void> {
  await db.session
    .deleteMany({ where: { expiresAt: { lt: new Date() } } })
    .catch(() => undefined);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function clientIpFrom(headerList: Headers): string | null {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim().slice(0, 64);
  return headerList.get("x-real-ip")?.slice(0, 64) ?? null;
}

/** Constant-time string comparison for non-hashed secrets. */
export function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}
