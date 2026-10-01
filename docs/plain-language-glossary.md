# Plain-language glossary

The words this site uses, and the words it doesn't. Every page follows it, including meta descriptions, buttons, FAQs and image alt text.

**Who we write for:** a small-business owner in India with basic English (a clinic, a restaurant, a coaching institute, a shop, a real estate agent, a brand selling online).

**How we write:**
- Aim for a Class 7–8 reading level.
- Keep sentences under 20 words, use common words and write in the active voice.
- Say what the customer gets before saying how we do it.

## 1. Never use: remove, and say the plain thing instead

`npm run audit:copy -- --strict` fails if any of these appear anywhere in a rendered page.

| Don't write | Write instead |
|---|---|
| AI-ready, AI-native | Say what it does. "Uses AI to answer customer questions" or "ready to add AI features later". Usually, just drop it |
| AI-ready SaaS platform | Online software your customers pay monthly to use |
| Autonomous / agentic workflow, autonomous agents | A task that runs automatically, without someone doing it by hand. An AI assistant that does tasks for you |
| Compound growth, growth engine, compounds in value | Steady growth that builds month after month |
| 10x, leverage | Drop it. Say the specific benefit, or nothing |
| Unfair advantage | Drop it |
| Apple-grade | Carefully designed, easy to use |
| Architect (as a verb) | Plan, design, build |
| Multi-tenant | One system that many customers share, each seeing only their own data |
| RAG | AI that answers using your own documents |
| Dead-letter queue | If a step fails, nothing is lost: it is kept and retried |
| Idempotency | Safe to retry: running it twice does not do the work twice |
| Deterministic | Gives the same result every time |
| Orchestration | Running the steps in the right order |

## 2. Explain the first time, or replace

The first use on a page gets the plain meaning in brackets. After that, the short word is fine.

| Term | Plain meaning |
|---|---|
| SaaS | Online software people pay for every month (SaaS) |
| API, integration | Connecting your apps so they share information automatically |
| CRM | The app where you keep your customer list and enquiries |
| Conversion | A visitor becoming an enquiry or a customer |
| Conversion rate | How many visitors out of every hundred become enquiries or customers |
| Performance marketing | Paid ads where you track exactly what each rupee brings back |
| Funnel | The steps from someone first seeing you to buying |
| Lead | An enquiry from someone who might buy |
| Pipeline (sales) | Your list of enquiries and how far along each one is |
| Workflow | The steps your team follows to get a task done |
| Scalable | Keeps working as you grow |
| MVP | A first, simple version you can launch and learn from |
| ROI, ROAS | What you earn back for what you spend |
| Cost per lead (CPL), cost per acquisition (CPA) | What you pay, on average, for each enquiry or each sale |
| CTR | How many people out of every hundred who see an ad click on it |
| B2B / B2C / D2C | Businesses that sell to other businesses / to the public / brands selling straight to customers online |
| SEO | Showing up on Google when people search (SEO) |
| Keyword | The words people type into Google |
| Landing page | A single page made for one ad or one offer |
| Retargeting | Showing ads again to people who already visited |
| UI / UX | How your app looks / how easy it is to use |
| Analytics | Reports on who visits and what they do |
| Hosting, cloud, servers | Where your website or app lives online |
| Uptime | How much of the time your site is working |
| Launch, deploy | Put it live |
| Tech stack | The tools and technology it is built with |
| LLM | AI models like ChatGPT |
| Prototype | A clickable sample of the app, before it is built |
| Wireframe | A simple sketch of each screen |

## 3. Our own words

| Instead of | We say |
|---|---|
| Engagement | Project, or working together |
| Scope, scoping | What's included; planning what's included |
| Discovery | Getting to know your business first |
| Deliverables | What you get |
| Stakeholders | The people involved |
| Roadmap | A plan of what to build, and when |
| Iterate | Improve step by step |
| Leverage, harness, unlock, empower, seamless, cutting-edge, world-class, best-in-class, robust, synergy | Say the specific thing, or nothing |

## 4. Calls to action

| Role | Label | Goes to |
|---|---|---|
| **Main**: one per section, everywhere | **Get a free consultation** | `/start-a-project` |
| Secondary: at most one per section | See what we do | `/services` |

"Free" is a promise about price. It matches what the site already says about the first call ("no obligation"). If that ever changes, the label is one constant, `PRIMARY_CTA` in `src/config/site.ts`.

## 5. Tech names

Names like TypeScript, React, Next.js, Redis, AWS and LangChain do not appear in the main flow of marketing pages. On service pages they live in a collapsed **"For technical teams"** section at the bottom, for the people who ask.

**Platform names are not tech jargon.** Shopify, WordPress, WooCommerce, Google Ads, Instagram, WhatsApp, Zoho and Tally are products business owners know and choose between, so they can appear anywhere. The test is whether our reader would recognise the name.

## 6. Examples

Use the businesses our readers run: a clinic, a restaurant or café, a coaching institute, a shop or showroom, a real estate agent, a brand selling online, a CA or law firm.

An example is always labelled as an example. **It is never presented as a client story unless it is one.**
