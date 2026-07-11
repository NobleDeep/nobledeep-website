import type { Metadata } from "next";
import Link from "next/link";
import CaptionedImage from "@/components/CaptionedImage";
import FadeIn from "@/components/FadeIn";
import HowTritonWorks from "@/components/HowTritonWorks";

export const metadata: Metadata = {
  title: "Technology — Noble Deep",
  description:
    "TRITON V1 system overview: validation status, operating cycle, specifications, autonomy validation, operator deliverables, and fault handling.",
};

/* ── Specifications ── */
const specs = [
  { spec: "Depth rating", value: "300 m rated (operating range typically ≤100 m)" },
  { spec: "Docking residency", value: "6-month target between major service intervals" },
  { spec: "Per-mission endurance", value: "Pending" },
  { spec: "Docking & recharge cycle time", value: "Pending" },
  {
    spec: "Sensor, electronics & battery weight",
    value: "~34 kg (excludes chassis, housings, and structure — total vehicle weight will be higher)",
  },
  { spec: "Total vehicle weight", value: "Pending" },
  { spec: "Dimensions", value: "Pending" },
  {
    spec: "Navigation & positioning",
    value:
      "IMU, DVL, motor encoders, GPS surface fix, USBL acoustic positioning, sound velocity profiler — sensor-fused pose estimation",
  },
  {
    spec: "Inspection payload",
    value: "Camera, multibeam echosounder, sub-bottom profiler, cathodic-protection probe",
  },
  {
    spec: "Onboard compute",
    value: "Edge AI (mission management, obstacle classification, anomaly detection)",
  },
  {
    spec: "Communications",
    value:
      "Fully autonomous during missions — no tether, no surface link. Data offload and recharge via short-range link at the dock; acoustic command channel on the roadmap.",
  },
];

/* ── Operator deliverables ── */
const deliverables = [
  {
    title: "GPS-tagged anomaly location",
    body: "Every flagged anomaly is delivered with its georeferenced position on the asset, so follow-up crews go straight to the finding.",
  },
  {
    title: "Supporting imagery",
    body: "Visual evidence for each finding, with before/after comparison where prior-mission data exists for the same location.",
  },
  {
    title: "Structured summary",
    body: "A condition report formatted for hand-off to the customer's own engineering or asset-integrity team for review and sign-off.",
  },
];

/* ── Traction & roadmap ── */
type RoadmapItem = {
  label: string;
  title: string;
  body: string;
  image?: { src: string; alt: string; caption: string };
};

const roadmap: RoadmapItem[] = [
  {
    label: "May 2026",
    title: "MVP V1 — built in-house",
    body: "First full prototype designed and assembled in-house, validating the core vehicle architecture at component and subsystem level.",
    image: {
      src: "/images/demo-day-mvp.jpg",
      alt: "Andrew Jimenez with MVP V1 at Draper University Demo Day",
      caption: "MVP V1 at Draper University Demo Day — May 2026.",
    },
  },
  {
    label: "Now",
    title: "MVP V2 — in active development",
    body: "Second-generation prototype in build, carrying subsystem validation toward open-water readiness.",
  },
  {
    label: "Next",
    title: "Open-water testing",
    body: "Field trials of the integrated system, from pool scale to open water — the gate to the commercially deployable TRITON V1.",
  },
  {
    label: "Then",
    title: "TRITON V1 — commercial system",
    body: "The resident inspection system described on this page, deployed at customer assets.",
  },
];

const sectionBorder = {
  boxShadow: "0 -1px 0 0 rgba(144,224,239,0.04)",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#90e0ef]/50 mb-10">
      {children}
    </p>
  );
}

