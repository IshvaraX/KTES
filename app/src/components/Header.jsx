import { useEffect, useState } from "react";
import Logo from "./Logo";
import { hasMapKey } from "./lib/maptiler";

export default function Header({ onOpenPlan, onFindNear }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 bg-mist transition-shadow ${scrolled ? "shadow-[0_1px_0_rgba(23,51,23,0.1)]" : ""}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" className="flex items-center gap-2.5 rounded-[12px]" aria-label="KTES home">
          <Logo className="h-9 w-9" />
          <span className="display-sm text-2xl tracking-wide">KTES</span>
        </a>

        <nav className="flex items-center gap-2 sm:gap-5" aria-label="Main">
          <a href="#trails" className="hidden rounded-full px-2 text-[0.9375rem] font-medium text-shola/80 hover:text-shola sm:inline">
            Trails
          </a>
          {hasMapKey && (
            <button type="button" onClick={onFindNear} className="btn btn-quiet hidden sm:inline-flex">
              Find treks near me
            </button>
          )}
          <button type="button" onClick={onOpenPlan} className="btn btn-action">
            Make a trek plan
          </button>
        </nav>
      </div>
    </header>
  );
}
