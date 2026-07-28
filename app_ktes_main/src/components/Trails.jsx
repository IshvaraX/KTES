import { useState } from "react";

const TRAILS = [
  {
    region: "Tumakuru (Near Dobbaspet)",
    name: "Nijagal Betta",
    note: "An offbeat trail featuring ancient fort ruins and rock-cut caves along the highway.",
    distance: "~4 km",
    elevation: "1,110 m",
    isFree: true,
    accessibility: "Very Easy (Located right next to NH-48; park near CCD/Kamath)"
  },
  {
    region: "Tumakuru (Madhugiri)",
    name: "Madhugiri Betta",
    note: "The second-largest monolithic rock in Asia, featuring a steep climb through multiple fort gates.",
    distance: "~4.5 km",
    elevation: "1,200 m",
    isFree: true,
    accessibility: "Easy (Direct KSRTC buses run from Majestic to Madhugiri town)"
  },
  {
    region: "Ramanagara",
    name: "Savandurga",
    note: "One of the largest monolith hills in Asia, offering a steep, thrilling climb on bare granite rock.",
    distance: "~5 km",
    elevation: "1,226 m",
    isFree: true,
    accessibility: "Easy (Good road connectivity via Magadi Road or Mysore Road)"
  },
  {
    region: "Kunigal",
    name: "Uttari Betta",
    note: "A scenic day and sunrise trek that passes through village fort walls and lush grasslands.",
    distance: "~5 km",
    elevation: "1,130 m",
    isFree: false,
    accessibility: "Easy (Approx. 2 hours via Magadi Road)"
  },
  {
    region: "Tumakuru (Dobbaspet)",
    name: "Shivagange",
    note: "Known as Dakshina Kashi, a combination of pilgrimage and a steep vertical trek with safety railings.",
    distance: "~4 km",
    elevation: "1,369 m",
    isFree: true,
    accessibility: "Very Easy (Excellent roads off NH-48, plenty of local transport)"
  },
  {
    region: "Chikkaballapur",
    name: "Nandi Hills",
    note: "The most famous weekend getaway, utilizing a historical stone step route built during Tipu Sultan's era.",
    distance: "~3 km",
    elevation: "1,478 m",
    isFree: false,
    accessibility: "Very Easy (Highly commercialised, paved roads all the way to base)"
  },
  {
    region: "Doddaballapur",
    name: "Makalidurga",
    note: "A popular lake-facing hill with an old fort structure overlooking passing railway tracks.",
    distance: "~5 km",
    elevation: "1,350 m",
    isFree: false,
    accessibility: "Easy (Can be reached by local train to Makalidurga station or by car)"
  },
  {
    region: "Tumakuru (Madhugiri)",
    name: "Channarayana Durga",
    note: "An uncrowded, challenging fort trek built over a massive rocky hill with no defined trails.",
    distance: "~5 km",
    elevation: "1,138 m",
    isFree: true,
    accessibility: "Moderate (Remote location, personal vehicle recommended)"
  },
  {
    region: "Ramanagara",
    name: "Ramadevara Betta",
    note: "The famous hilltop where the movie 'Sholay' was shot; also home to India's only Vulture Sanctuary.",
    distance: "~3 km",
    elevation: "1,040 m",
    isFree: false,
    accessibility: "Very Easy (Just off the Bangalore-Mysore Expressway)"
  },
  {
    region: "Chikkaballapur",
    name: "Channagiri",
    note: "The lesser-known twin hill of Nandi Hills, offering a dense forest trail and 360-degree ridge views.",
    distance: "~5 km",
    elevation: "1,354 m",
    isFree: true,
    accessibility: "Easy (Located near Sultanpet village near Nandi Hills)"
  },
  {
    region: "Tumakuru",
    name: "Devarayanadurga",
    note: "A dense, forested hill station featuring a fortified hilltop temple complex and panoramic viewpoints.",
    distance: "~4 km",
    elevation: "1,188 m",
    isFree: true,
    accessibility: "Very Easy (KSRTC buses go up to the hill; driving is very smooth)"
  },
  {
    region: "Kolar",
    name: "Antargange",
    note: "A unique volcanic rock hill formation famous for nighttime cave exploration and boulder crawling.",
    distance: "~3 km",
    elevation: "1,226 m",
    isFree: true,
    accessibility: "Easy (Just 4 km from Kolar town off the Chennai National Highway)"
  },
  {
    region: "Tumakuru (Near Nelamangala)",
    name: "Mandaragiri Hill",
    note: "Also known as Basadi Betta, featuring 400+ stone steps leading to a beautiful Jain temple site.",
    distance: "~2 km",
    elevation: "1,180 m",
    isFree: true,
    accessibility: "Very Easy (Right off NH-48; steps make it highly accessible)"
  },
  {
    region: "Kanakapura",
    name: "Kabbaladurga",
    note: "A steep, smooth monolithic night trek ideal for watching the sunrise from the top ruins.",
    distance: "~5 km",
    elevation: "1,090 m",
    isFree: true,
    accessibility: "Moderate (80 km from city; best reached via personal vehicle)"
  },
  {
    region: "Kanakapura",
    name: "Bananthimari Betta",
    note: "A lesser-known twin hill cluster surrounded by dense shrub forests and active local wildlife.",
    distance: "~4.5 km",
    elevation: "1,050 m",
    isFree: true,
    accessibility: "Moderate (Interior rural roads, mapping can be tricky)"
  },
  {
    region: "Ramanagara",
    name: "Handi Gundi Betta",
    note: "An easy-grade grassland trail passing through a narrow valley, perfect for beginner trekkers.",
    distance: "~4 km",
    elevation: "1,000 m",
    isFree: true,
    accessibility: "Easy (Located close to Ramanagara town setup)"
  },
  {
    region: "Tumakuru (Kudnhal)",
    name: "Hutridurga",
    note: "A multi-tiered fort trail passing through 7 structural gateways built into the stone hillside.",
    distance: "~5 km",
    elevation: "1,130 m",
    isFree: true,
    accessibility: "Easy (Good highway access via Kunigal road, parking available at base)"
  },
];

