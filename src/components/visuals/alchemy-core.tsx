"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const CoreCanvas = dynamic(
  () => import("./core-canvas").then((module) => module.CoreCanvas),
  { ssr: false },
);

/**
 * The Alchemy Core — the brand's central object.
 *
 * Two layers. The CSS sphere is always present: a mesh of overlapping radial
 * gradients in the accent palette under a glass highlight, which is a real
 * multi-colour object rather than a placeholder. The WebGL layer draws on top
 * of it where it earns its place, adding movement through the material.
 *
 * Both are built from the palette rather than a single hue, because a
 * one-colour core is the thing this direction is correcting.
 */
export function AlchemyCore({
  className,
  /** Dimmer, for use behind content rather than as the subject. */
  subdued = false,
}: {
  className?: string;
  subdued?: boolean;
}) {
  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      {/* Ambient bloom — the colour that escapes the object. */}
      <div
        className="absolute inset-[-18%] rounded-full blur-3xl"
        style={{
          opacity: subdued ? 0.28 : 0.5,
          background: [
            "radial-gradient(circle at 32% 28%, rgba(255,90,54,0.55) 0%, transparent 55%)",
            "radial-gradient(circle at 72% 34%, rgba(255,209,102,0.45) 0%, transparent 52%)",
            "radial-gradient(circle at 68% 74%, rgba(124,108,255,0.5) 0%, transparent 55%)",
            "radial-gradient(circle at 26% 70%, rgba(56,199,165,0.45) 0%, transparent 52%)",
            "radial-gradient(circle at 50% 50%, rgba(91,140,255,0.35) 0%, transparent 60%)",
          ].join(","),
        }}
      />

      {/* The sphere itself — a mesh of accent fields under glass. */}
      <div
        className="absolute inset-[12%] overflow-hidden rounded-full"
        style={{
          background: [
            "radial-gradient(circle at 28% 24%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 34%)",
            "radial-gradient(circle at 34% 30%, #ff5a36 0%, rgba(255,90,54,0) 46%)",
            "radial-gradient(circle at 66% 26%, #ffd166 0%, rgba(255,209,102,0) 44%)",
            "radial-gradient(circle at 76% 58%, #7c6cff 0%, rgba(124,108,255,0) 48%)",
            "radial-gradient(circle at 46% 82%, #ff6fae 0%, rgba(255,111,174,0) 46%)",
            "radial-gradient(circle at 20% 66%, #38c7a5 0%, rgba(56,199,165,0) 46%)",
            "radial-gradient(circle at 54% 52%, #5b8cff 0%, rgba(91,140,255,0) 58%)",
            "linear-gradient(150deg, #ffb199 0%, #a48bff 55%, #4f6bd6 100%)",
          ].join(","),
          boxShadow: [
            "inset -18px -22px 60px rgba(30,20,50,0.42)",
            "inset 14px 16px 42px rgba(255,255,255,0.5)",
            "0 34px 90px -26px rgba(60,40,110,0.45)",
          ].join(","),
        }}
      >
        {/* Specular sheen */}
        <span
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(128deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.12) 22%, rgba(255,255,255,0) 44%)",
          }}
        />
        {/* Contact shadow inside the lower limb */}
        <span
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 62% 78%, rgba(40,26,70,0.32) 0%, transparent 46%)",
          }}
        />
      </div>

      {/* Motion layer, where it is worth running. */}
      <CoreCanvas className="absolute inset-0 size-full" />
    </div>
  );
}

/**
 * The four faint colour fields that sit behind the page.
 *
 * Deliberately near-invisible. They stop large white areas reading as flat
 * without becoming a gradient wash — if you can point at them, they are too
 * strong.
 */
export function AmbientColorField({
  className,
  intensity = 1,
}: {
  className?: string;
  intensity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        background: [
          `radial-gradient(46% 38% at 12% 8%, rgba(255,90,54,${0.07 * intensity}) 0%, transparent 68%)`,
          `radial-gradient(52% 42% at 88% 14%, rgba(91,140,255,${0.08 * intensity}) 0%, transparent 70%)`,
          `radial-gradient(48% 40% at 78% 82%, rgba(124,108,255,${0.06 * intensity}) 0%, transparent 68%)`,
          `radial-gradient(44% 36% at 18% 88%, rgba(56,199,165,${0.06 * intensity}) 0%, transparent 66%)`,
        ].join(","),
      }}
    />
  );
}
