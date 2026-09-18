import "server-only";

import { db } from "./db";

/**
 * Fixed-window rate limiting backed by the database.
 *
 * In-memory counters reset on every deploy and do not work across instances,
 * which makes them close to useless for form abuse. A table row is slower but
 * actually holds. Redis is the natural upgrade at higher volume — the call
 * signature here would not change.
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export async function rateLimit(
  bucket: string,
  identifier: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const now = new Date();
  const key = { bucket_identifier: { bucket, identifier: identifier.slice(0, 128) } };

  try {
    const existing = await db.rateLimit.findUnique({ where: key });

    if (!existing || existing.expiresAt < now) {
      const expiresAt = new Date(now.getTime() + windowSeconds * 1000);
      await db.rateLimit.upsert({
        where: key,
        create: {
          bucket,
          identifier: identifier.slice(0, 128),
          count: 1,
          expiresAt,
        },
        update: { count: 1, expiresAt },
      });
      return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
    }

    if (existing.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((existing.expiresAt.getTime() - now.getTime()) / 1000),
        ),
      };
    }

    await db.rateLimit.update({
      where: key,
      data: { count: { increment: 1 } },
    });

    return {
      allowed: true,
      remaining: limit - existing.count - 1,
      retryAfterSeconds: 0,
    };
  } catch (error) {
    // If the limiter itself is broken we fail open rather than taking the
    // contact form offline. The error is surfaced in logs.
    console.error("[rate-limit] check failed", error);
    return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
  }
}

/** Housekeeping — called opportunistically, not on a schedule. */
export async function pruneRateLimits(): Promise<void> {
  await db.rateLimit
    .deleteMany({ where: { expiresAt: { lt: new Date() } } })
    .catch(() => undefined);
}
