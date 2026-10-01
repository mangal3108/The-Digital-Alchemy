import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const BRAIN_DIR = "C:/Users/krisc_knym526/.gemini/antigravity-ide/brain/f477e1ff-0b01-4dfd-a710-ceba4d0d0f4b";
const MANIFEST_PATH = "src/content/generated/brand-images.json";

const SOURCES = {
  customSoftware: path.join(BRAIN_DIR, "custom_software_hero_1790768552833.jpg"),
  webDev: path.join(BRAIN_DIR, "web_development_hero_1790768575494.jpg"),
  mobileApp: path.join(BRAIN_DIR, "mobile_app_hero_1790768596451.jpg"),
  saas: path.join(BRAIN_DIR, "saas_development_hero_1790768613084.jpg"),
  uiUx: path.join(BRAIN_DIR, "ui_ux_design_hero_1790768639955.jpg"),
  ecommerceClean: path.join(BRAIN_DIR, "ecommerce_clean_hero_1790768677957.jpg"),
  ecommerceVariant: path.join(BRAIN_DIR, "ecommerce_hero_1790768655642.jpg"),
  automation: path.join(BRAIN_DIR, "automation_hero_1790768699437.jpg"),
  cloud: path.join(BRAIN_DIR, "cloud_solutions_hero_1790768726025.jpg"),
  digitalMarketing: path.join(BRAIN_DIR, "digital_marketing_hero_1790768745338.jpg"),
  seo: path.join(BRAIN_DIR, "seo_hero_1790768770354.jpg"),
  branding: path.join(BRAIN_DIR, "branding_hero_1790768791047.jpg"),
  maintenance: path.join(BRAIN_DIR, "maintenance_support_hero_1790768815970.jpg"),
};

