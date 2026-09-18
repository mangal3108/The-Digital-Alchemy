/**
 * Verifies the process narrative actually advances on scroll.
 *
 * The in-app browser pane cannot do this: it reports `visibilityState:
 * "hidden"`, never scrolls, and never fires an IntersectionObserver, so every
 * scroll-driven behaviour on the site reads as dead there. Headless Chrome over
 * CDP composites properly, which makes it the only way to check this without
 * asking a human to scroll.
 *
 * Drives the page to each of the six stages and asserts three things per stage:
 * the section's accent changes, exactly one visual layer is opaque, and the
 * progress rail fills to the right count.
 *
 * Usage: node scripts/verify-narrative.mjs [baseUrl]
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const BASE = process.argv[2] || "http://localhost:3100";
const DEBUG_PORT = 9335;

const CHROME_CANDIDATES = [
  `${process.env.ProgramFiles}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env["ProgramFiles(x86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env.ProgramFiles}\\Microsoft\\Edge\\Application\\msedge.exe`,
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

// A warm-up request before anything is measured. Next renders a page on its
// first hit, and on a cold server that cost lands inside the measurement window
// and intermittently fails the first assertion — which looks like a flaky
// component and is not.
async function warm(url) {
  try {
    await fetch(url);
  } catch {
    /* the run will fail informatively later if the server is actually down */
  }
}

const chromePath = CHROME_CANDIDATES.find((p) => p && existsSync(p));
if (!chromePath) {
  console.error("No Chrome or Edge found.");
  process.exit(1);
}

