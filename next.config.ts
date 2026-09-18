import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * Applied to every response. The CSP is intentionally strict about framing and
 * object embedding; `unsafe-inline`/`unsafe-eval` remain for scripts because
 * Next's inline bootstrap and the consented analytics tags require them —
 * tightening that further needs a nonce-based CSP, which is worth doing once
 * the analytics setup is finalised.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://www.clarity.ms",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://connect.facebook.net https://www.clarity.ms",
      "frame-src 'self' https://www.googletagmanager.com",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /**
   * Build output directory, overridable per process.
   *
   * A second Next process — a verification build, a headless capture run —
   * writing into the same `.next` as a running `next dev` corrupts it: the dev
   * server keeps serving HTML while its client chunks are replaced underneath
   * it, so pages render but never hydrate and every button on the page is
   * silently inert. That is very hard to recognise as a build problem, because
   * nothing errors.
   *
   * The verification scripts set NEXT_DIST_DIR so they build somewhere else and
   * leave a running dev server alone.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // The build fails on type or lint errors rather than shipping them.
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

  // Trailing slashes are normalised away so a page is never reachable at two
  // URLs — the redirect table handles the legacy WordPress forms.
  trailingSlash: false,

  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    // Widths matched to the layout's breakpoints rather than the defaults, so
    // we are not generating sizes nothing requests.
    deviceSizes: [375, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      // The previous WordPress site, so migrated media keeps working while
      // assets are moved into the new media library.
      { protocol: "https", hostname: "thedigitalalchemy.co.in" },
    ],
  },

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Uploaded media is content-addressed by name; caching it hard is safe
        // and keeps repeat views off the origin.
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
