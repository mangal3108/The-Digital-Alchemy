# The Digital Alchemy

A rebuild of [thedigitalalchemy.co.in](https://thedigitalalchemy.co.in) as a
digital product, software and growth studio — a marketing site, a case-study
and insights CMS, a lead pipeline, and an admin panel to run all of it.

Replaces a WordPress/Elementor site of five pages.

---

## Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 15.5 (App Router) | Server rendering, per-route static generation, image and font optimisation |
| Language | TypeScript (strict) | The build fails on type errors rather than shipping them |
| Styling | Tailwind CSS v4 | Design tokens defined once in `globals.css`, consumed as utilities |
| Database | Prisma + MongoDB Atlas | See [Database](#database) |
| Auth | Server-side sessions, bcrypt, opaque tokens | Revocable immediately; a leaked row cannot be replayed |
| Images | sharp | Re-encoded to WebP on upload, EXIF stripped |
| Motion | CSS + a small WebGL layer | No animation library on the critical path |

**Why Next 15 and not 16:** this machine's Application Control policy blocks
`@next/swc-win32-x64-msvc`, so Next falls back to its WASM builder. Next 16.3's
WASM path has a binding bug (`invalid type: boolean, expected enum
CodeFrameColorMode`) that 500s every request. Next 15.5's WASM fallback works.
On a machine where the native binary loads, Next 16 is fine — the application
code itself is version-agnostic.

**The same policy blocks Tailwind's CSS engine.** Tailwind v4 compiles through
`@tailwindcss/oxide`, a native module. When it is refused, the error is
misleading — it claims the binding is *missing* and tells you to delete
`node_modules`, which changes nothing because the file is present and merely
denied. Oxide ships a WebAssembly fallback, but npm skips it on an x64 host
because the package declares `cpu: wasm32`. `scripts/ensure-css-binding.mjs`
runs on `postinstall`, tries to load the engine, and installs the fallback with
`--force` only if the load fails. On a machine where the native binary loads it
does nothing. Run it by hand with:

    npm run fix:css

Builds through WASI are slower (~60s compile vs ~30s native) but complete.

**The WASI fallback cannot read the filesystem, so the class list is built in
JS.** Under WASI, oxide's source scanner is sandboxed away from the project and
reports zero files for every path form — absolute, relative, Windows, POSIX,
drive-stripped. The bindings preopen `path.parse(cwd).root`, the literal string
`C:\`, as a WASI guest path; guest paths are POSIX, so nothing beneath it
resolves.

This failure is silent and worth understanding, because it does not look like a
failure. Tailwind finds no classes, generates no utilities, and still writes a
large, valid stylesheet — the `@theme` block, the accent scopes and the
keyframes in `globals.css` pass through untouched. The build succeeds. Type
checking, linting and the SEO audit all pass. Every page renders with no layout
at all: an unconstrained `<svg class="size-8">` expands to fill the viewport.

`scripts/postcss-inline-sources.cjs` runs before Tailwind, scans `src/` in plain
JS and hands the result over through `@source inline(...)`, which takes
candidates literally and never touches disk. Variants, arbitrary values and
group modifiers all survive that path. It runs *in addition to* Tailwind's own
scan, so on a machine where the native binary loads the union is identical and
nobody needs to know it exists.

Because a whole class of failure here is invisible to every other check, verify
CSS against the rendered pages rather than against the stylesheet alone:

    npm run verify:css

That pulls the classes out of the HTML of thirteen representative routes, pulls
the selectors out of the served CSS, and diffs them. Checking the stylesheet for
design tokens proves nothing — tokens are precisely the part that survives.

---

## Getting started

```bash
npm install
npx prisma migrate dev      # creates prisma/dev.db and applies migrations
npm run db:seed             # metrics, redirects, categories, admin user
npm run dev
```

Then open <http://localhost:3000>, and the admin at
<http://localhost:3000/admin>.

The seed prints a generated admin password once. Set `ADMIN_EMAIL` in `.env`
first, or no admin account is created.

### Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Create and apply a migration |
| `npm run db:seed` | Seed baseline data (idempotent) |
| `npm run db:studio` | Prisma Studio |
| `node scripts/seo-audit.mjs [url]` | Crawl the sitemap and check titles, descriptions, canonicals, H1 count, JSON-LD validity and duplicates |
| `npm run verify:globe` | Check the globe's geometry pipeline — decode, projection, market lookup, hemisphere culling |
| `npm run palette` | Recompute the accessible variants of each accent |
| `npm run build:images` | Curate, colour-grade and optimise the renders in `/images` into `/public/images` |
| `npm run build:globe` | Regenerate the country geometry from `world-atlas` |
| `npm run logo` | Key the white background out of `images/logo.jpeg` and emit the transparent mark and lockup |
| `npm run verify:css` | Diff the classes rendered in the HTML against the selectors in the served CSS |
| `npm run fix:css` | Install Tailwind's WebAssembly engine when the native binary is blocked |
| `npm run capture:ui` | Screenshot the running site and admin panel at 2×, including authenticated routes |
| `npm run build:hero` | Composite the captured screenshots into device frames and emit `hero-lineup` |
| `npm run qr` | Regenerate the WhatsApp QR from the number in `src/config/site.ts` |
| `npm run verify:narrative` | Drive the homepage through all six process stages and assert each one advances |
| `npm run verify:contrast` | Measure text contrast against the pixels actually rendered behind it |
| `npm run verify:admin` | Walk every admin route as a signed-in Super Admin and check each renders |
| `npm run serve` | Start the production server, clearing the port first, and wait until it actually answers |
| `node scripts/map-inbox.mjs [--apply]` | Map a Flow drop in `images/_inbox` onto the brief's filenames, cropping the watermark |
| `node scripts/contact-sheet.mjs out.png dir files…` | Build a labelled contact sheet, for looking at a batch before it ships |
| `node scripts/shot-at.mjs url selector out.png [stage]` | Screenshot a page after scrolling an element into view |

---

## Environment

Copy `.env.example` to `.env`. Nothing here has a fabricated default — absent
values disable the feature rather than guessing.

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | `file:./dev.db` locally; a Postgres URL in production |
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical origin. Baked in at build time |
| `ADMIN_EMAIL` | first run | Creates the initial Super Admin |
| `ADMIN_PASSWORD` | no | Blank generates a strong one and prints it once |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASSWORD` | no | Without these, mail is logged instead of sent. Leads are still stored |
| `SMTP_PORT` / `SMTP_SECURE` / `SMTP_FROM` | no | Defaults to port 587, STARTTLS |
| `LEAD_NOTIFICATION_EMAIL` | no | Falls back to the contact email in site settings |
| `NEXT_PUBLIC_GA4_ID` etc. | no | Better set in `/admin/settings`. Only load after consent |

---

## Database

**MongoDB Atlas**, through Prisma. The schema was originally written to be
portable — no native enums, no `Json` columns, no scalar lists, with status
fields as strings validated by Zod — which is most of why the move across was
mechanical rather than a rewrite.

Three things did have to change, and they are worth knowing before editing the
schema:

- **Every id is an ObjectId.** `String @id @default(auto()) @map("_id")
  @db.ObjectId`, and every foreign key carries `@db.ObjectId` to match. A
  foreign key left as a plain `String` fails at query time, not at validation.
- **`PostTag` lost its composite primary key.** MongoDB has none, so the join
  row carries its own `_id` and the pair is enforced by `@@unique([postId,
  tagId])`. Every query the application makes is unchanged.
- **`SiteSetting` keys by its own string.** MongoDB allows any scalar as `_id`,
  and these rows are addressed by name everywhere, so `key String @id
  @map("_id")` is both legal and right.

There are no migrations. MongoDB uses `prisma db push`, which syncs indexes:

```bash
npx prisma db push
npm run db:seed
```

`prisma/schema.sqlite.bak` is the pre-migration schema, kept for reference.

`SiteSetting` being empty is normal — settings fall back to the verified values
in `src/config/site.ts` until an administrator saves one.

---

## Admin

`/admin`, protected server-side. `requireUser()` runs in the authenticated
layout before any query executes, and every page and server action re-checks
its own permission — the sidebar filters by role for clarity, never for
security.

**Roles:** Super Admin, Admin, Editor, Marketing. The matrix is in
`src/lib/rbac.ts`.

**Modules:** dashboard, leads (with notes, assignment, status pipeline and CSV
export), projects, products, insights, testimonials, clients, team, FAQs,
media, metrics, SEO overrides, redirects, settings, users, audit log.

Consequential actions are written to the audit log: publishing, deletion,
permission and role changes, lead status changes, sign-ins and failed sign-ins.

---

## Content rules

The previous site had an empty portfolio page and counters stuck at "1". This
rebuild makes the honest state the **default**, structurally rather than by
discipline:

- **Metrics** are created unpublished with empty values. The band does not
  render until a real figure is entered and switched on.
- **Client logos** need both "published" *and* an explicit "approved for logo
  use" flag. Until then the homepage shows a sentence instead of a logo wall.
- **Case-study results** are separate rows. No rows, no results block.
- **Testimonials** are CMS-only. The one quote from the old site was migrated
  and flagged `isMigrated`, which surfaces a "needs verifying" banner in the
  admin — it has no full name, company, or source for the figure it quotes.
- **Empty states are written, not blank.** `/work`, `/products`, `/clients` and
  `/insights` each explain why they are empty and offer a real alternative.

No page invents a client, a statistic, an award, an office or a certification.

---

## Migration from WordPress

The old URLs are seeded as redirects and resolved at request time by a
catch-all route (`src/app/(site)/[...slug]/page.tsx`), so an editor can add one
in `/admin/redirects` without a rebuild.

| Old | New |
| --- | --- |
| `/services-2/` | `/services` |
| `/contact-2/` | `/contact` |
| `/portfolio/` | `/work` |
| `/home-2/` | `/` |
| `/feed/`, `/comments/feed/` | `/insights` |

Permanent redirects are served as **HTTP 308**, the method-preserving
equivalent of 301. Search engines treat them identically.

**Preserved from the old site:** company name, email
(`thedigitalalchemy202@gmail.com`), phone (`+91 9650433010`), address (Uttam
Nagar, New Delhi, 110059), the six service descriptions, and the single
testimonial. All are editable in `/admin/settings`. The original logo is kept
at `public/brand/logo-original.png`.

> The site renders a vector lockup rather than that file: the original is a
> 248×178 raster that cannot be sharp at favicon size or on a dark background.
> Uploading a replacement in settings overrides it.

---

## Media storage

Uploads go to `public/uploads/YYYY/MM/`, which suits a single server or a
container with a persistent volume. **On an ephemeral serverless filesystem it
will not persist** — swap the read/write functions in `src/lib/media.ts` for
object storage. Nothing else in the app touches the filesystem.

Uploads are re-decoded by sharp (so a file merely claiming to be an image is
rejected), converted to WebP, capped at 2800px, and stripped of EXIF. SVG is
refused outright — it is script-capable, and serving one from this origin would
be a stored-XSS vector.

---

## SEO

- Per-page title, description, canonical, Open Graph and Twitter tags, with
  overrides editable in `/admin/seo` (including a SERP preview).
- `sitemap.xml` generated from routes plus published CMS content, revalidated
  hourly. Admin, API and `noindex` paths are excluded.
- `robots.txt` disallows everything on non-production origins, so a staging
  deployment cannot compete with the real site.
- JSON-LD: Organization/ProfessionalService, WebSite, LocalBusiness (on the
  India page and contact page only — never on a market where there is no
  office), BreadcrumbList, Service, FAQPage, BlogPosting, Person.
- No review or rating schema anywhere. There are no verified reviews to
  describe, and inventing them invites a manual action.

Run `node scripts/seo-audit.mjs http://localhost:3000` against a running
instance to check all of the above.

---

## Accessibility

Built to WCAG 2.2 AA and verified against the rendered pages, not the source:

- Every colour token clears 4.5:1 on both the light and dark surfaces
  (`--color-ink-subtle` was darkened from `#74747f` to `#6b6b76` for exactly
  this reason — it measured 4.36:1).
- One `<h1>` per page, no heading-level skips, no unlabelled form controls, no
  images without `alt`.
- Skip link, visible focus rings, focus trapped and restored in the mobile
  menu, Escape closes overlays.
- `prefers-reduced-motion` disables the hero drift, the marquee, count-ups and
  the WebGL layer.
- No horizontal overflow from 320px upward.

---

## Colour

The system is neutral by default and colourful by exception. Warm white and
near-black carry the layout; the accent palette arrives in controlled moments —
a service's identity, a chart series, the core, one word in a headline.

**Eight accents**, each with five derived roles: `base` (fills and graphics),
`text` (clears 4.5:1 on the canvas), `bright` (clears 4.5:1 on charcoal),
`soft` (tints) and `on` (foreground on the fill). The vivid base measures about
3:1 as text — using it for a label is the mistake this structure prevents.
Values are computed by `scripts/derive-palette.mjs`, not picked by eye.

**Accents are scoped, not chosen per component.** A page or section sets
`data-accent="violet"` and every descendant re-binds: buttons, chips, eyebrows,
charts, hover washes, focus rings. Same mechanism as `data-surface="dark"`.
This is what lets twenty service pages share one component set while each keeps
its own identity — `src/content/accents.ts` maps every service, industry and
market to an accent.

`--tint-strength` on `:root` is the single dial for how colourful the site
feels. It scales the accent tint on large surfaces (service scene grounds,
ambient fields) without touching text, borders or focus rings, so it cannot
break a contrast guarantee:

| Value | Reads as |
| --- | --- |
| `0.6` | Restrained, closest to Apple's near-white pages |
| `1` | Current setting |
| `1.6` | Vivid, closer to a Figma or Framer landing page |

Verified: 24 accent × surface combinations all clear WCAG AA, weakest 4.51.
Both nesting directions are covered — an accent page containing a dark band,
and an accent card inside one.

## Visuals

**The logo** is the company's own: a circuit-etched hand holding three cubes.
It was supplied as `images/logo.jpeg` — flat white, no alpha — so on any surface
that is not pure white it rendered as a card. `npm run logo` keys the background
out and writes `/public/brand/logo-mark.png` and `logo-lockup.png`.

It floods inward from the border rather than keying on colour, because a plain
"make white transparent" pass would punch holes through the artwork: the
highlight along the thumb and the gaps in the circuit tracery are white too.
Only white connected to the outside is removed. Edge pixels then take a partial
alpha and are un-multiplied back out of white, so the JPEG's anti-aliasing does
not leave a pale halo on the dark footer.

The wordmark stays live type rather than part of the image. The supplied artwork
sets it in navy, which vanishes on a dark surface, and raster text at 17px is
soft on any display. Set in the site's own face it stays crisp, recolourable,
selectable and searchable — and measures 17.45:1 against the footer.

**The hero** is currently a supplied render (`images/1.png`) of the platform
across a monitor, laptop, tablet, phone and watch. It is trimmed to its bounding
box and its edges feathered rather than cut off at a rectangle. Its screens
carry invented figures *and* garbled lettering — "Eampany Value", "Employee
Rores", a column headed "Deaths" — so it renders with `IllustrativeNote`
beneath. It is flagged in [Imagery worth replacing](#imagery-worth-replacing);
the prompt for a clean replacement is in the brief.

**Generated imagery never contains a screen.** That rule is the durable fix for
the garbled text above, and for a second problem behind it: any legible figure
on a generated dashboard is a claim the site cannot evidence. Every prompt in
the brief bans text, numbers, interfaces and screen content outright.

Where software genuinely needs to be shown, it is **photographed rather than
drawn**. `npm run capture:ui` drives headless Chrome over the DevTools Protocol
— no Puppeteer, no Playwright, no native binary to be blocked — and screenshots
nineteen real surfaces at 2×: the marketing pages, phone and tablet viewports,
and the admin panel behind auth, using a session minted into the database and
deleted on the way out. `npm run build:hero` then composites those captures into
the CSS device frames on a transparent ground. Nothing on any screen is
invented, and there is no generated lettering to come out wrong.

**Devices** (`src/components/visuals/devices.tsx`) are original constructions in
CSS — a laptop, a phone and a monitor, plus macOS browser chrome and a Windows
application window. No vendor artwork is reproduced. Because they are markup
rather than exported images they stay sharp at any resolution, weigh nothing,
and the screens show the real product UI. Upgrading `DeviceFrame` here lifted
every service page, project card and case study at once.

**Brand imagery.** Source files live in `/images` (not served). `npm run
build:images` trims, resizes, converts to WebP and writes a manifest at
`src/content/generated/brand-images.json` carrying dimensions and an inline blur
placeholder, so nothing shifts on load. Assets named in the brief but not yet
generated are reported and skipped rather than failing the build.

The current set is forty photographs of real hardware — rack rails, a
part-machined billet, a fibre patch panel, an exploded phone, a relay grid, a
data-centre aisle — one per service and industry page, plus surfaces and brand
objects. They are **ungraded**. An earlier set was hue-rotated wholesale onto a
copper palette, which is why everything looked orange; each prompt now names its
own accent instead, so the eight-accent system survives contact with the
imagery. The full brief, including the prompts and the filenames the build
expects, is in `docs/image-brief.html`.

`node scripts/map-inbox.mjs` bridges a Flow drop to those filenames. Flow names
its output after the prompt and returns several variants per subject, so the
mapper scores candidates against keyword groups and reports near-ties rather
than guessing. It also **crops the generated-image badge**: Flow stamps a
four-pointed sparkle into the bottom-right of every frame, and a sparkle in the
corner of every image on the site reads as a broken asset. Patching it from
surrounding pixels was tried first and leaves a visible rectangle on anything
with structure — brushed aluminium showed it immediately — so 15% comes off the
right and bottom instead. The untouched originals stay in `images/_inbox`, so
that is reversible.

Nothing in the shipped set now carries invented figures, so no image needs the
`illustrative` caption except the hero above.

Images are composed with `LayeredVisual` or as full-bleed bands, not placed in
cards — see [Page structure](#page-structure). Parallax is disabled under reduced
motion, on coarse pointers and below 768px.

**The globe** (`src/components/visuals/globe.tsx`) renders real country geometry
through a d3-geo orthographic projection onto a canvas, with the six markets
highlighted and the studio marked distinctly from the countries served remotely.

Geometry comes from Natural Earth via `world-atlas`, reduced at build time by
`scripts/build-globe-data.mjs`: coordinates rounded to 1dp (sub-pixel at globe
scale), duplicate points dropped, sub-pixel islands removed, and rings packed as
flat scaled integers. That takes 105KB of TopoJSON to 89KB of JSON — 24KB over
the wire — with no decoder needed on the client.

Both d3-geo and the geometry are dynamically imported during idle time, so the
homepage's first load carries only 4 kB for the globe; the 36KB projection
library and 89KB of geometry are separate lazy chunks.

Initialisation deliberately does *not* gate on `IntersectionObserver` — an
observer never fires in a page the browser is not rendering, which would leave
the globe permanently blank in a background tab or an embedded webview.
Intersection controls only the animation loop, which is where it belongs. The
loop also parks when the tab is hidden or a pointer rests on the globe, and
`prefers-reduced-motion` renders one static frame centred on India.

## Page structure

Pages are built from **full-bleed feature bands**, not card grids. A band is
centred copy — eyebrow, display heading, one line, an accent link — then a
photograph running edge to edge with no border. `FeatureBand`
(`src/components/sections/feature-band.tsx`) is the single definition; the
service showcase, the page heroes and the empty states all use it.

The distinction matters more than it sounds. A photograph inside a bordered card
reads as a mockup; the same photograph bleeding to the viewport edge reads as a
product. Hierarchy comes from size and bleed rather than from six equal boxes,
which is what made the earlier grid version read as a template. Every second or
third band runs dark (`data-surface="dark"`), because a long light page
flattens out without punctuation — the homepage comment records the intended
light/dark rhythm and why the markets band sits between the two dark ones.

`PageHero` takes a `bleedImage` for the same treatment on detail and index
pages, falling back to its two-column layout when no photograph exists.

Where a band would be wrong, `SectionBackdrop`
(`src/components/visuals/section-backdrop.tsx`) puts the photograph *behind* the
content instead. `/contact` and `/start-a-project` exist to get a form filled
in, and a full-width image between the headline and the first field pushes that
below the fold; the technology band has an interaction that is the point of the
section. All three use the same component — image at low opacity, then a scrim
returning the text side to close to the raw surface colour.

Raising that opacity without running `npm run verify:contrast` is the way to
quietly break legibility.

**Slots can exist before their images do.** `getOptionalBrandImage(name)`
returns the asset if the manifest has it and `undefined` otherwise, so a page
can reserve its image slot while the photograph is still unbuilt. A literal name
would be a type error today and a silent 404 the moment the type were widened to
`string`. Drop the file into `/images`, run `npm run build:images`, and the slot
fills with no code change. Ten slots are currently wired this way and render
nothing.

### Page copy

Every heading, lede, card summary and meta field on the service, industry,
location and standalone pages is editable at `/admin/content`, without a deploy.

**The typed content files stay the source of truth.** `ContentOverride` holds
only fields somebody has deliberately changed, and the resolver in
`src/lib/content-overrides.ts` merges those over the code. An empty table means
the site renders exactly as the repository says — which is what makes this safe
to add to a site already in production, and why clearing a box restores the
original wording rather than blanking the page.

Three things follow from that design:

- **The original is always visible.** It is the placeholder in every field, so
  an editor can see what they are replacing, and each field says whether it is
  edited or using the original.
- **A field not in `src/content/editable.ts` is ignored on read.** Fields get
  renamed and removed; a stale row must not be able to resurrect copy the code
  no longer has a slot for.
- **Structural content is deliberately excluded** — process stages, technology
  entries, service visuals. Changing those is a code change, and offering them
  in a copy form would be the wrong promise.

`generateMetadata` resolves overrides too. It runs as a separate pass, so
without that an edited meta title would never reach the document head.

### Careers

Open roles live in the CMS (`JobOpening`), managed at `/admin/careers` under a
`careers.manage` permission. A published role gets its own page at
`/careers/[slug]`, an entry in the sitemap, and a **JobPosting** structured-data
block — which is what makes it eligible for Google Jobs.

Three rules are enforced rather than documented:

- **Publishing requires an application route.** A listing nobody can respond to
  wastes the applicant's time, and the page has no other path to a human.
- **A role disappears when its closing date passes**, on the page and in the
  sitemap. Google treats a listing that outlives its stated close date as
  stale.
- **No salary is emitted unless a range was entered.** A placeholder figure in
  structured data is a machine-readable claim to a candidate about pay.

An empty table is a supported state: the page says plainly that nothing is open
and invites speculative applications, which is what it did before there was a
CMS behind it.

Like `/work`, `/insights` and `/products`, the careers pages are static and
refreshed by `revalidatePath` from the admin actions — editing rows directly in
the database will not update them.

### The product showcase

One device, centred, with generous space and nothing competing — the Apple
pattern. The screen inside it is a **real screenshot** of the running site
(`npm run capture:ui`), not drawn artwork. It shows the industries gallery
because a product shot should show the product doing something rather than its
quietest screen.

This replaced a canvas of floating wireframe cards. Those illustrated the
*idea* of design work without showing anything that exists, which is most of
why the page read as unfinished. `ideas-canvas.tsx` is kept but no longer
rendered.

Underneath sits a quiet three-up: the journey, the markets, and client quotes.
The quotes are **whatever is actually published** — the slot holds two and
currently shows one, because one is what exists. The empty state says so rather
than filling the gap.

### The process narrative

The six stages — discover, strategise, design, build, launch, scale — are told
as a scroll narrative rather than a row of cards
(`src/components/sections/process-narrative.tsx`). The copy scrolls while one
visual stays pinned and changes beneath it.

The accent runs blue → indigo → violet → mint → coral → tangerine, cool to warm,
in order. That is not decoration: it encodes how far through you are, and it is
legible before you have read a word. A progress rail fills alongside it.

There is no animation library. An `IntersectionObserver` watching a band across
the middle of the viewport sets an index; everything else is a CSS opacity
transition. Below `lg`, and under reduced motion, every stage renders in
document order with its image inline — the same content, read rather than
travelled through. The copy is in the DOM in order either way, so assistive
technology is unaffected by which path renders.

---

## Verification

Three things here cannot be checked the way you would expect, and each cost real
time to learn.

**The in-app browser pane cannot verify scroll behaviour.** It reports
`visibilityState: "hidden"`, never scrolls (`scrollY` stays 0), and never fires
an `IntersectionObserver` — all thirty-four of the site's own scroll-reveal
elements sit unfired there. Anything scroll-driven looks dead in it while being
perfectly fine in a real browser. Headless Chrome over CDP composites properly
and is the only way to check: `npm run verify:narrative` drives the homepage
through all six stages and asserts the accent, the visual and the progress rail
each advance.

Headless Chrome also reports `prefers-reduced-motion: reduce` **by default**, so
without `Emulation.setEmulatedMedia` it exercises the fallback branch and the
enhanced path is never tested at all.

**Contrast has to be measured against pixels, not computed styles.** Once
anything sits behind text — a photograph under a scrim under a grain overlay —
there is no single background colour, and `getComputedStyle(el).backgroundColor`
returns `rgba(0,0,0,0)` regardless. `npm run verify:contrast` makes the text
transparent, photographs the region it occupied, and measures what was
underneath.

Five details make that honest, and each was a wrong answer first:

- It makes the text **transparent** rather than hiding the element. Hiding it
  removes the element's own background, which reported a false 1.01:1 for a
  dark label on a perfectly legible light pill.
- It applies that through a **document-level rule with `!important`**, not an
  inline style. Inline styles lose to `!important` classes and get dropped when
  React reconciles a client component.
- It **disables transitions** in the same rule. The category tabs animate their
  colour, so the screenshot otherwise catches the text part way through fading
  and measures `rgba(17,17,17,0.3)`.
- It **reads the colour back** and fails loudly if the text did not actually go
  transparent. Without that check a broken probe measures the glyphs against
  themselves and reports a confident pass.
- It **insets 22%** before sampling and reports the **5th percentile** rather
  than the single worst pixel — a bounding box is a rectangle but a rounded
  pill is not, and every curved edge carries anti-aliased boundary pixels that
  are not a legibility problem. It also prints what share of sampled pixels
  fall under 4.5:1, so the percentile cannot quietly hide a real failure, and
  saves the measured region to `.shots/` on any failure.

Selectors matter too: a bare `ul li` matches the header navigation before the
page content, which measured the logo wordmark and reported 1.00:1.

**A backgrounded `next start` fails silently.** If an older server still holds
the port, the new one exits with `EADDRINUSE` into a log nobody reads and the
stale build keeps serving. Every assertion then describes code that is not on
disk. `verify:narrative` guards against this by checking for a `data-pinned`
attribute that only exists in the current component, and fails loudly if it is
absent. When restarting by hand, confirm the port actually bound — `pkill` does
not reliably kill it on Windows.

For looking at work rather than asserting on it: `node scripts/shot-at.mjs`
screenshots a page after scrolling an element into view (plain
`chrome --headless --screenshot` only ever captures the top of the document),
and `node scripts/contact-sheet.mjs` builds a labelled sheet from a batch of
images. Both exist because the imagery in this project was rebuilt twice, and
the first rebuild shipped garbled text nobody had looked at.

---

## Performance

- ~102 kB shared JS; 133 kB first load on the homepage.
- The hero is a single WebP behind a feathered mask. It was layered markup
  until real photography replaced it; the CSS device frames it used are still
  in `visuals/devices.tsx` and are what `npm run build:hero` composites real
  screenshots into.
- The WebGL core is a single fragment shader written against the raw WebGL API
  (roughly 4 kB, versus several hundred for a 3D library). It declines to run
  on small viewports, under reduced motion, on low-core devices, or when the
  GPU refuses a context, and pauses when scrolled out of view or backgrounded.
  The CSS sphere underneath is the fallback, and the layout is identical either
  way.
- Scroll reveals use one `IntersectionObserver` for the whole document, and are
  scoped to `[data-js="on"]` so content is visible if JavaScript fails.

---

## Security

- Server-side sessions; only a SHA-256 hash of the token is stored.
- Authorisation checked on the server for every request; deactivating a user or
  resetting a password deletes their sessions immediately.
- Zod validation on both sides of every form; the server check is the real one.
- Database-backed rate limiting on the enquiry form and sign-in (survives
  restarts and works across instances, unlike an in-memory counter).
- Spam handled by honeypot plus submission timing. Bot submissions are stored
  as `SPAM` and returned a success response, so scripts learn nothing.
- CSV export escapes leading `=`, `+`, `-` and `@` to prevent formula injection
  in Excel and Sheets.
- Security headers including a CSP set in `next.config.ts`.
- Markdown is rendered without raw HTML, so CMS content cannot inject markup.

---

## Known gaps

Things deliberately not built, and why:

- **Cookie consent** covers the categories and gates the tags, but has not been
  reviewed against any specific jurisdiction's requirements.
- **Legal pages** describe accurately what this site does with data. They are
  not legal advice and say so at the top; have them reviewed before relying on
  them.
- **CRM integration** is structured for but not wired up — no credentials were
  supplied, and inventing an integration is worse than leaving a clean seam.
- **Client portal** is not built. Auth is separated enough that it can be added
  without rework.
- **Global search (⌘K)** is not implemented.
- **Automated tests** are not included. Type checking, linting, the SEO audit
  script and the production build all pass, and the lead pipeline, auth, RBAC,
  rate limiting, spam handling and media validation were verified end to end
  manually.

### Imagery worth replacing

The homepage hero is the one image still carrying invented figures, and its
dashboard lettering is garbled — "Eampany Value", "Employee Rores", a column
headed "Deaths". It is captioned `illustrative` in the meantime. The prompt for
a clean replacement is in `docs/image-brief.html` under `heroes/hero-lineup`;
the part that matters is that every screen in it is switched **off**, with real
screenshots composited in afterwards.

Eleven further assets are prompted, registered in the build and wired into their
pages, but not yet generated. Until they exist each slot renders nothing, or
falls back:

Ten are wired into their pages and render nothing until the file exists:

| Asset | Page | While missing |
| --- | --- | --- |
| `hero-services` `hero-industries` `hero-insights` `hero-clients` | the four index pages | no band |
| `hero-products` | `/products` | keeps a drawn dashboard with invented MRR and churn |
| `section-ideas-canvas` | homepage | keeps the freeform card canvas |
| `section-technology` | homepage | no backdrop; the interaction is unaffected |
| `hero-contact` `hero-start-project` | those two pages | no backdrop; the form is unaffected |
| `object-globe-etched` | six location pages | keeps `world-globe-light`, the last asset from the original supplied set |

One is prompted and registered but **not** wired: `hero-lineup` replaces the
current hero rather than filling an empty slot, so it needs a decision as well
as a file.

`npm run build:images` lists exactly which are outstanding on every run.

Resolution is worth watching. The service and industry photographs are 1020px
wide after the watermark crop, against roughly 1380px for a 2× render at their
placement — fine on a standard display, slightly soft on a dense one.
Regenerating at a larger size and re-running the pipeline would fix it without
any code change.

One check to repeat when the technology backdrop lands: its contrast was
measured with a stand-in photograph (16.14:1 heading, 7.38:1 lede, 5.26:1 on the
selected tab, 0.0% of sampled pixels under 4.5:1). A brighter image will need
the opacity lowered or the scrim strengthened — `npm run verify:contrast` says
which.

### Before launch

1. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
2. Move `DATABASE_URL` to PostgreSQL and run `prisma migrate deploy`.
3. Configure SMTP, or enquiry notifications will only be logged.
4. Add the Google Business Profile URL and any social profiles in settings —
   both are currently blank because the old site published neither.
5. Replace media storage if deploying to a serverless platform.
6. Enter real metrics, or leave them off.
7. Verify the migrated testimonial with the client, or unpublish it.
