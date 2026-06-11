"use client";

import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

/* Moves children at `speed` fraction of scroll distance.
   speed=0.15 → element moves 15px per 100px scrolled (floats in place). */
export default function ScrollParallax({ children, speed = 0.15, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      if (el) {
        el.style.transform = `translateY(${window.scrollY * speed}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
