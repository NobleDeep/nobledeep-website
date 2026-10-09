import type { Metadata } from "next";
import Link from "next/link";
import CaptionedImage from "@/components/CaptionedImage";
import FadeIn from "@/components/FadeIn";
import { ArrowIcon, Eyebrow, Section } from "@/components/ui";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta(
  "About",
  "Noble Deep develops persistent autonomous underwater vehicles that catch subsea infrastructure problems early. Our mission, principles, and team.",
  "/about"
);

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
    body: "We do one thing — continuous autonomous inspection of subsea infrastructure — and we do it better than anyone.",
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
      <section className="px-6 lg:px-10 pt-24 lg:pt-32 pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1.4fr_1fr] gap-14 lg:gap-20 items-center">
          <div>
            <div className="animate-hero animate-hero-1">
              <Eyebrow>About</Eyebrow>
            </div>
            <div className="animate-hero animate-hero-2">
              <h1 className="mt-10 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.0] tracking-[-0.03em] text-white max-w-3xl">
                We&apos;re here because infrastructure can&apos;t wait.
              </h1>
            </div>
            <div className="animate-hero animate-hero-3">
              <p className="mt-10 text-lg lg:text-xl text-body max-w-xl leading-relaxed">
                Noble Deep was founded on a single conviction: the monitoring gap
                in subsea infrastructure is a solvable engineering problem, and
                solving it protects lives, assets, and the environment.
              </p>
            </div>
          </div>
          <div className="animate-hero animate-hero-4">
            <CaptionedImage
              src="/images/founder-pitch.jpg"
              alt="Andrew Jimenez presenting Noble Deep"
              caption="Presenting Noble Deep, Spring 2026."
              aspect="aspect-[4/5]"
              sizes="(max-width: 1024px) 100vw, 40vw"
              preload
              className="max-w-md mx-auto lg:mx-0"
            />
          </div>
        </div>
      </section>

      {/* ─── MISSION ─────────────────────────────────────────────── */}
      <Section band depth="040 m">
        <div className="grid lg:grid-cols-[1fr_1.35fr] gap-10 lg:gap-24">
          <FadeIn>
            <Eyebrow index="01">Mission</Eyebrow>
            <h2 className="mt-8 text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.06] tracking-[-0.02em] text-white">
              Continuous awareness of what&apos;s happening beneath the surface.
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <p className="lg:pt-[4.5rem] text-body text-lg leading-relaxed">
              Offshore wind and oil &amp; gas operators manage billions of
              dollars of infrastructure in one of the harshest environments on
              Earth. Yet the monitoring strategy relies on survey vessels that
              arrive a few times a year — leaving months-long windows where
              failures can develop undetected.
            </p>
          </FadeIn>
        </div>

        {/* Mission statement: the page's centerpiece. Wording is fixed; do not edit. */}
        <FadeIn delay={120}>
          <figure className="mt-20 lg:mt-28 border-l-2 border-cyan pl-6 sm:pl-10 lg:pl-14">
            <figcaption className="label-mono !text-cyan">Our Mission</figcaption>
            <blockquote className="mt-8 text-2xl sm:text-3xl lg:text-[2.6rem] font-medium leading-[1.25] tracking-[-0.015em] text-white max-w-5xl">
              <p>
                To prevent subsea infrastructure failures through spotting problems early, by developing persistent autonomous underwater vehicles. These vehicles will reduce reliance on traditional costly vessels, delivering consistent actionable data to energy suppliers and subsea infrastructure operators who provide sources of our light, fuel, and internet.
              </p>
            </blockquote>
          </figure>
        </FadeIn>
      </Section>

      {/* ─── TEAM ────────────────────────────────────────────────── */}
      <Section depth="080 m">
        <FadeIn>
          <Eyebrow index="02">Team</Eyebrow>
        </FadeIn>
        <div className="mt-12 grid sm:grid-cols-3 gap-px bg-foam/12 border border-foam/12">
          {team.map((member, i) => (
            <FadeIn key={member.name} delay={i * 80} className="h-full">
              <div className="h-full bg-[#041629] p-8 lg:p-10">
                <p className="text-white font-bold text-xl leading-tight">{member.name}</p>
                <p className="mt-3 label-mono">{member.role}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/*
          Team-moment photo slot, intentionally empty for now. The Draper
          photo (public/images/draper-founders.jpg) returns here once a
          matching photo set exists for Andrew, Gabriel, and Brandon.
        */}
      </Section>

      {/* ─── PRINCIPLES ──────────────────────────────────────────── */}
      <Section band depth="120 m">
        <FadeIn>
          <Eyebrow index="03">Principles</Eyebrow>
        </FadeIn>
        <div className="mt-12 border-t border-foam/15">
          {values.map((v, i) => (
            <FadeIn key={v.title} delay={i * 60}>
              <div className="group grid grid-cols-[3rem_1fr] sm:grid-cols-[6rem_1fr_1.3fr] gap-x-6 sm:gap-x-10 gap-y-3 py-9 border-b border-foam/15">
                <span className="font-mono text-sm text-cyan pt-1">{v.label}</span>
                <h3 className="text-xl lg:text-2xl font-bold uppercase tracking-[0.02em] text-white">
                  {v.title}
                </h3>
                <p className="col-start-2 sm:col-start-3 text-body text-lg leading-relaxed">{v.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ─── CTA ─────────────────────────────────────────────────── */}
      <Section depth="160 m">
        <FadeIn>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.04] tracking-[-0.025em] text-white max-w-3xl">
            Interested in what we&apos;re building?
          </h2>
        </FadeIn>
        <FadeIn delay={80}>
          <p className="mt-6 text-lg text-body">Operators, investors, engineers.</p>
        </FadeIn>
        <FadeIn delay={160}>
          <div className="mt-10">
            <Link href="/contact" className="btn-primary">
              Contact Us
              <ArrowIcon />
            </Link>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
