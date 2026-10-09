"use client";

import { useEffect, useRef } from "react";

/*
  Hero scene: a generic torpedo AUV surveys an export cable on an offshore
  wind site, detects cable exposure in a scour pit beside a monopile, drops
  a marker, and posts a condition report.

  Rendering
  - Static layers (water column, far monopiles, seabed, main pile, cable)
    are drawn once per resize into an offscreen canvas.
  - Each frame draws that cache, then light shafts, marine snow, the
    vehicle, scan beam, scan returns, and the anomaly marker.
  - Caustics come from a small fragment shader on a separate low-res
    WebGL canvas covering the top of the scene.
  - HUD values and the report card are plain DOM, updated by reference.

  Behaviour
  - Pauses when offscreen or when the tab is hidden; scene time only
    advances while running, so the loop resumes where it left off.
  - prefers-reduced-motion: one static frame with the report visible.
  - Nothing renders until after hydration, so it never blocks first paint;
    the CSS gradient underneath stands in until the first frame.

  The vehicle is a deliberately generic silhouette, not our hardware.
*/

/* ── Timeline (seconds within one loop) ─────────────────────────── */
const LOOP = 27;
const T_ARRIVE = 11.5; // reaches the scan position
const T_DETECT = 13.0; // anomaly flagged
const T_REPORT = 14.2; // condition report posts
const T_LEAVE = 16.8; // resumes the route
const T_GONE = 25.0; // fully faded out at the far side
const STATIC_T = 16.2; // reduced-motion frame

const MODES: [number, string][] = [
  [0, "Survey"],
  [T_DETECT - 0.6, "Detect"],
  [T_REPORT, "Report"],
  [T_LEAVE + 1.5, "Survey"],
  [T_GONE - 0.5, "Repeat"],
];

/* ── Helpers ────────────────────────────────────────────────────── */
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const smooth = (a: number, b: number, v: number) => {
  const u = clamp((v - a) / (b - a), 0, 1);
  return u * u * (3 - 2 * u);
};
const easeInOut = (u: number) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(u, 0, 1));

/* Deterministic PRNG so reduced-motion frames and resizes look stable */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Geo = {
  W: number;
  H: number;
  mobile: boolean;
  seabed0: number;
  pileX: number;
  pileW: number;
  scourC: number;
  scourW: number;
  scourD: number;
  L: number; // vehicle length
  cruiseY: number;
  x0: number;
  xA: number;
  xB: number;
  xEnd: number;
  card: { left: number; top: number; width: number };
};

function layout(W: number, H: number): Geo {
  const mobile = W < 768;
  const seabed0 = mobile ? H - 96 : H * 0.84;
  const pileX = mobile ? W * 0.8 : W * 0.775;
  const pileW = mobile ? 20 : clamp(W * 0.022, 24, 34);
  const scourW = mobile ? 30 : clamp(W * 0.034, 34, 60);
  const scourC = pileX - pileW / 2 - scourW * 0.9;
  const scourD = mobile ? 11 : clamp(H * 0.022, 14, 22);
  const L = mobile ? 78 : clamp(W * 0.075, 96, 150);
  const cruiseY = seabed0 - (mobile ? 48 : clamp(H * 0.075, 52, 80));
  const cardW = mobile ? Math.min(300, W - 32) : 288;
  return {
    W,
    H,
    mobile,
    seabed0,
    pileX,
    pileW,
    scourC,
    scourW,
    scourD,
    L,
    cruiseY,
    x0: mobile ? -L * 0.6 : W * 0.4,
    xA: scourC - L * 1.05,
    xB: scourC - L * 0.55,
    xEnd: mobile ? W + L : W * 0.985,
    card: mobile
      ? { left: 16, top: seabed0 - 262, width: cardW }
      : { left: W - cardW - Math.max(64, W * 0.045), top: H * 0.36, width: cardW },
  };
}

/* Undisturbed seabed profile, then the profile with the scour pit cut in */
const baseSeabed = (g: Geo, x: number) =>
  g.seabed0 + 5 * Math.sin(x * 0.006 + 0.7) + 2.5 * Math.sin(x * 0.017 + 2.1);
const scourDip = (g: Geo, x: number) => g.scourD * Math.exp(-(((x - g.scourC) / g.scourW) ** 2));
const seabed = (g: Geo, x: number) => baseSeabed(g, x) + scourDip(g, x);
/* The cable sits just under the original surface; across the pit it sags a little but stays above the new bed */
const cableY = (g: Geo, x: number) => baseSeabed(g, x) + 2 + scourDip(g, x) * 0.32;

