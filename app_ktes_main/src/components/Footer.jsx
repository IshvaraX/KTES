export default function Footer() {
  return (
    <footer className="border-t-4 border-ink bg-bg py-10">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-8 font-mono text-xs font-bold uppercase tracking-wider text-ink">
        <span>KTES — Karnataka Trekking Exploration Site</span>
        <span className="hidden sm:inline text-accent">Trek responsibly. Carry your permit.</span>
      </div>
    </footer>
  );
}