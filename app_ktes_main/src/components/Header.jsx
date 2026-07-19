export default function Header({ onOpenPermit }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="text-2xl font-bold text-ink">
          KTES
        </a>

        <nav className="flex items-center gap-6">
          <a href="#how" className="text-sm text-ink-soft hover:text-ink">
            How it Works
          </a>

          <a href="#trails" className="text-sm text-ink-soft hover:text-ink">
            Trails
          </a>

          <button
            onClick={onOpenPermit}
            className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-bg hover:opacity-90"
          >
            Start Permit
          </button>
        </nav>
      </div>
    </header>
  );
}