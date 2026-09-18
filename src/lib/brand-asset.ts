import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Inlines a file from /public as a data URI.
 *
 * `next/og` renders with Satori, which has no page context and cannot resolve
 * a relative URL — an `<img src="/brand/logo-mark.png">` silently renders as
 * nothing. These routes run at build time on the server, so reading the file
 * off disk is both available and cheaper than an HTTP round trip to ourselves.
 */
const cache = new Map<string, string>();

export function publicAssetDataUri(relative: string, mime = "image/png") {
  const cached = cache.get(relative);
  if (cached) return cached;

  const file = path.join(process.cwd(), "public", relative);
  const uri = `data:${mime};base64,${readFileSync(file).toString("base64")}`;
  cache.set(relative, uri);
  return uri;
}