const chrome = spawn(
  chromePath,
  [
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${path.join(process.cwd(), ".chrome-capture-profile")}`,
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
  ],
  { stdio: "ignore" },
);

let failures = 0;

try {
  await waitForEndpoint(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
  const page = await (
    await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?about:blank`, { method: "PUT" })
  ).json();
  const cdp = connect(page.webSocketDebuggerUrl);
  await cdp.ready;

  await cdp.send("Page.enable");
  await cdp.send("Network.enable");
  // The capture profile is persistent and reused across runs, so without this
  // a verification run can load the JS bundle from before the fix it is meant
  // to be checking — and report a pass or a fail that has nothing to do with
  // the current build.
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Headless Chrome reports `prefers-reduced-motion: reduce` by default, so
  // without this the fallback renders and the enhanced path is never exercised.
  // That default is itself worth knowing: it means the reduced-motion branch is
  // what headless sees, and it renders correctly.
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });

  // Collect errors from before hydration. A client component that throws
  // during hydration silently keeps its server-rendered markup, which looks
  // exactly like a feature that was never enabled.
  await cdp.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `window.__errs = [];
      addEventListener('error', e => window.__errs.push(String(e.message)));
      addEventListener('unhandledrejection', e => window.__errs.push('rejection: ' + String(e.reason)));
      const ce = console.error;
      console.error = (...a) => { window.__errs.push(a.map(String).join(' ').slice(0, 300)); ce(...a); };`,
  });

  await warm(BASE + "/");

  const loaded = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url: BASE + "/" });
  await Promise.race([loaded, sleep(15000)]);
  // Wait for the pinned layer images to actually decode. On a cold server the
  // optimiser transcodes each WebP on first request, and a fixed sleep either
  // wastes time or — as it did — intermittently fails stage one while the
  // first layer was still blank. Waiting on the real condition is neither.
  await cdp.send("Runtime.evaluate", {
    expression: `(async () => {
      const sleep = (ms) => new Promise(r => setTimeout(r, ms));
      const deadline = Date.now() + 20000;
      while (Date.now() < deadline) {
        const imgs = [...document.querySelectorAll('#process img')];
        if (imgs.length && imgs.every(i => i.complete && i.naturalWidth > 0)) break;
        await sleep(200);
      }
      if (document.fonts) await document.fonts.ready;
      await sleep(400);
    })()`,
    awaitPromise: true,
  });

  const expected = ["blue", "indigo", "violet", "mint", "coral", "tangerine"];
  const expectedImage = [
    "object-silicon-wafer",
    "object-machined-forms",
    "service-product-design",
    "service-custom-software-development",
    "service-saas-development",
    "service-cloud-solutions",
  ];

  // Diagnostics first: if the enhanced branch never mounted, every per-stage
  // failure below is the same failure and the cause is here.
  const diag = await cdp.send("Runtime.evaluate", {
    expression: `JSON.stringify({
      reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      wide: matchMedia('(min-width: 1024px)').matches,
      innerW: window.innerWidth,
      sticky: Boolean(document.querySelector('#process .sticky')),
      inlineImgs: document.querySelectorAll('#process ol > li img').length,
      hydrated: Boolean(Object.keys(document.querySelector('body > div') || {}).find(k => k.startsWith('__react'))),
      errs: (window.__errs || []).slice(0, 4),
      dataJs: document.documentElement.dataset.js || null,
      pinnedAttr: document.querySelector('#process')?.dataset.pinned,
      heroTilt: (document.querySelector('[class*="perspective-far"]') || {}).style?.getPropertyValue?.('--tilt-x') ?? null,
      globeCanvas: Boolean(document.querySelector('canvas')),
    })`,
    returnByValue: true,
  });
  console.log("  env:", diag.result.value);

  // Guard against the trap that cost most of an hour here: a backgrounded
  // `next start` that fails to bind because an older one still holds the port
  // keeps serving a previous build, and every assertion below then describes
  // code that is not on disk. `data-pinned` exists only in the current
  // component, so its absence means the server is stale, not that the feature
  // is broken.
  const env = JSON.parse(diag.result.value);
  if (env.pinnedAttr === undefined) {
    console.error(
      "\n  Not serving the current build — `data-pinned` is absent.\n" +
        "  Check that `next start` actually bound its port (EADDRINUSE fails\n" +
        "  silently when backgrounded) and that `next build` ran after the last\n" +
        "  edit.\n",
    );
    process.exit(1);
  }

  console.log("\n  stage  accent      opaque layer                       rail");

  for (let i = 0; i < 6; i++) {
    const { result } = await cdp.send("Runtime.evaluate", {
      expression: `(async () => {
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const sec = document.querySelector('#process');
        const stages = [...sec.querySelectorAll('ol > li')];
        stages[${i}].scrollIntoView({ block: 'center', behavior: 'instant' });
        await sleep(650);
        // Wait for the layer that is now opaque to actually have pixels. These
        // images are lazy, so before the first scroll they have not even been
        // requested — a wait before scrolling passes trivially and stage one
        // then reads an image that is still loading.
        const deadline = Date.now() + 15000;
        while (Date.now() < deadline) {
          const vis = [...sec.querySelectorAll('.sticky img')]
            .filter(img => parseFloat(getComputedStyle(img.closest('.absolute')).opacity) > 0.5);
          if (vis.length && vis.every(img => img.complete && img.naturalWidth > 0)) break;
          await sleep(150);
        }
        const layers = [...sec.querySelectorAll('.sticky img')];
        const opaque = layers
          .map((img, n) => ({ n, op: parseFloat(getComputedStyle(img.closest('.absolute')).opacity), src: img.currentSrc }))
          .filter(x => x.op > 0.5);
        const rail = sec.querySelector('.absolute.bottom-5');
        const filled = rail ? [...rail.children].filter(c => {
          const bg = getComputedStyle(c).backgroundColor;
          return !/0\\.25\\)$/.test(bg);
        }).length : -1;
        const src = opaque[0] ? (opaque[0].src.match(/%2F([a-z-]+)\\.webp/) || [])[1] : null;
        return JSON.stringify({
          accent: sec.dataset.accent,
          opaqueCount: opaque.length,
          image: src,
          rail: filled,
          scrollY: Math.round(window.scrollY),
        });
      })()`,
      awaitPromise: true,
      returnByValue: true,
    });

    const r = JSON.parse(result.value);
    const accentOk = r.accent === expected[i];
    const imageOk = r.image === expectedImage[i];
    const oneLayer = r.opaqueCount === 1;
    const railOk = r.rail === i + 1;
    const ok = accentOk && imageOk && oneLayer && railOk;
    if (!ok) failures++;

    console.log(
      `  ${String(i + 1).padStart(5)}  ${String(r.accent).padEnd(11)}` +
        `${String(r.image).padEnd(36)}${String(r.rail).padStart(2)}/6  ` +
        (ok
          ? "ok"
          : `FAIL${accentOk ? "" : " accent"}${imageOk ? "" : " image"}` +
            `${oneLayer ? "" : ` layers=${r.opaqueCount}`}${railOk ? "" : " rail"}`),
    );
  }

  cdp.close();
} finally {
  chrome.kill();
}

console.log(
  failures === 0
    ? "\n  All six stages advance correctly.\n"
    : `\n  ${failures} stage(s) did not advance as expected.\n`,
);
process.exit(failures === 0 ? 0 : 1);
