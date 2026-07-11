import Link from "next/link";
import WaterCaustics from "@/components/WaterCaustics";
import HeroCanvas from "@/components/HeroCanvas";
import FadeIn from "@/components/FadeIn";
import ScrollParallax from "@/components/ScrollParallax";
import WhereTritonWorks from "@/components/WhereTritonWorks";

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden min-h-[94vh] flex flex-col justify-center"
        style={{
          background:
            "linear-gradient(to bottom, #0096c7 0%, #0077b6 28%, rgba(2,62,138,0.3) 72%, transparent 100%)",
        }}
      >
        {/*
          Effects layer — masked so canvases and vignette fade out before
          the section boundary instead of ending in a hard line.
        */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            maskImage: "linear-gradient(to bottom, black 78%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 78%, transparent 100%)",
          }}
        >
          {/* WebGL caustics — light refracting from the surface above */}
          <WaterCaustics />

          {/* 2-D canvas — particles + waves + scan line (above caustics) */}
          <HeroCanvas />

          {/* Depth vignette: subtle darkening toward the bottom */}
          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background:
                "radial-gradient(ellipse 90% 60% at 50% 110%, rgba(0,0,0,0.45) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Hero content */}
        <ScrollParallax speed={0.12} className="relative z-10 px-6 lg:px-10 py-24">
          <div className="mx-auto w-full max-w-7xl">

            <p className="animate-hero animate-hero-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#90e0ef]/60 mb-10">
              Noble Deep &nbsp;·&nbsp; TRITON AUV
            </p>

            <h1 className="animate-hero animate-hero-2 text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-bold leading-[1.06] tracking-tight text-white max-w-4xl">
              Subsea inspection campaigns cost operators{" "}
              {/*
                Silver/chrome so it reads as a hard number fact —
                pops cleanly against the blue without being garish.
              */}
              <span
                className="text-[#e8e8e8]"
                style={{ textShadow: "0 0 30px rgba(232,232,232,0.40), 0 2px 6px rgba(0,0,0,0.35)" }}
              >
                $50K–$200K+
              </span>{" "}
              per vessel day.
            </h1>

            <p className="animate-hero animate-hero-3 mt-5 text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold leading-[1.06] tracking-tight text-white">
              TRITON lives on the seafloor.
            </p>

            <p className="animate-hero animate-hero-4 mt-9 text-base sm:text-lg text-[#90e0ef] max-w-lg leading-relaxed">
              Seafloor-resident. Swarm-capable. Delivers actionable data —
              not a quarterly report.
            </p>

            <div className="animate-hero animate-hero-5 mt-10">
              <Link
                href="/contact"
                className="btn-glow inline-flex items-center gap-3 border border-[#90e0ef]/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all hover:border-[#22d3ee]/60 hover:text-[#22d3ee]"
              >
                Get in Touch
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Draper badge */}
            <div className="animate-hero animate-hero-6 mt-14 flex items-center gap-5">
              <div className="h-px w-12 bg-[#90e0ef]/20" />
              {/*
                Solid (non-backdrop-blurred) background — backdrop-filter
                inside the composited parallax layer rasterized the text
                and made it fuzzy.
              */}
              <div className="draper-badge inline-flex items-center border border-[#90e0ef]/25 bg-[#023e8a]/45 px-5 py-2.5 rounded-sm">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">Draper University</p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#90e0ef]/60">Alumni Company</p>
                </div>
              </div>
              <div className="h-px w-12 bg-[#90e0ef]/20" />
            </div>
          </div>
        </ScrollParallax>

        {/* Scroll cue — anchors the tall hero, signals more below */}
        <div aria-hidden className="absolute bottom-8 inset-x-0 z-10 flex justify-center animate-hero animate-hero-6">
          <div className="scroll-cue flex flex-col items-center gap-2.5">
            <span className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#90e0ef]/40 select-none">
              Scroll
            </span>
            <span className="block h-9 w-px bg-gradient-to-b from-[#90e0ef]/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* ─── BRIDGE — no border, flows from the hero gradient ──── */}
      <section className="px-6 lg:px-10 py-20">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <p className="flex items-center gap-4 text-[#90e0ef]/50 text-xs uppercase tracking-[0.22em] mb-5">
              <span className="h-px w-8 bg-[#22d3ee]/40" />
              The Problem
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-[#90e0ef] max-w-3xl leading-relaxed">
              Infrastructure fails between inspections. The ocean doesn&apos;t
              pause for survey schedules. Neither should the monitoring.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── CAPABILITIES ────────────────────────────────────────── */}
      <section className="px-6 lg:px-10 pt-8 pb-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <p className="flex items-center gap-4 text-[#90e0ef]/50 text-xs uppercase tracking-[0.22em] mb-10">
              <span className="h-px w-8 bg-[#22d3ee]/40" />
              TRITON
            </p>
          </FadeIn>

          {[
            {
              n: "01", title: "Seafloor-Resident", delay: 0,
              body: "TRITON deploys once and lives on the seabed permanently. It docks between missions, charges, and launches autonomously. No vessel. No weather window. No gaps.",
            },
            {
              n: "02", title: "Swarm-Capable", delay: 80,
              body: "Multiple TRITONs operate in coordinated coverage patterns across a site simultaneously — mapping infrastructure at a scale that a single vehicle can't match.",
            },
            {
              n: "03", title: "Delivers Actionable Data", delay: 160,
              body: "Not raw footage. Anomaly alerts, structural trend data, and condition reports — surfaced to operations teams the moment something changes.",
            },
          ].map((row, i) => (
            <FadeIn key={row.n} delay={row.delay}>
              <div
                className={`py-10 grid grid-cols-[3rem_1fr] sm:grid-cols-[6rem_1fr] gap-6 sm:gap-10 items-start border-t border-[#90e0ef]/[0.1] ${
                  i === 2 ? "border-b border-[#90e0ef]/[0.1]" : ""
                }`}
              >
                <span className="text-xs font-bold text-[#90e0ef]/25 uppercase tracking-[0.2em] pt-1">
                  {row.n}
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide mb-3">
                    {row.title}
                  </h2>
                  <p className="text-[#90e0ef] text-base leading-relaxed max-w-xl">{row.body}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── SYSTEM AT A GLANCE — key figures, links to /technology ── */}
      <section className="px-6 lg:px-10 pb-28">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <div
              className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#90e0ef]/[0.1] border border-[#90e0ef]/[0.1]"
              style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(144,224,239,0.05)" }}
            >
              {[
                { value: "300 m",  label: "Rated depth" },
                { value: "6 mo",   label: "Dock residency target" },
                { value: "24/7",   label: "Resident monitoring" },
                { value: "TRL 4",  label: "Current validation stage" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#021233] p-7 sm:p-9">
                  <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-[#90e0ef]/50">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="mt-6 flex justify-end">
              <Link
                href="/technology"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#22d3ee]/80 hover:text-[#22d3ee] transition-colors"
              >
                Explore the Technology
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── WHERE TRITON WORKS ──────────────────────────────────── */}
      <WhereTritonWorks />

      {/* ─── CTA ─────────────────────────────────────────────────── */}
      <section
        className="relative px-6 lg:px-10 py-32 overflow-hidden"
      >
        {/* Layered glow — lifts the closing section off the flat abyss */}
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight max-w-2xl">
              Ready to close the monitoring gap?
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <p className="mt-5 text-[#90e0ef] max-w-md leading-relaxed">
              We&apos;re working with early partners to validate TRITON in live
              offshore environments.
            </p>
          </FadeIn>
          <FadeIn delay={160}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="btn-glow inline-flex items-center gap-3 border border-[#90e0ef]/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all hover:border-[#22d3ee]/60 hover:text-[#22d3ee]"
              >
                Contact Us
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#90e0ef]/50 hover:text-[#90e0ef] transition-colors"
              >
                About Us
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
