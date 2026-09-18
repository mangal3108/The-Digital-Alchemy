import { ImageResponse } from "next/og";
import { publicAssetDataUri } from "@/lib/brand-asset";
import { siteConfig } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

/**
 * Default social card, generated rather than maintained as a file so it never
 * drifts out of sync with the positioning. Pages can override it with their
 * own image through the admin SEO editor.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0d",
          padding: 72,
          position: "relative",
        }}
      >
        {/* Ambient copper wash */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background:
              // Satori has no CSS custom properties, so the accent is a literal here.
              // Coral #FF5A36, matching --color-coral in globals.css.
              "radial-gradient(circle, rgba(255,90,54,0.38) 0%, rgba(255,90,54,0.05) 55%, rgba(11,11,13,0) 72%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={publicAssetDataUri("brand/logo-mark.png")}
            width={55}
            height={44}
            alt=""
          />
          <div
            style={{
              color: "#faf8f5",
              fontSize: 30,
              letterSpacing: -0.8,
              fontWeight: 600,
            }}
          >
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              color: "#faf8f5",
              fontSize: 66,
              lineHeight: 1.06,
              letterSpacing: -2.4,
              fontWeight: 600,
              maxWidth: 900,
            }}
          >
            We design, build and grow digital businesses.
          </div>
          <div
            style={{
              color: "#a6a6b0",
              fontSize: 26,
              lineHeight: 1.4,
              maxWidth: 820,
            }}
          >
            SaaS · Custom software · Web · Mobile apps · Design · Digital growth
          </div>
        </div>

        <div
          style={{
            display: "flex",
            color: "#85858f",
            fontSize: 21,
            letterSpacing: 1.4,
            textTransform: "uppercase",
          }}
        >
          Based in New Delhi · Working with clients worldwide
        </div>
      </div>
    ),
    size,
  );
}
