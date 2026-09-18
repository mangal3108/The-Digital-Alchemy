/**
 * Measures text contrast against what is actually rendered behind it.
 *
 * Computed styles are not enough once anything sits behind the text. A
 * photograph at low opacity under a scrim under a grain overlay has no single
 * background colour, and `getComputedStyle(el).backgroundColor` returns
 * `rgba(0,0,0,0)` for the text element regardless. The only truthful answer
 * comes from the pixels.
 *
 * So: hide the text, photograph the region it occupied, and measure the
 * background that was underneath. Contrast is then computed against the
 * *worst* pixel in that region rather than the average, because a bright patch
 * of the photograph behind one word is exactly the failure this is looking for.
 *
 * Usage: node scripts/verify-contrast.mjs [baseUrl]
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BASE = process.argv[2] || "http://localhost:3100";
const DEBUG_PORT = 9338;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Fraction trimmed from each edge of an element before sampling. */
const INSET = 0.22;

/** Percentile used as the reported contrast, rejecting anti-aliased fringes. */
const PERCENTILE = 0.05;

/**
 * What to check. Each entry is a page and the selectors on it whose legibility
 * depends on something rendered behind them.
 */
const TARGETS = [
  {
    url: "/",
    label: "technology band (dark)",
    selectors: [
      ["heading", "#technology h2"],
      ["lede", "#technology .text-lede"],
      ["tab", "#technology [role='tab'][aria-selected='true']"],
    ],
  },
  {
    url: "/contact",
    label: "contact hero (light)",
    selectors: [
      ["h1", "main h1, h1"],
      ["lede", ".text-lede"],
      ["eyebrow", ".eyebrow"],
    ],
  },
  {
    url: "/start-a-project",
    label: "start-a-project hero (light)",
    selectors: [
      ["h1", "main h1, h1"],
      ["lede", ".text-lede"],
      // Scoped past the header: a bare `ul li` matches the nav first, and the
      // logo wordmark is not what this is meant to measure.
      ["bullet", "main section:first-of-type ul li"],
    ],
  },
];

const CHROME_CANDIDATES = [
  `${process.env.ProgramFiles}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env["ProgramFiles(x86)"]}\\Google\\Chrome\\Application\\chrome.exe`,
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
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

async function waitForEndpoint(u, attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(u);
      if (res.ok) return res.json();
    } catch {
      /* not up */
    }
    await sleep(250);
  }
  throw new Error("Chrome did not start");
}

