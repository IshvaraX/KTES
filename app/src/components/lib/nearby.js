import { BANGALORE, MAPTILER_KEY, distanceKm, loadMapSdk } from "./maptiler";
import { TRAILS } from "./trails";

// Waterfalls are read at zoom 10, which covers about 75 km either side
export const NEAR_MAX_KM = 75;
const STATION_FALLBACK_DEG = 0.5;

const featureName = (p) => p["name:en"] || p["name:latin"] || p.name || "";

function idle(map, ms = 9000) {
  return Promise.race([new Promise((r) => map.once("idle", r)), new Promise((r) => setTimeout(r, ms))]);
}

async function moveAndWait(map, center, zoom) {
  const pending = idle(map);
  map.jumpTo({ center: [center.lng, center.lat], zoom });
  map.triggerRepaint();
  await pending;
}

// Invisible layers keep tiles loading for exactly the data we read, and nothing else
function scannerStyle() {
  const tiles = (id) => `https://api.maptiler.com/tiles/${id}/tiles.json?key=${MAPTILER_KEY}`;
  const probe = (id, source, sourceLayer) => ({
    id,
    type: "circle",
    source,
    "source-layer": sourceLayer,
    paint: { "circle-opacity": 0, "circle-radius": 1 },
  });
  return {
    version: 8,
    sources: {
      planet: { type: "vector", url: tiles("v4") },
      landform: { type: "vector", url: tiles("landform") },
      outdoor: { type: "vector", url: tiles("outdoor") },
      // The older OpenMapTiles set still names rivers; v4 waterways are unnamed
      omt: { type: "vector", url: tiles("v3") },
    },
    layers: [
      { id: "bg", type: "background", paint: { "background-opacity": 0 } },
      probe("peaks", "landform", "peak"),
      { id: "rivers", type: "line", source: "omt", "source-layer": "waterway", paint: { "line-opacity": 0 } },
      probe("outdoor-poi", "outdoor", "outdoor_poi"),
      probe("stations", "planet", "poi_station"),
    ],
  };
}

// One offscreen map is reused for every lookup; its tiles are the data source
export async function createScanner() {
  const sdk = await loadMapSdk();
  const node = document.createElement("div");
  node.setAttribute("aria-hidden", "true");
  node.style.cssText = "position:fixed;left:-12000px;top:0;width:1024px;height:1024px;pointer-events:none;";
  document.body.appendChild(node);
  const map = new sdk.Map({
    container: node,
    style: scannerStyle(),
    center: [BANGALORE.lng, BANGALORE.lat],
    zoom: 9,
    interactive: false,
    navigationControl: false,
    geolocateControl: false,
    projection: "mercator",
    space: false,
    halo: false,
    logSDKVersion: false,
  });
  await new Promise((resolve, reject) => {
    map.once("load", resolve);
    map.once("error", (e) => reject(e.error || new Error("Map failed to load")));
  });
  return {
    map,
    destroy() {
      map.remove();
      node.remove();
    },
  };
}

const plainName = (n) =>
  n
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+river$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

function* vertices(geom) {
  if (geom.type === "LineString") yield* geom.coordinates;
  else if (geom.type === "MultiLineString") for (const line of geom.coordinates) yield* line;
}

// The closest point of each named river, since a river's centre can be far from the user
function nearestRiverPoints(features, user) {
  const best = new Map();
  for (const f of features) {
    if (f.properties.class !== "river") continue;
    const name = (f.properties["name:en"] || f.properties["name:latin"] || f.properties.name || "").trim();
    if (!name) continue;
    const key = plainName(name);
    for (const [lng, lat] of vertices(f.geometry)) {
      const km = distanceKm(user, { lat, lng });
      const cur = best.get(key);
      if (!cur || km < cur.km) best.set(key, { kind: "river", name: cur?.name && !/[\u0080-\uffff]/.test(cur.name) ? cur.name : name, lat, lng, km });
    }
  }
  return [...best.values()];
}

