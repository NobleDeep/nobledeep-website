import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import { Eyebrow, Section } from "@/components/ui";
import { pageMeta } from "@/lib/meta";
import ContactForm from "./ContactForm";

export const metadata: Metadata = pageMeta(
  "Contact",
  "Talk to Noble Deep about continuous subsea inspection with Casper, the early partner program, or investment.",
  "/contact"
);

export default function ContactPage() {
  return (
    <>
      {/* ─── HEADER ──────────────────────────────────────────────── */}
      <section className="px-6 lg:px-10 pt-24 lg:pt-32 pb-20 lg:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="animate-hero animate-hero-1">
            <Eyebrow>Contact</Eyebrow>
          </div>
          <div className="animate-hero animate-hero-2">
            <h1 className="mt-10 text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.0] tracking-[-0.03em] text-white max-w-4xl">
              Let&apos;s talk about your monitoring challenge.
            </h1>
          </div>
        </div>
      </section>

      {/* ─── FORM ────────────────────────────────────────────────── */}
      <Section band depth="040 m" innerClassName="grid lg:grid-cols-[1.6fr_1fr] gap-16 lg:gap-24">
        {/* Form */}
        <FadeIn>
          <ContactForm />
        </FadeIn>

        {/* Sidebar */}
        <FadeIn delay={120}>
          <div className="flex flex-col gap-10">
            {/* Contact info */}
            <div>
              <p className="label-mono mb-5">
                Reach Us
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:andrew@nobledeepsea.com"
                  className="text-base text-white hover:text-cyan transition-colors w-fit"
                >
                  andrew@nobledeepsea.com
                </a>
                <a
                  href="mailto:gabriel@nobledeepsea.com"
                  className="text-base text-white hover:text-cyan transition-colors w-fit"
                >
                  gabriel@nobledeepsea.com
                </a>
                <p className="text-base text-muted">Based in California</p>
              </div>
            </div>

            {/* Who we work with */}
            <div>
              <p className="label-mono mb-5">
                Who We Work With
              </p>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Offshore wind operators",
                  "Oil & gas field operators",
                  "Subsea engineering firms",
                  "Offshore energy investors",
                ].map((item) => (
                  <li key={item} className="text-base text-body flex items-center gap-3">
                    <span aria-hidden className="w-3 border-t border-cyan/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Early partner */}
            <div className="border-l-2 border-cyan pl-5">
              <p className="label-mono !text-cyan mb-3">Early Partner Program</p>
              <p className="text-base text-body leading-relaxed">
                We&apos;re seeking offshore operators to validate Casper in live
                environments. Partners get early access and direct input into
                the product.
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
