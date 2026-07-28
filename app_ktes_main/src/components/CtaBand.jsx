export default function CtaBand({ onOpenPermit }) {
  return (
    <section className="bg-ink py-16">
      <div className="mx-auto flex max-w-[1180px] flex-col items-start gap-8 px-8 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="max-w-[16ch] font-black uppercase leading-tight tracking-tight text-lime sm:text-4xl">
          Heading out this weekend?
        </h2>
        <button
          onClick={onOpenPermit}
          className="h-[46px] flex-shrink-0 rounded-none border-4 border-lime bg-lime px-8 text-sm font-bold uppercase tracking-wider text-ink shadow-[4px_4px_0px_0px_#c8ff00] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#c8ff00]"
        >
          Start a permit
        </button>
      </div>
    </section>
  );
}