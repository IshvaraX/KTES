import { useEffect, useRef, useState } from "react";
import { BANGALORE, loadMapSdk } from "./lib/maptiler";
import { attachSpotPicker } from "./lib/mapPick";

const RINGS_KM = [50, 100];

function ringFeature(km) {
  const pts = [];
  const latR = km / 110.574;
  const lngR = km / (111.32 * Math.cos((BANGALORE.lat * Math.PI) / 180));
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * 2 * Math.PI;
    pts.push([BANGALORE.lng + lngR * Math.cos(a), BANGALORE.lat + latR * Math.sin(a)]);
  }
  return { type: "Feature", properties: { km }, geometry: { type: "LineString", coordinates: pts } };
}

function labelSide(t, others) {
  const close = (o, dir) => o !== t && Math.abs(o.lat - t.lat) < 0.1 && dir * (o.lng - t.lng) > 0 && Math.abs(o.lng - t.lng) < 0.6;
  const east = others.some((o) => close(o, 1));
  const west = others.some((o) => close(o, -1));
  if (east && west) return "below";
  return east ? "left" : "right";
}

const PLACEMENT = {
  right: { anchor: "left", offset: [-11, 0] },
  left: { anchor: "right", offset: [11, 0] },
  below: { anchor: "top", offset: [0, -11] },
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function popupContent(trail, onPlan) {
  const root = el("div", "trail-popup");
  root.append(el("p", `trail-popup-name${trail.category === "waterfall" ? " is-fall" : ""}`, trail.name));
  root.append(el("p", "trail-popup-meta", `${trail.region}. ${trail.elevation}, ${trail.fromCityKm} km from Bangalore.`));
  const actions = el("div", "trail-popup-actions");
  const details = el("a", "trail-popup-link", "See details");
  details.href = `#trail-${trail.id}`;
  const plan = el("button", "trail-popup-plan", "Make a trek plan");
  plan.type = "button";
  plan.addEventListener("click", () => onPlan(trail));
  actions.append(details, plan);
  root.append(actions);
  return root;
}

export default function TrailMap({ allTrails, visibleIds, selectedId, onSelect, onPlan }) {
  const container = useRef(null);
  const mapRef = useRef(null);
  const sdkRef = useRef(null);
  const markers = useRef(new Map());
  const popup = useRef(null);
  const handlers = useRef({ onSelect, onPlan });
  const [state, setState] = useState("waiting");

  useEffect(() => {
    handlers.current = { onSelect, onPlan };
  });

  useEffect(() => {
    const node = container.current;
    if (!node) return;
    let cancelled = false;

    const start = async () => {
      setState("loading");
      try {
        const sdk = await loadMapSdk();
        if (cancelled) return;
        sdkRef.current = sdk;
        const bounds = new sdk.LngLatBounds();
        allTrails.forEach((t) => bounds.extend([t.lng, t.lat]));
        bounds.extend([BANGALORE.lng, BANGALORE.lat]);

        const map = new sdk.Map({
          container: node,
          style: sdk.MapStyle.LANDSCAPE,
          bounds,
          fitBoundsOptions: { padding: 56 },
          pitch: 45,
          projection: "mercator",
          space: false,
          halo: false,
          navigationControl: "top-right",
          geolocateControl: false,
          terrainControl: false,
          scaleControl: "bottom-right",
          cooperativeGestures: true,
          logSDKVersion: false,
        });
        mapRef.current = map;
        attachSpotPicker(map, sdk, () => handlers.current.onPlan);

        map.on("load", () => {
          map.addSource("rings", { type: "geojson", data: { type: "FeatureCollection", features: RINGS_KM.map(ringFeature) } });
          map.addLayer({
            id: "rings",
            type: "line",
            source: "rings",
            paint: { "line-color": "#173317", "line-width": 1.25, "line-opacity": 0.4, "line-dasharray": [2, 3] },
          });
          setState("ready");
        });

        RINGS_KM.forEach((km) => {
          const label = el("span", "ring-label", `${km} km`);
          new sdk.Marker({ element: label, anchor: "center" })
            .setLngLat([BANGALORE.lng + km / (111.32 * Math.cos((BANGALORE.lat * Math.PI) / 180)), BANGALORE.lat])
            .addTo(map);
        });

        const city = el("div", "city-pin");
        city.append(el("span", "city-pin-dot"), el("span", "city-pin-label", "Bangalore"));
        new sdk.Marker({ element: city, anchor: "left", offset: [-6, 0] }).setLngLat([BANGALORE.lng, BANGALORE.lat]).addTo(map);

        const points = [...allTrails, BANGALORE];
        allTrails.forEach((t) => {
          const side = labelSide(t, points);
          const btn = el("button", `trail-pin label-${side} ${t.category === "waterfall" ? "is-fall" : "is-hill"}`);
          btn.type = "button";
          btn.setAttribute("aria-label", `${t.name}, ${t.elevation}. Show details on map`);
          btn.append(el("span", "trail-pin-mark"), el("span", "trail-pin-label", t.name));
          btn.addEventListener("click", (e) => {
            e.stopPropagation();
            handlers.current.onSelect(t.id);
          });
          const marker = new sdk.Marker({ element: btn, ...PLACEMENT[side] }).setLngLat([t.lng, t.lat]).addTo(map);
          markers.current.set(t.id, marker);
        });
      } catch (err) {
        console.error(err);
        if (!cancelled) setState("error");
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(node);

    const registry = markers.current;
    return () => {
      cancelled = true;
      io.disconnect();
      popup.current?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
      registry.clear();
    };
  }, [allTrails]);

  useEffect(() => {
    markers.current.forEach((marker, id) => {
      marker.getElement().style.display = visibleIds.has(id) ? "" : "none";
    });
  }, [visibleIds, state]);

  useEffect(() => {
    const map = mapRef.current;
    const sdk = sdkRef.current;
    markers.current.forEach((marker, id) => marker.getElement().classList.toggle("is-selected", id === selectedId));
    const previous = popup.current;
    popup.current = null;
    previous?.remove();
    if (!map || !sdk || !selectedId) return;
    const trail = allTrails.find((t) => t.id === selectedId);
    if (!trail) return;

    const p = new sdk.Popup({ offset: 14, closeButton: true, maxWidth: "280px", className: "ktes-popup" })
      .setLngLat([trail.lng, trail.lat])
      .setDOMContent(popupContent(trail, (t) => handlers.current.onPlan(t)))
      .addTo(map);
    p.on("close", () => {
      if (popup.current === p) handlers.current.onSelect(null);
    });
    popup.current = p;
    if (!map.getBounds().contains([trail.lng, trail.lat])) map.easeTo({ center: [trail.lng, trail.lat] });
  }, [selectedId, allTrails, state]);

  return (
    <div className="relative h-[26rem] overflow-hidden rounded-[24px] bg-paper sm:h-[32rem]">
      <div ref={container} className="h-full w-full" />
      {state !== "ready" && (
        <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-granite" role="status">
          {state === "error" ? "The map couldn't load. The trail list below still works." : "Loading map…"}
        </p>
      )}
    </div>
  );
}