function uniqueBy(items, keyOf) {
  const seen = new Set();
  return items.filter((it) => {
    const k = keyOf(it);
    return !seen.has(k) && seen.add(k);
  });
}

export async function findPlacesNear(scanner, user, maxKm = NEAR_MAX_KM) {
  const { map } = scanner;
  const found = [];

  await moveAndWait(map, user, 9);
  for (const f of map.querySourceFeatures("landform", { sourceLayer: "peak" })) {
    const name = featureName(f.properties);
    const [lng, lat] = f.geometry.coordinates;
    if (name) found.push({ kind: "hill", name, ele: f.properties.ele, lat, lng });
  }

  await moveAndWait(map, user, 10);
  for (const f of map.querySourceFeatures("outdoor", { sourceLayer: "outdoor_poi" })) {
    const cls = f.properties.class;
    if (cls !== "waterfall" && cls !== "castle") continue;
    const name = featureName(f.properties);
    if (!name || f.geometry.type !== "Point") continue;
    const [lng, lat] = f.geometry.coordinates;
    found.push({ kind: cls === "waterfall" ? "waterfall" : "fort", name, lat, lng });
  }
  found.push(...nearestRiverPoints(map.querySourceFeatures("omt", { sourceLayer: "waterway" }), user));

  const curated = TRAILS.map((t) => ({
    kind: t.category === "waterfall" ? "waterfall" : "hill",
    name: t.name,
    ele: t.elevationM,
    lat: t.lat,
    lng: t.lng,
    trail: t,
  }));

  const near = (p) => distanceKm(user, p) <= maxKm;
  const nearCurated = curated.filter(near);
  const fromMap = uniqueBy(found.filter(near), (p) => `${p.name.toLowerCase()}|${p.lat.toFixed(3)},${p.lng.toFixed(3)}`).filter(
    (p) => !nearCurated.some((c) => distanceKm(c, p) < 1.5)
  );

  return [...nearCurated, ...fromMap]
    .map((p) => ({
      ...p,
      key: p.trail ? `ktes-${p.trail.id}` : `map-${p.kind}-${p.lat.toFixed(4)},${p.lng.toFixed(4)}`,
      km: distanceKm(user, p),
    }))
    .sort((a, b) => a.km - b.km);
}

function stationLabel(name, subclass) {
  if (/\b(station|junction|halt|jn)\b/i.test(name)) return name;
  return `${name} ${subclass === "halt" ? "halt" : "station"}`;
}

async function stationFromSearch(place) {
  const d = STATION_FALLBACK_DEG;
  const base = {
    key: MAPTILER_KEY,
    proximity: `${place.lng},${place.lat}`,
    bbox: `${place.lng - d},${place.lat - d},${place.lng + d},${place.lat + d}`,
    types: "poi",
    limit: "10",
    language: "en",
  };
  const lists = await Promise.all(
    ["railway station", "junction", "halt"].map(async (q) => {
      const res = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(q)}.json?${new URLSearchParams(base)}`);
      if (!res.ok) return [];
      return (await res.json()).features || [];
    })
  );
  const stations = lists
    .flat()
    .filter((f) => (f.properties?.categories || []).some((c) => c === "railway station" || c === "train station"))
    .map((f) => ({ name: stationLabel(f.text, "station"), lat: f.center[1], lng: f.center[0] }));
  return stations;
}

export async function nearestStation(scanner, place) {
  const { map } = scanner;
  await moveAndWait(map, place, 12);
  let stations = map
    .querySourceFeatures("planet", { sourceLayer: "poi_station" })
    .filter((f) => f.properties.class === "railway" && f.geometry.type === "Point")
    .map((f) => ({
      name: stationLabel(featureName(f.properties), f.properties.subclass),
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
    }))
    .filter((s) => s.name.trim());

  // Only the tiles around the place are loaded, so farther junctions come from search
  if (!stations.length) stations = await stationFromSearch(place);
  if (!stations.length) return null;

  return stations
    .map((s) => ({ ...s, km: distanceKm(place, s) }))
    .sort((a, b) => a.km - b.km)[0];
}
