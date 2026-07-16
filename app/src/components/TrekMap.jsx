import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api'
import { useCallback } from 'react'

const containerStyle = { width: '100%', height: '100%' }

const mapOptions = {
  disableDefaultUI: false,
  clickableIcons: false,
  styles: [
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  ],
}

export default function TrekMap({
  center,
  hikingAreas = [],
  trails = [],
  selectable = false,
  selectedLocation,
  onAreaClick,
  onMapClick,
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  })

  const handleClick = useCallback(
    (e) => {
      if (!selectable || !onMapClick) return
      onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() })
    },
    [selectable, onMapClick],
  )

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-light bg-paper p-8 text-center text-sm text-slate">
        Set VITE_GOOGLE_MAPS_API_KEY in .env to load the map. See README.md.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate">
        Loading map…
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={mapOptions}
      onClick={handleClick}
    >
      {hikingAreas.map((area) => (
        <Marker
          key={area.id}
          position={{ lat: area.lat, lng: area.lng }}
          title={area.name}
          onClick={() => onAreaClick?.(area)}
        />
      ))}

      {trails.map((trail) => (
        <Polyline
          key={trail.id}
          path={trail.path}
          options={{ strokeColor: '#2F5233', strokeWeight: 3, strokeOpacity: 0.8 }}
        />
      ))}

      {selectedLocation && (
        <Marker
          position={selectedLocation}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#B8792E',
            fillOpacity: 1,
            strokeColor: '#FBFAF4',
            strokeWeight: 2,
          }}
        />
      )}
    </GoogleMap>
  )
}
