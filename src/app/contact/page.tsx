import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — Noble Deep",
  description:
    "Get in touch with Noble Deep about TRITON, early access, or partnership opportunities.",
};

export default function ContactPage() {
  return (
    <>
      {/* ─── HEADER ──────────────────────────────────────────────── */}
      <section className="px-6 lg:px-10 pt-24 pb-16">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#90e0ef]/50 mb-10">
              Contact
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white max-w-2xl">
              Let&apos;s talk about your monitoring challenge.
            </h1>
          </FadeIn>
        </div>
      </section>

      {/* ─── FORM ────────────────────────────────────────────────── */}
      <section
        className="px-6 lg:px-10 py-16 border-t border-[#90e0ef]/[0.1]"
        style={{ boxShadow: "0 -1px 0 0 rgba(144,224,239,0.04)" }}
      >
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1.6fr_1fr] gap-16 lg:gap-24">
          {/* Form */}
          <FadeIn>
            <ContactForm />
          </FadeIn>

          {/* Sidebar */}
          <FadeIn delay={120}>
            <div className="flex flex-col gap-10">
              {/* Contact info */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#90e0ef]/40 mb-4">
                  Reach Us
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href="mailto:andrew@nobledeepsea.com"
                    className="text-sm text-[#90e0ef] hover:text-white transition-colors"
                  >
                    andrew@nobledeepsea.com
                  </a>
                  <a
                    href="mailto:gabriel@nobledeepsea.com"
                    className="text-sm text-[#90e0ef] hover:text-white transition-colors"
                  >
                    gabriel@nobledeepsea.com
                  </a>
                  <p className="text-sm text-[#90e0ef]/60">Based in California</p>
                </div>
              </div>

              {/* Who we work with */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#90e0ef]/40 mb-4">
                  Who We Work With
                </p>
                <ul className="flex flex-col gap-2.5">
                  {[
                    "Offshore wind operators",
                    "Oil & gas field operators",
                    "Subsea engineering firms",
                    "Offshore energy investors",
                  ].map((item) => (
                    <li key={item} className="text-sm text-[#90e0ef] flex items-center gap-2.5">
                      <span className="w-3 border-t border-[#90e0ef]/25" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Early partner */}
              <div
                className="border-l-2 border-[#22d3ee]/30 pl-5"
                style={{ boxShadow: "-2px 0 12px rgba(34,211,238,0.05)" }}
              >
                <p className="text-xs font-semibold text-white mb-2">Early Partner Program</p>
                <p className="text-sm text-[#90e0ef] leading-relaxed">
                  We&apos;re seeking offshore operators to validate TRITON in live
                  environments. Partners get early access and direct input into
                  the product.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
