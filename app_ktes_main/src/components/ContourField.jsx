export default function ContourField() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-20"
      viewBox="0 0 1200 600"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <circle
        cx="180"
        cy="120"
        r="220"
        fill="url(#fade)"
      />

      <circle
        cx="1050"
        cy="450"
        r="280"
        fill="url(#fade)"
      />
    </svg>
  );
}