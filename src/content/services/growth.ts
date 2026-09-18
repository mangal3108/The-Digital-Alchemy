import type { Service } from "./types";

export const growthServices: Service[] = [
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    title: "Marketing engineered for measurable growth.",
    group: "growth",
    visual: "marketing",
    eyebrow: "Digital Marketing",
    lede: "Channels are not a strategy. We start from what a customer is worth and how they currently find you, then build the mix that produces more of them — and the measurement that proves whether it did.",
    summary:
      "Strategy, channels and measurement joined up, so spend is judged on revenue rather than reach.",
    metaTitle: "Digital Marketing Services | The Digital Alchemy",
    metaDescription:
      "Digital marketing strategy and execution — SEO, paid media, content, social, funnels, conversion optimisation and analytics, measured against pipeline rather than impressions.",
    whoFor: [
      "Businesses spending on marketing without knowing which part works",
      "Companies with good traffic and disappointing enquiry volume",
      "Teams running channels separately with no shared view of the result",
      "Founders doing marketing themselves and out of hours to give it",
    ],
    problems: [
      {
        title: "Reporting measures activity, not outcomes",
        body: "Impressions, followers and clicks are inputs. If reporting stops there, nobody can tell a channel that generates revenue from one that generates noise.",
      },
      {
        title: "Channels are run in isolation",
        body: "Search, social and email compete for budget instead of supporting one another. The customer experiences one brand; the marketing should behave that way.",
      },
      {
        title: "Traffic arrives and leaves",
        body: "When traffic is healthy and enquiries are not, the problem is usually the page rather than the channel — and more budget makes it worse, not better.",
      },
      {
        title: "Attribution is broken",
        body: "Without correct tracking and a documented definition of a lead, budget decisions are made on incomplete data and defended on instinct.",
      },
    ],
    capabilities: [
      {
        title: "Digital strategy",
        body: "Audience, positioning, channel mix and budget allocation, grounded in what a customer is actually worth to you.",
      },
      {
        title: "Search visibility",
        body: "Technical and content work to earn durable organic traffic. Slower than paid, and the only channel whose cost per visit falls over time.",
      },
      {
        title: "Paid media",
        body: "Google and Meta campaigns built around intent and audience rather than around whatever the platform recommends by default.",
      },
      {
        title: "Content",
        body: "The articles, pages and assets that answer real buying questions, planned around topics rather than isolated keywords.",
      },
      {
        title: "Social media",
        body: "Consistent presence on the platforms where your audience is, with content designed for each rather than cross-posted.",
      },
      {
        title: "Funnels and landing pages",
        body: "The pages campaigns point at, built to match the promise in the ad and to make the next step obvious.",
      },
      {
        title: "Conversion optimisation",
        body: "Structured improvement of the pages where demand is already arriving, which is usually cheaper than buying more of it.",
      },
      {
        title: "Email and retention",
        body: "Nurture sequences and lifecycle messaging for the majority of people who are interested but not ready today.",
      },
      {
        title: "Analytics and reporting",
        body: "Tracking implemented correctly, definitions agreed, and reporting that connects spend to pipeline instead of to reach.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Audit",
        body: "Current channels, tracking, funnel and unit economics reviewed. Fixing measurement usually comes before spending more.",
      },
      {
        step: "02",
        title: "Strategy",
        body: "Priorities, budget allocation and targets agreed in writing, including what we expect not to work.",
      },
      {
        step: "03",
        title: "Foundations",
        body: "Tracking, landing pages and creative in place before the budget scales.",
      },
      {
        step: "04",
        title: "Launch",
        body: "Campaigns and content go live, deliberately structured so early results are readable.",
      },
      {
        step: "05",
        title: "Optimise",
        body: "Regular review cycles acting on the data — reallocating budget, cutting what is not working, scaling what is.",
      },
      {
        step: "06",
        title: "Report",
        body: "A clear monthly view of spend, results and what changes next, with the reasoning shown.",
      },
    ],
    deliverables: [
      "Channel and tracking audit",
      "Documented strategy with budget allocation",
      "Conversion tracking implementation",
      "Campaign and content calendar",
      "Landing pages and creative assets",
      "Monthly performance reporting",
      "Quarterly strategy review",
    ],
    technologies: [
      "ga4",
      "search-console",
      "gtm",
      "google-ads",
      "meta-ads",
      "looker-studio",
    ],
    engagement: ["growth-retainer", "project"],
    faqs: [
      {
        question: "How much should we spend on digital marketing?",
        answer:
          "The useful way to answer that is from the other end: what a customer is worth to you, what proportion of that you can spend to acquire one, and how many you need. Percentage-of-revenue rules of thumb are common but they ignore your margins and sales cycle. We work the numbers with you during the audit.",
      },
      {
        question: "How quickly will we see results?",
        answer:
          "Paid channels produce data within days and meaningful optimisation within weeks. Search and content are measured in months. Any agency promising fast organic results is describing something that either does not last or is not organic.",
      },
      {
        question: "Do you guarantee leads?",
        answer:
          "No. Lead volume depends on your offer, pricing, market and sales follow-up as much as on marketing, and we do not control all of those. What we commit to is a measured approach, honest reporting and clear reasoning for every change we make.",
      },
      {
        question: "Do we need to be on every platform?",
        answer:
          "Almost certainly not. Most businesses do better concentrating on two or three channels properly than spreading thinly across six. Part of the strategy work is deciding what to ignore.",
      },
      {
        question: "Who owns the ad accounts?",
        answer:
          "You do. Accounts are created in your business's name with us granted access. If the relationship ends, your data, history and audiences stay with you.",
      },
    ],
    related: [
      "performance-marketing",
      "search-engine-optimization",
      "social-media-management",
      "lead-generation",
      "marketing-funnels",
    ],
    ctaLabel: "Request a Marketing Review",
    featured: true,
  },

  {
    slug: "social-media-management",
    name: "Social Media",
    title: "A social presence that compounds instead of resetting.",
    group: "growth",
    visual: "social",
    eyebrow: "Social Media Management",
    lede: "Posting consistently is the easy part. Building a presence that produces recognition, conversation and eventually enquiries takes a strategy for what you talk about and why anyone should care.",
    summary:
      "Strategy, content production, publishing and community management across the platforms that matter.",
    metaTitle: "Social Media Management Services | The Digital Alchemy",
    metaDescription:
      "Social media management — strategy, content calendars, design and short-form video, copywriting, scheduling, community management and performance reporting.",
    whoFor: [
      "Businesses posting inconsistently and seeing nothing come of it",
      "Brands whose competitors are visibly more present in the same feed",
      "Companies with something worth saying and nobody with time to say it",
      "Teams whose social activity has never been connected to any business result",
    ],
    problems: [
      {
        title: "There is no reason for anyone to follow",
        body: "Accounts that only announce company news give the audience nothing. A point of view, useful knowledge or genuine personality is what earns attention.",
      },
      {
        title: "The same post goes everywhere",
        body: "Each platform has its own format and expectations. Cross-posting identical content signals absence rather than presence.",
      },
      {
        title: "Consistency collapses when things get busy",
        body: "Social is the first thing dropped in a busy month, and the momentum lost takes longer to rebuild than it did to lose.",
      },
      {
        title: "Nobody responds to comments",
        body: "Community management is where most of the actual relationship is built, and it is the part most often left undone.",
      },
    ],
    capabilities: [
      {
        title: "Social strategy",
        body: "Which platforms, for which audience, with which content pillars — and what success looks like beyond follower count.",
      },
      {
        title: "Content calendar",
        body: "A planned schedule with enough structure to stay consistent and enough slack to react to what is happening.",
      },
      {
        title: "Graphic design",
        body: "On-brand templates and original graphics designed for each platform's format rather than resized between them.",
      },
      {
        title: "Short-form video",
        body: "Concepting, scripting and editing for the formats that currently carry the most organic reach.",
      },
      {
        title: "Copywriting",
        body: "Captions written to be read — a clear hook, something worth knowing, and a reason to engage.",
      },
      {
        title: "Scheduling and publishing",
        body: "Approval workflow and scheduled publishing, so nothing goes out unreviewed and nothing is missed.",
      },
      {
        title: "Community management",
        body: "Replying to comments and messages in your voice, within an agreed response window, with escalation rules for anything sensitive.",
      },
      {
        title: "Influencer and creator campaigns",
        body: "Identification, outreach, briefing and measurement, where the audience fit genuinely justifies it.",
      },
      {
        title: "Analytics and reporting",
        body: "Reach and engagement in context, plus the traffic and enquiries social actually contributes.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Audit",
        body: "Current accounts, performance and competitor activity reviewed to find what is worth continuing.",
      },
      {
        step: "02",
        title: "Strategy",
        body: "Platforms, content pillars, tone and posting cadence agreed with you.",
      },
      {
        step: "03",
        title: "Plan",
        body: "A monthly calendar produced in advance for your review and approval.",
      },
      {
        step: "04",
        title: "Produce",
        body: "Design, video and copy created in batches, which is what keeps quality and consistency together.",
      },
      {
        step: "05",
        title: "Publish and engage",
        body: "Scheduled publishing plus active community management within the agreed window.",
      },
      {
        step: "06",
        title: "Review",
        body: "Monthly reporting and a working session on what to do more and less of next month.",
      },
    ],
    deliverables: [
      "Social audit and competitor review",
      "Documented strategy and content pillars",
      "Monthly content calendar for approval",
      "Designed graphics and edited video",
      "Written captions and hashtag approach",
      "Scheduled publishing and community management",
      "Monthly performance report",
    ],
    technologies: ["figma", "meta-ads", "ga4"],
    engagement: ["growth-retainer"],
    faqs: [
      {
        question: "Which platforms should we be on?",
        answer:
          "Wherever your buyers already spend attention, which is usually fewer places than you think. For most B2B businesses that is LinkedIn plus one visual platform; for consumer brands it is typically Instagram and short-form video. We recommend after looking at your audience rather than by default.",
      },
      {
        question: "How often should we post?",
        answer:
          "Consistently enough to stay familiar, at a volume you can sustain. Three or four strong posts a week beats daily filler, and a cadence that collapses after two months does more harm than a slower one that holds.",
      },
      {
        question: "Do you handle replies and messages?",
        answer:
          "Yes, within an agreed response window and in your voice. We set escalation rules at the start so complaints, sensitive topics and sales enquiries reach the right person on your side quickly.",
      },
      {
        question: "Will you use our team in content?",
        answer:
          "Where you are willing, yes — content featuring real people from the business consistently outperforms brand-only content. We keep the production requirement small and workable rather than turning it into a second job.",
      },
      {
        question: "How do you measure whether it is working?",
        answer:
          "Engagement and reach show whether the content lands. Beyond that we track profile visits, link clicks, referred traffic and enquiries that mention social. We are honest about attribution here: social's influence is real and only partly measurable.",
      },
    ],
    related: [
      "digital-marketing",
      "branding",
      "meta-ads",
      "performance-marketing",
      "lead-generation",
    ],
    ctaLabel: "Plan Our Social Presence",
    featured: true,
  },

  {
    slug: "search-engine-optimization",
    name: "SEO",
    title: "Turning search demand into sustainable growth.",
    group: "growth",
    visual: "seo",
    eyebrow: "Search Engine Optimisation",
    lede: "People are already searching for what you sell. SEO is the work of being the credible answer when they do — technically sound, genuinely useful, and structured so search engines can understand it.",
    summary:
      "Technical foundations, content built around real demand, and reporting that shows commercial impact.",
    metaTitle: "SEO Services | The Digital Alchemy",
    metaDescription:
      "Technical SEO, on-page optimisation, keyword and competitor research, content strategy, local and international SEO, and Core Web Vitals.",
    whoFor: [
      "Businesses invisible for the terms their customers actually search",
      "Companies whose organic traffic has been declining without explanation",
      "Sites recently migrated or rebuilt that lost visibility in the process",
      "Teams publishing content that never ranks",
    ],
    problems: [
      {
        title: "The site cannot be crawled or understood properly",
        body: "Blocked pages, duplicate URLs, missing canonicals, thin metadata and broken internal links cap performance regardless of content quality.",
      },
      {
        title: "Content targets terms nobody searches",
        body: "Writing about what you find interesting rather than what people look for is the most common reason good content never ranks.",
      },
      {
        title: "Rankings improve but revenue does not",
        body: "Ranking for high-volume terms with no buying intent produces traffic and nothing else. Intent matters more than volume.",
      },
      {
        title: "A migration lost the visibility",
        body: "Rebuilds without a redirect map discard years of accumulated authority. It is usually recoverable, and the recovery is avoidable work.",
      },
    ],
    capabilities: [
      {
        title: "Technical SEO",
        body: "Crawlability, indexation, site structure, canonicals, redirects, sitemaps and the mechanics that let everything else work.",
      },
      {
        title: "Keyword and intent research",
        body: "The terms your buyers use, grouped by where they are in the decision, matched to the page type that should serve them.",
      },
      {
        title: "Competitor analysis",
        body: "What is already ranking and why, which shows what a page needs to contain to be competitive at all.",
      },
      {
        title: "On-page optimisation",
        body: "Titles, headings, metadata, internal links and content depth aligned to what each page is genuinely for.",
      },
      {
        title: "Content strategy",
        body: "Topic clusters where supporting articles reinforce the commercial pages, rather than isolated posts competing with each other.",
      },
      {
        title: "Structured data",
        body: "Valid schema markup that describes what the page actually is. We do not add review or rating markup that is not real.",
      },
      {
        title: "Core Web Vitals",
        body: "Loading, interaction and layout stability measured on real pages and fixed where they fall short.",
      },
      {
        title: "Local SEO",
        body: "Business profile optimisation, consistent name, address and phone details, and location pages that say something specific.",
      },
      {
        title: "International SEO",
        body: "Structure and targeting for multiple markets, without duplicating one page and swapping the country name.",
      },
      {
        title: "Link earning",
        body: "Digital PR, useful assets and genuine relationships. We do not buy links or use private networks — the short-term gain is not worth the risk to your domain.",
      },
      {
        title: "Reporting",
        body: "Rankings in context, plus organic traffic, conversions and the pages actually producing enquiries.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Technical audit",
        body: "A full crawl and Search Console review to find what is blocking performance right now.",
      },
      {
        step: "02",
        title: "Research",
        body: "Keyword, intent and competitor research mapped to your site structure.",
      },
      {
        step: "03",
        title: "Fix",
        body: "Technical issues resolved in priority order, largest impact first.",
      },
      {
        step: "04",
        title: "Optimise",
        body: "Existing pages improved. Pages already ranking on page two are usually the quickest wins available.",
      },
      {
        step: "05",
        title: "Create",
        body: "New content produced against the cluster plan, with internal linking designed in from the start.",
      },
      {
        step: "06",
        title: "Measure",
        body: "Monthly reporting on visibility, traffic and conversions, with the next month's priorities set from it.",
      },
    ],
    deliverables: [
      "Technical audit with prioritised fixes",
      "Keyword and intent map by page",
      "Competitor gap analysis",
      "On-page optimisation of priority pages",
      "Content plan structured into topic clusters",
      "Structured data implementation",
      "Core Web Vitals report and fixes",
      "Monthly visibility and conversion reporting",
    ],
    technologies: ["search-console", "ga4", "gtm", "nextjs", "looker-studio"],
    engagement: ["growth-retainer", "project"],
    faqs: [
      {
        question: "How long does SEO take to work?",
        answer:
          "Technical fixes can show up within weeks. Content and authority building are measured in months — typically three to six before the trend is clear, longer in competitive markets. Anyone offering results in thirty days is describing paid traffic or something that will not last.",
      },
      {
        question: "Can you guarantee first-page rankings?",
        answer:
          "No, and any agency that does is either misleading you or planning to rank you for terms nobody searches. Search results are not under our control. What we can commit to is fixing what is measurably broken, targeting terms with genuine commercial intent, and reporting honestly on progress.",
      },
      {
        question: "Do you build links?",
        answer:
          "We earn them through digital PR, genuinely useful content and relationships. We do not buy links or use private blog networks. Those tactics can work briefly and put your domain at risk in a way that is expensive to undo.",
      },
      {
        question: "Is local SEO different?",
        answer:
          "Yes. Local results are driven heavily by your business profile, consistent contact details across the web, proximity and reviews. For a business serving a specific area, that work often matters more than traditional ranking factors.",
      },
      {
        question: "Our traffic dropped suddenly. Can you help?",
        answer:
          "Yes — that is a specific diagnostic job. Sudden drops usually trace to a technical change, a migration without redirects, a manual action, or a core algorithm update. We identify which before proposing any work.",
      },
    ],
    related: [
      "digital-marketing",
      "web-development",
      "performance-marketing",
      "ecommerce-development",
      "marketing-funnels",
    ],
    ctaLabel: "Request an SEO Audit",
  },

  {
    slug: "performance-marketing",
    name: "Performance Marketing",
    title: "Paid media run like a P&L, not a poster campaign.",
    group: "growth",
    visual: "performance",
    eyebrow: "Performance Marketing",
    lede: "Paid media is the fastest way to buy attention and the fastest way to waste money. The difference is whether the account is structured around measurable outcomes and reviewed by someone who acts on the numbers.",
    summary:
      "Google and Meta campaigns, landing pages and creative testing, judged on cost per outcome.",
    metaTitle: "Performance Marketing Services | The Digital Alchemy",
    metaDescription:
      "Performance marketing across Google and Meta — campaign strategy, account structure, landing pages, creative testing, conversion tracking and reporting on cost per acquisition.",
    whoFor: [
      "Businesses spending on ads with no reliable view of return",
      "Companies whose costs per lead have risen without an explanation",
      "Teams whose ads perform but whose landing pages do not",
      "Advertisers who have only ever run whatever the platform suggested",
    ],
    problems: [
      {
        title: "Conversion tracking is wrong or missing",
        body: "If the platform is optimising towards the wrong signal, more budget buys more of the wrong outcome. This is the first thing we check and frequently the whole problem.",
      },
      {
        title: "The account structure fights itself",
        body: "Overlapping audiences, competing campaigns and fragmented budgets prevent the platform from learning, which raises costs for everybody involved.",
      },
      {
        title: "Creative is the bottleneck",
        body: "On social platforms especially, creative now does most of the work targeting used to. Running the same three assets for months guarantees rising costs.",
      },
      {
        title: "The landing page breaks the promise",
        body: "A specific ad pointing at a generic homepage wastes the click you just paid for. The page has to continue the conversation the ad started.",
      },
    ],
    capabilities: [
      {
        title: "Account strategy and structure",
        body: "Campaign architecture built around your economics and sales process, so the platform optimises towards outcomes that matter.",
      },
      {
        title: "Google Ads",
        body: "Search, Shopping, Display, YouTube and Performance Max, used where each genuinely fits rather than because they are available.",
      },
      {
        title: "Meta Ads",
        body: "Facebook and Instagram campaigns built around creative testing and audience signal rather than manual micro-targeting.",
      },
      {
        title: "Conversion tracking",
        body: "Correct implementation across platforms and analytics, including server-side where signal loss justifies it, with values attached so return is measurable.",
      },
      {
        title: "Landing pages",
        body: "Purpose-built pages that match each campaign's promise, built to load fast and make the next step unambiguous.",
      },
      {
        title: "Creative testing",
        body: "A structured cadence of new concepts, with enough volume per test to produce a conclusion rather than a coincidence.",
      },
      {
        title: "Audiences and remarketing",
        body: "Customer lists, lookalikes and sequenced remarketing that follows the sales cycle instead of repeating the first ad.",
      },
      {
        title: "Budget management",
        body: "Allocation reviewed against cost per acquisition and scaled where the numbers support it — not spread evenly out of habit.",
      },
      {
        title: "Reporting",
        body: "Spend, cost per acquisition and return reported alongside what we changed and why.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Audit",
        body: "Existing accounts, tracking and funnel reviewed. We fix measurement before we touch budget.",
      },
      {
        step: "02",
        title: "Plan",
        body: "Targets set from your unit economics, with campaign structure and creative approach agreed.",
      },
      {
        step: "03",
        title: "Build",
        body: "Campaigns, audiences, creative and landing pages built and quality-checked before launch.",
      },
      {
        step: "04",
        title: "Launch",
        body: "Controlled start with enough budget to exit the learning phase cleanly rather than starving it.",
      },
      {
        step: "05",
        title: "Optimise",
        body: "Weekly review and action: creative rotation, bid and budget changes, negative keywords, audience adjustments.",
      },
      {
        step: "06",
        title: "Scale",
        body: "Increasing spend only where cost per acquisition holds, and cutting what does not earn its place.",
      },
    ],
    deliverables: [
      "Account and tracking audit",
      "Campaign structure and targets from your economics",
      "Conversion tracking implementation",
      "Campaign build across chosen platforms",
      "Landing pages built for each campaign",
      "Creative testing plan and assets",
      "Weekly optimisation and monthly reporting",
    ],
    technologies: ["google-ads", "meta-ads", "ga4", "gtm", "looker-studio"],
    engagement: ["growth-retainer"],
    faqs: [
      {
        question: "What is the minimum budget worth starting with?",
        answer:
          "Enough for the platform to gather signal — roughly thirty to fifty conversions a month per campaign is where optimisation becomes reliable. Below that, results are noisy and decisions are guesses. What that means in currency depends entirely on your cost per lead, which we work out together.",
      },
      {
        question: "Google or Meta?",
        answer:
          "Google captures people already searching for a solution, so intent is higher and volume is capped by demand. Meta creates demand among people not yet looking, so reach is larger and creative does more of the work. Most businesses with budget for both end up running both, for different jobs.",
      },
      {
        question: "How is your fee structured?",
        answer:
          "A management fee based on the work involved rather than a percentage of spend. Percentage models create an incentive to spend more, which is not always the right advice.",
      },
      {
        question: "Do we keep the ad accounts?",
        answer:
          "Yes. Accounts are set up in your business's name and we are granted access. Your spend history, conversion data and audiences remain yours.",
      },
      {
        question: "How soon will we know if it is working?",
        answer:
          "Early signal within one to two weeks, reliable direction within four to six once campaigns exit the learning phase. Judging performance in the first few days leads to changes that reset learning and make things worse.",
      },
    ],
    related: [
      "google-ads",
      "meta-ads",
      "lead-generation",
      "marketing-funnels",
      "digital-marketing",
    ],
    ctaLabel: "Request an Ads Audit",
  },

  {
    slug: "google-ads",
    name: "Google Ads",
    title: "Being the obvious answer at the moment of intent.",
    group: "growth",
    visual: "google-ads",
    eyebrow: "Google Ads",
    lede: "Search advertising reaches people who have already described their problem. The advantage is intent; the risk is paying premium prices for clicks that were never going to convert.",
    summary:
      "Search, Shopping, YouTube and Performance Max campaigns built around commercial intent.",
    metaTitle: "Google Ads Management Services | The Digital Alchemy",
    metaDescription:
      "Google Ads management — Search, Shopping, Display, YouTube and Performance Max campaigns with conversion tracking, landing page optimisation and transparent reporting.",
    whoFor: [
      "Businesses whose customers actively search for what they sell",
      "Companies whose cost per click has risen with no matching return",
      "Advertisers running Performance Max with no visibility into where spend goes",
      "Retailers whose Shopping feed is under-optimised",
    ],
    problems: [
      {
        title: "Budget goes to searches that never convert",
        body: "Broad matching without disciplined negative keywords quietly funds a large volume of irrelevant clicks every month.",
      },
      {
        title: "Performance Max is a black box",
        body: "It can work well, but only with correct conversion values, sensible asset groups and exclusions. Left on defaults it will happily spend on brand traffic you already had.",
      },
      {
        title: "Quality Score is driving costs up",
        body: "Weak relevance between keyword, ad and landing page means paying more per click than competitors for the same position.",
      },
      {
        title: "Conversions are counted but not valued",
        body: "Treating every form fill as equal hides the difference between a serious enquiry and a job application. Values and offline conversions fix this.",
      },
    ],
    capabilities: [
      {
        title: "Search campaigns",
        body: "Keyword research grouped by intent, tightly themed ad groups, and disciplined negative keyword management.",
      },
      {
        title: "Shopping campaigns",
        body: "Merchant Centre setup, product feed optimisation and campaign structure that prioritises the products worth advertising.",
      },
      {
        title: "Performance Max",
        body: "Run with proper asset groups, audience signals, brand exclusions and conversion values, so it complements search rather than cannibalising it.",
      },
      {
        title: "YouTube and Display",
        body: "Used for awareness and remarketing where they support the funnel, with placement exclusions kept current.",
      },
      {
        title: "Remarketing",
        body: "Sequenced messaging for people who visited without converting, with frequency capped so it does not become an irritation.",
      },
      {
        title: "Conversion tracking",
        body: "Accurate conversion actions with values, enhanced conversions where appropriate, and offline import where the sale closes outside the website.",
      },
      {
        title: "Landing page optimisation",
        body: "Pages that match the ad's promise, load quickly and remove everything that competes with the primary action.",
      },
      {
        title: "Bidding strategy",
        body: "The right strategy for the data volume available, changed only when there is enough evidence to justify resetting learning.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Audit",
        body: "Account structure, search terms, tracking and wasted spend reviewed in detail, with findings shared in full.",
      },
      {
        step: "02",
        title: "Restructure",
        body: "Campaigns rebuilt around intent, with tracking corrected before any spend changes.",
      },
      {
        step: "03",
        title: "Launch",
        body: "New campaigns and ad copy live, with landing pages aligned to each ad group's promise.",
      },
      {
        step: "04",
        title: "Refine",
        body: "Weekly search term review, negative keyword additions, ad testing and bid adjustments.",
      },
      {
        step: "05",
        title: "Scale",
        body: "Budget increased where cost per acquisition supports it, with expansion into adjacent terms and campaign types.",
      },
    ],
    deliverables: [
      "Full account audit with wasted spend identified",
      "Restructured campaigns and ad groups",
      "Keyword and negative keyword strategy",
      "Ad copy with ongoing testing",
      "Conversion tracking with assigned values",
      "Campaign-matched landing pages",
      "Weekly optimisation and monthly reporting",
    ],
    technologies: ["google-ads", "ga4", "gtm", "search-console", "looker-studio"],
    engagement: ["growth-retainer"],
    faqs: [
      {
        question: "Can you audit our existing account first?",
        answer:
          "Yes, and it is usually the right starting point. An audit shows where spend is being wasted, whether tracking is trustworthy and what is realistically achievable, before either side commits to a longer arrangement.",
      },
      {
        question: "Should we bid on our own brand name?",
        answer:
          "It depends on whether competitors bid on it and how strong your organic listing is. If nobody is bidding against you and you already own the top organic result, brand bidding often buys clicks you would have received anyway. We check rather than assume.",
      },
      {
        question: "Why did our costs go up?",
        answer:
          "Usually competition, seasonality, a Quality Score drop, or a change that reset the learning phase. The search terms report and change history normally identify which within an audit.",
      },
      {
        question: "Is Performance Max worth using?",
        answer:
          "For e-commerce with a good feed, often yes. For lead generation it needs careful handling — clean conversion data, brand exclusions and realistic values — or it will spend on the cheapest conversions rather than the best ones.",
      },
    ],
    related: [
      "performance-marketing",
      "meta-ads",
      "search-engine-optimization",
      "marketing-funnels",
      "ecommerce-development",
    ],
    ctaLabel: "Request an Ads Audit",
  },

  {
    slug: "meta-ads",
    name: "Meta Ads",
    title: "Creating demand where people are not yet searching.",
    group: "growth",
    visual: "meta-ads",
    eyebrow: "Meta Ads",
    lede: "Facebook and Instagram reach people before they have started looking. That makes creative the main lever — the ad has to earn attention it was not given, then hand over to a page that keeps the promise.",
    summary:
      "Facebook and Instagram campaigns where creative testing does the heavy lifting.",
    metaTitle: "Meta Ads (Facebook & Instagram) Management | The Digital Alchemy",
    metaDescription:
      "Meta Ads management for Facebook and Instagram — creative strategy and testing, lead and conversion campaigns, retargeting, tracking setup and performance reporting.",
    whoFor: [
      "Consumer brands needing volume beyond existing search demand",
      "Businesses generating leads where the buyer is not actively searching yet",
      "Advertisers whose results declined after tracking changes",
      "Companies running the same creative for months and watching costs climb",
    ],
    problems: [
      {
        title: "Creative fatigue is inevitable and unmanaged",
        body: "Frequency rises, performance falls, and without a pipeline of new concepts the account slowly degrades. Production cadence is the fix.",
      },
      {
        title: "Signal loss made results look worse",
        body: "Platform tracking changes reduced visibility for everyone. Proper event configuration and server-side tracking recover a meaningful part of it.",
      },
      {
        title: "Audiences are cut too finely",
        body: "Over-segmentation starves the algorithm of the data it needs. Broader targeting with strong creative now usually beats narrow manual targeting.",
      },
      {
        title: "Leads arrive but do not convert",
        body: "Low-friction lead forms produce volume and poor quality. Qualifying questions and better offer framing fix it, at a higher cost per lead and a lower cost per customer.",
      },
    ],
    capabilities: [
      {
        title: "Creative strategy",
        body: "Concepts built around specific angles — problem, proof, objection, offer — so tests teach you something rather than just producing a winner.",
      },
      {
        title: "Creative production",
        body: "Static and video assets built for the feed, produced in enough volume to sustain a real testing cadence.",
      },
      {
        title: "Campaign structure",
        body: "Simple, consolidated structures that let the platform learn, with clean separation between prospecting and remarketing.",
      },
      {
        title: "Conversion campaigns",
        body: "Optimised towards the event that actually correlates with revenue, not the one that is easiest to generate.",
      },
      {
        title: "Lead campaigns",
        body: "Instant forms or landing pages depending on which produces better qualified leads for your sales process, with qualifying questions built in.",
      },
      {
        title: "Retargeting",
        body: "Sequenced messaging by engagement depth, with exclusions and frequency caps so it does not become intrusive.",
      },
      {
        title: "Tracking and attribution",
        body: "Pixel and Conversions API configured correctly, with events matched to your funnel and deduplicated properly.",
      },
      {
        title: "Testing framework",
        body: "A regular cadence of creative and offer tests with enough volume behind each to reach a real conclusion.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Audit",
        body: "Account, tracking and creative history reviewed to establish what has already been learned.",
      },
      {
        step: "02",
        title: "Set up",
        body: "Pixel and Conversions API implemented, events mapped to your funnel and verified end to end.",
      },
      {
        step: "03",
        title: "Create",
        body: "First batch of creative concepts produced across distinct angles.",
      },
      {
        step: "04",
        title: "Test",
        body: "Structured testing at sufficient volume to identify what actually works.",
      },
      {
        step: "05",
        title: "Scale",
        body: "Winning concepts scaled, with new variations produced continuously to stay ahead of fatigue.",
      },
    ],
    deliverables: [
      "Account and tracking audit",
      "Pixel and Conversions API implementation",
      "Creative strategy with defined test angles",
      "Static and video ad assets",
      "Campaign build and audience setup",
      "Retargeting sequences",
      "Ongoing creative testing and monthly reporting",
    ],
    technologies: ["meta-ads", "ga4", "gtm", "figma"],
    engagement: ["growth-retainer"],
    faqs: [
      {
        question: "How much creative do we need?",
        answer:
          "More than most accounts run. A sustainable pace is several new concepts a month, each with variations. Accounts that stop producing creative see costs rise within weeks — this is now the main driver of performance on the platform.",
      },
      {
        question: "Do Meta ads work for B2B?",
        answer:
          "They can, for shorter sales cycles and clearly definable audiences. For long, high-value B2B cycles they usually work better for awareness and retargeting alongside search, rather than as the primary lead source.",
      },
      {
        question: "Our lead quality is poor. What changes?",
        answer:
          "Usually the offer and the qualification. Adding qualifying questions, framing the offer to appeal to buyers rather than browsers, and optimising towards a deeper event will raise cost per lead and lower cost per customer. That is the right trade.",
      },
      {
        question: "Can you produce the video content?",
        answer:
          "Yes, including editing footage you already have, which is often the fastest route to a testable volume of creative. For original filming we brief and coordinate the shoot.",
      },
    ],
    related: [
      "performance-marketing",
      "google-ads",
      "social-media-management",
      "lead-generation",
      "marketing-funnels",
    ],
    ctaLabel: "Request an Ads Audit",
  },

  {
    slug: "lead-generation",
    name: "Lead Generation",
    title: "A pipeline you can predict, not a pile of form fills.",
    group: "growth",
    visual: "leadgen",
    eyebrow: "Lead Generation",
    lede: "Volume is the easy metric to move and the least useful one. What matters is qualified enquiries reaching your sales team quickly, with enough context to act on.",
    summary:
      "Offers, landing pages, qualification and CRM routing — built as one system.",
    metaTitle: "Lead Generation Services | The Digital Alchemy",
    metaDescription:
      "B2B and B2C lead generation — offer design, landing pages, paid and organic acquisition, lead qualification, CRM integration and reporting on cost per qualified lead.",
    whoFor: [
      "Sales teams whose pipeline depends on referrals and nothing else",
      "Businesses getting enquiries that are consistently the wrong fit",
      "Companies where leads sit unactioned for days",
      "Teams who cannot say what a lead currently costs them",
    ],
    problems: [
      {
        title: "The offer asks for too much too early",
        body: "A demo request is a large commitment for someone still researching. A smaller first step captures interest that would otherwise leave and never return.",
      },
      {
        title: "Leads are not qualified before they reach sales",
        body: "Sales time spent on poor-fit enquiries is the most expensive waste in the funnel. A few well-chosen form questions filter effectively.",
      },
      {
        title: "Response time is measured in days",
        body: "Contact speed has a dramatic effect on conversion. If a lead waits until tomorrow, a competitor has usually already replied.",
      },
      {
        title: "Nobody knows which source produces customers",
        body: "Without attribution carried from first click through to closed deal, budget is allocated on volume rather than on revenue.",
      },
    ],
    capabilities: [
      {
        title: "Offer design",
        body: "Something worth exchanging contact details for, matched to where the buyer actually is — assessment, audit, guide, tool or consultation.",
      },
      {
        title: "Landing pages",
        body: "Focused pages built for a single audience and offer, with the form and the reasoning to complete it doing all the work.",
      },
      {
        title: "Acquisition",
        body: "Paid and organic channels driving qualified traffic to those pages, with campaign and page treated as one unit.",
      },
      {
        title: "Qualification",
        body: "Form logic and scoring that separates buyers from browsers before a salesperson spends time on the difference.",
      },
      {
        title: "CRM integration",
        body: "Leads delivered into your system with source, campaign and answers attached, assigned and notified automatically.",
      },
      {
        title: "Nurture sequences",
        body: "Automated follow-up for people who are interested but not ready, so the majority who are not buying today are not simply lost.",
      },
      {
        title: "Speed to lead",
        body: "Instant notification and routing, because contacting within minutes rather than days changes conversion materially.",
      },
      {
        title: "Attribution and reporting",
        body: "Source data carried through to closed business, so cost per qualified lead and cost per customer are both visible.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Define",
        body: "Ideal customer profile, qualification criteria and what a genuinely good lead looks like for your sales team.",
      },
      {
        step: "02",
        title: "Build the offer",
        body: "An offer and landing page designed for that specific audience and stage.",
      },
      {
        step: "03",
        title: "Drive demand",
        body: "Campaigns launched against the page, structured so performance by source is readable.",
      },
      {
        step: "04",
        title: "Route",
        body: "Qualification, CRM integration, assignment and notification configured and tested end to end.",
      },
      {
        step: "05",
        title: "Improve",
        body: "Ongoing optimisation of offer, page and targeting against cost per qualified lead.",
      },
    ],
    deliverables: [
      "Ideal customer profile and qualification criteria",
      "Lead offer and supporting assets",
      "Landing pages with qualification logic",
      "Campaign setup across chosen channels",
      "CRM integration with routing and notification",
      "Automated nurture sequences",
      "Reporting on cost per qualified lead",
    ],
    technologies: ["ga4", "gtm", "google-ads", "meta-ads", "nextjs"],
    engagement: ["growth-retainer", "project"],
    faqs: [
      {
        question: "Can you guarantee a number of leads?",
        answer:
          "No. Lead volume depends on budget, market size, offer strength and your own follow-up, and we control only part of that. We will forecast ranges from real performance data once campaigns have run, and we would rather set an honest expectation than a number designed to win the pitch.",
      },
      {
        question: "Do you buy lead lists?",
        answer:
          "No. Purchased lists produce poor conversion, damage sender reputation and create compliance problems. Every lead we generate opts in through your own campaign.",
      },
      {
        question: "Can you integrate with our CRM?",
        answer:
          "Yes. We build lead capture behind a clean integration layer, so connecting HubSpot, Zoho, Salesforce or a custom system is configuration rather than a rebuild.",
      },
      {
        question: "What if our sales team cannot handle the volume?",
        answer:
          "Then we tighten qualification rather than widen the funnel. More poor-fit leads than a team can work through is a worse outcome than fewer, better ones, and it is a common way lead generation programmes fail.",
      },
    ],
    related: [
      "marketing-funnels",
      "performance-marketing",
      "digital-marketing",
      "automation-integrations",
      "google-ads",
    ],
    ctaLabel: "Plan My Pipeline",
  },

  {
    slug: "marketing-funnels",
    name: "Marketing Funnels",
    title: "Closing the gap between interest and purchase.",
    group: "growth",
    visual: "funnels",
    eyebrow: "Marketing Funnels",
    lede: "Most people who are interested do not buy on the first visit. A funnel is simply the deliberate design of what happens next — instead of hoping they come back on their own.",
    summary:
      "Sequenced journeys from first click to customer, with the drop-off points designed for.",
    metaTitle: "Marketing Funnel Design & Optimisation | The Digital Alchemy",
    metaDescription:
      "Marketing funnel strategy, landing pages, email sequences, conversion rate optimisation and analytics — designed around how people actually decide to buy.",
    whoFor: [
      "Businesses with healthy traffic and a poor conversion rate",
      "Companies with a considered purchase and no follow-up between visits",
      "Teams whose email list exists but is never used properly",
      "Advertisers whose campaigns end at a single generic page",
    ],
    problems: [
      {
        title: "There is only one step and it is a big one",
        body: "Asking for a purchase or a demo as the only available action loses everyone not ready today, which is nearly everyone.",
      },
      {
        title: "The follow-up does not exist",
        body: "Interest decays quickly. Without a planned sequence after the first interaction, most of the attention already paid for is wasted.",
      },
      {
        title: "Nobody knows where people drop out",
        body: "Without funnel measurement, teams optimise whichever step feels weakest rather than the one actually losing the most people.",
      },
      {
        title: "The message changes between steps",
        body: "An ad promising one thing, a page describing another and an email discussing a third breaks the thread and loses the reader.",
      },
    ],
    capabilities: [
      {
        title: "Funnel design",
        body: "Mapping the real decision path for your product, then designing the steps that move someone along it.",
      },
      {
        title: "Landing pages",
        body: "Pages built for one audience and one action, tested against the alternatives rather than assumed.",
      },
      {
        title: "Lead magnets and entry offers",
        body: "A first step small enough to take and valuable enough to want.",
      },
      {
        title: "Email sequences",
        body: "Follow-up that earns attention by being useful, sequenced to the length of your real sales cycle.",
      },
      {
        title: "Retargeting",
        body: "Paid follow-up matched to how far someone got, so the message continues rather than repeats.",
      },
      {
        title: "Conversion rate optimisation",
        body: "Structured testing on the highest-traffic steps, with enough volume behind each test to produce a real answer.",
      },
      {
        title: "Funnel analytics",
        body: "Step-by-step measurement so the weakest point is a fact rather than an opinion.",
      },
      {
        title: "Automation",
        body: "The triggers, delays and branching that make the sequence run without anyone remembering to send anything.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Map",
        body: "The current journey documented with real data, including where people currently leave.",
      },
      {
        step: "02",
        title: "Design",
        body: "The intended funnel designed step by step, with the message for each stage written out.",
      },
      {
        step: "03",
        title: "Build",
        body: "Pages, forms, sequences and automation built and tested end to end before traffic arrives.",
      },
      {
        step: "04",
        title: "Measure",
        body: "Analytics configured per step, so the funnel is observable from day one.",
      },
      {
        step: "05",
        title: "Optimise",
        body: "Continuous testing on the step with the largest loss, which is where improvement compounds.",
      },
    ],
    deliverables: [
      "Current-state funnel map with drop-off data",
      "Designed funnel with messaging per stage",
      "Landing pages and forms",
      "Email sequences and automation",
      "Retargeting audiences and creative",
      "Step-by-step funnel analytics",
      "Ongoing testing programme",
    ],
    technologies: ["nextjs", "ga4", "gtm", "meta-ads", "google-ads"],
    engagement: ["growth-retainer", "project"],
    faqs: [
      {
        question: "Is a funnel just a landing page?",
        answer:
          "No. A landing page is one step. A funnel is the whole sequence — what brings someone there, what they do next, what happens if they leave, and how they are followed up. Most funnel problems live in the steps after the page.",
      },
      {
        question: "How much traffic do we need for testing?",
        answer:
          "Enough for a result to be meaningful — as a rough guide, a few hundred conversions per variant. Below that, we improve through evidence-based design changes rather than pretending a small sample proved something.",
      },
      {
        question: "Does this work for long B2B sales cycles?",
        answer:
          "Particularly well. Long cycles are exactly where unmanaged interest goes cold. The sequence simply runs over months rather than days.",
      },
    ],
    related: [
      "lead-generation",
      "performance-marketing",
      "digital-marketing",
      "web-development",
      "automation-integrations",
    ],
    ctaLabel: "Design My Funnel",
  },
];
