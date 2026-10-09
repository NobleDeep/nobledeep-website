import { ImageResponse } from "next/og";

/*
  Social preview card (1200x630), shared by opengraph-image and
  twitter-image. Same scene language as the hero: deep water, a monopile,
  an export cable on the bed, and a generic torpedo silhouette.
*/
export const socialAlt =
  "Noble Deep: Casper, an autonomous underwater vehicle for continuous subsea inspection of offshore wind infrastructure.";
export const socialSize = { width: 1200, height: 630 };

/* Fetches a TTF from Google Fonts at build time; falls back to the default font if offline. */
async function loadFont(family: string, weight: number) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export async function renderSocialImage() {
  const [bold, mono] = await Promise.all([
    loadFont("Space Grotesk", 700),
    loadFont("JetBrains Mono", 500),
  ]);
  const fonts = [
    ...(bold ? [{ name: "Space Grotesk", data: bold, weight: 700 as const, style: "normal" as const }] : []),
    ...(mono ? [{ name: "JetBrains Mono", data: mono, weight: 500 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(180deg, #0f4166 0%, #0a2f50 30%, #061f39 62%, #03111f 100%)",
          fontFamily: "Space Grotesk",
        }}
      >
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
          <defs>
            <linearGradient id="pile" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#4f7f9c" />
              <stop offset="0.4" stopColor="#2a5270" />
              <stop offset="1" stopColor="#0c2236" />
            </linearGradient>
            <linearGradient id="hull" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7f9fb5" />
              <stop offset="0.3" stopColor="#466681" />
              <stop offset="1" stopColor="#0b1824" />
            </linearGradient>
            <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#aae1f5" stopOpacity="0.12" />
              <stop offset="1" stopColor="#aae1f5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M 640 0 L 720 0 L 600 520 L 470 520 Z" fill="url(#ray)" />
          <path d="M 860 0 L 920 0 L 820 480 L 720 480 Z" fill="url(#ray)" />
          <rect x="420" y="0" width="8" height="470" fill="#3b7090" opacity="0.25" />
          <rect x="1110" y="0" width="10" height="470" fill="#3b7090" opacity="0.3" />
          <rect x="945" y="0" width="30" height="560" fill="url(#pile)" />
          <path d="M 0 540 Q 300 528 600 540 T 1200 536 L 1200 630 L 0 630 Z" fill="#0d2a42" />
          <path d="M 0 540 Q 300 528 600 540 T 1200 536" stroke="#96d7f0" strokeOpacity="0.25" fill="none" />
          <path d="M 0 546 Q 300 534 600 546 T 880 548" stroke="#22d3ee" strokeOpacity="0.4" strokeDasharray="6 7" fill="none" />
          <path d="M 880 548 Q 925 552 945 528" stroke="#f5b544" strokeWidth="2.5" fill="none" />
          <path d="M 742 430 L 700 538 L 860 538 Z" fill="#22d3ee" fillOpacity="0.12" />
          <g transform="translate(700 420)">
            <path d="M -88 -6 L -72 -26 L -60 -26 L -54 -10 Z" fill="#1d3447" />
            <path d="M -88 6 L -72 26 L -60 26 L -54 10 Z" fill="#132635" />
            <path d="M -66 -11 L 66 -11 C 84 -11 92 -6 92 0 C 92 6 84 11 66 11 L -66 11 L -92 4 L -92 -4 Z" fill="url(#hull)" />
          </g>
          <path d="M 912 528 L 912 490" stroke="#f5b544" strokeWidth="1.5" />
          <path d="M 912 482 L 918 490 L 912 498 L 906 490 Z" fill="#f5b544" />
        </svg>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "72px 80px",
            width: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "JetBrains Mono",
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#90e0ef",
            }}
          >
            Noble Deep · Casper AUV
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: -1.5,
              color: "#ffffff",
              maxWidth: 780,
            }}
          >
            Continuous subsea inspection for offshore wind.
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 26, color: "#b4cede", maxWidth: 640, lineHeight: 1.35 }}>
            Condition reports that catch damage early, so repairs are planned instead of rushed.
          </div>
        </div>
      </div>
    ),
    { ...socialSize, fonts: fonts.length ? fonts : undefined }
  );
}
