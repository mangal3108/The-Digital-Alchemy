# UX & SEO changes

A running record of what changed, phase by phase. Each phase stops for sign-off before the next begins. The baseline everything is measured against is [`ux-audit.md`](ux-audit.md).

## Phase 1: technical fixes

**Status:** complete, awaiting sign-off. Nothing is deployed until you push.

### What changed

| Fix | Files | Before → after |
|---|---|---|
| **Unverified testimonials hidden behind a switch.** The code is kept, not deleted | `src/config/features.ts` (new), `src/components/sections/testimonials.tsx` | Six invented people and companies, plus 4.9/5, "Tech Debt Left 0.0%", $42,000, 82K, +34%, 99.8%, the "Deploy Night" Polaroid, the "Pinned by Marcus" file card, and the "REAL FOUNDER STORIES" / "100% PRODUCTION VERIFIED" badges → **all hidden**. Statistic-shaped strings on the site went from 10 to 3 |
| **Real testimonials stop over-claiming** | `testimonials.tsx`, `src/components/visuals/freeform-canvas.tsx` | The "VERIFIED PARTNER" badge on every database testimonial is removed, since nothing verified them. A testimonial saved without a rating no longer shows five stars: `rating ?? 5` was passed in, and `StickyNote` also defaulted `rating = 5` itself. A stray "📎 tape" chip on real testimonials is removed |
| **Empty proof section disappears** | `testimonials.tsx` | With the switch off and no real testimonials, the section renders nothing instead of an empty "what founders say" board |
| **Site URL can no longer ship as localhost** | `src/config/site.ts`, `.env.example` | A production build now ignores a loopback `NEXT_PUBLIC_SITE_URL` and uses `https://www.thedigitalalchemy.co.in`, warning once in the build log. The fallback moved from the apex to the www origin, which is the one the domain actually serves |
| **Service name keeps its casing in the CTA** | `src/app/(site)/services/[slug]/page.tsx` | "…that ai automation & integrations is not what you need" → "…that AI Automation & Integrations is not what you need", on all 20 service pages |
| **Chat button steps aside while a menu is open** | `src/components/site/navbar.tsx`, `src/components/chatbot/bhadawar-ai.tsx`, `src/app/globals.css` | The launcher covered the mega menu's "Start a Project" on windows about 530–590px tall. It now hides while the desktop mega menu or the mobile menu is open, including from keyboard focus |
| **404 title** | `src/app/not-found.tsx` | "Page not found \| The Digital Alchemy \| The Digital Alchemy" → "Page not found \| The Digital Alchemy" |
| **Rendered-copy checker** | `scripts/audit-copy.mjs` (new), `npm run audit:copy` | Reads the served HTML of every sitemap page. Always fails on localhost, off-origin canonicals, H1 ≠ 1, a missing title or description, or broken internal links. Reports remove-list jargon and statistic-shaped text; `--strict` also fails on jargon, which is the Definition-of-Done check for Phase 3 |
| **Audit corrections** | `docs/ux-audit.md` | The remove-list total was 135, not 136. The 404 *does* list growth services (Digital Marketing and SEO). Three fabricated items missed in Phase 0 are added: the Polaroid, the "42ms" claim, and the "Pinned by Marcus" file card |

### How it was verified

All checks ran against a production build. The local `.env` deliberately still has `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, which reproduces the live misconfiguration.

| Check | Result |
|---|---|
| `npm run audit:copy` must-fix checks | **Pass.** 0 "localhost", canonicals on the production origin, one `<h1>` per page, titles and descriptions everywhere, 49/49 internal links resolve |
| The checker catches the old bug | Run against the pre-fix build, it failed with "localhost appears 28×" on the homepage, the same count as the live site |
| Canonical, robots and sitemap | `https://www.thedigitalalchemy.co.in` throughout |
| Fabricated names or figures on `/` and `/clients` | 0 |
| Chat collision at 1280×580 (the size that failed) | A real mouse click on the menu's "Start a Project" navigates to `/start-a-project`, and the chat stays closed |
| Mobile menu at 375px | All 4 groups and all 20 services reachable, all 20 return 200, no sideways scroll, launcher hidden while open |
| Regression suites | CSS: 0 missing classes. Admin: 18/18 routes plus the auth guard. Layout: all panels inside the page |
| Like-for-like with Phase 0 (`<main>` only) | Remove-list terms 135 → 131. Homepage 1,749 → 1,312 words. `/clients` 648 → 211 words |

