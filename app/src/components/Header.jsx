export default function Header({ onOpenPermit }) {
  return (
    <header className="sticky top-0 z-40 border-b border-shola/10 bg-mist/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5 rounded-sm" aria-label="KTES home">
          <svg viewBox="0 0 32 20" className="h-5 w-8 text-shola" aria-hidden="true">
            <path d="M0 20 C4 14 6 4 13 3 C19 2 22 12 24 15 C26 12 28 11 32 20Z" fill="currentColor" />
          </svg>
          <span className="display-sm text-2xl tracking-wide">KTES</span>
        </a>

        <nav className="flex items-center gap-2 sm:gap-7" aria-label="Main">
          <a href="#trails" className="hidden text-[0.9375rem] font-medium text-shola/75 hover:text-shola sm:inline">
            Trails
          </a>
          <a href="#how" className="hidden text-[0.9375rem] font-medium text-shola/75 hover:text-shola sm:inline">
            How permits work
          </a>
          <button type="button" onClick={onOpenPermit} className="btn btn-stamp">
            Plan a permit
          </button>
        </nav>
      </div>
    </header>
  );
}