// Design tokens — real hex values standing in for what were undefined
// Tailwind classes (bg-moss, text-lime, bg-surface, etc). Only "#16231a"
// was confirmed from your original code (used in the shadow arbitrary
// values); the rest are reasonable placeholders in the same palette.
// Swap these for your real brand hex codes if they differ.
const TOKENS = {
  ink: "#152018b1",       // near-black green, borders/primary text
  moss: "#16231ac9",      // dark section background (same as ink for now)
  mossLight: "#9db894", // muted sage for subtext on dark bg
  lime: "#c6ff2e",      // bright accent
  surface: "#f6f3ea",   // card background (parchment)
  inkSoft: "#5b6355",   // muted body text on light surface
  accent: "#d97a34"     // "Free" badge pop color
};

export default function Trails() {
  const [filter, setFilter] = useState("all");

  const filteredTrails = TRAILS.filter((trail) => {
    if (filter === "free") return trail.isFree;
    if (filter === "very-easy") return trail.accessibility.startsWith("Very Easy");
    return true;
  });

  return (
    <section
      id="trails"
      className="relative overflow-hidden py-24"
      style={{
        backgroundColor: TOKENS.moss,
        backgroundImage: "url('/trails.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <style>{`
        @keyframes pop-in {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-pop-in { animation: pop-in 0.4s ease-out both; }
        .trail-filter-btn:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px 0px ${TOKENS.ink} !important;
        }
      `}</style>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${TOKENS.moss}e6 0%, ${TOKENS.moss}b3 50%, ${TOKENS.moss}e6 100%)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider" style={{ color: TOKENS.lime }}>
            Around Bangalore
          </p>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            Bettas & Fort Treks
          </h2>
          <p className="mt-4 text-base font-medium" style={{ color: TOKENS.mossLight }}>
            Weekend getaways, monoliths, and ancient fort ruins just beyond the city.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm">
            <button
              onClick={() => setFilter("all")}
              className="trail-filter-btn border-4 px-4 py-2 font-bold uppercase tracking-wider transition active:scale-95"
              style={{
                borderColor: TOKENS.ink,
                backgroundColor: filter === "all" ? TOKENS.ink : TOKENS.lime,
                color: filter === "all" ? TOKENS.lime : TOKENS.ink,
                boxShadow: `4px 4px 0px 0px ${TOKENS.ink}`,
              }}
            >
              All ({TRAILS.length})
            </button>
            <button
              onClick={() => setFilter("free")}
              className="trail-filter-btn border-4 px-4 py-2 font-bold uppercase tracking-wider transition active:scale-95"
              style={{
                borderColor: TOKENS.ink,
                backgroundColor: filter === "free" ? TOKENS.ink : TOKENS.lime,
                color: filter === "free" ? TOKENS.lime : TOKENS.ink,
                boxShadow: `4px 4px 0px 0px ${TOKENS.ink}`,
              }}
            >
              Free ({TRAILS.filter((t) => t.isFree).length})
            </button>
            <button
              onClick={() => setFilter("very-easy")}
              className="trail-filter-btn border-4 px-4 py-2 font-bold uppercase tracking-wider transition active:scale-95"
              style={{
                borderColor: TOKENS.ink,
                backgroundColor: filter === "very-easy" ? TOKENS.ink : TOKENS.lime,
                color: filter === "very-easy" ? TOKENS.lime : TOKENS.ink,
                boxShadow: `4px 4px 0px 0px ${TOKENS.ink}`,
              }}
            >
              Easily Accessible ({TRAILS.filter((t) => t.accessibility.startsWith("Very Easy")).length})
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {filteredTrails.map((trail, index) => (
            <article
              key={trail.name}
              className="flex flex-col justify-between border-4 p-6 transition hover:-translate-y-1 animate-pop-in"
              style={{
                borderColor: TOKENS.ink,
                backgroundColor: TOKENS.surface,
                boxShadow: `6px 6px 0px 0px ${TOKENS.ink}`,
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: TOKENS.inkSoft }}>
                    {trail.region}
                  </p>

                  <span
                    className="shrink-0 border-2 px-2 py-0.5 text-[11px] font-black uppercase tracking-wider"
                    style={{
                      borderColor: TOKENS.ink,
                      backgroundColor: trail.isFree ? TOKENS.accent : "#ffffff",
                      color: trail.isFree ? "#ffffff" : TOKENS.ink,
                    }}
                  >
                    {trail.isFree ? "Free" : "Paid"}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-black uppercase tracking-tight" style={{ color: TOKENS.ink }}>
                  {trail.name}
                </h3>

                <p className="mt-3 text-sm leading-6 font-medium" style={{ color: TOKENS.inkSoft }}>
                  {trail.note}
                </p>

                <p className="mt-4 text-xs font-medium" style={{ color: TOKENS.inkSoft }}>
                  {trail.accessibility}
                </p>
              </div>

              <div
                className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-t-4 pt-4 text-xs font-bold uppercase tracking-wider"
                style={{ borderColor: TOKENS.ink, color: TOKENS.ink }}
              >
                <span>{trail.distance}</span>
                <span>{trail.elevation}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}