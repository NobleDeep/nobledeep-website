"use client";

import { useEffect, useRef } from "react";

/* ── Vertex shader: fullscreen clip-space quad ── */
const VERT = `
  attribute vec2 a_pos;
  void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

/*
  Fragment shader — iterative caustics (Nimitz technique).

  The loop accumulates inverse-distances to a diverging spiral in
  phase space. Where multiple iterations converge to the same
  attractor the sum spikes → bright caustic line.
  Two time-offset samples are blended to soften temporal aliasing.

  Light model:
    - uv.y = 1 at TOP of canvas (WebGL y-axis), 0 at bottom.
    - Cubic falloff keeps the top ~30 % bright, then drops fast,
      matching sunlight penetrating shallow water.
*/
const FRAG = `
  precision highp float;
  uniform vec2  u_res;
  uniform float u_time;

  #define TAU 6.28318530718

  float caustic(vec2 uv, float t) {
    /* Large offset keeps the iteration in a numerically interesting
       region — a quirk of the original formula that matters here. */
    vec2 p = mod(uv * TAU, TAU) - 250.0;
    vec2 i = p;
    float c     = 1.0;
    float inten = 0.005;

    for (int n = 0; n < 5; n++) {
      float fn  = float(n);
      float t2  = t * (1.0 - 3.5 / (fn + 1.0));
      i = p + vec2(
        cos(t2 - i.x) + sin(t2 + i.y),
        sin(t2 - i.y) + cos(t2 + i.x)
      );
      /* Guard denominator: near-zero sin/cos → near-zero contribution */
      float sx = sin(i.x + t2); sx = abs(sx) < 0.0001 ? 0.0001 : sx;
      float cy = cos(i.y + t2); cy = abs(cy) < 0.0001 ? 0.0001 : cy;
      float len = length(vec2(p.x / (sx / inten), p.y / (cy / inten)));
      c += 1.0 / max(len, 0.0001);
    }
    c /= 5.0;
    c  = 1.17 - pow(c, 1.4);
    return pow(abs(c), 8.0);
  }

  void main() {
    /* uv: (0,0)=bottom-left (1,1)=top-right in WebGL space */
    vec2  uv = gl_FragCoord.xy / u_res;
    float t  = u_time * 0.38;

    /* Two time-offset samples for temporal anti-aliasing */
    float c1 = caustic(uv, t);
    float c2 = caustic(uv, t + 0.28);
    float c  = (c1 + c2) * 0.5;

    /* uv.y=1 at top of screen → full light; uv.y=0 at bottom → dark */
    float lightY  = uv.y;
    float falloff = lightY * lightY * lightY; /* cubic: stays bright up top */

    /* Soften horizontal edges */
    float hSoft = smoothstep(0.0, 0.16, uv.x) * smoothstep(1.0, 0.84, uv.x);

    /* Colour: warm white-aqua at surface → deep blue at depth */
    vec3 shallowCol = vec3(0.90, 0.97, 1.00);
    vec3 deepCol    = vec3(0.06, 0.22, 0.68);
    vec3 tint       = mix(deepCol, shallowCol, falloff);

    float alpha = c * falloff * hSoft * 0.52;
    gl_FragColor  = vec4(tint, alpha);
  }
`;

/* ── WebGL helpers ─────────────────────────────────────────────── */
function mkShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("[WaterCaustics] shader:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function mkProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const v = mkShader(gl, gl.VERTEX_SHADER, vs);
  const f = mkShader(gl, gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.warn("[WaterCaustics] link:", gl.getProgramInfoLog(p));
    return null;
  }
  return p;
}

/* ── Component ─────────────────────────────────────────────────── */
export default function WaterCaustics() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return; /* silently skip on unsupported browsers */

    const prog = mkProgram(gl, VERT, FRAG);
    if (!prog) return;

    /* fullscreen quad (2 triangles) */
    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1,  1, -1, -1,  1,  -1,  1,  1, -1,  1,  1]),
      gl.STATIC_DRAW
    );

    gl.useProgram(prog);
    const aPosLoc  = gl.getAttribLocation(prog, "a_pos");
    const uResLoc  = gl.getUniformLocation(prog, "u_res");
    const uTimeLoc = gl.getUniformLocation(prog, "u_time");

    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const dpr = window.devicePixelRatio || 1;
    let animId: number;

    const resize = () => {
      canvas.width  = Math.round(canvas.offsetWidth  * dpr);
      canvas.height = Math.round(canvas.offsetHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();

    const t0 = performance.now();
    const frame = () => {
      const t = (performance.now() - t0) / 1000;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uResLoc,  canvas.width, canvas.height);
      gl.uniform1f(uTimeLoc, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(frame);
    };
    frame();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
