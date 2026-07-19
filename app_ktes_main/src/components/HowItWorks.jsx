const STEPS = [
  {
    title: "Choose a Trek",
    body: "Browse popular trekking destinations across Karnataka.",
  },
  {
    title: "Add Your Group",
    body: "Enter trek details and the information for each participant.",
  },
  {
    title: "Generate Permit",
    body: "Create a QR-enabled permit for every trekker instantly.",
  },
  {
    title: "Start Trekking",
    body: "Download your permit and carry it throughout your journey.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm text-ink-soft">How it works</p>

          <h2 className="text-4xl font-semibold tracking-tight text-ink">
            Generate your trekking permit in minutes
          </h2>

          <p className="mt-4 text-lg text-ink-soft">
            A simple four-step process designed to help trekkers register,
            generate permits, and explore safely.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-line bg-surface p-6 transition hover:shadow-md"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-medium text-bg">
                {index + 1}
              </div>

              <h3 className="text-xl font-medium text-ink">
                {step.title}
              </h3>

              <p className="mt-3 leading-7 text-ink-soft">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}