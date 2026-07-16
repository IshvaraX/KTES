import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TrekMap from '../components/TrekMap'
import { fetchNearbyHikingAreas, fetchNearbyTrails } from '../lib/overpass'

const FALLBACK_CENTER = { lat: 12.9716, lng: 77.5946 }

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
      () => {},
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
      if (areasResult.status === 'rejected') {
        setError(areasResult.reason?.message || 'Could not load trek data.')
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

  const peaks = hikingAreas.filter((a) => a.type === 'peak')
  const areas = hikingAreas.filter((a) => a.type !== 'peak')

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      <div className="flex-1 min-h-0 relative">
        <TrekMap
          center={center}
          hikingAreas={hikingAreas}
          trails={trails.slice(0, 50)}
          selectable={false}
        />
      </div>

      <div className="border-t border-gray-800 bg-gray-900/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="label-eyebrow">Nearby</p>
            <h1 className="font-display text-lg font-semibold text-gray-100">
              Treks near you
            </h1>
          </div>
          <div className="hidden items-center gap-6 text-xs text-gray-400 sm:flex">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-indigo-500"></span>
              {peaks.length} peaks
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500"></span>
              {areas.length} areas
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-1 rounded-full bg-blue-400"></span>
              {trails.length} trails
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
