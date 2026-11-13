import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import { TRAILS, CATEGORY_LABEL } from "./lib/trails";
import { hasMapKey } from "./lib/maptiler";
import { NEAR_MAX_KM } from "./lib/nearby";
import TrailMap from "./TrailMap";
import NearMap from "./NearMap";
import NearList from "./NearList";
import useNearby from "./useNearby";

const TYPES = [
  { key: "all", label: "All" },
  { key: "trek", label: "Treks" },
  { key: "waterfall", label: "Waterfalls" },
  { key: "hidden-gem", label: "Hidden gems" },
];

const NEAR_TYPES = [
  { key: "all", label: "All" },
  { key: "hill", label: "Hills" },
  { key: "waterfall", label: "Waterfalls" },
  { key: "river", label: "Rivers" },
  { key: "fort", label: "Forts" },
];

const MODES = [
  { key: "bangalore", label: "Around Bangalore" },
  { key: "near", label: "Near me" },
];

// Sliding two-way switch between the curated list and the user's surroundings
function ModeSwitch({ mode, onChange }) {
  const refs = useRef({});
  function onKeyDown(e) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const next = mode === "near" ? "bangalore" : "near";
    onChange(next);
    refs.current[next]?.focus();
  }
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <div
        role="radiogroup"
        aria-label="Which trails to show"
        onKeyDown={onKeyDown}
        className="relative inline-grid grid-cols-2 rounded-full bg-shola-2 p-1"
      >
        <span
          aria-hidden="true"
          className={`mode-thumb absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-glow ${mode === "near" ? "translate-x-full" : ""}`}
        />
        {MODES.map(({ key, label }) => {
          const active = mode === key;
          return (
            <button
              key={key}
              ref={(n) => (refs.current[key] = n)}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(key)}
              className={`relative z-10 rounded-full px-5 py-2 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors ${
                active ? "text-pine" : "text-mist/80 hover:text-mist"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      {mode === "bangalore" && (
        <p className="text-[0.9375rem] text-lichen">Not around Bangalore? Slide to Near me for treks close to you.</p>
      )}
    </div>
  );
}

const ENTRY = [
  { key: "all", label: "Any" },
  { key: "free", label: "Free" },
  { key: "paid", label: "Ticketed" },
];

function Segmented({ legend, options, value, onChange, counts }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm text-lichen">{legend}</legend>
      <div className="inline-flex flex-wrap gap-1 rounded-full bg-shola-2 p-1">
        {options.map(({ key, label }) => {
          const active = value === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(key)}
              className={`rounded-full px-3.5 py-1.5 text-[0.9375rem] font-medium transition-colors ${
                active ? "bg-glow text-pine" : "text-mist/80 hover:text-mist"
              }`}
            >
              {label}
              {counts && <span className={active ? "ml-1.5 text-pine/70" : "ml-1.5 text-lichen/80"}>{counts[key]}</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function TrailRow({ trail, onPlan, onShowOnMap }) {
  const isFall = trail.category === "waterfall";
  return (
    <li
      id={`trail-${trail.id}`}
      className="trail-row grid scroll-mt-24 gap-x-10 gap-y-5 border-b border-mist/15 py-8 transition-colors lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_auto]"
    >
      <div>
        <h3
          className={
            isFall
              ? "font-serif text-[2rem] leading-tight font-normal text-water italic"
              : "display-sm text-[2.25rem]"
          }
        >
          {trail.name}
        </h3>
        <p className="mt-1 text-[0.9375rem] text-lichen">
          {trail.region}
          {trail.category !== "trek" && `, ${CATEGORY_LABEL[trail.category].toLowerCase()}`}. About{" "}
          {trail.distance.replace(/^~\s*/, "")} on foot.
        </p>
        <p className="mt-4 max-w-[52ch] font-serif text-lg leading-[1.6] text-mist/90">{trail.note}</p>
      </div>

      <div className="lg:pt-2">
        <dl className="grid grid-cols-3 gap-x-6 text-[0.9375rem]">
          <div>
            <dt className="text-lichen">{isFall ? "Elevation" : "Summit"}</dt>
            <dd className="mt-0.5 text-xl font-semibold tabular-nums">{trail.elevation}</dd>
          </div>
          <div>
            <dt className="text-lichen">From city</dt>
            <dd className="mt-0.5 text-xl font-semibold tabular-nums">{trail.fromCityKm} km</dd>
          </div>
          <div>
            <dt className="text-lichen">Entry</dt>
            <dd className="mt-0.5 text-xl font-semibold">{trail.isFree ? "Free" : "Ticketed"}</dd>
          </div>
        </dl>
        <details className="group mt-5 text-[0.9375rem]">
          <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-full text-lichen hover:text-mist [&::-webkit-details-marker]:hidden">
            <svg viewBox="0 0 12 12" className="h-3 w-3 transition-transform group-open:rotate-90" aria-hidden="true">
              <path d="M4 2l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            How to get there
          </summary>
          <p className="mt-2 max-w-[48ch] leading-relaxed">
            <span className="font-semibold">{trail.level}.</span> {trail.access}
          </p>
        </details>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:flex-col lg:items-end lg:pt-2">
        <button type="button" onClick={() => onPlan(trail)} className="btn btn-line-light">
          Make a trek plan
          <span className="sr-only"> for {trail.name}</span>
        </button>
        {onShowOnMap && (
          <button
            type="button"
            onClick={() => onShowOnMap(trail.id)}
            className="text-[0.9375rem] text-lichen underline underline-offset-4 hover:text-mist"
          >
            Show on map
            <span className="sr-only"> ({trail.name})</span>
          </button>
        )}
      </div>
    </li>
  );
}

export default forwardRef(function Trails({ onPlan }, ref) {
  const [mode, setMode] = useState("bangalore");
  const [type, setType] = useState("all");
  const [entry, setEntry] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [radius, setRadius] = useState(40);
  const [nearType, setNearType] = useState("all");
  const [nearSelected, setNearSelected] = useState(null);
  const section = useRef(null);
  const nearby = useNearby();

  const typeCounts = useMemo(
    () => Object.fromEntries(TYPES.map(({ key }) => [key, key === "all" ? TRAILS.length : TRAILS.filter((t) => t.category === key).length])),
    []
  );

  const shown = useMemo(
    () =>
      TRAILS.filter(
        (t) => (type === "all" || t.category === type) && (entry === "all" || (entry === "free" ? t.isFree : !t.isFree))
      ),
    [type, entry]
  );
  const visibleIds = useMemo(() => new Set(shown.map((t) => t.id)), [shown]);

  const inRadius = useMemo(() => nearby.places.filter((p) => p.km <= radius), [nearby.places, radius]);
  const nearCounts = useMemo(
    () => Object.fromEntries(NEAR_TYPES.map(({ key }) => [key, inRadius.filter((p) => key === "all" || p.kind === key).length])),
    [inRadius]
  );
  const nearShown = useMemo(
    () =>
      inRadius
        .filter((p) => nearType === "all" || p.kind === nearType)
        .map((p) => ({ ...p, station: nearby.stations[p.key] })),
    [inRadius, nearType, nearby.stations]
  );
  const nearActive = nearShown.find((p) => p.key === nearSelected) || nearShown[0] || null;

  function switchMode(next) {
    setMode(next);
    if (next === "near" && (nearby.phase === "idle" || nearby.phase === "denied" || nearby.phase === "unavailable")) {
      nearby.start(radius);
    }
  }

  function changeRadius(km) {
    setRadius(km);
    nearby.lookupStations(nearby.places.filter((p) => p.km <= km));
  }

  useImperativeHandle(ref, () => ({
    showNearMe() {
      section.current?.scrollIntoView({ block: "start" });
      switchMode("near");
    },
  }));

  function showOnMap(id) {
    setSelectedId(id);
    document.getElementById("trail-map")?.scrollIntoView({ block: "center" });
  }

  const near = mode === "near";
  const busy = nearby.phase === "asking" || nearby.phase === "searching";
  const lookedUp = nearShown.filter((p) => p.station !== undefined).length;
  const nearMessage = {
    asking: "Waiting for you to allow location in the browser prompt…",
    searching: "Looking for hills, forts and waterfalls around you…",
    denied: "Location access is blocked for this site. Allow it in your browser's site settings, then try again.",
    unavailable: "Your location couldn't be found. Check that location services are on, then try again.",
    unsupported: "This browser can't share its location. Switch back to see the trails around Bangalore.",
    failed: "The map data couldn't be loaded. Check your connection and try again.",
    empty: `No named hills, forts or waterfalls turned up within ${NEAR_MAX_KM} km of you. Map data is thin in some areas.`,
  }[nearby.phase];

  return (
    <section id="trails" ref={section} className="on-dark scroll-mt-16 bg-shola pt-16 pb-24 text-mist sm:pt-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {hasMapKey && <ModeSwitch mode={mode} onChange={switchMode} />}

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <h2 className={`display ${near ? "max-w-[18ch]" : "max-w-[14ch]"} text-[clamp(2.75rem,5.5vw,4.25rem)]`}>
              {near ? "Treks and waterfalls near you" : "Trails within a day's drive"}
            </h2>
            <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-lichen">
              {near
                ? "Hills, waterfalls, rivers and forts around you, with the nearest railway station for each. KTES doesn't store your location."
                : "From roadside forts to full morning climbs. Elevations are summit heights above sea level."}
            </p>
          </div>
          {near ? (
            <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
              <Segmented legend="Type" options={NEAR_TYPES} value={nearType} onChange={setNearType} counts={nearCounts} />
              <div className="min-w-[14rem]">
                <label htmlFor="near-radius" className="mb-2 flex justify-between text-sm text-lichen">
                  <span>Distance</span>
                  <output htmlFor="near-radius" className="font-semibold text-mist tabular-nums">
                    Within {radius} km
                  </output>
                </label>
                <input
                  id="near-radius"
                  type="range"
                  min={10}
                  max={NEAR_MAX_KM}
                  step={5}
                  value={radius}
                  onChange={(e) => changeRadius(Number(e.target.value))}
                  aria-valuetext={`Within ${radius} kilometres`}
                  className="h-2 w-full cursor-pointer accent-glow"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-x-6 gap-y-4">
              <Segmented legend="Type" options={TYPES} value={type} onChange={setType} counts={typeCounts} />
              <Segmented legend="Entry" options={ENTRY} value={entry} onChange={setEntry} />
            </div>
          )}
        </div>

        {near ? (
          <>
            <div role="status" aria-live="polite" className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-[0.9375rem]">
              <p className="max-w-[62ch] leading-relaxed">
                {nearMessage ||
                  (nearShown.length
                    ? lookedUp < nearShown.length
                      ? `${nearShown.length} places within ${radius} km. Finding railway stations, ${lookedUp} of ${nearShown.length} done.`
                      : `${nearShown.length} places within ${radius} km, closest first.`
                    : `Nothing within ${radius} km. Slide the distance further.`)}
              </p>
              {!busy && nearby.phase !== "results" && nearby.phase !== "unsupported" && (
                <button type="button" onClick={() => nearby.start(radius)} className="btn btn-action">
                  Try again
                </button>
              )}
            </div>

            {nearby.phase === "results" && nearby.user && (
              <>
                <figure className="mt-8">
                  <NearMap
                    user={nearby.user}
                    places={nearShown}
                    selected={nearActive}
                    radiusKm={radius}
                    onSelect={setNearSelected}
                    onPlan={onPlan}
                  />
                  <figcaption className="mt-3 text-sm text-lichen">
                    Blue waves are rivers. You're the pink dot, and the pink dashes lead to the nearest station.
                  </figcaption>
                </figure>
                {nearShown.length > 0 && (
                  <div className="mt-12">
                    <NearList
                      places={nearShown}
                      user={nearby.user}
                      selectedKey={nearActive?.key}
                      onSelect={setNearSelected}
                      onPlan={onPlan}
                    />
                    <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-lichen">
                      Places not on the KTES list come from OpenStreetMap data through MapTiler. Check access, timings and any
                      permit rules before you go.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {hasMapKey && (
              <figure id="trail-map" className="mt-12 scroll-mt-24">
                <TrailMap
                  allTrails={TRAILS}
                  visibleIds={visibleIds}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onPlan={onPlan}
                />
                <figcaption className="mt-3 text-sm text-lichen">
                  Green triangles are hills, blue circles are waterfalls. Tap any spot to make a trek plan there.
                </figcaption>
              </figure>
            )}

            <p className="sr-only" aria-live="polite">
              {shown.length} trails shown
            </p>

            {shown.length > 0 ? (
              <ul className="mt-12 border-t border-mist/15">
                {shown.map((trail) => (
                  <TrailRow key={trail.id} trail={trail} onPlan={onPlan} onShowOnMap={hasMapKey ? showOnMap : null} />
                ))}
              </ul>
            ) : (
              <div className="mt-12 border-t border-mist/15 pt-12">
                <p className="text-xl">No trails match both filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setType("all");
                    setEntry("all");
                  }}
                  className="btn btn-line-light mt-5"
                >
                  Show all trails
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
});
