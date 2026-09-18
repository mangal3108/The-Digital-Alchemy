/**
 * Market pages.
 *
 * Hard rules enforced by the shape of this data:
 *  - `type` is either "headquarters" or "client-market". Only India is a
 *    headquarters. Every other page states plainly that we work with clients
 *    there remotely and does not imply a local office.
 *  - Each page carries genuinely market-specific content — real time-zone
 *    overlap, the way contracts and payments tend to work, and what buyers in
 *    that market actually ask about. Swapping a country name into a template
 *    is exactly the thin doorway page this structure is designed to prevent.
 */
export interface Market {
  slug: string;
  /** Country name as used in copy. */
  country: string;
  countryCode: string;
  /** ISO 3166-1 numeric — matches the country geometry the globe renders. */
  isoNumeric: string;
  /** Where the marker sits on the globe. Capital, or the city we work from. */
  coordinates: { lat: number; lon: number };
  type: "headquarters" | "client-market";
  title: string;
  eyebrow: string;
  lede: string;
  metaTitle: string;
  metaDescription: string;
  /** Explicit statement of our relationship to this market. */
  presence: string;
  /** Factual time-zone overlap with New Delhi (IST, UTC+5:30). */
  timezone: {
    label: string;
    overlap: string;
    detail: string;
  };
  /** How working together actually runs for this market. */
  workingModel: { title: string; body: string }[];
  /** Commercial and practical specifics for this market. */
  practicalities: { title: string; body: string }[];
  /** Service slugs most commonly requested from this market. */
  services: string[];
  faqs: { question: string; answer: string }[];
}

