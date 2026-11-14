const NAMED_LAYERS = /peak|landform|outdoor_poi|poi_|mountain|water/;

function nameAt(map, point) {
  const box = [
    [point.x - 10, point.y - 10],
    [point.x + 10, point.y + 10],
  ];
  const hits = map.queryRenderedFeatures(box).filter((f) => {
    const p = f.properties || {};
    return (p["name:en"] || p.name) && NAMED_LAYERS.test(f.sourceLayer || "") && f.geometry?.type === "Point";
  });
  const peak = hits.find((f) => /peak|landform/.test(f.sourceLayer)) || hits[0];
  if (!peak) return null;
  const p = peak.properties;
  const [lng, lat] = peak.geometry.coordinates;
  return {
    name: p["name:en"] || p.name,
    lat,
    lng,
    category: p.class === "waterfall" || /water/.test(peak.sourceLayer) ? "waterfall" : "trek",
  };
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

export function attachSpotPicker(map, sdk, getOnPlan) {
  let popup = null;
  const onClick = (e) => {
    if (e.originalEvent?.target?.closest?.(".maplibregl-marker, .maplibregl-popup")) return;
    const named = nameAt(map, e.point);
    const spot = named || { name: "", lat: e.lngLat.lat, lng: e.lngLat.lng, category: "trek" };
    const root = el("div", "trail-popup");
    root.append(el("p", "trail-popup-name", spot.name || "Pinned spot"));
    root.append(el("p", "trail-popup-meta", `${spot.lat.toFixed(4)}, ${spot.lng.toFixed(4)}`));
    const actions = el("div", "trail-popup-actions");
    const plan = el("button", "trail-popup-plan", "Make a trek plan here");
    plan.type = "button";
    plan.addEventListener("click", () => {
      popup?.remove();
      getOnPlan()({ id: `spot-${spot.lat.toFixed(5)},${spot.lng.toFixed(5)}`, ...spot });
    });
    actions.append(plan);
    root.append(actions);
    popup?.remove();
    popup = new sdk.Popup({ offset: 10, maxWidth: "260px", className: "ktes-popup" })
      .setLngLat([spot.lng, spot.lat])
      .setDOMContent(root)
      .addTo(map);
  };
  map.on("click", onClick);
  return () => {
    map.off("click", onClick);
    popup?.remove();
  };
}
