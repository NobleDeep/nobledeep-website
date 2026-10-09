"use client";

import { useEffect, useRef, useState } from "react";

/*
  Counts a number up once when it first scrolls into view. The server
  render and the reduced-motion path both show the final value.
*/
export default function CountUp({
  to,
  from = 0,
  prefix = "",
  suffix = "",
  duration = 1400,
}: {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only animate if the number starts below the fold; otherwise leave it.
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setValue(from);

    let raf = 0;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const u = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - u, 3);
          setValue(Math.round(from + (to - from) * eased));
          if (u < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, from, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
