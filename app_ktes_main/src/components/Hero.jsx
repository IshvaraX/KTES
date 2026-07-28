export default function Hero({ onOpenPermit }) {
  return (
    <section className="relative overflow-hidden py-28 bg-lime">
      <div className="absolute inset-0 bg-[url('/karnataka-hero.jpg')] bg-cover bg-center opacity-30" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl text-center lg:text-left">
          <span className="mb-4 inline-block border-4 border-ink bg-white px-4 py-1 text-sm font-bold uppercase tracking-wider text-ink">
            Karnataka Trekking Exploration Site
          </span>

          <h1 className="text-5xl font-black uppercase tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Explore Karnataka.
            <br />
            Trek with confidence.
          </h1>

          <p className="mt-6 text-lg leading-8 font-medium text-ink">
            Discover trekking destinations, generate permits for your group,
            and download a QR-enabled pass in minutes.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
            <button
              onClick={onOpenPermit}
              className="rounded-none border-4 border-ink bg-accent px-8 py-4 text-sm font-bold uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_#16231a] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#16231a]"
            >
              Create Permit
            </button>

            <a
              href="#trails"
              className="rounded-none border-4 border-ink bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-ink shadow-[4px_4px_0px_0px_#16231a] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#16231a]"
            >
              Browse Treks
            </a>
          </div>
        </div>

        <div className="hidden w-full max-w-md lg:block">
          <div className="border-4 border-ink bg-white p-2 shadow-[8px_8px_0px_0px_#16231a] rotate-2 hover:rotate-0 transition-transform duration-300">
            <img
              src="/karnataka-hero.jpg"
              alt="Karnataka Western Ghats landscape"
              className="h-80 w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}