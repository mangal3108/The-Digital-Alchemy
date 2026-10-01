import type { Service } from "./types";

/*
 * Written for a small-business owner, not a marketer. See
 * docs/plain-language-glossary.md for the words we use and the ones we don't.
 */
export const growthServices: Service[] = [
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    title: "Digital marketing that brings you customers, and shows you which part worked.",
    group: "customers",
    oneLiner: "All your online marketing in one place: SEO, ads, social media.",
    needItWhen: "you want all your online marketing planned and run together.",
    example: {
      business: "A physiotherapy clinic",
      before: "Someone posts on Instagram when there is time, a relative ran some ads once, and nobody knows what brought in patients.",
      after: "One monthly plan across Google, ads and social media, and one report showing which of them brought in patients.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "marketing",
    featured: true,
    eyebrow: "Digital Marketing",
    lede: "For businesses spending on marketing without knowing which part works. One team plans and runs your Google, ads and social media together. We report on the enquiries and sales they bring, not just likes and clicks.",
    summary: "Google, ads and social media planned together, and judged on enquiries and sales.",
    metaTitle: "Digital Marketing Agency in Delhi | The Digital Alchemy",
    metaDescription:
      "SEO, Google and Instagram ads, and social media, planned together by one team and measured by the enquiries and sales they bring. Get a free consultation.",
    whoFor: [
      "You spend on marketing, but cannot tell which part brings customers",
      "Plenty of people visit your website, but few of them enquire",
      "Different people run your ads, Google and social media, and nobody sees the full picture",
      "You do the marketing yourself and have run out of time for it",
    ],
    problems: [
      {
        title: "Reports count likes, not customers",
        body: "Views, followers and clicks are only the start. If the report stops there, nobody can tell which spending brings in customers and which just makes noise.",
      },
      {
        title: "Each channel works alone",
        body: "Google, social media and email end up competing for the same budget instead of helping each other. Your customer sees one business, so your marketing should work as one.",
      },
      {
        title: "Visitors come and go without enquiring",
        body: "When plenty of people visit but few enquire, the problem is usually the page, not the ads. Spending more only makes it worse.",
      },
      {
        title: "Nobody knows where customers came from",
        body: "Without proper tracking and a clear idea of what counts as a real enquiry, budget decisions are made on guesswork.",
      },
    ],
    capabilities: [
      {
        title: "A marketing plan",
        body: "Who to reach, where, and how much to spend on each channel, based on what a new customer is actually worth to you.",
      },
      {
        title: "Showing up on Google",
        body: "SEO work that brings free visits from Google. It is slower than ads, but it is the one channel that gets cheaper per visit over time.",
      },
      {
        title: "Google and Instagram ads",
        body: "Ads on Google, Facebook and Instagram, built around the people most likely to buy, not the platform's default settings.",
      },
      {
        title: "Social media and useful content",
        body: "Regular posts, reels and articles that answer the questions your customers ask before they buy.",
      },
      {
        title: "Pages that turn visitors into enquiries",
        body: "The pages your ads send people to, improved so more visitors enquire. That is often cheaper than paying for more visitors.",
      },
      {
        title: "Follow-up and reporting",
        body: "Email and WhatsApp follow-up for people who are interested but not ready yet. And monthly reports linking what you spent to the enquiries and sales it brought.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Review",
        body: "We look at your current marketing, your tracking and what a customer is worth to you. Fixing the tracking usually comes before spending more.",
      },
      {
        step: "02",
        title: "Plan",
        body: "Priorities, budget and targets agreed in writing, including what we expect not to work.",
      },
      {
        step: "03",
        title: "Set up and launch",
        body: "Tracking, landing pages and ads are ready before the budget grows. Then campaigns and content go live, set up so the early results are easy to read.",
      },
      {
        step: "04",
        title: "Improve and report",
        body: "Regular reviews: more budget to what works, less to what does not. Every month you get a clear report of spend, results and what changes next.",
      },
    ],
    deliverables: [
      "A review of your current marketing and tracking",
      "A written plan, with budget per channel",
      "Tracking that shows which marketing brings enquiries",
      "A calendar of campaigns and content",
      "Landing pages and ad designs",
      "Monthly reports and a planning review every three months",
    ],
    technologies: ["ga4", "search-console", "gtm", "google-ads", "meta-ads", "looker-studio"],
    engagement: ["growth-retainer", "project"],
    faqs: [
      {
        question: "How much should we spend on marketing?",
        answer:
          "It is best worked out backwards: what a customer is worth to you, how much of that you can spend to win one, and how many you need. Rules like “spend a fixed share of your revenue” ignore your margins and how long you take to close a sale. We work out the numbers with you during the review.",
      },
      {
        question: "How soon will we see results?",
        answer:
          "Paid ads show early results within days and become reliable within weeks. SEO and content take months. Anyone promising fast free traffic from Google is describing something that either will not last or is not free.",
      },
      {
        question: "Do you guarantee a number of enquiries?",
        answer:
          "No. The number of enquiries depends on your offer, prices, market and follow-up as much as on marketing, and we do not control all of those. We promise a measured approach, honest reports, and a clear reason for every change we make.",
      },
      {
        question: "Do we need to be on every platform?",
        answer:
          "Almost certainly not. Most businesses do better with two or three channels done well than six done thinly. Part of planning is deciding what to ignore.",
      },
      {
        question: "Who owns the ad accounts?",
        answer:
          "You do. The accounts are created in your business's name, and we are given access. If we stop working together, your data, history and audiences stay with you.",
      },
    ],
    related: ["search-engine-optimization", "performance-marketing", "social-media-management"],
  },

  {
    slug: "social-media-management",
    name: "Social Media",
    title: "Social media management for Instagram, Facebook and LinkedIn.",
    group: "customers",
    oneLiner: "We run your Instagram, Facebook and LinkedIn: posts, reels, replies.",
    needItWhen: "you want your Instagram, Facebook or LinkedIn run properly.",
    example: {
      business: "A café",
      before: "Posts go up when someone remembers, comments go unanswered, and the page looks forgotten.",
      after: "A monthly calendar of posts and reels, approved in advance, and replies to comments within an agreed time.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "social",
    featured: true,
    eyebrow: "Social Media Management",
    lede: "For businesses that post now and then and see nothing come of it. We plan, make and post your content, reply to comments and messages, and show you what it brings in.",
    summary: "We plan, make and post your content, and reply to comments and messages.",
    metaTitle: "Social Media Marketing Agency in Delhi | The Digital Alchemy",
    metaDescription:
      "We run your Instagram, Facebook and LinkedIn: planned posts, reels, captions and replies to comments, with a monthly report. Get a free consultation.",
    whoFor: [
      "You post now and then, and nothing comes of it",
      "Your competitors show up in people's feeds far more than you do",
      "You have plenty worth sharing, but nobody has time to share it",
      "Your social media has never brought you a single enquiry you know of",
    ],
    problems: [
      {
        title: "There is no reason to follow you",
        body: "Accounts that only post company news give people nothing. Useful tips, an opinion, or real personality are what earn attention.",
      },
      {
        title: "The same post goes everywhere",
        body: "Instagram, Facebook and LinkedIn each work differently. Posting the exact same thing on all three shows you are not really there.",
      },
      {
        title: "Posting stops when you get busy",
        body: "Social media is the first thing dropped in a busy month. And the attention you lose takes longer to win back than it did to lose.",
      },
      {
        title: "Nobody replies to comments",
        body: "Replies and messages are where real relationships are built, and they are the part most often left undone.",
      },
    ],
    capabilities: [
      {
        title: "A plan for your social media",
        body: "Which platforms, for which audience, and what you will post about, plus what success means beyond the follower count.",
      },
      {
        title: "A monthly content calendar",
        body: "Posts planned ahead so you stay consistent, with room to react to what is happening. You approve everything before it goes out.",
      },
      {
        title: "Posts and reels",
        body: "Designs and short videos made for each platform's format, in your brand's look.",
      },
      {
        title: "Captions that get read",
        body: "A clear opening line, something worth knowing, and a reason to comment or get in touch.",
      },
      {
        title: "Replies to comments and messages",
        body: "Replies in your voice within an agreed time. Complaints and sales enquiries are passed to the right person on your side quickly.",
      },
      {
        title: "Monthly report",
        body: "Views and engagement, plus the website visits and enquiries your social media actually brought in.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Review",
        body: "We look at your current accounts and at what your competitors do, to find what is worth keeping.",
      },
      {
        step: "02",
        title: "Plan",
        body: "Platforms, topics, tone and how often to post, agreed with you. Then a calendar for each month, ready for your approval.",
      },
      {
        step: "03",
        title: "Make and post",
        body: "Designs, videos and captions made in batches, which keeps quality and consistency together. We post on schedule and reply to comments and messages.",
      },
      {
        step: "04",
        title: "Report and adjust",
        body: "A monthly report and a short call on what to do more of, and less of, next month.",
      },
    ],
    deliverables: [
      "A review of your accounts and competitors",
      "A written plan: platforms, topics and tone",
      "A monthly content calendar for your approval",
      "Designed posts and edited reels",
      "Captions, posting and replies",
      "A monthly report",
    ],
    technologies: ["figma", "meta-ads", "ga4"],
    engagement: ["growth-retainer"],
    faqs: [
      {
        question: "Which platforms should we be on?",
        answer:
          "Wherever your customers already spend their time, which is usually fewer places than you think. Businesses that sell to other businesses often do best on LinkedIn plus one visual platform. Businesses that sell to the public usually do best on Instagram and short videos. We decide after looking at your customers.",
      },
      {
        question: "How often should we post?",
        answer:
          "Often enough to stay familiar, at a pace you can keep up. Three or four strong posts a week beat daily filler, and a pace that collapses after two months does more harm than a slower one that lasts.",
      },
      {
        question: "Do you reply to comments and messages?",
        answer:
          "Yes, in your voice and within an agreed time. At the start we agree which messages go straight to you, like complaints, sensitive topics and sales enquiries.",
      },
      {
        question: "Will you feature our team?",
        answer:
          "If you are willing, yes. Posts with real people from your business usually do better than posts without them. We keep what we ask of your team small and easy to fit into the day.",
      },
      {
        question: "How do we know if it is working?",
        answer:
          "Views and engagement show whether people like the content. Beyond that, we track profile visits, link clicks, website visits and enquiries that mention social media. Social media's effect is real, but only partly measurable, and we say so honestly.",
      },
    ],
    related: ["meta-ads", "branding", "digital-marketing"],
  },

  {
    slug: "search-engine-optimization",
    name: "SEO",
    title: "SEO: showing up on Google when people search for what you sell.",
    group: "customers",
    oneLiner: "Show up on Google when people search for what you sell.",
    needItWhen: "you want free visits from Google that keep coming.",
    example: {
      business: "A CA firm in Janakpuri",
      before: "The firm does not appear when people search “GST registration near me”, even though it does this work every day.",
      after: "Service pages written around what people search for, and a proper Google Business Profile, so the firm has a real chance of appearing in those searches.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "seo",
    eyebrow: "Search Engine Optimisation (SEO)",
    lede: "People are already searching on Google for what you sell. SEO is the work that makes your website one of the answers they find. It brings you visits you do not pay for, month after month.",
    summary: "Free visits from Google, built up by fixing your site and writing what people search for.",
    metaTitle: "SEO Company in Delhi | The Digital Alchemy",
    metaDescription:
      "Show up on Google when people search for what you sell. We fix your site, write what buyers search for and report the enquiries. Get a free consultation.",
    whoFor: [
      "People search for what you sell, but your business does not show up",
      "Your visits from Google have been falling, and nobody knows why",
      "You rebuilt or moved your website and lost your place on Google",
      "You publish articles that never appear in search results",
    ],
    problems: [
      {
        title: "Google cannot read your site properly",
        body: "Blocked pages, duplicate pages, missing titles and broken links hold your site back, however good your content is.",
      },
      {
        title: "You write about things nobody searches for",
        body: "Writing about what interests you, instead of what your customers type into Google, is the most common reason good articles never rank.",
      },
      {
        title: "Rankings go up, but enquiries do not",
        body: "Ranking for popular words that people search out of curiosity brings visits and nothing else. What matters is ranking for the words buyers use.",
      },
      {
        title: "A new website lost your rankings",
        body: "Rebuilding a site without pointing old links to the new pages throws away years of progress. It can usually be recovered, and it can always be avoided.",
      },
    ],
    capabilities: [
      {
        title: "Fixing the technical basics",
        body: "Making sure Google can find, read and understand every page: structure, page addresses, redirects and sitemaps.",
      },
      {
        title: "Finding the words buyers search for",
        body: "The words your customers type into Google, grouped by how close they are to buying, and matched to the right page.",
      },
      {
        title: "Improving your pages",
        body: "Titles, headings, descriptions and links between pages, adjusted so each page clearly answers what people are looking for.",
      },
      {
        title: "Articles that bring buyers",
        body: "A content plan where helpful articles support your main service pages, instead of scattered posts competing with each other.",
      },
      {
        title: "Local SEO",
        body: "Your Google Business Profile, the same name, address and phone number everywhere online, and local pages that say something specific.",
      },
      {
        title: "Earning links honestly",
        body: "Links from other websites, earned through useful content and real relationships. We never buy links or use link networks: the risk to your site is not worth it.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Check your site",
        body: "A full check of your site and your Google Search Console data, to find what is holding you back today.",
      },
      {
        step: "02",
        title: "Research",
        body: "The words your customers search for, and what the sites already ranking for them are doing.",
      },
      {
        step: "03",
        title: "Fix and improve",
        body: "Technical problems fixed in order of impact. Then existing pages improved: pages already on Google's second page are usually the quickest wins.",
      },
      {
        step: "04",
        title: "Write and measure",
        body: "New content from the plan, then a monthly report on visits, rankings and enquiries, which sets the next month's priorities.",
      },
    ],
    deliverables: [
      "A check of your site, with fixes in order of importance",
      "The search words to target, page by page",
      "Improved titles, headings and descriptions",
      "A content plan",
      "Your Google Business Profile set up properly",
      "A monthly report on visits, rankings and enquiries",
    ],
    technologies: ["search-console", "ga4", "gtm", "nextjs", "looker-studio"],
    engagement: ["growth-retainer", "project"],
    faqs: [
      {
        question: "How long does SEO take to work?",
        answer:
          "Technical fixes can show within weeks. Content and building trust with Google take months: usually three to six before the trend is clear, and longer in competitive fields. Anyone offering results in thirty days is describing paid ads, or something that will not last.",
      },
      {
        question: "Can you guarantee first-page rankings?",
        answer:
          "No, and any agency that does is either misleading you or planning to rank you for words nobody searches. Google decides its results, not us. We commit to fixing what is clearly broken, targeting words buyers use, and reporting honestly.",
      },
      {
        question: "Do you buy links?",
        answer:
          "No. We earn links through useful content and real relationships. Bought links can work briefly, then put your whole site at risk in a way that is expensive to undo.",
      },
      {
        question: "Is local SEO different?",
        answer:
          "Yes. For businesses serving one area, local results depend heavily on your Google Business Profile, the same contact details everywhere online, how close you are to the searcher, and your reviews. That work often matters more than anything else.",
      },
      {
        question: "Our Google visits dropped suddenly. Can you help?",
        answer:
          "Yes. A sudden drop usually comes from a technical change, a site move without redirects, a penalty, or a change in how Google ranks sites. We find which one before suggesting any work.",
      },
    ],
    related: ["web-development", "google-ads", "digital-marketing"],
  },

  {
    slug: "performance-marketing",
    name: "Performance Marketing",
    title: "Performance marketing: paid ads where every rupee is tracked.",
    group: "customers",
    oneLiner: "Paid ads where every rupee is tracked against leads and sales.",
    needItWhen: "you want paid ads on more than one platform, measured together.",
    example: {
      business: "A builder launching a new housing project",
      before: "Different people run the Google and Facebook ads, and nobody can say what one enquiry costs.",
      after: "One plan across Google, Facebook and Instagram, every enquiry tracked, and budget moved each week to whatever brings enquiries at the lowest cost.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "performance",
    eyebrow: "Performance Marketing",
    lede: "For businesses spending on ads without knowing what they get back. We run your Google, Facebook and Instagram ads together. We judge them on one thing: the enquiries and sales they bring, and what each one costs.",
    summary: "Google, Facebook and Instagram ads run together, and judged on the cost of each enquiry or sale.",
    metaTitle: "Performance Marketing Agency in India | The Digital Alchemy",
    metaDescription:
      "Google, Facebook and Instagram ads run together, with every rupee tracked against the enquiries and sales it brings. Get a free consultation.",
    whoFor: [
      "You spend on ads, but cannot tell what you get back",
      "Each enquiry costs more than it used to, and nobody knows why",
      "Your ads get clicks, but the page they land on does not bring enquiries",
      "You have only ever run whatever the ad platform suggested",
    ],
    problems: [
      {
        title: "Tracking is wrong or missing",
        body: "If the ad platform is aiming at the wrong goal, more budget buys more of the wrong result. We check this first, and it is often the whole problem.",
      },
      {
        title: "Your campaigns compete with each other",
        body: "Overlapping audiences and budgets split too thin stop the platform learning who to show your ads to. That raises what you pay.",
      },
      {
        title: "The same ads have run for months",
        body: "On Facebook and Instagram, the ad itself now does most of the work. Showing the same few ads for months means costs keep rising.",
      },
      {
        title: "The ad and the page say different things",
        body: "A specific ad that sends people to your general homepage wastes the click you just paid for. The page has to continue what the ad started.",
      },
    ],
    capabilities: [
      {
        title: "A plan built on your numbers",
        body: "Campaigns set up around what a customer is worth to you and how you sell, so the platforms aim at results that matter.",
      },
      {
        title: "Google Ads",
        body: "Search, Shopping and YouTube ads, each used only where it fits your business.",
      },
      {
        title: "Facebook and Instagram ads",
        body: "Campaigns built around testing new ads regularly, rather than narrow targeting by hand.",
      },
      {
        title: "Tracking that shows what you get back",
        body: "Every enquiry and sale tracked on each platform, with a value attached, so you can see what each rupee returns.",
      },
      {
        title: "Landing pages",
        body: "A page for each campaign that matches the ad, loads fast, and makes the next step obvious.",
      },
      {
        title: "Budget and reporting",
        body: "Budget moved to what brings enquiries at a good cost, and a report of spend, results, and what we changed and why.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Review",
        body: "We check your ad accounts, your tracking and your pages. We fix the tracking before we touch the budget.",
      },
      {
        step: "02",
        title: "Plan and build",
        body: "Targets set from your numbers. Then campaigns, audiences, ads and landing pages built and checked before launch.",
      },
      {
        step: "03",
        title: "Launch",
        body: "A controlled start, with enough budget for the platforms to learn instead of starving them.",
      },
      {
        step: "04",
        title: "Improve and grow",
        body: "Weekly changes to ads, bids and audiences. Spend goes up only where the cost per enquiry holds; what does not earn its place is cut.",
      },
    ],
    deliverables: [
      "A review of your ad accounts and tracking",
      "Campaigns and targets built from your numbers",
      "Tracking of every enquiry and sale",
      "Campaigns on the platforms we agree",
      "A landing page for each campaign",
      "Weekly changes and a monthly report",
    ],
    technologies: ["google-ads", "meta-ads", "ga4", "gtm", "looker-studio"],
    engagement: ["growth-retainer"],
    faqs: [
      {
        question: "What is the smallest budget worth starting with?",
        answer:
          "Enough for the platforms to learn. As a rough guide, each campaign needs thirty to fifty enquiries or sales a month before its results become reliable. Below that, results are mostly chance. What that means in rupees depends on what an enquiry costs in your field, which we work out together.",
      },
      {
        question: "Google Ads or Facebook and Instagram ads?",
        answer:
          "Google reaches people already searching for what you sell, so they are closer to buying, but there are only as many of them as there are searches. Facebook and Instagram reach people who are not looking yet, so you can reach many more, and the ad itself does more of the work. Most businesses with budget for both use both, for different jobs.",
      },
      {
        question: "How do you charge?",
        answer:
          "A management fee based on the work involved, not a share of your ad spend. Charging a share of spend rewards spending more, which is not always the right advice.",
      },
      {
        question: "Do we keep the ad accounts?",
        answer:
          "Yes. The accounts are in your business's name, and we are given access. Your spend history, tracking data and audiences stay yours.",
      },
      {
        question: "How soon will we know if it is working?",
        answer:
          "Early signs within one to two weeks, and a reliable picture within four to six. Judging in the first few days leads to changes that restart the platform's learning and make things worse.",
      },
    ],
    related: ["google-ads", "meta-ads", "marketing-funnels"],
  },

  {
    slug: "google-ads",
    name: "Google Ads",
    title: "Google Ads that bring you enquiries from people ready to buy.",
    group: "customers",
    oneLiner: "Ads on Google search and YouTube that bring ready-to-buy customers.",
    needItWhen: "people already search on Google for what you sell.",
    example: {
      business: "An AC repair service",
      before: "Ads show for broad words like “AC”, so money goes on people looking for new ACs, prices and jobs.",
      after: "Ads shown for searches like “AC repair near me”, the other searches excluded, and every call tracked.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "google-ads",
    eyebrow: "Google Ads",
    lede: "For businesses whose customers search on Google for what they sell. Your ad appears when someone searches for exactly what you offer, and you pay when they click. We make sure those clicks come from buyers, not browsers.",
    summary: "Ads on Google search, Shopping and YouTube, shown to people already searching for what you sell.",
    metaTitle: "Google Ads Agency in Delhi | The Digital Alchemy",
    metaDescription:
      "Your ad at the top of Google when people search for what you sell. We run your Google Ads and report every enquiry. Get a free consultation.",
    whoFor: [
      "Your customers search on Google for what you sell",
      "You pay more per click than before, without more enquiries",
      "You run Google's automatic campaigns and cannot see where the money goes",
      "You sell products online and your Google Shopping ads are not set up well",
    ],
    problems: [
      {
        title: "Money goes on searches that never buy",
        body: "Without a careful list of words to exclude, your ads quietly show for many unrelated searches, and you pay for every one of those clicks.",
      },
      {
        title: "Automatic campaigns are a black box",
        body: "Google's automatic campaigns can work well, but only when they are set up properly. Left on default settings, they often spend on people who were going to find you anyway.",
      },
      {
        title: "You pay more per click than competitors",
        body: "When your search words, ads and landing page do not match closely, Google charges you more for the same position.",
      },
      {
        title: "Every enquiry is counted as equal",
        body: "Counting a serious enquiry the same as a job application hides what your ads really bring. Giving each result a value fixes this.",
      },
    ],
    capabilities: [
      {
        title: "Search ads",
        body: "The words your customers search for, grouped carefully, with a list of words to exclude that we keep up to date.",
      },
      {
        title: "Shopping ads",
        body: "Your products shown with photo and price on Google, with the product list set up so the right products get the budget.",
      },
      {
        title: "Automatic campaigns, set up properly",
        body: "Google's automatic campaigns run with the right settings and exclusions, so they add new customers instead of repeating what search already brings.",
      },
      {
        title: "YouTube ads and showing ads again",
        body: "YouTube for awareness, and ads shown again to people who visited without enquiring, without following them around too often.",
      },
      {
        title: "Tracking every enquiry",
        body: "Every call, form and sale tracked with a value, including sales that close later by phone or in person.",
      },
      {
        title: "Pages that match the ad",
        body: "Landing pages that keep the ad's promise, load quickly, and remove anything that distracts from getting in touch.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Review your account",
        body: "Your campaigns, search words, tracking and wasted spend checked in detail, and everything we find shared with you.",
      },
      {
        step: "02",
        title: "Rebuild",
        body: "Campaigns reorganised around what buyers search for, with tracking fixed before any spending changes.",
      },
      {
        step: "03",
        title: "Launch",
        body: "New campaigns and ads go live, with landing pages that match what each ad promises.",
      },
      {
        step: "04",
        title: "Improve and grow",
        body: "Every week we check the searches you paid for, exclude poor ones, test new ads and adjust bids. Budget grows only where the cost per enquiry holds.",
      },
    ],
    deliverables: [
      "A full review of your account, showing wasted spend",
      "Rebuilt campaigns",
      "Search words to target and to exclude",
      "Ads that we keep testing",
      "Tracking of every enquiry and sale",
      "Matching landing pages, weekly changes and a monthly report",
    ],
    technologies: ["google-ads", "ga4", "gtm", "search-console", "looker-studio"],
    engagement: ["growth-retainer"],
    faqs: [
      {
        question: "Can you check our existing account first?",
        answer:
          "Yes, and it is usually the right place to start. A review shows where money is being wasted, whether your tracking can be trusted and what is realistic, before either of us commits to more.",
      },
      {
        question: "Should we pay for ads on our own business name?",
        answer:
          "It depends. If competitors advertise on your name, often yes. If nobody does, and you already appear first on Google for free, those ads often buy clicks you would have got anyway. We check before deciding.",
      },
      {
        question: "Why did our costs go up?",
        answer:
          "Usually more competition, the season, a drop in how relevant Google judges your ads, or a change that restarted the campaign's learning. The account's history normally shows which one.",
      },
      {
        question: "Are Google's automatic campaigns worth using?",
        answer:
          "For online stores with a good product list, often yes. For enquiries, they need careful handling: clean tracking, the right exclusions and realistic values. Otherwise they chase the cheapest enquiries, not the best ones.",
      },
    ],
    related: ["search-engine-optimization", "meta-ads", "marketing-funnels"],
  },

  {
    slug: "meta-ads",
    name: "Meta Ads",
    title: "Facebook and Instagram ads that reach people before they search.",
    group: "customers",
    oneLiner: "Facebook and Instagram ads that reach the right people.",
    needItWhen: "people would buy if they saw you, but are not searching yet.",
    example: {
      business: "A home bakery",
      before: "The same cake photo has been boosted for months, and fewer people react to it each time.",
      after: "New ad ideas every month, shown to people nearby. The ones that bring orders are kept, and the rest are stopped.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "meta-ads",
    eyebrow: "Meta Ads (Facebook & Instagram)",
    lede: "Facebook and Instagram reach people before they start looking. That means the ad itself has to earn their attention, then send them to a page that keeps its promise. We make the ads, test them and keep the ones that work.",
    summary: "Facebook and Instagram ads, made and tested regularly, and judged on enquiries and sales.",
    metaTitle: "Facebook & Instagram Ads Agency | The Digital Alchemy",
    metaDescription:
      "Facebook and Instagram ads that reach people who would buy from you but are not searching yet. We make, test and improve the ads. Get a free consultation.",
    whoFor: [
      "You sell to the public and want more buyers than Google searches can bring",
      "Your customers do not search for what you sell until they see it",
      "Your ad results dropped and you are not sure why",
      "You have shown the same ads for months while costs kept rising",
    ],
    problems: [
      {
        title: "People get tired of your ads",
        body: "When the same people see the same ad too often, results fall. Without a steady supply of new ads, the account slowly gets worse.",
      },
      {
        title: "Tracking changes made results look worse",
        body: "Changes to phone and browser privacy reduced what ad platforms can see. Setting up tracking properly recovers a good part of it.",
      },
      {
        title: "Your audience is cut too thin",
        body: "Narrow targeting by hand starves the platform of what it needs to learn. Broader targeting with strong ads now usually does better.",
      },
      {
        title: "You get enquiries, but not buyers",
        body: "Very easy forms bring lots of weak enquiries. Adding a few questions and a clearer offer means fewer, better ones, costing more per enquiry but less per customer.",
      },
    ],
    capabilities: [
      {
        title: "Ideas for ads",
        body: "Ads built on different angles, like the problem, proof, a common doubt or an offer, so every test teaches you something.",
      },
      {
        title: "Making the ads",
        body: "Image and video ads made for people scrolling on their phone, and enough of them to keep testing.",
      },
      {
        title: "Simple campaign setup",
        body: "Few, clear campaigns that let the platform learn, with separate campaigns for new people and for people who already know you.",
      },
      {
        title: "Enquiry and sales campaigns",
        body: "Campaigns aimed at the result that actually leads to sales, with forms or landing pages depending on which brings better enquiries.",
      },
      {
        title: "Showing ads again",
        body: "Ads shown again to people who engaged, depending on how interested they were, and never shown so often that they annoy.",
      },
      {
        title: "Tracking set up properly",
        body: "The Meta Pixel and its server connection set up correctly, so the platform learns from real enquiries and sales.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Review",
        body: "Your account, tracking and past ads checked, to see what has already been learned.",
      },
      {
        step: "02",
        title: "Set up tracking",
        body: "Tracking set up for every step from click to enquiry or sale, and checked end to end.",
      },
      {
        step: "03",
        title: "Make and test",
        body: "A first batch of ads on different angles, then testing with enough budget behind each to find what really works.",
      },
      {
        step: "04",
        title: "Grow",
        body: "What works gets more budget, and new versions are made all the time, so results do not drop as people tire of old ads.",
      },
    ],
    deliverables: [
      "A review of your account and tracking",
      "Tracking set up properly",
      "A plan of ad ideas to test",
      "Image and video ads",
      "Campaigns, audiences and repeat ads for past visitors",
      "Regular testing and a monthly report",
    ],
    technologies: ["meta-ads", "ga4", "gtm", "figma"],
    engagement: ["growth-retainer"],
    faqs: [
      {
        question: "How many new ads do we need?",
        answer:
          "More than most businesses make. Several new ideas a month, each in a few versions, is a pace you can keep up. Accounts that stop making new ads usually see costs rise within weeks.",
      },
      {
        question: "Do Facebook and Instagram ads work for businesses that sell to other businesses?",
        answer:
          "They can, when the sale is quick and the audience is easy to describe. For big, slow sales, they usually work better for building awareness and reminding people, alongside Google, than as the main source of enquiries.",
      },
      {
        question: "Our enquiries are poor quality. What changes?",
        answer:
          "Usually the offer and the questions on the form. Adding a few qualifying questions, and pitching the offer to buyers rather than browsers, raises the cost of each enquiry and lowers the cost of each customer. That is the right trade.",
      },
      {
        question: "Can you make the videos?",
        answer:
          "Yes, including editing videos you already have, which is often the quickest way to get enough ads to test. For new filming, we plan and coordinate the shoot.",
      },
    ],
    related: ["social-media-management", "performance-marketing", "google-ads"],
  },

  {
    slug: "lead-generation",
    name: "Lead Generation",
    title: "Lead generation: a steady flow of enquiries from the right people.",
    group: "customers",
    oneLiner: "A steady flow of enquiries from people interested in your service.",
    needItWhen: "you need a steady flow of enquiries, not just referrals.",
    example: {
      business: "An interior design firm",
      before: "Work comes only from referrals, and the website form gets a few messages a month, mostly from job seekers.",
      after: "A free design consultation offer, a page and ads built around it, and every enquiry sent straight to WhatsApp with the details attached.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "leadgen",
    eyebrow: "Lead Generation",
    lede: "For businesses that rely on word of mouth, or get enquiries that are mostly the wrong fit. We bring you enquiries from people who are genuinely interested, and get them to your team fast, with the details needed to follow up.",
    summary: "More enquiries from the right people, delivered to your team quickly with the details attached.",
    metaTitle: "Lead Generation Company in India | The Digital Alchemy",
    metaDescription:
      "A steady flow of enquiries from people interested in your service, sent to your team fast with the details to follow up. Get a free consultation.",
    whoFor: [
      "Your new business comes only from referrals",
      "The enquiries you get are mostly the wrong fit",
      "Enquiries wait days before anyone replies",
      "You cannot say what each enquiry costs you",
    ],
    problems: [
      {
        title: "You ask for too much, too soon",
        body: "Booking a meeting is a big step for someone still looking around. A smaller first step, like a free guide or a quick check, catches people who would otherwise leave.",
      },
      {
        title: "Your team talks to the wrong people",
        body: "Time spent on enquiries that will never buy is the most expensive waste of all. A few well-chosen questions on the form filter them out.",
      },
      {
        title: "Replies take days",
        body: "How fast you reply makes a big difference. If an enquiry waits until tomorrow, a competitor has usually replied already.",
      },
      {
        title: "Nobody knows which source brings customers",
        body: "Without tracking from the first click to the final sale, budget goes to whatever brings the most enquiries, not the most customers.",
      },
    ],
    capabilities: [
      {
        title: "An offer worth responding to",
        body: "Something worth giving contact details for, matched to how ready people are: a free check, a guide, a tool or a consultation.",
      },
      {
        title: "Pages made for one offer",
        body: "A focused page for one audience and one offer, where the form and the reasons to fill it in do all the work.",
      },
      {
        title: "Bringing the right visitors",
        body: "Ads and Google bringing people to that page, with the ads and the page planned together.",
      },
      {
        title: "Filtering out poor enquiries",
        body: "Form questions that separate likely buyers from people just browsing, before your team spends time on them.",
      },
      {
        title: "Fast delivery to your team",
        body: "Each enquiry sent straight to your customer list app, WhatsApp or email, with its source and answers attached, and the right person alerted at once.",
      },
      {
        title: "Follow-up and reporting",
        body: "Automatic follow-up for people who are interested but not ready, and reports on what each good enquiry and each customer cost.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Define a good enquiry",
        body: "Who your ideal customer is, and what makes an enquiry worth your team's time.",
      },
      {
        step: "02",
        title: "Build the offer",
        body: "An offer and a page made for that audience.",
      },
      {
        step: "03",
        title: "Bring visitors and set up delivery",
        body: "Campaigns launched to the page, and enquiries sent to your team automatically. Every step tested before it matters.",
      },
      {
        step: "04",
        title: "Improve",
        body: "The offer, page and targeting improved over time, judged on what each good enquiry costs.",
      },
    ],
    deliverables: [
      "A clear picture of your ideal customer",
      "An offer and the material that goes with it",
      "Landing pages with filtering questions",
      "Campaigns on the channels we agree",
      "Enquiries sent straight to your team",
      "Automatic follow-up and a monthly report",
    ],
    technologies: ["ga4", "gtm", "google-ads", "meta-ads", "nextjs"],
    engagement: ["growth-retainer", "project"],
    faqs: [
      {
        question: "Can you guarantee a number of enquiries?",
        answer:
          "No. The number depends on your budget, your market, your offer and your own follow-up, and we control only part of that. Once campaigns have run, we can give you a realistic range from real results. We would rather set an honest expectation than promise a number to win the work.",
      },
      {
        question: "Do you buy lists of contacts?",
        answer:
          "No. Bought lists rarely turn into customers, damage your email reputation and create legal problems. Every enquiry we bring comes from someone who chose to contact you.",
      },
      {
        question: "Can enquiries go into the app we already use?",
        answer:
          "Yes. We connect to the app where you keep your customer list, such as HubSpot, Zoho or Salesforce, or to WhatsApp and email.",
      },
      {
        question: "What if our team cannot handle the number of enquiries?",
        answer:
          "Then we filter harder, rather than bring in more. More weak enquiries than your team can handle is worse than fewer, better ones, and it is a common way lead generation goes wrong.",
      },
    ],
    related: ["marketing-funnels", "automation-integrations", "google-ads"],
  },

  {
    slug: "marketing-funnels",
    name: "Marketing Funnels",
    title: "Marketing funnels that turn interested visitors into buyers.",
    group: "customers",
    oneLiner: "A step-by-step path (ad → page → WhatsApp/email follow-up) that turns visitors into buyers.",
    needItWhen: "people show interest, but not enough of them buy.",
    example: {
      business: "An online course creator",
      before: "Ads send people straight to a payment page. Most leave, and nobody follows up.",
      after: "An ad, then a free class, then WhatsApp reminders, then the payment page. People who were not ready are followed up automatically.",
    },
    // {{TODO: real starting price, e.g. "₹60,000"}} Or set it in Admin → Page copy.
    priceFrom: "",
    // {{TODO: typical timeline, e.g. "4 to 8 weeks"}} Or set it in Admin → Page copy.
    typicalTimeline: "",
    visual: "funnels",
    eyebrow: "Marketing Funnels",
    lede: "Most people who are interested do not buy on their first visit. A funnel is the plan for what happens next: the ad, the page, and the WhatsApp or email follow-up. It brings people back, instead of hoping they return on their own.",
    summary: "A planned path from first click to purchase, with follow-up for everyone not ready yet.",
    metaTitle: "Sales Funnel Agency in India | The Digital Alchemy",
    metaDescription:
      "A step-by-step path from ad to page to WhatsApp or email follow-up, that turns interested visitors into buyers. Get a free consultation.",
    whoFor: [
      "Plenty of people visit, but few of them buy",
      "What you sell takes some thought, and nobody follows up between visits",
      "You have a list of contacts, but never use it properly",
      "All your ads lead to one general page",
    ],
    problems: [
      {
        title: "There is only one step, and it is a big one",
        body: "If the only option is to buy now or book a meeting, you lose everyone who is not ready today, which is nearly everyone.",
      },
      {
        title: "There is no follow-up",
        body: "Interest fades quickly. Without planned follow-up after the first visit, most of the attention you paid for is wasted.",
      },
      {
        title: "Nobody knows where people drop out",
        body: "Without measuring each step, teams fix whichever step feels weakest, not the one actually losing the most people.",
      },
      {
        title: "The message changes at every step",
        body: "An ad promising one thing, a page describing another and an email about a third loses the reader.",
      },
    ],
    capabilities: [
      {
        title: "Planning the path",
        body: "Mapping how people really decide to buy what you sell, then planning each step that moves them forward.",
      },
      {
        title: "Pages for each step",
        body: "Pages made for one audience and one action, tested against other versions rather than assumed to work.",
      },
      {
        title: "A small first step",
        body: "Something small enough to say yes to and useful enough to want, like a free class, a guide or a quick check.",
      },
      {
        title: "WhatsApp and email follow-up",
        body: "Follow-up messages that are useful enough to open, spread out to match how long your customers take to decide.",
      },
      {
        title: "Showing ads again",
        body: "Ads matched to how far someone got, so the message moves forward instead of repeating itself.",
      },
      {
        title: "Measuring every step",
        body: "Each step measured, so the weak point is a fact rather than an opinion, and messages sent automatically without anyone having to remember.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Map today's path",
        body: "How people reach you today, drawn from real data, including where they leave.",
      },
      {
        step: "02",
        title: "Design the new path",
        body: "Each step planned, with the message for each one written out.",
      },
      {
        step: "03",
        title: "Build and test",
        body: "Pages, forms, messages and automatic follow-up built and tested from start to finish before any visitors arrive, with every step measured from day one.",
      },
      {
        step: "04",
        title: "Improve",
        body: "Ongoing testing on the step losing the most people, because that is where improvements pay back most.",
      },
    ],
    deliverables: [
      "A map of today's path, showing where people leave",
      "A designed path, with the message for each step",
      "Landing pages and forms",
      "WhatsApp and email follow-up, sent automatically",
      "Ads for people who did not finish",
      "Step-by-step measurement and ongoing testing",
    ],
    technologies: ["nextjs", "ga4", "gtm", "meta-ads", "google-ads"],
    engagement: ["growth-retainer", "project"],
    faqs: [
      {
        question: "Is a funnel just a landing page?",
        answer:
          "No. A landing page is one step. A funnel is the whole path: what brings someone there, what they do next, what happens if they leave, and how they are followed up. Most problems are in the steps after the page.",
      },
      {
        question: "How many visitors do we need for testing?",
        answer:
          "Enough for a result to mean something. As a rough guide, a few hundred enquiries or sales for each version tested. Below that, we improve using well-reasoned design changes instead of pretending a small test proved something.",
      },
      {
        question: "Does this work when customers take months to decide?",
        answer:
          "Especially well. Long decisions are exactly where interest goes cold without follow-up. The messages simply run over months instead of days.",
      },
      {
        question: "Can follow-up happen on WhatsApp?",
        answer:
          "Yes. WhatsApp, email or both, depending on where your customers actually reply.",
      },
    ],
    related: ["lead-generation", "performance-marketing", "automation-integrations"],
  },
];
