/**
 * Screenshots the real product.
 *
 * Every device mockup on this site used to show either hand-built placeholder
 * geometry or a generated render whose "interface" was invented — which is how
 * the old hero ended up with "Eampany Value" and a column headed "Deaths" in
 * it. Both approaches have the same flaw: the screens are fiction.
 *
 * They do not need to be. The marketing site and the admin panel are real,
 * they run locally, and a browser can photograph them. Captured screens carry
 * correct text, real typography, the actual palette, and they stay true as the
 * product changes. Nothing here is invented, so nothing here can misrepresent.
 *
 * HOW IT WORKS
 * Chrome is driven over the DevTools Protocol using Node's built-in WebSocket
 * — no Puppeteer, no Playwright, no native binary to be blocked. Admin routes
 * need a session, so one is minted straight into the database and handed to
 * the browser as a cookie; it is deleted again on the way out.
 *
 * Usage:
 *   npm start                       (or next dev) on PORT, then
 *   node scripts/capture-ui.mjs [baseUrl]
 */
import { createHash, randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const BASE = process.argv[2] || "http://localhost:3100";
const OUT_DIR = "public/images/ui";
const DEBUG_PORT = 9333;

const CHROME_CANDIDATES = [
  `${process.env.ProgramFiles}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env["ProgramFiles(x86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env.ProgramFiles}\\Microsoft\\Edge\\Application\\msedge.exe`,
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];

/**
 * What to photograph.
 *
 * `viewport` is CSS pixels; everything is captured at 2× so it stays sharp
 * composited into a device at retina size. `settle` buys time for fonts,
 * images and scroll-reveal animations — the reveals are driven by
 * IntersectionObserver, so anything below the fold needs a scroll first.
 */
const TARGETS = [
  // ---- Marketing site ----
  { name: "site-home", url: "/", viewport: [1440, 900] },
  { name: "site-services", url: "/services", viewport: [1440, 900] },
  { name: "site-service-saas", url: "/services/saas-development", viewport: [1440, 900] },
  { name: "site-work", url: "/work", viewport: [1440, 900] },
  { name: "site-contact", url: "/contact", viewport: [1440, 900] },
  { name: "site-locations", url: "/locations/india", viewport: [1440, 900] },

  // ---- The admin panel: the part that is genuinely our software ----
  { name: "admin-dashboard", url: "/admin", viewport: [1440, 900], auth: true },
  { name: "admin-leads", url: "/admin/leads", viewport: [1440, 900], auth: true },
  { name: "admin-media", url: "/admin/media", viewport: [1440, 900], auth: true },
  { name: "admin-settings", url: "/admin/settings", viewport: [1440, 900], auth: true },
  { name: "admin-audit", url: "/admin/audit", viewport: [1440, 900], auth: true },
  { name: "admin-users", url: "/admin/users", viewport: [1440, 900], auth: true },
  { name: "admin-seo", url: "/admin/seo", viewport: [1440, 900], auth: true },
  { name: "admin-redirects", url: "/admin/redirects", viewport: [1440, 900], auth: true },

  // ---- Narrow surfaces, for phone and tablet frames ----
  { name: "phone-home", url: "/", viewport: [390, 844] },
  { name: "phone-services", url: "/services", viewport: [390, 844] },
  { name: "phone-contact", url: "/contact", viewport: [390, 844] },
  { name: "tablet-services", url: "/services", viewport: [1024, 768] },
  // Stopped at the card grid rather than the top of the page: this capture is
  // used as the screen inside a device frame, and a screenful of body copy
  // makes a poor product shot.
  { name: "tablet-industries", url: "/industries", viewport: [1024, 768], scrollTo: 620 },
  { name: "tablet-home-services", url: "/", viewport: [1024, 768], scrollTo: 1850 },
  { name: "tablet-admin", url: "/admin", viewport: [1024, 768], auth: true },
];

const SCALE = 2;

// ---------------------------------------------------------------------------
// Minimal CDP client. Node has had a global WebSocket since 22, so this needs
// no dependency at all.
// ---------------------------------------------------------------------------
function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  const pending = new Map();
  const listeners = new Map();
  let nextId = 1;

  const ready = new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });

  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    } else if (msg.method && listeners.has(msg.method)) {
      for (const fn of listeners.get(msg.method)) fn(msg.params);
      listeners.delete(msg.method);
    }
  });

  return {
    ready,
    send(method, params = {}) {
      const id = nextId++;
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    },
    once(method) {
      return new Promise((resolve) => {
        if (!listeners.has(method)) listeners.set(method, []);
        listeners.get(method).push(resolve);
      });
    },
    close: () => ws.close(),
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForEndpoint(url, attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res.json();
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error(`Chrome did not expose ${url}`);
}

// ---------------------------------------------------------------------------

const chromePath = CHROME_CANDIDATES.find((p) => p && existsSync(p));
if (!chromePath) {
  console.error("\nNo Chrome or Edge found. Looked in:\n  " + CHROME_CANDIDATES.join("\n  "));
  process.exit(1);
}

// A short-lived session so the admin routes render as a signed-in operator
// rather than redirecting to the login screen.
const db = new PrismaClient();
let sessionToken = null;
let sessionId = null;

const needsAuth = TARGETS.some((t) => t.auth);
if (needsAuth) {
  const user = await db.user.findFirst({ where: { role: "SUPER_ADMIN" } });
  if (!user) {
    console.error("No SUPER_ADMIN user. Run `npm run db:seed` first.");
    process.exit(1);
  }
  sessionToken = randomBytes(32).toString("base64url");
  const created = await db.session.create({
    data: {
      userId: user.id,
      tokenHash: createHash("sha256").update(sessionToken).digest("hex"),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      userAgent: "capture-ui",
    },
  });
  sessionId = created.id;
  console.log(`  session minted for ${user.email}`);
}

const profileDir = path.join(process.cwd(), ".chrome-capture-profile");
const chrome = spawn(
  chromePath,
  [
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${profileDir}`,
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    "--disable-features=Translate,MediaRouter,OptimizationHints",
  ],
  { stdio: "ignore", detached: false },
);

mkdirSync(OUT_DIR, { recursive: true });

const manifest = {};
let failures = 0;

try {
  const version = await waitForEndpoint(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
  console.log(`  ${version.Browser}\n`);

  for (const target of TARGETS) {
    const [w, h] = target.viewport;
    const page = await (
      await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?about:blank`, { method: "PUT" })
    ).json();

    const cdp = connect(page.webSocketDebuggerUrl);
    await cdp.ready;

    try {
      await cdp.send("Page.enable");
      await cdp.send("Network.enable");
      await cdp.send("Emulation.setDeviceMetricsOverride", {
        width: w,
        height: h,
        deviceScaleFactor: SCALE,
        mobile: w < 768,
      });

      if (target.auth && sessionToken) {
        const { hostname } = new URL(BASE);
        await cdp.send("Network.setCookie", {
          name: "tda_session",
          value: sessionToken,
          domain: hostname,
          path: "/",
          httpOnly: true,
          sameSite: "Lax",
        });
      }

      const loaded = cdp.once("Page.loadEventFired");
      await cdp.send("Page.navigate", { url: BASE + target.url });
      await Promise.race([loaded, sleep(15000)]);

      // Scroll-reveal is driven by IntersectionObserver, so anything below the
      // fold stays at opacity 0 until it has been scrolled past once.
      await cdp.send("Runtime.evaluate", {
        expression: `(async () => {
          const step = window.innerHeight;
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise(r => setTimeout(r, 90));
          }
          window.scrollTo(0, ${target.scrollTo ?? 0});
          await new Promise(r => setTimeout(r, 500));
          if (document.fonts) await document.fonts.ready;
          // Images must have pixels before the shutter, or a device frame ends
          // up containing blank boxes.
          const deadline = Date.now() + 12000;
          while (Date.now() < deadline) {
            const imgs = [...document.images];
            if (imgs.length && imgs.every(i => i.complete && i.naturalWidth > 0)) break;
            await new Promise(r => setTimeout(r, 150));
          }
        })()`,
        awaitPromise: true,
      });
      await sleep(target.settle ?? 700);

      // Confirm the page actually loaded. Without this the script happily
      // photographs Chrome's "This site can't be reached" page for every
      // target and reports "0 failed" — which is how a whole capture set got
      // silently replaced with error screens.
      const { result: check } = await cdp.send("Runtime.evaluate", {
        expression: `JSON.stringify({
          host: location.hostname,
          title: document.title,
          hasContent: Boolean(document.querySelector('header, main, [data-admin-shell]')),
        })`,
        returnByValue: true,
      });
      const page_ = JSON.parse(check.value);
      if (!page_.hasContent || /can.t be reached|ERR_/i.test(page_.title)) {
        throw new Error(`page did not load (title: ${page_.title || "none"})`);
      }

      const shot = await cdp.send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
        optimizeForSpeed: false,
      });

      const file = path.join(OUT_DIR, `${target.name}.png`);
      const buffer = Buffer.from(shot.data, "base64");
      writeFileSync(file, buffer);

      manifest[target.name] = {
        src: `/images/ui/${target.name}.png`,
        width: w * SCALE,
        height: h * SCALE,
        viewport: `${w}×${h}`,
        route: target.url,
      };

      console.log(
        `  ${target.name.padEnd(22)} ${String(w * SCALE).padStart(4)}×${String(h * SCALE).padEnd(4)} ` +
          `${Math.round(buffer.length / 1024)}KB  ${target.url}`,
      );
    } catch (err) {
      failures++;
      console.error(`  ${target.name.padEnd(22)} FAILED — ${err.message.slice(0, 60)}`);
    } finally {
      cdp.close();
      await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/close/${page.id}`).catch(() => {});
    }
  }

  writeFileSync(
    "src/content/generated/ui-captures.json",
    JSON.stringify(manifest, null, 1) + "\n",
  );
} finally {
  chrome.kill();
  if (sessionId) await db.session.delete({ where: { id: sessionId } }).catch(() => {});
  await db.$disconnect();
}

console.log(
  `\n  ${Object.keys(manifest).length} captured, ${failures} failed → ${OUT_DIR}` +
    `\n  manifest: src/content/generated/ui-captures.json`,
);
