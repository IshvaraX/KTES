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
    <section id="how" className="relative overflow-hidden py-24 bg-surface">
      <div className="absolute inset-0 bg-[url('/how-it-works.jpg')] bg-cover bg-center opacity-20" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-accent">
            How it works
          </p>

          <h2 className="text-4xl font-black uppercase tracking-tight text-ink">
            Generate your trekking permit in minutes
          </h2>

          <p className="mt-4 text-lg font-medium text-ink-soft">
            A simple four-step process designed to help trekkers register,
            generate permits, and explore safely.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="border-4 border-ink bg-white p-6 shadow-[6px_6px_0px_0px_#16231a]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center border-4 border-ink bg-lime text-lg font-black text-ink shadow-[3px_3px_0px_0px_#16231a]">
                {index + 1}
              </div>

              <h3 className="text-xl font-black uppercase tracking-tight text-ink">
                {step.title}
              </h3>

              <p className="mt-3 leading-7 font-medium text-ink-soft">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}