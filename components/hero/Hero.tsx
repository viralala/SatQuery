"use client";

import { motion } from "motion/react";
import { BrandButton, gradientStyle } from "@/components/ui/primitives";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section
      id="top"
      className="relative z-10 max-w-6xl mx-auto px-6 pt-16 md:pt-28 pb-20 text-center flex flex-col items-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        className="text-4xl md:text-7xl font-semibold tracking-tight leading-[0.9]"
      >
        <span className="block">Ask Earth.</span>
        {/* The shiny gradient sweeps through near-black stops, so a screen-blended
            copy sits over it to hold a legibility floor without flattening the cyan. */}
        <span className="relative block">
          <span className="block animate-shiny" style={gradientStyle}>
            Get intelligence
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 block"
            style={{ color: "#fff", opacity: 0.34, mixBlendMode: "screen" }}
          >
            Get intelligence
          </span>
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        className="mt-8 text-white/60 max-w-md text-base leading-[1.5]"
      >
        SatQuery AI is an agentic vision-language assistant for satellite imagery.
        Ask a question in plain language — it works out the analysis, runs the right
        specialist models, and answers with the evidence.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
        className="mt-10 flex flex-col items-center gap-3"
      >
        <BrandButton />
        <span className="text-xs text-white/40">
          Optical · SAR · Bi-temporal · GeoTIFF
        </span>
      </motion.div>
    </section>
  );
}
