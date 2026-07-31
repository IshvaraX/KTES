export default function Header({ onOpenPermit }) {
  return (
    <header className="sticky top-0 z-40 border-b-4 border-[#2a513f] bg-[#cef79f] shadow-[0_4px_0px_0px_#2a513f]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2 text-2xl font-black uppercase tracking-tight text-[#2a513f]">
          <span className="flex h-8 w-8 items-center justify-center border-2 border-[#2a513f] bg-[#83ba36] text-">K</span>
          KTES
        </a>

        <nav className="flex items-center gap-6">
          <a href="#how" className="text-sm font-bold uppercase tracking-wider text-[#2a513f]/70 transition hover:text-[#378e8e]">
            How it Works
          </a>

          <a href="#trails" className="text-sm font-bold uppercase tracking-wider text-[#2a513f]/70 transition hover:text-[#378e8e]">
            Trails
          </a>

          <button
            onClick={onOpenPermit}
            className="rounded-none border-4 border-[#2a513f] bg-[#2a513f] px-6 py-2 text-sm font-bold uppercase tracking-wider text-[#cef79f] shadow-[4px_4px_0px_0px_#2a513f] transition hover:translate-x- hover:translate-y- hover:shadow-[2px_2px_0px_0px_#2a513f] hover:bg-[#83ba36] hover:text-[#2a513f]"
          >
            Start Permit
          </button>
        </nav>
      </div>
    </header>
  );
}