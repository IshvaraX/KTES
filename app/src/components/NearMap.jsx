import { useEffect, useRef, useState } from "react";
import { loadMapSdk } from "./lib/maptiler";
import { attachSpotPicker } from "./lib/mapPick";

const KIND_CLASS = { hill: "is-hill", waterfall: "is-fall", river: "is-river", fort: "is-fort" };

function circle(center, km) {
  const pts = [];
  const latR = km / 110.574;
  const lngR = km / (111.32 * Math.cos((center.lat * Math.PI) / 180));
  for (let i = 0; i <= 96; i++) {
    const a = (i / 96) * 2 * Math.PI;
    pts.push([center.lng + lngR * Math.cos(a), center.lat + latR * Math.sin(a)]);
  }
  return { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: pts } };
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

const EMPTY = { type: "FeatureCollection", features: [] };

const PLACEMENT = {
  right: { anchor: "left", offset: [-11, 0] },
  left: { anchor: "right", offset: [11, 0] },
  below: { anchor: "top", offset: [0, -11] },
};

function screenSides(map, points) {
  const px = points.map((p) => map.project([p.lng, p.lat]));
  return px.map((a, i) => {
    const near = (dir) => px.some((b, j) => j !== i && Math.abs(b.y - a.y) < 24 && dir * (b.x - a.x) > 0 && Math.abs(b.x - a.x) < 190);
    const east = near(1);
    const west = near(-1);
    if (east && west) return "below";
    return east ? "left" : "right";
  });
}

export default function NearMap({ user, places, selected, radiusKm, onSelect, onPlan }) {
  const container = useRef(null);
  const mapRef = useRef(null);
  const sdkRef = useRef(null);
  const markers = useRef(new Map());
  const stationMarker = useRef(null);
  const onSelectRef = useRef(onSelect);
  const onPlanRef = useRef(onPlan);
  const [ready, setReady] = useState(false);

  const placesRef = useRef(places);
  const radiusRef = useRef(radiusKm);
  const placeKeys = places.map((p) => p.key).join("|");

  useEffect(() => {
    onSelectRef.current = onSelect;
    onPlanRef.current = onPlan;
    placesRef.current = places;
    radiusRef.current = radiusKm;
  });

  useEffect(() => {
    let cancelled = false;
    loadMapSdk().then((sdk) => {
      if (cancelled || !container.current) return;
      sdkRef.current = sdk;
      const map = new sdk.Map({
        container: container.current,
        style: sdk.MapStyle.LANDSCAPE,
        center: [user.lng, user.lat],
        zoom: 8,
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
      attachSpotPicker(map, sdk, () => onPlanRef.current);
      map.on("load", () => {
        map.addSource("radius", { type: "geojson", data: circle(user, radiusRef.current) });
        map.addLayer({
          id: "radius",
          type: "line",
          source: "radius",
          paint: { "line-color": "#173317", "line-width": 1.25, "line-opacity": 0.4, "line-dasharray": [2, 3] },
        });
        map.addSource("to-station", { type: "geojson", data: EMPTY });
        map.addLayer({
          id: "to-station",
          type: "line",
          source: "to-station",
          paint: { "line-color": "#c94fd0", "line-width": 3, "line-dasharray": [1, 1.5] },
        });
        setReady(true);
      });

      const me = el("div", "you-pin");
      me.append(el("span", "you-pin-dot"), el("span", "you-pin-label", "You"));
      new sdk.Marker({ element: me, anchor: "left", offset: [-8, 0] }).setLngLat([user.lng, user.lat]).addTo(map);
      mapRef.current = map;
    });
    const registry = markers.current;
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      registry.clear();
    };
  }, [user]);

  useEffect(() => {
    if (ready) mapRef.current?.getSource("radius")?.setData(circle(user, radiusKm));
  }, [radiusKm, ready, user]);

  useEffect(() => {
    const map = mapRef.current;
    const sdk = sdkRef.current;
    if (!map || !sdk || !ready) return;
    markers.current.forEach((m) => m.remove());
    markers.current.clear();
    const list = placesRef.current;
    const bounds = new sdk.LngLatBounds([user.lng, user.lat], [user.lng, user.lat]);
    list.forEach((p) => bounds.extend([p.lng, p.lat]));
    if (list.length) map.fitBounds(bounds, { padding: 70, maxZoom: 11, duration: 0 });
    const sides = screenSides(map, [...list, user]);
    list.forEach((p, i) => {
      const side = sides[i];
      const btn = el("button", `trail-pin label-${side} ${KIND_CLASS[p.kind]}`);
      btn.type = "button";
      btn.setAttribute("aria-label", `${p.name}. Select on map`);
      btn.append(el("span", "trail-pin-mark"), el("span", "trail-pin-label", p.name.replace(/\s*\(.*?\)\s*/g, " ").trim()));
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectRef.current(p.key);
      });
      markers.current.set(p.key, new sdk.Marker({ element: btn, ...PLACEMENT[side] }).setLngLat([p.lng, p.lat]).addTo(map));
    });
  }, [placeKeys, ready, user]);

  useEffect(() => {
    const map = mapRef.current;
    const sdk = sdkRef.current;
    if (!map || !sdk || !ready) return;
    markers.current.forEach((m, key) => m.getElement().classList.toggle("is-selected", key === selected?.key));
    stationMarker.current?.remove();
    stationMarker.current = null;
    const line = map.getSource("to-station");
    const st = selected?.station;
    if (!selected || !st) {
      line?.setData(EMPTY);
      return;
    }
    line?.setData({
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: [[selected.lng, selected.lat], [st.lng, st.lat]] },
    });
    const away = "below";
    const node = el("div", `station-pin label-${away}`);
    node.append(el("span", "station-pin-mark"), el("span", "station-pin-label", st.name));
    stationMarker.current = new sdk.Marker({ element: node, ...PLACEMENT[away] }).setLngLat([st.lng, st.lat]).addTo(map);
    const b = new sdk.LngLatBounds([selected.lng, selected.lat], [selected.lng, selected.lat]).extend([st.lng, st.lat]);
    const view = map.getBounds();
    if (!view.contains(b.getSouthWest()) || !view.contains(b.getNorthEast())) map.fitBounds(b, { padding: 90, maxZoom: 11 });
  }, [selected, ready]);

  return (
    <div className="relative h-[26rem] overflow-hidden rounded-[24px] bg-paper sm:h-[32rem]">
      <div ref={container} className="h-full w-full" />
    </div>
  );
}
