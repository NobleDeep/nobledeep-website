"use client";

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import type { UseCase } from "@/components/ApplicationsMap";

const GEO_URL = "/world-110m.json";

/* World map with application markers. Loaded lazily by ApplicationsMap. */
export default function WorldMap({
  cases,
  activeId,
  onSelect,
}: {
  cases: UseCase[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
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

      {cases.map((uc) => {
        const isActive = uc.id === activeId;
        const wind = uc.group === "wind";
        const color = wind ? "#22d3ee" : "#90e0ef";
        return (
          <Marker key={uc.id} coordinates={uc.coordinates}>
            <g onClick={() => onSelect(uc.id)} style={{ cursor: "pointer" }}>
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
                textAnchor={uc.label === "left" ? "end" : uc.label === "right" ? "start" : "middle"}
                x={uc.label === "left" ? -11 : uc.label === "right" ? 11 : 0}
                y={uc.label === "top" ? -12 : 2.5}
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
  );
}
