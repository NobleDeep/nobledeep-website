/*
  Depth envelope: the water column from surface to 300 m, with the
  typical operating band (≤100 m) and the rated depth marked. Uses only
  published design targets; it does not depict the vehicle.
*/
const H = 380;
const TOP = 24;
const BOTTOM = 356;
const y = (m: number) => TOP + ((BOTTOM - TOP) * m) / 300;

export default function DepthEnvelope() {
  const ticks = [0, 50, 100, 150, 200, 250, 300];
  return (
    <figure className="relative border border-foam/15 bg-white/[0.02]">
      <div className="flex items-center justify-between px-5 py-3 border-b border-foam/15">
        <span className="label-mono !text-foam/80">Depth envelope</span>
        <span className="font-mono text-[10px] tracking-[0.12em] text-muted">Design targets</span>
      </div>
      <svg viewBox={`0 0 360 ${H}`} className="block w-full h-auto" role="img" aria-labelledby="de-title">
        <title id="de-title">
          Depth envelope: typical operating range from the surface to 100 meters, rated to 300 meters.
        </title>
        <defs>
          <linearGradient id="deWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0f4166" />
            <stop offset="0.45" stopColor="#06213c" />
            <stop offset="1" stopColor="#020a17" />
          </linearGradient>
          <linearGradient id="deBand" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#22d3ee" stopOpacity="0.22" />
            <stop offset="1" stopColor="#22d3ee" stopOpacity="0.04" />
          </linearGradient>
          <pattern id="deHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#90e0ef" strokeOpacity="0.12" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Water column */}
        <rect x="70" y={TOP} width="270" height={BOTTOM - TOP} fill="url(#deWater)" />
        <line x1="70" y1={TOP} x2="340" y2={TOP} stroke="#90e0ef" strokeOpacity="0.6" strokeWidth="1" />

        {/* Rated envelope beyond typical range */}
        <rect x="70" y={y(100)} width="270" height={y(300) - y(100)} fill="url(#deHatch)" />

        {/* Typical operating band */}
        <rect x="70" y={TOP} width="270" height={y(100) - TOP} fill="url(#deBand)" />
        <line x1="70" y1={y(100)} x2="340" y2={y(100)} stroke="#22d3ee" strokeWidth="1.5" />
        <text x="84" y={y(100) - 12} fill="#22d3ee" fontSize="11" fontFamily="var(--font-jetbrains-mono), monospace" letterSpacing="1.2">
          TYPICAL ≤100 M
        </text>
        <text x="84" y={y(28)} fill="#b4cede" fontSize="12" fontFamily="var(--font-space-grotesk), sans-serif">
          Primary focus:
        </text>
        <text x="84" y={y(28) + 16} fill="#b4cede" fontSize="12" fontFamily="var(--font-space-grotesk), sans-serif">
          offshore wind assets
        </text>

        {/* Rated depth */}
        <line x1="70" y1={y(300)} x2="340" y2={y(300)} stroke="#ffffff" strokeWidth="1.5" />
        <text x="84" y={y(300) - 12} fill="#ffffff" fontSize="11" fontFamily="var(--font-jetbrains-mono), monospace" letterSpacing="1.2">
          RATED 300 M
        </text>

        {/* Scale */}
        <line x1="62" y1={TOP} x2="62" y2={BOTTOM} stroke="#90e0ef" strokeOpacity="0.35" />
        {ticks.map((m) => (
          <g key={m}>
            <line x1="56" y1={y(m)} x2="62" y2={y(m)} stroke="#90e0ef" strokeOpacity="0.6" />
            <text
              x="50"
              y={y(m) + 3.5}
              textAnchor="end"
              fill="#87a6ba"
              fontSize="10"
              fontFamily="var(--font-jetbrains-mono), monospace"
            >
              {m} m
            </text>
          </g>
        ))}
        {Array.from({ length: 30 }, (_, i) => i * 10)
          .filter((m) => m % 50)
          .map((m) => (
            <line key={m} x1="59" y1={y(m)} x2="62" y2={y(m)} stroke="#90e0ef" strokeOpacity="0.3" />
          ))}
      </svg>
    </figure>
  );
}
