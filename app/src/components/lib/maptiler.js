export const MAPTILER_KEY = (import.meta.env.MAPTILER_API || "").trim();
export const hasMapKey = MAPTILER_KEY.length > 0;

export const BANGALORE = { lat: 12.9716, lng: 77.5946 };
// Roughly 250 km around Bangalore, so searches stay local
const NEAR_BANGALORE_BBOX = "75.6,11.6,79.2,14.4";

let sdkPromise;
export function loadMapSdk() {
  sdkPromise ??= Promise.all([import("@maptiler/sdk"), import("@maptiler/sdk/dist/maptiler-sdk.css")]).then(([sdk]) => {
    sdk.config.apiKey = MAPTILER_KEY;
    return sdk;
  });
  return sdkPromise;
}

export function distanceKm(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function pinLink({ lat, lng }) {
  return `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(5)},${lng.toFixed(5)}`;
}

function cleanPlace(name = "") {
  return name
    .replace(/\u200c/g, "")
    .replace(/,\s*India$/, "")
    .trim();
}

export async function searchPlaces(query, { signal } = {}) {
  if (!hasMapKey) return [];
  const base = {
    key: MAPTILER_KEY,
    proximity: `${BANGALORE.lng},${BANGALORE.lat}`,
    country: "in",
    bbox: NEAR_BANGALORE_BBOX,
    language: "en",
    limit: "5",
  };
  const url = (extra) =>
    `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?${new URLSearchParams({ ...base, ...extra })}`;
  // Peaks and falls are indexed as points of interest, which the default search leaves out
  const [pois, places] = await Promise.all(
    [url({ types: "poi" }), url({})].map(async (u) => {
      const res = await fetch(u, { signal });
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      return (await res.json()).features || [];
    })
  );
  const seen = new Set();
  return [...pois, ...places.slice(0, 3)]
    .map((f) => ({
      id: f.id,
      name: cleanPlace(f.text),
      place: cleanPlace(f.place_name),
      lat: f.center[1],
      lng: f.center[0],
    }))
    .filter((p) => {
      const k = `${p.name.toLowerCase()}|${p.lat.toFixed(2)},${p.lng.toFixed(2)}`;
      return !seen.has(k) && seen.add(k);
    })
    .slice(0, 6);
}

export async function placeNameAt({ lat, lng }, { signal } = {}) {
  if (!hasMapKey) return "";
  const params = new URLSearchParams({ key: MAPTILER_KEY, language: "en" });
  const res = await fetch(`https://api.maptiler.com/geocoding/${lng},${lat}.json?${params}`, { signal });
  if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
  const data = await res.json();
  return cleanPlace(data.features?.[0]?.place_name);
}
