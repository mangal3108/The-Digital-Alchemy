/**
 * Starts the production server and does not return until it is actually
 * serving — or fails loudly.
 *
 * Every manual attempt at this during development hit the same trap: a
 * backgrounded `next start` whose port is already held exits with EADDRINUSE
 * into a log nobody reads, while the *previous* server keeps answering. Checks
 * then pass or fail against a build that is not the one on disk, which is
 * worse than an outright failure because it looks like a result.
 *
 * `pkill -f "next start"` does not reliably kill it on Windows, so the port is
 * cleared by owning PID instead.
 *
 * Usage: node scripts/serve.mjs [port]
 */
import { spawn, execSync } from "node:child_process";
import { createWriteStream, existsSync } from "node:fs";

const PORT = Number(process.argv[2] || 3100);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function holdersOf(port) {
  try {
    const out = execSync(
      `powershell -NoProfile -Command "(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue).OwningProcess"`,
      { encoding: "utf8" },
    );
    return [...new Set(out.split(/\s+/).filter(Boolean))];
  } catch {
    return [];
  }
}

const existing = holdersOf(PORT);
if (existing.length) {
  console.log(`  port ${PORT} held by ${existing.join(", ")} — stopping`);
  for (const pid of existing) {
    try {
      execSync(`powershell -NoProfile -Command "Stop-Process -Id ${pid} -Force"`);
    } catch {
      /* already gone */
    }
  }
  await sleep(2500);
  if (holdersOf(PORT).length) {
    console.error(`\n  Could not free port ${PORT}.\n`);
    process.exit(1);
  }
}

// Matches next.config.ts, so a verification server never serves — or
// overwrites — the build a running `next dev` is using.
const DIST = process.env.NEXT_DIST_DIR || ".next";

if (!existsSync(`${DIST}/required-server-files.json`)) {
  console.error("\n  No complete build. Run `next build` first.\n");
  process.exit(1);
}

const log = createWriteStream("prod.log", { flags: "w" });
const child = spawn("npx", ["next", "start", "-p", String(PORT)], {
  stdio: ["ignore", "pipe", "pipe"],
  shell: true,
  env: { ...process.env },
  detached: true,
});
child.stdout.pipe(log);
child.stderr.pipe(log);
child.unref();

// Poll the server itself rather than trusting the banner: "Ready" is printed
// before the first request can actually be served.
for (let i = 0; i < 40; i++) {
  await sleep(1000);
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/`, { redirect: "manual" });
    if (res.status > 0 && res.status < 500) {
      console.log(`  serving on ${PORT} (HTTP ${res.status}) after ${i + 1}s`);
      process.exit(0);
    }
  } catch {
    /* not up yet */
  }
}

console.error(`\n  Server never answered on ${PORT}. See prod.log.\n`);
process.exit(1);
