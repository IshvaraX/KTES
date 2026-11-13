import { useEffect, useRef } from "react";
import { TRAILS } from "./lib/trails";

const W = 1200;
const H = 420;
const BASE_M = 600;
const PX_PER_M = 300 / 900;
const CONTOURS = [1000, 1200, 1400];
const TOP_CROP = 40;

const yFor = (m) => H - (m - BASE_M) * PX_PER_M;

const HILLS = TRAILS.filter((t) => t.category !== "waterfall");

const SHOULDERS = [0.42, 0.58, 0.3, 0.5];

// Granite bettas: a stepped shoulder on one flank, then a blunt crown
function hillGeometry(trail, i, count) {
  const span = W - 340;
  const cx = 170 + (count > 1 ? (i * span) / (count - 1) : span / 2);
  const top = yFor(trail.elevationM);
  const hgt = H - top;
  const hw = 112 + ((i * 37) % 3) * 14;
  const apex = cx + ((i % 3) - 1) * 18;
  const sh = H - hgt * SHOULDERS[i % SHOULDERS.length];
  const dir = i % 2 ? -1 : 1;
  const L = cx - hw * dir;
  const R = cx + hw * dir;
  const d = [
    `M ${L} ${H + 4}`,
    `C ${cx - hw * 0.72 * dir} ${H - hgt * 0.12}, ${cx - hw * 0.78 * dir} ${sh}, ${cx - hw * 0.52 * dir} ${sh}`,
    `C ${cx - hw * 0.3 * dir} ${sh}, ${cx - hw * 0.36 * dir} ${top}, ${apex} ${top}`,
    `C ${cx + hw * 0.32 * dir} ${top}, ${cx + hw * 0.5 * dir} ${H - hgt * 0.55}, ${R} ${H + 4}`,
    "Z",
  ].join(" ");
  return { d, apex, top };
}

// Stack labels upward until they clear the ones already placed
function placeLabels(hills) {
  const placed = [];
  return hills.map((h) => {
    const w = h.name.length * 8.6 + 12;
    let lift = 0;
    const clashes = (y) =>
      placed.some((p) => Math.abs(p.x - h.apex) < (p.w + w) / 2 && Math.abs(p.y - y) < 44);
    while (clashes(h.top - lift) && lift < 160) lift += 44;
    placed.push({ x: h.apex, y: h.top - lift, w });
    return lift;
  });
}

// A Kaveri-like river winding through the ground in front of the hills
const RIVER = `M -10 ${H - 6} C 140 ${H + 2}, 300 ${H - 22}, 500 ${H - 12} S 820 ${H + 1}, 980 ${H - 15} S 1140 ${H - 2}, ${W + 10} ${H - 10}`;

const SHAPES = HILLS.map((trail, i) => ({ trail, name: trail.name, ...hillGeometry(trail, i, HILLS.length) }));
const LIFTS = placeLabels(SHAPES);

