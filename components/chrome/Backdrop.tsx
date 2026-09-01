"use client";

import { useEffect, useState } from "react";

/**
 * Fixed cinematic backdrop that sits behind the whole page.
 *
 * The looping video is the primary layer; one of our generated SAR scenes sits
 * underneath it as a still fallback so the page still reads correctly if the
 * remote video is slow, blocked, or fails to decode.
 *
 * A small control lets visitors freeze the moving footage — the choice is kept
 * in localStorage so it sticks across pages and reloads.
 */
export function BackgroundVideo() {
  const [motion, setMotion] = useState(true);

  // Restore the saved preference on mount.
  useEffect(() => {
    try {
      if (localStorage.getItem("bg-motion") === "off") setMotion(false);
    } catch {
      /* storage unavailable — keep the default */
    }
  }, []);

  // Persist the preference whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem("bg-motion", motion ? "on" : "off");
    } catch {
      /* storage unavailable — nothing to persist */
    }
  }, [motion]);

  return (
    <>
      {/* Motion off: drop the whole backdrop, leaving the plain #0c0c0c page. */}
      {motion && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/imagery/hero-sar.webp)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.25,
            }}
            aria-hidden
          />
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/imagery/hero-scene.webp"
            className="w-full h-full object-cover pointer-events-none"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
          />
          {/* Hold the page copy legible over whatever frame is showing. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(12,12,12,0.62) 0%, rgba(12,12,12,0.78) 45%, rgba(12,12,12,0.92) 100%)",
            }}
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => setMotion((on) => !on)}
        aria-pressed={motion}
        className="fixed bottom-4 right-4 z-50 text-xs text-white/40 hover:text-white/70 transition-colors"
      >
        {motion ? "Disable background" : "Enable background"}
      </button>
    </>
  );
}

/** Vertical rules marking the 36rem container edges on wide screens. */
export function GuideLines() {
  return (
    <>
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />
    </>
  );
}

/** Grain filter referenced by the shiny headline treatment. */
export function NoiseFilter() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden focusable="false">
      <filter id="c3-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
        <feComposite in2="SourceGraphic" operator="in" result="noise" />
        <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
      </filter>
    </svg>
  );
}
