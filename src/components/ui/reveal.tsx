"use client";

import * as React from "react";

/**
 * Scroll reveal.
 *
 * One IntersectionObserver for the whole document rather than an observer (or
 * a Framer Motion instance) per element — this is the cheapest way to animate
 * a page with a hundred revealed items without janking the scroll.
 *
 * The styles live in globals.css scoped to [data-js="on"], so markup renders
 * fully visible when JavaScript is unavailable.
 */
export function RevealProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (prefersReduced.matches) {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => el.setAttribute("data-revealed", "true"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "true");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const observe = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")
        .forEach((el) => observer.observe(el));
    };

    observe();

    // Route changes and lazily-rendered sections add new nodes after mount.
    const mutation = new MutationObserver(observe);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  return <>{children}</>;
}

/**
 * Marks a block for reveal. `delay` staggers siblings; keep it small — long
 * staggers make a page feel slow rather than considered.
 */
export function Reveal({
  children,
  delay = 0,
  y = 14,
  as: Tag = "div",
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  as?: React.ElementType;
  className?: string;
}) {
  return (
    <Tag
      data-reveal=""
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-y": `${y}px`,
        } as React.CSSProperties
      }
      className={className}
    >
      {children}
    </Tag>
  );
}
