import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";

/**
 * robots.txt
 *
 * Non-production origins are disallowed entirely: a staging deployment that
 * gets indexed competes with the real site for the same content, and cleaning
 * that up afterwards is far more work than preventing it.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction =
    process.env.VERCEL_ENV === "production" ||
    (process.env.NODE_ENV === "production" &&
      !/localhost|vercel\.app|staging|preview/.test(siteConfig.url));

  if (!isProduction) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          // Filter and search permutations add no unique content and would
          // otherwise consume crawl budget.
          "/*?category=",
          "/*?utm_",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
