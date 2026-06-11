"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  size: number; opacity: number;
  speed: number; drift: number;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    const dpr = window.devicePixelRatio || 1;

    const setSize = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.scale(dpr, dpr);
      particles = Array.from({ length: 75 }, () => ({
        x:       Math.random() * w,
        y:       Math.random() * h,
        size:    Math.random() * 1.4 + 0.2,
        opacity: Math.random() * 0.055 + 0.01,
        speed:   Math.random() * 0.22 + 0.04,
        drift:   (Math.random() - 0.5) * 0.06,
      }));
    };
    setSize();

    const wave = (yBase: number, amp: number, period: number, phase: number, op: number, w: number) => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(144,224,239,${op})`;
      ctx.lineWidth   = 0.8;
      for (let x = 0; x <= w; x += 2) {
        const y = yBase + amp * Math.sin((x / w) * Math.PI * 2 * period + phase);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const animate = () => {
      const w = canvas.width  / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      const now = Date.now();
      const t   = now / 1000;

      /* faint horizontal sonar scan line */
      const sy = ((now / 7000) % 1) * h;
      const sg = ctx.createLinearGradient(0, sy - 60, 0, sy + 60);
      sg.addColorStop(0,   "rgba(144,224,239,0)");
      sg.addColorStop(0.5, "rgba(144,224,239,0.016)");
      sg.addColorStop(1,   "rgba(144,224,239,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, sy - 60, w, 120);

      /* slow sine waves near the bottom */
      const wt = t * 0.25;
      wave(h * 0.74,  8, 2.4, wt,              0.034, w);
      wave(h * 0.81,  6, 3.1, wt * 0.73 + 1.2, 0.024, w);
      wave(h * 0.89, 10, 1.9, wt * 0.52 + 2.5, 0.018, w);

      /* particles rising slowly */
      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; p.opacity = Math.random() * 0.055 + 0.01; }
        if (p.x < 0)  p.x = w;
        if (p.x > w)  p.x = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(144,224,239,${p.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); setSize(); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
    />
  );
}
