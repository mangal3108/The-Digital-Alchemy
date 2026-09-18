/**
 * Industry pages describe how we approach a sector's specific problems.
 *
 * They deliberately do NOT claim client history, market share or sector
 * expertise we cannot evidence. Where a page would normally show proof, it
 * pulls verified case studies and testimonials from the CMS — and renders
 * nothing at all when none exist yet. That is the honest version, and it is
 * also what keeps these pages out of thin-doorway-page territory.
 */
export interface Industry {
  slug: string;
  name: string;
  title: string;
  eyebrow: string;
  lede: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  /** Sector-specific problems, written in the operator's language. */
  challenges: { title: string; body: string }[];
  /** How we approach them. */
  approach: { title: string; body: string }[];
  /** Service slugs most relevant to this sector. */
  services: string[];
  /** Things that are genuinely different about building for this sector. */
  considerations: string[];
  faqs: { question: string; answer: string }[];
}

export const industries: Industry[] = [
  {
    slug: "startups",
    name: "Startups",
    title: "Getting to a first version worth showing.",
    eyebrow: "Startups & Founders",
    lede: "Early-stage work is a race between learning and runway. The job is to build the smallest thing that produces a real answer, and to build it well enough that it does not have to be thrown away.",
    summary:
      "MVPs, investor-ready products and the discipline to keep version one small.",
    metaTitle: "Digital Product Development for Startups | The Digital Alchemy",
    metaDescription:
      "Product design and development for startups — MVP scoping, rapid build, investor-ready interfaces and the technical foundations that survive the first year of growth.",
    challenges: [
      {
        title: "Scope grows faster than runway",
        body: "Every conversation adds a feature. Without a defended release boundary, the first version arrives late, costs more and still fails to answer the question it was built to answer.",
      },
      {
        title: "Speed now versus not rebuilding in a year",
        body: "Both extremes are expensive. Over-engineering burns months you do not have; the fastest possible build often has to be replaced right when traction arrives.",
      },
      {
        title: "The product has to convince investors as well as users",
        body: "Fundraising is often judged partly on how finished the product looks. That has to be achieved without spending the round on polish.",
      },
      {
        title: "No in-house engineering team yet",
        body: "Founders frequently need a team before they can afford to hire one, and the early technical decisions are the hardest to reverse later.",
      },
    ],
    approach: [
      {
        title: "Scope to a single question",
        body: "We define version one around the one thing you need to learn — usually whether people will pay. Everything not serving that goes into a written phase two so it stops being argued about.",
      },
      {
        title: "Boring technology, deliberately",
        body: "Mainstream, well-documented tools. It keeps you hireable later and means the next engineer can read the codebase without a translator.",
      },
      {
        title: "Design that punches above the budget",
        body: "A tight design system applied consistently makes a small product look considered. Consistency reads as quality far more than decoration does.",
      },
      {
        title: "Instrumented from day one",
        body: "Analytics and event tracking in the first release, because the point of shipping early is to learn something measurable.",
      },
    ],
    services: [
      "product-design",
      "saas-development",
      "mobile-app-development",
      "ui-ux-design",
      "web-development",
    ],
    considerations: [
      "Code and infrastructure accounts in your company's name from day one",
      "Architecture that supports a second engineer without a rewrite",
      "Documentation good enough for technical due diligence",
      "A phase-two plan you can show investors",
    ],
    faqs: [
      {
        question: "Can you work with a pre-funding budget?",
        answer:
          "Sometimes, by narrowing scope rather than lowering quality. A tightly defined prototype answering one question is a legitimate project; a full platform on a prototype budget is not, and we will say so rather than take it on.",
      },
      {
        question: "Will we be able to hire engineers to take it over?",
        answer:
          "That is an explicit design goal. We use mainstream technologies, document decisions, and hand over cleanly. Building something only we can maintain would not be in your interest.",
      },
    ],
  },

  {
    slug: "ecommerce",
    name: "E-commerce",
    title: "Where online retail actually loses money.",
    eyebrow: "E-commerce & D2C",
    lede: "Traffic is rarely the problem. Most stores lose the majority of their potential revenue between the product page and the confirmed order, and the reasons are usually specific and fixable.",
    summary:
      "Storefronts, checkout, integrations and the ongoing conversion work after launch.",
    metaTitle: "E-commerce Development & Growth | The Digital Alchemy",
    metaDescription:
      "E-commerce websites and growth for online retailers — storefront development, checkout optimisation, product experience, inventory integration and paid acquisition.",
    challenges: [
      {
        title: "Acquisition costs keep climbing",
        body: "When paid traffic gets more expensive every year, conversion rate and repeat purchase stop being optimisations and become the business model.",
      },
      {
        title: "Checkout leaks",
        body: "Surprise shipping costs, forced account creation, too many fields and missing local payment methods each remove a slice of orders that were otherwise ready to place.",
      },
      {
        title: "Inventory truth lives in two places",
        body: "Without integration between the store and whatever actually tracks stock, overselling and manual reconciliation become routine.",
      },
      {
        title: "Peak trading exposes everything",
        body: "Sale periods surface the performance and operational problems that a normal week hides.",
      },
    ],
    approach: [
      {
        title: "Fix the funnel before buying more traffic",
        body: "We start with checkout and product-page data. A conversion improvement applies to every visit you have already paid for, which usually beats increasing the budget.",
      },
      {
        title: "Design the purchase as one sequence",
        body: "Category, product, cart and checkout designed together rather than as separate pages, because the gaps between them are where customers leave.",
      },
      {
        title: "Integrate the back office",
        body: "Stock, orders and fulfilment connected so the store reflects reality and staff stop re-entering data.",
      },
      {
        title: "Build for the peak, not the average",
        body: "Performance and operational headroom sized for your busiest trading day, since that is the day it matters.",
      },
    ],
    services: [
      "ecommerce-development",
      "performance-marketing",
      "search-engine-optimization",
      "meta-ads",
      "digital-marketing",
    ],
    considerations: [
      "Local payment methods for each market you sell into",
      "Product feed quality, which drives Shopping and Performance Max",
      "Returns and delivery information visible before checkout",
      "Redirects for product URLs during any migration",
    ],
    faqs: [
      {
        question: "Should we rebuild or optimise?",
        answer:
          "Optimise first, in most cases. A rebuild resets whatever is currently working and takes months. We look at the funnel data before recommending either, and a list of targeted fixes is a very common outcome.",
      },
      {
        question: "Can you handle marketplaces as well as our own store?",
        answer:
          "We focus on your own storefront and the acquisition driving it. Where marketplace listings need to stay in sync with your stock, that is an integration we can build.",
      },
    ],
  },

  {
    slug: "healthcare",
    name: "Healthcare",
    title: "Digital work where trust and privacy are the product.",
    eyebrow: "Healthcare & Wellness",
    lede: "Healthcare software carries obligations most sectors do not. Patient information, consent, accessibility and clarity are not features to add later — they shape the design from the first decision.",
    summary:
      "Patient-facing services, booking and practice systems, built with privacy as a constraint.",
    metaTitle: "Healthcare Digital Development | The Digital Alchemy",
    metaDescription:
      "Websites, booking systems and applications for healthcare providers — patient privacy, accessibility, appointment management and clear communication as design constraints.",
    challenges: [
      {
        title: "Patient data raises the stakes on every decision",
        body: "What is collected, where it is stored, who can see it and how long it is kept are decisions with legal weight, and they have to be made deliberately rather than by default.",
      },
      {
        title: "Booking is the whole experience for most patients",
        body: "Availability, rescheduling, reminders and cancellations determine both patient satisfaction and how much of the day reception spends on the phone.",
      },
      {
        title: "Accessibility is not optional here",
        body: "Healthcare audiences include people with impairments, in distress, or using older devices. Contrast, text size and keyboard access have real consequences.",
      },
      {
        title: "Clinical accuracy versus plain language",
        body: "Information has to be correct and understandable by someone anxious and unfamiliar with the terminology.",
      },
    ],
    approach: [
      {
        title: "Collect the minimum",
        body: "We design forms and records around what is genuinely needed. Data not collected is data that cannot leak, and it is the cheapest privacy control available.",
      },
      {
        title: "Work to your compliance requirements",
        body: "Your obligations depend on your jurisdiction and the data involved. We build to the requirements your advisers set — we do not claim certifications of our own.",
      },
      {
        title: "Design for the anxious reader",
        body: "Clear hierarchy, plain language, obvious next steps and honest information about what happens after an enquiry.",
      },
      {
        title: "Accessibility as an acceptance criterion",
        body: "WCAG 2.2 AA checks built into delivery rather than run as a review after launch.",
      },
    ],
    services: [
      "web-development",
      "web-application-development",
      "ui-ux-design",
      "search-engine-optimization",
      "automation-integrations",
    ],
    considerations: [
      "Data residency and retention decided explicitly, in writing",
      "Consent captured and recorded properly",
      "Access control and audit logging for anything patient-identifiable",
      "Encrypted storage and transport as a baseline",
    ],
    faqs: [
      {
        question: "Are you certified for healthcare compliance?",
        answer:
          "We do not hold healthcare-specific certifications and we will not imply otherwise. We build to the requirements your compliance advisers define, and we apply the engineering practices those frameworks expect: minimal data collection, access control, encryption, audit logging and documented retention.",
      },
      {
        question: "Can you integrate with our practice management system?",
        answer:
          "Where the vendor provides an API or an export mechanism, yes. Some systems are closed, and we will establish what is actually possible during discovery rather than assuming.",
      },
    ],
  },

  {
    slug: "education",
    name: "Education",
    title: "Platforms that work for learners, parents and staff at once.",
    eyebrow: "Education & Training",
    lede: "Education products serve several audiences with different needs and very different levels of confidence with software. Designing for all of them without making any one of them feel stupid is the actual challenge.",
    summary:
      "Learning platforms, admissions journeys and administrative systems for education providers.",
    metaTitle: "Education Technology Development | The Digital Alchemy",
    metaDescription:
      "Websites and platforms for schools, colleges and training providers — admissions journeys, learning platforms, student portals and administrative systems.",
    challenges: [
      {
        title: "Several audiences, one interface",
        body: "Students, parents, teachers and administrators need different things from the same system, and blending them produces something that serves nobody well.",
      },
      {
        title: "Admissions decides the year",
        body: "For most institutions the enquiry-to-enrolment journey is the highest-value path on the entire site, and it is frequently the least considered.",
      },
      {
        title: "Seasonal load",
        body: "Results days and enrolment periods produce traffic many times the baseline, concentrated into hours.",
      },
      {
        title: "Content ages badly",
        body: "Course details, fees and dates change annually. If updating them is difficult, the site drifts out of date and starts costing enquiries.",
      },
    ],
    approach: [
      {
        title: "Separate the journeys",
        body: "Distinct paths for prospective students, current students and staff, so each sees a coherent experience instead of a shared compromise.",
      },
      {
        title: "Treat admissions as a funnel",
        body: "The enquiry path designed, measured and improved with the same rigour a commercial funnel receives, because it is one.",
      },
      {
        title: "Content model built for the annual cycle",
        body: "Courses, intakes, fees and staff as structured content your team can update in minutes without needing a developer.",
      },
      {
        title: "Sized for peak days",
        body: "Performance planned around enrolment and results periods rather than around a quiet Tuesday.",
      },
    ],
    services: [
      "web-development",
      "web-application-development",
      "ui-ux-design",
      "search-engine-optimization",
      "digital-marketing",
    ],
    considerations: [
      "Accessibility obligations that often apply to education providers",
      "Safeguarding considerations where the audience includes minors",
      "Multi-device use, frequently on older or shared hardware",
      "Integration with student record and finance systems",
    ],
    faqs: [
      {
        question: "Can you build a learning platform, or should we buy one?",
        answer:
          "If your teaching model is standard, an existing platform will almost always be cheaper and better supported. Custom development makes sense when your pedagogy or operating model genuinely differs from what those products assume.",
      },
      {
        question: "Can our team keep course information current?",
        answer:
          "Yes — that is a core requirement for this sector. We model courses, intakes and fees as structured content so updates are straightforward and consistent everywhere they appear.",
      },
    ],
  },

  {
    slug: "real-estate",
    name: "Real Estate",
    title: "Listings that hold attention and capture the enquiry.",
    eyebrow: "Real Estate & Property",
    lede: "Property buyers browse constantly and enquire rarely. The work is making listings genuinely searchable, making the property feel real on a phone screen, and making enquiries reach an agent while the interest is still warm.",
    summary:
      "Property portals, listing management, lead capture and agent tooling.",
    metaTitle: "Real Estate Website & Platform Development | The Digital Alchemy",
    metaDescription:
      "Property websites and portals — listing management, search and filtering, virtual tours, lead capture and CRM integration for real estate businesses.",
    challenges: [
      {
        title: "Search and filtering is the product",
        body: "For any meaningful inventory, how well someone can narrow the list determines whether they engage at all. Weak filtering shows up directly in enquiry volume.",
      },
      {
        title: "Listings go stale",
        body: "Sold and let properties left visible waste enquiries and damage credibility. Keeping inventory current usually means integration rather than discipline.",
      },
      {
        title: "Enquiries go cold quickly",
        body: "Property interest has a short half-life. A lead that waits until the next working day has usually already spoken to another agent.",
      },
      {
        title: "Media is heavy",
        body: "Galleries, floor plans and video make listing pages slow, which particularly hurts on mobile where most browsing happens.",
      },
    ],
    approach: [
      {
        title: "Design search first",
        body: "Filters, map view, saved searches and alerts treated as the core product rather than as a component dropped onto a page.",
      },
      {
        title: "Integrate the inventory",
        body: "Listings synced from whatever system your agents already work in, so the website reflects reality without duplicate entry.",
      },
      {
        title: "Route enquiries instantly",
        body: "Straight into the CRM with the property attached, assigned and notified immediately, because response speed is the whole game.",
      },
      {
        title: "Optimise media aggressively",
        body: "Responsive images, modern formats and lazy loading so a gallery-heavy page still loads quickly on a phone.",
      },
    ],
    services: [
      "web-development",
      "web-application-development",
      "lead-generation",
      "performance-marketing",
      "search-engine-optimization",
    ],
    considerations: [
      "Structured data for property listings where eligible",
      "Map performance with large numbers of markers",
      "Saved searches and alerts to bring browsers back",
      "Clear agent contact routes on every listing",
    ],
    faqs: [
      {
        question: "Can you sync with our listing software?",
        answer:
          "Usually. Most property CRMs offer an API or a feed. We confirm what your specific system supports during discovery rather than promising it up front.",
      },
      {
        question: "Do we need our own portal if we advertise on the big ones?",
        answer:
          "Portals give reach but rent you the customer relationship and their data. Your own site is where you build a direct audience, capture repeat interest and control the enquiry. Most agencies need both.",
      },
    ],
  },

  {
    slug: "finance",
    name: "Finance",
    title: "Financial services where credibility is measured in details.",
    eyebrow: "Finance & Professional Advice",
    lede: "Financial audiences are sceptical for good reason. Clarity, security and restraint communicate competence here far better than persuasion does — and regulatory obligations shape what can be said at all.",
    summary:
      "Client portals, calculators and websites for financial and advisory businesses.",
    metaTitle: "Financial Services Web Development | The Digital Alchemy",
    metaDescription:
      "Websites, client portals and tools for financial services businesses — secure document exchange, calculators, onboarding journeys and compliant, clear communication.",
    challenges: [
      {
        title: "Marketing claims are constrained",
        body: "What can be promised is limited by regulation, so credibility has to be built through clarity and evidence rather than through claims.",
      },
      {
        title: "Documents move by email",
        body: "Sensitive documents sent as email attachments are both a security exposure and a poor client experience. A portal fixes both.",
      },
      {
        title: "Onboarding is long and manual",
        body: "Identity checks, forms and signatures create a slow first impression at exactly the point where a client is deciding whether they made the right choice.",
      },
      {
        title: "Trust is judged in seconds",
        body: "Poor design in financial services does not read as informal. It reads as risky.",
      },
    ],
    approach: [
      {
        title: "Design restraint deliberately",
        body: "Clear typography, generous space and precise language. In this sector, visual calm is a credibility signal.",
      },
      {
        title: "Secure document exchange",
        body: "An authenticated portal for statements, reports and signed documents, replacing email attachments entirely.",
      },
      {
        title: "Streamline onboarding",
        body: "Multi-step forms that save progress, explain why each piece of information is needed, and integrate with identity verification where required.",
      },
      {
        title: "Build compliance into the workflow",
        body: "Approval steps and version history for published material, and audit logging for consequential actions.",
      },
    ],
    services: [
      "web-application-development",
      "web-development",
      "ui-ux-design",
      "automation-integrations",
      "custom-software-development",
    ],
    considerations: [
      "Content approval workflow for regulated material",
      "Strong authentication and session security for client areas",
      "Audit logging and data retention decided with your compliance team",
      "Accessible presentation of figures, charts and disclosures",
    ],
    faqs: [
      {
        question: "Do you understand financial regulation?",
        answer:
          "We are not compliance advisers and will not present ourselves as such. We build to the requirements your compliance function defines, and we are familiar with the engineering practices that support them — approval workflows, audit trails, access control and retention policies.",
      },
      {
        question: "Can you build calculators and modelling tools?",
        answer:
          "Yes. The logic and any assumptions are agreed and documented with you, and results are presented with the caveats your compliance team requires rather than as advice.",
      },
    ],
  },

  {
    slug: "hospitality",
    name: "Hospitality",
    title: "Winning the direct booking instead of renting it.",
    eyebrow: "Hospitality & Travel",
    lede: "Every booking through an aggregator costs commission and hands over the customer relationship. A direct channel that people actually prefer to use is the highest-return digital investment most hospitality businesses can make.",
    summary:
      "Direct booking journeys, property presentation and the marketing that fills the calendar.",
    metaTitle: "Hospitality Website & Booking Development | The Digital Alchemy",
    metaDescription:
      "Websites and direct booking experiences for hotels, restaurants and travel businesses — availability, reservations, property presentation and demand generation.",
    challenges: [
      {
        title: "Aggregators take the margin and the customer",
        body: "Commission is only part of the cost. The larger loss is never owning the guest relationship or the ability to market to them again.",
      },
      {
        title: "The booking flow is worse than the aggregator's",
        body: "If checking availability on your own site is slower or more confusing, guests will book through the channel that is easier, even having found you first.",
      },
      {
        title: "Photography carries the decision",
        body: "Hospitality is bought on how a place looks and feels. Weak imagery cannot be rescued by good copy.",
      },
      {
        title: "Demand is seasonal and perishable",
        body: "An unsold night is revenue that cannot be recovered, which makes filling shoulder periods a specific marketing problem.",
      },
    ],
    approach: [
      {
        title: "Make direct booking the easiest option",
        body: "Fast availability, minimal steps, transparent pricing and a clear reason to book direct.",
      },
      {
        title: "Design around the imagery",
        body: "Layouts built to let strong photography carry the page, with performance work so large images still load quickly.",
      },
      {
        title: "Capture the relationship",
        body: "Email capture, pre-arrival messaging and post-stay follow-up, so a guest is reachable next season.",
      },
      {
        title: "Market against the calendar",
        body: "Campaigns aimed at the specific periods that need filling rather than run at a constant rate all year.",
      },
    ],
    services: [
      "web-development",
      "web-application-development",
      "performance-marketing",
      "social-media-management",
      "search-engine-optimization",
    ],
    considerations: [
      "Integration with your property or reservation management system",
      "Rate parity constraints in your channel agreements",
      "Multi-language and multi-currency where guests are international",
      "Local search presence, which drives a large share of bookings",
    ],
    faqs: [
      {
        question: "Can you integrate with our booking engine?",
        answer:
          "Usually yes — most property management systems and booking engines provide integration options. Which approach is best depends on your specific vendor, and we establish that during discovery.",
      },
      {
        question: "Can you do the photography?",
        answer:
          "Not in-house. We will specify what the site needs and work with your photographer, or recommend one. Given how much of the decision rests on imagery, it is worth investing in properly.",
      },
    ],
  },

  {
    slug: "professional-services",
    name: "Professional Services",
    title: "Making expertise visible before the first conversation.",
    eyebrow: "Professional Services",
    lede: "Firms selling expertise are usually bought on credibility and referral. The website's job is to confirm that a recommendation was sound, and to give someone researching quietly a reason to make contact.",
    summary:
      "Positioning, credibility and enquiry capture for consultancies, agencies and advisory firms.",
    metaTitle: "Professional Services Website Development | The Digital Alchemy",
    metaDescription:
      "Websites and digital marketing for consultancies, law firms, accountancy practices and advisory businesses — positioning, credibility, thought leadership and enquiry generation.",
    challenges: [
      {
        title: "Every firm's website says the same thing",
        body: "Experience, integrity, client focus. Interchangeable claims give a prospect nothing to choose between and no reason to remember you.",
      },
      {
        title: "The expertise is invisible",
        body: "The knowledge that wins work usually lives in people's heads and in private documents, never in a form a prospect can encounter.",
      },
      {
        title: "Referrals arrive and then research",
        body: "Most referred prospects check the website before making contact. That visit either confirms the recommendation or quietly undermines it.",
      },
      {
        title: "Nobody has time to publish",
        body: "Content programmes in professional services usually fail on capacity rather than intent.",
      },
    ],
    approach: [
      {
        title: "Position on something specific",
        body: "A defined focus — sector, problem or client type — is more persuasive than breadth, even though breadth feels safer.",
      },
      {
        title: "Show the thinking",
        body: "Published perspective on the questions clients actually ask is what separates a credible firm from a competent one on paper.",
      },
      {
        title: "Design for the referred visitor",
        body: "Clear people, clear specialisms, clear evidence and an easy way to make contact without committing to a sales process.",
      },
      {
        title: "Make publishing sustainable",
        body: "A realistic content model and a process built around interviewing your experts rather than expecting them to write.",
      },
    ],
    services: [
      "web-development",
      "branding",
      "search-engine-optimization",
      "lead-generation",
      "digital-marketing",
    ],
    considerations: [
      "Client confidentiality constraints on case studies",
      "Approval processes for published material in regulated professions",
      "Individual profiles, which are often the most-visited pages on the site",
      "Structured data for the organisation and its people",
    ],
    faqs: [
      {
        question: "We cannot name our clients. Can we still show credibility?",
        answer:
          "Yes. Anonymised case studies describing the situation, approach and outcome work well, as do sector-level results, published perspective and clearly presented expertise. Named logos help, but they are not the only route.",
      },
      {
        question: "Is content marketing worth it for a small firm?",
        answer:
          "It can be, provided it is genuinely specific. Generic articles compete with everyone and rank for nothing. A narrow, well-answered question your clients actually ask is worth more than twenty broad posts.",
      },
    ],
  },

  {
    slug: "retail",
    name: "Retail",
    title: "Joining up the shop, the site and the customer.",
    eyebrow: "Retail & Multi-location",
    lede: "Customers do not think in channels. They check stock online, buy in store, return by post, and expect all three systems to know about each other.",
    summary:
      "Multi-location retail, local search visibility and connecting online with in-store.",
    metaTitle: "Retail Digital Development | The Digital Alchemy",
    metaDescription:
      "Digital development for retail businesses — multi-location websites, local search visibility, stock visibility, click and collect and customer data across channels.",
    challenges: [
      {
        title: "Online and in-store are separate businesses",
        body: "Different systems, different stock, different customer records. The customer experiences the gap even when the organisation has stopped noticing it.",
      },
      {
        title: "Local search is where the traffic is",
        body: "For physical retail, being found by someone nearby with intent matters more than national visibility, and it is a different discipline.",
      },
      {
        title: "Store pages are an afterthought",
        body: "Location pages with only an address and a phone number waste the highest-intent traffic the site receives.",
      },
      {
        title: "Nobody knows the online-to-store effect",
        body: "Digital activity that drives store visits is usually invisible in reporting, so it gets under-funded relative to what it produces.",
      },
    ],
    approach: [
      {
        title: "Connect the systems",
        body: "Stock, orders and customer data integrated so online can show what is actually available and where.",
      },
      {
        title: "Treat local search as a channel",
        body: "Business profiles, consistent details and genuinely useful store pages, since this is where local intent converts.",
      },
      {
        title: "Design store pages properly",
        body: "Stock, staff, services, parking, accessibility, live hours and directions — the specifics people are actually looking for.",
      },
      {
        title: "Measure the store effect",
        body: "Store locator use, click-and-collect and direction requests tracked, so online's contribution to physical sales becomes visible.",
      },
    ],
    services: [
      "web-development",
      "ecommerce-development",
      "search-engine-optimization",
      "performance-marketing",
      "automation-integrations",
    ],
    considerations: [
      "Consistent name, address and phone details across every listing",
      "Local business structured data per location",
      "Stock visibility, which is the main reason people check before travelling",
      "Opening hours accurate through holidays and exceptions",
    ],
    faqs: [
      {
        question: "Can you build a store locator with live stock?",
        answer:
          "Yes, provided your stock system can expose availability by location. Where it cannot, we will be direct about that limitation rather than showing customers a number that is wrong.",
      },
      {
        question: "How do we handle many locations without duplicate content?",
        answer:
          "Each location page needs genuinely specific content — its own staff, services, stock, parking and local information. A template with the town name swapped is exactly what search engines treat as low quality.",
      },
    ],
  },
];

const bySlug = new Map(industries.map((industry) => [industry.slug, industry]));

export function getIndustry(slug: string): Industry | undefined {
  return bySlug.get(slug);
}

export const industrySlugs = industries.map((industry) => industry.slug);
