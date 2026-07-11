"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/",           label: "Home"       },
  { href: "/technology", label: "Technology" },
  { href: "/about",      label: "About"      },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    /*
      Apply transition via inline style (not class) so it's set once,
      regardless of what React/Tailwind does to the class list.
    */
    el.style.transition =
      "background-color 0.45s ease, backdrop-filter 0.45s ease, " +
      "-webkit-backdrop-filter 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease";

    const update = () => {
      if (window.scrollY > 20) {
        el.style.backgroundColor    = "rgba(0, 15, 40, 0.82)";
        el.style.backdropFilter      = "blur(18px) saturate(160%)";
        (el.style as CSSStyleDeclaration & { webkitBackdropFilter: string }).webkitBackdropFilter =
          "blur(18px) saturate(160%)";
        el.style.borderBottomColor   = "rgba(255,255,255,0.07)";
        el.style.boxShadow           = "0 1px 0 0 rgba(144,224,239,0.04)";
      } else {
        el.style.backgroundColor    = "transparent";
        el.style.backdropFilter      = "none";
        (el.style as CSSStyleDeclaration & { webkitBackdropFilter: string }).webkitBackdropFilter = "none";
        el.style.borderBottomColor   = "transparent";
        el.style.boxShadow           = "none";
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  /* When the mobile menu opens while at top-of-page, force the bg so
     the dropdown content is readable against a transparent header. */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    if (open && window.scrollY <= 20) {
      el.style.backgroundColor = "rgba(0, 15, 40, 0.92)";
      el.style.backdropFilter  = "blur(18px)";
    } else if (!open && window.scrollY <= 20) {
      el.style.backgroundColor = "transparent";
      el.style.backdropFilter  = "none";
    }
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b"
      /* Inline style: completely transparent on first paint — before JS runs */
      style={{ backgroundColor: "transparent", borderBottomColor: "transparent" }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center shrink-0 group">
            {/*
              Transparent cutout PNG (mark + wordmark) — sits directly on
              any background, no blend-mode compositing needed.
            */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/nd-logo-cutout.png"
              alt="Noble Deep"
              className="group-hover:opacity-100 opacity-90 transition-opacity"
              style={{
                height:     "44px",
                width:      "auto",
                display:    "block",
                flexShrink: 0,
              }}
            />
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-medium uppercase tracking-widest transition-colors ${
                  pathname === link.href
                    ? "text-white"
                    : "text-[#90e0ef]/65 hover:text-[#90e0ef]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className={`text-xs font-medium uppercase tracking-widest transition-colors ${
                pathname === "/contact"
                  ? "text-[#22d3ee]"
                  : "text-[#22d3ee]/80 hover:text-[#22d3ee]"
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* ── Mobile hamburger ── */}
          <button
            className="md:hidden p-1.5 text-[#90e0ef]/60 hover:text-[#90e0ef] transition-colors"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {open && (
          <nav className="md:hidden border-t border-white/[0.06] py-5 flex flex-col gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-xs font-medium uppercase tracking-widest transition-colors ${
                  pathname === link.href ? "text-white" : "text-[#90e0ef]/60 hover:text-[#90e0ef]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="text-xs font-medium uppercase tracking-widest text-[#22d3ee]"
            >
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
