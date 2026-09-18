import "server-only";

import { headers } from "next/headers";
import { db } from "./db";
import { clientIpFrom } from "./auth";

/**
 * Audit logging.
 *
 * Deliberately never throws: an audit write failing must not roll back the
 * action the user just performed. Failures are logged to the server console
 * instead so they are visible in production logs.
 */
export async function recordAudit(input: {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  summary?: string | null;
  meta?: unknown;
}): Promise<void> {
  try {
    const headerList = await headers();
    await db.auditLog.create({
      data: {
        userId: input.userId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        summary: input.summary ?? null,
        meta: input.meta === undefined ? null : JSON.stringify(input.meta),
        ip: clientIpFrom(headerList),
      },
    });
  } catch (error) {
    console.error("[audit] failed to record entry", error);
  }
}
