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
        {/* WebGL caustics — light refracting from the surface above */}
        <WaterCaustics />

        {/* 2-D canvas — particles + waves + scan line (above caustics) */}
        <HeroCanvas />

        {/* Depth vignette: subtle darkening toward the bottom */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 50% 110%, rgba(0,0,0,0.45) 0%, transparent 70%)",
          }}
        />

        {/* Hero content */}
        <ScrollParallax speed={0.12} className="relative z-10 px-6 lg:px-10 py-24">
          <div className="mx-auto w-full max-w-7xl">

            <p className="animate-hero animate-hero-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#90e0ef]/60 mb-10">
              Noble Deep &nbsp;·&nbsp; TRITON AUV
            </p>

            <h1 className="animate-hero animate-hero-2 text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-bold leading-[1.06] tracking-tight text-white max-w-4xl">
              Offshore energy operators spend{" "}
              {/*
                Silver/chrome so it reads as a hard number fact —
                pops cleanly against the blue without being garish.
              */}
              <span
                className="text-[#e8e8e8]"
                style={{ textShadow: "0 0 30px rgba(232,232,232,0.40), 0 2px 6px rgba(0,0,0,0.35)" }}
              >
                $200,000 per day
              </span>{" "}
              on inspection vessels.
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
              <div className="draper-badge inline-flex items-center gap-3 border border-[#90e0ef]/25 bg-[#0077b6]/10 backdrop-blur-sm px-5 py-2.5 rounded-sm">
                <svg
                  className="h-4 w-4 text-[#22d3ee] shrink-0"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}
                >
                  <circle cx="12" cy="5" r="2" />
                  <path strokeLinecap="round" d="M12 7v13M8 10h8M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
                </svg>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">Draper University</p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-[#90e0ef]/60">Alumni Company</p>
                </div>
              </div>
              <div className="h-px w-12 bg-[#90e0ef]/20" />
            </div>
          </div>
        </ScrollParallax>
      </section>

      {/* ─── BRIDGE — no border, flows from the hero gradient ──── */}
      <section className="px-6 lg:px-10 py-20">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <p className="text-[#90e0ef]/50 text-xs uppercase tracking-[0.22em] mb-5">The Problem</p>
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
            <p className="text-[#90e0ef]/50 text-xs uppercase tracking-[0.22em] mb-10">TRITON</p>
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

      {/* ─── WHERE TRITON WORKS ──────────────────────────────────── */}
      <WhereTritonWorks />

      {/* ─── CTA ─────────────────────────────────────────────────── */}
      <section className="px-6 lg:px-10 py-32">
        <div className="mx-auto max-w-7xl">
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
