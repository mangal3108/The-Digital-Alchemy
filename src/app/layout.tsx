import type { Metadata, Viewport } from "next";
import Script from "next/script";

import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { siteConfig, absoluteUrl } from "@/config/site";
import { getSiteSettings } from "@/lib/settings";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/json-ld";
import { RevealProvider } from "@/components/ui/reveal";
import { ConsentProvider } from "@/components/site/consent";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: settings.defaultMetaTitle,
      template: `%s | ${settings.companyName}`,
    },
    description: settings.defaultMetaDescription,
    applicationName: settings.companyName,
    authors: [{ name: settings.companyName, url: absoluteUrl("/") }],
    creator: settings.companyName,
    publisher: settings.companyName,
    formatDetection: { telephone: false, address: false, email: false },
    // Icons and the default social card come from the app/icon and
    // app/opengraph-image file conventions — no manual paths to drift.
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#f7f7f5" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const [organization, website] = [
    await organizationSchema(),
    websiteSchema(settings.companyName),
  ];

  return (
    <html lang="en" className={`${fontVariables} h-full`} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TRBXWZBD');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Meta Pixel Code */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1376973917843956');
fbq('track', 'PageView');`,
          }}
        />
        {/* End Meta Pixel Code */}
        {/*
          Marks the document as JavaScript-capable before first paint. The
          scroll-reveal styles are scoped to [data-js="on"], so if JS is
          disabled or fails to load, content renders visible instead of
          staying stuck at opacity 0.
        */}
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.dataset.js="on"`}
        </Script>
      </head>
      <body className="min-h-full antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TRBXWZBD"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Meta Pixel (noscript) */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1376973917843956&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel (noscript) */}

        <ConsentProvider analytics={settings.analytics}>
          <RevealProvider>{children}</RevealProvider>
        </ConsentProvider>

        <JsonLd id="organization-schema" data={organization} />
        <JsonLd id="website-schema" data={website} />
      </body>
    </html>
  );
}
