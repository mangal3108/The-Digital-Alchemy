import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

/**
 * `tda-inline-sources` must run before Tailwind: it injects the `@source
 * inline(...)` directives Tailwind then reads. See that file for why the class
 * list is gathered in JS rather than by Tailwind's own scanner.
 *
 * Next resolves plugins by name and `require()`s them, so this has to be an
 * absolute path string rather than an imported function, and the options object
 * has to be non-empty or Next hands PostCSS the uncalled factory.
 */
const config = {
  plugins: [
    [path.join(root, "scripts", "postcss-inline-sources.cjs"), { root }],
    ["@tailwindcss/postcss", {}],
  ],
};

export default config;
