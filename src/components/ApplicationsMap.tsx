"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import FadeIn from "@/components/FadeIn";
import { ArrowIcon, Eyebrow, Section } from "@/components/ui";

const GEO_URL = "/world-110m.json";

interface UseCase {
  id: string;
  group: "wind" | "further";
  region: string;
  title: string;
  markerLabel: string;
  coords: string;
  coordinates: [number, number];
  description: string;
  points?: string[];
  photo: string;
  photoAlt: string;
  credit: string | null;
  objectPosition?: string;
}

const USE_CASES: UseCase[] = [
  {
    id: "north-sea",
    group: "wind",
    region: "North Sea, Europe",
    title: "Offshore Wind",
    markerLabel: "North Sea",
    coords: "56.0°N 3.0°E",
    coordinates: [3, 56],
    description:
      "The North Sea is Europe's largest offshore wind region, and much of each farm's risk sits on the seabed. Casper inspects these assets on a recurring schedule, so operators see burial depth and scour change between campaigns instead of discovering the damage after a fault.",
    points: [
      "Export and array cables lose burial as sediment moves, leaving them exposed or free-spanning.",
      "Scour strips sediment and rock protection from around monopile foundations.",
      "Floating wind turbines depend on mooring lines that wear and fatigue over time.",
    ],
    photo: "/offshore-wind.jpg",
    photoAlt: "Offshore wind farm seen from above the sea",
    credit: "Photo by Nicholas Doherty on Unsplash",
  },
  {
    id: "baltic-sea",
    group: "wind",
    region: "Baltic Sea, Europe",
    title: "Offshore Wind",
    markerLabel: "Baltic Sea",
    coords: "57.0°N 20.0°E",
    coordinates: [20, 57],
    description:
      "Offshore wind in the Baltic is growing quickly, and new farms connect to shore through long export cables that cross busy shipping lanes. Anchor drag and fishing gear add to the usual risk of cable exposure and foundation scour, so a current record of each cable route lets operators catch damage early and plan the repair.",
    points: [
      "Cable burial and exposure along export and array routes.",
      "Scour around foundations as the seabed shifts.",
      "Third-party damage from anchors and fishing gear.",
    ],
    photo: "/subsea-cable.png",
    photoAlt: "Illustration of a subsea power cable on the seabed",
    credit: null,
  },
  {
    id: "gulf-mexico",
    group: "further",
    region: "Gulf of Mexico, USA",
    title: "Oil & Gas Pipelines",
    markerLabel: "Gulf of Mexico",
    coords: "24.0°N 90.0°W",
    coordinates: [-90, 24],
    description:
      "Thousands of miles of pipeline cross the Gulf of Mexico seabed, and most are checked by periodic surveys. Recurring inspection for corrosion, exposure, and third-party damage on shallower lines is a future application for Casper.",
    photo: "/pipeline.jpeg",
    photoAlt: "Subsea pipeline on the seabed",
    credit: null,
  },
  {
    id: "pre-salt-brazil",
    group: "further",
    region: "Pre-Salt Basin, Brazil",
    title: "Deepwater Production",
    markerLabel: "Pre-Salt Basin",
    coords: "23.0°S 40.0°W",
    coordinates: [-40, -23],
    description:
      "Pre-salt fields off Brazil sit in water far deeper than Casper's 300 m rating. Inspecting risers, wellheads, and the seabed around them is a future application that would need a deeper-rated vehicle.",
    photo: "/oil-rig.jpg",
    photoAlt: "Semi-submersible drilling rig at sea",
    credit: "Photo by Grant Durr on Unsplash",
    /* Portrait photo: the rig occupies roughly the 37–82% band of its height */
    objectPosition: "center 66%",
  },
  {
    id: "great-barrier-reef",
    group: "further",
    region: "Great Barrier Reef, Australia",
    title: "Environmental Monitoring",
    markerLabel: "Barrier Reef",
    coords: "18.0°S 148.0°E",
    coordinates: [148, -18],
    description:
      "Reef ecosystems respond to small changes in temperature, sediment, and water quality. Repeated surveys of protected areas without surface disturbance are a future environmental monitoring application.",
    photo: "/coral-reef.jpg",
    photoAlt: "Coral reef underwater",
    credit: "Photo by Francesco Ungaro on Unsplash",
  },
];

const WIND = USE_CASES.filter((u) => u.group === "wind");
const FURTHER = USE_CASES.filter((u) => u.group === "further");

function LocationButton({
  uc,
  active,
  onSelect,
}: {
  uc: UseCase;
  active: boolean;
  onSelect: () => void;
}) {
  const wind = uc.group === "wind";
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`group w-full text-left flex items-center justify-between gap-4 border-l-2 px-4 py-3 transition-colors duration-300 ${
        active
          ? "border-cyan bg-cyan/[0.08] text-white"
          : "border-foam/15 text-body hover:border-foam/50 hover:bg-white/[0.03] hover:text-white"
      }`}
    >
      <span>
        <span className={`block font-semibold ${wind ? "text-base" : "text-sm"}`}>{uc.markerLabel}</span>
        <span className="block font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted mt-0.5">
          {uc.title}
        </span>
      </span>
      <span
        className={`font-mono text-[10px] tracking-[0.1em] transition-colors ${
          active ? "text-cyan" : "text-muted/70 group-hover:text-foam"
        }`}
      >
        {uc.coords}
      </span>
    </button>
  );
}

