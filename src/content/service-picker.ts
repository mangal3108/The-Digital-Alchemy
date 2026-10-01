/**
 * "Not sure what you need?" — the questions, and how answers become advice.
 *
 * Kept out of the component so the rules are readable on their own, and so the
 * server can check at build time that every service and industry named here
 * really exists (see `assertPickerTargets`).
 *
 * The advice is a starting point, not a diagnosis, and the copy says so. It
 * never promises results or quotes numbers: it explains *why* a service fits,
 * in terms a business owner would recognise.
 */

export type Goal = "customers" | "website" | "software" | "automation" | "design" | "running";

/**
 * How people usually find a business like this one. "search" businesses are
 * looked for on Google when the need arises (a clinic, a CA, a flat to rent);
 * "discover" businesses are more often found by seeing them (a café, a
 * clothing brand) — which decides whether Google or Instagram comes first.
 */
type FoundBy = "search" | "discover";

export interface BusinessOption {
  value: string;
  label: string;
  /** Slug of the matching industry page, if there is one. */
  industry?: string;
  foundBy: FoundBy;
}

export const BUSINESS_OPTIONS: BusinessOption[] = [
  { value: "clinic", label: "Clinic, hospital or health", industry: "healthcare", foundBy: "search" },
  { value: "food", label: "Restaurant, café or hotel", industry: "hospitality", foundBy: "discover" },
  { value: "shop", label: "Shop or showroom", industry: "retail", foundBy: "search" },
  { value: "brand", label: "Brand selling products online", industry: "ecommerce", foundBy: "discover" },
  { value: "education", label: "Coaching, school or training", industry: "education", foundBy: "search" },
  { value: "property", label: "Real estate", industry: "real-estate", foundBy: "search" },
  { value: "services", label: "Professional services (CA, lawyer, consultant)", industry: "professional-services", foundBy: "search" },
  { value: "finance", label: "Finance or insurance", industry: "finance", foundBy: "search" },
  { value: "startup", label: "Startup building a product", industry: "startups", foundBy: "search" },
  { value: "other", label: "Something else", foundBy: "search" },
];

export const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: "customers", label: "More customers or enquiries" },
  { value: "website", label: "A new or better website" },
  { value: "software", label: "An app or software" },
  { value: "automation", label: "Save time on repetitive work" },
  { value: "design", label: "A better look for my brand or app" },
  { value: "running", label: "Keep my website or app running smoothly" },
];

export interface FollowUp {
  id: string;
  question: string;
  options: { value: string; label: string }[];
}

/** Questions after the goal. "More customers" asks two; every other goal, one. */
export const FOLLOW_UPS: Record<Goal, FollowUp[]> = {
  customers: [
    {
      id: "when",
      question: "How soon do you need new customers?",
      options: [
        { value: "soon", label: "As soon as possible" },
        { value: "later", label: "I can build up over a few months" },
      ],
    },
    {
      id: "site",
      question: "Do you have a website that works well on phones?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No, or I am not sure" },
      ],
    },
  ],
  website: [
    {
      id: "sell",
      question: "Do you want to sell products online and take payments?",
      options: [
        { value: "yes", label: "Yes, I want an online store" },
        { value: "no", label: "No, I want people to contact or visit me" },
      ],
    },
  ],
  software: [
    {
      id: "who",
      question: "Who will use it, and how?",
      options: [
        { value: "phone", label: "My customers, as an app on their phone" },
        { value: "login", label: "My customers or staff, logging in on a website" },
        { value: "internal", label: "My staff, to run the business (billing, stock, records)" },
        { value: "subscription", label: "Other businesses, paying me a monthly fee to use it" },
      ],
    },
  ],
  automation: [
    {
      id: "chore",
      question: "What takes up most of your time?",
      options: [
        { value: "enquiries", label: "Replying to enquiries and following up" },
        { value: "records", label: "Invoices, bills and records" },
        { value: "copying", label: "Copying information from one app to another" },
        { value: "other", label: "Something else" },
      ],
    },
  ],
  design: [
    {
      id: "what",
      question: "What needs work?",
      options: [
        { value: "brand", label: "My logo, colours and brand look" },
        { value: "existing", label: "An app or website I already have" },
        { value: "new", label: "A new app that is not built yet" },
      ],
    },
  ],
  running: [
    {
      id: "worry",
      question: "What worries you most?",
      options: [
        { value: "down", label: "It is slow, or it goes down" },
        { value: "upkeep", label: "Updates, security and fixing bugs" },
        { value: "both", label: "Both" },
      ],
    },
  ],
};

export interface Answers {
  business?: string;
  goal?: Goal;
  [followUp: string]: string | undefined;
}

export interface Recommendation {
  /** One or two service slugs, most important first. */
  services: string[];
  /** Why, in one or two plain sentences. */
  reason: string;
}

