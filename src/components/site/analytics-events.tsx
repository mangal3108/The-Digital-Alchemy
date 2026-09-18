"use client";

import * as React from "react";

/**
 * Conversion event tracking.
 *
 * One delegated listener rather than handlers scattered through components.
 * Elements opt in with `data-analytics="event_name"`; mailto: and tel: links
 * are detected automatically so they cannot be missed.
 *
 * Events are pushed to `window.dataLayer`, which is what GTM and GA4 read. If
 * consent has not been granted no tag is loaded, so the pushes are inert —
 * they are queued, not transmitted.
 */

type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

export function AnalyticsEvents() {
  React.useEffect(() => {
    const onClick = (nativeEvent: MouseEvent) => {
      const target = nativeEvent.target as HTMLElement | null;
      if (!target) return;

      const element = target.closest<HTMLElement>("a, button, [data-analytics]");
      if (!element) return;

      const explicit = element.dataset.analytics;
      if (explicit) {
        track(explicit, { label: element.textContent?.trim().slice(0, 80) });
        return;
      }

      const href = element.getAttribute("href");
      if (!href) return;

      if (href.startsWith("mailto:")) {
        track("email_click", { destination: href.replace("mailto:", "") });
      } else if (href.startsWith("tel:")) {
        track("phone_click", { destination: href.replace("tel:", "") });
      } else if (href.includes("wa.me")) {
        track("whatsapp_click");
      } else if (href === "/start-a-project" || href.startsWith("/start-a-project")) {
        track("start_project_click", {
          label: element.textContent?.trim().slice(0, 80),
        });
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