export default function ApplicationsMap() {
  const [activeId, setActiveId] = useState("north-sea");
  const active = USE_CASES.find((u) => u.id === activeId)!;

  return (
    <Section depth="140 m">
      <FadeIn>
        <Eyebrow index="03">Applications</Eyebrow>
      </FadeIn>
      <FadeIn delay={60}>
        <div className="mt-8 grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-end">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.04] tracking-[-0.025em] text-white">
            Built for offshore wind first.
          </h2>
          <p className="text-body text-base lg:text-lg leading-relaxed max-w-lg">
            Casper inspects infrastructure at depths to 300&nbsp;m, starting with
            the cables, foundations, and moorings of offshore wind farms. Deeper
            basins and environmental monitoring are future applications. Select
            a location to see the use case.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={120}>
        <div className="mt-14 grid lg:grid-cols-[1.45fr_1fr] gap-px bg-foam/12 border border-foam/12">
          {/* Map and location index */}
          <div className="bg-[#030f1f]">
            <div className="relative">
              <ComposableMap
                projection="geoNaturalEarth1"
                projectionConfig={{ scale: 153, center: [10, 10] }}
                style={{ width: "100%", height: "auto", display: "block" }}
                aria-hidden
              >
                <Geographies geography={GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#06182c"
                        stroke="#12304d"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {USE_CASES.map((uc) => {
                  const isActive = uc.id === activeId;
                  const wind = uc.group === "wind";
                  const color = wind ? "#22d3ee" : "#90e0ef";
                  return (
                    <Marker key={uc.id} coordinates={uc.coordinates}>
                      <g onClick={() => setActiveId(uc.id)} style={{ cursor: "pointer" }}>
                        {(wind || isActive) && (
                          <circle r={8} fill="none" stroke={color} strokeWidth={1} className="map-ping" />
                        )}
                        <circle r={14} fill="transparent" />
                        <g
                          style={{
                            transform: `scale(${isActive ? 1.45 : 1})`,
                            transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
                          }}
                        >
                          <circle
                            r={wind ? 4.5 : 3.5}
                            fill={isActive ? color : wind ? "#0a5d7a" : "#0a2a44"}
                            stroke={color}
                            strokeOpacity={wind || isActive ? 1 : 0.55}
                            strokeWidth={1}
                            style={{ transition: "fill 0.35s ease" }}
                          />
                        </g>
                        <text
                          textAnchor="middle"
                          y={-12}
                          style={{
                            fontSize: "7.5px",
                            fill: isActive ? "#ffffff" : wind ? "rgba(144,224,239,0.85)" : "rgba(144,224,239,0.5)",
                            fontWeight: isActive ? 700 : 500,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            fontFamily: "var(--font-jetbrains-mono), monospace",
                            pointerEvents: "none",
                            transition: "fill 0.35s ease",
                            paintOrder: "stroke",
                            stroke: "#030f1f",
                            strokeWidth: "3px",
                            strokeLinejoin: "round",
                          }}
                        >
                          {uc.markerLabel}
                        </text>
                      </g>
                    </Marker>
                  );
                })}
              </ComposableMap>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 border-t border-foam/12 p-6 lg:p-8">
              <div>
                <p className="label-mono !text-cyan mb-4">Offshore wind · Lead market</p>
                <div className="flex flex-col gap-2">
                  {WIND.map((uc) => (
                    <LocationButton key={uc.id} uc={uc} active={uc.id === activeId} onSelect={() => setActiveId(uc.id)} />
                  ))}
                </div>
              </div>
              <div>
                <p className="label-mono mb-4">Further applications</p>
                <div className="flex flex-col gap-2">
                  {FURTHER.map((uc) => (
                    <LocationButton key={uc.id} uc={uc} active={uc.id === activeId} onSelect={() => setActiveId(uc.id)} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detail panel */}
          <div className="bg-[#030f1f]" aria-live="polite">
            <div key={active.id} className="panel-in flex flex-col h-full">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={active.photo}
                  alt={active.photoAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  style={{ objectPosition: active.objectPosition }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(3,15,31,0.9) 0%, rgba(3,15,31,0.1) 50%, transparent 100%)" }}
                />
                <div className="absolute bottom-0 inset-x-0 px-6 pb-4 flex items-end justify-between gap-3">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/80">{active.region}</p>
                  {active.credit && <p className="text-[10px] text-white/55 text-right">{active.credit}</p>}
                </div>
              </div>

              <div className="flex flex-col flex-1 p-6 lg:p-8">
                <p className={`label-mono ${active.group === "wind" ? "!text-cyan" : ""}`}>
                  {active.group === "wind" ? "Offshore wind · Lead market" : "Further application · Future"}
                </p>
                <h3 className="mt-3 text-2xl lg:text-3xl font-bold text-white leading-tight">
                  {active.title}
                </h3>
                <p className="mt-4 text-body text-[0.95rem] leading-relaxed">{active.description}</p>
                {active.points && (
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {active.points.map((p) => (
                      <li key={p} className="grid grid-cols-[1rem_1fr] gap-2 text-sm text-body leading-relaxed">
                        <span aria-hidden className="mt-[0.6rem] h-px w-2.5 bg-cyan" />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto pt-6">
                  <Link
                    href="/contact"
                    className="link-arrow inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan hover:text-white transition-colors"
                  >
                    Discuss This Application
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
