export default function CtaBand({ onOpenPlan }) {
  return (
    <section className="on-dark bg-shola">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <h2 className="display max-w-[13ch] text-[clamp(3rem,7vw,5.5rem)] text-mist">Heading out this weekend?</h2>
          <p className="mt-5 max-w-[36ch] text-lg leading-relaxed text-lichen">
            Make your group's trek plan before you leave the city, while everyone still has signal.
          </p>
          <button type="button" onClick={onOpenPlan} className="btn btn-action mt-8">
            Make a trek plan
          </button>
        </div>
        <img
          src="/cta-band-1800.jpg"
          alt="A waterfall pouring down a moss-covered rock face in the Western Ghats"
          loading="lazy"
          width="1800"
          height="2296"
          className="aspect-[4/3] w-full rounded-[24px] object-cover object-[50%_45%]"
        />
      </div>
    </section>
  );
}
