const OVERPASS_INSTANCES = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
]

async function postOverpass(query, timeoutMs = 45000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  for (const endpoint of OVERPASS_INSTANCES) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: query,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Overpass error (${res.status}): ${text.slice(0, 200)}`)
      }

      return await res.json()
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('Overpass request timed out')
      }
      if (endpoint === OVERPASS_INSTANCES[OVERPASS_INSTANCES.length - 1]) {
        throw err
      }
      continue
    }
  }
}

export async function fetchNearbyHikingAreas(lat, lng, radiusMeters = 10000) {
  const query = `
    [out:json][timeout:30];
    (
      node["natural"="peak"](around:${radiusMeters},${lat},${lng});
      way["natural"="peak"](around:${radiusMeters},${lat},${lng});
      node["leisure"="hiking_area"](around:${radiusMeters},${lat},${lng});
      way["leisure"="hiking_area"](around:${radiusMeters},${lat},${lng});
      node["tourism"="viewpoint"](around:${radiusMeters},${lat},${lng});
      way["tourism"="viewpoint"](around:${radiusMeters},${lat},${lng});
    );
    out center;
  `

  const data = await postOverpass(query)

  return (data.elements || [])
    .filter((el) => {
      const latVal = el.lat ?? el.center?.lat
      const lonVal = el.lon ?? el.center?.lon
      return latVal && lonVal
    })
    .map((el) => {
      const raw = el.tags || {}
      const latVal = el.lat ?? el.center?.lat
      const lonVal = el.lon ?? el.center?.lon

      let type = 'area'
      if (raw.natural === 'peak' || raw.natural === 'hill' || raw.natural === 'mountain') {
        type = 'peak'
      }

      const name = raw.name || raw.natural === 'peak' ? 'Peak' : 'Unnamed area'
      const address = raw.description || raw.ele ? `Elevation: ${raw.ele}m` : ''

      return {
        id: `${el.type}/${el.id}`,
        name,
        address,
        lat: latVal,
        lng: lonVal,
        type,
      }
    })
}

export async function fetchNearbyTrails(lat, lng, radiusMeters = 5000) {
  const query = `
    [out:json][timeout:30];
    (
      way["highway"="path"](around:${radiusMeters},${lat},${lng});
      way["sac_scale"](around:${radiusMeters},${lat},${lng});
      way["highway"="track"](around:${radiusMeters},${lat},${lng});
    );
    out geom;
  `

  const data = await postOverpass(query)

  return (data.elements || [])
    .filter((el) => el.type === 'way' && Array.isArray(el.geometry))
    .map((el) => ({
      id: el.id,
      name: el.tags?.name || 'Unnamed trail',
      difficulty: el.tags?.sac_scale || null,
      path: el.geometry.map((pt) => ({ lat: pt.lat, lng: pt.lon })),
    }))
}
