import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "About — Noble Deep",
  description:
    "Noble Deep is building TRITON to solve the subsea monitoring gap. Learn about our mission and team.",
};

const team = [
  { name: "Andrew Jimenez", role: "Co-Founder & CEO" },
  { name: "Gabriel Jimenez", role: "Co-Founder & CTO" },
  { name: "Brandon Lichter", role: "Lead Software Engineer" },
];

const values = [
  {
    label: "01",
    title: "Continuous over periodic",
    body: "Intermittent data is a false sense of security. The future of infrastructure management is always-on.",
  },
  {
    label: "02",
    title: "Depth, not breadth",
    body: "We do one thing — seafloor-resident autonomous monitoring — and we do it better than anyone.",
  },
  {
    label: "03",
    title: "Honest about the hard parts",
    body: "Deep-tech is hard. We don't over-promise. We show our work and earn trust through rigorous validation.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ─── HEADER ──────────────────────────────────────────────── */}
      <section className="px-6 lg:px-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <FadeIn>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#90e0ef]/50 mb-10">
                About
              </p>
            </FadeIn>
            <FadeIn delay={80}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white max-w-3xl">
                We&apos;re here because infrastructure can&apos;t wait.
              </h1>
            </FadeIn>
            <FadeIn delay={160}>
              <p className="mt-8 text-base sm:text-lg text-[#90e0ef] max-w-xl leading-relaxed">
                Noble Deep was founded on a single conviction: the monitoring gap
                in subsea infrastructure is a solvable engineering problem, and
                solving it protects lives, assets, and the environment.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={240}>
            <figure className="max-w-md mx-auto lg:mx-0">
              <Image
                src="/images/founder-pitch.jpg"
                alt="Andrew Jimenez presenting Noble Deep"
                width={1365}
                height={1731}
                preload
                className="w-full h-auto border border-[#90e0ef]/[0.12]"
                style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.3)" }}
              />
              <figcaption className="mt-4 text-xs text-[#90e0ef]/40 uppercase tracking-[0.15em]">
                Presenting Noble Deep — Spring 2026.
              </figcaption>
            </figure>
          </FadeIn>
        </div>
      </section>

      {/* ─── MISSION ─────────────────────────────────────────────── */}
      <section
        className="px-6 lg:px-10 py-16 border-t border-[#90e0ef]/[0.1]"
        style={{ boxShadow: "0 -1px 0 0 rgba(144,224,239,0.04)" }}
      >
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24">
          <FadeIn>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#90e0ef]/50 mb-6">
                Mission
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                Continuous awareness of what&apos;s happening beneath the surface.
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="space-y-5 text-[#90e0ef] leading-relaxed text-base">
              <p>
                Offshore wind and oil &amp; gas operators manage billions of
                dollars of infrastructure in one of the harshest environments on
                Earth. Yet the monitoring strategy relies on survey vessels that
                arrive a few times a year — leaving months-long windows where
                failures can develop undetected.
              </p>
              <p>
                Noble Deep is building TRITON, a seafloor-resident AUV that
                closes that window permanently. TRITON lives on the seafloor,
                runs autonomous inspection missions, and delivers structural
                health data to operations teams — without surface support,
                without weather delays, without gaps.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── TEAM ────────────────────────────────────────────────── */}
      <section
        className="px-6 lg:px-10 py-20 border-t border-[#90e0ef]/[0.1]"
        style={{ boxShadow: "0 -1px 0 0 rgba(144,224,239,0.04)" }}
      >
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#90e0ef]/50 mb-12">
              Team
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-3 gap-0 border border-[#90e0ef]/[0.1] divide-x divide-[#90e0ef]/[0.1]"
            style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(144,224,239,0.06)" }}>
            {team.map((member, i) => (
              <FadeIn key={member.name} delay={i * 80}>
                <div className="p-8 sm:p-10">
                  <p className="text-white font-semibold text-lg leading-tight">
                    {member.name}
                  </p>
                  <p className="text-[#90e0ef]/60 text-sm mt-2 tracking-wide">
                    {member.role}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={240}>
            <figure className="mt-14 max-w-xs">
              <Image
                src="/images/draper-founders.jpg"
                alt="Andrew with Tim Draper at Draper University"
                width={915}
                height={1275}
                loading="lazy"
                className="w-full h-auto border border-[#90e0ef]/[0.12]"
                style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.3)" }}
              />
              <figcaption className="mt-4 text-xs text-[#90e0ef]/40 uppercase tracking-[0.15em]">
                With Tim Draper — Draper University, Spring 2026 cohort.
              </figcaption>
            </figure>
          </FadeIn>
        </div>
      </section>

      {/* ─── VALUES ──────────────────────────────────────────────── */}
      <section
        className="px-6 lg:px-10 py-20 border-t border-[#90e0ef]/[0.1]"
        style={{ boxShadow: "0 -1px 0 0 rgba(144,224,239,0.04)" }}
      >
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#90e0ef]/50 mb-10">
              Principles
            </p>
          </FadeIn>

          {values.map((v, i) => (
            <FadeIn key={v.title} delay={i * 60}>
              <div
                className={`py-8 grid grid-cols-[3rem_1fr] sm:grid-cols-[6rem_1fr] gap-6 sm:gap-10 ${
                  i < values.length - 1 ? "border-b border-[#90e0ef]/[0.08]" : ""
                }`}
              >
                <span className="text-xs font-bold text-[#90e0ef]/25 uppercase tracking-[0.2em] pt-0.5">
                  {v.label}
                </span>
                <div>
                  <h3 className="font-semibold text-white text-base uppercase tracking-wide mb-2">
                    {v.title}
                  </h3>
                  <p className="text-[#90e0ef] leading-relaxed max-w-xl">
                    {v.body}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────────── */}
      <section
        className="px-6 lg:px-10 py-24 border-t border-[#90e0ef]/[0.1]"
        style={{ boxShadow: "0 -1px 0 0 rgba(144,224,239,0.04)" }}
      >
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Interested in what we&apos;re building?
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <p className="text-[#90e0ef] mb-8">Operators, investors, engineers.</p>
          </FadeIn>
          <FadeIn delay={160}>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border border-[#90e0ef]/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all hover:border-[#22d3ee]/60 hover:text-[#22d3ee]"
              style={{ boxShadow: "0 0 20px rgba(0,119,182,0.15)" }}
            >
              Contact Us
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
