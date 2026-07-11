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
  rounded capsule with schematic details, flat silhouettes — per the
  disclosure policy. Background and particle layers move at a slower
  rate than the vehicle during transit for parallax depth.

  Desktop: section pins and the timeline scrubs (damped) with scroll.
  Mobile: no pin — the sequence plays once when scrolled into view.
  Reduced motion: no animation; captions swap to a static step list
  via Tailwind's motion-reduce variants.
*/

const steps = [
  "01 · Resident at the dock — charging",
  "02 · Undocks autonomously",
  "03 · Transits to the asset",
  "04 · Scans the structure",
  "05 · Structural condition data — anomaly reports, corrosion mapping, geo-referenced imagery",
  "06 · Returns, recharges, repeats",
];

/* Ambient particle field — static coords, drift added at runtime */
const particles = [
  [90, 150, 2], [220, 320, 1.5], [340, 110, 2.5], [430, 250, 1.5], [520, 380, 2],
  [610, 140, 1.5], [680, 330, 2], [760, 220, 1.5], [850, 400, 2.5], [930, 170, 2],
  [160, 420, 1.5], [500, 180, 1.5], [720, 420, 2], [280, 210, 2],
] as const;

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
        gsap.set(".hw-arc", { scale: 0.85, svgOrigin: "706 300" });

        // Ambient drift — continuous, independent of scroll
        gsap.to(".hw-mid", {
          y: 9,
          duration: 7,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: desktop
            ? {
                trigger: stage,
                start: "top 88",
                end: "+=220%",
                pin: true,
                scrub: 1,
                anticipatePin: 1,
              }
            : {
                trigger: stage,
                start: "top 72%",
                once: true,
              },
        });

        // 01 — charging pulse at the dock
        tl.to(".hw-ring1", { attr: { r: 64 }, opacity: 0, duration: 1.1, ease: "power2.out" }, 0)
          .to(".hw-ring2", { attr: { r: 72 }, opacity: 0, duration: 1.1, ease: "power2.out" }, 0.35)

          // 02 — undock
          .to(".hw-cap-0", { opacity: 0, duration: 0.25, ease: "power1.out" }, 1.3)
          .to(".hw-cap-1", { opacity: 1, duration: 0.3, ease: "power1.in" }, 1.6)
          .to(".hw-thrust", { opacity: 0.85, duration: 0.4, ease: "power2.out", stagger: 0.12 }, 1.6)
          .to(".hw-veh", { y: 320, duration: 1, ease: "power2.inOut" }, 1.7)

          // 03 — transit to the asset (background layers lag for parallax)
          .to(".hw-cap-1", { opacity: 0, duration: 0.25, ease: "power1.out" }, 2.6)
          .to(".hw-cap-2", { opacity: 1, duration: 0.3, ease: "power1.in" }, 2.9)
          .to(".hw-veh", { x: 640, duration: 2, ease: "power2.inOut" }, 2.7)
          .to(".hw-veh", { y: 300, duration: 2, ease: "sine.inOut" }, 2.7)
          .to(".hw-bg", { x: -55, duration: 2, ease: "power2.inOut" }, 2.75)
          .to(".hw-mid", { x: -105, duration: 2, ease: "power2.inOut" }, 2.72)

          // 04 — scan the structure
          .to(".hw-cap-2", { opacity: 0, duration: 0.25, ease: "power1.out" }, 4.6)
          .to(".hw-cap-3", { opacity: 1, duration: 0.3, ease: "power1.in" }, 4.9)
          .to(".hw-thrust", { opacity: 0.15, duration: 0.4, ease: "power2.out", stagger: 0.08 }, 4.7)
          .to(".hw-arc", { opacity: 0.9, scale: 1, duration: 0.5, ease: "power2.out", stagger: 0.35 }, 4.9)
          .to(".hw-arc", { opacity: 0, duration: 0.5, ease: "power2.in", stagger: 0.35 }, 5.5)
          .to(".hw-pileglow", { opacity: 0.9, duration: 0.3, ease: "power2.out" }, 4.9)
          .to(".hw-pileglow", { strokeDashoffset: 0, duration: 1.6, ease: "power1.inOut" }, 4.9)

          // 05 — structural condition data delivered
          .to(".hw-cap-3", { opacity: 0, duration: 0.25, ease: "power1.out" }, 6.6)
          .to(".hw-cap-4", { opacity: 1, duration: 0.3, ease: "power1.in" }, 6.9)
          .to(".hw-dataline", { opacity: 0.7, duration: 0.4, ease: "power2.out" }, 6.8)
          .to(".hw-datadot", { opacity: 1, duration: 0.2, ease: "power2.out" }, 6.95)
          .to(".hw-datadot", { attr: { cx: 890, cy: 105 }, duration: 1, ease: "power2.inOut" }, 7.0)
          .to(".hw-datadot", { opacity: 0, duration: 0.25, ease: "power2.in" }, 7.95)
          .to(".hw-bar", { scaleY: 1, duration: 0.5, ease: "back.out(1.4)", stagger: 0.12 }, 7.6)

          // 06 — return and re-dock
          .to(".hw-cap-4", { opacity: 0, duration: 0.25, ease: "power1.out" }, 8.2)
          .to(".hw-cap-5", { opacity: 1, duration: 0.3, ease: "power1.in" }, 8.5)
          .to(".hw-dataline", { opacity: 0, duration: 0.4, ease: "power2.in" }, 8.3)
          .to(".hw-pileglow", { opacity: 0, duration: 0.4, ease: "power2.in" }, 8.3)
          .to(".hw-thrust", { opacity: 0.85, duration: 0.3, ease: "power2.out", stagger: 0.1 }, 8.35)
          .set(".hw-veh", { scaleX: -1, transformOrigin: "50% 50%" }, 8.5)
          .to(".hw-veh", { x: 155, duration: 1.8, ease: "power2.inOut" }, 8.6)
          .to(".hw-bg", { x: 0, duration: 1.8, ease: "power2.inOut" }, 8.65)
          .to(".hw-mid", { x: 0, duration: 1.8, ease: "power2.inOut" }, 8.62)
          .to(".hw-veh", { y: 404, duration: 0.8, ease: "power2.inOut" }, 9.6)
          .to(".hw-thrust", { opacity: 0, duration: 0.3, ease: "power2.in", stagger: 0.08 }, 9.9)
          .set(".hw-veh", { scaleX: 1 }, 10.25)
          .to(".hw-ring1", { attr: { r: 34 }, opacity: 0.35, duration: 0.5, ease: "power2.out" }, 10.3)
          .to(".hw-ring2", { attr: { r: 50 }, opacity: 0.15, duration: 0.5, ease: "power2.out" }, 10.4)
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
          aria-label="Schematic of the TRITON operating cycle: the vehicle charges at its seafloor dock, undocks, transits to a wind-turbine foundation, scans it, sends structural condition data to an operations dashboard, and returns to the dock."
        >
          <defs>
            {/* Water column — surface-light to seafloor-dark bands */}
            <linearGradient id="hwSea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0077b6" stopOpacity="0.5" />
              <stop offset="42%" stopColor="#023e8a" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#021233" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="hwHull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0096c7" />
              <stop offset="100%" stopColor="#0077b6" />
            </linearGradient>
            <linearGradient id="hwPile" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0077b6" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#023e8a" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="hwDock" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#023e8a" />
              <stop offset="100%" stopColor="#021233" />
            </linearGradient>
            {/* Soft glow for pulses, scan arcs, and the data packet */}
            <filter id="hwGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Far layer — water gradient, oversized so parallax never shows an edge */}
          <g className="hw-bg">
            <rect x={-150} y={64} width={1300} height={396} fill="url(#hwSea)" />
          </g>

          {/* Mid layer — ambient particle drift, parallaxes faster than the far layer */}
          <g className="hw-mid">
            {particles.map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="#90e0ef" fillOpacity={i % 3 ? 0.1 : 0.18} />
            ))}
          </g>

          {/* Waterline */}
          <path
            d="M0 64 Q 40 58 80 64 T 160 64 T 240 64 T 320 64 T 400 64 T 480 64 T 560 64 T 640 64 T 720 64 T 800 64 T 880 64 T 960 64 T 1040 64"
            fill="none"
            stroke="#90e0ef"
            strokeOpacity={0.25}
            strokeWidth={1.5}
          />

          {/* Turbine above the waterline — simple silhouette */}
          <g stroke="#90e0ef" strokeOpacity={0.5} strokeWidth={1.5} strokeLinecap="round">
            <line x1={790} y1={64} x2={790} y2={20} />
            <rect x={784} y={16} width={12} height={5} rx={2} fill="#023e8a" />
            <line x1={790} y1={18} x2={790} y2={4} />
            <line x1={790} y1={18} x2={804} y2={26} />
            <line x1={790} y1={18} x2={776} y2={26} />
          </g>

          {/* Monopile foundation — transition piece, pile, flange lines */}
          <g stroke="#90e0ef" strokeOpacity={0.35} strokeWidth={1.5}>
            <rect x={770} y={64} width={40} height={42} fill="url(#hwPile)" />
            <rect x={775} y={106} width={30} height={354} fill="url(#hwPile)" />
            <line x1={775} y1={190} x2={805} y2={190} />
            <line x1={775} y1={310} x2={805} y2={310} />
            <line x1={770} y1={86} x2={810} y2={86} />
          </g>
          {/* Scan draw-on highlight along the pile face */}
          <line className="hw-pileglow" x1={775} y1={120} x2={775} y2={455} pathLength={1} stroke="#22d3ee" strokeWidth={2} opacity={0} filter="url(#hwGlow)" />

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
            <rect x={80} y={440} width={150} height={20} rx={3} fill="url(#hwDock)" stroke="#90e0ef" strokeOpacity={0.3} strokeWidth={1.5} />
            <rect x={100} y={426} width={10} height={14} rx={2} fill="#023e8a" stroke="#90e0ef" strokeOpacity={0.3} strokeWidth={1.5} />
            <rect x={200} y={426} width={10} height={14} rx={2} fill="#023e8a" stroke="#90e0ef" strokeOpacity={0.3} strokeWidth={1.5} />
            <circle cx={222} cy={450} r={3} fill="#22d3ee" fillOpacity={0.8} filter="url(#hwGlow)" />
          </g>

          {/* Charging pulse rings (visible faintly in the resting frame) */}
          <circle className="hw-ring1" cx={155} cy={404} r={34} fill="none" stroke="#22d3ee" strokeWidth={2} opacity={0.35} filter="url(#hwGlow)" />
          <circle className="hw-ring2" cx={155} cy={404} r={50} fill="none" stroke="#22d3ee" strokeWidth={2} opacity={0.15} filter="url(#hwGlow)" />

          {/* Scan arcs (hidden at rest) */}
          <path className="hw-arc" d="M 706 260 A 40 40 0 0 1 706 340" fill="none" stroke="#22d3ee" strokeWidth={2} opacity={0} filter="url(#hwGlow)" />
          <path className="hw-arc" d="M 706 235 A 65 65 0 0 1 706 365" fill="none" stroke="#22d3ee" strokeWidth={2} opacity={0} filter="url(#hwGlow)" />
          <path className="hw-arc" d="M 706 210 A 90 90 0 0 1 706 390" fill="none" stroke="#22d3ee" strokeWidth={2} opacity={0} filter="url(#hwGlow)" />

          {/* Data uplink (hidden at rest) */}
          <line className="hw-dataline" x1={720} y1={270} x2={890} y2={105} stroke="#90e0ef" strokeOpacity={0.6} strokeWidth={2} strokeDasharray="4 6" opacity={0} />
          <circle className="hw-datadot" cx={720} cy={270} r={5} fill="#22d3ee" opacity={0} filter="url(#hwGlow)" />

          {/* Operations dashboard — stroke style matches the site's icon set */}
          <g strokeLinecap="round">
            <rect x={845} y={48} width={115} height={72} rx={4} fill="#021233" stroke="#90e0ef" strokeOpacity={0.5} strokeWidth={2} />
            <line x1={863} y1={62} x2={903} y2={62} stroke="#90e0ef" strokeOpacity={0.5} strokeWidth={2} />
            <line className="hw-bar" x1={871} y1={106} x2={871} y2={92} stroke="#22d3ee" strokeOpacity={0.85} strokeWidth={6} />
            <line className="hw-bar" x1={899} y1={106} x2={899} y2={82} stroke="#22d3ee" strokeOpacity={0.85} strokeWidth={6} />
            <line className="hw-bar" x1={927} y1={106} x2={927} y2={72} stroke="#22d3ee" strokeOpacity={0.85} strokeWidth={6} />
          </g>

          {/* TRITON — abstract rounded capsule with schematic details only */}
          <g className="hw-veh" transform="translate(155, 404)">
            <line className="hw-thrust" x1={-68} y1={-8} x2={-86} y2={-10} stroke="#22d3ee" strokeWidth={2} strokeLinecap="round" opacity={0} />
            <line className="hw-thrust" x1={-68} y1={0} x2={-92} y2={0} stroke="#22d3ee" strokeWidth={2} strokeLinecap="round" opacity={0} />
            <line className="hw-thrust" x1={-68} y1={8} x2={-86} y2={10} stroke="#22d3ee" strokeWidth={2} strokeLinecap="round" opacity={0} />
            {/* thruster fairing */}
            <rect x={-64} y={-13} width={16} height={26} rx={6} fill="url(#hwHull)" stroke="#90e0ef" strokeOpacity={0.8} strokeWidth={2} />
            {/* camera-dome bump */}
            <path d="M 12 -19 a 11 11 0 0 1 22 0 Z" fill="url(#hwHull)" stroke="#90e0ef" strokeOpacity={0.8} strokeWidth={2} />
            {/* hull */}
            <rect x={-52} y={-20} width={104} height={40} rx={20} fill="url(#hwHull)" stroke="#90e0ef" strokeOpacity={0.8} strokeWidth={2} />
            {/* seam line */}
            <line x1={-8} y1={-19} x2={-8} y2={19} stroke="#90e0ef" strokeOpacity={0.3} strokeWidth={1.5} />
            {/* sensor eye */}
            <circle cx={32} cy={-2} r={6} fill="#22d3ee" fillOpacity={0.9} />
          </g>
        </svg>

        {/* Step caption — crossfaded by the timeline; hidden under reduced motion */}
        <div className="motion-reduce:hidden absolute bottom-4 left-5 right-5 sm:bottom-5 sm:left-6 sm:right-6 h-5">
          {steps.map((s, i) => (
            <span
              key={s}
              className={`hw-cap-${i} absolute left-0 bottom-0 w-full text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#90e0ef]/70 ${
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
