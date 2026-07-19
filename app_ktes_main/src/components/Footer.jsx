export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-8 font-mono text-xs text-ink-faint">
        <span>KTES — Karnataka Trekking Exploration Site</span>
        <span className="hidden sm:inline">Trek responsibly. Carry your permit.</span>
      </div>
    </footer>
  );
}