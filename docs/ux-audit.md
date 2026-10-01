# UX & SEO audit: Phase 0

**Date:** 30 September 2026 · **Commit audited:** `42af755` · **Scope:** every public route, plus the live site where noted.

No code was changed in this phase. This document is the baseline that every later phase is measured against.

## How this was measured

Findings come from what a visitor actually receives, not from reading the source and guessing:

- **Rendered pages.** A production build served locally. All 49 sitemap URLs plus a 404 were crawled, and the `<main>` content of each was extracted: H1, H2s, title, description, word count, reading grade, jargon, statistic-shaped text, CTA labels and structured data.
- **The live site.** `https://www.thedigitalalchemy.co.in` was checked directly for canonical tags, robots.txt, sitemap, domain redirects and legacy URLs.
- **A real browser**, for the 404 page and the menu/chat-button collision, with element positions measured rather than eyeballed.
- **The database** the local `.env` points at, for testimonials, clients, metrics and redirects. See [question 1](#9-open-questions-decisions-i-need-from-you): this may not be the same database the live site uses.

**Reading grade** is an approximate Flesch–Kincaid score. It measures sentence and word length only, not whether the words are understood. Our pages score 8–10, near the Class 7–8 target, so **the problem is vocabulary, not sentence length**.

**Jargon counts cover `<main>` only.** The footer adds roughly six more remove-list terms to *every* page (see §7).

---

## 1. The ten things that matter most

Ranked by harm to the business, not by effort to fix.

| # | Finding | Where | Severity |
|---|---|---|---|
| 1 | **Six fabricated testimonials are live**: invented people, invented companies and invented figures, labelled "REAL FOUNDER STORIES" and "100% PRODUCTION VERIFIED" | `/` and `/clients`, from `src/components/sections/testimonials.tsx` | Critical: trust, legal, and against Google's review policies |
| 2 | **The live site tells Google its address is `http://localhost:3000`**: canonical, og:url, og:image, twitter:image, robots.txt `Sitemap:` line, and all 49 sitemap URLs | Live, every page | Critical: pages may be dropped from search or never indexed |
| 3 | **12 of 20 service H1s don't say what the service is**, and 4 more only partly do. `/services/google-ads` opens with "Being the obvious answer at the moment of intent" | `/services/*` | High: fails the 10-second test and the H1 carries no keyword |
| 4 | **Remove-list jargon appears 135 times across 36 pages** (in `<main>` alone). "Autonomous" 45×, "AI-ready" 41×, "multi-tenant" 19× | Sitewide | High |
| 5 | **22 different CTA labels** for the same two destinations | Sitewide | Medium |
| 6 | **The homepage has 10 sections and 1,749 words.** "Six stages" appears twice, and it includes an empty "case studies are being rebuilt" block, a tech-stack section and a six-market section | `/` | Medium |
| 7 | **The "AI" chat button covers the menu's "Start a Project" link** on laptop windows about 530–590px tall. A click there opens the chat instead | Header menu, all pages | Medium: blocks the main conversion |
| 8 | **The chatbot quotes prices and timelines nobody has confirmed**: ₹1,00,000 to ₹8,00,000+, "28 days to a live MVP" | `src/lib/chatbot/knowledge.ts`, `src/app/api/chat/route.ts` | Medium: against the no-invented-prices rule |
| 9 | **Four identical paragraphs appear on all 20 service pages**, plus 21 more repeated on 3–10 pages each | `/services/*`, `/locations/*`, `/industries/*` | Medium: duplicate-content signal |
| 10 | **Service CTA lowercases the service name**: "…that ai automation & integrations is not what you need" | `src/app/(site)/services/[slug]/page.tsx:377` | Low effort, visible on all 20 pages |

Also found, lower priority: the 404 page is client-rendered only (§6.3), footer links reach only 8 of 20 services (§7).

---

## 2. Every route

| Route | Type | Pages | Content source |
|---|---|---|---|
| `/` | Static | 1 | Section components in `src/components/sections/*` + DB (clients, testimonials) |
| `/about` | Static | 1 | Hardcoded in `src/app/(site)/about/page.tsx` |
| `/services` | Static | 1 | Page file + `src/content/services/*` |
| `/services/[slug]` | SSG, `dynamicParams = false` | 20 | `src/content/services/{development,design,growth,technology}.ts` |
| `/industries` | Static | 1 | Page file + `src/content/industries.ts` |
| `/industries/[slug]` | SSG | 9 | `src/content/industries.ts` |
| `/locations` | Static | 1 | Page file + `src/content/locations.ts` |
| `/locations/[slug]` | SSG | 6 | `src/content/locations.ts` |
| `/work`, `/work/[slug]` | Static / dynamic | 1 + 0 | DB `Project` (0 rows) |
| `/products`, `/products/[slug]` | Static / dynamic | 1 + 0 | DB `Product` (0 rows) + page file |
| `/insights`, `/insights/[slug]` | Static / dynamic | 1 + 0 | DB `Post` (0 rows) |
| `/careers`, `/careers/[slug]` | ISR 5 min | 1 + 0 | DB `JobOpening` (0 rows) + `src/content/careers.ts` |
| `/clients` | Static | 1 | Page file + DB + `testimonials.tsx` |
| `/contact`, `/start-a-project` | Static / dynamic | 2 | Page files + `src/components/sections/project-form.tsx` |
| `/privacy`, `/terms` | Static | 2 | Page files |
| `/[...slug]` | Dynamic | n/a | Catch-all that resolves CMS redirects from DB `Redirect`, else 404 |
| `/capture/hero` | Dynamic | n/a | Screenshot stage for build tooling. 404s unless `TDA_CAPTURE=1`, and noindex. Not public |
| 404 | n/a | 1 | `src/app/not-found.tsx` |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/icon` | Metadata routes | n/a | `src/app/{sitemap,robots,opengraph-image,icon}.ts(x)` |
| `/api/chat`, `/api/leads` | API | n/a | Chatbot and lead capture |
| `/admin/*` | Auth-guarded | 22 | Out of scope for copy; disallowed in robots.txt |

**49 public URLs** are in the sitemap today. No product, case-study, article or job detail pages exist because those tables are empty.

## 3. Where the copy lives

This matters for effort: most copy is already structured data, not prose buried in JSX.

| Source | What it holds | Share of copy |
|---|---|---|
| `src/content/services/*.ts` | All 20 service pages: `name`, `title`, `eyebrow`, `lede`, `summary`, `metaTitle`, `metaDescription`, `whoFor`, `problems`, `capabilities`, `process`, `deliverables`, `technologies`, `engagement`, `faqs`, `related`, `ctaLabel` | Largest |
| `src/content/industries.ts`, `locations.ts` | 9 industry and 6 location pages, same pattern | Large |
| `src/content/navigation.ts` + `src/components/site/navbar.tsx` | Mega-menu group blurbs (navigation.ts) and the "How we work" card (navbar.tsx) | Small, high-visibility |
| `src/components/site/footer.tsx` | Footer CTA and tagline, **on every page** | Small, high-visibility |
| `src/components/sections/*.tsx` | Homepage sections, with copy hardcoded in each component | Medium |
| `src/app/(site)/*/page.tsx` | About, Products, Work, Insights, Careers, Contact, and the legal pages | Medium |
| `src/lib/chatbot/knowledge.ts`, `src/app/api/chat/route.ts` | What the chatbot says, including prices | Small |
| **Database** | Testimonials, clients, metrics, redirects, SEO overrides, per-field page-copy overrides (`ContentOverride`) | Currently almost empty |

**Admin overrides:** the Page copy admin can override individual fields. There are **0 overrides** today, so rendered copy equals code copy. The code files can be treated as the single source of truth.

**Leverage point:** one string is responsible for most of the sitewide jargon. The SaaS service's `summary` ([development.ts:14](../src/content/services/development.ts)), "AI-native multi-tenant platforms with autonomous workflows…", is reused wherever SaaS is linked: the mega-menu, related-service cards and location pages. That one line puts "multi-tenant" on 16 pages that have nothing to do with SaaS.

---

## 4. Page by page

**Columns:** *Words* = words in `<main>`. *Grade* = approximate reading grade. *CTAs* = distinct labels linking to `/start-a-project` or `/contact`. Jargon listed is from the remove list (**bold**) or terms that must be explained. Tech names are listed separately where they appear in the main flow.

### Core pages

| Page | Current H1 | What this page is for | Jargon found | Problems |
|---|---|---|---|---|
| `/` | We engineer AI-ready products & intelligent automations that scale | Say what we do and send each visitor to the right service | **AI-ready, autonomous, compound growth engines, unfair advantage, architect, multi-tenant**, SaaS, API, CRM, pipeline, workflow · stack: 6 names | H1 describes our engineering, not what the visitor gets. 1,749 words across 10 sections. Process shown twice ("Six stages" in two sections). Empty "case studies are being rebuilt" block. Tech-stack and 6-market sections belong on inner pages. **Renders all six fabricated testimonials.** Grade 8.1, 21 remove-list hits |
| `/about` | AI Automation. AI-Ready Products. High-Performance Engineering | Who we are, where we are, how we work | **AI-ready, autonomous, agentic, compound growth, Apple-grade, architect**, pipeline, workflow | H1 is a category list and says nothing about the company. 13 remove-list hits in 653 words, the densest core page. Grade 10, the hardest core page to read |
| `/services` | AI automation. Software engineering. Digital scale | Help a visitor find the right service | **AI-ready, autonomous, compound growth, architect, multi-tenant**, SaaS, API, CRM, funnel, pipeline, workflow | Abstract H1. A wall of 20 cards grouped by our departments, not by what the visitor wants. No "not sure?" helper |
| `/work` | Case studies & AI systems, coming as clients approve them | Show what we have built | **autonomous**, workflow | Honest, but empty and reads as unfinished. No offer to walk through examples on a call |
| `/products` | Our own AI-ready products are in active development | Show our own products | **AI-ready, autonomous, agentic, architect, orchestration**, SaaS, workflow | **Worst page per word**: 13 remove-list hits in 145 words, grade 10.8. No products exist (0 in DB) |
| `/clients` | The businesses we work with | Proof | **autonomous, architect**, conversion · stack: Figma, Stripe | **Renders all six fabricated testimonials** and the invented 4.9/5 and 0.0% figures. The rest is honest |
| `/insights` | We are writing this properly rather than quickly | Blog | SaaS, conversion | H1 doesn't say "blog" or "articles". 0 posts. No categories, author or article template in use yet |
| `/careers` | A small team, doing work you can point at | Jobs and speculative applications | none | Plain already, but the H1 doesn't say "careers" or "jobs". 0 open roles. No contact CTA in `<main>` |
| `/contact` | Tell us what you are working on | Get in touch | SaaS | Plain and clear. Form length and "what happens next" to be reviewed in Phase 6 |
| `/start-a-project` | Start a project | Project enquiry form | SaaS | Clear. Form length to be reviewed in Phase 6 |
| `/privacy`, `/terms` | Privacy Policy · Terms of Use | Legal | none | Fine as they are |
| 404 | Something got lost in the transformation. (client-rendered) | Get a lost visitor back on track | none | Content is **not in the server HTML**, so no-JS clients get an empty page. Tab title is the homepage's. "Try one of these" lists 8 services (two from each menu group) plus Contact. *Corrected in Phase 1: an earlier draft of this audit said it listed no growth services, which was wrong* |

### Service pages

Only **4 of 20** H1s say plainly what the service is (✓). **4** partly do (~). **12** don't (✗).

| Page | Current H1 | Names it? | What this page is for | Jargon found | Problems |
|---|---|---|---|---|---|
| `saas-development` | From AI-ready SaaS idea to a product customers pay for | ~ | Build software people subscribe to | **AI-ready, autonomous, compound growth, 10x/leverage, architect, multi-tenant**, SaaS, API, CRM, LLM · stack: 13 | **Most jargon on the site** (14 remove-list hits, 43 explain-list terms). 1,749 words. Its summary spreads jargon to 16 other pages |
| `custom-software-development` | Software built around how your business actually works | ✓ | Internal tools for one business | **AI-ready, autonomous, architect, multi-tenant**, SaaS, API, CRM · stack: 10 | Good H1. Heavy jargon underneath. No comparison with Web Apps or SaaS |
| `web-development` | Websites designed to perform, not just to launch | ✓ | Business websites that bring enquiries | conversion, funnel, B2B/B2C · stack: 8 | Best of the development pages. Tech names in the main flow. No comparison box |
| `web-application-development` | Applications your team and customers log into every day | ✓ | Portals and dashboards | **AI-ready, autonomous, multi-tenant**, SaaS, API, CRM, pipeline · stack: 9 | Good H1. Jargon underneath. Overlaps with Custom Software and SaaS without saying how they differ |
| `mobile-app-development` | Apps people actually keep on their phone | ✓ | Android and iPhone apps | SaaS, API, CRM · stack: 7 | Good H1. Doesn't say "Android/iPhone" up front |
| `ecommerce-development` | Stores built around the moment someone decides to buy | ~ | An online store | **10x/leverage**, SaaS, conversion, funnel · stack: 6 | "Stores" alone could mean physical shops. Say "online store" |
| `ui-ux-design` | Interfaces that make complicated things feel obvious | ✗ | Make an existing app or site easy to use | **AI-ready, autonomous, multi-tenant**, SaaS · stack: 3 | Never says "design", "app" or "website". Boundary with Product Design unclear |
| `product-design` | Deciding what to build before deciding how it looks | ✗ | Plan and design a new app from scratch | **AI-ready, autonomous, multi-tenant**, SaaS · stack: 3 | The angle is genuinely different from UI/UX (see §8), but the H1 doesn't name it |
| `branding` | An identity that still works at every size it has to survive | ✗ | Logo, colours and brand look | conversion · stack: Figma | Never says "logo" or "brand". Otherwise the cleanest service page (0 remove-list hits) |
| `digital-marketing` | Marketing engineered for measurable growth | ~ | Umbrella page for all growth services | CRM, conversion, funnel, pipeline | Should be the growth overview that links to each child service. Currently a peer of them |
| `search-engine-optimization` | Turning search demand into sustainable growth | ✗ | Show up on Google | conversion, funnel · stack: 2 | Never says "Google" or "SEO" in the H1 |
| `social-media-management` | A social presence that compounds instead of resetting | ~ | Run Instagram, Facebook and LinkedIn | CRM, conversion, funnel | "Compounds" is jargon. No platform names in the H1 |
| `performance-marketing` | Paid media run like a P&L, not a poster campaign | ✗ | Overview of paid ads | CRM, conversion, funnel | "P&L" and "paid media" are jargon. Should be the parent of Google Ads and Meta Ads, with a "which do I need?" box |
| `google-ads` | Being the obvious answer at the moment of intent | ✗ | Ads on Google search and YouTube | conversion, funnel · stack: 1 | Never says "Google" or "ads" |
| `meta-ads` | Creating demand where people are not yet searching | ✗ | Facebook and Instagram ads | API, CRM, conversion, funnel | Never says "Facebook", "Instagram" or "ads" |
| `lead-generation` | A pipeline you can predict, not a pile of form fills | ✗ | A steady flow of enquiries | **autonomous**, API, CRM, funnel, pipeline · stack: 3 | "Pipeline" is jargon. Overlaps with Funnels |
| `marketing-funnels` | Closing the gap between interest and purchase | ✗ | Turn visitors into buyers step by step | **autonomous**, API, CRM, funnel ×33, pipeline | "Funnel" 33× with no plain explanation |
| `automation-integrations` | Autonomous workflows and AI pipelines that run your business | ✗ | Let software do repetitive work | **autonomous, agentic, 10x/leverage, architect, idempotency, dead-letter, RAG, deterministic, orchestration**, API, CRM · stack: 11 | **9 of the 14 remove-list terms are on this one page.** Grade 10 |
| `cloud-solutions` | Infrastructure you can reason about at two in the morning | ✗ | Keep sites and apps fast, safe and online | **AI-ready, autonomous, multi-tenant**, SaaS, API · stack: 7 | Clever, and incomprehensible to the target reader |
| `maintenance-support` | Software gets worse if you leave it alone | ✗ | Keep a site or app updated and fixed | **AI-ready, autonomous, multi-tenant**, SaaS, API, CRM · stack: 5 | States a problem but never says what we do about it |

**Across all 20:** word counts run 978–1,749, already inside the brief's 800–1,200 target or above it, so the job is rewriting and de-duplicating, not writing more. The four paragraphs shared by all 20 pages are section intros:

- "Not every engagement needs all of this…"
- "Chosen per project. If your team already runs something…"
- "If something here is not covered, ask us directly…"
- "Most engagements combine several of these…"

### Industry pages

H1s are problem-led and mostly readable, but none names the industry together with what we'd do for it.

| Page | Current H1 | Jargon found | Problems |
|---|---|---|---|
| `/industries` | The problems change. The discipline does not | conversion, MVP | Abstract. Doesn't say "industries we work with" |
| `ecommerce` | Where online retail actually loses money | conversion, funnel, D2C | Readable. No examples for an Indian D2C brand |
| `education` | Platforms that work for learners, parents and staff at once | conversion, funnel | Readable. "Platforms" is vague |
| `finance` | Financial services where credibility is measured in details | **autonomous**, API, CRM, pipeline | Grade 9 |
| `healthcare` | Digital work where trust and privacy are the product | **autonomous**, API, pipeline | "Digital work" is vague. Clinic examples would land better |
| `hospitality` | Winning the direct booking instead of renting it | conversion | Good hook, but "renting it" needs context |
| `professional-services` | Making expertise visible before the first conversation | CRM, conversion | Readable |
| `real-estate` | Listings that hold attention and capture the enquiry | API, CRM, conversion | Readable |
| `retail` | Joining up the shop, the site and the customer | **autonomous**, API, pipeline | Readable. Overlaps with the e-commerce industry page |
| `startups` | Getting to a first version worth showing | **AI-ready, autonomous, multi-tenant**, SaaS | SaaS-summary jargon |

Each industry page shares 5–10 paragraphs with others (tool descriptions such as "Behaviour and conversion measurement, configured with events…").

### Location pages

H1s are good: they name the country and the relationship.

| Page | Current H1 | Problems |
|---|---|---|
| `/locations` | One studio. Six markets | Fine |
| `australia` | A development partner for Australian businesses, in a workable time zone | SaaS-summary jargon (**AI-ready, autonomous, multi-tenant**). Shared paragraph with 5 other pages |
| `canada` | A remote design and engineering team for Canadian businesses | Same |
| `india` | A digital product and growth studio in New Delhi | Same. **This is the page that should rank for Delhi searches**, and it isn't written for Delhi businesses |
| `uae` | A development partner an hour and a half from your working day | Same. Clever H1, and "an hour and a half" needs the context of time zones |
| `united-kingdom` | A remote studio for UK businesses, working most of your day | Same |
| `united-states` | A remote product and engineering partner for US businesses | Same |

All six share one paragraph verbatim ("The details that differ by market — regulation, payment expectations, language…"). Addendum C.13 requires genuinely different content on each.

---

## 5. Testimonials, reviews, clients, ratings and statistics

**Every** claim a visitor can read, with its location. Nothing below has been changed.

### 5.1 Hardcoded testimonials: not in the database, and never entered through the admin

`src/components/sections/testimonials.tsx`, rendered on **`/`** and **`/clients`**.

| Line | Person | Role · Company | Headline claim | Badge / figure | Status |
|---|---|---|---|---|---|
| 88–100 | Elena Rostova | Co-Founder & CTO · Apex Dispatch | "Killed 4 months of agency delays in 16 days" | "16-DAY LAUNCH 🚀". Arrow: "Elena's Slack: 'OMG IT WORKS!'" | **Unverified, likely invented** |
| 109–115 | Marcus Vance | VP Product · FinPulse Global | "Told us NOT to build 2 features (saved $42k)" | "SAVED $42,000" | **Unverified, likely invented** |
| 135–141 | Devon Miller | Head of Engineering · Omnia Commerce | "Zero downtime during our 82,000 flash sale" | "82K CONCURRENT · 0 DOWNTIME" | **Unverified, likely invented** |
| 180–186 | Priya Sundaram | Lead Platform Architect · Nexus Health | "Like hiring two principal engineers from Stripe" | "ZERO TECH DEBT" | **Unverified, likely invented** |
| 196–202 | Kenji Sato | Director of Operations · CloudStream | "Automated 3 hours of daily manual misery" | "14 SEC / RUN". Quote includes "99.8%" | **Unverified, likely invented** |
| 212–218 | Sarah Lin | Founder & CEO · Synthetix AI | "Pixel-perfect AND rock-solid backend" | "+34% CONVERSIONS" | **Unverified, likely invented** |

Every one of these carries `rating={5}`.

**Why "likely invented":** four of these company names (Apex Dispatch, FinPulse Global, Omnia Commerce, CloudStream) and Nexus Health are the same names that were removed from the chatbot in September because they were fabricated. Some of the figures match too: 82,000 concurrent checkouts and $42,000 saved.

**Section-level claims in the same file:**

| Line | Text | Problem |
|---|---|---|
| 32 | "What founders say when the PRs are merged." | Implies the quotes are from real engineering clients |
| 33 | "No agency fluff, no PR-polished testimonials. Raw, authentic thoughts pinned by founders…" | Explicitly claims authenticity |
| 43–45 | Badges: "REAL FOUNDER STORIES", "ZERO FLUFF", "100% PRODUCTION VERIFIED" | Explicitly claims verification |
| 55 | "The Client Chronicle" | Section title |
| 64–67 | "Average Score **4.9 / 5.0** ⭐" | Invented rating. It would breach Google's review-snippet policy if ever marked up |
| 72–76 | "Tech Debt Left **0.0%**" | Invented statistic |
| 150 | "Sprint Manifesto" note | Fine: describes our own practice, not a client |
| 121–128 | Polaroid "Deploy Night · 2:45 AM · Pizza boxes, 42 green test suites, zero staging bugs", tagged "SHIPPED TO PRODUCTION". Its code comment calls it a "Real Sprint Photo" | Presented as a real event with specific figures. *Found in Phase 1* |
| 136 | Devon Miller's quote also claims "42ms response times" and an outage that "cost six figures" | More invented figures inside a fabricated quote. *Found in Phase 1* |
| 228, 234 | File cards "Real-World-Caching-Blueprint.pdf" (meta: "Pinned by Marcus (VP Product) · 4.2 MB") and "Week-3-Deploy-Debrief.key" | Imply real client deliverables, and the first names one of the fabricated people |
| 239 | "100% DIRECT ENGINEER HANDOFF" | Claim about our practice. Fine if true |

**Planned handling (per the brief): hide behind a feature flag, don't delete.** I recommend doing this first and on its own, ahead of the other Phase 1 work, because it's live now (see §9).

### 5.2 Database-held proof

| Item | Content | Status | Rendering issues |
|---|---|---|---|
| Client **Internite** | Published, logo approved | Confirmed by you | None |
| Testimonial **Aakash** | Position "Digital marketing", no company, rating 5: *"helped us increase leads by **200% in 3 months**…"* | You named Aakash as verified. **Please also confirm the 200% / 3-month figure**, since it's a specific statistic | `testimonials.tsx:253` uses `rating ?? 5`, so a testimonial saved without a rating is shown with five stars. Line 254 labels every DB testimonial "VERIFIED PARTNER" regardless of any check |
| **7 metrics** (projects delivered, clients, countries, years, satisfaction %, ad spend, leads) | All values empty and unpublished | Not rendered. Nothing to confirm |

### 5.3 Everything else a visitor can read as a statistic

The crawl extracted every number shaped like a claim (%, currency, multipliers, x/5, 1K+). Apart from the items above, only two remain on the site:

| Text | Page | Source | Status |
|---|---|---|---|
| "10x" | `/services/automation-integrations` | `src/content/services/technology.ts:12` | Marketing claim. Remove under the plain-language rules |
| "200%" | `/`, `/clients` | Aakash testimonial (DB) | See 5.2 |

### 5.4 Things the chatbot says

The chatbot is part of the site, and it quotes these to visitors:

| Claim | Source | Status |
|---|---|---|
| Price bands: under ₹1,00,000 / $1,500 · ₹1,00,000–3,00,000 / $1,500–4,000 · ₹3,00,000–8,00,000 / $4,000–10,000 · ₹8,00,000+ / $10,000–25,000+ | `src/lib/chatbot/knowledge.ts:56–59`, `src/app/api/chat/route.ts:77` | **Unconfirmed since September.** Confirm or replace with `{{TODO}}` |
| "Typical MVP delivery: 3 to 6 weeks (often 28 days…)" and "Our average velocity to a live, production-ready MVP is **28 days**" | `knowledge.ts:54`, `route.ts:70` | **Unconfirmed.** "Average" implies measured data |
| "100% full intellectual property… transferred to the client on day one" | `knowledge.ts:19` | A policy claim. Confirm it matches your contracts |

---

## 6. Technical SEO findings

### 6.1 Live site: canonical and sitemap point at localhost

Checked on `https://www.thedigitalalchemy.co.in` on 30 Sep 2026:

```
<link rel="canonical" href="http://localhost:3000"/>
<meta property="og:url" content="http://localhost:3000"/>
<meta property="og:image" content="http://localhost:3000/opengraph-image"/>
robots.txt → Host: http://localhost:3000
robots.txt → Sitemap: http://localhost:3000/sitemap.xml
sitemap.xml → 49 URLs, all http://localhost:3000/…
"localhost" occurrences in the live homepage HTML: 28
```

**Cause.** `metadataBase` is already set (`src/app/layout.tsx:16`) from `siteConfig.url`, which is `process.env.NEXT_PUBLIC_SITE_URL ?? "https://thedigitalalchemy.co.in"`. The `??` only falls back when the variable is *unset*. The only env file in git is `.env.example`, which Next doesn't load, so the value must come from **`NEXT_PUBLIC_SITE_URL=http://localhost:3000` in the Vercel project's environment variables**. Adding `metadataBase`, as the brief suggests, would change nothing.

**Fix, two parts:**

1. **You:** in Vercel → Settings → Environment Variables, set `NEXT_PUBLIC_SITE_URL=https://www.thedigitalalchemy.co.in` for Production, then redeploy. I can't reach your Vercel project.
2. **Me (Phase 1):** make a production build refuse to ship a localhost site URL, so this can't silently recur. Also change the code fallback from the non-www to the www origin.

### 6.2 Domains and legacy URLs

| Request | Result |
|---|---|
| `https://www.…` | 200. This is the primary |
| `https://thedigitalalchemy.co.in/` | 308 → www ✓ |
| `http://www.…` | 308 → https www ✓ |
| `http://thedigitalalchemy.co.in/` | 308 → https apex → 308 → www. **Two hops**; one is better |
| `/contact-2/`, `/services-2/`, `/portfolio/` (old WordPress) | 308 → correct new page ✓ |
| `/about-us/`, `/blog/` | **404** |

308 is a permanent redirect and passes ranking the same way a 301 does.

**Corrected in Phase 2: there is no evidence of a database split.** An earlier draft of this audit said the local database had 0 redirect rows while live served the WordPress redirects, and concluded the two might be different databases. That was wrong. The query asked for a field that does not exist (`permanent`; the model has `statusCode`), it threw, and the audit script's own error handler turned the error into an empty result. The database has 13 redirect rows from the original seed on 18 Sep 2026, which is exactly what live serves.

### 6.3 Other technical findings

- **Titles:** 19 of 49 exceed 60 characters (max 80: the homepage). **Descriptions:** 29 of 49 exceed 155. None of the service titles contains a location ("Delhi", "India"), which most of the addendum's suggested keywords do.
- **404 page:** served with a correct 404 status, but its content exists only in the client payload, not in the server HTML. The `<title>` is the homepage's, not "Page not found".
- **robots:** every page is `index, follow`. No `noindex` or `X-Robots-Tag` blocks found. `/admin` and `/api` are correctly disallowed.
- **Lighthouse:** not yet measured. The "before" scores will be taken from the live site at the start of Phase 1. Live won't change until you deploy, so it's a clean baseline.

---

## 7. Navigation, footer and sitewide chrome

**Mega-menu group blurbs** (`src/content/navigation.ts`). All four are the ones the addendum (Part A) replaces:

| Group | Current blurb |
|---|---|
| Development | "AI-ready products, SaaS platforms, and custom software built to scale." |
| Design | "Apple-grade interfaces and brand identity that make products feel effortless." |
| Growth | "Demand generation, measured end to end." |
| AI & Technology | "Intelligent agent automations, integrations, and cloud infrastructure." |

The **"How we work" card** ("Strategy, design, engineering and growth in one team. Most projects fail in the handovers…") lives in `src/components/site/navbar.tsx`.

The menu shows **service names only**, with no per-service one-liner (Part A asks for these). All 20 services are reachable from it.

**Chat button vs. menu CTA (measured).** The launcher is pinned 24px above the bottom-right corner, and the menu's "Start a Project" link hangs at a fixed ~504px from the top. With the menu open:

| Viewport | Overlap? | What a click on "Start a Project" does |
|---|---|---|
| 1280 × 800 | No | Goes to /start-a-project |
| 1280 × 580 | **Yes** | **Opens the chat** (the launcher is on top) |

The collision band is window heights of roughly **530–590px**: a 1366×768 laptop with a bookmarks bar, or any laptop at 125% zoom.

**Footer (on every page)** adds this to every page's jargon count: *"Start an AI Project · Have an AI-ready product or workflow worth automating? · From autonomous agent pipelines to AI-ready SaaS platforms, we architect intelligent systems engineered to compound in value"* and the tagline *"We architect and scale AI automation systems, autonomous workflows, AI-ready SaaS platforms, and digital growth engines…"*.

The footer's service column links **8 of 20** services. Addendum C.9 asks for all main services.

**Mobile menu:** not yet checked at 375px. That's a Phase 1 item.

---

## 8. What already works, so later phases cost less

- **One H1 per page, on all 49 pages.** Verified in rendered HTML.
- **Titles and descriptions are all unique** (0 duplicates), and service titles already lead with the keyword ("Google Ads Management Services | …").
- **Structured data is largely in place:**
  - `Organization` + `ProfessionalService` and `WebSite` sitewide
  - `LocalBusiness` on `/`, `/contact` and `/locations/*`
  - `Service` + `FAQPage` + `BreadcrumbList` on every service page
  - `FAQPage` on industry and location pages
  - No `Review` or `AggregateRating` markup anywhere. Good: the fabricated 4.9/5 is at least not marked up.
- **The service data model already maps onto the Phase 4 template:**

  | Brief's section | Existing field |
  |---|---|
  | "Is this for you?" | `whoFor` |
  | "What you get" | `capabilities` / `deliverables` |
  | "How it works" | `process` |
  | FAQs | `faqs` |
  | Related services | `related` |
  | "For technical teams" | `technologies` |

  Still to add: the before/after example, price and timeline, and the comparison box.
- **The redirect machinery exists** (CMS-managed via `/admin/redirects` and the catch-all route), so any merged or renamed URL can be 301'd without a deploy.
- **The honest empty states are good.** `/work`, `/insights` and `/careers` already refuse to invent content. They need friendlier wording, not replacing.
- **Images:** all 441 have an `alt` attribute. 383 are marked decorative (`alt=""`), and some of those carry meaning and should get real alt text (Phase 7). 148 are lazy-loaded.

**UI/UX vs Product Design** (addendum Part B). The existing content already takes genuinely different angles: Product Design is "deciding what to build", covering discovery and a new product; UI/UX is "interfaces that feel obvious", covering an existing product's usability. I believe both pages can be made distinct without a merge. If the rewrite shows otherwise, I'll say so and propose a 301.

---

## 9. Open questions: decisions I need from you

1. ~~Which database is production?~~ **Withdrawn.** It came from the false "0 redirects" finding corrected in §6.2.

2. **The six testimonials in §5.1:** are any of them real? My reading is that none are. **May I hide the section now**, ahead of the rest of Phase 1, since it's live? (Behind a flag, code kept, as the brief says.)
3. **Aakash's "200% in 3 months":** confirmed figure, or should the quote be trimmed?
4. **Chatbot prices and "28 days":** real, or replace with `{{TODO}}`?
5. **Vercel env var** (§6.1): please set `NEXT_PUBLIC_SITE_URL=https://www.thedigitalalchemy.co.in`. It's the one fix only you can make, and it's the most urgent SEO item.
6. **Keyword verification** (addendum Part B): I can't access Google Keyword Planner or Search Console. I'll record the suggested keywords in `docs/seo-keywords.md` marked *unverified* unless you give me Search Console data or run Keyword Planner yourself.
7. **Social profiles** for `sameAs` in the schema (addendum C.8): which accounts exist?

## 10. Proposed Phase 1 scope (for your OK)

Technical fixes only, no copy rewrites yet:

- [ ] Hide `testimonials.tsx`'s fabricated content behind a feature flag (off by default). Keep real DB testimonials visible, remove the "VERIFIED PARTNER" badge, and stop defaulting missing ratings to 5
- [ ] Production-build guard against a localhost site URL. Switch the fallback to `https://www.thedigitalalchemy.co.in`
- [ ] Fix the lowercased service name in the CTA (`services/[slug]/page.tsx:377`)
- [ ] Fix the chat-button collision: hide the launcher while the menu is open
- [ ] Server-render the 404 content and give it its own `<title>`
- [ ] Mobile menu check at 375px, and verify every nav link resolves
- [ ] Lighthouse baseline (mobile) on `/` and three service pages, from the live site
- [ ] Add a rendered-copy checker (`scripts/audit-copy.mjs`, based on the crawler behind this audit) so "no remove-list word remains" can be proven by a command, as the Definition of Done requires

Phase 2 (information architecture) starts from the six groups proposed in the brief. All 20 services fit them without any URL changes.
