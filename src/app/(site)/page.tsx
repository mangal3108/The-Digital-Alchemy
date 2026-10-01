import type { Metadata } from "next";

import { Hero } from "@/components/sections/hero";
import { BrandLogos } from "@/components/ui/brand-logos";
import { ServicesShowcase } from "@/components/sections/services-showcase";
import { ServicePickerSection } from "@/components/sections/service-picker-section";
import { ProcessNarrative } from "@/components/sections/process-narrative";
import { HomeProof } from "@/components/sections/home-proof";
import { WhyUs } from "@/components/sections/why-us";

import { buildMetadata, localBusinessSchema } from "@/lib/seo";
import { JsonLd } from "@/components/ui/json-ld";
import { getSiteSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return buildMetadata({
    title: settings.defaultMetaTitle,
    description: settings.defaultMetaDescription,
    path: "/",
  });
}

/**
 * Homepage, in the order the brief sets:
 *
 *   1. Hero: headline, one line on who it is for, two buttons
 *   2. What we do: the six service groups
 *   3. Not sure what you need? (the helper)
 *   4. How we work: one section, four steps (the only dark band)
 *   5. Proof: real clients and testimonials only; absent when there are none
 *   6. Why us: three points
 *   7. Final call to action: the footer's closing band (button, WhatsApp,
 *      phone), shared by every page
 *
 * Moved off the homepage, not deleted: the technology section is on /about,
 * the countries and working hours are on /locations, products on /products,
 * articles on /insights, and company figures on /about.
 */
export default async function HomePage() {
  const localBusiness = await localBusinessSchema();

  return (
    <>
      <Hero />
      <section className="border-y border-hairline bg-surface/50 py-6 sm:py-7">
        <div className="container-page">
          <BrandLogos
            slugs={[
              "google",
              "meta",
              "whatsapp",
              "shopify",
              "wordpress",
              "aws",
              "react",
              "nextjs",
              "figma",
              "stripe",
              "razorpay",
            ]}
            title="Technologies & platforms we work with"
            layout="strip"
            size="md"
          />
        </div>
      </section>
      <ServicesShowcase />
      <ServicePickerSection className="border-t border-hairline bg-surface" />
      <ProcessNarrative />
      <div data-accent="violet">
        <HomeProof />
      </div>
      <WhyUs />

      <JsonLd id="local-business-schema" data={localBusiness} />
    </>
  );
}
