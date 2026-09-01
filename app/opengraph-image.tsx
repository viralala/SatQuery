import { ImageResponse } from "next/og";

export const alt = "SatQuery AI — Ask Earth. Get intelligence.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social share card. Mark + wordmark top-left, the site tagline as the hero
 * line, modality list beneath — all on the near-black ground with a soft cyan
 * bloom in the lower-right, echoing the site backdrop.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0c0c0c",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        {/* cyan bloom */}
        <div
          style={{
            position: "absolute",
            right: -160,
            bottom: -220,
            width: 640,
            height: 640,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,210,255,0.28) 0%, rgba(0,210,255,0) 70%)",
          }}
        />

        {/* lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="56" height="56" viewBox="0 0 256 256">
            <g
              fill="none"
              stroke="#00d2ff"
              strokeWidth={16}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M84 40H40v44" />
              <path d="M172 40h44v44" />
              <path d="M216 172v44h-44" />
              <path d="M84 216H40v-44" />
              <path d="M64 192 192 64" />
            </g>
            <circle cx="128" cy="128" r="24" fill="#00d2ff" />
          </svg>
          <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: -0.5 }}>
            SatQuery
          </span>
        </div>

        {/* hero line */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 88,
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            <span>Ask Earth.</span>
            <span style={{ color: "#00d2ff" }}>Get intelligence.</span>
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.6)" }}>
            Optical · SAR · Bi-temporal · GeoTIFF
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
