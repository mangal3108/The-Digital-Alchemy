import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  BrowserChrome,
  LaptopFrame,
  MonitorFrame,
  PhoneFrame,
} from "@/components/visuals/devices";

/**
 * A stage for photographing the product, not a page anyone visits.
 *
 * The hero needs a device lineup whose screens show real software. Generating
 * one produces invented interfaces and garbled lettering — the render this
 * replaces had "Eampany Value" and a column headed "Deaths" in it. Photographing
 * a real lineup would need hardware we do not have.
 *
 * So we build it: the device frames are the ones already used across the site,
 * and the screens are real screenshots captured from the running site and admin
 * by `scripts/capture-ui.mjs`. `scripts/build-hero-composite.mjs` renders this
 * route headlessly on a transparent ground and crops it to the hero asset.
 *
 * It 404s unless TDA_CAPTURE=1, so it cannot be reached in a normal build.
 */

export const metadata: Metadata = { robots: { index: false, follow: false } };

/*
 * Plain <img>, deliberately. next/image would resize and re-encode these on
 * the way in, and this page exists to be photographed at exact pixel scale —
 * a resampled screenshot inside a device frame reads as soft. Nothing here is
 * ever served to a visitor, so the usual LCP argument does not apply.
 */
/* eslint-disable @next/next/no-img-element */

/** Rendered at exactly this size, then captured at 2×. */
const STAGE = { width: 1200, height: 572 };

export default function CaptureHero() {
  if (process.env.TDA_CAPTURE !== "1") notFound();

  return (
    <div
      style={{
        width: STAGE.width,
        height: STAGE.height,
        position: "relative",
        background: "transparent",
      }}
    >
      {/*
        Three devices, not five. At hero width a fourth and fifth reduce to
        thumbnails whose screens read as texture, and the lineup starts
        clipping at the frame edge.

        The monitor shows the redirect manager rather than the dashboard: it is
        the densest genuinely-populated screen in the admin — thirteen live
        WordPress migration rules, real paths, real status codes — where the
        dashboard is honestly but unhelpfully all zeroes.
      */}
      <div style={{ position: "absolute", left: "1%", top: "3%", width: "43%" }}>
        <MonitorFrame>
          <img
            src="/images/ui/admin-redirects.png"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top left" }}
          />
        </MonitorFrame>
      </div>

      {/* Laptop, the hero object — the marketing site in browser chrome */}
      <div style={{ position: "absolute", left: "31%", top: "25%", width: "44%" }}>
        <LaptopFrame>
          <BrowserChrome url="thedigitalalchemy.co.in">
            <img
              src="/images/ui/site-services.png"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
            />
          </BrowserChrome>
        </LaptopFrame>
      </div>

      {/* Phone, front-most — the same site on a narrow viewport */}
      <div style={{ position: "absolute", left: "79%", top: "36%", width: "10%" }}>
        <PhoneFrame>
          <img
            src="/images/ui/phone-home.png"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
          />
        </PhoneFrame>
      </div>
    </div>
  );
}
