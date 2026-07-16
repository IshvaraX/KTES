const GEOAPIFY_KEY = 'e93b334561bc40de9330a05a2a13d372'
const GEOAPIFY_PLACES = 'https://api.geoapify.com/v2/places'

async function fetchPlaces(categories, lat, lng, radiusMeters = 10000) {
  const params = new URLSearchParams({
    categories,
    filter: `circle:${lng},${lat},${radiusMeters}`,
    limit: '50',
    apiKey: GEOAPIFY_KEY,
  })

  const res = await fetch(`${GEOAPIFY_PLACES}?${params}`)

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Geoapify error (${res.status}): ${text.slice(0, 200)}`)
  }

  return res.json()
}

export async function fetchNearbyHikingAreas(lat, lng, radiusMeters = 10000) {
  const results = []

  const queries = [
    { categories: 'natural', type: 'area' },
    { categories: 'leisure', type: 'area' },
    { categories: 'tourism', type: 'area' },
  ]

  for (const query of queries) {
    try {
      const data = await fetchPlaces(query.categories, lat, lng, radiusMeters)
      const features = data.features || []

      features.forEach((f) => {
        if (results.some((r) => r.id === f.properties.place_id)) return

        const props = f.properties || {}
        const coords = f.geometry?.coordinates || []
        const placeLat = coords[1]
        const placeLng = coords[0]

        if (!placeLat || !placeLng) return

        const raw = props.datasource?.raw || {}
        const categories = props.categories || []

        let name = props.name || 'Unnamed area'
        let address = props.formatted || ''
        let type = query.type

        if (raw.natural === 'peak' || raw.natural === 'hill' || raw.natural === 'mountain') {
          type = 'peak'
          if (!props.name && raw.name) {
            name = raw.name
          }
        }

        if (raw.natural === 'water') {
          name = props.name || 'Water body'
          type = 'area'
        }

        if (!address && raw['addr:full']) {
          address = raw['addr:full']
        }

        results.push({
          id: props.place_id,
          name,
          address,
          lat: placeLat,
          lng: placeLng,
          type,
          categories,
        })
      })
    } catch (err) {
      console.warn(`Geoapify fetch failed for ${query.categories}:`, err.message)
    }
  }

  return results
}

export async function fetchNearbyTrails(lat, lng, radiusMeters = 5000) {
  const params = new URLSearchParams({
    categories: 'natural,leisure,tourism',
    filter: `circle:${lng},${lat},${radiusMeters}`,
    limit: '50',
    apiKey: GEOAPIFY_KEY,
  })

  const res = await fetch(`${GEOAPIFY_PLACES}?${params}`)

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Geoapify error (${res.status}): ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  const features = data.features || []

  return features
    .filter((f) => f.geometry?.coordinates?.length >= 2)
    .map((f) => {
      const coords = f.geometry.coordinates
      const props = f.properties || {}

      return {
        id: props.place_id || `${coords[1]}-${coords[0]}`,
        name: props.name || 'Unnamed trail',
        difficulty: null,
        path: coords.map((c) => ({ lat: c[1], lng: c[0] })),
      }
    })
}