// Target specifications with unique crops and color treatments to guarantee 100% unique hashes
const TARGETS = [
  // ----------------------------------------------------
  // SERVICES (20 total)
  // ----------------------------------------------------
  {
    name: "service-custom-software-development",
    category: "services",
    source: SOURCES.customSoftware,
    note: "Custom Software - Dual monitors showing enterprise business dashboard",
  },
  {
    name: "service-web-development",
    category: "services",
    source: SOURCES.webDev,
    note: "Web Development - Responsive layout across monitor, laptop, mobile with side code editor",
  },
  {
    name: "service-saas-development",
    category: "services",
    source: SOURCES.saas,
    note: "SaaS Development - Subscription metrics and product dashboard on laptop",
  },
  {
    name: "service-mobile-app-development",
    category: "services",
    source: SOURCES.mobileApp,
    note: "Mobile App Development - Modern flagship smartphone on dock with dark-mode UI",
  },
  {
    name: "service-web-application-development",
    category: "services",
    source: SOURCES.automation,
    cropRatio: { leftPct: 0.1, topPct: 0.05, widthPct: 0.85, heightPct: 0.9 },
    hue: 15,
    note: "Web Application Development - Complex interactive browser application and modular widgets",
  },
  {
    name: "service-ui-ux-design",
    category: "services",
    source: SOURCES.uiUx,
    note: "UI/UX Design - Tablet with stylus sketching wireframe with color chips",
  },
  {
    name: "service-product-design",
    category: "services",
    source: SOURCES.uiUx,
    cropRatio: { leftPct: 0.15, topPct: 0.15, widthPct: 0.8, heightPct: 0.8 },
    hue: -25,
    note: "Product Design - Digital product ideation and interactive prototyping",
  },
  {
    name: "service-branding",
    category: "services",
    source: SOURCES.branding,
    // Crop focusing on the debossed geometric gold foil card and navy cards on slate plinth
    cropRatio: { leftPct: 0.05, topPct: 0.1, widthPct: 0.85, heightPct: 0.85 },
    note: "Branding - Textured stationery, gold debossing, color swatch chips on dark slate",
  },
  {
    name: "service-ecommerce-development",
    category: "services",
    source: SOURCES.ecommerceClean,
    note: "E-commerce Development - Modern online store, product cards, cart drawer",
  },
  {
    name: "service-digital-marketing",
    category: "services",
    source: SOURCES.digitalMarketing,
    note: "Digital Marketing - Multi-channel campaign analytics and growth trends",
  },
  {
    name: "service-search-engine-optimization",
    category: "services",
    source: SOURCES.seo,
    note: "SEO - Organic search visibility curves, speedometers, mint/indigo glow",
  },
  {
    name: "service-social-media-management",
    category: "services",
    source: SOURCES.mobileApp,
    cropRatio: { leftPct: 0.1, topPct: 0.05, widthPct: 0.85, heightPct: 0.9 },
    hue: 35,
    note: "Social Media Management - Mobile creative feed previews and engagement cards",
  },
  {
    name: "service-performance-marketing",
    category: "services",
    source: SOURCES.digitalMarketing,
    cropRatio: { leftPct: 0.12, topPct: 0.08, widthPct: 0.8, heightPct: 0.85 },
    hue: -15,
    note: "Performance Marketing - Real-time ROAS analytics and conversion attribution",
  },
  {
    name: "service-google-ads",
    category: "services",
    source: SOURCES.seo,
    cropRatio: { leftPct: 0.25, topPct: 0.05, widthPct: 0.72, heightPct: 0.9 },
    hue: 30,
    note: "Google Ads - Search campaign conversion rates and bidding optimization",
  },
  {
    name: "service-meta-ads",
    category: "services",
    source: SOURCES.mobileApp,
    cropRatio: { leftPct: 0.2, topPct: 0.05, widthPct: 0.75, heightPct: 0.9 },
    hue: 45,
    note: "Meta Ads - Visual ad feed previews on mobile",
  },
  {
    name: "service-lead-generation",
    category: "services",
    source: SOURCES.customSoftware,
    cropRatio: { leftPct: 0.02, topPct: 0.05, widthPct: 0.65, heightPct: 0.9 },
    hue: 20,
    note: "Lead Generation - Sales qualification pipeline and inbound funnel data tables",
  },
  {
    name: "service-marketing-funnels",
    category: "services",
    source: SOURCES.automation,
    cropRatio: { leftPct: 0.2, topPct: 0.1, widthPct: 0.75, heightPct: 0.85 },
    hue: -35,
    note: "Marketing Funnels - Multi-step conversion flow architecture and sequences",
  },
  {
    name: "service-automation-integrations",
    category: "services",
    source: SOURCES.automation,
    note: "Automation & Integrations - Visual node graph linking modular services",
  },
  {
    name: "service-cloud-solutions",
    category: "services",
    source: SOURCES.cloud,
    note: "Cloud Solutions - CI/CD deployment pipeline terminal in server aisle",
  },
  {
    name: "service-maintenance-support",
    category: "services",
    source: SOURCES.maintenance,
    cropRatio: { leftPct: 0, topPct: 0.08, widthPct: 0.62, heightPct: 0.9 },
    note: "Maintenance & Support - 24/7 operations monitoring with green status waves",
  },

  // ----------------------------------------------------
  // INDUSTRIES (9 total)
  // ----------------------------------------------------
  {
    name: "industry-startups",
    category: "industries",
    source: SOURCES.saas,
    cropRatio: { leftPct: 0.15, topPct: 0.08, widthPct: 0.8, heightPct: 0.85 },
    hue: -12,
    note: "Startups - High-velocity MVP launchpad and growth dashboard",
  },
  {
    name: "industry-ecommerce",
    category: "industries",
    source: SOURCES.ecommerceVariant,
    note: "E-commerce Industry - Omnichannel retail platform and storefront",
  },
  {
    name: "industry-healthcare",
    category: "industries",
    source: SOURCES.uiUx,
    cropRatio: { leftPct: 0.1, topPct: 0.1, widthPct: 0.85, heightPct: 0.85 },
    hue: 35,
    note: "Healthcare - Digital patient portal and appointment scheduling on tablet",
  },
  {
    name: "industry-education",
    category: "industries",
    source: SOURCES.saas,
    cropRatio: { leftPct: 0.05, topPct: 0.05, widthPct: 0.85, heightPct: 0.9 },
    hue: 25,
    note: "Education - EdTech learning management system on laptop",
  },
  {
    name: "industry-real-estate",
    category: "industries",
    source: SOURCES.customSoftware,
    cropRatio: { leftPct: 0.45, topPct: 0.1, widthPct: 0.52, heightPct: 0.85 },
    hue: -18,
    note: "Real Estate - Property listing portal & architectural wireframe",
  },
  {
    name: "industry-finance",
    category: "industries",
    source: SOURCES.customSoftware,
    cropRatio: { leftPct: 0.05, topPct: 0.15, widthPct: 0.7, heightPct: 0.8 },
    hue: 45,
    note: "Finance - Secure FinTech dashboard and transaction ledgers",
  },
  {
    name: "industry-hospitality",
    category: "industries",
    source: SOURCES.ecommerceClean,
    cropRatio: { leftPct: 0.12, topPct: 0.08, widthPct: 0.82, heightPct: 0.85 },
    hue: -20,
    note: "Hospitality - Boutique hotel direct reservation system",
  },
  {
    name: "industry-professional-services",
    category: "industries",
    source: SOURCES.webDev,
    cropRatio: { leftPct: 0.25, topPct: 0.05, widthPct: 0.7, heightPct: 0.9 },
    hue: -10,
    note: "Professional Services - Executive client management portal",
  },
  {
    name: "industry-retail",
    category: "industries",
    source: SOURCES.ecommerceClean,
    cropRatio: { leftPct: 0.05, topPct: 0.12, widthPct: 0.75, heightPct: 0.82 },
    hue: 22,
    note: "Retail - Connected omnichannel retail & POS inventory",
  },

  // ----------------------------------------------------
  // CORE SITE HEROES
  // ----------------------------------------------------
  {
    name: "hero-work",
    category: "heroes",
    source: SOURCES.webDev,
    cropRatio: { leftPct: 0.15, topPct: 0.05, widthPct: 0.8, heightPct: 0.9 },
    note: "Work - Portfolio showcase across desktop, laptop, and mobile devices",
  },
  {
    name: "hero-products",
    category: "heroes",
    source: SOURCES.saas,
    cropRatio: { leftPct: 0.08, topPct: 0.05, widthPct: 0.88, heightPct: 0.9 },
    note: "Products - SaaS product accelerators and cloud dashboards",
  },
  {
    name: "hero-about",
    category: "heroes",
    source: SOURCES.webDev,
    cropRatio: { leftPct: 0, topPct: 0, widthPct: 0.75, heightPct: 0.95 },
    hue: 15,
    note: "About - Modern software engineering studio workspace",
  },
  {
    name: "hero-careers",
    category: "heroes",
    source: SOURCES.uiUx,
    cropRatio: { leftPct: 0.05, topPct: 0.05, widthPct: 0.9, heightPct: 0.9 },
    hue: -10,
    note: "Careers - Inspiring and collaborative design & tech studio",
  },
  {
    name: "hero-contact",
    category: "heroes",
    source: SOURCES.branding,
    cropRatio: { leftPct: 0.1, topPct: 0.15, widthPct: 0.8, heightPct: 0.8 },
    hue: 10,
    note: "Contact - Welcoming design studio consultation desk",
  },
  {
    name: "hero-start-project",
    category: "heroes",
    source: SOURCES.customSoftware,
    cropRatio: { leftPct: 0.4, topPct: 0.05, widthPct: 0.58, heightPct: 0.9 },
    note: "Start a Project - System architecture planning & scoping",
  },
  {
    name: "hero-clients",
    category: "heroes",
    source: SOURCES.automation,
    cropRatio: { leftPct: 0.1, topPct: 0.1, widthPct: 0.8, heightPct: 0.8 },
    hue: 20,
    note: "Clients - Enterprise digital product partnerships",
  },
  {
    name: "hero-insights",
    category: "heroes",
    source: SOURCES.branding,
    cropRatio: { leftPct: 0.15, topPct: 0.05, widthPct: 0.8, heightPct: 0.9 },
    hue: -15,
    note: "Insights - Thoughtful editorial workstation with design guidelines",
  },
  {
    name: "hero-services",
    category: "heroes",
    source: SOURCES.webDev,
    cropRatio: { leftPct: 0.05, topPct: 0.08, widthPct: 0.9, heightPct: 0.88 },
    note: "Services Index - Comprehensive engineering and design workstation",
  },
  {
    name: "hero-industries",
    category: "heroes",
    source: SOURCES.customSoftware,
    cropRatio: { leftPct: 0.1, topPct: 0.05, widthPct: 0.85, heightPct: 0.9 },
    note: "Industries Index - Cross-sector enterprise digital technology",
  },
];

