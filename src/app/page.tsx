import type { Metadata } from "next";
import Link from "next/link";
import HeroScene from "@/components/HeroScene";
import FadeIn from "@/components/FadeIn";
import CountUp from "@/components/CountUp";
import ApplicationsMap from "@/components/ApplicationsMap";
import { ArrowIcon, Eyebrow, Section } from "@/components/ui";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = {
  ...pageMeta(
    "Continuous Subsea Inspection",
    "Casper is an autonomous underwater vehicle that stays on site and inspects subsea infrastructure continuously, without relying on chartered survey vessels. Built first for offshore wind.",
    "/"
  ),
  title: { absolute: "Noble Deep | Continuous Subsea Inspection" },
};
metadata.openGraph = { ...metadata.openGraph, title: "Noble Deep | Continuous Subsea Inspection" };
metadata.twitter = { ...metadata.twitter, title: "Noble Deep | Continuous Subsea Inspection" };

const capabilities = [
  {
    n: "01",
    title: "Continuous Inspection",
    body: "Casper works on site on a recurring schedule, so inspection doesn't stop when weather keeps vessels in port.",
  },
  {
    n: "02",
    title: "Built for Offshore Wind",
    body: "Casper inspects export and array cables, foundations, seabed scour, and mooring lines, at depths to 300 m.",
  },
  {
    n: "03",
    title: "Actionable Data",
    body: "Instead of raw footage, operations teams receive anomaly alerts, structural trend data, and condition reports that show what changed and where.",
  },
];

const stats = [
  { to: 300, suffix: " m", label: "Rated depth" },
  { to: 100, prefix: "≤", suffix: " m", label: "Typical operating depth" },
  { to: 4, from: 1, prefix: "TRL ", label: "Current validation stage" },
];

