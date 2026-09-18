"use client";

import * as React from "react";

/**
 * Counts a numeric metric up once it enters the viewport.
 *
 * Two deliberate constraints:
 *  - The final value is rendered on the server and is what sits in the DOM, so
 *    the real figure is present for search engines, copy/paste and anyone with
 *    JavaScript disabled. The animation only ever replaces it temporarily.
 *  - Non-numeric values (say "24/7" or "Since 2021") are passed straight
 *    through. Animating those would be nonsense.
 */
export function CountUp({ value }: { value: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(value);

  // Split "1,200+" into its numeric core and whatever surrounds it.
  const parsed = React.useMemo(() => {
    const match = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!match) return null;
    const [, prefix = "", digits = "", suffix = ""] = match;
    const target = Number(digits.replace(/,/g, ""));
    if (!Number.isFinite(target)) return null;
    const hasSeparators = digits.includes(",");
    const decimals = digits.includes(".")
      ? (digits.split(".")[1]?.length ?? 0)
      : 0;
    return { prefix, suffix, target, hasSeparators, decimals };
  }, [value]);

  React.useEffect(() => {
    if (!parsed) return;
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const format = (n: number) => {
      const fixed = n.toFixed(parsed.decimals);
      const withSeparators = parsed.hasSeparators
        ? Number(fixed).toLocaleString("en-IN", {
            minimumFractionDigits: parsed.decimals,
            maximumFractionDigits: parsed.decimals,
          })
        : fixed;
      return `${parsed.prefix}${withSeparators}${parsed.suffix}`;
    };

    let frame = 0;
    let started = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (started || !entries[0]?.isIntersecting) return;
        started = true;
        observer.disconnect();

        const duration = 1100;
        const start = performance.now();

        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          // Ease out — fast start, settled finish.
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(format(parsed.target * eased));
          if (progress < 1) frame = requestAnimationFrame(step);
          else setDisplay(value);
        };

        setDisplay(format(0));
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [parsed, value]);

  if (!parsed) return <span>{value}</span>;

  return (
    <span ref={ref} suppressHydrationWarning>
      {display}
    </span>
  );
}
