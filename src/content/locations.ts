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
    title: "Websites, apps and marketing for Indian businesses, from New Delhi.",
    eyebrow: "India",
    lede: "This is where we are. We help Indian businesses with everything from websites and software to the marketing that brings them customers. We can also meet in person when it helps.",
    metaTitle: "Websites, Apps and Marketing in India | The Digital Alchemy",
    metaDescription:
      "A New Delhi team building websites, apps, software and AI tools, and running online marketing for Indian businesses. Get a free consultation.",
    presence:
      "Based in Uttam Nagar, New Delhi. This is our only office; we work with clients in every other country remotely.",
    timezone: {
      label: "Indian time (IST)",
      overlap: "The whole working day",
      detail:
        "We keep the same hours as you, so meetings, reviews and urgent questions happen the same day, not the next one.",
    },
    workingModel: [
      {
        title: "Meeting in person when it helps",
        body: "The first planning sessions and big reviews can happen face to face in Delhi NCR. Most day-to-day work still happens remotely, because that is quicker for both sides.",
      },
      {
        title: "Answers the same day",
        body: "Shared working hours mean questions are answered within the day, and decisions do not wait overnight.",
      },
      {
        title: "Indian billing and payments",
        body: "Invoices in rupees with GST done correctly, and payment by UPI or bank transfer.",
      },
    ],
    practicalities: [
      {
        title: "Payments Indian customers use",
        body: "UPI, cards, net banking and wallets through Indian payment gateways. A checkout without UPI loses a large share of Indian buyers.",
      },
      {
        title: "Fast on real Indian phones and networks",
        body: "We test on mid-range Android phones and slow connections, not a fast office computer, because that is what most of your visitors use.",
      },
      {
        title: "Showing up in local searches",
        body: "Google Business Profile, the same details on every listing, and useful local pages: the work that decides whether nearby customers find you at all.",
      },
      {
        title: "Hindi and regional languages, where needed",
        body: "Do many of your customers prefer a language other than English? Then we plan the website for it from the start, not with a translation plug-in later.",
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
          "Yes, if you are in or around Delhi NCR. We usually suggest meeting for the first planning session and for big reviews, and doing everything else online, which keeps the project moving faster.",
      },
      {
        question: "Do you work with businesses outside Delhi?",
        answer:
          "Yes, anywhere in India. The only difference is that in-person meetings become video calls.",
      },
      {
        question: "How do GST and invoices work?",
        answer:
          "We invoice in rupees, with GST added as required. Payment terms are agreed in the contract: usually by stages for projects, and monthly in advance for ongoing work.",
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
    title: "Software and app development for US businesses, from New Delhi.",
    eyebrow: "United States",
    lede: "We work with US businesses as a remote design and development team. There is no US office and no local sales team. We are a team in New Delhi that plans its day so American clients are not waiting a day for every answer.",
    metaTitle: "Software Development for US Businesses | The Digital Alchemy",
    metaDescription:
      "Software, SaaS, website and app development for US businesses, by a New Delhi team that keeps set hours for your mornings. Get a free consultation.",
    presence:
      "We do not have a US office. We are based in New Delhi and work with US clients remotely, keeping set hours free just for them.",
    timezone: {
      label: "India is 9.5 to 13 hours ahead of the US",
      overlap: "Our evening, your morning",
      detail:
        "Our evening lines up with the US East Coast morning: roughly 6:30pm to 9:30pm in Delhi is 8:00am to 11:00am in New York. For the West Coast, the shared time is later in our evening. We keep that time free for calls, so you never need to meet at unreasonable hours.",
    },
    workingModel: [
      {
        title: "Set hours for your calls",
        body: "A fixed block every working day when our team is free for US calls, so booking a meeting is never a weekly negotiation.",
      },
      {
        title: "Everything in writing",
        body: "Decisions, plans and progress are written down, not just said on calls. The time difference then works for you: work continues while you sleep, and it is clear when you wake up.",
      },
      {
        title: "A test link you can open any time",
        body: "A test version of your project you can open whenever you like, so you check progress yourself instead of waiting for a summary.",
      },
      {
        title: "One person to talk to",
        body: "A named lead who knows your whole project, so you never re-explain things to whoever is free.",
      },
    ],
    practicalities: [
      {
        title: "Contracts and ownership",
        body: "Written agreements covering what is included, confidentiality, and your ownership of the work. The code, designs and accounts are yours.",
      },
      {
        title: "Invoices in US dollars",
        body: "Invoiced in US dollars and paid by international transfer. Fees and payment dates are fixed in the contract, so exchange rates are not your problem during the project.",
      },
      {
        title: "Where your data is kept",
        body: "If your data must stay in the US, we host it in the US. We decide that on purpose at the start, not by default.",
      },
      {
        title: "Honest about cost",
        body: "Our rates are usually lower than a similar US studio's. We would rather be chosen for the quality of our work than on price alone. So we plan openly and let the plan speak for itself.",
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
          "No. We are based in New Delhi and work with US clients remotely. We would rather say that plainly than suggest a local office we do not have.",
      },
      {
        question: "How do we handle the time difference?",
        answer:
          "With set hours for calls, our evening and your East Coast morning, and by doing everything in writing so progress does not depend on meetings. The time difference can even help: work happens while you sleep and is ready to review when you start.",
      },
      {
        question: "Who owns the work?",
        answer:
          "You do. Ownership is written into the contract, and the code, cloud accounts and design files are in your company's name from the start.",
      },
      {
        question: "How do we know the work will be good?",
        answer:
          "Start small. A paid first phase, or a clearly defined first stage, lets you judge the quality, communication and speed before committing to more. We would rather earn a bigger project than ask for one on trust.",
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
    title: "Web and app development for Australian businesses, with easy hours.",
    eyebrow: "Australia",
    lede: "Australia is one of the easiest countries to work with from India. Our morning is your afternoon, so talking the same day is normal, not something to plan around.",
    metaTitle: "Web and App Development for Australia | The Digital Alchemy",
    metaDescription:
      "Websites, software, SaaS and apps for Australian businesses, by a New Delhi team whose morning is your afternoon. Get a free consultation.",
    presence:
      "We do not have an Australian office. We are based in New Delhi and work with Australian clients remotely.",
    timezone: {
      label: "India is 4.5 to 5.5 hours behind Sydney",
      overlap: "Most of your afternoon",
      detail:
        "Our working morning covers much of your afternoon: around 9:30am in Delhi is roughly 2:00pm in Sydney. That is real shared time every day, not a narrow slot.",
    },
    workingModel: [
      {
        title: "The same day, not the next",
        body: "A question you ask in the morning is usually answered before you finish for the day. The shared time is wide enough that work rarely waits overnight.",
      },
      {
        title: "Calls at sensible hours",
        body: "Your afternoon is our morning. Nobody has to take a call at eleven at night to keep things moving.",
      },
      {
        title: "A regular weekly review",
        body: "A fixed weekly review at a time that suits you, with written updates in between, so nothing depends on being on a call.",
      },
    ],
    practicalities: [
      {
        title: "Contracts and invoices",
        body: "Written agreements with ownership of the work, invoiced in Australian dollars and paid by international transfer.",
      },
      {
        title: "Easy access for everyone",
        body: "Many Australian organisations, especially in government and education, must meet the international accessibility standard (WCAG). We build to WCAG 2.2 AA as standard, so that is already covered.",
      },
      {
        title: "Local payment methods",
        body: "For products sold to the public, we set up the payment methods Australians expect, including local cards and buy-now-pay-later where it suits.",
      },
      {
        title: "Hosting in Australia",
        body: "Where speed or data rules matter, we host in Australia instead of wherever is cheapest.",
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
          "No. We are in New Delhi and work with Australian clients remotely. The shared hours are good enough that this works well.",
      },
      {
        question: "How do our working hours line up?",
        answer:
          "Our normal day covers much of your afternoon. We book calls in that time, which is comfortable for both sides.",
      },
      {
        question: "Can you host in Australia?",
        answer:
          "Yes. Where data rules or speed matter, we host in Australia and confirm that in writing.",
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
    title: "Web and software development for UK businesses, in your working day.",
    eyebrow: "United Kingdom",
    lede: "Our working day lines up with the UK's more than with any other country's. Our afternoon covers your morning and most of your day, so working remotely feels close to working with a local team.",
    metaTitle: "Web and Software Development in the UK | The Digital Alchemy",
    metaDescription:
      "Websites, software and SaaS for UK businesses, by a New Delhi team sharing most of your working day, with UK GDPR in mind. Get a free consultation.",
    presence:
      "We do not have a UK office. We are based in New Delhi and work with UK clients remotely.",
    timezone: {
      label: "India is 4.5 to 5.5 hours ahead of the UK",
      overlap: "Your morning to mid-afternoon",
      detail:
        "Around 1:30pm in Delhi is 8:00am in London. Our afternoon covers your morning and much of your working day, so you can reach us live for most of your week.",
    },
    workingModel: [
      {
        title: "A shared working day",
        body: "Several hours of real shared time every day, so reviews, questions and decisions happen live instead of by message.",
      },
      {
        title: "Plans in writing",
        body: "What is included, and every decision, written down, so there is a shared record instead of different memories of a call.",
      },
      {
        title: "A short weekly demo",
        body: "A short session every week showing what works, so the direction can be changed while changes are still cheap.",
      },
    ],
    practicalities: [
      {
        title: "Data protection",
        body: "UK GDPR decides what personal data you can collect, why, and for how long. We design forms, tracking and consent around it from the start, instead of adding a cookie banner afterwards.",
      },
      {
        title: "Consent before tracking",
        body: "Analytics and marketing tracking only load after the visitor agrees. Loading them first and asking afterwards is common, and it breaks the rules.",
      },
      {
        title: "Easy access for everyone",
        body: "We build to the international accessibility standard (WCAG 2.2 AA) as standard, which covers what most UK organisations require.",
      },
      {
        title: "Contracts and invoices",
        body: "Written agreements with ownership of the work, invoiced in pounds and paid by international transfer.",
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
        question: "Do you have a UK company?",
        answer:
          "No. We contract from India and invoice in pounds. We say so plainly, rather than showing a local address that would mean nothing.",
      },
      {
        question: "How do you handle UK GDPR?",
        answer:
          "By designing for it: collecting as little personal data as possible, loading tracking only after consent, writing down how long data is kept, and agreeing where it is stored. Your legal advisers set the requirements, and we build to them.",
      },
      {
        question: "Can you meet our accessibility requirements?",
        answer:
          "Yes. WCAG 2.2 AA is our normal standard, not an extra, and we check it while we build, not only at the end.",
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
    title: "Software and web development for Canadian businesses, from New Delhi.",
    eyebrow: "Canada",
    lede: "We work with Canadian businesses the same way we work with US ones. That means remote work, everything in writing, set hours for calls, and one person who knows your whole project.",
    metaTitle: "Software Development for Canada | The Digital Alchemy",
    metaDescription:
      "Software, websites and apps for Canadian businesses, by a New Delhi team with set hours for your mornings, in English and French. Get a free consultation.",
    presence:
      "We do not have a Canadian office. We are based in New Delhi and work with Canadian clients remotely.",
    timezone: {
      label: "India is 9.5 to 13.5 hours ahead of Canada",
      overlap: "Our evening, your morning",
      detail:
        "Roughly 6:30pm in Delhi is 8:00am in Toronto. For British Columbia, the shared time is later in our evening. We keep that time free for calls.",
    },
    workingModel: [
      {
        title: "Set hours for your calls",
        body: "A fixed block every day kept free for calls with Canadian clients, so booking is settled once, not negotiated every week.",
      },
      {
        title: "Progress you can check any time",
        body: "Written updates, recorded walk-throughs and a test link you can open whenever it suits you, so progress never depends on a shared hour.",
      },
      {
        title: "One named person",
        body: "One person who knows your project from start to finish, so you never have to explain it again.",
      },
    ],
    practicalities: [
      {
        title: "Privacy law",
        body: "Canadian privacy law, and Quebec's rules in particular, affect consent and how personal data is handled. We design what is collected, and how long it is kept, around what your advisers require.",
      },
      {
        title: "English and French",
        body: "Where you need both languages, that shapes the pages, the layout and how content is checked. It is far cheaper to decide at the start than to add later.",
      },
      {
        title: "Data kept in Canada",
        body: "Where data must stay in Canada, we host it there and confirm it in writing.",
      },
      {
        title: "Contracts and invoices",
        body: "Written agreements with ownership of the work, invoiced in Canadian or US dollars as agreed, and paid by international transfer.",
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
        question: "Can you build sites in English and French?",
        answer:
          "Yes. We plan for both languages from the start. We do not translate ourselves: we work with your translators or a translation company, and set things up so both versions stay in step.",
      },
      {
        question: "Can our data stay in Canada?",
        answer:
          "Yes. Where that is required, we host in Canada and write it into the plan, rather than leaving it to a default setting.",
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
    title: "Web and app development for UAE businesses, just 90 minutes away.",
    eyebrow: "United Arab Emirates",
    lede: "The UAE is the closest of the countries we work with. With only ninety minutes between us, working together feels much like working with a local team.",
    metaTitle: "Web and App Development for the UAE | The Digital Alchemy",
    metaDescription:
      "Websites, apps and software for businesses in Dubai and Abu Dhabi, by a New Delhi team just 90 minutes ahead of you. Get a free consultation.",
    presence:
      "We do not have a UAE office. We are based in New Delhi and work with clients in the Emirates remotely.",
    timezone: {
      label: "India is 1.5 hours ahead of the UAE",
      overlap: "The whole working day",
      detail:
        "Only ninety minutes separate us, so in practice we work the same hours. Getting things done the same day is normal, not something to plan around.",
    },
    workingModel: [
      {
        title: "The same working hours",
        body: "With ninety minutes between us, meetings, reviews and quick questions happen whenever needed, and nobody works odd hours.",
      },
      {
        title: "The same working week",
        body: "The UAE working week runs Monday to Friday, like ours, so no day is lost at either end of the week.",
      },
      {
        title: "Occasional visits for big projects",
        body: "For larger projects, in-person workshops can be arranged. We treat that as an agreed exception, and never suggest we have a local office.",
      },
    ],
    practicalities: [
      {
        title: "Arabic and English",
        body: "Where you need both, Arabic's right-to-left reading changes the whole design, not just the text. We plan for it from the first screen.",
      },
      {
        title: "Local payment methods",
        body: "For products sold to the public, we set up the payment methods people in the region actually use. That includes local cards, and cash on delivery where it suits.",
      },
      {
        title: "Hosting in the region",
        body: "Where speed or data rules matter, we host in the Middle East instead of somewhere far away.",
      },
      {
        title: "Contracts and invoices",
        body: "Written agreements with ownership of the work, invoiced in dirhams or US dollars as agreed.",
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
          "No. We work with clients in the Emirates from New Delhi. The time difference is small enough that it rarely makes any practical difference.",
      },
      {
        question: "Can you build websites in Arabic?",
        answer:
          "Yes. We design and build for right-to-left reading properly, which changes the fonts, spacing, icons and menus, not just the direction of the text. The translation itself comes from your team or a specialist.",
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