**Why the checker reports 911 remove-list terms when the audit said 135:** it reads the whole page (header menu, footer, titles, descriptions, alt text), not just `<main>`. The mega-menu blurbs are rendered into every page's HTML, so "Apple-grade" alone counts 51 times. That's the honest total the rewrite has to bring to zero.

### Lighthouse baseline (the "before")

Lighthouse 12.8.2, mobile, simulated throttling, run against the **live** site on 30 Sep 2026. PageSpeed Insights' shared quota was exhausted, so it was run locally. It's the same engine, but the numbers can drift a few points between machines.

| Page | Performance | SEO | Accessibility | Best practices | LCP | TBT |
|---|---|---|---|---|---|---|
| `/` | **63** | 100 | 92 | 79 | 8.3 s | 400 ms |
| `/services/web-development` | 76 | 100 | 95 | 79 | 5.1 s | 270 ms |
| `/services/google-ads` | 75 | 100 | 95 | 79 | 5.7 s | 240 ms |
| `/services/automation-integrations` | 77 | 100 | 95 | 79 | 5.6 s | 190 ms |

**Lighthouse SEO 100 is not evidence of good SEO here.** It passed the canonical check ("Document has a valid rel=canonical") on a live page whose canonical is `http://localhost:3000`. The addendum's "SEO 100" target was therefore already met while the site was broken for Google, so the direct checks above are what to trust.

Performance is the real gap: the homepage is 22 points short of the 85 target, and the biggest opportunity is unused JavaScript (about 900 ms). That's planned work for the addendum's C.11, not Phase 1.

### Not done, and why

- **The 404's content is still not in its server HTML.** Visitors with JavaScript see the full branded page, which I verified in a browser, and Google doesn't index 404s. But the raw HTML body is empty. I traced it far enough to rule out our code: Next's *prerendered* 404 contains the content, every *runtime* 404 omits it whatever route triggers it, the server logs no render error, and Googlebot gets the same response. A site-level 404 inside the normal layout didn't change it, so I reverted that rather than ship a visual change that fixed nothing. What I can say is that this is how this version of Next serves runtime 404s. I haven't found a fix within Phase 1.
- **Aakash's "200% in 3 months"** and the chatbot's prices and "28 days" are unchanged, because they're copy. They remain in the TODO list below.

### Found during Phase 1, for later phases

- **Meta Pixel may fire before consent.** Lighthouse flags third-party cookies on every page. The root layout contains a hardcoded Meta Pixel (`fbq('init', …)` plus a `<noscript>` image), while `.env.example` promises that "nothing loads until the visitor consents". That needs checking against your consent banner. It's a privacy-law question (DPDP Act, and GDPR for UK visitors), not just SEO.
- **The mobile menu lists Services last,** below six other links. On a phone only the first service group is visible without scrolling. This belongs in Phase 2's navigation work.
- **`/start-a-project` is titled "Start an AI Project — AI Automation & AI-Ready Products".** That's Phase 3 copy.
- **The testimonial section's lede** still says "founders and technical leads we build with" (plural) and "No agency fluff…", over what is now one real testimonial. That's Phase 3/5 copy.

### Needs you

1. **Vercel → Settings → Environment Variables:** set `NEXT_PUBLIC_SITE_URL=https://www.thedigitalalchemy.co.in` for Production. The code now protects against the wrong value, but the variable should still be right, and until you redeploy the live site keeps serving localhost. Your next build log will show `[site] NEXT_PUBLIC_SITE_URL is "http://localhost:3000"…` if it's still wrong.
2. **Deploy** when you're happy with this phase. None of these fixes reach the live site until you push.
3. The open questions in `ux-audit.md` §9 still stand, except question 1, which was withdrawn in Phase 2.

## Phase 2: structure (information architecture)

**Status:** complete, awaiting sign-off.