function Skyline() {
  const scroller = useRef(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, []);

  return (
    <div ref={scroller} className="overflow-x-auto overflow-y-hidden [scrollbar-width:none]">
      <svg
        viewBox={`0 ${TOP_CROP} ${W} ${H - TOP_CROP}`}
        className="-mb-px block w-full min-w-[880px]"
        role="group"
        aria-label="Hill profile: summit elevations of the trails around Bangalore, drawn to scale"
      >
        <path
          d={`M0 ${H} L0 ${yFor(930)} C 180 ${yFor(990)}, 300 ${yFor(900)}, 460 ${yFor(960)} S 760 ${yFor(1010)}, 900 ${yFor(940)} S 1120 ${yFor(980)}, ${W} ${yFor(920)} L ${W} ${H} Z`}
          className="fill-fern/25"
        />

        {CONTOURS.map((m) => (
          <g key={m}>
            <line x1="0" x2={W} y1={yFor(m)} y2={yFor(m)} className="stroke-shola/25" strokeDasharray="2 6" />
            <text x="10" y={yFor(m) - 7} className="fill-granite text-[13px]" style={{ fontStretch: "85%" }}>
              {m.toLocaleString("en-IN")} m
            </text>
          </g>
        ))}

        {SHAPES.map(({ trail, d, apex, top }, i) => {
          const lift = LIFTS[i];
          return (
            <a
              key={trail.id}
              href={`#trail-${trail.id}`}
              className="peak group outline-none"
              aria-label={`${trail.name}, ${trail.elevation}`}
              style={{ "--i": i }}
            >
              <path d={d} className="hill fill-ridge stroke-mist transition-[fill] duration-200 group-hover:fill-ridge-2 group-focus-visible:fill-forest" strokeWidth="1.5" />
              <g className="peak-label" aria-hidden="true">
                {lift > 0 && (
                  <line x1={apex} x2={apex} y1={top - 6} y2={top - lift + 4} className="stroke-shola/40" />
                )}
                <text
                  x={apex}
                  y={top - lift - 26}
                  textAnchor="middle"
                  className="fill-shola text-[17px] font-[680] group-hover:underline group-focus-visible:underline"
                  style={{ fontStretch: "78%" }}
                >
                  {trail.name}
                </text>
                <text x={apex} y={top - lift - 8} textAnchor="middle" className="fill-granite text-[14px]" style={{ fontStretch: "85%" }}>
                  {trail.elevation}
                </text>
              </g>
            </a>
          );
        })}

        <path
          d={`M0 ${H + 10} L0 ${H - 26} C 200 ${H - 14}, 330 ${H - 34}, 520 ${H - 20} S 860 ${H - 12}, 1000 ${H - 26} S 1140 ${H - 18}, ${W} ${H - 24} L ${W} ${H + 10} L 0 ${H + 10} Z`}
          className="fill-deep"
        />
        <g aria-hidden="true" fill="none" strokeLinecap="round">
          <path d={RIVER} className="stroke-sky" strokeWidth="11" />
          <path d={RIVER} transform="translate(0 -2)" className="stroke-white/55" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

const CLOUD = "M20 46a15 15 0 0 1 3-29 21 21 0 0 1 39-9 17 17 0 0 1 30 7 14 14 0 0 1 14 31Z";

function Cloud({ className }) {
  return (
    <svg viewBox="0 0 120 52" className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <path d={CLOUD} transform="translate(4 4)" className="fill-sky/25" />
      <path d={CLOUD} className="fill-white" />
    </svg>
  );
}

const STEPS = [
  { title: "Pick a trail", detail: "Around Bangalore, or one near you" },
  { title: "Add your group", detail: "Names, phones and a photo each" },
  { title: "Download the plan", detail: "One PDF with a map QR on every page" },
];

// Blazes switchback down the footpath; x is the blaze's left offset, tilt is its hand-painted angle
const BLAZES = [
  { x: 0, tilt: -4 },
  { x: 44, tilt: 3 },
  { x: 0, tilt: -2 },
];
const ROW = 84;

function TrailSteps() {
  const path = `M 20 22 C 20 ${ROW * 0.55}, 64 ${ROW * 0.45}, 64 ${ROW + 22} S 20 ${ROW * 1.55 + 22}, 20 ${ROW * 2 + 22}`;
  return (
    <div className="relative">
      <h2 className="sr-only">How it works</h2>
      <svg
        className="pointer-events-none absolute top-0 left-0"
        width="90"
        height={ROW * 2 + 44}
        aria-hidden="true"
      >
        <path d={path} fill="none" className="stroke-earth/55" strokeWidth="2.5" strokeDasharray="1 7" strokeLinecap="round" />
      </svg>
      <ol className="relative">
        {STEPS.map((step, i) => (
          <li key={step.title} className="relative flex items-start" style={{ height: i < STEPS.length - 1 ? ROW : "auto" }}>
            <span
              className="trail-blaze"
              style={{ marginLeft: BLAZES[i].x, transform: `rotate(${BLAZES[i].tilt}deg)` }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <span className="ml-4 pt-0.5">
              <span className="block text-xl leading-tight font-semibold">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </span>
              <span className="mt-1 block text-[0.9375rem] text-granite">{step.detail}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="hero-sky relative overflow-hidden pt-10 sm:pt-14">
      <Cloud className="top-3 right-[2%] w-32 sm:w-40 lg:right-[4%]" />
      <Cloud className="top-[50%] left-[3%] hidden w-36 opacity-90 lg:block" />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-center lg:gap-16">
        <h1 className="display max-w-[16ch] text-[clamp(3.4rem,8vw,6.75rem)] text-shola">
          Climb the hills around Bangalore.
        </h1>
        <div>
          <TrailSteps />
        </div>
      </div>

      <div className="relative mt-8">
        <Skyline />
      </div>
    </section>
  );
}
