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
  }
];

export default function Trails() {
  const [filter, setFilter] = useState("all");

  const filteredTrails = TRAILS.filter((trail) => {
    if (filter === "free") return trail.isFree;
    if (filter === "very-easy") return trail.accessibility.startsWith("Very Easy");
    return true;
  });

  return (
    <section id="trails" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium tracking-wider uppercase text-ink-soft">
            Around Bangalore
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-ink">
            Bettas & Fort Treks
          </h2>
          <p className="mt-4 text-base text-ink-soft">
            Weekend getaways, monoliths, and ancient fort ruins just beyond the city.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full border px-4 py-2 font-medium transition ${
                filter === "all"
                  ? "border-ink bg-ink text-surface"
                  : "border-line text-ink hover:border-ink"
              }`}
            >
              All ({TRAILS.length})
            </button>
            <button
              onClick={() => setFilter("free")}
              className={`rounded-full border px-4 py-2 font-medium transition ${
                filter === "free"
                  ? "border-ink bg-ink text-surface"
                  : "border-line text-ink hover:border-ink"
              }`}
            >
              Free ({TRAILS.filter((t) => t.isFree).length})
            </button>
            <button
              onClick={() => setFilter("very-easy")}
              className={`rounded-full border px-4 py-2 font-medium transition ${
                filter === "very-easy"
                  ? "border-ink bg-ink text-surface"
                  : "border-line text-ink hover:border-ink"
              }`}
            >
              Easily Accessible ({TRAILS.filter((t) => t.accessibility.startsWith("Very Easy")).length})
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {filteredTrails.map((trail) => (
            <article
              key={trail.name}
              className="flex flex-col justify-between rounded-xl bg-surface p-6 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{trail.region}</p>

                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${
                      trail.isFree
                        ? "border-moss text-moss"
                        : "border-line text-ink-soft"
                    }`}
                  >
                    {trail.isFree ? "Free" : "Paid"}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">
                  {trail.name}
                </h3>

                <p className="mt-3 text-sm leading-6 text-ink-soft">
                  {trail.note}
                </p>

                <p className="mt-4 text-xs text-ink-soft">
                  {trail.accessibility}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 pt-4 text-xs text-ink-soft">
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