/* Vehicle state at scene time t */
function vehicle(g: Geo, t: number) {
  let x: number;
  if (t < T_ARRIVE) {
    const u = t / T_ARRIVE;
    x = lerp(g.x0, g.xA, 0.5 * u + 0.5 * (1 - (1 - u) * (1 - u)));
  } else if (t < T_LEAVE) {
    x = lerp(g.xA, g.xB, easeInOut((t - T_ARRIVE) / (T_LEAVE - T_ARRIVE)));
  } else {
    const u = clamp((t - T_LEAVE) / (T_GONE - T_LEAVE), 0, 1);
    x = lerp(g.xB, g.xEnd, 0.35 * u + 0.65 * u * u);
  }
  // Climb a little to clear the cable entry at the pile, plus a slow bob
  const near = Math.exp(-(((x - g.pileX) / (g.L * 1.3)) ** 2));
  const y = g.cruiseY - near * (g.mobile ? 18 : g.L * 0.22) + Math.sin(t * 0.9) * 1.6;
  const alpha = smooth(0, 1.8, t) * (1 - smooth(T_GONE - 2.2, T_GONE, t));
  const pitch = Math.sin(t * 0.9 + 1.2) * 0.012 - near * 0.03 * Math.sign(g.pileX - x);
  return { x, y, alpha, pitch };
}

