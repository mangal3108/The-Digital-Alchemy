/**
 * Catches admin pages that overflow their own width, or whose panels overlap
 * the text beside them.
 *
 * The careers page shipped with exactly that: "Add a role" expanded a
 * full-width form inside the page header's action slot, which is `shrink-0`.
 * A slot that cannot shrink cannot contain a wide child, so the form ran off
 * the right of the page and sat on top of the heading. Nothing in the existing
 * checks noticed — the route returned 200, the heading was in the HTML, every
 * class had a rule. It was only visible in a screenshot.
 *
 * So this drives the page the way a person does: open the panel, then measure.
 * Two questions, both answerable from the DOM:
 *
 *   1. Is the document wider than the viewport? (horizontal overflow)
 *   2. Do two elements that should sit side by side actually intersect?
 *
 * Usage: node scripts/verify-layout.mjs [baseUrl]
 */
import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const BASE = process.argv[2] || "http://127.0.0.1:3100";
const DEBUG_PORT = 9223;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Each case opens something, then asserts the page still fits.
 * `click` is matched against button text, which is what a person would click.
 */
const CASES = [
  {
    name: "careers — add a role",
    url: "/admin/careers",
    auth: true,
    click: "Add a role",
    expect: "Job title",
  },
  {
    name: "careers — edit a role",
    url: "/admin/careers",
    auth: true,
    click: "Edit",
    expect: "Save role",
    optional: true,
  },
  { name: "clients", url: "/admin/clients", auth: true },
  { name: "page copy", url: "/admin/content", auth: true },
  { name: "leads", url: "/admin/leads", auth: true },
  { name: "dashboard", url: "/admin", auth: true },
];

/**
 * Widths that actually exercise the failure.
 *
 * Measured on the broken build: at 1440 it looked perfect, at 1280 the heading
 * was already zero pixels wide with no overflow at all, and below 1100 the page
 * overflowed by up to 178px. Checking only comfortable widths is how this
 * shipped in the first place.
 */
const VIEWPORTS = [
  [1100, 800],
  [1280, 800],
  [1440, 900],
];

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  const pending = new Map();
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
    close: () => ws.close(),
  };
}

const chromePath = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chromePath) {
  console.error("\n  No Chrome or Edge found.\n");
  process.exit(1);
}

const db = new PrismaClient();
let sessionToken = null;
let sessionId = null;
let failures = 0;

const user = await db.user.findFirst({ where: { role: "SUPER_ADMIN" } });
if (!user) {
  console.error("\n  No SUPER_ADMIN user. Run `npm run db:seed`.\n");
  process.exit(1);
}
sessionToken = randomBytes(32).toString("base64url");
sessionId = (
  await db.session.create({
    data: {
      userId: user.id,
      tokenHash: createHash("sha256").update(sessionToken).digest("hex"),
      expiresAt: new Date(Date.now() + 20 * 60 * 1000),
      userAgent: "verify-layout",
    },
  })
).id;