### What changed

| Change | Files | Detail |
|---|---|---|
| **Six groups by customer need**, replacing four by department | `src/content/services/types.ts`, the four service files, `index.ts` | Get a website · Build an app or software · Get more customers · Automate your work with AI · Design & branding · Keep it running. Exactly as the brief proposed. **No service was merged and no URL changed**, so no redirects were needed (all 20 verified 200). Each service's `group` field is now the single source of truth: the menu used to keep its own separate list of slugs per column, which could drift from `/services` |
| **A plain one-liner for every service** | the four service files (new `oneLiner` field) | Verbatim from the addendum's Part B table. Used in the menu, on `/services` cards and in the helper. The build fails if a service is missing one |
| **Top nav: six items** | `src/content/navigation.ts` | Services · Work · Industries · About · Insights · Contact. **Products and Careers moved to the footer**: both pages stay live and linked, but neither has anything published yet. One line to swap back |
| **Desktop mega menu rebuilt** | `src/components/site/navbar.tsx` | Six groups, each with a plain one-line explanation. Every service now shows its grey one-liner (Part A). The "How we work" card uses the addendum's text. The "Not sure what you need? Help me choose" prompt, All services and Start a Project moved to the top-right column so they are visible at any window height |
| **Mobile menu** | `src/components/site/mobile-menu.tsx` | Services now comes **first** (it was last, below six links). All six groups start collapsed, so every plain label fits on one phone screen. Adds "Not sure what you need? Help me choose" |
| **"Not sure what you need?" helper** | `src/content/service-picker.ts`, `src/components/sections/service-picker.tsx`, `service-picker-section.tsx` | 3–4 questions (business type, goal, then one or two follow-ups) → one or two services with a plain reason, the relevant industry page, and "Talk to us about this", which opens the enquiry form with the service preselected. On the homepage (after "what we do") and near the top of `/services` (`#help-me-choose`, where the menu links). The build fails if it would ever recommend a service or industry that does not exist |
| **"Which one do I need?" on every service page** | `src/content/services/comparisons.ts`, `src/components/sections/service-comparison.tsx` | Each page compares itself with its closest siblings: website vs web app vs custom software vs SaaS vs mobile app vs e-commerce; Performance Marketing vs Google Ads vs Meta Ads; SEO vs Google Ads; Social Media vs Meta Ads; Lead Generation vs Funnels; Automation vs Custom Software; UI/UX vs Product Design vs Branding; Cloud vs Maintenance. **Digital Marketing** is the umbrella and links to all eight growth services. The build fails unless every service shows exactly one box |
| **`/services` regrouped** | `src/app/(site)/services/page.tsx` | Six group sections in the new order, with the plain one-liner on each card instead of the jargon summary |

**UI/UX vs Product Design:** kept as two pages. The comparison makes the difference plain (fix an app you have vs plan a new one before building), so no merge is proposed.

### How it was verified

