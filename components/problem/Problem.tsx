"use client";

import { motion } from "motion/react";
import { COMPLEXITY_STACK } from "@/lib/data/content";
import { SectionEyebrow } from "@/components/ui/primitives";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The problem as an accumulation: prerequisites stack until the column reads
 * as a wall, then collapse into a single question.
 */
export function Problem() {
  return (
    <section
      id="problem"
      className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 scroll-mt-24"
    >
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <SectionEyebrow label="The problem" tag="Today" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
            Satellite data is everywhere.
            <br />
            <span className="text-white/40">Understanding it isn&rsquo;t.</span>
          </h2>
          <p className="mt-6 text-white/60 text-base leading-[1.6] max-w-md">
            Most remote-sensing AI arrives as isolated tools, each built for one
            predefined task. Getting an answer means knowing which sensor you are
            looking at, which model fits the question, how to prepare the imagery, and
            how to read what comes back.
          </p>
          <p className="mt-4 text-white/60 text-base leading-[1.6] max-w-md">
            And many operational questions cannot be answered from a single optical
            image at all. The information is spread across dates and across sensors.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="liquid-glass rounded-2xl p-6 md:p-7"
        >
          <p className="text-xs text-white/45">Before a single question gets answered</p>

          <ol className="mt-5">
            {COMPLEXITY_STACK.map((row, i) => (
              <motion.li
                key={row.term}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.09, ease: EASE }}
                className="flex items-baseline gap-4 border-b border-white/10 py-3.5"
              >
                <span className="w-4 shrink-0 text-xs text-white/25">
                  {i === 0 ? "" : "+"}
                </span>
                <span className="w-32 shrink-0 text-base font-semibold tracking-tight">
                  {row.term}
                </span>
                <span className="text-xs leading-snug text-white/45">{row.note}</span>
              </motion.li>
            ))}
          </ol>

          <div className="mt-5 flex items-baseline gap-4">
            <span className="w-4 shrink-0 text-xs text-white/25">=</span>
            <span className="text-2xl md:text-3xl font-semibold tracking-tight text-white/35">
              COMPLEXITY
            </span>
          </div>

          {/* the replacement */}
          <div className="mt-8 border-t border-white/10 pt-7">
            {[
              { text: "Natural language", tone: "#ffffff" },
              { text: "SatQuery AI", tone: "#00d2ff" },
              { text: "Intelligence", tone: "#ffffff" },
            ].map((row, i) => (
              <div key={row.text}>
                {i > 0 && (
                  <span
                    className="block w-px h-5 ml-1 bg-gradient-to-b from-white/30 to-white/5"
                    aria-hidden
                  />
                )}
                <div className="flex items-center gap-3 py-1">
                  <span
                    className="text-xl md:text-2xl font-semibold tracking-tight"
                    style={{ color: row.tone }}
                  >
                    {row.text}
                  </span>
                  {i === 1 && (
                    <span className="text-[0.65rem] px-2 py-0.5 rounded-full border border-white/10 text-white/45">
                      agentic orchestration
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
