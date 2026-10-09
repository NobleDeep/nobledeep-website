/*
  Shared layout primitives so spacing, rules, and labels stay identical
  across every page.
*/

export function ArrowIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

/* Monospace section label: optional index number, a short rule, then the name. */
export function Eyebrow({
  index,
  children,
  className = "",
  as: Tag = "p",
}: {
  index?: string;
  children: React.ReactNode;
  className?: string;
  as?: "p" | "h2" | "span";
}) {
  return (
    <Tag className={`label-mono flex items-center gap-3 ${className}`}>
      {index && <span className="text-cyan">{index}</span>}
      <span aria-hidden className="h-px w-8 bg-cyan/50" />
      <span>{children}</span>
    </Tag>
  );
}

/*
  Page section. `band` gives a full-bleed tinted band with hairline rules
  top and bottom; `depth` adds a small depth marker on the top rule.
*/
export function Section({
  children,
  band = false,
  depth,
  className = "",
  innerClassName = "",
  id,
}: {
  children: React.ReactNode;
  band?: boolean;
  depth?: string;
  className?: string;
  innerClassName?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative px-6 lg:px-10 py-24 lg:py-32 ${
        band ? "bg-white/[0.025] border-y border-foam/[0.09]" : ""
      } ${className}`}
    >
      {depth && (
        <span
          aria-hidden
          className="label-mono !text-[10px] !text-foam/45 absolute right-6 lg:right-10 top-0 -translate-y-1/2 bg-transparent hidden sm:flex items-center gap-2"
        >
          <span className="h-px w-4 bg-foam/30" />
          {depth}
        </span>
      )}
      <div className={`mx-auto max-w-7xl ${innerClassName}`}>{children}</div>
    </section>
  );
}
