import { useState, useMemo } from "react";
import trailsData from "./trails.json";

const TOKENS = {
  pine: "#2a513f",
  sprout: "#cef79f",
  leaf: "#83ba36",
  teal: "#378e8e",
  mint: "#70e0bb",
};

const LEVELS = { "Very Easy": 1, Easy: 2, Moderate: 3 };

function DifficultyPips({ accessibility }) {
  const label = Object.keys(LEVELS).find((k) => accessibility.startsWith(k)) || "Easy";
  const level = LEVELS[label];
  return (
    <span className="inline-flex items-center gap-1">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className="h-2 w-2 rounded-full border border-[#2a513f]"
          style={{ backgroundColor: n <= level? TOKENS.pine : "transparent" }}
        />
      ))}
    </span>
  );
}

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "trek", label: "Trek" },
  { key: "waterfall", label: "Waterfall" },
  { key: "hidden-gem", label: "Hidden Gem" },
];

const COST_FILTERS = [
  { key: "all", label: "Free + Paid" },
  { key: "free", label: "Free" },
  { key: "paid", label: "Paid" },
];

export default function Trails() {
  const [category, setCategory] = useState("all");
  const [cost, setCost] = useState("all");

  const filteredTrails = useMemo(() => {
    return trailsData.filter((t) => {
      const matchCategory = category === "all" || t.category === category;
      const matchCost = cost === "all" || (cost === "free"? t.isFree :!t.isFree);
      return matchCategory && matchCost;
    });
  }, [category, cost]);

  return (
    <section id="trails" className="relative py-24" style={{ backgroundColor: TOKENS.pine }}>
      <div className="absolute top-0 left-0 w-full h-8 bg-[#cef79f] border-b-4 border-[#2a513f]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 inline-block border-2 border-[#70e0bb] bg-[#2a513f] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#70e0bb]">
            Around Bangalore • {trailsData.length} Trails
          </p>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight text-[#cef79f]">
            Bettas &amp; Fort Treks
          </h2>
        </div>

        {/* FILTERS */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map(({ key, label }) => {
              const active = category === key;
              const count = key === "all"? trailsData.length : trailsData.filter(t => t.category === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className="border-4 px-4 py-2 text-xs font-black uppercase tracking-wider transition"
                  style={{
                    borderColor: active? TOKENS.mint : TOKENS.sprout,
                    backgroundColor: active? TOKENS.mint : "transparent",
                    color: active? TOKENS.pine : TOKENS.sprout,
                    boxShadow: `4px 4px 0px 0px ${active? TOKENS.sprout : TOKENS.mint}`,
                  }}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {COST_FILTERS.map(({ key, label }) => {
              const active = cost === key;
              return (
                <button
                  key={key}
                  onClick={() => setCost(key)}
                  className="border-2 px-3 py-1.5 text- font-bold uppercase tracking-wider transition"
                  style={{
                    borderColor: TOKENS.leaf,
                    backgroundColor: active? TOKENS.leaf : "transparent",
                    color: active? TOKENS.pine : TOKENS.leaf,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {filteredTrails.map((trail, index) => (
            <article
              key={trail.id}
              className="group flex flex-col justify-between border-4 p-6 transition-all hover:-translate-y-1 hover:shadow-[8px_10px_0px_0px_#70e0bb]"
              style={{
                borderColor: TOKENS.pine,
                backgroundColor: TOKENS.sprout,
                boxShadow: `6px 6px 0px 0px ${TOKENS.pine}`,
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="inline-block bg-[#378e8e] border-2 border-[#2a513f] px-2 py-0.5 text- font-black uppercase text-white">
                      {trail.region}
                    </p>
                    <p className="inline-block bg-white border-2 border-[#2a513f] px-2 py-0.5 text- font-black uppercase text-[#2a513f]">
                      {trail.category.replace("-", " ")}
                    </p>
                  </div>
                  <span
                    className="shrink-0 border-2 border-[#2a513f] px-2 py-0.5 text- font-black uppercase"
                    style={{
                      backgroundColor: trail.isFree? TOKENS.leaf : TOKENS.teal,
                      color: trail.isFree? TOKENS.pine : "#fff",
                    }}
                  >
                    {trail.isFree? "Free" : "Paid"}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-black uppercase tracking-tight text-[#2a513f]">
                  {trail.name}
                </h3>
                <p className="mt-2 text-sm leading-6 font-medium text-[#2a513f]">{trail.note}</p>

                <div className="mt-3 flex items-center gap-2 text-xs font-bold uppercase text-[#378e8e]">
                  <DifficultyPips accessibility={trail.accessibility} />
                  <span className="normal-case font-medium text-">{trail.accessibility}</span>
                </div>
              </div>

              <div className="mt-5 flex gap-3 border-t-4 border-[#2a513f] pt-3 text-xs font-black uppercase text-[#2a513f]">
                <span>{trail.distance}</span>
                <span>{trail.elevation}</span>
              </div>
            </article>
          ))}
        </div>

        {filteredTrails.length === 0 && (
          <p className="mt-12 text-center font-black uppercase tracking-wider text-[#cef79f]">No trails match this filter</p>
        )}
      </div>
    </section>
  );
}