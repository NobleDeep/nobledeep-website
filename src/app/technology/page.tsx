import type { Metadata } from "next";
import Link from "next/link";
import CaptionedImage from "@/components/CaptionedImage";
import DepthEnvelope from "@/components/DepthEnvelope";
import FadeIn from "@/components/FadeIn";
import { ArrowIcon, Eyebrow, Section } from "@/components/ui";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta(
  "Technology",
  "How Casper works: the four-step inspection cycle, design targets, autonomy status, what operators receive, fault handling, and current progress at TRL 4.",
  "/technology"
);

/* ── Operating cycle ── */
const cycle = [
  {
    n: "01",
    title: "Survey",
    body: "Casper navigates pre-planned inspection routes along the asset, holding depth and position with sensor-fused navigation.",
  },
  {
    n: "02",
    title: "Detect",
    body: "Onboard edge compute processes the inspection data in real time and flags anomalies, each tagged with its position on the asset.",
  },
  {
    n: "03",
    title: "Report",
    body: "Findings go to the operator's engineering team as a structured condition report.",
  },
  {
    n: "04",
    title: "Repeat",
    body: "Inspections recur on schedule or on demand, building a long-term record of how the asset and seabed change.",
  },
];

/* ── Design targets ── */
const specs = [
  { spec: "Depth rating", value: "300 m rated, typical operating range ≤100 m" },
  { spec: "Per-mission endurance", value: "Pending" },
  { spec: "Total vehicle weight", value: "Pending" },
  {
    spec: "Navigation & positioning",
    value: "IMU, DVL, GPS surface fix, acoustic positioning, sound velocity profiler; sensor-fused pose estimation",
  },
  { spec: "Inspection payload", value: "Optical and acoustic inspection sensors, cathodic-protection probe" },
  { spec: "Onboard compute", value: "Edge AI for mission management, obstacle classification, and anomaly detection" },
  { spec: "Communications", value: "Fully autonomous during missions, with no tether." },
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

/* ── Progress ── */
const complete = [
  "Benchtop build, with thrusters bench-tested",
  "Vehicle hull, electronics enclosure, and thruster models designed",
  "Buoyancy and ballast calculations",
  "Vehicle communication and control software",
  "Data logging requirements defined",
  "Inspection mission running in simulation: path planning, depth hold, mode switching",
  "Invited to attend the Spring 2026 Draper University cohort",
  "Finalist, Ocean Exchange 2026 Collegiate Awards",
];

const inProgress = [
  "Casper Rev.1 vehicle assembly",
  "Onboard autonomy layer",
  "Customer discovery across the offshore wind buying chain",
];

function TwoCol({
  label,
  index,
  title,
  children,
}: {
  label: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-[1fr_1.35fr] gap-10 lg:gap-24">
      <FadeIn>
        <Eyebrow index={index}>{label}</Eyebrow>
        <h2 className="mt-8 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.06] tracking-[-0.02em] text-white">
          {title}
        </h2>
      </FadeIn>
      <FadeIn delay={100}>
        <div className="lg:pt-[4.5rem] text-body text-lg leading-relaxed">{children}</div>
      </FadeIn>
    </div>
  );
}

export default function TechnologyPage() {
  return (
    <>
      {/* ─── HERO ────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-10 pt-24 lg:pt-32 pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1.45fr_1fr] gap-14 lg:gap-20 items-center">
          <div>
            <div className="animate-hero animate-hero-1">
              <Eyebrow>Technology</Eyebrow>
            </div>
            <div className="animate-hero animate-hero-2">
              <h1 className="mt-10 text-5xl sm:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] font-bold leading-[1.0] tracking-[-0.03em] text-white max-w-4xl">
                Casper: a new way to monitor subsea infrastructure.
              </h1>
            </div>
            <div className="animate-hero animate-hero-3">
              <p className="mt-10 text-lg lg:text-xl text-body max-w-2xl leading-relaxed">
                Casper is an autonomous underwater vehicle that inspects subsea
                infrastructure on a recurring schedule and reports the findings
                that matter. Operators get continuous coverage of their cables and
                foundations without waiting for the next survey vessel.
              </p>
            </div>
          </div>

          <div className="animate-hero animate-hero-4 w-full max-w-md lg:max-w-none mx-auto">
            <DepthEnvelope />
          </div>

          {/* Status */}
          <div className="animate-hero animate-hero-5 lg:col-span-2">
            <div className="grid sm:grid-cols-[auto_1fr] border border-foam/15 bg-white/[0.03]">
              <div className="flex sm:flex-col justify-between sm:justify-center gap-2 px-6 py-5 sm:px-8 border-b sm:border-b-0 sm:border-r border-foam/15">
                <p className="label-mono !text-cyan">Status</p>
                <p className="text-3xl font-bold tracking-tight text-white">TRL 4</p>
              </div>
              <p className="px-6 py-5 sm:px-8 sm:py-6 text-body leading-relaxed">
                <span className="text-white font-semibold">Current stage: TRL&nbsp;4.</span>{" "}
                Sub-components integrated and tested together on the bench.
                Casper Rev.1, our first integrated vehicle, is in build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── OPERATING CYCLE ─────────────────────────────────────── */}
      <Section band depth="030 m">
        <FadeIn>
          <Eyebrow index="01">Operating Cycle</Eyebrow>
        </FadeIn>
        <FadeIn delay={60}>
          <h2 className="mt-8 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.06] tracking-[-0.02em] text-white max-w-3xl">
            Survey, detect, report, and repeat.
          </h2>
        </FadeIn>

        <ol className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-foam/12 border border-foam/12">
          {cycle.map((s, i) => (
            <li key={s.n} className="bg-[#05192f]">
              <FadeIn delay={i * 90} className="h-full">
                <div className="group h-full p-8 lg:p-9 transition-colors duration-300 hover:bg-white/[0.03]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-cyan">{s.n}</span>
                    <span className="h-px flex-1 bg-foam/20 transition-colors duration-300 group-hover:bg-cyan/60" />
                  </div>
                  <h3 className="mt-10 text-2xl font-bold uppercase tracking-[0.03em] text-white">{s.title}</h3>
                  <p className="mt-4 text-body leading-relaxed">{s.body}</p>
                </div>
              </FadeIn>
            </li>
          ))}
        </ol>
        <FadeIn delay={200}>
          <p className="mt-6 font-mono text-[11px] tracking-[0.06em] text-muted">
            Deployment and recharging architecture withheld pending IP protection.
          </p>
        </FadeIn>
      </Section>

      {/* ─── SPECIFICATIONS ──────────────────────────────────────── */}
      <Section depth="060 m">
        <FadeIn>
          <Eyebrow index="02">Specifications</Eyebrow>
        </FadeIn>
        <FadeIn delay={60}>
          <h2 className="mt-8 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.06] tracking-[-0.02em] text-white">
            Casper: Design Targets
          </h2>
        </FadeIn>

        <FadeIn delay={120}>
          <div className="mt-14 border-t border-foam/20">
            <dl>
              {specs.map((row) => (
                <div
                  key={row.spec}
                  className="grid sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] gap-2 sm:gap-10 py-5 border-b border-foam/12 transition-colors duration-200 hover:bg-white/[0.025]"
                >
                  <dt className="label-mono !text-foam/80 pt-1">{row.spec}</dt>
                  <dd
                    className={`text-base lg:text-lg leading-relaxed ${
                      row.value === "Pending" ? "font-mono text-sm lg:text-sm uppercase tracking-[0.14em] text-muted pt-1" : "text-white"
                    }`}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </FadeIn>

        <FadeIn delay={160}>
          <p className="mt-6 text-sm text-muted leading-relaxed max-w-2xl">
            Casper is in active development. Confirmed values replace targets
            as validation progresses, and &ldquo;Pending&rdquo; marks values we
            won&apos;t publish until they are measured.
          </p>
        </FadeIn>
      </Section>

      {/* ─── AUTONOMY ────────────────────────────────────────────── */}
      <Section band depth="090 m">
        <TwoCol index="03" label="Autonomy" title="Validation status">
          <p>
            Casper runs a predefined inspection mission in simulation today,
            with path planning, depth hold, and mode switching working.
            We&apos;re now building the autonomy layer, which lets the vehicle
            decide what to do rather than follow a fixed plan.
          </p>
        </TwoCol>
      </Section>

      {/* ─── WHAT AN OPERATOR RECEIVES ───────────────────────────── */}
      <Section depth="120 m">
        <FadeIn>
          <Eyebrow index="04">What an Operator Receives</Eyebrow>
        </FadeIn>
        <FadeIn delay={60}>
          <h2 className="mt-8 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.06] tracking-[-0.02em] text-white max-w-3xl">
            Findings, not footage.
          </h2>
        </FadeIn>
        <div className="mt-14 grid md:grid-cols-3 border-t border-foam/15">
          {deliverables.map((d, i) => (
            <FadeIn key={d.title} delay={i * 90} className="h-full">
              <div
                className={`h-full pt-8 pb-10 md:pr-10 border-b md:border-b-0 border-foam/15 ${
                  i > 0 ? "md:pl-10 md:border-l" : ""
                }`}
              >
                <span className="font-mono text-sm text-cyan">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-xl font-bold text-white leading-tight">{d.title}</h3>
                <p className="mt-3 text-body leading-relaxed">{d.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ─── SAFETY & FAULT HANDLING ─────────────────────────────── */}
      <Section band depth="150 m">
        <TwoCol index="05" label="Safety & Fault Handling" title="Designed for unattended operation">
          <p>
            Casper is designed to run without an operator watching. An
            always-on fault-supervision layer independently monitors for
            leaks, collisions, and loss of communications. When it detects a
            fault, it safes the vehicle and preserves mission data onboard.
          </p>
        </TwoCol>
      </Section>

      {/* ─── PROGRESS ────────────────────────────────────────────── */}
      <Section depth="180 m">
        <FadeIn>
          <Eyebrow index="06">Progress</Eyebrow>
        </FadeIn>
        <FadeIn delay={60}>
          <h2 className="mt-8 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.06] tracking-[-0.02em] text-white max-w-3xl">
            What&apos;s done, and what&apos;s in progress.
          </h2>
        </FadeIn>

        <div className="mt-14 grid lg:grid-cols-2 gap-px bg-foam/12 border border-foam/12">
          <FadeIn className="h-full">
            <div className="h-full bg-[#041426] p-8 lg:p-10">
              <p className="label-mono !text-cyan flex items-center gap-2.5">
                <span aria-hidden className="h-2 w-2 bg-cyan" />
                Complete
              </p>
              <ul className="mt-8 flex flex-col">
                {complete.map((item) => (
                  <li
                    key={item}
                    className="grid grid-cols-[1.5rem_1fr] gap-3 py-3.5 border-b border-foam/10 last:border-b-0 text-body leading-relaxed"
                  >
                    <svg aria-hidden className="mt-1 h-4 w-4 text-cyan" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
          <FadeIn delay={100} className="h-full">
            <div className="h-full bg-[#041426] p-8 lg:p-10">
              <p className="label-mono flex items-center gap-2.5">
                <span aria-hidden className="h-2 w-2 border border-foam/80" />
                In progress
              </p>
              <ul className="mt-8 flex flex-col">
                {inProgress.map((item) => (
                  <li
                    key={item}
                    className="grid grid-cols-[1.5rem_1fr] gap-3 py-3.5 border-b border-foam/10 last:border-b-0 text-white leading-relaxed"
                  >
                    <span aria-hidden className="mt-2.5 h-px w-3.5 bg-foam/60" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <CaptionedImage
                src="/images/demo-day-mvp.jpg"
                alt="Andrew Jimenez holding the benchtop build at Draper University Demo Day"
                caption="Benchtop build at Draper University Demo Day, May 2026."
                aspect="aspect-[9/8]"
                sizes="(max-width: 1024px) 100vw, 560px"
                className="mt-10"
              />
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* ─── CTA ─────────────────────────────────────────────────── */}
      <Section band depth="200 m" className="overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 55% 80% at 15% 50%, rgba(0,119,182,0.2) 0%, transparent 70%)" }}
        />
        <div className="relative">
          <FadeIn>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.04] tracking-[-0.025em] text-white max-w-3xl">
              Become an early partner.
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <p className="mt-6 text-lg text-body max-w-md leading-relaxed">
              We&apos;re selecting 2–3 early partners to shape Casper&apos;s
              validation program.
            </p>
          </FadeIn>
          <FadeIn delay={160}>
            <div className="mt-10">
              <Link href="/contact" className="btn-primary">
                Talk to the Team
                <ArrowIcon />
              </Link>
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}
