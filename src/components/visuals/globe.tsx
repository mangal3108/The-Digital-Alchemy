"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A real, rotating globe.
 *
 * Renders actual country geometry (Natural Earth 110m, reduced at build time by
 * scripts/build-globe-data.mjs) through a d3-geo orthographic projection onto a
 * canvas. Both the geometry and the projection library are dynamically imported
 * and only fetched once the globe scrolls into view, so nothing here touches
 * the initial page load.
 *
 * It degrades in stages rather than all at once:
 *   - reduced motion  → renders once, centred on India, no rotation
 *   - offscreen or backgrounded tab → animation loop parked
 *   - no canvas or failed fetch → nothing renders, and the list of markets
 *     beside it (which is the actual content) is unaffected
 */

export interface GlobeMarker {
  /** ISO 3166-1 numeric, matched against the country geometry. */
  code: string;
  name: string;
  lat: number;
  lon: number;
  isHome?: boolean;
}

interface EncodedFeature {
  id: string;
  n: string;
  /** polygons → rings → flat [lon, lat, …] scaled by `scale`. */
  p: number[][][];
}

type Ring = [number, number][];

/** Palette — read from the design tokens so the globe cannot drift off-brand. */
function readPalette(element: HTMLElement) {
  const styles = getComputedStyle(element);
  const token = (name: string, fallback: string) =>
    styles.getPropertyValue(name).trim() || fallback;

  return {
    ocean: token("--globe-ocean", "#dfe7ea"),
    oceanDeep: token("--globe-ocean-deep", "#c3d2d8"),
    land: token("--globe-land", "#e8e2d5"),
    landAlt: token("--globe-land-alt", "#ded7c7"),
    border: token("--globe-border", "#ffffff"),
    highlight: token("--color-accent", "#c0511f"),
    highlightSoft: token("--color-accent-2", "#7c6cff"),
    graticule: token("--globe-graticule", "#b9c7ce"),
    home: token("--color-coral", "#ff5a36"),
  };
}

/**
 * Deterministic per-country tint so neighbouring countries separate visually
 * without needing a legend or a palette that changes between renders.
 */
function tintFor(id: string, land: string, landAlt: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(hash) % 3 === 0 ? landAlt : land;
}

/**
 * ISO 3166-1 numeric codes are zero-padded in the source data ("036", not
 * "36"). Normalising both sides of the comparison means a market defined
 * either way still highlights.
 */
const normaliseCode = (code: string) => code.trim().padStart(3, "0");