/* Recognition badges: a matched pair, text only */
function Badge({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="border border-white/20 bg-[#04182c]/70 px-4 py-2.5">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white">{title}</p>
      <p className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-foam/75">{detail}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────
          Pulled up under the sticky header so the scene runs to the
          top edge with no band above it. */}
      <section className="relative -mt-16 min-h-[100svh] md:h-[100svh] md:min-h-[780px] overflow-hidden flex flex-col">
        <HeroScene />

        {/* Readability scrim behind the copy */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{ background: "linear-gradient(180deg, rgba(3,16,32,0.6) 0%, rgba(3,16,32,0.35) 45%, transparent 62%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{ background: "linear-gradient(90deg, rgba(3,16,32,0.72) 0%, rgba(3,16,32,0.4) 38%, transparent 62%)" }}
        />

        <div className="relative z-10 flex-1 flex flex-col px-6 lg:px-10 pt-28 md:pt-24 md:pb-10 md:justify-center">
          <div className="mx-auto w-full max-w-7xl">
            <p className="animate-hero animate-hero-1 label-mono !text-foam mb-7">
              Noble Deep&nbsp;&nbsp;·&nbsp;&nbsp;Casper AUV
            </p>

            <h1 className="animate-hero animate-hero-2 text-[2.3rem] sm:text-6xl lg:text-[3.5rem] xl:text-[4rem] font-bold leading-[1.03] tracking-[-0.025em] text-white max-w-[34rem] xl:max-w-[40rem]">
              Subsea inspection campaigns cost operators about{" "}
              <span className="text-foam">$150K</span> per vessel day.
            </h1>

            <p className="animate-hero animate-hero-3 mt-6 text-base sm:text-lg text-body max-w-[34rem] leading-relaxed">
              Casper is an autonomous underwater vehicle that stays on site and
              inspects subsea infrastructure continuously, without relying on
              chartered survey vessels. Operators get condition reports that
              catch damage early, so repairs are planned instead of rushed.
            </p>

            <div className="animate-hero animate-hero-4 mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Get in Touch
                <ArrowIcon />
              </Link>
              <Link href="/technology" className="btn-secondary">
                Explore the Technology
              </Link>
            </div>

            <div className="animate-hero animate-hero-5 mt-8 flex flex-wrap gap-3">
              <Badge title="Draper University" detail="Alumni Company" />
              <Badge title="Finalist" detail="Ocean Exchange 2026 Collegiate Awards" />
            </div>
          </div>
        </div>

        {/* Mobile: reserve the lower part of the hero for the scene */}
        <div aria-hidden className="h-[400px] shrink-0 md:hidden" />

        <p className="sr-only">
          Illustration: an autonomous underwater vehicle follows an export
          cable across the seabed of an offshore wind site, scans it, flags
          cable exposure in a scour pit beside a turbine foundation, and posts
          a condition report.
        </p>
      </section>

      {/* ─── THE PROBLEM ─────────────────────────────────────────── */}
      <Section depth="040 m">
        <FadeIn>
          <Eyebrow index="01">The Problem</Eyebrow>
        </FadeIn>
        <FadeIn delay={80}>
          <p className="mt-10 text-3xl sm:text-4xl lg:text-[3.25rem] font-semibold leading-[1.12] tracking-[-0.02em] text-white max-w-5xl">
            Subsea infrastructure fails between inspections.{" "}
            <span className="text-muted">
              When a survey vessel visits only a few times a year, a cable can
              sit exposed or scour can deepen around a foundation for months
              before anyone sees it.
            </span>
          </p>
        </FadeIn>
      </Section>

      {/* ─── CAPABILITIES ────────────────────────────────────────── */}
      <Section band depth="060 m">
        <FadeIn>
          <Eyebrow index="02">Casper</Eyebrow>
        </FadeIn>
        <FadeIn delay={60}>
          <h2 className="mt-8 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.04] tracking-[-0.025em] text-white max-w-3xl">
            Inspection that stays on site.
          </h2>
        </FadeIn>

        <div className="mt-16 grid md:grid-cols-3 border-t border-foam/15">
          {capabilities.map((c, i) => (
            <FadeIn key={c.n} delay={i * 90} className="h-full">
              <div
                className={`group h-full pt-8 pb-10 md:pr-10 border-b md:border-b-0 border-foam/15 ${
                  i > 0 ? "md:pl-10 md:border-l" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-cyan">{c.n}</span>
                  <span className="h-px w-10 bg-foam/25 transition-all duration-500 group-hover:w-16 group-hover:bg-cyan" />
                </div>
                <h3 className="mt-10 text-2xl lg:text-[1.7rem] font-bold uppercase tracking-[0.02em] leading-tight text-white">
                  {c.title}
                </h3>
                <p className="mt-4 text-body text-base lg:text-[1.05rem] leading-relaxed">{c.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ─── KEY FIGURES ─────────────────────────────────────────── */}
      <Section depth="090 m" className="!py-20 lg:!py-24">
        <div className="grid sm:grid-cols-3 gap-px bg-foam/12 border border-foam/12">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 90} className="h-full">
              <div className="h-full bg-[#041629] px-8 py-10 lg:px-10 lg:py-14">
                <p className="text-5xl lg:text-6xl font-bold tracking-[-0.03em] text-white">
                  <CountUp to={s.to} from={s.from} prefix={s.prefix} suffix={s.suffix} />
                </p>
                <p className="mt-4 label-mono">{s.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={200}>
          <div className="mt-6 flex justify-end">
            <Link
              href="/technology"
              className="link-arrow inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan hover:text-white transition-colors"
            >
              Explore the Technology
              <ArrowIcon />
            </Link>
          </div>
        </FadeIn>
      </Section>

      {/* ─── APPLICATIONS MAP ────────────────────────────────────── */}
      <ApplicationsMap />

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
              Ready to close the monitoring gap?
            </h2>
          </FadeIn>
          <FadeIn delay={80}>
            <p className="mt-6 text-lg text-body max-w-md leading-relaxed">
              We&apos;re working with early partners to validate Casper in live
              offshore environments.
            </p>
          </FadeIn>
          <FadeIn delay={160}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Contact Us
                <ArrowIcon />
              </Link>
              <Link href="/about" className="btn-secondary">
                About Us
              </Link>
            </div>
          </FadeIn>
        </div>
      </Section>
    </>
  );
}
