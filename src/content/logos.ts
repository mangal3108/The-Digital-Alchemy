export interface BrandLogo {
  slug: string;
  name: string;
  files: {
    color: string;
    white?: string;
    mono?: string;
  };
  allowedVariants: Array<"color" | "white" | "mono">;
  officialSourceUrl: string;
  guidelineUrl: string;
  minimumSize: number; // minimum width/height in px per guidelines
  category?: string;
}

export const brandLogos: BrandLogo[] = [
  // Meta Suite
  {
    slug: "meta",
    name: "Meta",
    files: {
      color: "/logos/meta.svg",
      white: "/logos/meta-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://about.meta.com/brand/resources/",
    guidelineUrl: "https://about.meta.com/brand/resources/meta/company-brand/",
    minimumSize: 24,
    category: "marketing",
  },
  {
    slug: "facebook",
    name: "Facebook",
    files: {
      color: "/logos/facebook.svg",
      white: "/logos/facebook-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://about.meta.com/brand/resources/facebook/logo/",
    guidelineUrl: "https://about.meta.com/brand/resources/facebook/logo/",
    minimumSize: 24,
    category: "marketing",
  },
  {
    slug: "instagram",
    name: "Instagram",
    files: {
      color: "/logos/instagram.svg",
      white: "/logos/instagram-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://about.meta.com/brand/resources/instagram/icons/",
    guidelineUrl: "https://about.meta.com/brand/resources/instagram/icons/",
    minimumSize: 24,
    category: "marketing",
  },
  {
    slug: "whatsapp",
    name: "WhatsApp",
    files: {
      color: "/logos/whatsapp.svg",
      white: "/logos/whatsapp-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://about.meta.com/brand/resources/whatsapp/whatsapp-brand-guidelines/",
    guidelineUrl: "https://about.meta.com/brand/resources/whatsapp/whatsapp-brand-guidelines/",
    minimumSize: 24,
    category: "marketing",
  },
  {
    slug: "meta-ads",
    name: "Meta Ads",
    files: {
      color: "/logos/meta.svg",
      white: "/logos/meta-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://about.meta.com/brand/resources/",
    guidelineUrl: "https://about.meta.com/brand/resources/meta/company-brand/",
    minimumSize: 24,
    category: "marketing",
  },

  // Google Suite
  {
    slug: "google",
    name: "Google",
    files: {
      color: "/logos/google.svg",
      white: "/logos/google-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://about.google/brand-resource-center/",
    guidelineUrl: "https://about.google/brand-resource-center/rules-for-third-parties/",
    minimumSize: 24,
    category: "analytics",
  },
  {
    slug: "google-ads",
    name: "Google Ads",
    files: {
      color: "/logos/google-ads.svg",
    },
    allowedVariants: ["color"],
    officialSourceUrl: "https://about.google/brand-resource-center/products-and-services/",
    guidelineUrl: "https://about.google/brand-resource-center/rules-for-third-parties/",
    minimumSize: 24,
    category: "marketing",
  },
  {
    slug: "ga4",
    name: "Google Analytics 4",
    files: {
      color: "/logos/ga4.svg",
    },
    allowedVariants: ["color"],
    officialSourceUrl: "https://about.google/brand-resource-center/products-and-services/",
    guidelineUrl: "https://about.google/brand-resource-center/rules-for-third-parties/",
    minimumSize: 24,
    category: "analytics",
  },
  {
    slug: "search-console",
    name: "Google Search Console",
    files: {
      color: "/logos/search-console.svg",
    },
    allowedVariants: ["color"],
    officialSourceUrl: "https://about.google/brand-resource-center/products-and-services/",
    guidelineUrl: "https://about.google/brand-resource-center/rules-for-third-parties/",
    minimumSize: 24,
    category: "analytics",
  },
  {
    slug: "gtm",
    name: "Google Tag Manager",
    files: {
      color: "/logos/gtm.svg",
    },
    allowedVariants: ["color"],
    officialSourceUrl: "https://about.google/brand-resource-center/products-and-services/",
    guidelineUrl: "https://about.google/brand-resource-center/rules-for-third-parties/",
    minimumSize: 24,
    category: "analytics",
  },
  {
    slug: "looker-studio",
    name: "Looker Studio",
    files: {
      color: "/logos/looker-studio.svg",
    },
    allowedVariants: ["color"],
    officialSourceUrl: "https://about.google/brand-resource-center/products-and-services/",
    guidelineUrl: "https://about.google/brand-resource-center/rules-for-third-parties/",
    minimumSize: 24,
    category: "analytics",
  },
  {
    slug: "youtube",
    name: "YouTube",
    files: {
      color: "/logos/youtube.svg",
      white: "/logos/youtube-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://brand.youtube/",
    guidelineUrl: "https://brand.youtube/how-to-use/",
    minimumSize: 24,
    category: "marketing",
  },

  // Social Networks
  {
    slug: "linkedin",
    name: "LinkedIn",
    files: {
      color: "/logos/linkedin.svg",
      white: "/logos/linkedin-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://brand.linkedin.com/",
    guidelineUrl: "https://brand.linkedin.com/policies",
    minimumSize: 24,
    category: "marketing",
  },
  {
    slug: "x",
    name: "X",
    files: {
      color: "/logos/x.svg",
      white: "/logos/x-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://about.x.com/en/who-we-are/brand-toolkit",
    guidelineUrl: "https://about.x.com/en/who-we-are/brand-toolkit",
    minimumSize: 20,
    category: "marketing",
  },

  // E-commerce & Payments
  {
    slug: "shopify",
    name: "Shopify",
    files: {
      color: "/logos/shopify.svg",
      mono: "/logos/shopify-mono.svg",
    },
    allowedVariants: ["color", "mono"],
    officialSourceUrl: "https://www.shopify.com/brand-assets",
    guidelineUrl: "https://www.shopify.com/legal/trademark",
    minimumSize: 24,
    category: "cms",
  },
  {
    slug: "woocommerce",
    name: "WooCommerce",
    files: {
      color: "/logos/woocommerce.svg",
      white: "/logos/woocommerce-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://woocommerce.com/press/",
    guidelineUrl: "https://woocommerce.com/trademark-guidelines/",
    minimumSize: 24,
    category: "cms",
  },
  {
    slug: "wordpress",
    name: "WordPress",
    files: {
      color: "/logos/wordpress.svg",
      white: "/logos/wordpress-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://wordpress.foundation/logos/",
    guidelineUrl: "https://wordpress.foundation/trademark-policy/",
    minimumSize: 24,
    category: "cms",
  },
  {
    slug: "stripe",
    name: "Stripe",
    files: {
      color: "/logos/stripe.svg",
      white: "/logos/stripe-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://stripe.com/newsroom/brand-assets",
    guidelineUrl: "https://stripe.com/legal/brand",
    minimumSize: 24,
    category: "marketing",
  },
  {
    slug: "razorpay",
    name: "Razorpay",
    files: {
      color: "/logos/razorpay.svg",
      white: "/logos/razorpay-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://razorpay.com/media-kit/",
    guidelineUrl: "https://razorpay.com/brand-guidelines/",
    minimumSize: 24,
    category: "marketing",
  },

  // Cloud & DevOps
  {
    slug: "aws",
    name: "AWS",
    files: {
      color: "/logos/aws.svg",
      white: "/logos/aws-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://aws.amazon.com/architecture/icons/",
    guidelineUrl: "https://aws.amazon.com/trademark-guidelines/",
    minimumSize: 28,
    category: "cloud",
  },
  {
    slug: "vercel",
    name: "Vercel",
    files: {
      color: "/logos/vercel.svg",
      white: "/logos/vercel-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://vercel.com/design/brands",
    guidelineUrl: "https://vercel.com/legal/trademark-policy",
    minimumSize: 20,
    category: "cloud",
  },
  {
    slug: "docker",
    name: "Docker",
    files: {
      color: "/logos/docker.svg",
      white: "/logos/docker-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://www.docker.com/company/newsroom/media-resources/",
    guidelineUrl: "https://www.docker.com/legal/trademark-guidelines/",
    minimumSize: 24,
    category: "cloud",
  },
  {
    slug: "sentry",
    name: "Sentry",
    files: {
      color: "/logos/sentry.svg",
      white: "/logos/sentry-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://sentry.io/branding/",
    guidelineUrl: "https://sentry.io/legal/trademark/",
    minimumSize: 24,
    category: "cloud",
  },

  // Design
  {
    slug: "figma",
    name: "Figma",
    files: {
      color: "/logos/figma.svg",
    },
    allowedVariants: ["color"],
    officialSourceUrl: "https://www.figma.com/brand-assets/",
    guidelineUrl: "https://www.figma.com/brand-guidelines/",
    minimumSize: 20,
    category: "design",
  },
  {
    slug: "storybook",
    name: "Storybook",
    files: {
      color: "/logos/storybook.svg",
      white: "/logos/storybook-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://storybook.js.org/",
    guidelineUrl: "https://storybook.js.org/",
    minimumSize: 24,
    category: "frontend",
  },

  // Frontend
  {
    slug: "react",
    name: "React",
    files: {
      color: "/logos/react.svg",
      white: "/logos/react-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://simpleicons.org/?q=react",
    guidelineUrl: "https://opensource.fb.com/legal/terms/",
    minimumSize: 24,
    category: "frontend",
  },
  {
    slug: "nextjs",
    name: "Next.js",
    files: {
      color: "/logos/nextjs.svg",
      white: "/logos/nextjs-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://vercel.com/design/brands",
    guidelineUrl: "https://vercel.com/legal/trademark-policy",
    minimumSize: 24,
    category: "frontend",
  },
  {
    slug: "typescript",
    name: "TypeScript",
    files: {
      color: "/logos/typescript.svg",
    },
    allowedVariants: ["color"],
    officialSourceUrl: "https://www.typescriptlang.org/",
    guidelineUrl: "https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks",
    minimumSize: 22,
    category: "frontend",
  },
  {
    slug: "tailwind",
    name: "Tailwind CSS",
    files: {
      color: "/logos/tailwind.svg",
      white: "/logos/tailwind-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://tailwindcss.com/brand",
    guidelineUrl: "https://tailwindcss.com/brand",
    minimumSize: 24,
    category: "frontend",
  },

  // Backend & Databases
  {
    slug: "nodejs",
    name: "Node.js",
    files: {
      color: "/logos/nodejs.svg",
      white: "/logos/nodejs-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://openjsf.org/about/governance/artwork-trademark-policy/",
    guidelineUrl: "https://openjsf.org/about/governance/artwork-trademark-policy/",
    minimumSize: 24,
    category: "backend",
  },
  {
    slug: "python",
    name: "Python",
    files: {
      color: "/logos/python.svg",
    },
    allowedVariants: ["color"],
    officialSourceUrl: "https://www.python.org/community/logos/",
    guidelineUrl: "https://www.python.org/psf/trademarks/",
    minimumSize: 24,
    category: "backend",
  },
  {
    slug: "prisma",
    name: "Prisma",
    files: {
      color: "/logos/prisma.svg",
      white: "/logos/prisma-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://www.prisma.io/press",
    guidelineUrl: "https://www.prisma.io/",
    minimumSize: 22,
    category: "backend",
  },
  {
    slug: "postgresql",
    name: "PostgreSQL",
    files: {
      color: "/logos/postgresql.svg",
      white: "/logos/postgresql-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://wiki.postgresql.org/wiki/Logo",
    guidelineUrl: "https://www.postgresql.org/about/policies/trademarks/",
    minimumSize: 24,
    category: "data",
  },
  {
    slug: "redis",
    name: "Redis",
    files: {
      color: "/logos/redis.svg",
      white: "/logos/redis-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://redis.io/legal/brand/",
    guidelineUrl: "https://redis.io/legal/brand/",
    minimumSize: 24,
    category: "data",
  },

  // Mobile
  {
    slug: "flutter",
    name: "Flutter",
    files: {
      color: "/logos/flutter.svg",
      white: "/logos/flutter-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://flutter.dev/brand",
    guidelineUrl: "https://flutter.dev/brand",
    minimumSize: 24,
    category: "mobile",
  },
  {
    slug: "react-native",
    name: "React Native",
    files: {
      color: "/logos/react.svg",
      white: "/logos/react-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://simpleicons.org/?q=react",
    guidelineUrl: "https://opensource.fb.com/legal/terms/",
    minimumSize: 24,
    category: "mobile",
  },
  {
    slug: "firebase",
    name: "Firebase",
    files: {
      color: "/logos/firebase.svg",
    },
    allowedVariants: ["color"],
    officialSourceUrl: "https://firebase.google.com/brand-guidelines",
    guidelineUrl: "https://about.google/brand-resource-center/rules-for-third-parties/",
    minimumSize: 24,
    category: "mobile",
  },
  {
    slug: "apple",
    name: "Apple iOS",
    files: {
      color: "/logos/apple.svg",
      white: "/logos/apple-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://developer.apple.com/app-store/marketing/guidelines/",
    guidelineUrl: "https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html",
    minimumSize: 20,
    category: "mobile",
  },
  {
    slug: "android",
    name: "Android",
    files: {
      color: "/logos/android.svg",
      white: "/logos/android-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://developer.android.com/distribute/marketing-tools/brand-guidelines",
    guidelineUrl: "https://developer.android.com/distribute/marketing-tools/brand-guidelines",
    minimumSize: 24,
    category: "mobile",
  },

  // AI & Automation
  {
    slug: "openai",
    name: "OpenAI",
    files: {
      color: "/logos/openai.svg",
      white: "/logos/openai-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://openai.com/brand",
    guidelineUrl: "https://openai.com/brand",
    minimumSize: 24,
    category: "ai",
  },
  {
    slug: "anthropic",
    name: "Anthropic",
    files: {
      color: "/logos/anthropic.svg",
      white: "/logos/anthropic-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://simpleicons.org/?q=anthropic",
    guidelineUrl: "https://www.anthropic.com/",
    minimumSize: 20,
    category: "ai",
  },
  {
    slug: "langchain",
    name: "LangChain",
    files: {
      color: "/logos/langchain.svg",
      white: "/logos/langchain-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://simpleicons.org/?q=langchain",
    guidelineUrl: "https://www.langchain.com/",
    minimumSize: 24,
    category: "ai",
  },
  {
    slug: "pinecone",
    name: "Pinecone",
    files: {
      color: "/logos/pinecone.svg",
      white: "/logos/pinecone-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://www.pinecone.io/press/",
    guidelineUrl: "https://www.pinecone.io/",
    minimumSize: 24,
    category: "ai",
  },
  {
    slug: "n8n",
    name: "n8n",
    files: {
      color: "/logos/n8n.svg",
      white: "/logos/n8n-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://n8n.io/press/",
    guidelineUrl: "https://n8n.io/",
    minimumSize: 24,
    category: "ai",
  },
  {
    slug: "zapier",
    name: "Zapier",
    files: {
      color: "/logos/zapier.svg",
      white: "/logos/zapier-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://zapier.com/brand",
    guidelineUrl: "https://zapier.com/brand",
    minimumSize: 24,
    category: "ai",
  },
  {
    slug: "make",
    name: "Make",
    files: {
      color: "/logos/make.svg",
      white: "/logos/make-white.svg",
    },
    allowedVariants: ["color", "white"],
    officialSourceUrl: "https://www.make.com/en/press",
    guidelineUrl: "https://www.make.com/en/press",
    minimumSize: 24,
    category: "ai",
  },
];

const logoBySlug = new Map(brandLogos.map((l) => [l.slug, l]));

export function getLogo(slug: string): BrandLogo | undefined {
  return logoBySlug.get(slug);
}

export function getLogos(slugs: readonly string[]): BrandLogo[] {
  return slugs
    .map((s) => logoBySlug.get(s))
    .filter((l): l is BrandLogo => Boolean(l));
}

export function hasLogo(slug: string): boolean {
  return logoBySlug.has(slug);
}

/** Sector-specific platforms and tools mapped to each industry */
export const INDUSTRY_LOGOS: Record<string, string[]> = {
  startups: ["react", "nextjs", "nodejs", "python", "postgresql", "stripe", "aws", "figma"],
  ecommerce: ["shopify", "woocommerce", "stripe", "razorpay", "meta", "instagram", "google-ads", "ga4"],
  healthcare: ["whatsapp", "google", "search-console", "aws", "postgresql", "sentry"],
  education: ["google", "instagram", "whatsapp", "razorpay", "stripe", "postgresql"],
  "real-estate": ["meta", "facebook", "google-ads", "whatsapp", "ga4", "make"],
  finance: ["postgresql", "redis", "aws", "docker", "stripe", "sentry"],
  hospitality: ["whatsapp", "google-ads", "instagram", "razorpay", "stripe"],
  "professional-services": ["linkedin", "google-ads", "wordpress", "nextjs", "ga4"],
  retail: ["shopify", "whatsapp", "google-ads", "razorpay", "instagram"],
};