export const markets: Market[] = [
  {
    slug: "india",
    country: "India",
    countryCode: "IN",
    isoNumeric: "356",
    coordinates: { lat: 28.61, lon: 77.21 },
    type: "headquarters",
    title: "A digital product and growth studio in New Delhi.",
    eyebrow: "India",
    lede: "This is where the studio is. We work with Indian businesses on the full range — websites and software through to the marketing that brings them customers — and we can meet in person when it helps.",
    metaTitle: "Digital Product Studio in New Delhi | The Digital Alchemy",
    metaDescription:
      "A digital product, software and growth studio in Uttam Nagar, New Delhi — SaaS, custom software, websites, apps, SEO and marketing for Indian businesses.",
    presence:
      "Based in Uttam Nagar, New Delhi. This is our only office; every other market we serve, we serve remotely.",
    timezone: {
      label: "IST (UTC+5:30)",
      overlap: "Full working-day overlap",
      detail:
        "We are in the same time zone, so meetings, reviews and urgent questions happen the same day rather than the next one.",
    },
    workingModel: [
      {
        title: "In-person where it earns its place",
        body: "Discovery workshops and major reviews can happen face to face in Delhi NCR. Most day-to-day work still runs remotely, because that is genuinely more efficient for both sides.",
      },
      {
        title: "Same-day responsiveness",
        body: "Shared working hours mean questions get answered within the day and decisions do not wait overnight for a reply.",
      },
      {
        title: "Local payment and contracting",
        body: "Invoicing in rupees, GST handled correctly, and payment through standard domestic methods including UPI and bank transfer.",
      },
    ],
    practicalities: [
      {
        title: "Payments built for Indian customers",
        body: "UPI, cards, net banking and wallets through domestic gateways. Checkout that omits UPI loses a substantial share of Indian consumer transactions.",
      },
      {
        title: "Performance on real Indian networks",
        body: "We test on mid-range Android devices and constrained connections, not on a fast desktop. That is what most of your traffic actually looks like.",
      },
      {
        title: "Local search visibility",
        body: "Google Business Profile, consistent listings and location content — the work that decides whether nearby customers find you at all.",
      },
      {
        title: "Multilingual where it matters",
        body: "Where your audience is not primarily English-reading, we plan for that in the content model rather than bolting on a translation plugin later.",
      },
    ],
    services: [
      "web-development",
      "saas-development",
      "digital-marketing",
      "social-media-management",
      "search-engine-optimization",
      "ecommerce-development",
    ],
    faqs: [
      {
        question: "Can we meet in person?",
        answer:
          "Yes, for clients in and around Delhi NCR. We usually suggest meeting for discovery and for major milestone reviews, and running everything else remotely, which keeps the project moving faster.",
      },
      {
        question: "Do you work with businesses outside Delhi?",
        answer:
          "Yes — remote work across India is routine for us. The only difference is that in-person sessions become video calls.",
      },
      {
        question: "How does GST and invoicing work?",
        answer:
          "We invoice in rupees with GST applied as required. Payment terms are agreed in the contract, typically against milestones for project work and monthly in advance for retainers.",
      },
    ],
  },

  {
    slug: "united-states",
    country: "United States",
    countryCode: "US",
    isoNumeric: "840",
    coordinates: { lat: 38.9, lon: -77.04 },
    type: "client-market",
    title: "A remote product and engineering partner for US businesses.",
    eyebrow: "United States",
    lede: "We work with US companies as a remote design and engineering team. No US office, no local sales presence — just a studio in New Delhi that has structured its week so American clients are not waiting a day for every answer.",
    metaTitle: "SaaS & Software Development for US Businesses | The Digital Alchemy",
    metaDescription:
      "Remote SaaS, software, web and app development for United States businesses. A New Delhi studio working with US companies on product design, engineering and digital growth.",
    presence:
      "We do not have a US office. We are based in New Delhi and work with US clients remotely, with an overlap window held open specifically for them.",
    timezone: {
      label: "IST is 9.5–13 hours ahead of the US",
      overlap: "Late afternoon US / early morning IST, and evening IST / morning ET",
      detail:
        "Our evening overlaps the US East Coast morning: roughly 6:30pm–9:30pm in Delhi is 8:00am–11:00am in New York. For the West Coast the overlap sits later in our evening. We hold that window for calls rather than asking you to take meetings at unreasonable hours.",
    },
    workingModel: [
      {
        title: "A held overlap window",
        body: "A fixed block each working day when our team is available for US calls, so scheduling does not become a negotiation every week.",
      },
      {
        title: "Written first",
        body: "Decisions, specifications and progress documented in writing rather than relayed verbally. It means the time difference works for you — work continues while you sleep, and it is legible when you wake up.",
      },
      {
        title: "Environments you can check any time",
        body: "A staging URL you can open whenever you want. Progress is something you inspect directly rather than something you receive a summary of.",
      },
      {
        title: "One point of contact",
        body: "A named lead who knows the whole engagement, so you are not re-explaining context to whoever is available.",
      },
    ],
    practicalities: [
      {
        title: "Contracting and IP",
        body: "Written agreements covering scope, intellectual property assignment and confidentiality. Code, designs and infrastructure accounts are yours outright.",
      },
      {
        title: "Invoicing in USD",
        body: "Invoiced in US dollars, paid by international transfer. Fees and payment schedule are fixed in the contract so exchange movement is not your problem mid-project.",
      },
      {
        title: "Data location",
        body: "Where your data must stay in US regions, we deploy to US regions. That is a decision we take explicitly at the start rather than by default.",
      },
      {
        title: "Realistic cost expectations",
        body: "Our rates are lower than a comparable US studio. We would rather be chosen for the quality of the work than positioned purely on price, so we scope openly and let the plan speak for itself.",
      },
    ],
    services: [
      "saas-development",
      "custom-software-development",
      "web-application-development",
      "mobile-app-development",
      "product-design",
      "ui-ux-design",
    ],
    faqs: [
      {
        question: "Do you have a US office?",
        answer:
          "No. We are based in New Delhi and work with US clients remotely. We would rather say that plainly than imply a local presence we do not have.",
      },
      {
        question: "How do we handle the time difference?",
        answer:
          "With a held overlap window for calls — our evening, your morning on the East Coast — and by working in writing so progress does not depend on being in a meeting together. In practice, many clients find the offset useful: work happens overnight and is ready for review when they start.",
      },
      {
        question: "Who owns the intellectual property?",
        answer:
          "You do. IP assignment is written into the contract, and repositories, cloud accounts and design files are in your company's name from the beginning.",
      },
      {
        question: "How do we know the work will be good?",
        answer:
          "Start small. A paid discovery phase or a defined first milestone gives you a real basis to judge quality, communication and pace before committing to a larger build. We would rather earn a bigger engagement than ask for one on trust.",
      },
    ],
  },

  {
    slug: "australia",
    country: "Australia",
    countryCode: "AU",
    isoNumeric: "036",
    coordinates: { lat: -33.87, lon: 151.21 },
    type: "client-market",
    title: "A development partner for Australian businesses, in a workable time zone.",
    eyebrow: "Australia",
    lede: "Australia is one of the easier markets to work with from India. Our morning is your afternoon, so a same-day conversation is normal rather than something to be arranged around.",
    metaTitle: "Software & Web Development for Australia | The Digital Alchemy",
    metaDescription:
      "Remote web, SaaS, software and app development for Australian businesses. A New Delhi studio with a substantial daily time-zone overlap with Australian working hours.",
    presence:
      "We do not have an Australian office. We are based in New Delhi and work with Australian clients remotely.",
    timezone: {
      label: "IST is 4.5–5.5 hours behind AEST/AEDT",
      overlap: "Most of the Australian afternoon",
      detail:
        "Our working morning covers a large part of your afternoon — around 9:30am in Delhi is roughly 2:00pm in Sydney. That is a genuine shared window every day, not a narrow edge of it.",
    },
    workingModel: [
      {
        title: "Same-day, not next-day",
        body: "A question raised in your morning is usually answered before you finish for the day. The overlap is wide enough that work rarely waits a full cycle.",
      },
      {
        title: "Calls at sensible hours for both sides",
        body: "Your afternoon is our morning. Nobody has to take a call at eleven at night to keep the project moving.",
      },
      {
        title: "Regular review cadence",
        body: "A fixed weekly review at a time that suits your week, with written updates in between so nothing depends on attendance.",
      },
    ],
    practicalities: [
      {
        title: "Contracting and invoicing",
        body: "Written agreements with IP assignment, invoiced in Australian dollars and paid by international transfer.",
      },
      {
        title: "Accessibility expectations",
        body: "Australian organisations, particularly in the public and education sectors, often work to WCAG conformance. We build to WCAG 2.2 AA as standard, so that requirement is already met.",
      },
      {
        title: "Payments and local methods",
        body: "For consumer products we cover the payment methods Australian customers expect, including local card handling and buy-now-pay-later where it suits the category.",
      },
      {
        title: "Hosting region",
        body: "Where latency or data residency matters, we deploy to Australian regions rather than defaulting to wherever is cheapest.",
      },
    ],
    services: [
      "web-development",
      "saas-development",
      "web-application-development",
      "mobile-app-development",
      "search-engine-optimization",
      "ui-ux-design",
    ],
    faqs: [
      {
        question: "Are you based in Australia?",
        answer:
          "No. We are in New Delhi and work with Australian clients remotely. The time-zone overlap is good enough that this works well in practice.",
      },
      {
        question: "What are your working hours relative to ours?",
        answer:
          "Our standard day covers a large part of your afternoon. We schedule calls in that window, which is comfortable for both sides rather than an imposition on either.",
      },
      {
        question: "Can you host in Australia?",
        answer:
          "Yes. Where data residency or latency matters, we deploy to Australian cloud regions and confirm that in writing as part of the architecture.",
      },
    ],
  },

  {
    slug: "united-kingdom",
    country: "United Kingdom",
    countryCode: "GB",
    isoNumeric: "826",
    coordinates: { lat: 51.51, lon: -0.13 },
    type: "client-market",
    title: "A remote studio for UK businesses, working most of your day.",
    eyebrow: "United Kingdom",
    lede: "The UK is the market our working day overlaps most naturally. Our afternoon covers your morning and most of your working day, which makes a remote arrangement feel closer to a local one.",
    metaTitle: "Software & Web Development for the UK | The Digital Alchemy",
    metaDescription:
      "Remote web, software and SaaS development for United Kingdom businesses. A New Delhi studio with substantial daily overlap with UK working hours and WCAG-standard delivery.",
    presence:
      "We do not have a UK office. We are based in New Delhi and work with UK clients remotely.",
    timezone: {
      label: "IST is 4.5–5.5 hours ahead of the UK",
      overlap: "Your morning through mid-afternoon",
      detail:
        "Around 1:30pm in Delhi is 8:00am in London. Our afternoon covers your morning and much of your working day, so most of your week has a live channel to us.",
    },
    workingModel: [
      {
        title: "A shared working afternoon",
        body: "Several hours of genuine overlap every day means reviews, questions and decisions happen live rather than by asynchronous relay.",
      },
      {
        title: "Written specifications",
        body: "Scope and decisions documented, so there is a shared record rather than a recollection of what was agreed on a call.",
      },
      {
        title: "Weekly demos",
        body: "A short weekly session showing what actually works, which keeps direction correctable while correction is still cheap.",
      },
    ],
    practicalities: [
      {
        title: "Data protection",
        body: "UK GDPR shapes what personal data you can collect, why, and for how long. We design forms, analytics and consent around that from the start rather than adding a banner afterwards.",
      },
      {
        title: "Consent before tracking",
        body: "Analytics and marketing tags gated behind consent, because loading them first and asking afterwards is the common implementation and it is not compliant.",
      },
      {
        title: "Accessibility",
        body: "We build to WCAG 2.2 AA as standard, which covers the accessibility expectations most UK organisations work to.",
      },
      {
        title: "Contracting and invoicing",
        body: "Written agreements with IP assignment, invoiced in pounds sterling and paid by international transfer.",
      },
    ],
    services: [
      "web-development",
      "web-application-development",
      "saas-development",
      "ui-ux-design",
      "search-engine-optimization",
      "custom-software-development",
    ],
    faqs: [
      {
        question: "Do you have a UK entity?",
        answer:
          "No. We contract from India and invoice in sterling. We say so plainly rather than presenting a local address that would not mean anything.",
      },
      {
        question: "How do you handle UK GDPR?",
        answer:
          "By designing for it: collecting the minimum personal data, gating analytics and marketing behind consent, documenting retention, and agreeing where data is stored. Your legal advisers set the requirements and we build to them.",
      },
      {
        question: "Can you work to our accessibility requirements?",
        answer:
          "Yes. WCAG 2.2 AA is our default standard rather than an optional extra, and we check it during delivery rather than as a review at the end.",
      },
    ],
  },

  {
    slug: "canada",
    country: "Canada",
    countryCode: "CA",
    isoNumeric: "124",
    coordinates: { lat: 43.65, lon: -79.38 },
    type: "client-market",
    title: "A remote design and engineering team for Canadian businesses.",
    eyebrow: "Canada",
    lede: "We work with Canadian companies the same way we work with US ones: remotely, in writing, with a held overlap window and a named lead who carries the context.",
    metaTitle: "Software & Web Development for Canada | The Digital Alchemy",
    metaDescription:
      "Remote software, SaaS, web and app development for Canadian businesses. A New Delhi studio working with Canadian clients on product design, engineering and digital growth.",
    presence:
      "We do not have a Canadian office. We are based in New Delhi and work with Canadian clients remotely.",
    timezone: {
      label: "IST is 9.5–13.5 hours ahead of Canada",
      overlap: "Our evening, your morning",
      detail:
        "Roughly 6:30pm in Delhi is 8:00am in Toronto, with the window sitting later in our evening for British Columbia. We hold that block for calls.",
    },
    workingModel: [
      {
        title: "A held overlap window",
        body: "A fixed block each day reserved for calls with Canadian clients, so scheduling is settled once rather than renegotiated weekly.",
      },
      {
        title: "Asynchronous by design",
        body: "Written updates, recorded walkthroughs and a staging environment you can check whenever suits, so progress does not depend on a shared hour.",
      },
      {
        title: "Named lead",
        body: "One person who knows the engagement end to end, so context does not have to be rebuilt each conversation.",
      },
    ],
    practicalities: [
      {
        title: "Privacy legislation",
        body: "Canadian privacy law, and provincial legislation in Quebec in particular, affects consent and how personal data is handled. We design collection and retention around the requirements your advisers set.",
      },
      {
        title: "Bilingual requirements",
        body: "Where English and French are both needed, that shapes the content model, the layout and the review process. It is far cheaper decided at the start than retrofitted.",
      },
      {
        title: "Data residency",
        body: "Where data must remain in Canada, we deploy to Canadian regions and confirm it in the architecture documentation.",
      },
      {
        title: "Contracting and invoicing",
        body: "Written agreements with IP assignment, invoiced in Canadian or US dollars by agreement, paid by international transfer.",
      },
    ],
    services: [
      "saas-development",
      "web-application-development",
      "custom-software-development",
      "web-development",
      "ui-ux-design",
      "digital-marketing",
    ],
    faqs: [
      {
        question: "Can you support English and French?",
        answer:
          "Yes. We build the content model for multiple languages from the start. We do not provide translation ourselves — we work with your translators or a supplier, and design the workflow so both versions stay in step.",
      },
      {
        question: "Can data stay in Canada?",
        answer:
          "Yes. Where residency is a requirement we deploy to Canadian cloud regions and document it as part of the architecture rather than leaving it to a default.",
      },
    ],
  },

  {
    slug: "uae",
    country: "United Arab Emirates",
    countryCode: "AE",
    isoNumeric: "784",
    coordinates: { lat: 25.2, lon: 55.27 },
    type: "client-market",
    title: "A development partner an hour and a half from your working day.",
    eyebrow: "United Arab Emirates",
    lede: "The UAE is the closest of our international markets. With only ninety minutes between us, working together feels much like working with a local team.",
    metaTitle: "Software & Web Development for the UAE | The Digital Alchemy",
    metaDescription:
      "Remote web, software and SaaS development for businesses in the UAE. A New Delhi studio working with Dubai and Abu Dhabi clients across an almost fully shared working day.",
    presence:
      "We do not have a UAE office. We are based in New Delhi and work with clients in the Emirates remotely.",
    timezone: {
      label: "IST is 1.5 hours ahead of GST",
      overlap: "Effectively the whole working day",
      detail:
        "Ninety minutes separates us, so for practical purposes we are on the same schedule. Same-day turnaround is the norm rather than something to plan around.",
    },
    workingModel: [
      {
        title: "Effectively shared hours",
        body: "With a ninety-minute offset, meetings, reviews and quick questions happen whenever they need to, without either side working unsociable hours.",
      },
      {
        title: "Aligned working week",
        body: "The UAE working week runs Monday to Friday, matching ours, so there is no lost day at either end of the week.",
      },
      {
        title: "Occasional travel where it matters",
        body: "For larger engagements, in-person workshops can be arranged. We would treat that as a specific, agreed exception rather than implying a local presence.",
      },
    ],
    practicalities: [
      {
        title: "Arabic and English",
        body: "Where both are needed, right-to-left layout affects the entire design system, not just the text. We plan for it from the first screen rather than mirroring at the end.",
      },
      {
        title: "Local payment expectations",
        body: "For consumer products we cover the payment methods customers in the region actually use, including regional card handling and cash on delivery where the category calls for it.",
      },
      {
        title: "Hosting region",
        body: "Where latency or residency matters, we deploy to Middle East regions rather than defaulting elsewhere.",
      },
      {
        title: "Contracting and invoicing",
        body: "Written agreements with IP assignment, invoiced in dirhams or US dollars by agreement.",
      },
    ],
    services: [
      "web-development",
      "ecommerce-development",
      "saas-development",
      "digital-marketing",
      "social-media-management",
      "ui-ux-design",
    ],
    faqs: [
      {
        question: "Do you have an office in Dubai?",
        answer:
          "No. We work with clients in the Emirates from New Delhi. The time difference is small enough that it rarely makes a practical difference.",
      },
      {
        question: "Can you build Arabic-language sites?",
        answer:
          "Yes. We design and build for right-to-left layout properly, which affects typography, spacing, icons and navigation rather than just the direction of the text. Translation itself comes from your team or a specialist supplier.",
      },
    ],
  },
];

const bySlug = new Map(markets.map((market) => [market.slug, market]));

export function getMarket(slug: string): Market | undefined {
  return bySlug.get(slug);
}

export const marketSlugs = markets.map((market) => market.slug);

export function getHeadquarters(): Market {
  const hq = markets.find((market) => market.type === "headquarters");
  if (!hq) throw new Error("No headquarters market configured.");
  return hq;
}
