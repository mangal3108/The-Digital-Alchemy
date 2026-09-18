"use client";

import * as React from "react";
import Script from "next/script";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Cookie consent.
 *
 * Nothing beyond strictly necessary cookies runs until the visitor chooses.
 * Analytics and marketing tags are mounted only after the relevant category is
 * granted — the common pattern of loading trackers first and showing a banner
 * afterwards is not consent, it is notification.
 */

export type ConsentCategories = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "tda-consent-v1";

const DENIED: ConsentCategories = {
  necessary: true,
  analytics: false,
  marketing: false,
};

interface ConsentContextValue {
  consent: ConsentCategories | null;
  decided: boolean;
  save: (value: Omit<ConsentCategories, "necessary">) => void;
  reopen: () => void;
}

const ConsentContext = React.createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const context = React.useContext(ConsentContext);
  if (!context) {
    throw new Error("useConsent must be used inside ConsentProvider");
  }
  return context;
}

interface AnalyticsIds {
  ga4: string;
  gtm: string;
  metaPixel: string;
  clarity: string;
}

export function ConsentProvider({
  children,
  analytics,
}: {
  children: React.ReactNode;
  analytics: AnalyticsIds;
}) {
  const [consent, setConsent] = React.useState<ConsentCategories | null>(null);
  const [hydrated, setHydrated] = React.useState(false);
  const [bannerOpen, setBannerOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ConsentCategories>;
        setConsent({
          necessary: true,
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
        });
      } else {
        setBannerOpen(true);
      }
    } catch {
      setBannerOpen(true);
    }
    setHydrated(true);
  }, []);

  const save = React.useCallback(
    (value: Omit<ConsentCategories, "necessary">) => {
      const next: ConsentCategories = { necessary: true, ...value };
      setConsent(next);
      setBannerOpen(false);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage can be unavailable in private modes; the choice still holds
        // for this session, it simply is not remembered.
      }
    },
    [],
  );

  const reopen = React.useCallback(() => setBannerOpen(true), []);

  const value = React.useMemo(
    () => ({ consent, decided: consent !== null, save, reopen }),
    [consent, save, reopen],
  );

  const granted = consent ?? DENIED;
  const hasAnyId =
    analytics.ga4 || analytics.gtm || analytics.metaPixel || analytics.clarity;

  return (
    <ConsentContext.Provider value={value}>
      {children}

      {granted.analytics && analytics.gtm ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${analytics.gtm}');`}
        </Script>
      ) : null}

      {granted.analytics && analytics.ga4 && !analytics.gtm ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${analytics.ga4}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${analytics.ga4}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}

      {granted.analytics && analytics.clarity ? (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${analytics.clarity}");`}
        </Script>
      ) : null}

      {granted.marketing && analytics.metaPixel ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${analytics.metaPixel}');fbq('track','PageView');`}
        </Script>
      ) : null}

      {hydrated && bannerOpen && hasAnyId ? (
        <ConsentBanner onSave={save} current={consent} />
      ) : null}
    </ConsentContext.Provider>
  );
}

function ConsentBanner({
  onSave,
  current,
}: {
  onSave: (value: Omit<ConsentCategories, "necessary">) => void;
  current: ConsentCategories | null;
}) {
  const [showDetail, setShowDetail] = React.useState(false);
  const [analytics, setAnalytics] = React.useState(current?.analytics ?? false);
  const [marketing, setMarketing] = React.useState(current?.marketing ?? false);
  const headingId = React.useId();

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={headingId}
      className="fixed inset-x-0 bottom-0 z-modal p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl rounded-lg border border-hairline-strong bg-surface p-4 shadow-xl sm:p-5">
        <h2 id={headingId} className="text-base font-semibold text-ink">
          Cookies
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
          We use strictly necessary cookies to run this site. With your
          permission we would also like to measure how it is used.{" "}
          <Link
            href="/privacy"
            className="text-accent-text underline underline-offset-4"
          >
            Privacy policy
          </Link>
          .
        </p>

        {showDetail ? (
          <fieldset className="mt-4 space-y-2.5 border-t border-hairline pt-4">
            <legend className="sr-only">Cookie categories</legend>
            <CategoryRow
              label="Strictly necessary"
              description="Required for the site and forms to work. Always on."
              checked
              disabled
              onChange={() => undefined}
            />
            <CategoryRow
              label="Analytics"
              description="How pages are found and used, so we can improve them."
              checked={analytics}
              onChange={setAnalytics}
            />
            <CategoryRow
              label="Marketing"
              description="Measures advertising performance across platforms."
              checked={marketing}
              onChange={setMarketing}
            />
          </fieldset>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSave({ analytics: true, marketing: true })}
            className="h-10 rounded-md bg-ink px-4 text-sm font-medium text-ink-inverse transition-colors duration-[var(--duration-fast)] hover:bg-ink-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={() => onSave({ analytics: false, marketing: false })}
            className="h-10 rounded-md border border-hairline-strong px-4 text-sm font-medium text-ink transition-colors duration-[var(--duration-fast)] hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            Reject non-essential
          </button>
          {showDetail ? (
            <button
              type="button"
              onClick={() => onSave({ analytics, marketing })}
              className="h-10 rounded-md border border-hairline-strong px-4 text-sm font-medium text-ink transition-colors duration-[var(--duration-fast)] hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Save choices
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowDetail(true)}
              className="h-10 rounded-md px-3 text-sm font-medium text-ink-muted underline underline-offset-4 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              Manage preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  const id = React.useId();
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className={cn(
          "mt-0.5 size-4 shrink-0 rounded-xs border-hairline-strong accent-[var(--color-accent-strong)]",
          disabled && "opacity-50",
        )}
      />
      <label htmlFor={id} className="text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="block text-ink-muted">{description}</span>
      </label>
    </div>
  );
}
