"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
  Scroll-scrubbed schematic of the resident operating cycle, with the
  cycle's step text rail driven by the same timeline so motion and
  elaboration stay in lockstep.

  The SVG is authored in its resting state (vehicle docked, charging) so
  the no-JS render, the reduced-motion fallback, and the loop end-state
  are all the same frame. All geometry is deliberately abstract — a
  rounded capsule with schematic details, flat silhouettes — per the
  disclosure policy.

  Depth: the light-shaft layer (.hw-bg) and particle layer (.hw-mid)
  are independent elements that translate at ~0.5x / ~0.6x of the
  vehicle's transit displacement, opposite its direction of travel —
  the differential rate is what reads as depth. Both live inside the
  overflow-hidden stage; the page itself never shifts during the pin.

  Desktop: section pins and the timeline scrubs (damped) with scroll.
  Mobile: no pin — the sequence plays once when scrolled into view.
  Reduced motion: no animation; the step rail shows all steps at full
  opacity via motion-reduce variants.
*/

// Keep editable — pending confirmation before any named standard is used.
const REPORT_TITLE = "Structural Condition Report";

const cycle = [
  {
    n: "01",
    title: "Deploy",
    body: "TRITON and its seabed docking station are installed at the asset in a single vessel visit. From that point the system operates from the dock — no surface support, no recurring vessel time.",
  },
  {
    n: "02",
    title: "Patrol",
    body: "The vehicle undocks and navigates pre-planned inspection routes along the structure, maintaining position with sensor-fused navigation (IMU, DVL, motor encoders) and using fused ranging data for wall-proximity awareness during transit.",
  },
  {
    n: "03",
    title: "Detect",
    body: "Onboard edge compute processes the inspection sensor stream in real time, classifying obstacles and flagging anomalies. Each detection is geotagged with the vehicle's fused position estimate.",
  },
  {
    n: "04",
    title: "Return & Recharge",
    body: "At mission end — or on low battery or a fault condition — TRITON homes to the dock using USBL acoustic positioning, latches, recharges, and offloads mission data over the dock link.",
  },
  {
    n: "05",
    title: "Repeat",
    body: "The vehicle remains resident at the dock between missions, targeting six months between major service intervals, and re-launches on schedule or on demand.",
  },
];

/* Ambient particle field — spread wide so the parallax shift never empties a region */
const particles = [
  [90, 150, 2], [220, 320, 1.5], [340, 110, 2.5], [430, 250, 1.5], [520, 380, 2],
  [610, 140, 1.5], [680, 330, 2], [760, 220, 1.5], [850, 400, 2.5], [930, 170, 2],
  [160, 420, 1.5], [500, 180, 1.5], [720, 420, 2], [280, 210, 2], [1030, 300, 2],
  [1120, 160, 1.5], [1210, 380, 2], [1300, 240, 1.5], [1400, 330, 2], [1490, 140, 2],
] as const;

