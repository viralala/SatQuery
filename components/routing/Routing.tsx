"use client";

import { motion } from "motion/react";
import { Chip, SectionEyebrow } from "@/components/ui/primitives";

const BUCKETS = [
  {
    name: "Single-image VQA",
    count: 14,
    color: "#ffffff",
    items: ["Nashik — land-cover description", "Sundarbans — object identification"],
  },
  {
    name: "Change analysis",
    count: 11,
    color: "#e5e5e5",
    items: ["Kharagpur — built-up expansion", "Godavari — flood extent"],
  },
  {
    name: "Optical–SAR fusion",
    count: 9,
    color: "#a3a3a3",
    items: ["Cuttack — built-up under haze", "Bhuj — water boundary"],
  },
  {
    name: "Grounding",
    count: 8,
    color: "#525252",
    items: ["Referring expressions · boxes · masks"],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * How the agent sorts incoming questions. The left column states the claim,
 * the right column shows a day's worth of routing decisions.
 */
export function Routing() {
  return (
    <section id="routing" className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 scroll-mt-24">
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <SectionEyebrow label="Routing" tag="Agentic" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
            Route any question
            <br />
            to the right model.
          </h2>
          <p className="mt-6 text-white/60 text-base leading-[1.6] max-w-md">
            SatQuery reads the question, checks what the imagery can actually support,
            and calls the specialist that fits. No model picking, no band maths, no
            parameter tuning — the query decides the pipeline.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <Chip>Task classification</Chip>
            <Chip>Input validation</Chip>
            <Chip>Tool planning</Chip>
            <Chip>Confidence gating</Chip>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="liquid-glass rounded-2xl p-5"
        >
          <p className="text-xs text-white/45">Today · 42 queries routed</p>
          <div className="mt-4 space-y-3">
            {BUCKETS.map((b) => (
              <div key={b.name} className="liquid-glass rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: b.color }}
                  />
                  <span className="text-xs font-semibold text-white/85">{b.name}</span>
                  <span className="ml-auto text-[0.65rem] text-white/40">{b.count}</span>
                </div>
                <ul className="mt-2 space-y-1">
                  {b.items.map((it) => (
                    <li key={it} className="text-[0.7rem] text-white/45 truncate">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
