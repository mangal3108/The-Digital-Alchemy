import fs from "node:fs";
import path from "node:path";
import * as simpleIcons from "simple-icons";

const OUT_DIR = path.resolve("public/logos");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Helper to write SVG file
function writeSvg(filename, svgContent) {
  const filePath = path.join(OUT_DIR, filename);
  fs.writeFileSync(filePath, svgContent.trim() + "\n", "utf-8");
  console.log(`Saved: /public/logos/${filename} (${svgContent.length} bytes)`);
}

// Convert SimpleIcon to color SVG and white SVG
function saveSimpleIcon(slug, siObject, customColor = null) {
  const hex = customColor || `#${siObject.hex}`;
  // Standard simple-icons SVG has `<path d="..."/>`
  // We insert fill attribute
  const colorSvg = siObject.svg.replace(
    /<path\s+d=/,
    `<path fill="${hex}" d=`
  );
  writeSvg(`${slug}.svg`, colorSvg);

  // White variant
  const whiteSvg = siObject.svg.replace(
    /<path\s+d=/,
    `<path fill="#FFFFFF" d=`
  );
  writeSvg(`${slug}-white.svg`, whiteSvg);
}

async function fetchSvg(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "TDA-Logo-Fetcher/1.0" }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
  }
  return await res.text();
}

