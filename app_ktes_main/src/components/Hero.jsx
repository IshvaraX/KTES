import ContourField from "./ContourField";

export default function Hero({ onOpenPermit }) {
  return (
    <section className="relative overflow-hidden py-28">
      <ContourField />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <span className="mb-4 rounded-full border border-line px-4 py-1 text-sm text-ink-soft">
          Karnataka Trekking Exploration Site
        </span>

        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-ink sm:text-6xl lg:text-7xl">
          Explore Karnataka.
          <br />
          Trek with confidence.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">
          Discover trekking destinations, generate permits for your group,
          and download a QR-enabled pass in minutes.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={onOpenPermit}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition hover:opacity-90"
          >
            Create Permit
          </button>

          <a
            href="#trails"
            className="rounded-full border border-line px-6 py-3 text-sm font-medium text-ink hover:bg-surface-alt"
          >
            Browse Treks
          </a>
        </div>

        <div className="mt-20 w-full max-w-3xl rounded-2xl border border-line bg-surface p-8 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-4">
            <div>
              <p className="text-3xl font-semibold text-ink">200+</p>
              <p className="mt-1 text-sm text-ink-soft">Treks</p>
            </div>

            <div>
              <p className="text-3xl font-semibold text-ink">QR</p>
              <p className="mt-1 text-sm text-ink-soft">Digital Permits</p>
            </div>

            <div>
              <p className="text-3xl font-semibold text-ink">Maps</p>
              <p className="mt-1 text-sm text-ink-soft">Navigation</p>
            </div>

            <div>
              <p className="text-3xl font-semibold text-ink">Free</p>
              <p className="mt-1 text-sm text-ink-soft">Open Source</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}