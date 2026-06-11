"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import FadeIn from "@/components/FadeIn";

const GEO_URL = "/world-110m.json";

/* ── Use-case data ─────────────────────────────────────────────── */
interface UseCase {
  id:          string;
  region:      string;
  title:       string;
  tag:         string;
  markerLabel: string;
  coordinates: [number, number];
  description: string;
  photo:           string;          /* path inside /public */
  photoAlt:        string;
  credit:          string | null;   /* null = no credit line */
  objectPosition?: string;          /* CSS object-position override for panel crop */
  accent:          string;
}

const USE_CASES: UseCase[] = [
  {
    id:          "north-sea",
    region:      "North Sea, Europe",
    title:       "Offshore Wind Farms",
    tag:         "Energy Transition",
    markerLabel: "North Sea",
    coordinates: [3, 56],
    description:
      "Offshore wind operators manage hundreds of subsea cables, foundations, and inter-array connections across vast areas. TRITON provides continuous structural monitoring and early fault detection without surface vessel deployment.",
    photo:    "/offshore-wind.jpg",
    photoAlt: "Offshore wind farm aerial view over the ocean",
    credit:   "Photo by Nicholas Doherty on Unsplash",
    accent:   "#48cae4",
  },
  {
    id:          "gulf-mexico",
    region:      "Gulf of Mexico, USA",
    title:       "Oil & Gas Pipelines",
    tag:         "Energy Infrastructure",
    markerLabel: "Gulf of Mexico",
    coordinates: [-90, 24],
    description:
      "Thousands of miles of subsea pipelines cross the Gulf floor. TRITON's resident swarm detects corrosion, leaks, and third-party interference in real time — replacing costly periodic ROV surveys.",
    photo:    "/pipeline.jpeg",
    photoAlt: "Subsea oil and gas pipeline underwater",
    credit:   null,
    accent:   "#0096c7",
  },
  {
    id:          "pre-salt-brazil",
    region:      "Pre-Salt Basin, Brazil",
    title:       "Deepwater Wells & Rigs",
    tag:         "Offshore Production",
    markerLabel: "Pre-Salt Basin",
    coordinates: [-40, -23],
    description:
      "Ultra-deepwater production assets require constant structural integrity monitoring. TRITON delivers persistent seabed-level data on riser fatigue, wellhead movement, and sediment shifts.",
    photo:          "/oil-rig.jpg",
    photoAlt:       "Deepwater oil rig in the ocean, Brazil pre-salt basin",
    credit:         "Photo by Grant Durr on Unsplash",
    objectPosition: "center center",
    accent:         "#0096c7",
  },
  {
    id:          "baltic-sea",
    region:      "Baltic Sea, Europe",
    title:       "Subsea Infrastructure Protection",
    tag:         "Critical Infrastructure",
    markerLabel: "Baltic Sea",
    coordinates: [20, 57],
    description:
      "Critical subsea telecom cables and pipelines face growing threats from anchor drag and sabotage. TRITON provides 24/7 intrusion detection and anomaly alerts across protected corridors.",
    photo:    "/subsea-cable.png",
    photoAlt: "Subsea cable infrastructure protection in the Baltic Sea",
    credit:   null,
    accent:   "#90e0ef",
  },
  {
    id:          "great-barrier-reef",
    region:      "Great Barrier Reef, Australia",
    title:       "Marine Conservation",
    tag:         "Environmental Monitoring",
    markerLabel: "Barrier Reef",
    coordinates: [148, -18],
    description:
      "Coral reef ecosystems are highly sensitive to temperature, sediment, and chemical changes. TRITON's sensor suite enables continuous environmental monitoring across protected marine areas without surface disturbance.",
    photo:    "/coral-reef.jpg",
    photoAlt: "Vibrant coral reef underwater, Great Barrier Reef, Australia",
    credit:   "Photo by Francesco Ungaro on Unsplash",
    accent:   "#48cae4",
  },
];

