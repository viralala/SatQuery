"use client";

import { motion } from "motion/react";
import { BrandButton, GhostButton } from "@/components/ui/primitives";

/** Closing frame. */
export function FinalCta() {
  return (
    <section id="cta" className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="liquid-glass relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px circle at 50% 0%, rgba(255,255,255,0.15), transparent 70%)",
            opacity: 0.3,
          }}
        />
        <div className="relative">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.02]">
            Ask the question.
            <br />
            See the evidence.
          </h2>
          <p className="mt-6 text-white/60 max-w-md mx-auto text-sm leading-[1.6]">
            SatQuery AI brings natural-language interaction to multimodal Earth
            observation — single images, optical–SAR pairs and bi-temporal pairs,
            answered with evidence you can see.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <BrandButton label="Explore the demo" href="/#demo" />
            <GhostButton label="View architecture" href="/#agent" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
