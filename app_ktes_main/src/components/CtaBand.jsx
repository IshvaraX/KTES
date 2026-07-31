export default function CtaBand({ onOpenPermit }) {
  return (
    <section className="relative overflow-hidden border-y-4 border-[#2a513f] bg-[#2a513f] py-16">
      {/* subtle glow using your accent colors */}
      <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#378e8e]/30 blur-" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#83ba36]/20 blur-" />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="max-w- text-3xl font-black uppercase leading-[0.9] tracking-tight text-[#cef79f] sm:text-4xl">
          Heading out <span className="text-[#70e0bb]">this</span> weekend?
        </h2>
        <button
          onClick={onOpenPermit}
          className="h- flex-shrink-0 border-4 border-[#2a513f] bg-[#cef79f] px-8 text-sm font-black uppercase tracking-wider text-[#2a513f] shadow-[4px_4px_0px_0px_#70e0bb] transition hover:translate-x- hover:translate-y- hover:shadow-[2px_2px_0px_0px_#70e0bb] hover:bg-[#83ba36]"
        >
          Start a permit
        </button>
      </div>
    </section>
  );
}