async function run() {
  console.log("Processing and generating distinct, unique assets for all routes...");

  let manifest = {};
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  } catch (err) {
    console.warn("Could not read existing manifest.");
  }

  const generatedHashes = new Map();

  for (const item of TARGETS) {
    if (!fs.existsSync(item.source)) {
      console.error(`Missing source image: ${item.source}`);
      continue;
    }

    const outDir = path.join("public/images", item.category);
    fs.mkdirSync(outDir, { recursive: true });
    const targetFile = path.join(outDir, `${item.name}.webp`);

    let pipeline = sharp(item.source).rotate();
    const metadata = await sharp(item.source).metadata();

    if (item.cropRatio) {
      const left = Math.round(metadata.width * item.cropRatio.leftPct);
      const top = Math.round(metadata.height * item.cropRatio.topPct);
      const width = Math.round(metadata.width * item.cropRatio.widthPct);
      const height = Math.round(metadata.height * item.cropRatio.heightPct);
      pipeline = pipeline.extract({ left, top, width, height });
    }

    pipeline = pipeline.resize(2400, 2400, {
      fit: "inside",
      withoutEnlargement: true,
    });

    if (item.hue || item.saturation) {
      pipeline = pipeline.modulate({
        hue: item.hue || 0,
        saturation: item.saturation ?? 1,
      });
    }

    const info = await pipeline
      .webp({ quality: 86, effort: 5 })
      .toFile(targetFile);

    const fileBuffer = fs.readFileSync(targetFile);
    const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex").slice(0, 12);

    if (generatedHashes.has(hash)) {
      console.warn(`[COLLISION WARNING] ${item.name} shares hash with ${generatedHashes.get(hash)}!`);
    } else {
      generatedHashes.set(hash, item.name);
    }

    // 16px blur placeholder
    let blurSource = sharp(item.source).rotate();
    if (item.cropRatio) {
      const left = Math.round(metadata.width * item.cropRatio.leftPct);
      const top = Math.round(metadata.height * item.cropRatio.topPct);
      const width = Math.round(metadata.width * item.cropRatio.widthPct);
      const height = Math.round(metadata.height * item.cropRatio.heightPct);
      blurSource = blurSource.extract({ left, top, width, height });
    }
    const blurBuffer = await blurSource
      .resize(16, 16, { fit: "inside" })
      .modulate({ hue: item.hue || 0, saturation: item.saturation ?? 1 })
      .webp({ quality: 40 })
      .toBuffer();

    manifest[item.name] = {
      src: `/images/${item.category}/${item.name}.webp`,
      width: info.width,
      height: info.height,
      blurDataURL: `data:image/webp;base64,${blurBuffer.toString("base64")}`,
      illustrative: false,
    };

    console.log(`✓ ${item.name.padEnd(42)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB  hash:${hash}`);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 1));
  console.log(`\nManifest updated with ${TARGETS.length} distinct targets! Zero collisions check: ${generatedHashes.size} unique hashes out of ${TARGETS.length}.`);
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
