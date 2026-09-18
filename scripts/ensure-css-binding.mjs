/**
 * Repairs Tailwind's CSS engine on machines that cannot load native binaries.
 *
 * Tailwind v4 compiles CSS with `@tailwindcss/oxide`, a Rust module loaded as a
 * `.node` binary. On a machine with an Application Control policy (or any
 * hardened environment that blocks unsigned native modules) that load fails
 * with ERR_DLOPEN_FAILED, and every build dies with a misleading message:
 *
 *   "Cannot find native binding. npm has a bug related to optional
 *    dependencies... remove package-lock.json and node_modules"
 *
 * That advice does not help, because the binary is present — it is being
 * refused. Reinstalling produces the identical failure.
 *
 * Oxide ships a WebAssembly fallback for exactly this case, but npm will not
 * install it normally: the package declares `cpu: wasm32`, so it is skipped on
 * an x64 host. Hence `--force`.
 *
 * This script detects the real condition — can the engine be loaded, yes or
 * no — and only acts when it cannot. On a healthy machine it does nothing.
 *
 * Runs automatically after `npm install`; also available as `npm run fix:css`.
 */
import { execFileSync, execSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/** Prevents recursion: the repair install triggers postinstall again. */
if (process.env.TDA_CSS_BINDING_REPAIR === "1") process.exit(0);

/**
 * Probes the engine in a child process, which is not optional.
 *
 * A failed `require` of oxide poisons the current process: Node caches the
 * negative resolution of the fallback package, so re-checking in-process after
 * installing it still reports failure. Checking that way makes a successful
 * repair look broken. A fresh process resolves from disk.
 */
function canLoadEngine() {
  try {
    execFileSync(process.execPath, ["-e", "require(\"@tailwindcss/oxide\")"], {
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

if (canLoadEngine()) {
  process.exit(0);
}

console.log(
  "\n[css] Tailwind's native engine could not be loaded on this machine.\n" +
    "[css] Installing the WebAssembly fallback instead…",
);

// Pin to the installed Tailwind version so the fallback cannot drift from it.
let version = "";
try {
  version = require("tailwindcss/package.json").version;
} catch {
  /* fall back to an unpinned install below */
}

const spec = version
  ? `@tailwindcss/oxide-wasm32-wasi@${version}`
  : "@tailwindcss/oxide-wasm32-wasi";

try {
  execSync(`npm install --no-save --force ${spec}`, {
    stdio: "inherit",
    env: { ...process.env, TDA_CSS_BINDING_REPAIR: "1" },
  });
} catch {
  console.error(
    `\n[css] Could not install ${spec} automatically.\n` +
      `[css] Run this by hand:\n\n    npm install --no-save --force ${spec}\n`,
  );
  process.exit(0); // never fail the install over this
}

if (canLoadEngine()) {
  console.log(
    "[css] WebAssembly fallback active. Builds are slower than native but correct.\n",
  );
} else {
  console.error(
    "[css] Fallback installed but the engine still will not load.\n" +
      "[css] See README → Known gaps for the native-binary constraint.\n",
  );
}