const srgb = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const luminance = ([r, g, b]) =>
  0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const contrast = (a, b) => {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

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
  console.error("No Chrome found.");
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
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true }).catch(() => {});
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  for (const target of TARGETS) {
    await warm(BASE + target.url);
    await cdp.send("Page.navigate", { url: BASE + target.url });
    await sleep(3500);

    console.log(`\n  ${target.url}  ${target.label}`);

    for (const [name, selector] of target.selectors) {
      // Scroll it into view, read its colour and box, then hide just this
      // element so the region behind it can be photographed.
      const { result } = await cdp.send("Runtime.evaluate", {
        expression: `(async () => {
          const sleep = (ms) => new Promise(r => setTimeout(r, ms));
          const el = document.querySelector(${JSON.stringify(selector)});
          if (!el) return JSON.stringify({ missing: true });
          el.scrollIntoView({ block: 'center', behavior: 'instant' });
          await sleep(700);
          const r = el.getBoundingClientRect();
          const colour = getComputedStyle(el).color;
          // Transparent text, not a hidden element: hiding it also removes the
          // element's own background, so a dark label on a light pill would be
          // measured against the section behind the pill and report a false
          // failure near 1:1.
          //
          // Applied as a document rule rather than an inline style. Inline
          // styles lose to a class carrying !important, and React drops them
          // on the next reconcile of a client component — which silently left
          // the text visible and produced a failure that was really the
          // measurement not working.
          el.setAttribute('data-contrast-probe', '');
          let sheet = document.getElementById('contrast-probe-style');
          if (!sheet) {
            sheet = document.createElement('style');
            sheet.id = 'contrast-probe-style';
            // Killing transitions matters as much as the colour: the tab animates
            // its colour, so without this the screenshot catches it part way through
            // and the readback sees rgba(17,17,17,0.3) rather than transparent.
            sheet.textContent = '[data-contrast-probe], [data-contrast-probe] * { color: transparent !important; transition: none !important; }';
            document.head.appendChild(sheet);
          }
          // Read back: if the probe did not take, every measurement below is
          // comparing the glyphs against themselves and a pass means nothing.
          await sleep(60);
          const after = getComputedStyle(el).color;
          return JSON.stringify({
            colour,
            probeWorked: after === 'rgba(0, 0, 0, 0)' || after === 'transparent',
            after,
            x: Math.round(r.left), y: Math.round(r.top),
            w: Math.round(r.width), h: Math.round(r.height),
          });
        })()`,
        awaitPromise: true,
        returnByValue: true,
      });

      const box = JSON.parse(result.value);
      if (box.probeWorked === false) {
        failures++;
        console.log(
          `    ${name.padEnd(10)} PROBE FAILED — text stayed ${box.after}; ` +
            `measurement would be meaningless`,
        );
        continue;
      }
      if (box.missing) {
        console.log(`    ${name.padEnd(10)} selector matched nothing — skipped`);
        continue;
      }

      // Full viewport, then crop locally. A clipped CDP screenshot is the
      // fragile path here — its coordinate space shifts with
      // `captureBeyondViewport` and a bad clip hangs rather than erroring.
      const shot = await cdp.send("Page.captureScreenshot", { format: "png" });

      await cdp.send("Runtime.evaluate", {
        expression: `document.querySelectorAll('[data-contrast-probe]').forEach(n => n.removeAttribute('data-contrast-probe'))`,
      });

      // Kept as a buffer: a sharp instance cannot be reused once a pipeline
      // has run on it, and the failure path below needs a second read.
      const png = Buffer.from(shot.data, "base64");
      const full = sharp(png);
      const meta = await full.metadata();

      // Inset before sampling. A bounding box is a rectangle but elements are
      // not: the corners of a rounded pill fall outside the visible shape and
      // show whatever is behind the element, which reported a 1.01:1 failure
      // for a dark label sitting on a perfectly legible light pill. Glyphs
      // occupy the middle, so the middle is what has to be measured.
      const insetX = Math.floor(box.w * INSET);
      const insetY = Math.floor(box.h * INSET);
      const x = box.x + insetX;
      const y = box.y + insetY;
      const crop = {
        left: Math.max(0, Math.min(x, meta.width - 1)),
        top: Math.max(0, Math.min(y, meta.height - 1)),
        width: Math.max(1, Math.min(box.w - insetX * 2, meta.width - Math.max(0, x))),
        height: Math.max(1, Math.min(box.h - insetY * 2, meta.height - Math.max(0, y))),
      };
      const { data, info } = await full
        .extract(crop)
        .raw()
        .toBuffer({ resolveWithObject: true });

      const fg = (box.colour.match(/[\d.]+/g) || []).slice(0, 3).map(Number);

      // A low percentile rather than the single worst pixel. Every element with
      // a curve or a border carries a thin band of anti-aliased boundary
      // pixels that are, by construction, part way between the element and
      // whatever is behind it — and one such pixel is not a legibility
      // problem. A genuine bright patch behind text covers a real area, so it
      // survives the percentile; a one-pixel fringe does not.
      const samples = [];
      for (let i = 0; i < data.length; i += info.channels) {
        samples.push(contrast(fg, [data[i], data[i + 1], data[i + 2]]));
      }
      samples.sort((a, b) => a - b);
      const worst = samples[Math.floor(samples.length * PERCENTILE)] ?? samples[0];
      const belowAA = samples.filter((c) => c < 4.5).length;
      const share = ((belowAA / samples.length) * 100).toFixed(1);

      const pass = worst >= 4.5;
      if (!pass) {
        failures++;
        // Save exactly what was measured. A contrast failure is impossible to
        // act on without seeing the region it came from — and half of them
        // turn out to be the selector catching something that is not text.
        mkdirSync(".shots", { recursive: true });
        const out = `.shots/contrast-${target.label.replace(/[^a-z]+/gi, "-")}-${name}.png`;
        writeFileSync(out, await sharp(png).extract(crop).png().toBuffer());
        console.log(`    ${" ".repeat(10)} measured region saved to ${out}`);
      }
      console.log(
        `    ${name.padEnd(10)} ${worst.toFixed(2).padStart(6)}:1  ` +
          `text rgb(${fg.join(",")})  ${share}% of sampled pixels under 4.5  ` +
          (pass ? "AA" : "FAIL"),
      );
    }
  }

  cdp.close();
} finally {
  chrome.kill();
}

console.log(
  failures === 0
    ? "\n  All measured text passes AA against what is rendered behind it.\n"
    : `\n  ${failures} failing. A backdrop is dragging text under 4.5:1.\n`,
);
process.exit(failures === 0 ? 0 : 1);