/* ── Static layer ───────────────────────────────────────────────── */
function drawStatic(ctx: CanvasRenderingContext2D, g: Geo) {
  const { W, H } = g;

  // Water column: light falls off with depth
  const sea = ctx.createLinearGradient(0, 0, 0, H);
  sea.addColorStop(0, "#0f4166");
  sea.addColorStop(0.28, "#0a2f50");
  sea.addColorStop(0.6, "#061f39");
  sea.addColorStop(1, "#03111f");
  ctx.fillStyle = sea;
  ctx.fillRect(0, 0, W, H);

  const sun = ctx.createRadialGradient(W * 0.62, -H * 0.15, 0, W * 0.62, -H * 0.15, H * 1.1);
  sun.addColorStop(0, "rgba(120,200,235,0.28)");
  sun.addColorStop(0.5, "rgba(60,140,190,0.08)");
  sun.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = sun;
  ctx.fillRect(0, 0, W, H);

  // Far wind-farm foundations, increasingly lost in haze
  const farBed = g.seabed0 - (g.mobile ? 34 : H * 0.07);
  const far = g.mobile
    ? [
        [0.12, 5, 0.1],
        [0.42, 7, 0.14],
        [0.62, 4, 0.08],
      ]
    : [
        [0.1, 6, 0.08],
        [0.27, 9, 0.13],
        [0.45, 5, 0.07],
        [0.57, 11, 0.16],
        [0.92, 8, 0.12],
      ];
  for (const [fx, fw, a] of far) {
    const w = Math.max(3, fw * (W / 1440));
    const x = fx * W;
    const grad = ctx.createLinearGradient(0, 0, 0, farBed);
    grad.addColorStop(0, `rgba(80,140,175,${a * 1.4})`);
    grad.addColorStop(1, `rgba(40,90,125,${a})`);
    ctx.fillStyle = grad;
    ctx.fillRect(x - w / 2, 0, w, farBed - 6);
  }

  // Far seabed ridge
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 8) {
    ctx.lineTo(x, farBed + 6 * Math.sin(x * 0.004 + 1.3) + 3 * Math.sin(x * 0.013));
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fillStyle = "rgba(9,36,58,0.85)";
  ctx.fill();

  // Haze band where distance swallows detail
  const haze = ctx.createLinearGradient(0, farBed - H * 0.2, 0, g.seabed0);
  haze.addColorStop(0, "rgba(40,105,145,0)");
  haze.addColorStop(0.55, "rgba(40,105,145,0.16)");
  haze.addColorStop(1, "rgba(40,105,145,0)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, farBed - H * 0.2, W, g.seabed0 - farBed + H * 0.2);

  // Main monopile: lit from above-left, darker toward the bed
  const px = g.pileX - g.pileW / 2;
  const pileBottom = g.seabed0 + 30;
  const pg = ctx.createLinearGradient(px, 0, px + g.pileW, 0);
  pg.addColorStop(0, "#4f7f9c");
  pg.addColorStop(0.35, "#2a5270");
  pg.addColorStop(1, "#0c2236");
  ctx.fillStyle = pg;
  ctx.fillRect(px, 0, g.pileW, pileBottom);
  const pv = ctx.createLinearGradient(0, 0, 0, pileBottom);
  pv.addColorStop(0, "rgba(120,190,225,0.18)");
  pv.addColorStop(0.5, "rgba(6,30,52,0.1)");
  pv.addColorStop(1, "rgba(3,14,26,0.55)");
  ctx.fillStyle = pv;
  ctx.fillRect(px, 0, g.pileW, pileBottom);
  // Weld seams and sacrificial anodes
  ctx.strokeStyle = "rgba(160,220,240,0.14)";
  ctx.lineWidth = 1;
  for (let y = g.seabed0 * 0.22; y < g.seabed0; y += g.seabed0 * 0.19) {
    ctx.beginPath();
    ctx.moveTo(px, y);
    ctx.lineTo(px + g.pileW, y);
    ctx.stroke();
  }
  ctx.fillStyle = "#1b3a52";
  for (const fy of [0.48, 0.7]) {
    const y = g.seabed0 * fy;
    ctx.fillRect(px - 4, y, 4, 12);
    ctx.fillRect(px + g.pileW, y + 6, 4, 12);
  }
  // Marine growth band near the bed
  const growth = ctx.createLinearGradient(0, g.seabed0 - 60, 0, g.seabed0);
  growth.addColorStop(0, "rgba(40,70,60,0)");
  growth.addColorStop(1, "rgba(40,70,60,0.35)");
  ctx.fillStyle = growth;
  ctx.fillRect(px, g.seabed0 - 60, g.pileW, 60);

  // Near seabed, with the scour pit
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (let x = 0; x <= W; x += 3) ctx.lineTo(x, seabed(g, x));
  ctx.lineTo(W, H);
  ctx.closePath();
  const bed = ctx.createLinearGradient(0, g.seabed0 - 10, 0, H);
  bed.addColorStop(0, "#123553");
  bed.addColorStop(0.35, "#0a2338");
  bed.addColorStop(1, "#04101d");
  ctx.fillStyle = bed;
  ctx.fill();

  // Shadow inside the pit
  const pit = ctx.createRadialGradient(g.scourC, g.seabed0 + g.scourD, 0, g.scourC, g.seabed0 + g.scourD, g.scourW * 1.6);
  pit.addColorStop(0, "rgba(2,8,16,0.5)");
  pit.addColorStop(1, "rgba(2,8,16,0)");
  ctx.fillStyle = pit;
  ctx.fillRect(g.scourC - g.scourW * 2, g.seabed0 - 10, g.scourW * 4, g.scourD + 60);

  // Light catching the top of the bed
  ctx.beginPath();
  for (let x = 0; x <= W; x += 3) {
    const y = seabed(g, x);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "rgba(150,215,240,0.22)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Sand ripples and stones
  const r = rng(7);
  ctx.strokeStyle = "rgba(150,215,240,0.06)";
  for (let i = 0; i < W / 22; i++) {
    const x = r() * W;
    const y = seabed(g, x) + 6 + r() * (H - g.seabed0) * 0.7;
    const w = 6 + r() * 14;
    ctx.beginPath();
    ctx.moveTo(x - w, y);
    ctx.quadraticCurveTo(x, y - 2.5, x + w, y);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(20,50,72,0.9)";
  for (let i = 0; i < W / 45; i++) {
    const x = r() * W;
    if (Math.abs(x - g.pileX) < g.pileW) continue;
    const y = seabed(g, x) + 1 + r() * 3;
    ctx.beginPath();
    ctx.ellipse(x, y, 1.5 + r() * 3, 1 + r() * 1.5, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Export cable: dashed while buried, solid where the scour exposed it
  const entryX = g.pileX - g.pileW / 2;
  ctx.setLineDash([5, 6]);
  ctx.strokeStyle = "rgba(34,211,238,0.2)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let x = 0; x <= entryX - 14; x += 3) {
    const y = cableY(g, x);
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  const [ex1, ex2] = exposedSpan(g);
  ctx.lineCap = "round";
  ctx.strokeStyle = "#0b1a26";
  ctx.lineWidth = g.mobile ? 3.2 : 4;
  ctx.beginPath();
  for (let x = ex1; x <= ex2; x += 2) {
    const y = cableY(g, x);
    if (x === ex1) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  // Rises into the pile's cable entry
  ctx.quadraticCurveTo(entryX - 4, cableY(g, ex2), entryX, g.seabed0 - 16);
  ctx.stroke();
  ctx.strokeStyle = "rgba(170,225,245,0.35)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.lineCap = "butt";
}

function exposedSpan(g: Geo): [number, number] {
  // Cable is exposed where the bed has dropped below it
  let a = g.scourC;
  while (a > 0 && seabed(g, a) - cableY(g, a) > 1.2) a -= 1;
  return [a, g.pileX - g.pileW / 2 - 14];
}

/* ── Particle sprite ────────────────────────────────────────────── */
function makeSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const x = c.getContext("2d")!;
  const gr = x.createRadialGradient(16, 16, 0, 16, 16, 16);
  gr.addColorStop(0, "rgba(220,240,250,1)");
  gr.addColorStop(0.35, "rgba(200,232,248,0.55)");
  gr.addColorStop(1, "rgba(200,232,248,0)");
  x.fillStyle = gr;
  x.fillRect(0, 0, 32, 32);
  return c;
}

type Flake = { x: number; y: number; s: number; a: number; v: number; ph: number; layer: number };

function makeSnow(g: Geo, seed: number): Flake[] {
  const r = rng(seed);
  const area = g.W * g.H;
  const layers = [
    { n: area / 9000, s: [1.4, 2.6], a: [0.18, 0.4], v: [5, 9] },
    { n: area / 26000, s: [2.6, 4.2], a: [0.25, 0.5], v: [9, 15] },
    { n: area / 110000, s: [8, 16], a: [0.05, 0.12], v: [16, 26] },
  ];
  const out: Flake[] = [];
  layers.forEach((L, layer) => {
    const n = Math.round(Math.min(L.n, g.mobile ? 90 : 220));
    for (let i = 0; i < n; i++) {
      out.push({
        x: r() * g.W,
        y: r() * g.H,
        s: lerp(L.s[0], L.s[1], r()),
        a: lerp(L.a[0], L.a[1], r()),
        v: lerp(L.v[0], L.v[1], r()),
        ph: r() * Math.PI * 2,
        layer,
      });
    }
  });
  return out;
}

/* ── Vehicle drawing: generic torpedo silhouette ────────────────── */
function drawVehicle(ctx: CanvasRenderingContext2D, L: number, t: number) {
  const R = L * 0.075;
  const tail = L * 0.2;
  const nose = R * 1.8;
  const hx = L / 2;

  // Tail fins (behind the hull)
  ctx.fillStyle = "#1d3447";
  ctx.beginPath();
  ctx.moveTo(-hx + L * 0.05, -R * 0.4);
  ctx.lineTo(-hx + L * 0.03, -R * 1.85);
  ctx.lineTo(-hx + L * 0.11, -R * 1.85);
  ctx.lineTo(-hx + L * 0.17, -R * 0.85);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#132635";
  ctx.beginPath();
  ctx.moveTo(-hx + L * 0.05, R * 0.4);
  ctx.lineTo(-hx + L * 0.03, R * 1.85);
  ctx.lineTo(-hx + L * 0.11, R * 1.85);
  ctx.lineTo(-hx + L * 0.17, R * 0.85);
  ctx.closePath();
  ctx.fill();

  // Hull
  ctx.beginPath();
  ctx.moveTo(-hx + tail, -R);
  ctx.lineTo(hx - nose, -R);
  ctx.bezierCurveTo(hx - nose * 0.3, -R, hx, -R * 0.55, hx, 0);
  ctx.bezierCurveTo(hx, R * 0.55, hx - nose * 0.3, R, hx - nose, R);
  ctx.lineTo(-hx + tail, R);
  ctx.lineTo(-hx + L * 0.02, R * 0.4);
  ctx.lineTo(-hx + L * 0.02, -R * 0.4);
  ctx.closePath();
  const hull = ctx.createLinearGradient(0, -R, 0, R);
  hull.addColorStop(0, "#7f9fb5");
  hull.addColorStop(0.22, "#466681");
  hull.addColorStop(0.6, "#213a4f");
  hull.addColorStop(1, "#0b1824");
  ctx.fillStyle = hull;
  ctx.fill();
  ctx.strokeStyle = "rgba(170,225,245,0.22)";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Section seams
  ctx.save();
  ctx.clip();
  ctx.strokeStyle = "rgba(5,15,25,0.55)";
  ctx.lineWidth = 1;
  for (const sx of [-L * 0.14, L * 0.16]) {
    ctx.beginPath();
    ctx.moveTo(sx, -R);
    ctx.lineTo(sx, R);
    ctx.stroke();
  }
  ctx.restore();

  // Rim light along the top
  ctx.strokeStyle = "rgba(205,240,255,0.45)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-hx + tail + 2, -R + 0.6);
  ctx.lineTo(hx - nose, -R + 0.6);
  ctx.stroke();

  // Side fin toward the viewer
  ctx.fillStyle = "#2b4a61";
  ctx.beginPath();
  ctx.moveTo(-hx + L * 0.05, R * 0.05);
  ctx.lineTo(-hx + L * 0.16, R * 0.15);
  ctx.lineTo(-hx + L * 0.15, R * 0.55);
  ctx.lineTo(-hx + L * 0.04, R * 0.5);
  ctx.closePath();
  ctx.fill();

  // Propeller shroud
  ctx.fillStyle = "#0b1622";
  ctx.beginPath();
  ctx.ellipse(-hx + L * 0.015, 0, R * 0.14, R * 0.62, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sensor window on the belly
  ctx.fillStyle = "rgba(34,211,238,0.55)";
  ctx.beginPath();
  ctx.ellipse(L * 0.27, R * 0.78, R * 0.42, R * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Navigation strobe
  if (t % 2.4 < 0.1) {
    ctx.fillStyle = "rgba(200,250,255,0.95)";
    ctx.beginPath();
    ctx.arc(-L * 0.02, -R - 0.5, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ── Caustics shader (top of the water column) ──────────────────── */
const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_time;
#define TAU 6.28318530718
float caustic(vec2 uv, float t){
  vec2 p = mod(uv*TAU*vec2(1.6,1.0), TAU) - 250.0;
  vec2 i = p;
  float c = 1.0;
  float inten = 0.005;
  for (int n = 0; n < 4; n++) {
    float t2 = t * (1.0 - 3.5 / (float(n) + 1.0));
    i = p + vec2(cos(t2 - i.x) + sin(t2 + i.y), sin(t2 - i.y) + cos(t2 + i.x));
    float sx = sin(i.x + t2); sx = abs(sx) < 0.0001 ? 0.0001 : sx;
    float cy = cos(i.y + t2); cy = abs(cy) < 0.0001 ? 0.0001 : cy;
    c += 1.0 / max(length(vec2(p.x / (sx / inten), p.y / (cy / inten))), 0.0001);
  }
  c /= 4.0;
  c = 1.17 - pow(c, 1.4);
  return pow(abs(c), 8.0);
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float c = caustic(uv * vec2(u_res.x / u_res.y * 0.5, 1.0), u_time * 0.3);
  float fall = uv.y * uv.y * uv.y;
  gl_FragColor = vec4(vec3(0.75, 0.92, 1.0), clamp(c * fall * 0.5, 0.0, 1.0));
}`;

function initCaustics(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false });
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const v = sh(gl.VERTEX_SHADER, VERT);
  const f = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!v || !f) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, v);
  gl.attachShader(prog, f);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  const uRes = gl.getUniformLocation(prog, "u_res");
  const uTime = gl.getUniformLocation(prog, "u_time");
  return {
    resize(w: number, h: number) {
      canvas.width = Math.max(1, Math.round(w));
      canvas.height = Math.max(1, Math.round(h));
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    draw(t: number) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    dispose() {
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    },
  };
}

/* ── Component ──────────────────────────────────────────────────── */
export default function HeroScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const causticRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<HTMLSpanElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);
  const hdgRef = useRef<HTMLSpanElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sprite = makeSprite();
    const staticLayer = document.createElement("canvas");
    const caustics = causticRef.current ? initCaustics(causticRef.current) : null;
    const monoFont =
      getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains-mono").trim() || "monospace";

    let g = layout(1, 1);
    let dpr = 1;
    let snow: Flake[] = [];
    let trail: { x: number; y: number; t: number }[] = [];
    let lastTrail = 0;
    let sceneT = reduced ? STATIC_T : 0.4;
    let missionT = 6138; // seconds; HUD mission clock starts at 01:42:18
    let raf = 0;
    let last = 0;
    let running = false;
    let onscreen = true;
    let lastHud = -1;
    let cardOn = false;

    const resize = () => {
      const W = root.clientWidth;
      const H = root.clientHeight;
      if (!W || !H) return;
      g = layout(W, H);
      dpr = Math.min(window.devicePixelRatio || 1, g.mobile ? 1.5 : 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      staticLayer.width = canvas.width;
      staticLayer.height = canvas.height;
      const sctx = staticLayer.getContext("2d")!;
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawStatic(sctx, g);
      snow = makeSnow(g, 11);
      trail = [];
      caustics?.resize(W * 0.5, H * 0.55 * 0.5);
      const card = cardRef.current;
      if (card) {
        card.style.left = `${g.card.left}px`;
        card.style.top = `${g.card.top}px`;
        card.style.width = `${g.card.width}px`;
      }
      if (!running) render(0);
    };

    const render = (dt: number) => {
      const { W, H } = g;
      const t = sceneT;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.drawImage(staticLayer, 0, 0, W, H);

      // Light shafts
      ctx.globalCompositeOperation = "lighter";
      const shafts = g.mobile ? 3 : 5;
      for (let i = 0; i < shafts; i++) {
        const cx = W * (0.15 + i * (0.8 / shafts)) + Math.sin(t * 0.12 + i * 1.7) * 26;
        const w = W * (0.035 + 0.02 * ((i * 7) % 3));
        const len = H * (0.7 + 0.08 * (i % 2));
        const gr = ctx.createLinearGradient(0, 0, 0, len);
        const a = 0.05 + 0.02 * Math.sin(t * 0.3 + i);
        gr.addColorStop(0, `rgba(170,225,245,${a})`);
        gr.addColorStop(1, "rgba(170,225,245,0)");
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.moveTo(cx - w, 0);
        ctx.lineTo(cx + w, 0);
        ctx.lineTo(cx + w * 2.2 - len * 0.22, len);
        ctx.lineTo(cx - w * 2.2 - len * 0.22, len);
        ctx.closePath();
        ctx.fill();
      }

      // Marine snow: far and mid layers behind the vehicle
      const drawFlakes = (layer: number) => {
        for (const f of snow) {
          if (f.layer !== layer) continue;
          if (dt) {
            f.y += f.v * dt;
            f.x += (Math.sin(t * 0.4 + f.ph) * 3 - 4 - layer * 2) * dt;
            if (f.y > H + 10) {
              f.y = -10;
              f.x = Math.random() * W;
            }
            if (f.x < -20) f.x = W + 20;
          }
          // Fainter near the surface glare and in the deep haze
          const depthFade = 0.55 + 0.45 * smooth(0, H * 0.3, f.y);
          ctx.globalAlpha = f.a * depthFade;
          ctx.drawImage(sprite, f.x - f.s / 2, f.y - f.s / 2, f.s, f.s);
        }
        ctx.globalAlpha = 1;
      };
      drawFlakes(0);
      drawFlakes(1);

      const v = vehicle(g, t);
      const L = g.L;
      const R = L * 0.075;

      // Old scan returns fade on the bed
      if (dt) trail = trail.filter((p) => t - p.t < 7 && t >= p.t);
      for (const p of trail) {
        const a = 1 - (t - p.t) / 7;
        ctx.fillStyle = `rgba(34,211,238,${0.55 * a})`;
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      }

      // Anomaly state
      const span = exposedSpan(g);
      const flagA = smooth(T_DETECT, T_DETECT + 0.4, t) * (1 - smooth(T_GONE - 1, T_GONE + 0.2, t));
      const isDetecting = t > T_DETECT - 0.6 && t < T_DETECT + 1.2;

      if (v.alpha > 0.01) {
        // Lamp light pooled on the bed
        const lx = v.x + L * 0.55;
        const ly = seabed(g, lx);
        const pool = ctx.createRadialGradient(lx, ly, 0, lx, ly, L * 0.9);
        pool.addColorStop(0, `rgba(120,200,230,${0.16 * v.alpha})`);
        pool.addColorStop(1, "rgba(120,200,230,0)");
        ctx.fillStyle = pool;
        ctx.beginPath();
        ctx.ellipse(lx, ly, L * 0.9, L * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Scan fan from the belly sensor down and forward to the bed
        const ax = v.x + L * 0.27;
        const ay = v.y + R * 0.8;
        const b0 = v.x + L * 0.2;
        const b1 = v.x + L * 1.05;
        const col = isDetecting ? "245,181,68" : "34,211,238";
        const fan = ctx.createLinearGradient(0, ay, 0, seabed(g, ax));
        fan.addColorStop(0, `rgba(${col},${0.16 * v.alpha})`);
        fan.addColorStop(1, `rgba(${col},${0.03 * v.alpha})`);
        ctx.fillStyle = fan;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        for (let x = b0; x <= b1; x += 4) ctx.lineTo(x, seabed(g, x));
        ctx.closePath();
        ctx.fill();

        // Sweep line and its return on the bed
        const s = (Math.sin(t * 3.1) + 1) / 2;
        const hx = lerp(b0, b1, s);
        const hy = seabed(g, hx);
        ctx.strokeStyle = `rgba(${col},${0.7 * v.alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(hx, hy);
        ctx.stroke();
        ctx.fillStyle = `rgba(${col},${0.9 * v.alpha})`;
        ctx.fillRect(hx - 1.5, hy - 1.5, 3, 3);
        if (dt && t - lastTrail > 0.04 && v.alpha > 0.5) {
          trail.push({ x: hx + (Math.random() - 0.5) * 2, y: hy - Math.random() * 1.5, t });
          lastTrail = t;
        }
        if (t < lastTrail) lastTrail = t;
      }

      // Exposed span highlight, brackets, and marker
      if (flagA > 0.01) {
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = `rgba(245,181,68,${0.9 * flagA})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = span[0]; x <= span[1]; x += 2) {
          const y = cableY(g, x) - 2.5;
          if (x === span[0]) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Corner brackets around the finding
        const bx1 = span[0] - 8;
        const bx2 = span[1] + 6;
        const by1 = cableY(g, g.scourC) - 14;
        const by2 = seabed(g, g.scourC) + 7;
        const c = 6;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(bx1, by1 + c); ctx.lineTo(bx1, by1); ctx.lineTo(bx1 + c, by1);
        ctx.moveTo(bx2 - c, by1); ctx.lineTo(bx2, by1); ctx.lineTo(bx2, by1 + c);
        ctx.moveTo(bx1, by2 - c); ctx.lineTo(bx1, by2); ctx.lineTo(bx1 + c, by2);
        ctx.moveTo(bx2 - c, by2); ctx.lineTo(bx2, by2); ctx.lineTo(bx2, by2 - c);
        ctx.stroke();

        // Marker drops onto the finding
        const mx = g.scourC;
        const mBase = by1 - 2;
        const grow = smooth(T_DETECT + 0.2, T_DETECT + 0.8, t);
        const mTop = mBase - (g.mobile ? 34 : 46) * grow;
        ctx.beginPath();
        ctx.moveTo(mx, mBase);
        ctx.lineTo(mx, mTop);
        ctx.stroke();
        if (grow > 0.95) {
          ctx.fillStyle = `rgba(245,181,68,${flagA})`;
          ctx.beginPath();
          ctx.moveTo(mx, mTop - 6);
          ctx.lineTo(mx + 5, mTop);
          ctx.lineTo(mx, mTop + 6);
          ctx.lineTo(mx - 5, mTop);
          ctx.closePath();
          ctx.fill();
          ctx.font = `500 10px ${monoFont}`;
          ctx.textAlign = "right";
          ctx.fillText("A-01", mx - 10, mTop + 3.5);
        }
        // Pulse ring on the bed
        const ph = ((t - T_DETECT) % 2) / 2;
        ctx.strokeStyle = `rgba(245,181,68,${(1 - ph) * 0.6 * flagA})`;
        ctx.beginPath();
        ctx.ellipse(mx, seabed(g, mx), 6 + ph * 34, (6 + ph * 34) * 0.22, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Leader line to the report card
        const cardA = smooth(T_REPORT, T_REPORT + 0.5, t) * flagA;
        if (cardA > 0.01 && grow > 0.95) {
          const cx = g.mobile ? g.card.left + 40 : g.card.left;
          const cy = g.mobile ? g.card.top + 150 : g.card.top + 160;
          ctx.strokeStyle = `rgba(245,181,68,${0.45 * cardA})`;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.moveTo(mx, mTop - 7);
          ctx.lineTo(cx, cy);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.restore();
      }

      // Vehicle, with a touch of haze
      if (v.alpha > 0.01) {
        // Forward lamp beam
        ctx.globalCompositeOperation = "lighter";
        const lb = ctx.createLinearGradient(v.x + L * 0.5, 0, v.x + L * 1.6, 0);
        lb.addColorStop(0, `rgba(170,225,245,${0.07 * v.alpha})`);
        lb.addColorStop(1, "rgba(170,225,245,0)");
        ctx.fillStyle = lb;
        ctx.beginPath();
        ctx.moveTo(v.x + L * 0.5, v.y - R * 0.3);
        ctx.lineTo(v.x + L * 1.6, v.y - R * 2.5);
        ctx.lineTo(v.x + L * 1.6, v.y + R * 4);
        ctx.lineTo(v.x + L * 0.5, v.y + R * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";

        ctx.save();
        ctx.globalAlpha = v.alpha * 0.96;
        ctx.translate(v.x, v.y);
        ctx.rotate(v.pitch);
        drawVehicle(ctx, L, t);
        ctx.restore();
      }

      // Near marine snow, in front of everything
      ctx.globalCompositeOperation = "lighter";
      drawFlakes(2);
      ctx.globalCompositeOperation = "source-over";

      // Caustics
      if (caustics && (dt || reduced || !running)) caustics.draw(t + 40);

      // Report card and HUD
      const wantCard = t >= T_REPORT && t < T_GONE - 1;
      if (wantCard !== cardOn && cardRef.current) {
        cardOn = wantCard;
        cardRef.current.classList.toggle("is-on", wantCard);
      }
      const hudTick = Math.floor(missionT * 10);
      if (hudTick !== lastHud) {
        lastHud = hudTick;
        let mode = MODES[0][1];
        for (const [at, m] of MODES) if (t >= at) mode = m;
        if (modeRef.current && modeRef.current.textContent !== mode) modeRef.current.textContent = mode;
        const depth = 41.6 - (seabed(g, v.x) - v.y) / (g.mobile ? 16 : 22) + Math.sin(t * 0.7) * 0.05;
        if (depthRef.current) depthRef.current.textContent = depth.toFixed(1);
        const hdg = Math.round(87 + Math.sin(t * 0.21) * 1.4 + Math.sin(t * 0.9) * 0.4);
        if (hdgRef.current) hdgRef.current.textContent = String(hdg).padStart(3, "0");
        const s = Math.floor(missionT);
        const hh = String(Math.floor(s / 3600)).padStart(2, "0");
        const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
        const ss = String(s % 60).padStart(2, "0");
        if (timeRef.current) timeRef.current.textContent = `${hh}:${mm}:${ss}`;
      }
    };

    const frame = (now: number) => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016;
      last = now;
      sceneT = (sceneT + dt) % LOOP;
      missionT += dt;
      render(dt);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduced || !onscreen || document.hidden) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const ro = new ResizeObserver(() => resize());
    ro.observe(root);
    resize();
    canvas.style.opacity = "1";

    const io = new IntersectionObserver(([e]) => {
      onscreen = e.isIntersecting;
      if (onscreen) start();
      else stop();
    });
    io.observe(root);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    // Redraw once web fonts are in, so the canvas label uses the mono face
    document.fonts?.ready.then(() => {
      if (!running) render(0);
    });

    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      caustics?.dispose();
    };
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0">
      {/* Masked so the scene dissolves into the page instead of ending on a hard edge */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, black 86%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 86%, transparent 100%)",
        }}
      >
        {/* First-paint stand-in for the water column */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, #0f4166 0%, #0a2f50 28%, #061f39 60%, #03111f 100%)" }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700"
        />
        <canvas
          ref={causticRef}
          className="absolute inset-x-0 top-0 h-[55%] w-full mix-blend-screen opacity-70"
          style={{
            maskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
          }}
        />
      </div>

      {/* Depth scale along the right edge */}
      <div
        aria-hidden
        className="hidden lg:flex absolute right-5 top-[18%] bottom-[16%] flex-col justify-between items-end"
      >
        {["10", "18", "26", "34", "42"].map((d) => (
          <div key={d} className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.12em] text-foam/45">{d} m</span>
            <span className="h-px w-3 bg-foam/40" />
          </div>
        ))}
        <span className="absolute right-0 top-0 bottom-0 w-px bg-foam/15" />
      </div>

      {/* Condition report — appears when the anomaly is flagged */}
      <div
        ref={cardRef}
        aria-hidden
        className="report-card absolute z-10 border border-amber/40 bg-[#04121f]/85 font-mono text-[11px] leading-snug shadow-[0_10px_40px_rgba(0,0,0,0.45)]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-amber/25 px-3.5 py-2 text-amber">
          <span className="flex items-center gap-2 uppercase tracking-[0.16em]">
            <span className="h-1.5 w-1.5 bg-amber" />
            Condition report
          </span>
          <span className="tracking-[0.12em]">A-01</span>
        </div>
        <dl className="grid gap-1.5 px-3.5 py-3">
          {[
            ["Asset", "Export cable EC-02"],
            ["Position", "KP 4.217 · 14 m W of T-07"],
            ["Finding", "Cable exposure, 2.8 m span"],
            ["Severity", "Medium · plan repair"],
          ].map(([k, val]) => (
            <div key={k} className="report-row grid grid-cols-[5.2rem_1fr] gap-2">
              <dt className="uppercase tracking-[0.14em] text-foam/55">{k}</dt>
              <dd className={k === "Severity" ? "text-amber" : "text-white/90"}>{val}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* HUD */}
      <div
        aria-hidden
        className="absolute z-10 bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 lg:right-14 sm:bottom-6 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-foam/70"
      >
        <div className="flex items-center gap-2 mb-1.5 text-white/85">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 animate-ping bg-cyan/70 motion-reduce:animate-none" />
            <span className="relative h-1.5 w-1.5 bg-cyan" />
          </span>
          Casper · <span ref={modeRef}>Survey</span>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 tabular-nums">
          <span>
            Depth <span ref={depthRef} className="text-white">38.4</span> m
          </span>
          <span>
            Hdg <span ref={hdgRef} className="text-white">087</span>°
          </span>
          <span>
            T+ <span ref={timeRef} className="text-white">01:42:18</span>
          </span>
        </div>
      </div>
    </div>
  );
}
