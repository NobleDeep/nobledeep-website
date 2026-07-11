"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
  Scroll-scrubbed schematic of the resident operating cycle.

  The SVG is authored in its resting state (vehicle docked, charging) so
  the no-JS render, the reduced-motion fallback, and the loop end-state
  are all the same frame. All geometry is deliberately abstract — a
  rounded capsule, flat silhouettes — per the disclosure policy.

  Desktop: section pins and the timeline scrubs with scroll.
  Mobile: no pin — the sequence plays once when scrolled into view.
  Reduced motion: no animation; captions swap to a static step list
  via Tailwind's motion-reduce variants.
*/

const steps = [
  "01 · Resident at the dock — charging",
  "02 · Undocks autonomously",
  "03 · Transits to the asset",
  "04 · Scans the structure",
  "05 · Data delivered to operations",
  "06 · Returns, recharges, repeats",
];

export default function HowTritonWorks() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(rootRef);

    mm.add(
      {
        desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { desktop } = context.conditions as { desktop: boolean; mobile: boolean };
        const stage = rootRef.current!.querySelector(".hw-stage");

        // "from" states that differ from the static resting frame
        gsap.set(".hw-bar", { scaleY: 0, transformOrigin: "center bottom" });
        gsap.set(".hw-pileglow", { strokeDasharray: 1, strokeDashoffset: 1 });

        const tl = gsap.timeline({
          scrollTrigger: desktop
            ? {
                trigger: stage,
                start: "top 88",
                end: "+=220%",
                pin: true,
                scrub: 0.6,
                anticipatePin: 1,
              }
            : {
                trigger: stage,
                start: "top 72%",
                once: true,
              },
        });

        // 01 — charging pulse at the dock
        tl.to(".hw-ring1", { attr: { r: 64 }, opacity: 0, duration: 1.1, ease: "none" }, 0)
          .to(".hw-ring2", { attr: { r: 72 }, opacity: 0, duration: 1.1, ease: "none" }, 0.25)

          // 02 — undock
          .to(".hw-cap-0", { opacity: 0, duration: 0.25 }, 1.3)
          .to(".hw-cap-1", { opacity: 1, duration: 0.3 }, 1.6)
          .to(".hw-thrust", { opacity: 0.85, duration: 0.4, stagger: 0.08 }, 1.6)
          .to(".hw-veh", { y: 320, duration: 1, ease: "power1.inOut" }, 1.6)

          // 03 — transit to the asset
          .to(".hw-cap-1", { opacity: 0, duration: 0.25 }, 2.6)
          .to(".hw-cap-2", { opacity: 1, duration: 0.3 }, 2.9)
          .to(".hw-veh", { x: 640, duration: 2, ease: "power1.inOut" }, 2.7)
          .to(".hw-veh", { y: 300, duration: 2, ease: "sine.inOut" }, 2.7)

          // 04 — scan the structure
          .to(".hw-cap-2", { opacity: 0, duration: 0.25 }, 4.6)
          .to(".hw-cap-3", { opacity: 1, duration: 0.3 }, 4.9)
          .to(".hw-thrust", { opacity: 0.15, duration: 0.4 }, 4.7)
          .to(".hw-arc", { opacity: 0.9, duration: 0.5, stagger: 0.35 }, 4.9)
          .to(".hw-arc", { opacity: 0, duration: 0.5, stagger: 0.35 }, 5.5)
          .to(".hw-pileglow", { opacity: 0.9, duration: 0.2 }, 4.9)
          .to(".hw-pileglow", { strokeDashoffset: 0, duration: 1.6, ease: "none" }, 4.9)

          // 05 — data delivery
          .to(".hw-cap-3", { opacity: 0, duration: 0.25 }, 6.6)
          .to(".hw-cap-4", { opacity: 1, duration: 0.3 }, 6.9)
          .to(".hw-dataline", { opacity: 0.7, duration: 0.4 }, 6.8)
          .set(".hw-datadot", { opacity: 1 }, 7.0)
          .to(".hw-datadot", { attr: { cx: 890, cy: 105 }, duration: 1, ease: "power1.in" }, 7.0)
          .to(".hw-datadot", { opacity: 0, duration: 0.2 }, 8.0)
          .to(".hw-bar", { scaleY: 1, duration: 0.5, stagger: 0.12 }, 7.6)

          // 06 — return and re-dock
          .to(".hw-cap-4", { opacity: 0, duration: 0.25 }, 8.2)
          .to(".hw-cap-5", { opacity: 1, duration: 0.3 }, 8.5)
          .to(".hw-dataline", { opacity: 0, duration: 0.4 }, 8.3)
          .to(".hw-pileglow", { opacity: 0, duration: 0.4 }, 8.3)
          .to(".hw-thrust", { opacity: 0.85, duration: 0.3 }, 8.3)
          .set(".hw-veh", { scaleX: -1, transformOrigin: "50% 50%" }, 8.5)
          .to(".hw-veh", { x: 155, duration: 1.8, ease: "power1.inOut" }, 8.6)
          .to(".hw-veh", { y: 404, duration: 0.8, ease: "power1.in" }, 9.6)
          .to(".hw-thrust", { opacity: 0, duration: 0.3 }, 9.9)
          .set(".hw-veh", { scaleX: 1 }, 10.2)
          .to(".hw-ring1", { attr: { r: 34 }, opacity: 0.35, duration: 0.5 }, 10.2)
          .to(".hw-ring2", { attr: { r: 50 }, opacity: 0.15, duration: 0.5 }, 10.3)
          .to({}, { duration: 0.4 });

        if (!desktop) tl.timeScale(1.3);
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <div
        className="hw-stage relative border border-[#90e0ef]/[0.1] bg-[#021233]/40 overflow-hidden"
        style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(144,224,239,0.06)" }}
      >
        <svg
          viewBox="0 0 1000 520"
          className="w-full h-auto max-h-[70vh]"
          role="img"
          aria-label="Schematic of the TRITON operating cycle: the vehicle charges at its seafloor dock, undocks, transits to a wind-turbine foundation, scans it, sends data to an operations dashboard, and returns to the dock."
        >
          {/* Waterline */}
          <path
            d="M0 64 Q 40 58 80 64 T 160 64 T 240 64 T 320 64 T 400 64 T 480 64 T 560 64 T 640 64 T 720 64 T 800 64 T 880 64 T 960 64 T 1040 64"
            fill="none"
            stroke="#90e0ef"
            strokeOpacity={0.25}
            strokeWidth={2}
          />

          {/* Turbine above the waterline — simple silhouette */}
          <g stroke="#90e0ef" strokeOpacity={0.5} strokeWidth={2} strokeLinecap="round">
            <line x1={790} y1={64} x2={790} y2={20} />
            <line x1={790} y1={20} x2={790} y2={6} />
            <line x1={790} y1={20} x2={803} y2={28} />
            <line x1={790} y1={20} x2={777} y2={28} />
          </g>

          {/* Monopile foundation */}
          <rect x={775} y={64} width={30} height={396} fill="#023e8a" fillOpacity={0.55} stroke="#90e0ef" strokeOpacity={0.35} strokeWidth={1.5} />
          {/* Scan draw-on highlight along the pile face */}
          <line className="hw-pileglow" x1={775} y1={120} x2={775} y2={455} pathLength={1} stroke="#22d3ee" strokeWidth={3} opacity={0} />

          {/* Seafloor */}
          <path
            d="M0 460 Q 90 452 180 460 T 400 462 T 620 458 T 840 462 T 1000 460 L 1000 520 L 0 520 Z"
            fill="#021233"
            stroke="#90e0ef"
            strokeOpacity={0.2}
            strokeWidth={1.5}
          />
          <circle cx={330} cy={470} r={3} fill="#90e0ef" fillOpacity={0.15} />
          <circle cx={505} cy={474} r={4} fill="#90e0ef" fillOpacity={0.12} />
          <circle cx={905} cy={472} r={3} fill="#90e0ef" fillOpacity={0.15} />

          {/* Dock */}
          <g>
            <rect x={80} y={440} width={150} height={20} rx={3} fill="#023e8a" stroke="#90e0ef" strokeOpacity={0.3} strokeWidth={1.5} />
            <rect x={100} y={426} width={10} height={14} rx={2} fill="#023e8a" stroke="#90e0ef" strokeOpacity={0.3} strokeWidth={1.5} />
            <rect x={200} y={426} width={10} height={14} rx={2} fill="#023e8a" stroke="#90e0ef" strokeOpacity={0.3} strokeWidth={1.5} />
          </g>

          {/* Charging pulse rings (visible faintly in the resting frame) */}
          <circle className="hw-ring1" cx={155} cy={404} r={34} fill="none" stroke="#22d3ee" strokeWidth={2} opacity={0.35} />
          <circle className="hw-ring2" cx={155} cy={404} r={50} fill="none" stroke="#22d3ee" strokeWidth={1.5} opacity={0.15} />

          {/* Scan arcs (hidden at rest) */}
          <path className="hw-arc" d="M 706 260 A 40 40 0 0 1 706 340" fill="none" stroke="#22d3ee" strokeWidth={2} opacity={0} />
          <path className="hw-arc" d="M 706 235 A 65 65 0 0 1 706 365" fill="none" stroke="#22d3ee" strokeWidth={2} opacity={0} />
          <path className="hw-arc" d="M 706 210 A 90 90 0 0 1 706 390" fill="none" stroke="#22d3ee" strokeWidth={2} opacity={0} />

          {/* Data uplink (hidden at rest) */}
          <line className="hw-dataline" x1={720} y1={270} x2={890} y2={105} stroke="#90e0ef" strokeOpacity={0.6} strokeWidth={1.5} strokeDasharray="4 6" opacity={0} />
          <circle className="hw-datadot" cx={720} cy={270} r={5} fill="#22d3ee" opacity={0} />

          {/* Operations dashboard — fixed HUD element above the waterline */}
          <g>
            <rect x={845} y={48} width={115} height={72} rx={4} fill="#021233" stroke="#90e0ef" strokeOpacity={0.4} strokeWidth={1.5} />
            <rect x={863} y={60} width={40} height={4} rx={2} fill="#90e0ef" fillOpacity={0.5} />
            <rect className="hw-bar" x={863} y={92} width={16} height={18} fill="#22d3ee" fillOpacity={0.8} />
            <rect className="hw-bar" x={891} y={80} width={16} height={30} fill="#22d3ee" fillOpacity={0.8} />
            <rect className="hw-bar" x={919} y={70} width={16} height={40} fill="#22d3ee" fillOpacity={0.8} />
          </g>

          {/* TRITON — abstract rounded capsule, no mechanism detail */}
          <g className="hw-veh" transform="translate(155, 404)">
            <line className="hw-thrust" x1={-64} y1={-8} x2={-82} y2={-10} stroke="#22d3ee" strokeWidth={2} strokeLinecap="round" opacity={0} />
            <line className="hw-thrust" x1={-64} y1={0} x2={-88} y2={0} stroke="#22d3ee" strokeWidth={2} strokeLinecap="round" opacity={0} />
            <line className="hw-thrust" x1={-64} y1={8} x2={-82} y2={10} stroke="#22d3ee" strokeWidth={2} strokeLinecap="round" opacity={0} />
            <rect x={-52} y={-20} width={104} height={40} rx={20} fill="#0077b6" stroke="#90e0ef" strokeOpacity={0.8} strokeWidth={2} />
            <circle cx={-52} cy={0} r={9} fill="none" stroke="#90e0ef" strokeOpacity={0.6} strokeWidth={2} />
            <circle cx={32} cy={-2} r={6} fill="#22d3ee" fillOpacity={0.9} />
          </g>
        </svg>

        {/* Step caption — crossfaded by the timeline; hidden under reduced motion */}
        <div className="motion-reduce:hidden absolute bottom-4 left-5 sm:bottom-5 sm:left-6 h-5">
          {steps.map((s, i) => (
            <span
              key={s}
              className={`hw-cap-${i} absolute left-0 bottom-0 whitespace-nowrap text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#90e0ef]/70 ${
                i === 0 ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Reduced-motion fallback: the cycle as a static labeled list */}
      <div className="hidden motion-reduce:grid mt-6 grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
        {steps.map((s) => (
          <p key={s} className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#90e0ef]/70">
            {s}
          </p>
        ))}
      </div>
    </div>
  );
}