export function Globe({
  markers,
  className,
  /** Degrees per second. Slow enough to read as drift, not spin. */
  speed = 4,
}: {
  markers: GlobeMarker[];
  className?: string;
  speed?: number;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    let cancelled = false;
    let frame = 0;
    let cleanupObservers: (() => void) | undefined;

    const start = async () => {
      let geoModule: typeof import("d3-geo");
      let data: { scale: number; features: EncodedFeature[] };

      try {
        [geoModule, data] = await Promise.all([
          import("d3-geo"),
          import("@/content/generated/world-countries.json").then(
            (m) => m.default as { scale: number; features: EncodedFeature[] },
          ),
        ]);
      } catch {
        if (!cancelled) setFailed(true);
        return;
      }

      if (cancelled) return;

      const context = canvas.getContext("2d");
      if (!context) {
        setFailed(true);
        return;
      }

      const { geoOrthographic, geoPath, geoGraticule10 } = geoModule;

      // Decode the flat integer rings back into GeoJSON the projection reads.
      const scale = data.scale;
      const countries = data.features.map((feature) => ({
        id: feature.id,
        name: feature.n,
        geometry: {
          type: "MultiPolygon" as const,
          coordinates: feature.p.map((rings) =>
            rings.map((flat) => {
              const ring: Ring = new Array(flat.length / 2);
              for (let i = 0; i < flat.length; i += 2) {
                ring[i / 2] = [flat[i]! / scale, flat[i + 1]! / scale];
              }
              return ring;
            }),
          ),
        },
      }));

      const highlighted = new Map(
        markers.map((m) => [normaliseCode(m.code), m]),
      );
      const home = markers.find((m) => m.isHome) ?? markers[0];

      const projection = geoOrthographic().precision(0.4);
      const path = geoPath(projection, context);
      const graticule = geoGraticule10();
      const sphere = { type: "Sphere" as const };

      const palette = readPalette(wrapper);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

      // Longitude offset. Starts just west of India so the studio is front and
      // centre on first paint, which is the point the section is making.
      let rotation = -(home?.lon ?? 78);
      let lastTime = 0;
      let visible = true;
      let onScreen = true;
      let paused = false;
      let dpr = 1;
      let size = 0;

      const resize = () => {
        const rect = wrapper.getBoundingClientRect();
        size = Math.max(1, Math.round(rect.width));
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(size * dpr);
        canvas.height = Math.round(size * dpr);
        canvas.style.height = `${size}px`;
        // Inset slightly so the atmosphere ring is not clipped by the canvas.
        projection
          .scale((size / 2) * 0.92)
          .translate([size / 2, size / 2]);
      };

      const drawArc = (from: GlobeMarker, to: GlobeMarker) => {
        context.beginPath();
        path({
          type: "LineString",
          coordinates: [
            [from.lon, from.lat],
            [to.lon, to.lat],
          ],
        });
        context.strokeStyle = palette.highlightSoft;
        context.globalAlpha = 0.75;
        context.lineWidth = 1.2;
        context.setLineDash([4, 4]);
        context.stroke();
        context.setLineDash([]);
        context.globalAlpha = 1;
      };

      /**
       * True when a point sits on the hemisphere facing the viewer.
       *
       * An orthographic projection happily returns coordinates for points on
       * the far side of the globe, so markers would otherwise show through the
       * Earth. The centre of the visible hemisphere is the inverse of the
       * projection's current rotation; anything less than a quarter turn from
       * it is in front.
       */
      const RAD = Math.PI / 180;
      const isVisiblePoint = (lon: number, lat: number) => {
        const [rotateLon, rotateTilt] = projection.rotate();
        const centreLon = -rotateLon * RAD;
        const centreLat = -rotateTilt * RAD;
        const pointLon = lon * RAD;
        const pointLat = lat * RAD;
        const cosine =
          Math.sin(centreLat) * Math.sin(pointLat) +
          Math.cos(centreLat) *
            Math.cos(pointLat) *
            Math.cos(pointLon - centreLon);
        return cosine > 0;
      };

      const render = () => {
        context.save();
        context.scale(dpr, dpr);
        context.clearRect(0, 0, size, size);

        projection.rotate([rotation, -12, 0]);

        // --- Ocean, with a light source up and to the left ------------------
        context.beginPath();
        path(sphere);
        const gradient = context.createRadialGradient(
          size * 0.36,
          size * 0.32,
          size * 0.05,
          size * 0.5,
          size * 0.5,
          size * 0.55,
        );
        gradient.addColorStop(0, palette.ocean);
        gradient.addColorStop(1, palette.oceanDeep);
        context.fillStyle = gradient;
        context.fill();

        // --- Graticule -------------------------------------------------------
        context.beginPath();
        path(graticule);
        context.strokeStyle = palette.graticule;
        context.globalAlpha = 0.4;
        context.lineWidth = 0.5;
        context.stroke();
        context.globalAlpha = 1;

        // --- Countries -------------------------------------------------------
        for (const country of countries) {
          const marker = highlighted.get(normaliseCode(country.id));
          context.beginPath();
          path(country.geometry);
          context.fillStyle = marker
            ? marker.isHome
              ? palette.home
              : palette.highlight
            : tintFor(country.id, palette.land, palette.landAlt);
          context.fill();
          context.strokeStyle = palette.border;
          context.globalAlpha = marker ? 0.85 : 0.55;
          context.lineWidth = 0.5;
          context.stroke();
          context.globalAlpha = 1;
        }

        // --- Arcs from the studio to each market ------------------------------
        if (home) {
          for (const marker of markers) {
            if (marker === home) continue;
            drawArc(home, marker);
          }
        }

        // --- Markers ----------------------------------------------------------
        for (const marker of markers) {
          if (!isVisiblePoint(marker.lon, marker.lat)) continue;
          const point = projection([marker.lon, marker.lat]);
          if (!point) continue;
          const [x, y] = point;
          const radius = marker.isHome ? 5 : 3.4;

          if (marker.isHome) {
            context.beginPath();
            context.arc(x, y, radius * 2.6, 0, Math.PI * 2);
            context.fillStyle = palette.highlight;
            context.globalAlpha = 0.16;
            context.fill();
            context.globalAlpha = 1;
          }

          context.beginPath();
          context.arc(x, y, radius, 0, Math.PI * 2);
          context.fillStyle = marker.isHome ? palette.home : palette.highlight;
          context.fill();
          context.lineWidth = 1.6;
          context.strokeStyle = "#ffffff";
          context.stroke();
        }

        // --- Limb shading, which is what makes it read as a sphere ------------
        context.beginPath();
        path(sphere);
        const limb = context.createRadialGradient(
          size * 0.42,
          size * 0.38,
          size * 0.2,
          size * 0.5,
          size * 0.5,
          size * 0.5,
        );
        limb.addColorStop(0, "rgba(0,0,0,0)");
        limb.addColorStop(0.72, "rgba(0,0,0,0)");
        limb.addColorStop(1, "rgba(24,18,12,0.22)");
        context.fillStyle = limb;
        context.fill();

        context.restore();
      };

      const tick = (time: number) => {
        frame = requestAnimationFrame(tick);
        if (!visible || !onScreen || paused) {
          lastTime = time;
          return;
        }
        const elapsed = lastTime ? (time - lastTime) / 1000 : 0;
        lastTime = time;
        rotation = (rotation + elapsed * speed) % 360;
        render();
      };

      resize();
      render();
      setReady(true);

      const resizeObserver = new ResizeObserver(() => {
        resize();
        render();
      });
      resizeObserver.observe(wrapper);

      const intersection = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry?.isIntersecting ?? false;
        },
        { threshold: 0 },
      );
      intersection.observe(wrapper);

      const onVisibility = () => {
        visible = document.visibilityState === "visible";
      };
      document.addEventListener("visibilitychange", onVisibility);

      // Pause while a pointer rests on it, so anyone reading a country label
      // is not fighting the rotation.
      const onEnter = () => {
        paused = true;
      };
      const onLeave = () => {
        paused = false;
      };
      wrapper.addEventListener("pointerenter", onEnter);
      wrapper.addEventListener("pointerleave", onLeave);

      if (!reduced.matches) frame = requestAnimationFrame(tick);

      const onMotionChange = () => {
        cancelAnimationFrame(frame);
        lastTime = 0;
        if (!reduced.matches) frame = requestAnimationFrame(tick);
        else render();
      };
      reduced.addEventListener("change", onMotionChange);

      cleanupObservers = () => {
        resizeObserver.disconnect();
        intersection.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        reduced.removeEventListener("change", onMotionChange);
        wrapper.removeEventListener("pointerenter", onEnter);
        wrapper.removeEventListener("pointerleave", onLeave);
      };
    };

    /**
     * Load during idle time rather than gating on IntersectionObserver.
     *
     * Gating initialisation on intersection is tempting but fragile: an
     * observer never reports an intersection in a page the browser is not
     * rendering — a background tab, a print context, an embedded webview — and
     * the globe would then stay blank even after the reader scrolled to it.
     * The geometry is a separate low-priority chunk either way, so the honest
     * trade is to fetch it when the main thread is free and let intersection
     * control only the animation loop, which is where it actually belongs.
     */
    const idle =
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(() => void start(), { timeout: 2000 })
        : window.setTimeout(() => void start(), 200);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idle as number);
      } else {
        window.clearTimeout(idle as number);
      }
      cleanupObservers?.();
    };
  }, [markers, speed]);

  return (
    <div
      ref={wrapperRef}
      className={cn("relative aspect-square w-full", className)}
      style={
        {
          "--globe-ocean": "#e3ebee",
          "--globe-ocean-deep": "#bccdd5",
          "--globe-land": "#e9e3d6",
          "--globe-land-alt": "#ded6c5",
          "--globe-border": "#fbfaf8",
          "--globe-graticule": "#a9bcc5",
        } as React.CSSProperties
      }
    >
      {/* Atmosphere. Purely decorative, and cheap enough to keep in CSS. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full transition-opacity duration-[var(--duration-cinematic)]",
          ready ? "opacity-100" : "opacity-0",
        )}
        style={{
          boxShadow:
            "0 30px 80px -30px rgba(24,18,12,0.35), inset 0 0 60px rgba(255,255,255,0.25)",
          background:
            "radial-gradient(circle at 50% 50%, transparent 68%, rgba(120,160,180,0.16) 82%, transparent 92%)",
        }}
      />
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Rotating globe showing the markets we work in: India, the United States, Australia, the United Kingdom, Canada and the United Arab Emirates."
        className={cn(
          "block w-full rounded-full transition-opacity duration-[var(--duration-cinematic)]",
          ready && !failed ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
