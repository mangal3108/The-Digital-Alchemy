/**
 * Feeds Tailwind its class list from JavaScript instead of from disk.
 *
 * Tailwind v4 finds the classes you actually used by scanning source files with
 * `@tailwindcss/oxide`, a native Rust module. This machine's Application
 * Control policy refuses native binaries, so oxide runs through its WebAssembly
 * fallback (see `scripts/ensure-css-binding.mjs`) — and under WASI its file
 * scanner is sandboxed away from the project. It reports zero files for every
 * path form tried: absolute, relative, Windows, POSIX, drive-stripped. The
 * bindings preopen `path.parse(cwd).root` — the literal string `C:\` — as a
 * WASI guest path, and guest paths are POSIX, so nothing under it resolves.
 *
 * The failure mode is silent and nasty. Tailwind finds no classes, emits no
 * utilities, and still writes a large, valid stylesheet, because the `@theme`
 * block, the accent scopes and the keyframes in `globals.css` pass through
 * untouched. The build succeeds and every page renders unstyled.
 *
 * So we scan in JS and hand Tailwind the result through `@source inline(...)`,
 * which takes candidates literally and never touches the filesystem. Variants,
 * arbitrary values and group modifiers all survive that path.
 *
 * This runs *in addition to* Tailwind's own scan, not instead of it. Where the
 * native binary loads, oxide finds the same classes and the union is identical
 * — so nobody has to know this file exists for the project to behave.
 *
 * CommonJS on purpose: Next resolves PostCSS plugins by name and `require()`s
 * them (`next/dist/build/webpack/config/blocks/css/plugins.js`), so an ESM
 * module would come back as a namespace object rather than the plugin.
 */
const { readdirSync, readFileSync, statSync } = require("node:fs");
const path = require("node:path");

/** Directories scanned for class names, relative to the project root. */
const SCAN_DIRS = ["src"];

const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".md", ".mdx"]);
const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "dist", "build"]);

/**
 * String and template literals. Template chunks are captured whole and their
 * `${...}` holes blanked below, since a class list either side of an
 * interpolation is still a class list.
 */
const LITERALS = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
const INTERPOLATION = /\$\{[^}]*\}/g;

/**
 * What a candidate can look like: starts lowercase, `-` (negative), `[`
 * (arbitrary property) or `@` (container query), then the punctuation used by
 * variants (`:`), arbitrary values (`[]()`), fractions (`/`) and important.
 *
 * Deliberately permissive. A class we fail to extract is a broken layout; a
 * junk token Tailwind does not recognise costs nothing, since it produces no
 * rule at all. Given that asymmetry, over-collect.
 */
const CANDIDATE = /^[a-z@[-][a-zA-Z0-9@:_\-./[\]()%!*+~^$&=?|<>,#]*$/;

/**
 * `@source inline(...)` does brace expansion and is delimited by quotes, so a
 * candidate containing braces, a quote or a backslash would alter the directive
 * rather than be read as a class.
 */
const UNSAFE = /[{}"'`\\]/;

/**
 * Rejects tokens whose punctuation is unbalanced.
 *
 * This is the difference between a working stylesheet and a mostly-empty one.
 * Scanning every string literal in the codebase sweeps up English prose from
 * the content files, and prose yields tokens like `see)`, `design,` and
 * `stack.` — each of which is a syntactically plausible class name by the
 * pattern above. Inside `@source inline("…")` a stray bracket or comma
 * terminates the argument early, so a single bad token silently discards every
 * candidate after it in the same directive. That is what reduced a 6,300-class
 * list to roughly 350 rules.
 *
 * Real candidates keep their brackets and parentheses matched, and only use
 * commas inside them (`grid-cols-[repeat(2,1fr)]`). Trailing punctuation is
 * always prose.
 */
function isBalanced(token) {
  if (/[.,:\-]$/.test(token)) return false;
  let square = 0;
  let round = 0;
  for (const ch of token) {
    if (ch === "[") square++;
    else if (ch === "]" && --square < 0) return false;
    else if (ch === "(") round++;
    else if (ch === ")" && --round < 0) return false;
    else if (ch === "," && square + round === 0) return false;
  }
  return square === 0 && round === 0;
}

function collectFiles(dir, out) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(full, out);
    else if (EXTENSIONS.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

function extractCandidates(files) {
  const found = new Set();
  for (const file of files) {
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const match of text.matchAll(LITERALS)) {
      const raw = match[1] ?? match[2] ?? match[3];
      if (!raw) continue;
      for (const token of raw.replace(INTERPOLATION, " ").split(/\s+/)) {
        // Generous: a single arbitrary value carrying two layered gradients
        // runs past 140 characters, and clipping it drops a real class.
        if (!token || token.length > 400) continue;
        if (UNSAFE.test(token) || !CANDIDATE.test(token)) continue;
        if (!isBalanced(token)) continue;
        found.add(token);
      }
    }
  }
  return [...found].sort();
}

function scanSummary(root) {
  const dirs = SCAN_DIRS.map((d) => path.resolve(root, d)).filter((d) => {
    try {
      return statSync(d).isDirectory();
    } catch {
      return false;
    }
  });
  const files = dirs.flatMap((d) => collectFiles(d, []));
  return { dirs, files, candidates: extractCandidates(files) };
}

/** Keeps any single directive to a sane length rather than one enormous line. */
const CHUNK = 400;

function inlineSources(opts) {
  const root = (opts && opts.root) || process.cwd();
  const chunk = (opts && opts.chunk) || CHUNK;
  return {
    postcssPlugin: "tda-inline-sources",
    Once(css, { AtRule, result }) {
      // Only the entry stylesheet — the one that pulls Tailwind in.
      let anchor;
      css.walkAtRules("import", (rule) => {
        if (!anchor && rule.params.includes("tailwindcss")) anchor = rule;
      });
      if (!anchor) return;

      const { dirs, files, candidates } = scanSummary(root);
      if (candidates.length === 0) return;

      // Inserted back-to-front so the chunks end up in sorted order.
      for (let i = candidates.length; i > 0; i -= chunk) {
        const slice = candidates.slice(Math.max(0, i - chunk), i);
        anchor.after(
          new AtRule({ name: "source", params: `inline("${slice.join(" ")}")` }),
        );
      }

      // Lets the dev server rebuild CSS when a component's classes change.
      for (const dir of dirs) {
        result.messages.push({
          type: "dir-dependency",
          dir,
          glob: "**/*.{ts,tsx,js,jsx,mjs,md,mdx}",
          parent: css.source && css.source.input && css.source.input.file,
          plugin: "tda-inline-sources",
        });
      }

      if (process.env.TDA_CSS_DEBUG === "1") {
        console.log(
          `[tda-inline-sources] ${files.length} files -> ${candidates.length} candidates`,
        );
      }
    },
  };
}

inlineSources.postcss = true;

module.exports = inlineSources;
module.exports.scanSummary = scanSummary;
module.exports.collectFiles = collectFiles;
module.exports.extractCandidates = extractCandidates;
