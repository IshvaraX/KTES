const TRAILS = [
  {
    region: "Kukke Subramanya",
    name: "Kumara Parvatha",
    note: "A challenging two-day trek through Pushpagiri Wildlife Sanctuary.",
    distance: "~14 km",
    elevation: "1,712 m",
  },
  {
    region: "Chikkaballapur",
    name: "Skandagiri",
    note: "A popular sunrise trek known for its cloud-covered views.",
    distance: "~7 km",
    elevation: "1,350 m",
  },
  {
    region: "Chikkamagaluru",
    name: "Kudremukh",
    note: "A scenic grassland trek inside Kudremukh National Park.",
    distance: "~16 km",
    elevation: "1,894 m",
  },
];

export default function Trails() {
  return (
    <section id="trails" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm text-ink-soft">Popular destinations</p>

          <h2 className="text-4xl font-semibold tracking-tight text-ink">
            Explore Karnataka's best treks
          </h2>

          <p className="mt-4 text-lg text-ink-soft">
            From beginner-friendly hikes to challenging mountain trails,
            discover some of the most visited trekking destinations.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TRAILS.map((trail) => (
            <article
              key={trail.name}
              className="rounded-2xl border border-line bg-surface p-6 transition hover:shadow-md"
            >
              <p className="text-sm text-ink-soft">{trail.region}</p>

              <h3 className="mt-2 text-2xl font-medium text-ink">
                {trail.name}
              </h3>

              <p className="mt-4 leading-7 text-ink-soft">
                {trail.note}
              </p>

              <div className="mt-6 flex justify-between border-t border-line pt-4 text-sm">
                <div>
                  <p className="text-ink-soft">Distance</p>
                  <p className="font-medium text-ink">{trail.distance}</p>
                </div>

                <div className="text-right">
                  <p className="text-ink-soft">Elevation</p>
                  <p className="font-medium text-ink">{trail.elevation}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}