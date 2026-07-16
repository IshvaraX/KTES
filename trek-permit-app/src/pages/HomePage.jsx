import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TrekMap from '../components/TrekMap'
import { fetchNearbyHikingAreas } from '../lib/googlePlaces'
import { fetchNearbyTrails } from '../lib/overpass'

const FALLBACK_CENTER = { lat: 12.9716, lng: 77.5946 } // Bengaluru — overridden by geolocation

export default function HomePage() {
  const navigate = useNavigate()
  const [center, setCenter] = useState(FALLBACK_CENTER)
  const [hikingAreas, setHikingAreas] = useState([])
  const [trails, setTrails] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {}, // keep fallback center if permission denied
      { timeout: 8000 },
    )
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.allSettled([
      fetchNearbyHikingAreas(center.lat, center.lng),
      fetchNearbyTrails(center.lat, center.lng),
    ]).then(([areasResult, trailsResult]) => {
      if (cancelled) return
      if (areasResult.status === 'fulfilled') setHikingAreas(areasResult.value)
      if (trailsResult.status === 'fulfilled') setTrails(trailsResult.value)
      if (areasResult.status === 'rejected' && trailsResult.status === 'rejected') {
        setError('Could not load trek data. Check your API keys in .env.')
      }
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [center])

  function startPermitFor(area) {
    navigate('/new-permit', {
      state: {
        trekName: area.name,
        location: { lat: area.lat, lng: area.lng, label: area.address },
      },
    })
  }

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-[1fr_360px]">
      <div className="h-[520px] overflow-hidden rounded-2xl border border-slate-light/40">
        <TrekMap center={center} hikingAreas={hikingAreas} trails={trails} />
      </div>

      <div>
        <p className="label-eyebrow">Nearby</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-moss-dark">Treks near you</h1>
        <p className="mt-2 text-sm text-slate">
          Named areas from Google Places, trail lines from OpenStreetMap.
        </p>

        {loading && <p className="mt-6 text-sm text-slate">Looking around…</p>}
        {error && <p className="mt-6 text-sm text-ochre-dark">{error}</p>}

        <ul className="mt-6 flex flex-col gap-3">
          {hikingAreas.map((area) => (
            <li key={area.id} className="rounded-xl border border-slate-light/40 bg-paper p-4">
              <p className="font-medium">{area.name}</p>
              {area.address && <p className="mt-0.5 text-xs text-slate">{area.address}</p>}
              <button
                onClick={() => startPermitFor(area)}
                className="mt-3 rounded-full bg-moss px-3 py-1.5 text-xs font-medium text-paper hover:bg-moss-light"
              >
                Create safety card
              </button>
            </li>
          ))}
          {!loading && hikingAreas.length === 0 && !error && (
            <li className="text-sm text-slate">No named hiking areas found in this radius yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
