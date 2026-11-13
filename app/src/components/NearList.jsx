
const KIND_LABEL = { hill: "Hill", waterfall: "Waterfall", river: "River, closest point", fort: "Fort" };
const fmtKm = (km) => (km < 10 ? km.toFixed(1) : Math.round(km).toString());

function asPlanTrail(place) {
  if (place.trail) return place.trail;
  return {
    id: place.key,
    name: place.name,
    lat: place.lat,
    lng: place.lng,
    category: place.kind === "waterfall" ? "waterfall" : "trek",
  };
}

const gmapsDir = (from, to) =>
  `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}`;

function PlaceRow({ place, user, active, onSelect, onPlan }) {
  const st = place.station;
  const isWater = place.kind === "waterfall" || place.kind === "river";
  return (
    <li className={`grid gap-x-10 gap-y-4 border-b border-mist/15 py-7 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_auto] ${active ? "near-row-active" : ""}`}>
      <div>
        <h3 className={isWater ? "font-serif text-[2rem] leading-tight text-water italic" : "display-sm text-[2.25rem]"}>
          <button type="button" onClick={() => onSelect(place.key)} className="text-left hover:underline hover:underline-offset-4">
            {place.name}
          </button>
        </h3>
        <p className="mt-1 text-[0.9375rem] text-lichen">
          {KIND_LABEL[place.kind]}
          {place.ele ? `, ${place.ele.toLocaleString("en-IN")} m` : ""}.{" "}
          {place.trail ? "On the KTES list." : "From map data, not checked by KTES."}
        </p>
      </div>

      <dl className="grid grid-cols-2 content-start gap-x-6 gap-y-4 text-[0.9375rem] lg:pt-2">
        <div>
          <dt className="text-lichen">From you</dt>
          <dd className="mt-0.5 text-xl font-semibold tabular-nums">{fmtKm(place.km)} km</dd>
        </div>
        <div>
          <dt className="text-lichen">From station</dt>
          <dd className="mt-0.5 text-xl font-semibold tabular-nums">{st ? `${fmtKm(st.km)} km` : "–"}</dd>
        </div>
        <div className="col-span-full">
          <dt className="text-lichen">Nearest railway station</dt>
          <dd className="mt-0.5 leading-relaxed">
            {st === undefined && <span className="text-lichen">Looking it up…</span>}
            {st === null && "None within 50 km in the map data."}
            {st && (
              <a href={gmapsDir(st, place)} target="_blank" rel="noreferrer" className="font-semibold underline underline-offset-2">
                {st.name}
                <span className="sr-only">, route to {place.name}</span>
              </a>
            )}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:flex-col lg:items-end lg:pt-2">
        <button type="button" onClick={() => onPlan(asPlanTrail(place))} className="btn btn-line-light">
          Make a trek plan
          <span className="sr-only"> for {place.name}</span>
        </button>
        <a href={gmapsDir(user, place)} target="_blank" rel="noreferrer" className="text-[0.9375rem] text-lichen underline underline-offset-4 hover:text-mist">
          Directions from you
        </a>
      </div>
    </li>
  );
}

export default function NearList({ places, user, selectedKey, onSelect, onPlan }) {
  return (
    <ul className="border-t border-mist/15">
      {places.map((p) => (
        <PlaceRow key={p.key} place={p} user={user} active={p.key === selectedKey} onSelect={onSelect} onPlan={onPlan} />
      ))}
    </ul>
  );
}