| Check | Result |
|---|---|
| All 20 service URLs | 200. No URL changed |
| One comparison box per service page, current row marked "This page" | Pass (the build enforces it; 7 pages spot-checked in the HTML) |
| Menu at 1280×800 | Fits with **0px overflow**. The first version was 31px too tall, with its action row below the fold, which is why the actions moved to the right column |
| Menu at 1280×580 | Groups scroll inside the panel; "Help me choose" stays visible; the last service is reachable |
| Mobile menu at 375px | Services first, six groups, Help me choose, launcher hidden (screenshot) |
| Helper, clicked through | Five paths tested. Focus moves to each new question and to the result, announced by a live region. Back keeps earlier answers. "Something else" correctly gives no industry link. The enquiry link preselects the recommended service |
| Anchor links (`/services#help-me-choose`, `#which-one`) | Land 96px from the top, just below the header, on a fresh page load and from the menu |
| `npm run audit:copy` must-fix | Pass. Remove-list terms across whole pages: **911 → 770** (the menu's jargon blurbs and summaries replaced by plain lines) |
| CSS, admin (18/18), layout | All pass |

### Corrections

- **The Phase 0 "database split" finding was wrong,** and the question it raised is withdrawn. The audit's query for redirects asked for a field that does not exist, threw, and its error handler reported that as "0 rows". The database has the 13 WordPress redirects, the same as live. Corrected in `ux-audit.md` §6.2.
- **An anchor-scroll "fix" was written and then removed.** In the test browser, `/services#help-me-choose` did not scroll to the helper. That was the test pane being hidden (smooth scrolling does not animate while a page is not painting), not a site bug. A headless Chrome that paints landed correctly with and without the fix, so the fix was dropped rather than shipped on a misdiagnosis.

### For later phases

- **Service names** still carry jargon in the menu and on cards ("AI-Ready SaaS Development"). That's Phase 3.
- **The enquiry form offers 12 of the 20 services.** A service preselected from the helper or a service page (e.g. Automation) is accepted and submitted, but isn't shown as selected. Phase 6 replaces the options with the six groups.
- **The helper's advice** follows simple, stated rules (for example, businesses people search for → Google first; businesses people discover by seeing → Instagram first). It's worth reading `src/content/service-picker.ts` once to confirm it matches how you would advise a client.

## Phase 3: plain English on every page

**Status:** complete, awaiting sign-off.

### What changed

- **The rules.** [`plain-language-glossary.md`](plain-language-glossary.md) lists the banned words with a plain replacement for each, the terms that must be explained on first use, the one CTA, where tech names may appear, and a rule that platform names business owners know (Shopify, WordPress, WhatsApp, Tally) are fine anywhere.
- **One call to action.** "Get a free consultation" everywhere; secondary actions say "See what we do". The per-service `ctaLabel` field was removed from the data and from the admin's editable fields, so the label is changed in one place (`PRIMARY_CTA`). `/start-a-project` now opens with the same words people clicked.
- **All 20 service pages rewritten.** Every H1 now names the service in plain words (Phase 0: 12 of 20 did not). Each page leads with who it is for, and has at most 6 "what you get" items, 4 steps, 4–6 FAQs and 3 related services, matching the Phase 4 template so Phase 4 does not rewrite the same text again. Every honest position was kept: cost depends on scope, no guaranteed leads or rankings, no bought links or lists, you own the code and the ad accounts, and fees are never a share of ad spend.
- **"For technical teams".** Tech names moved out of the main flow of service pages into a collapsed panel at the bottom.
- **Service template.** Plain headings ("Is this for you?", "What you get", "Step by step"). The four intro paragraphs repeated on all 20 pages were removed, and related-service cards use the plain one-liners.
- **Supporting content.** How-it-works diagrams, process stages, "why us", ways of working and technology descriptions, all rewritten.
- **Homepage.** New hero ("We build websites, apps and AI tools, and bring you customers online.") and plain section headings throughout. The hero's secondary button said "Explore our work" while linking to `/services`; it now says what it does.
- **Other pages.** About, Services, Work, Products, Insights, Careers, Clients, Contact, Start a project, and the industries and locations pages with their templates. Every page's H1 now says what the page is (Careers, Insights and the industry pages did not).
- **Meta titles and descriptions.** All 49 unique, and all within 60 and 155 characters, with the keyword first and the brand last. They use the addendum's suggested keywords, which are still **unverified** (see question 6).
- **Industries rewritten.** Each H1 names the industry and what we do for it, with Indian examples (clinics, coaching institutes, CA firms, UPI).
- **Locations rewritten.** What makes each page genuinely different was kept (time zones, currency, privacy law, languages, hosting region), as addendum C.13 requires.
- **Enquiry form.** "Scope" and "on our radar" replaced; the full form rework is Phase 6.

### Removed because they were not true, or not for visitors

- "Note for the site administrator: …" paragraphs were visible to every visitor on `/products`, `/work` and `/clients`. Removed.
- About's origin story ("We began by building… growth engines… It became clear early on…") was unconfirmed company history, and it promised "verifiable ROI". Replaced with present-tense facts.
- The proof strip's empty state claimed clients "across the US, UK, India, and UAE", and its heading said "worldwide". Both are now neutral.
- Several implied-experience claims were softened: "most clients do", "a few people have joined that way", "the problems we have seen in it", "the ones we work in most", and "many clients find the offset useful".
- The "10x" claim is gone.

### Bug found and fixed: page headings rendered at 16px

`cn()` (tailwind-merge) did not know the site's type scale, so it read `text-display-2` as a colour. Next to a real colour class it dropped the size, and **most inner-page H1s rendered at body-text size**. This was already the case before Phase 3 (visible in the Phase 1 `/clients` screenshot, and missed at the time). The fix is in `src/lib/utils.ts`: the six custom sizes are declared as font sizes. All 48 inner pages now measure 62px at 1280 wide, and the homepage 86px.

### How it was verified

| Check | Phase 0 | Now |
|---|---|---|
| Remove-list terms anywhere on any page: menus, footer, titles, descriptions, alt text (`audit-copy --strict`) | 911 | **0** (strict mode passes) |
| Remove-list terms in `<main>` | 135 | **0** |
| Terms that need explaining, in `<main>` | 494 | 112 |
| Average reading grade (target: Class 7–8) | 8.3 | **6.0** |
| Distinct CTA labels | 22 | **1** |
| Statistic-shaped text | 10 | 2 (both awaiting your confirmation) |
| Service H1s that name the service | 8 of 20 | **20 of 20** |
| Titles over 60 / descriptions over 155 characters | 19 / 29 | **0 / 0** |
| Duplicate titles or descriptions | 0 | 0 |
| CSS, admin (18/18), layout | pass | pass |

### Honest gaps

- **137 sentences run 21–25 words,** against the brief's "under 20". The 25 worst (26+ words) were split. The rest are mostly one clause over, and the site averages 10 words per sentence. The privacy and terms pages were left alone: rewording legal text changes its meaning, and that should go past your lawyer.
- **"Repeated paragraphs" rose from 25 to 45, for reasons that are by design.** 24 are the "Which one do I need?" rows, which your brief requires on each sibling page. 18 are tech descriptions inside the collapsed panel, and 3 are short call-to-action lines. The problem Phase 0 flagged (section intros duplicated in the main content of all 20 service pages) is gone.
- **The homepage technology section still lists tech names.** Your Phase 5 brief moves it off the homepage, so it was left for Phase 5.
- **The chatbot was not rewritten.** Its answers are generated, not shown on the page, and its knowledge base still holds the unconfirmed prices (see TODO 2).
- **`src/components/sections/process.tsx` is dead code.** It is not rendered anywhere, so it was not rewritten.

## Phase 4: one template for every service page

All 20 service pages now use one layout, filled from one data file per group (`src/content/services/{development,design,growth,technology}.ts`). The layout is in `src/app/(site)/services/[slug]/page.tsx` and does not change from page to page.

### What changed

The page runs in the brief's order:

| # | Section | Where it comes from |
|---|---|---|
| 1 | Heading: what it is, and a sentence on who it is for | `title`, `lede` |
| 2 | **Is this for you?** 4 situations, then "Sound familiar?" (4 common problems), then "Which one do I need?" where the service has close neighbours | `whoFor`, `problems`, `comparisons.ts` |
| 3 | **What you get:** 6 items, each a one-line benefit with one sentence under it | `capabilities` |
| 4 | **Example** (new): before and after for a typical business, labelled as an example and not a client story. Real projects appear under it only once one is published for that service | `example` |
| 5 | **How it works:** 4 steps, a timeline line, what you have at the end, and the diagram where one exists | `process`, `typicalTimeline`, `deliverables` |
| 6 | **Price and timeline** (new), plus the ways to work with us | `priceFrom`, `typicalTimeline`, `engagement` |
| 7 | Questions (4–6) | `faqs` |
| 8 | Related services (3), each saying **"You need this when…"** (new) | `related`, `needItWhen` |
| 9 | One button, then **WhatsApp and phone** (new) in the closing band directly below. *Changed in Phase 5: see there* | `CtaSection`, footer |

The collapsed "For technical teams" panel sits between 8 and 9, as in Phase 3.

**Prices and timelines are empty, on purpose.** Each of the 20 services has `priceFrom: ""` and `typicalTimeline: ""`, marked with a `{{TODO}}` comment in the data file. You can fill them there, or in **Admin → Page copy** (two new fields on every service). Until then, visitors see:

- Price: *"Every project is priced on what it needs. Tell us your needs for an exact quote, with no obligation."*
- Timeline: *"How long it takes depends on what is included. We give you a timeline before any work starts."*

Once you set them, they change to *"Most projects start from ₹…. Tell us your needs for an exact quote."* and *"Typical timeline: …. We confirm the dates before any work starts."*

A raw `{{TODO}}` can never reach a visitor. In development only, a dashed note on each page lists what is still missing. `npm run audit:copy` now fails if a placeholder or that note appears in a built page.

**The 20 examples are made up, and say so.** Each one uses a business our readers run: a dental clinic in Dwarka, a CA firm in Janakpuri, a home bakery, a coaching institute, and so on. None has figures, because an example cannot promise a result. Each is shown under an "Example" label with the line "It is an example, not a client story."

WhatsApp and phone clicks are tracked as `whatsapp_click` and `phone_click` by the existing analytics. (Phase 5 moved them from the service CTA into the footer's closing band, so every page has them once.)

No URLs changed and no sections were deleted. "Problems we solve" moved into section 2 as "Sound familiar?", and the diagram moved into "How it works".

### How it was verified

Against a production build (`.next-verify`, port 3100):

| Check | Result |
|---|---|
| Sections in the brief's order, CTA last, on all 20 pages | 20 / 20 |
| WhatsApp link (`wa.me/919990463175`) and phone link (`tel:+919990463175`) in the CTA | 20 / 20 |
| Related cards with "You need this when…" | 3 on every page |
| Words in the main content, without the collapsed tech panel (target 800–1,200) | 843 to 1,240, average 1,004 |
| Copy audit `--strict` (includes the new placeholder check) | PASS; 0 remove-list terms |
| Typecheck, lint | pass |
| CSS, layout, admin, contrast | pass |
| Sideways scroll at 375px | none |

### Honest gaps

- **SaaS development runs 1,240 words**, 40 over the target. Its comparison table and six FAQs account for most of it. Everything else is within range.
- **"Rough timeline" per step is not shown.** Per-step durations would be invented numbers. The page shows one overall timeline once you set it.

## Phase 5: homepage

### What changed

The homepage now runs in the brief's order, and nothing else:

| # | Section | Notes |
|---|---|---|
| 1 | **Hero:** headline, one line, two buttons | Subtext is now one line: *"For clinics, shops, restaurants, coaching institutes and growing brands, from a team in New Delhi."* The four chips (they repeated section 2) and the *"Working with clients worldwide"* line (TODO 9, unconfirmed) are gone. The illustrated screens stay, still labelled *"Illustrative interface, not client data"* |
| 2 | **What we do:** the six service groups as cards | Icon, the group's one plain line, and *"See 4 services"* linking to that group on /services. Replaces six image bands for individual services |
| 3 | **Not sure what you need?** | The helper from Phase 2, unchanged |
| 4 | **How we work:** one section, four steps | The two process sections are merged (the scroll story had six steps; a second block repeated them as *"Six clear steps"*). The four steps are *Talk and plan, Design and build, Launch, Grow*, made from the old six with no new claims. /services and /start-a-project use the same four |
| 5 | **Proof: real only, and small** | One band: Aakash's testimonial and the Internite logo, both from the admin. It grows by itself as you publish more clients, testimonials or case studies, and disappears if there are none. The *"case studies are being rebuilt"* block is off the homepage (it stays on /work) |
| 6 | **Why us:** three points | *One team, start to finish. We tell you what you do not need. You can see progress any time.* Each is something the site already promises elsewhere. The "formula" block is gone. /about keeps its fuller list of four |
| 7 | **Final CTA:** button, WhatsApp, phone | The footer's closing band, which every page shares, now has **Message us on WhatsApp** and **Prefer to talk? Call +91 9990463175** next to the main button. The email address sits in the footer directly below |

**Moved, not deleted:**

| Was on the homepage | Now |
|---|---|
| Technology section | /about, after the values |
| Countries, and the working hours we share | Already on /locations (each country card shows the shared hours) |
| Products, articles, company figures | /products, /insights, /about (figures show only once you publish real ones) |
| "One team: plan, design, build and market" showcase | Merged into "What we do" and "Why us" |

No URLs changed. The old components (`product-showcase`, `products-preview`, `featured-work`, `global-reach`, `insights-preview`, `feature-band`, and `ProofStrip` in `proof-strip.tsx`) are no longer used anywhere, but they are **still in the code**. Say if you want them deleted.

**One change to Phase 4.** With WhatsApp and phone in the closing band on every page, service pages would have shown them twice in a row. They now appear once, in that band, directly under the service's own "Talk to us about…" section. The trade-off is that the WhatsApp message no longer names the service ("Hi, I would like to talk about a project.").

### Bug found and fixed: invisible button in the footer

On the dark closing band, the main button was white with near-white text, so it read as an empty white box. That has been on every page since before Phase 1. The button now uses its normal style for dark backgrounds: dark text on a light button, 17:1 contrast.

### How it was verified

Against a production build (`.next-verify`, port 3100):

| Check | Result |
|---|---|
| Sections in the brief's order (hero → what we do → helper → how we work → proof → why us → final CTA) | in order |
| Service group cards / process steps / `<h1>` count | 6 / 4 / 1 |
| Removed text is gone from the homepage (being rebuilt, tech section, globe, "worldwide", formula, "six steps", chips) | all gone |
| Moved content still reachable (/about tech section, /locations hours, /products, /insights) | yes |
| WhatsApp (`wa.me/919990463175`) and phone (`tel:+919990463175`) in the closing band | yes |
| Words in the homepage `<main>` | 661 |
| Copy audit `--strict` | PASS |
| Typecheck, lint | pass |
| CSS, layout, admin, contrast | pass |
| Scroll story, four steps (colour, image and progress rail advance) | 4 / 4 |
| Sideways scroll at 375px | none |

## Phase 6: other pages

Each page now has one clear purpose and one call to action. **The 20 secondary buttons** that sat beside the main one ("How we work", "All services", "More insights" and so on) are gone from inner pages; breadcrumbs and the menu already do that job. Where the main button appears twice, it is the same action at the top and the bottom of the page. Pages with nothing published yet (work, products, insights) now show a single button in the hero, not three or four.

### The enquiry form (/contact and /start-a-project)

**Before:** four steps, eight fields, email required, a 10-character minimum message.
**Now:** one step, four fields.

| Field | |
|---|---|
| Your name | required |
| Phone or WhatsApp number | required, at least 7 digits; "with country code if you are outside India" |
| What do you need? | required dropdown: the six service groups, as named in the menu, plus "Not sure yet" |
| Anything else we should know? | optional |

- **What happens next** is spelled out beside the form and on the thank-you screen: we call or WhatsApp you, ask a few questions, suggest a next step (or say honestly we are not the right fit), then a written plan and price.
- **How fast we reply** is a new setting, **Admin → Settings → "How fast you reply to enquiries"**. It is empty, so no time is promised yet. Once set (e.g. "one working day"), the form, the thank-you screen, /start-a-project and the /contact FAQ all say "We reply within one working day."
- Links like `/start-a-project?service=google-ads` preselect the right group ("Get more customers").
- The server checks the same rules. Email is still accepted if some other form sends one, and old enquiries stay readable.
- **Admin:** leads list, lead detail, CSV export and the notification email now show "Get a website" instead of `website`. A lead without an email shows its phone number instead. No database change was needed: "no email" is stored as an empty string.
- The confirmation email to the visitor goes out only when they gave an email, which the short form does not ask for.

### Page by page

| Page | Change |
|---|---|
| /services | Already matched the brief from Phase 2 (grouped by need, helper first). Only the extra buttons went |
| /about | Reordered to the brief: **who we are** (the mission folded in as one line), **the team**, **where we are**, **how we work** (the same four steps as the homepage, then "What you can count on"). The two overlapping lists ("How we are different", "What we hold ourselves to") are merged into one list of seven; nothing was dropped but the repetition. No team members are published yet, so the team section says who you would work with, with no names or photos, until you add profiles in Admin → Team |
| /work | H1 is now "Our work: see examples on a short call." One bullet ("a chance to speak with a client in a similar business") was removed: it promised references the site cannot back up. One call to action instead of four |
| /industries/* | New first section, **"What we can do for {a clinic or hospital}"**, with three concrete things, each linking to the service that delivers it. No results or client names. The /industries cards list the same three |
| /products, /insights | H1s say what the page is. **Removed a public "Note for the site administrator"** from /insights (Phase 3 missed it). The copy audit now fails any page that shows one |
| /careers | One call to action. With no roles open, the hero button is "Send an introduction", not "View open roles". The #roles link also pointed at nothing before; it now works |
| /locations/* | H1s already said what each page is. One awkward title fixed ("…for UK businesses, in your working day.") |

### Also fixed

- `npm run lint` failed on the whole project because it scanned the verification build folder (`.next-verify`), which is generated code. That folder is now ignored, like `.next`. It also flagged an unused counter in `scripts/verify-flow.mjs`, which now reports it.
- `scripts/verify-flow.mjs` now sends the short form. **I did not run it this phase:** it writes a test enquiry to your live database (then deletes it), and your inbox may get a notification email. Run it when that is fine: `npm run verify:flow`.

### How it was verified

| Check | Result |
|---|---|
| Server form rules (7 cases: good short form, no message, missing phone, short phone, bad email, unknown need, old long form) | all as intended |
| Form in a browser: four fields, seven options, `?service=` preselects, empty submit shows plain errors and sends nothing | pass |
| One `<h1>` per page, every H1 says what the page is | 29 / 29 |
| Copy audit `--strict` (now including the admin-note check) | PASS |
| `npm run lint` (whole project), typecheck, production build | pass |
| CSS, layout, admin, contrast | pass |

## `{{TODO}}` items for you

| # | Item | Where |
|---|---|---|
| 1 | Confirm or trim Aakash's "200% in 3 months". **Now the only quote on the homepage** | Admin → Testimonials |
| 2 | Confirm or replace the chatbot's price bands and "28 days to a live MVP" | `src/lib/chatbot/knowledge.ts`, `src/app/api/chat/route.ts` |
| 3 | Confirm "100% full IP and repository ownership on day 1" matches your contracts (Sprint Manifesto, still visible) | `testimonials.tsx` |
| 4 | ~~Confirm the "10x" claim~~ Removed in Phase 3 | n/a |
| 5 | Set the Vercel env var above | Vercel |
| 6 | ~~Is Vercel's `DATABASE_URL` the same as the local one?~~ Withdrawn: based on a wrong Phase 0 finding, corrected in the audit §6.2 | n/a |
| 7 | Social profiles for `sameAs` | n/a |
| 8 | Confirm the first consultation is free, as the new main button says ("Get a free consultation") | `PRIMARY_CTA` in `src/config/site.ts` |
| 9 | ~~Confirm "Working with clients worldwide" under the homepage hero~~ Removed in Phase 5 | n/a |
| 10 | **Starting prices for the 20 services** (e.g. "₹60,000"). Until set, pages say every project is priced on what it needs | `priceFrom` in `src/content/services/*.ts`, or Admin → Page copy |
| 11 | **Typical timelines for the 20 services** (e.g. "4 to 8 weeks") | `typicalTimeline`, same places |
| 12 | Confirm two promises the service pages now make: a quote comes "with no obligation", and "we give you a timeline before any work starts" | `src/app/(site)/services/[slug]/page.tsx` |
| 13 | Read the 20 examples. They are labelled as examples, but if one feels unlike your real work, change or drop it | `example` in `src/content/services/*.ts` |
| 14 | **How fast you reply to enquiries**, e.g. "one working day" | Admin → Settings → Contact |
| 15 | Confirm two older promises on the country pages: India "questions are answered within the day", and UAE "in-person workshops can be arranged" | `src/content/locations.ts` |
| 16 | Confirm the careers page promise: "if [the exercise] takes more than a couple of hours, we pay for your time" | `src/app/(site)/careers/page.tsx` |
| 17 | Add team profiles (name, role, photo) when people agree to be featured; /about shows them automatically | Admin → Team |
