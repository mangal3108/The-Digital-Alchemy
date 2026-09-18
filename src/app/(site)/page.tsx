import type { Metadata } from "next";

import { Hero } from "@/components/sections/hero";
import { ProofStrip } from "@/components/sections/proof-strip";
import { ServicesShowcase } from "@/components/sections/services-showcase";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { FeaturedWork } from "@/components/sections/featured-work";
import { ProductsPreview } from "@/components/sections/products-preview";
import { WhyUs } from "@/components/sections/why-us";
import { ProcessNarrative } from "@/components/sections/process-narrative";
import { TechnologySection } from "@/components/sections/technology";
import { GlobalReach } from "@/components/sections/global-reach";
import { Testimonials } from "@/components/sections/testimonials";
import { Metrics } from "@/components/sections/metrics";
import { InsightsPreview } from "@/components/sections/insights-preview";

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
 * Homepage.
 *
 * The section order is a deliberate light/dark/colour rhythm rather than a
 * list of blocks. Colour arrives in bursts against neutral ground, and the two
 * dark bands are spaced far enough apart to read as punctuation:
 *
 *   white hero → proof → services (one dark band) → dark work →
 *   canvas → white reasons → dark process narrative → markets →
 *   dark technology → metrics → testimonials → insights → CTA (footer)
 *
 * The markets band sits between the process narrative and technology on
 * purpose: both of those run dark, and back to back they stop reading as two
 * sections and become one long dark stretch.
 *
 * Sections that carry an accent declare it here rather than internally, so the
 * rhythm is legible in one place.
 */
export default async function HomePage() {
  const localBusiness = await localBusinessSchema();

  return (
    <>
      <Hero />
      <ProofStrip />
      <ServicesShowcase />
      <FeaturedWork />
      <ProductsPreview />
      <ProductShowcase />
      <WhyUs />
      <ProcessNarrative />
      <div data-accent="blue">
        <GlobalReach />
      </div>
      <TechnologySection />
      <Metrics />
      <div data-accent="violet">
        <Testimonials />
      </div>
      <InsightsPreview />

      <JsonLd id="local-business-schema" data={localBusiness} />
    </>
  );
}
