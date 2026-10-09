import Link from "next/link";
import Image from "next/image";

const linkClass = "text-sm text-body hover:text-white transition-colors w-fit";

export default function Footer() {
  return (
    <footer className="border-t border-foam/12 bg-black/20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center w-fit">
              <Image src="/nd-logo-cutout.png" alt="Noble Deep home" width={745} height={467} className="h-11 w-auto" />
            </Link>
            <p className="text-sm text-body leading-relaxed max-w-[260px]">
              Autonomous subsea inspection.
              <br />
              Continuous, not periodic.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="border border-foam/20 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foam/75">
                Draper University Alumni Company
              </span>
              <span className="border border-foam/20 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foam/75">
                Finalist · Ocean Exchange 2026 Collegiate Awards
              </span>
            </div>
          </div>

          {/* Nav */}
          <nav aria-label="Footer" className="flex flex-col gap-3">
            <p className="label-mono mb-1">Site</p>
            {[
              { href: "/", label: "Home" },
              { href: "/technology", label: "Technology" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p className="label-mono mb-1">Contact</p>
            <a href="mailto:andrew@nobledeepsea.com" className={linkClass}>
              andrew@nobledeepsea.com
            </a>
            <a href="mailto:gabriel@nobledeepsea.com" className={linkClass}>
              gabriel@nobledeepsea.com
            </a>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-foam/10 flex items-center justify-between flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          <p>&copy; {new Date().getFullYear()} Noble Deep</p>
          <p>Casper AUV</p>
        </div>
      </div>
    </footer>
  );
}
