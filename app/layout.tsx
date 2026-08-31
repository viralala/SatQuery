import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SatQuery AI — Ask Earth. Get intelligence.",
  description:
    "An agentic vision-language assistant for multimodal remote-sensing image analysis through natural-language queries. Single-image, optical–SAR and bi-temporal understanding, returned with visual evidence.",
  keywords: [
    "remote sensing",
    "vision-language model",
    "SAR",
    "change detection",
    "Earth observation",
    "agentic AI",
  ],
  openGraph: {
    title: "SatQuery AI — Ask Earth. Get intelligence.",
    description:
      "Natural-language questions become remote-sensing intelligence workflows.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0c0c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[999] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-black"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
