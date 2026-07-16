const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter'

/**
 * Fetches hiking-tagged ways from OpenStreetMap within `radiusMeters` of
 * (lat, lng). Uses `out geom` so each way comes back with full coordinate
 * geometry inline — no second query to resolve node ids.
 *
 * Returns: [{ id, name, difficulty, path: [{lat, lng}, ...] }]
 */
export async function fetchNearbyTrails(lat, lng, radiusMeters = 8000) {
  const query = `
    [out:json][timeout:25];
    (
      way["highway"="path"](around:${radiusMeters},${lat},${lng});
      way["sac_scale"](around:${radiusMeters},${lat},${lng});
      way["highway"="track"]["foot"!="no"](around:${radiusMeters},${lat},${lng});
    );
    out geom;
  `

  const res = await fetch(OVERPASS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: query,
  })

  if (!res.ok) {
    throw new Error(`Overpass request failed: ${res.status}`)
  }

  const data = await res.json()

  return (data.elements || [])
    .filter((el) => el.type === 'way' && Array.isArray(el.geometry))
    .map((el) => ({
      id: el.id,
      name: el.tags?.name || 'Unnamed trail',
      difficulty: el.tags?.sac_scale || null,
      path: el.geometry.map((pt) => ({ lat: pt.lat, lng: pt.lon })),
    }))
}
