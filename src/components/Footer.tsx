import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[#90e0ef]/10 shadow-[0_-1px_0_0_rgba(144,224,239,0.04)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center">
              <Image src="/nd-logo-cutout.png" alt="Noble Deep" width={745} height={467} className="h-10 w-auto" />
            </Link>
            <p className="text-xs text-[#90e0ef]/40 leading-relaxed max-w-[220px]">
              Seafloor-resident autonomous monitoring.<br />Continuous, not periodic.
            </p>
            {/* Draper University badge */}
            <div className="mt-1 inline-flex items-center gap-2 border border-[#90e0ef]/15 rounded-sm px-2.5 py-1.5 w-fit">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#90e0ef]/40">
                Draper University Alumni Company
              </span>
            </div>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#90e0ef]/30 mb-1">Site</p>
            {[
              { href: "/", label: "Home" },
              { href: "/technology", label: "Technology" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-[#90e0ef]/45 hover:text-[#90e0ef] transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#90e0ef]/30 mb-1">Contact</p>
            <a href="mailto:andrew@nobledeepsea.com" className="text-xs text-[#90e0ef]/45 hover:text-[#90e0ef] transition-colors">
              andrew@nobledeepsea.com
            </a>
            <a href="mailto:gabriel@nobledeepsea.com" className="text-xs text-[#90e0ef]/45 hover:text-[#90e0ef] transition-colors">
              gabriel@nobledeepsea.com
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#90e0ef]/[0.06] flex items-center justify-between flex-wrap gap-4">
          <p className="text-[11px] text-[#90e0ef]/25">
            &copy; {new Date().getFullYear()} Noble Deep
          </p>
          <p className="text-[11px] text-[#90e0ef]/25 tracking-wide uppercase">
            TRITON — Seafloor-Resident AUV
          </p>
        </div>
      </div>
    </footer>
  );
}
