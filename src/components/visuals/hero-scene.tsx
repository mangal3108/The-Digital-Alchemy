"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery, usePrefersMotion } from "@/lib/use-media-query";
import { AlchemyCore } from "./alchemy-core";
import { BrandImage } from "@/components/ui/brand-image";

/**
 * The homepage hero composition.
 *
 * A single photographed lineup — monitor, laptop, tablet, phone, watch — all
 * running the same platform. That is the argument the section makes: one
 * system, every surface. It replaces the earlier hand-built device mockups,
 * which were honest about being placeholders but read as wireframes.
 *
 * The image is not dropped into a card. Its studio background is #f9f9f9
 * against the page's #f7f7f5 — close enough to be invisible, but the edges are
 * feathered anyway so the composition dissolves into the page instead of
 * ending at a rectangle, and the reflection fades rather than being cut off.
 * The colour core sits behind it at depth.
 */

/** Maximum tilt in degrees. Small on purpose — this should read as depth. */
const MAX_TILT = 2;

export function HeroScene({ className }: { className?: string }) {
  const sceneRef = React.useRef<HTMLDivElement>(null);
  // Subscribed rather than read once, so resizing across the breakpoint or
  // switching to a mouse picks the enhancement up.
  const motionOk = usePrefersMotion();
  const fine = useMediaQuery("(pointer: fine)");
  const large = useMediaQuery("(min-width: 1024px)");
  const enhanced = motionOk && fine && large;

  React.useEffect(() => {
    if (!enhanced) return;
    const scene = sceneRef.current;
    if (!scene) return;

    let frame = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onPointerMove = (event: PointerEvent) => {
      const rect = scene.getBoundingClientRect();
      if (rect.width === 0) return;
      // -1..1 from the centre of the scene.
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onLeave = () => {
      target.x = 0;
      target.y = 0;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      scene.style.setProperty("--tilt-y", `${current.x * MAX_TILT}deg`);
      scene.style.setProperty("--tilt-x", `${-current.y * MAX_TILT}deg`);
      scene.style.setProperty("--shift-x", `${current.x * -10}px`);
      scene.style.setProperty("--shift-y", `${current.y * -6}px`);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [enhanced]);

  /**
   * Feathers the outer edge. Two gradients intersected: a horizontal one that
   * softens both sides, and a vertical one that lets the reflection fall away
   * into the page rather than stopping at the image boundary.
   */
  const feather = {
    maskImage:
      "linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%), linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)",
    WebkitMaskImage:
      "linear-gradient(to right, transparent 0%, #000 5%, #000 95%, transparent 100%), linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)",
    maskComposite: "intersect",
    WebkitMaskComposite: "source-in",
  } as React.CSSProperties;

  return (
    <div
      ref={sceneRef}
      className={cn("perspective-far relative isolate w-full", className)}
      style={
        {
          "--tilt-x": "0deg",
          "--tilt-y": "0deg",
          "--shift-x": "0px",
          "--shift-y": "0px",
        } as React.CSSProperties
      }
    >
      {/* ---- The core, behind the hardware ---- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
      >
        <AlchemyCore className="size-[min(72vw,38rem)] opacity-70" />
      </div>

      <div
        className="preserve-3d relative"
        style={{
          transform:
            "rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) translate3d(var(--shift-x), var(--shift-y), 0)",
          transition: "transform 140ms linear",
        }}
      >
        <div style={feather}>
          <BrandImage
            name="platform-devices"
            alt="A desktop monitor, laptop, tablet, phone and smartwatch, each running a different part of the same business platform: company dashboards, inventory management, an employee portal and a mobile sales view."
            priority
            sizes="(max-width: 1024px) 100vw, 1200px"
            imgClassName="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
