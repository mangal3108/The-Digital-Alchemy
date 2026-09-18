import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

/**
 * Next 15's eslint-config-next ships as a legacy (eslintrc) shareable config,
 * so it is bridged into flat config with FlatCompat rather than imported
 * directly — the flat entry points only exist in Next 16.
 */
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
      "src/generated/**",
      // Throwaway Chrome profile created by the verification scripts. Full of
      // bundled extension code that is not ours and must not be linted.
      ".chrome-capture-profile/**",
      "images/_inbox/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // `.cjs` files are CommonJS by definition, and Next `require()`s the
    // PostCSS plugin rather than importing it, so `require` is the correct
    // form there — not a legacy holdover to migrate.
    files: ["**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    rules: {
      // Unused arguments prefixed with an underscore are a deliberate signal
      // (server action `_prev` state, for instance), not an oversight.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],
    },
  },
];

export default eslintConfig;