/* ── Detail panel ──────────────────────────────────────────────── */
function Panel({ uc, onClose }: { uc: UseCase; onClose: () => void }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto">

      {/* ── Photo ── */}
      <div className="relative shrink-0 h-56 overflow-hidden">
        <Image
          src={uc.photo}
          alt={uc.photoAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 38vw"
          priority={false}
          style={{ objectPosition: uc.objectPosition }}
        />

        {/* Dark gradient from bottom — keeps text readable over any photo */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,5,18,0.85) 0%, rgba(0,5,18,0.15) 55%, transparent 100%)",
          }}
        />

        {/* Bottom bar: region label + optional photo credit */}
        <div className="absolute bottom-0 inset-x-0 px-5 pb-3 flex items-end justify-between gap-3">
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/50 select-none leading-none">
            {uc.region}
          </p>
          {uc.credit && (
            <p className="text-[9px] text-white/30 leading-none text-right shrink-0">
              {uc.credit}
            </p>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-full bg-black/30 text-white/60 hover:text-white hover:bg-black/50 transition-colors backdrop-blur-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Text content ── */}
      <div className="flex flex-col flex-1 p-6">
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.22em] mb-2"
          style={{ color: uc.accent }}
        >
          {uc.tag}
        </p>
        <h3 className="text-xl font-bold text-white leading-snug mb-4">
          {uc.title}
        </h3>
        <p className="text-[#90e0ef]/80 text-sm leading-relaxed flex-1">
          {uc.description}
        </p>

        <div className="mt-6 pt-5 border-t border-[#90e0ef]/[0.1]">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
            style={{ color: uc.accent }}
          >
            Discuss This Application
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Main section ──────────────────────────────────────────────── */
export default function WhereTritonWorks() {
  const [active, setActive] = useState<UseCase | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const close = useCallback(() => setActive(null), []);

  return (
    <section className="px-6 lg:px-10 py-24">
      <div className="mx-auto max-w-7xl">

        {/* ── Header ── */}
        <FadeIn className="mb-10">
          <p className="text-[#90e0ef]/50 text-xs uppercase tracking-[0.22em] mb-4">
            Deployment
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                Where TRITON Works
              </h2>
              <p className="mt-3 text-[#90e0ef]/70 max-w-lg text-sm sm:text-base leading-relaxed">
                Select a location to explore the use case. Global offshore
                infrastructure demands persistent, autonomous monitoring.
              </p>
            </div>
            {active && (
              <button
                onClick={close}
                className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#90e0ef]/40 hover:text-[#90e0ef] transition-colors shrink-0 self-start sm:self-auto"
              >
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear selection
              </button>
            )}
          </div>
        </FadeIn>

        {/* ── Map + panel wrapper ── */}
        <FadeIn delay={80}>
          <div className="relative rounded-sm overflow-hidden border border-[#90e0ef]/[0.08]">

            {/* Map */}
            <div
              style={{ background: "#020c18" }}
              className={`transition-all duration-500 ease-out ${
                active ? "lg:pr-[38%]" : ""
              }`}
            >
              <ComposableMap
                projection="geoNaturalEarth1"
                projectionConfig={{ scale: 153, center: [10, 10] }}
                style={{ width: "100%", height: "auto", display: "block" }}
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#040f1e"
                        stroke="#0b2038"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover:   { outline: "none", fill: "#071726" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {USE_CASES.map((uc) => {
                  const isActive = active?.id === uc.id;
                  return (
                    <Marker key={uc.id} coordinates={uc.coordinates}>
                      <g
                        onClick={() => setActive(isActive ? null : uc)}
                        style={{ cursor: "pointer" }}
                        role="button"
                        aria-label={`${uc.region}: ${uc.title}`}
                        aria-pressed={isActive}
                      >
                        <circle r={isActive ? 14 : 10} fill="none" stroke={uc.accent} strokeWidth={isActive ? 1.5 : 1}
                          opacity={0} className="map-ping" style={{ animationDelay: "0s" }} />
                        <circle r={isActive ? 14 : 10} fill="none" stroke={uc.accent} strokeWidth={1}
                          opacity={0} className="map-ping" style={{ animationDelay: "1.25s" }} />
                        <circle
                          r={isActive ? 6 : 4.5}
                          fill={isActive ? uc.accent : "#0077b6"}
                          stroke={uc.accent}
                          strokeWidth={isActive ? 0 : 1}
                          style={{
                            filter: `drop-shadow(0 0 ${isActive ? 8 : 5}px ${uc.accent})`,
                            transition: "r 0.2s ease, filter 0.2s ease",
                          }}
                        />
                        <text
                          textAnchor="middle"
                          y={-10}
                          style={{
                            fontSize: "7px",
                            fill: isActive ? uc.accent : "rgba(144,224,239,0.55)",
                            fontWeight: isActive ? "700" : "500",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            fontFamily: "inherit",
                            pointerEvents: "none",
                            transition: "fill 0.2s ease",
                            paintOrder: "stroke",
                            stroke: "#020c18",
                            strokeWidth: "3px",
                            strokeLinejoin: "round",
                          } as React.CSSProperties}
                        >
                          {uc.markerLabel}
                        </text>
                      </g>
                    </Marker>
                  );
                })}
              </ComposableMap>
            </div>

            {/* Desktop panel — slides in from right */}
            <div
              className={`
                hidden lg:flex lg:flex-col
                absolute top-0 right-0 h-full w-[38%]
                border-l border-[#90e0ef]/[0.08]
                transition-transform duration-500 ease-out
                ${active ? "translate-x-0" : "translate-x-full"}
              `}
              style={{ background: "rgba(1,8,24,0.96)", backdropFilter: "blur(16px)" }}
              aria-hidden={!active}
            >
              {active && <Panel uc={active} onClose={close} />}
            </div>
          </div>

          {/* Mobile panel — reveals below map */}
          <div
            className={`
              lg:hidden border border-t-0 border-[#90e0ef]/[0.08] rounded-b-sm
              overflow-hidden transition-all duration-500 ease-out
              ${active ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0"}
            `}
            style={{ background: "rgba(1,8,24,0.98)" }}
            aria-hidden={!active}
          >
            {active && <Panel uc={active} onClose={close} />}
          </div>
        </FadeIn>

        {/* Location index chips */}
        <FadeIn delay={160}>
          <div className="mt-6 flex flex-wrap gap-2">
            {USE_CASES.map((uc) => {
              const isActive = active?.id === uc.id;
              return (
                <button
                  key={uc.id}
                  onClick={() => setActive(isActive ? null : uc)}
                  className={`
                    inline-flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em]
                    border rounded-full transition-all duration-200
                    ${isActive
                      ? "border-[#0096c7] bg-[#0077b6]/15 text-white"
                      : "border-[#90e0ef]/20 text-[#90e0ef]/50 hover:border-[#90e0ef]/40 hover:text-[#90e0ef]/80"
                    }
                  `}
                >
                  <span
                    className="block w-1.5 h-1.5 rounded-full shrink-0"
                    style={{
                      background: uc.accent,
                      boxShadow: isActive ? `0 0 6px ${uc.accent}` : "none",
                    }}
                  />
                  {uc.markerLabel}
                </button>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
