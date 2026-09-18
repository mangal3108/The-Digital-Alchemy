import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { getNavFeatured } from "@/lib/content";
import { AnalyticsEvents } from "@/components/site/analytics-events";
import { BhadawarAI } from "@/components/chatbot/bhadawar-ai";

/**
 * Public site chrome. The admin panel deliberately sits outside this group so
 * it never inherits the marketing site's decorative styling or its fonts-heavy
 * hero components.
 *
 * The assistant is mounted here rather than in the root layout for the same
 * reason. In the root it rendered on every route, which put a floating sales
 * chat over the admin toolbar and over the sign-in screen — offering to answer
 * questions about our services to the person administering the site.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const featured = await getNavFeatured();

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar featured={featured} />
      {/* Offset for the fixed header. */}
      <main id="main" className="flex-1 pt-[var(--header-height)]">
        {children}
      </main>
      <Footer />
      <AnalyticsEvents />
      <BhadawarAI />
    </div>
  );
}
