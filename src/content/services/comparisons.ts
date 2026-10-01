/**
 * "Which one do I need?" — how each service differs from its closest siblings.
 *
 * Visitors do not know the difference between a web application and custom
 * software, or between SEO and Google Ads, and they should not have to. Each
 * service page shows exactly one of these boxes (see `showOn`), comparing it
 * with the services it is most often confused with.
 *
 * Every row says who it is for in plain words, with one everyday example. The
 * examples are illustrations of the kind of work, not client stories — the
 * page labels them "For example".
 */

export interface ComparisonRow {
  slug: string;
  /** Finishes the sentence "Choose this if…". */
  chooseIf: string;
  example: string;
}

export interface ComparisonSet {
  id: string;
  /** The question, as a visitor would ask it. */
  title: string;
  rows: ComparisonRow[];
  /** Service pages that display this box. */
  showOn: string[];
}

export const comparisonSets: ComparisonSet[] = [
  {
    id: "build",
    title: "Website, app or software: which do I need?",
    showOn: [
      "web-development",
      "ecommerce-development",
      "web-application-development",
      "custom-software-development",
      "saas-development",
      "mobile-app-development",
    ],
    rows: [
      {
        slug: "web-development",
        chooseIf: "you want people to find your business online, see what you offer and contact you.",
        example: "A clinic website with its services, doctor profiles and an appointment form.",
      },
      {
        slug: "ecommerce-development",
        chooseIf: "you want to sell products online and take payments.",
        example: "A clothing brand's online store, with UPI and card payments and delivery tracking.",
      },
      {
        slug: "web-application-development",
        chooseIf: "your customers or staff need to log in to do something, like book, track or manage.",
        example: "A coaching institute portal where students log in to see classes, fees and results.",
      },
      {
        slug: "custom-software-development",
        chooseIf: "you need a tool to run your own business, like billing, stock, staff or customer records.",
        example: "Billing and stock software built around how your shop actually works.",
      },
      {
        slug: "saas-development",
        chooseIf: "you want to build software that other businesses sign up for and pay for every month.",
        example: "A booking app that many salons pay a monthly fee to use.",
      },
      {
        slug: "mobile-app-development",
        chooseIf: "your customers use you often and would install an app on their phone.",
        example: "A restaurant's ordering app with saved addresses and order history.",
      },
    ],
  },
  {
    id: "paid-ads",
    title: "Performance marketing, Google Ads or Meta Ads: which do I need?",
    showOn: ["performance-marketing", "google-ads", "meta-ads"],
    rows: [
      {
        slug: "performance-marketing",
        chooseIf: "you want ads on more than one platform, planned together and measured against real enquiries and sales.",
        example: "A real estate firm running Google, Facebook and Instagram ads from one plan and one report.",
      },
      {
        slug: "google-ads",
        chooseIf: "people already search on Google for what you sell, and you want to show up when they do.",
        example: "An AC repair service appearing when someone searches “AC repair near me”.",
      },
      {
        slug: "meta-ads",
        chooseIf: "people do not search for you yet, but would buy if they saw you on Instagram or Facebook.",
        example: "A home bakery showing its cakes to people nearby on Instagram.",
      },
    ],
  },
  {
    id: "seo-or-ads",
    title: "SEO or Google Ads: which do I need?",
    showOn: ["search-engine-optimization"],
    rows: [
      {
        slug: "search-engine-optimization",
        chooseIf: "you want to show up on Google for free over the long run, and can wait a few months for results.",
        example: "A CA firm's pages rising on Google for “GST registration in Delhi”.",
      },
      {
        slug: "google-ads",
        chooseIf: "you want enquiries from Google soon, and are happy to pay for each click.",
        example: "A dental clinic's ad at the top of “dentist near me” searches while the ad runs.",
      },
    ],
  },
  {
    id: "social-or-ads",
    title: "Social media management or Meta Ads: which do I need?",
    showOn: ["social-media-management"],
    rows: [
      {
        slug: "social-media-management",
        chooseIf: "you want regular posts, reels and replies that keep your followers interested.",
        example: "A café posting its new dishes and replying to comments every week.",
      },
      {
        slug: "meta-ads",
        chooseIf: "you want to pay to show your posts to new people who do not follow you yet.",
        example: "The same café paying to show its weekend offer to people who live nearby.",
      },
    ],
  },
  {
    id: "leads-or-funnels",
    title: "Lead generation or marketing funnels: which do I need?",
    showOn: ["lead-generation", "marketing-funnels"],
    rows: [
      {
        slug: "lead-generation",
        chooseIf: "you need more enquiries coming in, week after week.",
        example: "A real estate agency getting a steady flow of calls and forms from people looking to buy.",
      },
      {
        slug: "marketing-funnels",
        chooseIf: "you get visitors or enquiries, but too few of them end up buying.",
        example: "An online course: ad, then a free class, then WhatsApp reminders, then the payment page.",
      },
    ],
  },
  {
    id: "growth-overview",
    title: "Which kind of marketing do I need?",
    showOn: ["digital-marketing"],
    rows: [
      {
        slug: "digital-marketing",
        chooseIf: "you want one team to plan and run all of your online marketing together.",
        example: "SEO, ads and social media for a clinic, planned together, with one monthly report.",
      },
      {
        slug: "search-engine-optimization",
        chooseIf: "you want to show up on Google for free, and can build up over a few months.",
        example: "A skin clinic appearing when people search “skin doctor in Dwarka”.",
      },
      {
        slug: "performance-marketing",
        chooseIf: "you want paid ads that bring enquiries soon, with every rupee tracked.",
        example: "Google and Instagram ads for a new showroom, measured by calls and visits.",
      },
      {
        slug: "google-ads",
        chooseIf: "you want to appear at the top of Google when people search for what you sell.",
        example: "A dental clinic's ad on “dentist near me” searches.",
      },
      {
        slug: "meta-ads",
        chooseIf: "you want to reach new people on Instagram and Facebook who are not searching for you yet.",
        example: "A home bakery's cakes shown to people who live nearby.",
      },
      {
        slug: "social-media-management",
        chooseIf: "you want your Instagram, Facebook and LinkedIn run for you.",
        example: "Weekly posts and reels for a restaurant.",
      },
      {
        slug: "lead-generation",
        chooseIf: "you need a steady flow of enquiries.",
        example: "Regular calls and form fills for a coaching institute.",
      },
      {
        slug: "marketing-funnels",
        chooseIf: "people show interest, but not enough of them buy.",
        example: "WhatsApp follow-ups sent automatically after someone downloads a brochure.",
      },
    ],
  },
  {
    id: "automate-or-build",
    title: "Automation or custom software: which do I need?",
    showOn: ["automation-integrations"],
    rows: [
      {
        slug: "automation-integrations",
        chooseIf: "you already use apps like Excel, Tally, Zoho or WhatsApp Business. Automation makes them do repetitive work and share information on their own.",
        example: "New website enquiries added to your customer list and answered on WhatsApp automatically.",
      },
      {
        slug: "custom-software-development",
        chooseIf: "what you need does not exist yet, so a new tool has to be built for your business.",
        example: "A job-tracking tool for a repair business, built around its own steps.",
      },
    ],
  },
  {
    id: "design",
    title: "UI/UX design, product design or branding: which do I need?",
    showOn: ["ui-ux-design", "product-design", "branding"],
    rows: [
      {
        slug: "ui-ux-design",
        chooseIf: "you already have an app or website, and people find it confusing or hard to use.",
        example: "Redesigning a checkout that customers keep leaving halfway through.",
      },
      {
        slug: "product-design",
        chooseIf: "you have an idea for a new app, and want to plan it and see every screen before building starts.",
        example: "Planning a clinic booking app screen by screen, before any building begins.",
      },
      {
        slug: "branding",
        chooseIf: "you need a logo, colours and a look that make your business easy to recognise.",
        example: "A new logo, colours and signboard style for a family restaurant.",
      },
    ],
  },
  {
    id: "running",
    title: "Cloud or maintenance: which do I need?",
    showOn: ["cloud-solutions", "maintenance-support"],
    rows: [
      {
        slug: "cloud-solutions",
        chooseIf: "your website or app is slow, goes down, or needs a proper home on good servers.",
        example: "Moving an online store that crashes during sales onto better hosting.",
      },
      {
        slug: "maintenance-support",
        chooseIf: "your website or app works, but needs regular updates, security fixes and someone to call when it breaks.",
        example: "Monthly updates and quick fixes for a school's website.",
      },
    ],
  },
];

/** The one comparison shown on a service page. */
export function getComparisonFor(slug: string): ComparisonSet | undefined {
  return comparisonSets.find((set) => set.showOn.includes(slug));
}
