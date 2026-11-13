const STEPS = [
  {
    title: "Pick a trail",
    body: "Start from any trail above, or type in the trek you have planned.",
  },
  {
    title: "Add your group",
    body: "Leader details, an emergency contact, and a photo for each person.",
  },
  {
    title: "Download the PDF",
    body: "A cover sheet for the group, then one page per trekker with a QR that opens the trailhead in Google Maps.",
  },
  {
    title: "Carry it on the trek",
    body: "Keep a copy on your phone or on paper until everyone is back down.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 bg-mist py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[5fr_6fr] lg:gap-20">
        <figure className="order-last lg:order-first">
          <img
            src="/how-it-works-1200.jpg"
            alt="A red earth trail through misty forest in the Western Ghats"
            loading="lazy"
            className="aspect-[4/5] w-full rounded-[4px] object-cover"
          />
        </figure>

        <div className="lg:pt-6">
          <h2 className="display text-[clamp(2.75rem,6vw,4.5rem)]">How permits work</h2>
          <p className="mt-4 max-w-[44ch] text-lg leading-relaxed text-granite">
            Everyone in the group gets their own page, so a split group still has what it needs.
          </p>

          <ol className="relative mt-12">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative grid grid-cols-[2.5rem_1fr] gap-x-5 pb-10 last:pb-0">
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-10 bottom-0 left-[1.25rem] w-0 border-l-2 border-dashed border-shola/30"
                  />
                )}
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-shola bg-mist font-semibold tabular-nums">
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-1.5 max-w-[46ch] leading-relaxed text-granite">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
