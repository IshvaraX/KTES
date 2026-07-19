export default function CtaBand({ onOpenPermit }) {
  return (
    <section className="bg-moss py-16 text-moss-light">
      <div className="mx-auto flex max-w-[1180px] flex-col items-start gap-8 px-8 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="max-w-[16ch] font-display text-3xl font-extrabold uppercase leading-tight sm:text-4xl">
          Heading out this weekend?
        </h2>
        <button
          onClick={onOpenPermit}
          className="h-[46px] flex-shrink-0 rounded bg-accent px-6 text-sm font-bold text-[#fff8f2] transition hover:bg-accent-dark"
        >
          Start a permit
        </button>
      </div>
    </section>
  );
}