export default function TechnologyPage() {
  return (
    <>
      {/* ─── HERO — statement + scroll-scrubbed cycle schematic ──── */}
      <section className="px-6 lg:px-10 pt-24 pb-20">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#90e0ef]/50 mb-10">
              Technology
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white max-w-4xl">
              TRITON — a new way to monitor subsea infrastructure.
            </h1>
          </FadeIn>
          <FadeIn delay={160}>
            <p className="mt-8 text-base sm:text-lg text-[#90e0ef] max-w-2xl leading-relaxed">
              Resident on the seafloor, TRITON watches continuously and
              surfaces only the data that matters — no vessel mobilization,
              no gaps in coverage.
            </p>
          </FadeIn>

          <div className="mt-14">
            <HowTritonWorks />
          </div>
        </div>
      </section>

      {/* ─── THE SYSTEM + STATUS / VALIDATION ────────────────────── */}
      <section className="px-6 lg:px-10 py-16 border-t border-[#90e0ef]/[0.1]" style={sectionBorder}>
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <p className="text-base sm:text-lg text-[#90e0ef] max-w-2xl leading-relaxed">
              The TRITON V1 system: a seafloor-resident autonomous inspection
              vehicle and docking station, designed for continuous monitoring
              of subsea infrastructure. This page describes the system as
              designed; current maturity is stated below.
            </p>
          </FadeIn>

          {/* Status / validation */}
          <FadeIn delay={120}>
            <div
              className="mt-10 border border-[#90e0ef]/[0.15] bg-[#0077b6]/[0.08] px-6 sm:px-8 py-6 max-w-3xl"
              style={{ boxShadow: "0 0 30px rgba(0,119,182,0.12)" }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#22d3ee] mb-3">
                Status / Validation
              </p>
              <p className="text-[#90e0ef] leading-relaxed">
                <span className="text-white font-semibold">
                  Current stage: TRL&nbsp;4
                </span>{" "}
                — component/subsystem validation, pre-field deployment.
                MVP&nbsp;V1 built in-house (May&nbsp;2026); MVP&nbsp;V2 in
                active development, en route to the commercially deployable
                TRITON&nbsp;V1.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── SPECIFICATIONS ──────────────────────────────────────── */}
      <section className="px-6 lg:px-10 py-20 border-t border-[#90e0ef]/[0.1]" style={sectionBorder}>
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionLabel>TRITON V1 — Design Targets</SectionLabel>
          </FadeIn>

          <FadeIn delay={80}>
            <div
              className="border border-[#90e0ef]/[0.12] overflow-x-auto"
              style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(144,224,239,0.05)" }}
            >
              <table className="w-full text-left border-collapse min-w-[560px]">
                <thead>
                  <tr className="border-b border-[#90e0ef]/[0.12]">
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#90e0ef]/50 w-[38%]">
                      Spec
                    </th>
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#90e0ef]/50">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {specs.map((row, i) => (
                    <tr
                      key={row.spec}
                      className={i < specs.length - 1 ? "border-b border-[#90e0ef]/[0.08]" : ""}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-white align-top">
                        {row.spec}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm leading-relaxed align-top ${
                          row.value === "Pending" ? "text-[#90e0ef]/40 italic" : "text-[#90e0ef]"
                        }`}
                      >
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>

          <FadeIn delay={140}>
            <p className="mt-5 text-xs text-[#90e0ef]/40 leading-relaxed max-w-2xl">
              TRITON V1 is in active development. Confirmed values replace
              targets as validation progresses; &ldquo;Pending&rdquo; marks
              parameters we won&apos;t publish until measured.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── AUTONOMY — VALIDATION STATUS ────────────────────────── */}
      <section className="px-6 lg:px-10 py-20 border-t border-[#90e0ef]/[0.1]" style={sectionBorder}>
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-24">
          <FadeIn>
            <div>
              <SectionLabel>Autonomy</SectionLabel>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Validation status
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="text-[#90e0ef] leading-relaxed text-base lg:pt-16">
              Scripted inspection missions, vision-based defect detection,
              collision avoidance, and geofencing have been validated in
              simulation. Hardware validation is progressing through the
              MVP&nbsp;V2 build now underway, with pool-scale and open-water
              trials to follow on the roadmap below.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── WHAT AN OPERATOR RECEIVES ───────────────────────────── */}
      <section className="px-6 lg:px-10 py-20 border-t border-[#90e0ef]/[0.1]" style={sectionBorder}>
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionLabel>What an Operator Receives</SectionLabel>
          </FadeIn>

          <div
            className="grid sm:grid-cols-3 gap-0 border border-[#90e0ef]/[0.1] divide-y sm:divide-y-0 sm:divide-x divide-[#90e0ef]/[0.1]"
            style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(144,224,239,0.06)" }}
          >
            {deliverables.map((d, i) => (
              <FadeIn key={d.title} delay={i * 80}>
                <div className="p-8 sm:p-10 h-full">
                  <p className="text-white font-semibold text-base leading-tight mb-3">
                    {d.title}
                  </p>
                  <p className="text-[#90e0ef]/80 text-sm leading-relaxed">{d.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SAFETY & FAULT HANDLING ─────────────────────────────── */}
      <section className="px-6 lg:px-10 py-20 border-t border-[#90e0ef]/[0.1]" style={sectionBorder}>
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-24">
          <FadeIn>
            <div>
              <SectionLabel>Safety &amp; Fault Handling</SectionLabel>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Built for unattended operation
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="text-[#90e0ef] leading-relaxed text-base lg:pt-16">
              An always-on fault-supervision layer independently monitors for
              leaks, collisions, and loss of communications, and autonomously
              safes the vehicle and returns it to dock with data preserved
              onboard — enabling unattended resident operation.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── TRACTION & ROADMAP ──────────────────────────────────── */}
      <section className="px-6 lg:px-10 py-20 border-t border-[#90e0ef]/[0.1]" style={sectionBorder}>
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionLabel>Traction &amp; Roadmap</SectionLabel>
          </FadeIn>

          {roadmap.map((r, i) => (
            <FadeIn key={r.title} delay={i * 60}>
              <div
                className={`py-8 grid grid-cols-[5rem_1fr] sm:grid-cols-[8rem_1fr] gap-6 sm:gap-10 ${
                  i < roadmap.length - 1 ? "border-b border-[#90e0ef]/[0.08]" : ""
                }`}
              >
                <span className="text-xs font-bold text-[#22d3ee]/70 uppercase tracking-[0.2em] pt-0.5">
                  {r.label}
                </span>
                <div>
                  <h3 className="font-semibold text-white text-base uppercase tracking-wide mb-2">
                    {r.title}
                  </h3>
                  <p className="text-[#90e0ef] leading-relaxed max-w-xl">{r.body}</p>
                  {r.image && (
                    <CaptionedImage
                      src={r.image.src}
                      alt={r.image.alt}
                      caption={r.image.caption}
                      aspect="aspect-[9/8]"
                      sizes="(max-width: 640px) 100vw, 576px"
                      className="mt-8 max-w-xl"
                    />
                  )}
                </div>
              </div>
            </FadeIn>
          ))}

          <FadeIn delay={280}>
            <div className="mt-14 grid sm:grid-cols-2 gap-0 border border-[#90e0ef]/[0.1] divide-y sm:divide-y-0 sm:divide-x divide-[#90e0ef]/[0.1]"
              style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(144,224,239,0.06)" }}
            >
              <div className="p-8 sm:p-10">
                <p className="text-white font-semibold text-base leading-tight mb-3">
                  Draper University
                </p>
                <p className="text-[#90e0ef]/80 text-sm leading-relaxed">
                  Invited to attend the Spring 2026 Draper University cohort.
                </p>
              </div>
              <div className="p-8 sm:p-10">
                <p className="text-white font-semibold text-base leading-tight mb-3">
                  Market discovery
                </p>
                <p className="text-[#90e0ef]/80 text-sm leading-relaxed">
                  Structured discovery underway across the offshore wind and
                  oil &amp; gas buying chain.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── ONE-PAGER + CTA ─────────────────────────────────────── */}
      <section className="relative px-6 lg:px-10 py-24 border-t border-[#90e0ef]/[0.1] overflow-hidden" style={sectionBorder}>
        {/* Layered glow — matches the homepage closing section */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 75% at 18% 45%, rgba(0,119,182,0.22) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Need something to forward internally?
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <p className="text-[#90e0ef] mb-8 max-w-xl leading-relaxed">
              The TRITON one-pager combines the specification table, the
              operating cycle, and a one-line traction summary in a single PDF.
            </p>
          </FadeIn>
          <FadeIn delay={120}>
            <p className="text-[#90e0ef] mb-8 max-w-xl leading-relaxed">
              We&apos;re selecting 2–3 early partners to shape TRITON&apos;s
              validation program.
            </p>
          </FadeIn>
          <FadeIn delay={160}>
            <div className="flex flex-wrap gap-4">
              <a
                href="/triton-one-pager.pdf"
                download
                className="btn-glow inline-flex items-center gap-3 border border-[#90e0ef]/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all hover:border-[#22d3ee]/60 hover:text-[#22d3ee]"
              >
                Download One-Pager (PDF)
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4" />
                </svg>
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#90e0ef]/50 hover:text-[#90e0ef] transition-colors"
              >
                Talk to the Team
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