async function run() {
  console.log("=== Building Official Logos ===");

  // 1. Meta suite
  saveSimpleIcon("meta", simpleIcons.siMeta);
  saveSimpleIcon("facebook", simpleIcons.siFacebook);
  saveSimpleIcon("instagram", simpleIcons.siInstagram);
  saveSimpleIcon("whatsapp", simpleIcons.siWhatsapp);

  // 2. Google suite
  // Google: Full-color official 4-color 'G' from Devicon
  try {
    const googleSvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/google/google-original.svg");
    writeSvg("google.svg", googleSvg);
    writeSvg("google-white.svg", simpleIcons.siGoogle.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));
  } catch (e) {
    saveSimpleIcon("google", simpleIcons.siGoogle);
  }

  // Google Ads
  try {
    const googleAdsSvg = await fetchSvg("https://raw.githubusercontent.com/gilbarbara/logos/master/logos/google-ads.svg");
    writeSvg("google-ads.svg", googleAdsSvg);
  } catch (e) {
    saveSimpleIcon("google-ads", simpleIcons.siGoogleads);
  }

  // Google Analytics 4 (GA4)
  try {
    const gaSvg = await fetchSvg("https://raw.githubusercontent.com/gilbarbara/logos/master/logos/google-analytics.svg");
    writeSvg("ga4.svg", gaSvg);
  } catch (e) {
    saveSimpleIcon("ga4", simpleIcons.siGoogleanalytics);
  }

  // Google Search Console
  try {
    const gscSvg = await fetchSvg("https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-search-console.svg");
    writeSvg("search-console.svg", gscSvg);
  } catch (e) {
    saveSimpleIcon("search-console", simpleIcons.siGooglesearchconsole);
  }

  // Google Tag Manager
  try {
    const gtmSvg = await fetchSvg("https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-tag-manager.svg");
    writeSvg("gtm.svg", gtmSvg);
  } catch (e) {
    saveSimpleIcon("gtm", simpleIcons.siGoogletagmanager);
  }

  // Looker Studio
  try {
    const lookerSvg = await fetchSvg("https://raw.githubusercontent.com/gilbarbara/logos/master/logos/looker.svg");
    writeSvg("looker-studio.svg", lookerSvg);
  } catch (e) {
    saveSimpleIcon("looker-studio", simpleIcons.siLooker);
  }

  // YouTube
  try {
    const ytSvg = await fetchSvg("https://raw.githubusercontent.com/gilbarbara/logos/master/logos/youtube-icon.svg");
    writeSvg("youtube.svg", ytSvg);
    writeSvg("youtube-white.svg", simpleIcons.siYoutube.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));
  } catch (e) {
    saveSimpleIcon("youtube", simpleIcons.siYoutube);
  }

  // 3. Social & Messaging
  // LinkedIn
  try {
    const liSvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-original.svg");
    writeSvg("linkedin.svg", liSvg);
    const liPlain = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/linkedin/linkedin-plain.svg");
    const liWhite = liPlain.replace(/<path\s+d=/, '<path fill="#FFFFFF" d=').replace(/fill="#0077b5"/, 'fill="#FFFFFF"');
    writeSvg("linkedin-white.svg", liWhite);
  } catch (e) {
    console.error("LinkedIn fetch failed:", e);
  }

  // X (Twitter)
  saveSimpleIcon("x", simpleIcons.siX, "#FFFFFF");
  writeSvg("x-white.svg", simpleIcons.siX.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));

  // 4. E-commerce & Payments
  // Shopify
  try {
    const shopifySvg = await fetchSvg("https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/shopify.svg");
    writeSvg("shopify.svg", shopifySvg);
  } catch (e) {
    saveSimpleIcon("shopify", simpleIcons.siShopify);
  }
  writeSvg("shopify-mono.svg", simpleIcons.siShopify.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));

  // WooCommerce
  try {
    const wooSvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/woocommerce/woocommerce-original.svg");
    writeSvg("woocommerce.svg", wooSvg);
  } catch (e) {
    saveSimpleIcon("woocommerce", simpleIcons.siWoocommerce);
  }
  writeSvg("woocommerce-white.svg", simpleIcons.siWoocommerce.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));

  // WordPress
  saveSimpleIcon("wordpress", simpleIcons.siWordpress);

  // Stripe
  try {
    const stripeSvg = await fetchSvg("https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/stripe.svg");
    writeSvg("stripe.svg", stripeSvg);
  } catch (e) {
    saveSimpleIcon("stripe", simpleIcons.siStripe);
  }
  writeSvg("stripe-white.svg", simpleIcons.siStripe.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));

  // Razorpay
  saveSimpleIcon("razorpay", simpleIcons.siRazorpay);

  // 5. Cloud & DevOps
  // AWS
  try {
    const awsSvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-original-wordmark.svg");
    writeSvg("aws.svg", awsSvg);
    const awsPlain = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg");
    const awsWhite = awsPlain.replace(/fill="[^"]*"/g, 'fill="#FFFFFF"');
    writeSvg("aws-white.svg", awsWhite);
  } catch (e) {
    console.error("AWS fetch failed:", e);
  }

  // Vercel
  writeSvg("vercel.svg", simpleIcons.siVercel.svg.replace(/<path\s+d=/, '<path fill="#000000" d='));
  writeSvg("vercel-white.svg", simpleIcons.siVercel.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));

  // Docker
  try {
    const dockerSvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg");
    writeSvg("docker.svg", dockerSvg);
  } catch (e) {
    saveSimpleIcon("docker", simpleIcons.siDocker);
  }
  writeSvg("docker-white.svg", simpleIcons.siDocker.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));

  // Sentry
  saveSimpleIcon("sentry", simpleIcons.siSentry);

  // 6. Design
  // Figma
  try {
    const figmaSvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/figma/figma-original.svg");
    writeSvg("figma.svg", figmaSvg);
  } catch (e) {
    saveSimpleIcon("figma", simpleIcons.siFigma);
  }

  // Storybook
  saveSimpleIcon("storybook", simpleIcons.siStorybook);

  // 7. Frontend
  // React
  try {
    const reactSvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg");
    writeSvg("react.svg", reactSvg);
  } catch (e) {
    saveSimpleIcon("react", simpleIcons.siReact);
  }
  writeSvg("react-white.svg", simpleIcons.siReact.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));

  // Next.js
  try {
    const nextSvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg");
    writeSvg("nextjs.svg", nextSvg);
  } catch (e) {
    writeSvg("nextjs.svg", simpleIcons.siNextdotjs.svg.replace(/<path\s+d=/, '<path fill="#000000" d='));
  }
  writeSvg("nextjs-white.svg", simpleIcons.siNextdotjs.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));

  // TypeScript
  try {
    const tsSvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg");
    writeSvg("typescript.svg", tsSvg);
  } catch (e) {
    saveSimpleIcon("typescript", simpleIcons.siTypescript);
  }

  // Tailwind CSS
  try {
    const twSvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg");
    writeSvg("tailwind.svg", twSvg);
  } catch (e) {
    saveSimpleIcon("tailwind", simpleIcons.siTailwindcss);
  }
  writeSvg("tailwind-white.svg", simpleIcons.siTailwindcss.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));

  // 8. Backend & Data
  // Node.js
  try {
    const nodeSvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg");
    writeSvg("nodejs.svg", nodeSvg);
  } catch (e) {
    saveSimpleIcon("nodejs", simpleIcons.siNodedotjs);
  }
  writeSvg("nodejs-white.svg", simpleIcons.siNodedotjs.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));

  // Python
  try {
    const pySvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg");
    writeSvg("python.svg", pySvg);
  } catch (e) {
    saveSimpleIcon("python", simpleIcons.siPython);
  }

  // Prisma
  saveSimpleIcon("prisma", simpleIcons.siPrisma);

  // PostgreSQL
  try {
    const pgSvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg");
    writeSvg("postgresql.svg", pgSvg);
  } catch (e) {
    saveSimpleIcon("postgresql", simpleIcons.siPostgresql);
  }
  writeSvg("postgresql-white.svg", simpleIcons.siPostgresql.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));

  // Redis
  try {
    const redisSvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg");
    writeSvg("redis.svg", redisSvg);
  } catch (e) {
    saveSimpleIcon("redis", simpleIcons.siRedis);
  }
  writeSvg("redis-white.svg", simpleIcons.siRedis.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));

  // 9. Mobile
  // Flutter
  try {
    const flutterSvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/flutter/flutter-original.svg");
    writeSvg("flutter.svg", flutterSvg);
  } catch (e) {
    saveSimpleIcon("flutter", simpleIcons.siFlutter);
  }
  writeSvg("flutter-white.svg", simpleIcons.siFlutter.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));

  // Firebase
  try {
    const fbSvg = await fetchSvg("https://raw.githubusercontent.com/devicons/devicon/master/icons/firebase/firebase-original.svg");
    writeSvg("firebase.svg", fbSvg);
  } catch (e) {
    saveSimpleIcon("firebase", simpleIcons.siFirebase);
  }

  // Apple & Android
  writeSvg("apple.svg", simpleIcons.siApple.svg.replace(/<path\s+d=/, '<path fill="#000000" d='));
  writeSvg("apple-white.svg", simpleIcons.siApple.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));
  saveSimpleIcon("android", simpleIcons.siAndroid);

  // 10. AI & Automation
  // OpenAI
  try {
    const oaiSvg = await fetchSvg("https://cdn.jsdelivr.net/npm/simple-icons@9.21.0/icons/openai.svg");
    writeSvg("openai.svg", oaiSvg.replace(/<path\s+d=/, '<path fill="#00A67E" d='));
    writeSvg("openai-white.svg", oaiSvg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));
  } catch (e) {
    console.error("OpenAI fetch failed:", e);
  }

  // Anthropic
  saveSimpleIcon("anthropic", simpleIcons.siAnthropic);

  // LangChain
  saveSimpleIcon("langchain", simpleIcons.siLangchain);

  // Pinecone
  try {
    const pineconeSvg = await fetchSvg("https://mintcdn.com/pinecone/HsZKO51bNmpAasdT/logo/Pinecone-Full-Logo-Black.svg");
    writeSvg("pinecone.svg", pineconeSvg);
    const pineconeWhite = await fetchSvg("https://mintcdn.com/pinecone/HsZKO51bNmpAasdT/logo/Pinecone-Full-Logo-White.svg");
    writeSvg("pinecone-white.svg", pineconeWhite);
  } catch (e) {
    console.error("Pinecone fetch failed:", e);
  }

  // n8n
  try {
    const n8nSvg = await fetchSvg("https://raw.githubusercontent.com/gilbarbara/logos/master/logos/n8n-icon.svg");
    writeSvg("n8n.svg", n8nSvg);
  } catch (e) {
    saveSimpleIcon("n8n", simpleIcons.siN8n);
  }
  writeSvg("n8n-white.svg", simpleIcons.siN8n.svg.replace(/<path\s+d=/, '<path fill="#FFFFFF" d='));

  // Zapier
  saveSimpleIcon("zapier", simpleIcons.siZapier);

  // Make
  saveSimpleIcon("make", simpleIcons.siMake);

  console.log("=== All logos generated successfully! ===");
}

run().catch((err) => {
  console.error("Error building logos:", err);
  process.exit(1);
});
