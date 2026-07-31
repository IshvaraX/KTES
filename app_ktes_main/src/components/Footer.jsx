export default function Footer() {
  return (
    <footer className="border-t-4 border-[#2a513f] bg-[#2a513f] py-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 font-mono text-xs font-bold uppercase tracking-wider">
        <span className="flex items-center gap-3 text-[#cef79f]">
          <span className="h-2 w-2 bg-[#83ba36] border border-[#cef79f]"></span>
          KTES — Karnataka Trekking Exploration Site
        </span>
        <span className="hidden items-center gap-2 sm:flex text-[#70e0bb]">
          <span className="h- w-6 bg-[#378e8e]"></span>
          Trek responsibly. Carry your permit.
          <span className="h-2 w-2 bg-[#70e0bb]"></span>
        </span>
      </div>
    </footer>
  );
}