const SEARCH_NEARBY_URL = 'https://places.googleapis.com/v1/places:searchNearby'

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.location',
  'places.formattedAddress',
  'places.rating',
  'places.googleMapsUri',
].join(',')

/**
 * Finds named hiking areas / parks near (lat, lng) using the Places API
 * (New) searchNearby endpoint. Needs VITE_GOOGLE_MAPS_API_KEY with the
 * "Places API (New)" enabled on the Google Cloud project, restricted to
 * your site's HTTP referrer.
 *
 * Returns: [{ id, name, address, rating, lat, lng, mapsUrl }]
 */
export async function fetchNearbyHikingAreas(lat, lng, radiusMeters = 15000) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  if (!apiKey) throw new Error('VITE_GOOGLE_MAPS_API_KEY is not set')

  const res = await fetch(SEARCH_NEARBY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes: ['hiking_area', 'national_park', 'state_park'],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: radiusMeters,
        },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Places search failed: ${res.status} ${body}`)
  }

  const data = await res.json()

  return (data.places || []).map((p) => ({
    id: p.id,
    name: p.displayName?.text || 'Unnamed area',
    address: p.formattedAddress || '',
    rating: p.rating || null,
    lat: p.location?.latitude,
    lng: p.location?.longitude,
    mapsUrl: p.googleMapsUri || null,
  }))
}
