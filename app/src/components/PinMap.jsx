import { useEffect, useRef, useState } from "react";
import { loadMapSdk } from "./lib/maptiler";

const same = (a, b) => a && b && Math.abs(a.lat - b.lat) < 1e-6 && Math.abs(a.lng - b.lng) < 1e-6;

export default function PinMap({ pin, onMove }) {
  const container = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const lastPin = useRef(pin);
  const onMoveRef = useRef(onMove);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    onMoveRef.current = onMove;
  });

  useEffect(() => {
    let cancelled = false;
    loadMapSdk()
      .then((sdk) => {
        if (cancelled || !container.current) return;
        const start = lastPin.current;
        const map = new sdk.Map({
          container: container.current,
          style: sdk.MapStyle.OUTDOOR,
          center: [start.lng, start.lat],
          zoom: 13,
          projection: "mercator",
          space: false,
          halo: false,
          navigationControl: "top-right",
          geolocateControl: false,
          terrainControl: false,
          cooperativeGestures: true,
          logSDKVersion: false,
        });
        const element = document.createElement("div");
        element.className = "pin-drop";
        element.setAttribute("aria-hidden", "true");
        const marker = new sdk.Marker({ element, draggable: true, anchor: "bottom-left", offset: [-3, 3] })
          .setLngLat([start.lng, start.lat])
          .addTo(map);
        marker.on("dragend", () => {
          const { lng, lat } = marker.getLngLat();
          lastPin.current = { lat, lng };
          onMoveRef.current({ lat, lng });
        });
        map.on("click", (e) => {
          const { lng, lat } = e.lngLat;
          marker.setLngLat([lng, lat]);
          lastPin.current = { lat, lng };
          onMoveRef.current({ lat, lng });
        });
        mapRef.current = map;
        markerRef.current = marker;
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!pin || same(pin, lastPin.current)) return;
    lastPin.current = pin;
    markerRef.current?.setLngLat([pin.lng, pin.lat]);
    mapRef.current?.easeTo({ center: [pin.lng, pin.lat], zoom: Math.max(mapRef.current.getZoom(), 12) });
  }, [pin]);

  return (
    <div className="relative h-56 overflow-hidden rounded-[16px] bg-mist">
      <div ref={container} className="h-full w-full" />
      {failed && (
        <p className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-granite">
          The map couldn't load. The pin and link below are still saved.
        </p>
      )}
    </div>
  );
}
