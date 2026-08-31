"use client";

import { motion } from "motion/react";
import { SectionEyebrow } from "@/components/ui/primitives";

/**
 * Who the system is for, framed by the question each role actually asks.
 *
 * These are operational use cases drawn from the problem statement — not
 * testimonials, and deliberately not attributed to named individuals or
 * organisations that have not endorsed this prototype.
 */
const AUDIENCES = [
  {
    question:
      "Triage a Cartosat–RISAT scene by asking, rather than scripting a GIS chain for every question.",
    role: "Remote-sensing analyst",
    context: "Scene triage across optical and SAR archives",
    sector: "SPACE AGENCY",
  },
  {
    question:
      "Get flood extent through cloud cover, day or night, in the hours when the answer still changes the response.",
    role: "Emergency response officer",
    context: "Rapid post-event assessment from SAR",
    sector: "DISASTER MANAGEMENT",
  },
  {
    question:
      "Show whether built-up area has grown here since 2022, with a change map that stands up as evidence.",
    role: "Planning officer",
    context: "Settlement growth against a dated baseline",
    sector: "URBAN LOCAL BODY",
  },
];

export function BuiltFor() {
  return (
    <section id="builtfor" className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 scroll-mt-24">
      <div className="flex flex-col items-center text-center">
        <SectionEyebrow label="Built for" tag="Operational" />
        <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
          The people who need
          <br />
          the answer today.
        </h2>
      </div>

      <div className="mt-14 grid md:grid-cols-3 gap-6">
        {AUDIENCES.map((a, i) => (
          <motion.figure
            key={a.role}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="liquid-glass rounded-2xl p-6"
          >
            <blockquote className="text-sm text-white/80 leading-[1.6]">
              “{a.question}”
            </blockquote>
            <figcaption className="mt-6 pt-5 border-t border-white/10">
              <p className="text-sm font-semibold">{a.role}</p>
              <p className="text-xs text-white/50">{a.context}</p>
              <p className="mt-2 text-xs text-white font-semibold tracking-wide">
                {a.sector}
              </p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
