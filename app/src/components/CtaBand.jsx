export default function CtaBand({ onOpenPlan }) {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-shola">
      <img
        src="/cta-band-1800.jpg"
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_60%]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-shola via-shola/80 to-shola/10" aria-hidden="true" />

      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <h2 className="display max-w-[13ch] text-[clamp(3rem,7vw,5.5rem)] text-paper">Heading out this weekend?</h2>
        <p className="mt-5 max-w-[36ch] text-lg leading-relaxed text-mist/85">
          Make your group's trek plan before you leave the city, while everyone still has signal.
        </p>
        <button type="button" onClick={onOpenPlan} className="btn btn-paper mt-8">
          Make a trek plan
        </button>
      </div>
    </section>
  );
}