/** Turns a complete set of answers into advice. Pure, so it is easy to test. */
export function recommend(answers: Answers): Recommendation {
  const business = BUSINESS_OPTIONS.find((b) => b.value === answers.business);
  const discover = business?.foundBy === "discover";
  const sellsOnline = answers.business === "brand";

  switch (answers.goal) {
    case "customers": {
      const soon = answers.when === "soon";
      const channel = soon
        ? discover ? "meta-ads" : "google-ads"
        : discover ? "social-media-management" : "search-engine-optimization";
      const partner = soon
        ? discover ? "social-media-management" : "search-engine-optimization"
        : discover ? "meta-ads" : "google-ads";

      if (answers.site === "no") {
        return {
          services: [sellsOnline ? "ecommerce-development" : "web-development", channel],
          reason:
            "Ads and Google searches send people to your website, so it needs to work well first — especially on phones. " +
            (soon
              ? "Then paid ads can start bringing people in quickly."
              : "Then we build up how often people find you, month by month."),
        };
      }
      return {
        services: [channel, partner],
        reason: soon
          ? discover
            ? "People often find businesses like yours by seeing them, so paid Facebook and Instagram ads can put you in front of them quickly. Regular posts keep them interested."
            : "People already search on Google for businesses like yours. Ads put you at the top of those searches, and SEO builds free visits over time."
          : discover
            ? "People often find businesses like yours by seeing them. Regular posts and reels build a following that keeps coming back; ads can speed it up later."
            : "People search on Google for businesses like yours. SEO brings free visits that grow over the months; ads can fill the gap if you need enquiries sooner.",
      };
    }

    case "website":
      return answers.sell === "yes"
        ? {
            services: ["ecommerce-development", discover ? "meta-ads" : "search-engine-optimization"],
            reason:
              "You need an online store with payments and delivery. Once it is live, the next job is bringing shoppers to it.",
          }
        : {
            services: ["web-development", "search-engine-optimization"],
            reason:
              "A fast business website that tells people what you do and makes it easy to contact you. SEO helps people find it on Google.",
          };

    case "software": {
      const build = {
        phone: "mobile-app-development",
        login: "web-application-development",
        internal: "custom-software-development",
        subscription: "saas-development",
      }[answers.who ?? "login"] ?? "web-application-development";
      return {
        services: [build, "product-design"],
        reason:
          "That is the kind of software that fits how it will be used. If you are still at the idea stage, planning and designing the screens first saves building the wrong thing.",
      };
    }

    case "automation": {
      const second = answers.chore === "enquiries"
        ? "marketing-funnels"
        : answers.chore === "records"
          ? "custom-software-development"
          : undefined;
      return {
        services: second ? ["automation-integrations", second] : ["automation-integrations"],
        reason:
          answers.chore === "enquiries"
            ? "Enquiries can be answered and followed up automatically, on WhatsApp or email, so nobody waits and no lead is forgotten."
            : answers.chore === "records"
              ? "Invoices and records can be created and updated automatically. If no existing app fits how you work, we build one that does."
              : "Repetitive work can be done by software, and your apps can share information on their own instead of being copied by hand.",
      };
    }

    case "design":
      return answers.what === "brand"
        ? {
            services: ["branding"],
            reason: "A logo, colours and look that make your business easy to recognise everywhere it appears.",
          }
        : answers.what === "new"
          ? {
              services: ["product-design", "ui-ux-design"],
              reason: "We plan the app and design every screen before anything is built, so you can see it and change it cheaply.",
            }
          : {
              services: ["ui-ux-design"],
              reason: "We find where people get stuck in your app or website, and redesign those parts so they are easy to use.",
            };

    case "running":
      return answers.worry === "down"
        ? {
            services: ["cloud-solutions"],
            reason: "Slow pages and outages usually come from how and where a site is hosted. We fix that so it stays fast and online.",
          }
        : answers.worry === "upkeep"
          ? {
              services: ["maintenance-support"],
              reason: "Regular updates and security fixes, and someone to call when something breaks.",
            }
          : {
              services: ["cloud-solutions", "maintenance-support"],
              reason: "Good hosting keeps it fast and online; regular upkeep keeps it safe and working.",
            };

    default:
      return { services: [], reason: "" };
  }
}

/** Every service and industry slug the picker can point at. */
export function pickerTargets(): { services: string[]; industries: string[] } {
  const services = new Set<string>();
  const goals = GOAL_OPTIONS.map((g) => g.value);
  for (const business of BUSINESS_OPTIONS) {
    for (const goal of goals) {
      // Walk every combination of follow-up answers for this goal.
      const combos = FOLLOW_UPS[goal].reduce<Record<string, string>[]>(
        (acc, q) => acc.flatMap((a) => q.options.map((o) => ({ ...a, [q.id]: o.value }))),
        [{}],
      );
      for (const combo of combos) {
        for (const slug of recommend({ business: business.value, goal, ...combo }).services) {
          services.add(slug);
        }
      }
    }
  }
  return {
    services: [...services],
    industries: BUSINESS_OPTIONS.flatMap((b) => (b.industry ? [b.industry] : [])),
  };
}
