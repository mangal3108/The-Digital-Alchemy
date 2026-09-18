/**
 * Generates the country geometry the globe renders.
 *
 * Runs at build time rather than in the browser: the source TopoJSON needs a
 * decoder to read, and shipping raw coordinates lets us drop everything the
 * globe cannot actually show.
 *
 * Three reductions, in order of saving:
 *   1. Coordinates rounded to 1dp. The globe renders at most ~640px across for
 *      a 12,742km diameter — about 20km per pixel — so 0.1° (~11km) is already
 *      sub-pixel. Anything finer is bytes nobody can see.
 *   2. Consecutive duplicate points removed. Rounding collapses a lot of dense
 *      coastline onto identical positions.
 *   3. Rings smaller than a pixel dropped. Micro-islands cost real bytes and
 *      render as nothing.
 *
 * Usage: node scripts/build-globe-data.mjs
 * Output: src/content/generated/world-countries.json
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { feature } from "topojson-client";

const SOURCE = "node_modules/world-atlas/countries-110m.json";
const OUT_DIR = "src/content/generated";
const OUT_FILE = `${OUT_DIR}/world-countries.json`;

const PRECISION = 1;
const SCALE = 10 ** PRECISION;
/** Degrees. A ring whose bounding box is smaller than this is invisible. */
const MIN_RING_EXTENT = 0.6;

const topology = JSON.parse(readFileSync(SOURCE, "utf8"));
const collection = feature(topology, topology.objects.countries);

const round = (n) => Number(n.toFixed(PRECISION));

/** Round, then drop points that collapsed onto their neighbour. */
function simplifyRing(ring) {
  const out = [];
  let previous = null;
  for (const point of ring) {
    const next = [round(point[0]), round(point[1])];
    if (previous && next[0] === previous[0] && next[1] === previous[1]) continue;
    out.push(next);
    previous = next;
  }
  // A polygon ring needs to close; fewer than 4 points cannot enclose area.
  if (out.length < 4) return null;
  const [fx, fy] = out[0];
  const [lx, ly] = out[out.length - 1];
  if (fx !== lx || fy !== ly) out.push([fx, fy]);
  return out;
}

function ringIsVisible(ring) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [x, y] of ring) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return maxX - minX >= MIN_RING_EXTENT || maxY - minY >= MIN_RING_EXTENT;
}

function simplifyPolygon(rings) {
  const out = [];
  for (let i = 0; i < rings.length; i++) {
    const ring = simplifyRing(rings[i]);
    if (!ring) continue;
    // Index 0 is the outer ring; later ones are holes. Drop invisible outers,
    // and drop holes too small to matter.
    if (!ringIsVisible(ring)) continue;
    out.push(ring);
  }
  return out.length ? out : null;
}

/** Antarctica smears across the bottom of an orthographic globe and says nothing. */
const EXCLUDE = new Set(["Antarctica"]);

const features = [];

for (const f of collection.features) {
  if (EXCLUDE.has(f.properties?.name)) continue;

  let geometry = null;

  if (f.geometry.type === "Polygon") {
    const rings = simplifyPolygon(f.geometry.coordinates);
    if (rings) geometry = { type: "Polygon", coordinates: rings };
  } else if (f.geometry.type === "MultiPolygon") {
    const polygons = f.geometry.coordinates
      .map(simplifyPolygon)
      .filter(Boolean);
    if (polygons.length) {
      geometry = { type: "MultiPolygon", coordinates: polygons };
    }
  }

  if (!geometry) continue;

  // Normalise Polygon into MultiPolygon so the client has one shape to decode,
  // and flatten each ring to scaled integers: "[-1800,-161,...]" instead of
  // "[[-180,-16.1],...]" removes two brackets and a decimal point per point.
  const polygons =
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;

  const encoded = polygons.map((rings) =>
    rings.map((ring) => {
      const flat = new Array(ring.length * 2);
      for (let i = 0; i < ring.length; i++) {
        flat[i * 2] = Math.round(ring[i][0] * SCALE);
        flat[i * 2 + 1] = Math.round(ring[i][1] * SCALE);
      }
      return flat;
    }),
  );

  const name = f.properties?.name ?? "";

  /**
   * ISO 3166-1 numeric, zero-padded to three characters so market codes can be
   * compared as plain strings. Natural Earth leaves this unset for a handful of
   * disputed or partially recognised territories (N. Cyprus, Somaliland,
   * Kosovo); they still need a stable, unique id because the renderer keys its
   * per-country tint off it, so they fall back to a name-derived one.
   */
  const id =
    typeof f.id === "string" && f.id.length
      ? f.id.padStart(3, "0")
      : `x-${name.toLowerCase().replace(/[^a-z]+/g, "-")}`;

  features.push({
    id,
    n: name,
    p: encoded,
  });
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify({ scale: SCALE, features }));

const sizeKb = Math.round(Buffer.byteLength(readFileSync(OUT_FILE)) / 1024);
const points = features.reduce(
  (sum, f) =>
    sum +
    f.p.reduce(
      (n, rings) => n + rings.reduce((m, ring) => m + ring.length / 2, 0),
      0,
    ),
  0,
);

console.log(
  `${features.length} countries · ${points.toLocaleString()} points → ${OUT_FILE} (${sizeKb}KB at ${PRECISION}dp)`,
);
