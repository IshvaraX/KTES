import { useMemo, useState } from "react";
import { TRAILS, CATEGORY_LABEL } from "./lib/trails";

const TYPES = [
  { key: "all", label: "All" },
  { key: "trek", label: "Treks" },
  { key: "waterfall", label: "Waterfalls" },
  { key: "hidden-gem", label: "Hidden gems" },
];

const ENTRY = [
  { key: "all", label: "Any" },
  { key: "free", label: "Free" },
  { key: "paid", label: "Ticketed" },
];

function Segmented({ legend, options, value, onChange, counts }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm text-lichen">{legend}</legend>
      <div className="inline-flex flex-wrap gap-1 rounded-full bg-black/15 p-1">
        {options.map(({ key, label }) => {
          const active = value === key;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(key)}
              className={`rounded-full px-3.5 py-1.5 text-[0.9375rem] font-medium transition-colors ${
                active ? "bg-mist text-shola" : "text-mist/80 hover:text-mist"
              }`}
            >
              {label}
              {counts && <span className={active ? "ml-1.5 text-granite" : "ml-1.5 text-lichen/80"}>{counts[key]}</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function TrailRow({ trail, onPlan }) {
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
              ? "font-serif text-[2rem] leading-tight font-normal italic"
              : "display-sm text-[2.25rem]"
          }
        >
          {trail.name}
        </h3>
        <p className="mt-1 text-[0.9375rem] text-lichen">
          {trail.region}
          {trail.category !== "trek" && `, ${CATEGORY_LABEL[trail.category].toLowerCase()}`}
        </p>
        <p className="mt-4 max-w-[52ch] font-serif text-lg leading-[1.6] text-mist/90">{trail.note}</p>
      </div>

      <dl className="grid grid-cols-3 content-start gap-x-6 gap-y-5 text-[0.9375rem] lg:pt-2">
        <div>
          <dt className="text-lichen">Elevation</dt>
          <dd className="mt-0.5 text-xl font-semibold tabular-nums">{trail.elevation}</dd>
        </div>
        <div>
          <dt className="text-lichen">Distance</dt>
          <dd className="mt-0.5 text-xl font-semibold tabular-nums"><span className="text-[0.9375rem] font-normal text-lichen">about </span>{trail.distance.replace(/^~\s*/, "")}</dd>
        </div>
        <div>
          <dt className="text-lichen">Entry</dt>
          <dd className="mt-0.5 text-xl font-semibold">{trail.isFree ? "Free" : "Ticketed"}</dd>
        </div>
        <div className="col-span-3">
          <dt className="text-lichen">Getting there</dt>
          <dd className="mt-0.5 max-w-[48ch] leading-relaxed">
            <span className="font-semibold">{trail.level}.</span> {trail.access}
          </dd>
        </div>
      </dl>

      <div className="lg:pt-2">
        <button type="button" onClick={() => onPlan(trail)} className="btn btn-line-light">
          Plan a permit
          <span className="sr-only"> for {trail.name}</span>
        </button>
      </div>
    </li>
  );
}

export default function Trails({ onPlan }) {
  const [type, setType] = useState("all");
  const [entry, setEntry] = useState("all");

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

  return (
    <section id="trails" className="on-dark bg-shola pt-16 pb-24 text-mist sm:pt-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <h2 className="display max-w-[14ch] text-[clamp(2.75rem,5.5vw,4.25rem)]">Trails within a day's drive</h2>
            <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-lichen">
              From roadside forts to full morning climbs. Elevations are summit heights above sea level.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-4">
            <Segmented legend="Type" options={TYPES} value={type} onChange={setType} counts={typeCounts} />
            <Segmented legend="Entry" options={ENTRY} value={entry} onChange={setEntry} />
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {shown.length} trails shown
        </p>

        {shown.length > 0 ? (
          <ul className="mt-12 border-t border-mist/15">
            {shown.map((trail) => (
              <TrailRow key={trail.id} trail={trail} onPlan={onPlan} />
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
      </div>
    </section>
  );
}
