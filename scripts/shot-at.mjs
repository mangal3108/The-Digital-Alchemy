/**
 * Screenshots a page after scrolling a named element into view.
 *
 * `chrome --headless --screenshot` only ever captures the top of the document,
 * which is no use for anything below the fold or for a scroll-driven section
 * whose whole behaviour is what happens once you are inside it.
 *
 * Usage: node scripts/shot-at.mjs <url> <selector> <out.png> [stageIndex]
 */
import { spawn } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";

const [url, selector, out, stageIndex] = process.argv.slice(2);
if (!url || !selector || !out) {
  console.error("usage: node scripts/shot-at.mjs <url> <selector> <out.png> [stageIndex]");
  process.exit(1);
}

const DEBUG_PORT = 9337;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error("Chrome did not start");
}

const chromePath = CHROME_CANDIDATES.find((p) => p && existsSync(p));
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

try {
  await waitForEndpoint(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
  const page = await (
    await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/new?about:blank`, { method: "PUT" })
  ).json();
  const cdp = connect(page.webSocketDebuggerUrl);
  await cdp.ready;

  await cdp.send("Page.enable");
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  // Otherwise headless takes the reduced-motion branch and the enhanced
  // layout never renders.
  await cdp.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });

  await cdp.send("Page.navigate", { url });
  await sleep(4000);

  await cdp.send("Runtime.evaluate", {
    expression: `(async () => {
      const sleep = (ms) => new Promise(r => setTimeout(r, ms));
      const root = document.querySelector(${JSON.stringify(selector)});
      const target = ${stageIndex ? `root.querySelectorAll('ol > li')[${Number(stageIndex)}]` : "root"};
      target.scrollIntoView({ block: 'center', behavior: 'instant' });
      await sleep(900);
    })()`,
    awaitPromise: true,
  });

  const shot = await cdp.send("Page.captureScreenshot", { format: "png" });
  writeFileSync(out, Buffer.from(shot.data, "base64"));
  console.log(`  ${out}`);
  cdp.close();
} finally {
  chrome.kill();
}
