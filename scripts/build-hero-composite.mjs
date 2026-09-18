/**
 * Photographs the /capture/hero stage into the homepage hero asset.
 *
 * The screens in the result are real: actual screenshots of the running site
 * and admin panel, taken by `scripts/capture-ui.mjs` and placed inside the
 * device frames the rest of the site already uses. Nothing on any screen is
 * invented, so the hero cannot misrepresent what we build — and there is no
 * generated lettering to come out garbled.
 *
 * Captured on a transparent ground rather than white, so it sits on the page
 * background with no edge at all.
 *
 * Usage:
 *   TDA_CAPTURE=1 npm start   (server must expose /capture/hero)
 *   node scripts/build-hero-composite.mjs [baseUrl]
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BASE = process.argv[2] || "http://localhost:3100";
const DEBUG_PORT = 9334;
// Written as `hero-lineup`, not `platform-devices`. The supplied render is
// still the live hero by explicit request; this is the alternative built from
// real screenshots, so both exist and switching is a one-line change.
const OUT = "public/images/hero/hero-lineup.webp";
const MANIFEST = "src/content/generated/brand-images.json";
const STAGE = { width: 1200, height: 572 };
const SCALE = 2;

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

const chromePath = CHROME_CANDIDATES.find((p) => p && existsSync(p));
if (!chromePath) {
  console.error("No Chrome or Edge found.");
  process.exit(1);
}

const probe = await fetch(`${BASE}/capture/hero`).catch(() => null);
if (!probe || !probe.ok) {
  console.error(
    `\n/capture/hero returned ${probe ? probe.status : "no response"}.` +
      `\nStart the server with TDA_CAPTURE=1 so the stage route renders.\n`,
  );
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

try {
  await waitForEndpoint(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
  const page = await (
    await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?about:blank`, { method: "PUT" })
  ).json();
  const cdp = connect(page.webSocketDebuggerUrl);
  await cdp.ready;

  await cdp.send("Page.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: STAGE.width,
    height: STAGE.height,
    deviceScaleFactor: SCALE,
    mobile: false,
  });
  // Transparent ground — the hero then has no rectangle to hide.
  await cdp.send("Emulation.setDefaultBackgroundColorOverride", {
    color: { r: 0, g: 0, b: 0, a: 0 },
  });

  const loaded = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url: `${BASE}/capture/hero` });
  await Promise.race([loaded, sleep(15000)]);
  await cdp.send("Runtime.evaluate", {
    expression: `(async () => {
      if (document.fonts) await document.fonts.ready;
      await Promise.all([...document.images].map(i => i.complete ? 0 : i.decode().catch(() => 0)));
    })()`,
    awaitPromise: true,
  });
  await sleep(600);

  const shot = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  cdp.close();

  const raw = Buffer.from(shot.data, "base64");

  mkdirSync(path.dirname(OUT), { recursive: true });
  const info = await sharp(raw)
    .trim({ threshold: 1 })
    .webp({ quality: 92, effort: 5, alphaQuality: 100 })
    .toFile(OUT);

  const blur = await sharp(raw)
    .trim({ threshold: 1 })
    .resize(16, 16, { fit: "inside" })
    .webp({ quality: 40, alphaQuality: 100 })
    .toBuffer();

  const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
  manifest["hero-lineup"] = {
    src: "/images/hero/platform-devices.webp",
    width: info.width,
    height: info.height,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    // Every screen is a real screenshot of our own software, so there is
    // nothing invented here to disclaim.
    illustrative: false,
  };
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));

  console.log(
    `  ${info.width}×${info.height}  ${Math.round(info.size / 1024)}KB  transparent` +
      `\n  → ${OUT}\n  manifest updated, illustrative: false`,
  );
} finally {
  chrome.kill();
}
