import type { CSSProperties } from "react";

/**
 * Props that opt an element into the scroll-reveal animation.
 *
 * This lives outside the client component on purpose: it is a plain object
 * builder with no runtime behaviour, so server components can spread it onto
 * their own markup without pulling a client boundary into the tree. The
 * observer that actually reveals these nodes is `RevealProvider`, mounted once
 * in the root layout.
 *
 * The matching CSS is scoped to `[data-js="on"]`, so if JavaScript never runs
 * the element simply renders visible.
 *
 * @param delay Stagger in milliseconds. Keep small — long staggers read as lag.
 * @param y     Distance travelled, in pixels.
 */
export function revealProps(delay = 0, y = 14) {
  return {
    "data-reveal": "",
    style: {
      "--reveal-delay": `${delay}ms`,
      "--reveal-y": `${y}px`,
    } as CSSProperties,
  };
}
