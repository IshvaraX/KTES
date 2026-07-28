export default function Header({ onOpenPermit }) {
  return (
    <header className="sticky top-0 z-40 border-b-4 border-ink bg-bg shadow-[0_4px_0px_0px_#16231a]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="text-2xl font-black uppercase tracking-tight text-ink">
          KTES
        </a>

        <nav className="flex items-center gap-6">
          <a href="#how" className="text-sm font-bold uppercase tracking-wider text-ink-soft hover:text-ink">
            How it Works
          </a>

          <a href="#trails" className="text-sm font-bold uppercase tracking-wider text-ink-soft hover:text-ink">
            Trails
          </a>

          <button
            onClick={onOpenPermit}
            className="rounded-none border-4 border-ink bg-ink px-6 py-2 text-sm font-bold uppercase tracking-wider text-bg shadow-[4px_4px_0px_0px_#16231a] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#16231a]"
          >
            Start Permit
          </button>
        </nav>
      </div>
    </header>
  );
}