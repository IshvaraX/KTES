// Two granite bettas with a river at their foot, on a pine badge
const LOGO_PATHS = {
  back: "M30 47C34 38.5 37.5 31 43 30 48.5 29 51.5 38 57 47Z",
  betta: "M7 47C11 41 14 36 18.5 35 21.5 34.4 23 31.5 25 25.5 27.8 17.2 37.2 16.2 40.8 24.4 43.6 30.6 45.5 38 49 47Z",
  river: "M7 52C15.5 47.5 24 55.5 33 51S48 46.5 57 51",
};

export default function Logo({ className = "h-9 w-9", title }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : "true"}>
      {title && <title>{title}</title>}
      <rect width="64" height="64" rx="16" fill="#173317" />
      <path d={LOGO_PATHS.back} fill="#8cbd8c" />
      <path d={LOGO_PATHS.betta} fill="#80ef80" />
      <path d={LOGO_PATHS.river} fill="none" stroke="#80b7ef" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}
