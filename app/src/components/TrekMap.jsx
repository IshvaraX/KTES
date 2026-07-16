import { useEffect, useRef } from 'react'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const peakIcon = L.divIcon({
  className: 'peak-marker',
  html: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 20H22L12 2Z" fill="#6366F1" stroke="#1F2937" stroke-width="2" stroke-linejoin="round"/>
    <path d="M12 8L7 18H17L12 8Z" fill="#818CF8" stroke="#1F2937" stroke-width="1.5" stroke-linejoin="round"/>
  </svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
})

const areaIcon = L.divIcon({
  className: 'area-marker',
  html: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#1F2937" stroke-width="2"/>
    <circle cx="12" cy="12" r="3" fill="#F9FAFB"/>
  </svg>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
})

const selectedIcon = L.divIcon({
  className: 'selected-location-marker',
  html: `<div style="width:20px;height:20px;background:#6366F1;border:3px solid #F9FAFB;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

export default function TrekMap({
  center,
  hikingAreas = [],
  trails = [],
  selectable = false,
  selectedLocation,
  onAreaClick,
  onMapClick,
}) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const polylineRef = useRef(null)
  const selectedMarkerRef = useRef(null)
  const onAreaClickRef = useRef(onAreaClick)
  const onMapClickRef = useRef(onMapClick)
  const selectableRef = useRef(selectable)

  onAreaClickRef.current = onAreaClick
  onMapClickRef.current = onMapClick
  selectableRef.current = selectable

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [center.lat, center.lng],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    map.on('click', (e) => {
      if (selectableRef.current && onMapClickRef.current) {
        onMapClickRef.current({ lat: e.latlng.lat, lng: e.latlng.lng })
      }
    })

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    map.flyTo([center.lat, center.lng], 13, { duration: 1.5 })
  }, [center.lat, center.lng])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    hikingAreas.forEach((area) => {
      const icon = area.type === 'peak' ? peakIcon : areaIcon
      const marker = L.marker([area.lat, area.lng], { icon })
        .addTo(map)
        .bindPopup(
          `<div style="font-weight:600;color:#111827">${area.name}</div>` +
          (area.address ? `<div style="color:#6B7280;font-size:12px;margin-top:4px">${area.address}</div>` : '') +
          `<div style="color:#9CA3AF;font-size:12px;margin-top:4px;text-transform:capitalize">${area.type}</div>`,
        )
      if (onAreaClickRef.current) {
        marker.on('click', () => onAreaClickRef.current(area))
      }
      markersRef.current.push(marker)
    })
  }, [hikingAreas])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (polylineRef.current) {
      polylineRef.current.remove()
      polylineRef.current = null
    }

    if (trails.length > 0) {
      const path = trails.flatMap((t) => t.path.map((pt) => [pt.lat, pt.lng]))
      polylineRef.current = L.polyline(path, { color: '#3B82F6', weight: 3, opacity: 0.7 }).addTo(map)
    }
  }, [trails])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.remove()
      selectedMarkerRef.current = null
    }

    if (selectedLocation) {
      selectedMarkerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng], { icon: selectedIcon }).addTo(map)
    }
  }, [selectedLocation])

  return <div ref={mapRef} className="h-full w-full" style={{ minHeight: '400px', background: '#e5e7eb' }} />
}