const chrome = spawn(
  chromePath,
  [
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${path.join(process.cwd(), ".chrome-layout-profile")}`,
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
  ],
  { stdio: "ignore", detached: false },
);

/**
 * Runs in the page.
 *
 * Overflow alone is not enough. A `shrink-0` sibling squeezes a `min-w-0`
 * column to nothing long before the document itself overflows, so the heading
 * can be literally zero pixels wide on a page that measures as fitting
 * perfectly. Both are reported.
 */
const MEASURE = `(() => {
  const doc = document.documentElement;
  const overflow = doc.scrollWidth - doc.clientWidth;

  // A heading with text in it that occupies no width has been crushed by
  // whatever sits beside it.
  let crushed = null;
  const heading = document.querySelector("main h1");
  if (heading && heading.textContent.trim()) {
    const width = heading.getBoundingClientRect().width;
    if (width < 40) crushed = Math.round(width);
  }

  // Anything painted past the right edge is off-screen for the operator.
  const escaped = [];
  for (const el of document.querySelectorAll("main *")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right > doc.clientWidth + 2) {
      escaped.push((el.tagName + "." + (el.className || "")).slice(0, 70));
      if (escaped.length > 3) break;
    }
  }

  // A header whose title box is overlapped by whatever sits in its action slot.
  let overlap = null;
  const h1 = document.querySelector("main h1");
  if (h1) {
    const a = h1.getBoundingClientRect();
    for (const el of document.querySelectorAll("main form, main textarea, main input")) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      const hit = a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
      if (hit) { overlap = (el.tagName + "." + (el.className || "")).slice(0, 70); break; }
    }
  }

  return JSON.stringify({ overflow, escaped, overlap, crushed });
})()`;

try {
  for (let i = 0; i < 40; i++) {
    try {
      await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`)).json();
      break;
    } catch {
      await sleep(250);
    }
  }

  for (const [w, h] of VIEWPORTS) {
    console.log(`\n  ${w}x${h}`);

    for (const testCase of CASES) {
      const page = await (
        await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?about:blank`, { method: "PUT" })
      ).json();
      const cdp = connect(page.webSocketDebuggerUrl);
      await cdp.ready;

      let note = "";
      try {
        await cdp.send("Page.enable");
        await cdp.send("Runtime.enable");
        await cdp.send("Network.enable");
        await cdp.send("Emulation.setDeviceMetricsOverride", {
          width: w,
          height: h,
          deviceScaleFactor: 1,
          mobile: false,
        });
        await cdp.send("Network.setCookie", {
          name: "tda_session",
          value: sessionToken,
          domain: new URL(BASE).hostname,
          path: "/",
          httpOnly: true,
          sameSite: "Lax",
        });

        await cdp.send("Page.navigate", { url: BASE + testCase.url });

        const evaluate = async (expression) =>
          (await cdp.send("Runtime.evaluate", { expression, returnByValue: true })).result.value;

        // Wait for the heading rather than a fixed delay: a dev build can take
        // fifteen seconds to compile a route, and a timer that expires first
        // produces a confident answer about a page that has not rendered.
        let rendered = false;
        for (let t = 0; t < 60 && !rendered; t++) {
          rendered = await evaluate('Boolean(document.querySelector("main h1"))').catch(() => false);
          if (!rendered) await sleep(500);
        }
        if (!rendered) note = "page never rendered";

        if (!note && testCase.click) {
          const label = JSON.stringify(testCase.click);
          const opened = `document.body.innerText.includes(${JSON.stringify(testCase.expect)})`;
          const findAndClick = `(() => {
            const b = [...document.querySelectorAll("button")]
              .find(el => el.textContent.trim() === ${label});
            if (!b) return "absent";
            b.click();
            return "clicked";
          })()`;

          // Check "is it open?" before clicking, never after only one attempt.
          // The button is in the HTML before React attaches to it, so early
          // clicks are silently dropped — but once the panel does open the
          // button is gone, and a loop that only looks for the button then
          // concludes it was never there. Asking the open-question first makes
          // the loop idempotent however the timing falls.
          let outcome = "absent";
          for (let t = 0; t < 60; t++) {
            if (await evaluate(opened).catch(() => false)) {
              outcome = "open";
              break;
            }
            const result = await evaluate(findAndClick).catch(() => "absent");
            outcome = result === "clicked" ? "no-effect" : "absent";
            await sleep(400);
          }

          if (outcome !== "open") {
            if (testCase.optional && outcome === "absent") {
              console.log(`  skip ${testCase.name} — nothing to click`);
              cdp.close();
              continue;
            }
            note =
              outcome === "absent"
                ? `no "${testCase.click}" button`
                : `panel did not open ("${testCase.expect}" absent)`;
          }
        }

        if (!note) {
          const measured = await cdp.send("Runtime.evaluate", {
            expression: MEASURE,
            returnByValue: true,
          });
          const { overflow, escaped, overlap, crushed } = JSON.parse(measured.result.value);
          if (overflow > 2) note = `overflows by ${overflow}px — ${escaped[0] ?? "?"}`;
          else if (crushed !== null) note = `heading squeezed to ${crushed}px wide`;
          else if (overlap) note = `overlaps the heading — ${overlap}`;
        }
      } catch (error) {
        note = error.message.slice(0, 70);
      }

      cdp.close();
      if (note) failures++;
      console.log(`  ${note ? "FAIL" : "ok  "} ${testCase.name}${note ? ` — ${note}` : ""}`);
    }
  }
} finally {
  // `chrome.kill()` reaps the launcher, not the renderer and GPU children it
  // spawned. Repeated runs left dozens of orphaned processes behind, which
  // eventually starved the machine and made later runs hang rather than fail.
  // Asking the browser to close itself shuts the whole tree down.
  try {
    const { webSocketDebuggerUrl } = await (
      await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`)
    ).json();
    const browser = connect(webSocketDebuggerUrl);
    await browser.ready;
    await browser.send("Browser.close");
    browser.close();
  } catch {
    /* already gone */
  }
  chrome.kill();
  if (sessionId) await db.session.delete({ where: { id: sessionId } }).catch(() => {});
  await db.$disconnect();
}

console.log(
  failures === 0
    ? "\n  Every panel opens inside the page.\n"
    : `\n  ${failures} layout failure(s).\n`,
);
process.exit(failures === 0 ? 0 : 1);
