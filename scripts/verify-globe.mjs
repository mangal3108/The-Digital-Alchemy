/**
 * Verifies the globe's geometry pipeline without a browser.
 *
 * The canvas drawing itself is thin glue; everything that can actually be
 * wrong — the decode from the packed integer format, the projection, which
 * countries the markets resolve to, and the visible-hemisphere test that stops
 * markers showing through the far side of the Earth — is checked here.
 *
 * Usage: node scripts/verify-globe.mjs
 */
import { readFileSync } from "node:fs";
import { geoOrthographic, geoPath } from "d3-geo";

const data = JSON.parse(
  readFileSync("src/content/generated/world-countries.json", "utf8"),
);

const MARKETS = [
  { code: "356", name: "India", lat: 28.61, lon: 77.21, home: true },
  { code: "840", name: "United States", lat: 38.9, lon: -77.04 },
  { code: "036", name: "Australia", lat: -33.87, lon: 151.21 },
  { code: "826", name: "United Kingdom", lat: 51.51, lon: -0.13 },
  { code: "124", name: "Canada", lat: 43.65, lon: -79.38 },
  { code: "784", name: "United Arab Emirates", lat: 25.2, lon: 55.27 },
];

let failures = 0;
const check = (label, condition, detail = "") => {
  if (condition) {
    console.log(`  ✓ ${label}`);
  } else {
    failures += 1;
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
  }
};

// --- Decode, exactly as the component does ---------------------------------
console.log("Decoding packed geometry");
const scale = data.scale;
const countries = data.features.map((f) => ({
  id: f.id,
  name: f.n,
  geometry: {
    type: "MultiPolygon",
    coordinates: f.p.map((rings) =>
      rings.map((flat) => {
        const ring = new Array(flat.length / 2);
        for (let i = 0; i < flat.length; i += 2) {
          ring[i / 2] = [flat[i] / scale, flat[i + 1] / scale];
        }
        return ring;
      }),
    ),
  },
}));

check(`${countries.length} countries decoded`, countries.length > 150);

let outOfRange = 0;
let closedRings = 0;
let totalRings = 0;
for (const country of countries) {
  for (const polygon of country.geometry.coordinates) {
    for (const ring of polygon) {
      totalRings += 1;
      const [fx, fy] = ring[0];
      const [lx, ly] = ring[ring.length - 1];
      if (fx === lx && fy === ly) closedRings += 1;
      for (const [lon, lat] of ring) {
        if (lon < -180.5 || lon > 180.5 || lat < -90.5 || lat > 90.5) {
          outOfRange += 1;
        }
      }
    }
  }
}
check("all coordinates within lon/lat bounds", outOfRange === 0, `${outOfRange} out of range`);
check(
  "every ring is closed",
  closedRings === totalRings,
  `${totalRings - closedRings} of ${totalRings} unclosed`,
);

// --- Markets resolve to real country geometry -------------------------------
console.log("\nResolving markets to country geometry");
for (const market of MARKETS) {
  const match = countries.find((c) => c.id === market.code);
  check(`${market.name} (${market.code})`, Boolean(match), "no geometry with that ISO code");
}

// --- Projection produces drawable paths -------------------------------------
console.log("\nProjecting");
const SIZE = 480;
const projection = geoOrthographic()
  .precision(0.4)
  .scale((SIZE / 2) * 0.92)
  .translate([SIZE / 2, SIZE / 2])
  .rotate([-77.21, -12, 0]); // centred on New Delhi, as on first paint
const path = geoPath(projection);

const drawable = countries.filter((c) => {
  const d = path(c.geometry);
  return typeof d === "string" && d.length > 0;
});
check(
  `${drawable.length} countries produce a path from this angle`,
  drawable.length > 60,
  "expected most of the facing hemisphere to draw",
);

const india = countries.find((c) => c.id === "356");
check("India draws", Boolean(india && path(india.geometry)));

// --- Visible-hemisphere test -------------------------------------------------
console.log("\nHemisphere culling");
const RAD = Math.PI / 180;
const isVisible = (lon, lat) => {
  const [rotateLon, rotateTilt] = projection.rotate();
  const centreLon = -rotateLon * RAD;
  const centreLat = -rotateTilt * RAD;
  return (
    Math.sin(centreLat) * Math.sin(lat * RAD) +
      Math.cos(centreLat) *
        Math.cos(lat * RAD) *
        Math.cos(lon * RAD - centreLon) >
    0
  );
};

// Centred on New Delhi: India, the UAE and the UK face us; the US does not.
check("India is visible when centred on India", isVisible(77.21, 28.61));
check("UAE is visible when centred on India", isVisible(55.27, 25.2));
check("Washington DC is culled when centred on India", !isVisible(-77.04, 38.9));

// Every visible marker must project inside the disc.
let outsideDisc = 0;
for (const market of MARKETS) {
  if (!isVisible(market.lon, market.lat)) continue;
  const point = projection([market.lon, market.lat]);
  if (!point) {
    outsideDisc += 1;
    continue;
  }
  const dx = point[0] - SIZE / 2;
  const dy = point[1] - SIZE / 2;
  if (Math.hypot(dx, dy) > (SIZE / 2) * 0.93) outsideDisc += 1;
}
check("visible markers project inside the globe", outsideDisc === 0, `${outsideDisc} outside`);

// Rotating a half turn must flip which side is showing.
projection.rotate([77.21, -12, 0]);
check(
  "rotating 180° flips the facing hemisphere",
  !isVisible(77.21, 28.61),
);

console.log(
  failures
    ? `\n${failures} check(s) failed.`
    : "\nAll globe geometry checks passed.",
);
process.exit(failures ? 1 : 0);
