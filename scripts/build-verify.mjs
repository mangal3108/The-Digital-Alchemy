/**
 * Builds into `.next-verify` instead of `.next`.
 *
 * Verification needs a production build, but producing one in `.next` while a
 * `next dev` server is running quietly destroys that server: it keeps serving
 * HTML from memory while its client chunks are replaced underneath it, so every
 * page still renders and nothing on it responds to a click. No error appears
 * anywhere — not in the terminal, not in the console — which makes it look like
 * an application bug rather than a build collision.
 *
 * `NEXT_DIST_DIR` is set here rather than in the npm script because `VAR=value`
 * prefixes are a POSIX shell feature and this project is developed on Windows,
 * where npm runs scripts through cmd.
 *
 * Usage: node scripts/build-verify.mjs
 */
import { spawn } from "node:child_process";

const child = spawn("npx", ["next", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_DIST_DIR: ".next-verify" },
});

child.on("exit", (code) => process.exit(code ?? 1));
