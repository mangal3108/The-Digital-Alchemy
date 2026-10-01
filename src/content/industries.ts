/**
 * Industry pages describe how we approach a sector's specific problems.
 *
 * They deliberately do NOT claim client history, market share or sector
 * expertise we cannot evidence. Where a page would normally show proof, it
 * pulls verified case studies and testimonials from the CMS — and renders
 * nothing at all when none exist yet. That is the honest version, and it is
 * also what keeps these pages out of thin-doorway-page territory.
 *
 * Written for the owner of that business, in plain words: see
 * docs/plain-language-glossary.md.
 */
export interface Industry {
  slug: string;
  name: string;
  title: string;
  eyebrow: string;
  lede: string;
  summary: string;
  /**
   * Who the business is, for "What we can do for {audience}". Plain words a
   * visitor would use about themselves: "a clinic or hospital".
   */
  audience: string;
  /**
   * Three concrete things we can build or run for this kind of business, each
   * linked to the service that delivers it. What they get, not results: no
   * figures and no client names.
   */
  examples: { title: string; body: string; service: string }[];
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
    title: "Websites and apps for startups: a first version worth showing.",
    eyebrow: "Startups & Founders",
    lede: "When you are starting out, time and money run out fast. We help you build the smallest version that shows whether people will pay. And we build it well enough that you will not have to throw it away.",
    summary: "A first version of your product, kept small, built well, and ready to show investors.",
    audience: "a startup",
    examples: [
      {
        title: "A first version of your app",
        body: "A small, working version with only the features that show whether people will pay.",
        service: "saas-development",
      },
      {
        title: "A launch website with a waitlist",
        body: "A simple site that explains the idea and collects sign-ups or demo requests from day one.",
        service: "web-development",
      },
      {
        title: "Clickable designs for investors",
        body: "A tested, clickable sample of every screen to show investors before anything is built.",
        service: "product-design",
      },
    ],
    metaTitle: "App Development for Startups | The Digital Alchemy",
    metaDescription:
      "We help startups build a small, well-made first version of their app or software, ready to test with customers and show investors. Get a free consultation.",
    challenges: [
      {
        title: "The plan grows faster than the money",
        body: "Every conversation adds a feature. Without a firm limit, the first version arrives late, costs more, and still does not answer the question it was built for.",
      },
      {
        title: "Fast now, or not rebuilding in a year?",
        body: "Both extremes are expensive. Building too much burns months you do not have. Building too cheaply often means starting again just as customers arrive.",
      },
      {
        title: "Investors judge how finished it looks",
        body: "Raising money often depends partly on how polished the product looks. That has to happen without spending the whole budget on polish.",
      },
      {
        title: "No developers of your own yet",
        body: "Founders often need a team before they can afford to hire one, and the early technical choices are the hardest to undo later.",
      },
    ],
    approach: [
      {
        title: "Build to answer one question",
        body: "We plan version one around the one thing you need to learn, usually whether people will pay. Everything else goes into a written version-two list, so it stops being argued about.",
      },
      {
        title: "Common, proven tools",
        body: "Well-known technology that is easy to hire for, so the next developer can understand the code without help.",
      },
      {
        title: "Looks better than its budget",
        body: "A small set of design rules, used consistently, makes a small product look carefully made. Consistency looks like quality far more than decoration does.",
      },
      {
        title: "Tracking from the first day",
        body: "Usage tracking in the very first release, because the point of launching early is to learn something you can measure.",
      },
    ],
    services: ["product-design", "saas-development", "mobile-app-development", "ui-ux-design", "web-development"],
    considerations: [
      "Code and accounts in your company's name from the first day",
      "Built so a second developer can join without a rewrite",
      "Written notes good enough for an investor's technical checks",
      "A version-two plan you can show investors",
    ],
    faqs: [
      {
        question: "Can you work with a small, pre-funding budget?",
        answer:
          "Sometimes, by building less rather than building worse. A small, clickable sample that answers one question is a real project. A full platform on a sample's budget is not, and we will say so instead of taking it on.",
      },
      {
        question: "Can we hire our own developers to take it over later?",
        answer:
          "Yes, we plan for exactly that. We use common technology, write down our decisions, and hand over cleanly. Building something only we can look after would not be good for you.",
      },
    ],
  },

  {
    slug: "ecommerce",
    name: "E-commerce",
    title: "E-commerce: helping your online store sell more.",
    eyebrow: "E-commerce & Online Brands",
    lede: "Getting visitors is rarely the main problem. Most online stores lose most of their possible sales between the product page and the finished order, and the reasons are usually specific and fixable.",
    summary: "Online stores, easier checkouts, connected stock, and selling more after launch.",
    audience: "an online brand",
    examples: [
      {
        title: "A store that takes UPI and cards",
        body: "An online store with fast checkout, UPI and card payments, and stock that updates itself.",
        service: "ecommerce-development",
      },
      {
        title: "Instagram and Facebook ads that sell",
        body: "Ads shown to likely buyers, with every sale tracked back to the ad that brought it.",
        service: "meta-ads",
      },
      {
        title: "Showing up on Google for your products",
        body: "Product and category pages written around what people search for, so buyers find you without ads.",
        service: "search-engine-optimization",
      },
    ],
    metaTitle: "E-commerce Growth for Online Brands | The Digital Alchemy",
    metaDescription:
      "Online stores that sell more: easier checkout, UPI payments, stock in sync, and ads that bring buyers. Get a free consultation.",
    challenges: [
      {
        title: "Ads cost more every year",
        body: "When paid visitors get more expensive every year, turning more visitors into buyers, and getting them to buy again, becomes the whole business.",
      },
      {
        title: "People leave at checkout",
        body: "Surprise delivery charges, forced sign-ups, too many fields and a missing UPI option each cost you orders from people who were ready to buy.",
      },
      {
        title: "Stock is tracked in two places",
        body: "When your store is not connected to your stock records, you sell items you do not have. Then orders get fixed by hand.",
      },
      {
        title: "Sales days expose every weakness",
        body: "Festive sales and big offers show up the speed and stock problems that a normal week hides.",
      },
    ],
    approach: [
      {
        title: "Fix the store before buying more visitors",
        body: "We start with your checkout and product page data. Every improvement helps every visitor you have already paid for, which usually beats spending more.",
      },
      {
        title: "Design buying as one journey",
        body: "Category, product, cart and checkout designed together, because the gaps between them are where customers leave.",
      },
      {
        title: "Connect the back office",
        body: "Stock, orders and delivery connected, so the store shows what is really available and staff stop typing things in twice.",
      },
      {
        title: "Ready for your busiest day",
        body: "Speed and stock planned for your biggest sale day, because that is the day it matters.",
      },
    ],
    services: ["ecommerce-development", "performance-marketing", "search-engine-optimization", "meta-ads", "digital-marketing"],
    considerations: [
      "The payment methods people use where you sell, like UPI",
      "A clean product list, which decides how well Google Shopping ads work",
      "Returns and delivery details shown before checkout",
      "Old product links kept working when you move stores",
    ],
    faqs: [
      {
        question: "Should we rebuild our store or improve it?",
        answer:
          "Improve it first, in most cases. A rebuild resets whatever is working now and takes months. We look at your sales data before suggesting either, and a list of targeted fixes is a very common answer.",
      },
      {
        question: "Can you handle marketplaces like Amazon and Flipkart too?",
        answer:
          "We focus on your own store and the marketing that brings people to it. Where your marketplace listings need to stay in step with your stock, we can connect them.",
      },
    ],
  },

  {
    slug: "healthcare",
    name: "Healthcare",
    title: "Websites and online booking for clinics and hospitals.",
    eyebrow: "Healthcare & Wellness",
    lede: "For clinics, hospitals and wellness businesses. Patient information, consent, clear language and easy booking are not extras to add later. They shape everything from the first decision.",
    summary: "Clinic websites, online booking and patient systems, built with privacy first.",
    audience: "a clinic or hospital",
    examples: [
      {
        title: "Online appointment booking",
        body: "A website that lists every treatment and doctor, with a booking form patients can use from their phone.",
        service: "web-development",
      },
      {
        title: "Appointment reminders on WhatsApp",
        body: "Reminders and follow-ups sent automatically, so fewer patients forget or miss a visit.",
        service: "automation-integrations",
      },
      {
        title: "Found by patients nearby",
        body: "A proper Google Business Profile and treatment pages, so people searching for a doctor near them can find you.",
        service: "search-engine-optimization",
      },
    ],
    metaTitle: "Clinic and Hospital Websites | The Digital Alchemy",
    metaDescription:
      "Websites, online appointment booking and patient systems for clinics and hospitals, with patient privacy first. Get a free consultation.",
    challenges: [
      {
        title: "Patient data raises the stakes",
        body: "What you collect, where it is kept, who can see it and for how long are decisions with legal weight. They have to be made on purpose, not by default.",
      },
      {
        title: "Booking is what most patients experience",
        body: "Availability, rescheduling, reminders and cancellations decide how happy patients are, and how much of the day your reception spends on the phone.",
      },
      {
        title: "Everyone must be able to use it",
        body: "Patients may be unwell, worried, older, or on an old phone. Readable text, good contrast and simple steps really matter.",
      },
      {
        title: "Correct, but easy to understand",
        body: "Medical information has to be accurate, and understandable by someone who is anxious and does not know the terms.",
      },
    ],
    approach: [
      {
        title: "Collect only what is needed",
        body: "Forms and records designed around what is really needed. Information you never collect can never leak, and it is the cheapest privacy protection there is.",
      },
      {
        title: "Built to your legal requirements",
        body: "Your obligations depend on where you work and what data you hold. We build to what your advisers require; we do not claim certifications of our own.",
      },
      {
        title: "Written for a worried reader",
        body: "Clear headings, plain words, obvious next steps, and honest information about what happens after someone gets in touch.",
      },
      {
        title: "Checked for easy access",
        body: "Checked against the international accessibility standard as we build, not reviewed only after launch.",
      },
    ],
    services: ["web-development", "web-application-development", "ui-ux-design", "search-engine-optimization", "automation-integrations"],
    considerations: [
      "Where patient data is stored, and for how long, agreed in writing",
      "Patient consent recorded properly",
      "Controlled access, and a record of who viewed patient details",
      "Encryption for stored and sent information, as standard",
    ],
    faqs: [
      {
        question: "Are you certified for healthcare compliance?",
        answer:
          "No, we do not hold healthcare-specific certifications, and we will not suggest otherwise. We build to the requirements your advisers set, using the practices those rules expect: collecting only what is needed, controlled access, encryption, records of access, and agreed retention.",
      },
      {
        question: "Can it connect to our clinic management software?",
        answer:
          "If your software allows connections or exports, yes. Some systems are closed, and we find out what is actually possible before promising anything.",
      },
    ],
  },

  {
    slug: "education",
    name: "Education",
    title: "Websites and portals for coaching institutes, schools and colleges.",
    eyebrow: "Education & Training",
    lede: "For coaching institutes, schools, colleges and training providers. Students, parents and staff all use the same system, with very different needs and comfort with technology. Making it easy for all of them is the real job.",
    summary: "Admission enquiries, student portals and fee and course systems for education providers.",
    audience: "a coaching institute or school",
    examples: [
      {
        title: "A portal for students and parents",
        body: "Fees, attendance and test results online, so parents stop calling the office to ask.",
        service: "web-application-development",
      },
      {
        title: "Admission enquiries from Google and Instagram",
        body: "Campaigns for each admission season, with every enquiry sent straight to your counsellors.",
        service: "digital-marketing",
      },
      {
        title: "A website parents can trust",
        body: "Courses, results you are allowed to share, fees and faculty, clearly laid out and quick on a phone.",
        service: "web-development",
      },
    ],
    metaTitle: "Websites for Coaching Institutes | The Digital Alchemy",
    metaDescription:
      "Websites, admission enquiries and student portals for coaching institutes, schools and colleges. Get a free consultation.",
    challenges: [
      {
        title: "Several audiences, one system",
        body: "Students, parents, teachers and office staff need different things from the same system. Mixing them together serves nobody well.",
      },
      {
        title: "Admissions decide the year",
        body: "For most institutes, the path from first enquiry to admission is the most valuable part of the website, and often the least thought about.",
      },
      {
        title: "Result days bring huge traffic",
        body: "Result days and admission weeks can bring many times the normal number of visitors, all within a few hours.",
      },
      {
        title: "Information goes out of date",
        body: "Courses, fees and dates change every year. If updating them is hard, the site falls behind and starts costing you enquiries.",
      },
    ],
    approach: [
      {
        title: "Separate paths for each audience",
        body: "Different paths for new students, current students and staff, so each sees exactly what they need.",
      },
      {
        title: "Treat admissions like sales",
        body: "The enquiry path designed, measured and improved with the same care a business gives its sales, because that is what it is.",
      },
      {
        title: "Easy yearly updates",
        body: "Courses, batches, fees and staff set up so your team can update them in minutes, without a developer.",
      },
      {
        title: "Ready for the busiest days",
        body: "Speed planned for result and admission days, not for a quiet Tuesday.",
      },
    ],
    services: ["web-development", "web-application-development", "ui-ux-design", "search-engine-optimization", "digital-marketing"],
    considerations: [
      "Easy access for everyone, which education providers are often required to offer",
      "Extra care where students are children",
      "Use on many devices, often older or shared phones",
      "Connections to your student records and fee systems",
    ],
    faqs: [
      {
        question: "Should we build our own learning platform or buy one?",
        answer:
          "If you teach in a standard way, a ready-made platform will almost always be cheaper and better supported. Building your own makes sense when the way you teach, or run your institute, is genuinely different from what those products assume.",
      },
      {
        question: "Can our staff keep course details up to date?",
        answer:
          "Yes, that is essential in education. We set up courses, batches and fees so changes are quick and show correctly everywhere they appear.",
      },
    ],
  },

  {
    slug: "real-estate",
    name: "Real Estate",
    title: "Real estate websites that bring you enquiries from serious buyers.",
    eyebrow: "Real Estate & Property",
    lede: "For builders, brokers and property businesses. Buyers browse all the time but enquire rarely. We make your listings easy to search and each property look real on a phone. Every enquiry reaches an agent while the buyer is still interested.",
    summary: "Property websites, easy search, and enquiries that reach an agent fast.",
    audience: "a builder or property agent",
    examples: [
      {
        title: "A property website with search",
        body: "Listings people can search by area, budget and size, with an enquiry button on every property.",
        service: "web-development",
      },
      {
        title: "Ads for a new project launch",
        body: "Google and Facebook ads for the launch, with every enquiry tracked and the budget moved to what works.",
        service: "performance-marketing",
      },
      {
        title: "Enquiries that reach an agent at once",
        body: "Every enquiry from the site and the ads goes straight to the right agent, while the buyer is still interested.",
        service: "lead-generation",
      },
    ],
    metaTitle: "Real Estate Websites in Delhi | The Digital Alchemy",
    metaDescription:
      "Property websites with easy search, fast photos and enquiries sent straight to your agents. For builders and brokers. Get a free consultation.",
    challenges: [
      {
        title: "Search and filters are everything",
        body: "Once you have more than a few properties, how easily buyers can narrow them down decides whether they stay. Weak filters mean fewer enquiries.",
      },
      {
        title: "Old listings stay up",
        body: "Sold or rented properties left online waste enquiries and damage trust. Keeping listings current usually needs a connection to your records, not more effort.",
      },
      {
        title: "Enquiries go cold fast",
        body: "Interest in a property fades quickly. An enquiry that waits until tomorrow has usually already spoken to another agent.",
      },
      {
        title: "Photos slow the site down",
        body: "Galleries, floor plans and videos make pages slow, which hurts most on phones, where most browsing happens.",
      },
    ],
    approach: [
      {
        title: "Search comes first",
        body: "Filters, map view, saved searches and alerts treated as the heart of the site, not an afterthought.",
      },
      {
        title: "Listings from one source",
        body: "Listings pulled from the system your agents already use, so the website is always current without typing them in twice.",
      },
      {
        title: "Enquiries sent instantly",
        body: "Straight to your customer list app with the property attached, assigned and alerted at once, because speed wins the buyer.",
      },
      {
        title: "Fast photos",
        body: "Images sized and compressed properly, so a page full of photos still loads quickly on a phone.",
      },
    ],
    services: ["web-development", "web-application-development", "lead-generation", "performance-marketing", "search-engine-optimization"],
    considerations: [
      "Property details set up so Google can understand them",
      "Maps that stay fast with many properties on them",
      "Saved searches and alerts that bring buyers back",
      "A clear way to contact an agent on every listing",
    ],
    faqs: [
      {
        question: "Can the website sync with our listing software?",
        answer:
          "Usually. Most property software can share its listings. We confirm what your specific system allows before promising it.",
      },
      {
        question: "Do we need our own website if we list on the big property portals?",
        answer:
          "Portals give you reach, but the buyer and their details belong to the portal. Your own site is where you build your own audience, catch repeat interest and control the enquiry. Most agencies need both.",
      },
    ],
  },

  {
    slug: "finance",
    name: "Finance",
    title: "Websites and client portals for finance businesses.",
    eyebrow: "Finance & Advisory",
    lede: "For financial advisers, insurance agencies and finance businesses. Your clients are careful, for good reason. Clarity, security and calm design show you are competent far better than sales talk, and rules limit what you can say anyway.",
    summary: "Client portals, calculators and clear websites for finance and advisory businesses.",
    audience: "a finance or advisory business",
    examples: [
      {
        title: "A client portal",
        body: "A secure place where clients log in to see their documents, statements and next steps.",
        service: "web-application-development",
      },
      {
        title: "Calculators that start conversations",
        body: "Loan, EMI or tax calculators on your website that answer a question and lead to an enquiry.",
        service: "web-development",
      },
      {
        title: "Less paperwork by hand",
        body: "Documents and client details moved between your apps automatically, instead of copied by your team.",
        service: "automation-integrations",
      },
    ],
    metaTitle: "Websites for Finance Firms | The Digital Alchemy",
    metaDescription:
      "Clear websites, secure client portals, calculators and easy onboarding for financial advisers and finance businesses. Get a free consultation.",
    challenges: [
      {
        title: "You cannot promise much",
        body: "Rules limit what financial businesses can claim, so trust has to come from clarity and evidence instead of promises.",
      },
      {
        title: "Documents travel by email",
        body: "Sensitive documents sent as email attachments are a security risk and a poor experience for clients. A secure portal fixes both.",
      },
      {
        title: "Signing up a new client is slow",
        body: "Identity checks, forms and signatures make a slow first impression, right when a client is deciding whether they chose well.",
      },
      {
        title: "Trust is judged in seconds",
        body: "In finance, careless design does not look relaxed. It looks risky.",
      },
    ],
    approach: [
      {
        title: "Calm, clear design",
        body: "Clear text, plenty of space and precise wording. In finance, a calm look builds trust.",
      },
      {
        title: "Secure document sharing",
        body: "A secure, logged-in portal for statements, reports and signed documents, replacing email attachments completely.",
      },
      {
        title: "Faster sign-up for new clients",
        body: "Forms that save progress, explain why each detail is needed, and connect to identity checks where required.",
      },
      {
        title: "Rules built into the process",
        body: "Approval steps and version history for anything you publish, and a record of important actions.",
      },
    ],
    services: ["web-application-development", "web-development", "ui-ux-design", "automation-integrations", "custom-software-development"],
    considerations: [
      "An approval step for anything regulated before it is published",
      "Strong logins and security for client areas",
      "Records and data retention agreed with your compliance team",
      "Figures, charts and disclosures that everyone can read",
    ],
    faqs: [
      {
        question: "Do you understand financial regulation?",
        answer:
          "We are not compliance advisers and will not present ourselves as such. We build to the requirements your compliance team sets, and we know the practices that support them: approval steps, records of who did what, controlled access and retention rules.",
      },
      {
        question: "Can you build calculators and planning tools?",
        answer:
          "Yes. The calculations and assumptions are agreed and written down with you, and results are shown with the notes your compliance team requires, not as advice.",
      },
    ],
  },

  {
    slug: "hospitality",
    name: "Hospitality",
    title: "More direct bookings for hotels, restaurants and cafés.",
    eyebrow: "Hotels, Restaurants & Travel",
    lede: "For hotels, homestays, restaurants, cafés and travel businesses. Every booking through an aggregator costs you commission and gives away the customer. A booking option on your own site that people actually prefer to use pays back fast.",
    summary: "Direct bookings, great photos online, and marketing that fills your quiet days.",
    audience: "a restaurant, café or hotel",
    examples: [
      {
        title: "Direct bookings and orders",
        body: "Table bookings, room bookings or food orders on your own website, with less commission paid to apps.",
        service: "web-development",
      },
      {
        title: "Social media that fills quiet days",
        body: "A monthly plan of posts and reels that shows your food, rooms and offers.",
        service: "social-media-management",
      },
      {
        title: "Found on Google Maps",
        body: "A complete Google Business Profile with photos, menu and hours, so nearby people choose you.",
        service: "search-engine-optimization",
      },
    ],
    metaTitle: "Websites and Direct Booking for Hotels | The Digital Alchemy",
    metaDescription:
      "Websites and direct booking for hotels, restaurants and cafés, so fewer bookings go through commission-charging apps. Get a free consultation.",
    challenges: [
      {
        title: "Booking apps take your margin and your guests",
        body: "Commission is only part of the cost. The bigger loss is never owning the guest's details, or being able to invite them back.",
      },
      {
        title: "Booking on your site is harder than on the apps",
        body: "If checking availability on your own website is slower or more confusing, guests book through whichever is easier, even after finding you first.",
      },
      {
        title: "Photos make the decision",
        body: "People choose a hotel or restaurant by how it looks and feels. Weak photos cannot be rescued by good words.",
      },
      {
        title: "Empty rooms and tables cannot be sold later",
        body: "An unsold night or an empty table is money gone for good, which makes filling quiet days a marketing problem of its own.",
      },
    ],
    approach: [
      {
        title: "Make booking direct the easiest option",
        body: "Fast availability, few steps, clear prices, and a good reason to book with you directly.",
      },
      {
        title: "Let the photos do the work",
        body: "Pages built around strong photos, set up so even large images load quickly.",
      },
      {
        title: "Keep in touch with guests",
        body: "Email and WhatsApp before and after a visit, so a guest can be reached again next season.",
      },
      {
        title: "Market for the quiet days",
        body: "Campaigns aimed at the dates and times you need to fill, instead of the same spend all year.",
      },
    ],
    services: ["web-development", "web-application-development", "performance-marketing", "social-media-management", "search-engine-optimization"],
    considerations: [
      "Connection to your booking or reservation system",
      "Price rules in your agreements with booking apps",
      "Several languages and currencies if your guests come from abroad",
      "Showing up on Google Maps, which brings many bookings",
    ],
    faqs: [
      {
        question: "Can it connect to our booking system?",
        answer:
          "Usually yes. Most hotel and restaurant booking systems allow connections. The best way to do it depends on your provider, which we check first.",
      },
      {
        question: "Can you take the photos?",
        answer:
          "Not ourselves. We will tell you what the site needs and work with your photographer, or suggest one. Since so much of the decision rests on photos, they are worth doing properly.",
      },
    ],
  },

  {
    slug: "professional-services",
    name: "Professional Services",
    title: "Websites for CA firms, law firms and consultants.",
    eyebrow: "Professional Services",
    lede: "For CA firms, law firms, consultants and agencies. Clients usually find you by recommendation, then check your website before calling. Its job is to confirm the recommendation, and to give quiet researchers a reason to get in touch.",
    summary: "Clear positioning, visible expertise and more enquiries for firms that sell their knowledge.",
    audience: "a CA, law or consulting firm",
    examples: [
      {
        title: "A website that explains what you do",
        body: "Clear pages for each service you offer, written so clients understand them without jargon.",
        service: "web-development",
      },
      {
        title: "Found when people search for your service",
        body: "Pages built around searches like “GST registration near me”, so the right clients find you.",
        service: "search-engine-optimization",
      },
      {
        title: "A look that matches your expertise",
        body: "A logo, colours and documents that look as professional as the work you do.",
        service: "branding",
      },
    ],
    metaTitle: "Websites for CA and Law Firms | The Digital Alchemy",
    metaDescription:
      "Websites and marketing for CA firms, law firms and consultants that show your expertise and turn referrals into enquiries. Get a free consultation.",
    challenges: [
      {
        title: "Every firm's website says the same thing",
        body: "Experience, integrity, client focus. Claims every firm makes give a prospect nothing to choose between, and no reason to remember you.",
      },
      {
        title: "Your expertise is invisible",
        body: "The knowledge that wins work usually lives in people's heads and private documents, never somewhere a prospect can see it.",
      },
      {
        title: "Referrals check your website first",
        body: "Many people who are recommended to you look at your website before calling. That visit either confirms the recommendation or quietly weakens it.",
      },
      {
        title: "Nobody has time to write",
        body: "Articles and posts in professional firms usually stop because people are busy, not because they do not care.",
      },
    ],
    approach: [
      {
        title: "Be known for something specific",
        body: "A clear focus, on an industry, a problem or a type of client, persuades more than offering everything, even though offering everything feels safer.",
      },
      {
        title: "Show how you think",
        body: "Useful answers to the questions your clients actually ask are what make a firm stand out as credible.",
      },
      {
        title: "Designed for the recommended visitor",
        body: "Clear people, clear specialities, clear evidence, and an easy way to get in touch without being pushed into a sales process.",
      },
      {
        title: "Publishing that fits your week",
        body: "A realistic content plan, built around short interviews with your experts rather than asking them to write.",
      },
    ],
    services: ["web-development", "branding", "search-engine-optimization", "lead-generation", "digital-marketing"],
    considerations: [
      "Client confidentiality limits on case studies",
      "Approval steps for published material in regulated professions",
      "Individual profiles, often the most visited pages on the site",
      "Firm and people details set up so Google can understand them",
    ],
    faqs: [
      {
        question: "We cannot name our clients. Can we still show we are credible?",
        answer:
          "Yes. Anonymous case studies describing the situation, what you did and the result work well, as do clear explanations of your expertise and useful articles. Client names help, but they are not the only way.",
      },
      {
        question: "Are articles worth it for a small firm?",
        answer:
          "They can be, if they are specific. General articles compete with everyone and rank for nothing. One clear answer to a question your clients really ask is worth more than twenty general posts.",
      },
    ],
  },

  {
    slug: "retail",
    name: "Retail",
    title: "Connecting your shop, your website and your customers.",
    eyebrow: "Shops & Showrooms",
    lede: "For shops, showrooms and businesses with several branches. Customers check stock online, buy in the shop and return by courier, and they expect all three to know about each other.",
    summary: "Showing up in local searches, branch pages that help, and connecting online with in-store.",
    audience: "a shop or showroom",
    examples: [
      {
        title: "A page for each branch",
        body: "Address, hours, directions and stock highlights for each branch, so people come to the right one.",
        service: "web-development",
      },
      {
        title: "Selling online as well as in store",
        body: "An online store connected to the same stock as your shop, so you never sell what you do not have.",
        service: "ecommerce-development",
      },
      {
        title: "Ads that bring people into the shop",
        body: "Local Google and social ads for sales and festive seasons, aimed at people near your branches.",
        service: "performance-marketing",
      },
    ],
    metaTitle: "Websites and Local Marketing for Shops | The Digital Alchemy",
    metaDescription:
      "Websites, Google Maps visibility and stock shown online for shops, showrooms and multi-branch retailers. Get a free consultation.",
    challenges: [
      {
        title: "Online and in-store feel like two businesses",
        body: "Different systems, different stock, different customer records. Customers notice the gap even when your team has stopped noticing it.",
      },
      {
        title: "Local searches are where your customers are",
        body: "For a shop, being found by someone nearby who wants to buy matters more than being found across the country, and it needs different work.",
      },
      {
        title: "Branch pages are an afterthought",
        body: "Branch pages with only an address and phone number waste your most ready-to-buy visitors.",
      },
      {
        title: "Nobody knows what online does for the shop",
        body: "Online activity that brings people into your shop usually does not show up in reports, so it gets less budget than it earns.",
      },
    ],
    approach: [
      {
        title: "Connect the systems",
        body: "Stock, orders and customer records connected, so your website can show what is really available, and where.",
      },
      {
        title: "Show up in local searches",
        body: "Google Business Profile, the same details everywhere online, and genuinely useful branch pages, because that is where nearby buyers decide.",
      },
      {
        title: "Branch pages that help",
        body: "Stock, staff, services, parking, access, live opening hours and directions: the details people actually look for.",
      },
      {
        title: "Measure what online brings to the shop",
        body: "Store finder use, pick-up orders and direction requests tracked, so you can see what online adds to your in-store sales.",
      },
    ],
    services: ["web-development", "ecommerce-development", "search-engine-optimization", "performance-marketing", "automation-integrations"],
    considerations: [
      "The same name, address and phone number on every listing",
      "Each branch set up so Google can show it in local results",
      "Stock shown online, which is the main reason people check before visiting",
      "Opening hours kept right through holidays and exceptions",
    ],
    faqs: [
      {
        question: "Can you show live stock for each branch?",
        answer:
          "Yes, if your stock system can share availability by branch. Where it cannot, we will tell you plainly, rather than show customers a number that is wrong.",
      },
      {
        question: "How do we have many branch pages without repeating ourselves?",
        answer:
          "Each branch page needs its own details: staff, services, stock, parking and local information. A template with only the area name swapped is exactly what Google treats as low quality.",
      },
    ],
  },
];

const bySlug = new Map(industries.map((industry) => [industry.slug, industry]));

export function getIndustry(slug: string): Industry | undefined {
  return bySlug.get(slug);
}

export const industrySlugs = industries.map((industry) => industry.slug);