/* Timeline positions where each cycle step becomes the active one */
const stepStarts = [0, 1.6, 4.7, 6.8, 10.3];

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
        const pinEl = rootRef.current!.querySelector(".hw-pin");

        // "from" states that differ from the static resting frame
        gsap.set(".hw-pileglow", { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(".hw-arc", { scale: 0.85, svgOrigin: "706 300" });
        gsap.set(".hw-chart", { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(".hw-flag", { scale: 0.5, svgOrigin: "920 127" });

        // Ambient particle drift — continuous, independent of scroll
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
                trigger: pinEl,
                start: "top 88",
                end: "+=220%",
                pin: true,
                scrub: 1,
                anticipatePin: 1,
              }
            : {
                trigger: pinEl,
                start: "top 72%",
                once: true,
              },
        });

        // Step rail — dim the finished step, light the next
        const activateStep = (i: number, at: number) => {
          tl.to(`.hw-step-${i - 1}`, { opacity: 0.4, duration: 0.35, ease: "power1.inOut" }, at)
            .to(`.hw-step-${i}`, { opacity: 1, duration: 0.35, ease: "power1.inOut" }, at + 0.05);
        };

        // 01 Deploy — charging pulse at the dock
        tl.to(".hw-ring1", { attr: { r: 64 }, opacity: 0, duration: 1.1, ease: "power2.out" }, 0)
          .to(".hw-ring2", { attr: { r: 72 }, opacity: 0, duration: 1.1, ease: "power2.out" }, 0.35)

          // 02 Patrol — undock + transit (background layers lag for parallax depth)
          .to(".hw-thrust", { opacity: 0.85, duration: 0.4, ease: "power2.out", stagger: 0.12 }, 1.6)
          .to(".hw-veh", { y: 320, duration: 1, ease: "power2.inOut" }, 1.7)
          .to(".hw-veh", { x: 640, duration: 2, ease: "power2.inOut" }, 2.7)
          .to(".hw-veh", { y: 300, duration: 2, ease: "sine.inOut" }, 2.7)
          .to(".hw-bg", { x: -240, duration: 2.1, ease: "power2.inOut" }, 2.68)
          .to(".hw-mid", { x: -290, duration: 2.05, ease: "power2.inOut" }, 2.64)

          // 03 Detect — scan the structure
          .to(".hw-thrust", { opacity: 0.15, duration: 0.4, ease: "power2.out", stagger: 0.08 }, 4.7)
          .to(".hw-arc", { opacity: 0.9, scale: 1, duration: 0.5, ease: "power2.out", stagger: 0.35 }, 4.9)
          .to(".hw-arc", { opacity: 0, duration: 0.5, ease: "power2.in", stagger: 0.35 }, 5.5)
          .to(".hw-pileglow", { opacity: 0.9, duration: 0.3, ease: "power2.out" }, 4.9)
          .to(".hw-pileglow", { strokeDashoffset: 0, duration: 1.6, ease: "power1.inOut" }, 4.9)

          // 04 Return & Recharge — condition report assembles, then home to dock
          .to(".hw-dataline", { opacity: 0.7, duration: 0.4, ease: "power2.out" }, 6.8)
          .to(".hw-datadot", { opacity: 1, duration: 0.2, ease: "power2.out" }, 6.95)
          .to(".hw-datadot", { attr: { cx: 860, cy: 172 }, duration: 1, ease: "power2.inOut" }, 7.0)
          .to(".hw-datadot", { opacity: 0, duration: 0.25, ease: "power2.in" }, 7.95)
          .to(".hw-chart", { opacity: 0.9, duration: 0.2, ease: "power2.out" }, 7.5)
          .to(".hw-chart", { strokeDashoffset: 0, duration: 0.9, ease: "power1.inOut" }, 7.5)
          .to(".hw-flag", { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, 8.15)
          .to(".hw-dataline", { opacity: 0, duration: 0.4, ease: "power2.in" }, 8.3)
          .to(".hw-pileglow", { opacity: 0, duration: 0.4, ease: "power2.in" }, 8.3)
          .to(".hw-thrust", { opacity: 0.85, duration: 0.3, ease: "power2.out", stagger: 0.1 }, 8.35)
          .set(".hw-veh", { scaleX: -1, transformOrigin: "50% 50%" }, 8.5)
          .to(".hw-veh", { x: 155, duration: 1.8, ease: "power2.inOut" }, 8.6)
          .to(".hw-bg", { x: 0, duration: 1.9, ease: "power2.inOut" }, 8.58)
          .to(".hw-mid", { x: 0, duration: 1.85, ease: "power2.inOut" }, 8.55)
          .to(".hw-veh", { y: 404, duration: 0.8, ease: "power2.inOut" }, 9.6)
          .to(".hw-thrust", { opacity: 0, duration: 0.3, ease: "power2.in", stagger: 0.08 }, 9.9)
          .set(".hw-veh", { scaleX: 1 }, 10.25)

          // 05 Repeat — resting state restored
          .to(".hw-ring1", { attr: { r: 34 }, opacity: 0.35, duration: 0.5, ease: "power2.out" }, 10.3)
          .to(".hw-ring2", { attr: { r: 50 }, opacity: 0.15, duration: 0.5, ease: "power2.out" }, 10.4)
          .to({}, { duration: 0.4 });

        for (let i = 1; i < cycle.length; i++) activateStep(i, stepStarts[i]);

        if (!desktop) tl.timeScale(1.3);
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef}>
      <div className="hw-pin grid gap-8 lg:gap-12 lg:grid-cols-[1.55fr_1fr] items-center">
        <div
          className="hw-stage relative border border-[#90e0ef]/[0.1] bg-[#021233]/40 overflow-hidden"
          style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(144,224,239,0.06)" }}
        >
          <svg
            viewBox="0 0 1000 520"
            className="w-full h-auto max-h-[70vh]"
            role="img"
            aria-label="Schematic of the TRITON operating cycle: the vehicle charges at its seafloor dock, undocks, transits to a wind-turbine foundation, scans it, compiles a structural condition report, and returns to the dock."
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
              {/* Light shafts fade with depth */}
              <linearGradient id="hwShaft" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#90e0ef" stopOpacity="0.09" />
                <stop offset="100%" stopColor="#90e0ef" stopOpacity="0" />
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

            {/* Static water gradient — uniform color, does not read as moving */}
            <rect x={0} y={64} width={1000} height={396} fill="url(#hwSea)" />

            {/* Far layer — light shafts, parallax at ~0.5x of vehicle transit */}
            <g className="hw-bg">
              {[[-60, 120], [190, 90], [470, 140], [740, 100], [1010, 130], [1280, 95]].map(([x, w], i) => (
                <path
                  key={i}
                  d={`M ${x} 64 L ${x + w} 64 L ${x + w - 150} 460 L ${x - 150} 460 Z`}
                  fill="url(#hwShaft)"
                />
              ))}
            </g>

            {/* Mid layer — ambient particles, parallax at ~0.6x */}
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
            <line className="hw-dataline" x1={720} y1={270} x2={860} y2={172} stroke="#90e0ef" strokeOpacity={0.6} strokeWidth={2} strokeDasharray="4 6" opacity={0} />
            <circle className="hw-datadot" cx={720} cy={270} r={5} fill="#22d3ee" opacity={0} filter="url(#hwGlow)" />

            {/* Mock inspection report — document card, greeked lines, chart, anomaly flag */}
            <g>
              <rect x={830} y={36} width={136} height={158} rx={4} fill="#021233" stroke="#90e0ef" strokeOpacity={0.5} strokeWidth={2} />
              <path d="M 830 40 a 4 4 0 0 1 4 -4 h 128 a 4 4 0 0 1 4 4 v 22 h -136 Z" fill="#023e8a" fillOpacity={0.9} />
              <text
                x={898}
                y={52}
                textAnchor="middle"
                fontSize={9}
                letterSpacing={0.4}
                fill="#90e0ef"
                style={{ fontFamily: "var(--font-space-grotesk), sans-serif", fontWeight: 600 }}
              >
                {REPORT_TITLE}
              </text>
              {/* greeked text lines */}
              <g stroke="#90e0ef" strokeOpacity={0.35} strokeWidth={3.5} strokeLinecap="round">
                <line x1={842} y1={78} x2={952} y2={78} />
                <line x1={842} y1={92} x2={928} y2={92} />
                <line x1={842} y1={106} x2={944} y2={106} />
              </g>
              {/* chart squiggle — draws in when data arrives */}
              <path
                className="hw-chart"
                d="M 842 168 L 858 158 L 874 164 L 890 146 L 906 154 L 920 136 L 938 146"
                pathLength={1}
                fill="none"
                stroke="#22d3ee"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0}
              />
              {/* anomaly flag — warning triangle + highlighted data point */}
              <g className="hw-flag" opacity={0}>
                <circle cx={920} cy={136} r={4} fill="#22d3ee" fillOpacity={0.9} filter="url(#hwGlow)" />
                <path d="M 920 112 L 928 126 L 912 126 Z" fill="none" stroke="#22d3ee" strokeWidth={2} strokeLinejoin="round" />
                <line x1={920} y1={117} x2={920} y2={121} stroke="#22d3ee" strokeWidth={1.5} strokeLinecap="round" />
                <circle cx={920} cy={123.5} r={0.8} fill="#22d3ee" />
              </g>
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
        </div>

        {/* Step rail — lit by the same timeline as the scene; full opacity under reduced motion */}
        <ol className="flex flex-col gap-5 lg:gap-6">
          {cycle.map((s, i) => (
            <li
              key={s.n}
              className={`hw-step-${i} grid grid-cols-[2.5rem_1fr] gap-4 ${
                i === 0 ? "" : "opacity-40 motion-reduce:opacity-100"
              }`}
            >
              <span className="text-xs font-bold text-[#22d3ee]/70 uppercase tracking-[0.2em] pt-0.5">
                {s.n}
              </span>
              <div>
                <h3 className="font-semibold text-white text-sm uppercase tracking-wide mb-1.5">
                  {s.title}
                </h3>
                <p className="text-[#90e0ef]/80 text-sm leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
