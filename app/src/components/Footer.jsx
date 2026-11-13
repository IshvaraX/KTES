import { OFFICIAL_BOOKING_URL } from "./lib/trails";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="on-dark border-t border-mist/10 bg-shola text-mist">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 text-[0.9375rem] sm:px-8 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <p className="flex items-center gap-3">
            <Logo className="h-8 w-8" />
            <span className="display-sm text-lg">KTES</span>
            <span className="text-lichen">Karnataka Trekking Exploration Site</span>
          </p>
          <p className="mt-3 max-w-[60ch] leading-relaxed text-lichen">
            A community guide to treks around Bangalore, made by trekkers. This isn't a government website, and trek plans
            made here aren't permits. For official trek bookings, use{" "}
            <a href={OFFICIAL_BOOKING_URL} target="_blank" rel="noreferrer" className="text-mist underline underline-offset-2">
              Aranya Vihaara
            </a>
            , run by the Karnataka Forest Department.
          </p>
        </div>
        <p className="text-lichen">Start early, carry water, and bring your litter back down.</p>
      </div>
    </footer>
  );
}