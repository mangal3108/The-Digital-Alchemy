import { cn } from "@/lib/utils";

/**
 * The closing brand object — the alchemy core resolved into its final form.
 *
 * Pure SVG so it stays sharp at any size, costs nothing to render, and needs no
 * fallback. The rotation is decorative and disabled under reduced motion.
 */
export function AlchemySigil({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className={cn("size-48", className)}
    >
      <defs>
        <radialGradient id="sigil-core" cx="50%" cy="42%" r="58%">
          {/* The core carries the full palette rather than one hue — it is
              the same object as the hero core, drawn flat. */}
          <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.95" />
          <stop offset="34%" stopColor="var(--color-coral)" stopOpacity="0.9" />
          <stop offset="62%" stopColor="var(--color-violet)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--color-blue)" stopOpacity="0.7" />
        </radialGradient>
        <linearGradient id="sigil-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* Outer vessel */}
      <circle
        cx="100"
        cy="100"
        r="88"
        stroke="currentColor"
        strokeOpacity="0.16"
        strokeWidth="1"
      />
      <circle
        cx="100"
        cy="100"
        r="70"
        stroke="url(#sigil-sheen)"
        strokeWidth="1"
      />

      {/* Rotating orbit — decorative only */}
      <g
        className="origin-center motion-safe:animate-[spin_38s_linear_infinite]"
        style={{ transformOrigin: "100px 100px" }}
      >
        <ellipse
          cx="100"
          cy="100"
          rx="88"
          ry="34"
          stroke="currentColor"
          strokeOpacity="0.14"
          strokeWidth="1"
        />
        <circle cx="188" cy="100" r="2.5" fill="var(--color-accent)" />
      </g>

      {/* Transmutation triangle */}
      <path
        d="M100 38 L156 142 H44 Z"
        stroke="currentColor"
        strokeOpacity="0.32"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />

      {/* The core */}
      <circle cx="100" cy="112" r="26" fill="url(#sigil-core)" />
      <circle
        cx="100"
        cy="112"
        r="26"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth="0.75"
      />

      {/* Highlight */}
      <ellipse
        cx="92"
        cy="102"
        rx="9"
        ry="6"
        fill="#fff"
        opacity="0.22"
        transform="rotate(-28 92 102)"
      />
    </svg>
  );
}
