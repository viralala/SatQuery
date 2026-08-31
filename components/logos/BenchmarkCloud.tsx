"use client";

import { motion } from "motion/react";

const NAMES = [
  "BigEarthNet",
  "VRSBench",
  "RSVQA",
  "CDVQA",
  "LEVIR-CD",
  "SEN1-2",
  "Sentinel-1",
  "Sentinel-2",
];

/** The open corpora the system is adapted on and evaluated against. */
export function BenchmarkCloud() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-20">
      <p className="text-center text-xs uppercase tracking-widest text-white/40">
        Adapted and evaluated on open remote-sensing corpora
      </p>
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
        {NAMES.map((n, i) => (
          <motion.span
            key={n}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
            className="text-center text-sm font-semibold tracking-tight text-white/50 hover:text-white transition-colors"
          >
            {n}
          </motion.span>
        ))}
      </div>
    </section>
  );
}
