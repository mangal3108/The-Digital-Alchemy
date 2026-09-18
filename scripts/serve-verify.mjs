/**
 * Serves the `.next-verify` build.
 *
 * Companion to `build-verify.mjs` — see that file for why verification keeps
 * its own build directory instead of sharing the dev server's.
 *
 * This sets the variable and then imports `serve.mjs` into the *same* process
 * rather than spawning it. `serve.mjs` deliberately leaves a detached server
 * running after it exits, and on Windows that server does not survive its
 * parent being a short-lived wrapper: the first version of this file spawned a
 * child, returned, and took the server down with it a few seconds later —
 * which read as the server crashing mid-verification.
 *
 * Usage: node scripts/serve-verify.mjs [port]
 */
process.env.NEXT_DIST_DIR = ".next-verify";

await import("./serve.mjs");
