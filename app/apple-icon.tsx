import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon — the mark centred on the site's near-black ground. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0c0c",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 256 256">
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
      </div>
    ),
    { ...size },
  );
}
