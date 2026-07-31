export default function Hero({ onOpenPermit }) {
  return (
    <section className="relative overflow-hidden bg-[#cef79f] py-28">
      {/* Color grading wash */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/karnataka-hero.jpg')] bg-cover bg-center opacity-25 mix-blend-multiply" />
        {/* Subtle duotone gradient using your palette */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#cef79f]/80 via-[#70e0bb]/20 to-[#378e8e]/30" />
      </div>

      {/* Decorative blobs for grading depth */}
      <div className="pointer-events-none absolute -top-20 -left-20 h- w- rounded-full bg-[#70e0bb] opacity-40 blur-" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h- w- rounded-full bg-[#378e8e] opacity-30 blur-" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl text-center lg:text-left">
          <span className="mb-4 inline-block border-4 border-[#2a513f] bg-white px-4 py-1 text-sm font-bold uppercase tracking-wider text-[#2a513f]">
            Karnataka Trekking Exploration Site
          </span>

          <h1 className="text-5xl font-black uppercase tracking-tight text-[#2a513f] sm:text-6xl lg:text-7xl">
            Explore Karnataka.
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">Trek with confidence.</span>
              <span className="absolute bottom-2 left-0 z-0 h-4 w-full bg-[#70e0bb]" />
            </span>
          </h1>

          <p className="mt-6 text-lg font-medium leading-8 text-[#2a513f]/90">
            Discover trekking destinations, generate permits for your group,
            and download a QR-enabled pass in minutes.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
            <button
              onClick={onOpenPermit}
              className="rounded-none border-4 border-[#2a513f] bg-[#83ba36] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#2a513f] shadow-[4px_4px_0px_0px_#2a513f] transition hover:translate-x- hover:translate-y- hover:shadow-[2px_2px_0px_0px_#2a513f] hover:bg-[#70e0bb]"
            >
              Create Permit
            </button>

            <a
              href="#trails"
              className="rounded-none border-4 border-[#2a513f] bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#2a513f] shadow-[4px_4px_0px_0px_#2a513f] transition hover:translate-x- hover:translate-y- hover:shadow-[2px_2px_0px_0px_#2a513f] hover:bg-[#378e8e] hover:text-white"
            >
              Browse Treks
            </a>
          </div>
        </div>

        <div className="hidden w-full max-w-md lg:block">
          <div className="relative rotate-2 border-4 border-[#2a513f] bg-white p-2 shadow-[8px_8px_0px_0px_#2a513f] transition-transform duration-300 hover:rotate-0">
            {/* top accent bar */}
            <div className="mb-2 flex gap-2">
              <div className="h-3 w-3 rounded-full bg-[#83ba36] border-2 border-[#2a513f]"></div>
              <div className="h-3 w-3 rounded-full bg-[#70e0bb] border-2 border-[#2a513f]"></div>
              <div className="h-3 w-3 rounded-full bg-[#378e8e] border-2 border-[#2a513f]"></div>
            </div>
            <img
              src="/karnataka-hero.jpg"
              alt="Karnataka Western Ghats landscape"
              className="h-80 w-full object-cover border-2 border-[#2a513f]"
            />
            {/* bottom color strip */}
            <div className="mt-2 grid h-2 w-full grid-cols-4">
              <div className="bg-[#cef79f]"></div>
              <div className="bg-[#83ba36]"></div>
              <div className="bg-[#378e8e]"></div>
              <div className="bg-[#70e0bb]"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}