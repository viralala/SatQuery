"use client";

import { motion } from "motion/react";
import { WORKFLOW_SATQUERY, WORKFLOW_TRADITIONAL } from "@/lib/data/content";
import { SectionEyebrow } from "@/components/ui/primitives";
import { useInView } from "@/lib/hooks/useInView";

/**
 * The difference, stated structurally: seven steps a person carries out,
 * against three where only the first belongs to them.
 */
export function Comparison() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });

  return (
    <section
      id="why"
      className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 scroll-mt-24"
    >
      <div className="flex flex-col items-center text-center">
        <SectionEyebrow label="Why SatQuery" tag="Query-driven" />
        <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
          The question
          <br />
          becomes the pipeline.
        </h2>
        <p className="mt-6 max-w-[54ch] text-base leading-[1.6] text-white/60">
          Not a chatbot placed in front of a GIS stack. The query itself decides which
          models run, in what order, on which inputs.
        </p>
      </div>

      <div ref={ref} className="mt-14 grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="liquid-glass rounded-2xl p-7 md:p-9"
        >
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white/25" aria-hidden />
            <span className="text-xs text-white/50">Traditional remote-sensing workflow</span>
          </div>

          <ol className="mt-7">
            {WORKFLOW_TRADITIONAL.map((s, i) => (
              <li
                key={s}
                className="flex items-center gap-4 border-b border-white/8 py-3.5"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translate3d(-8px,0,0)",
                  transition: `opacity 500ms var(--ease-out-soft) ${i * 80}ms, transform 500ms var(--ease-out-soft) ${i * 80}ms`,
                }}
              >
                <span className="font-mono text-[0.6rem] text-white/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-white/50">{s}</span>
                <span className="ml-auto text-[0.55rem] uppercase tracking-widest text-white/20">
                  Human
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-7 text-xs leading-relaxed text-white/35">
            Seven decisions, each requiring domain knowledge, before a single question
            gets an answer.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="liquid-glass relative rounded-2xl p-7 md:p-9"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(520px circle at 50% 0%, rgba(0,210,255,0.10), transparent 70%)",
            }}
          />
          <div className="relative">
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#00d2ff" }} />
              <span className="text-xs" style={{ color: "#00d2ff" }}>
                SatQuery
              </span>
            </div>

            <ol className="mt-7">
              {WORKFLOW_SATQUERY.map((s, i) => (
                <li
                  key={s}
                  className="flex items-center gap-4 border-b border-white/8 py-7"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "none" : "translate3d(8px,0,0)",
                    transition: `opacity 620ms var(--ease-out-soft) ${380 + i * 180}ms, transform 620ms var(--ease-out-soft) ${380 + i * 180}ms`,
                  }}
                >
                  <span className="font-mono text-[0.6rem] text-white/25">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-lg md:text-xl font-semibold tracking-tight"
                    style={{ color: i === 1 ? "#00d2ff" : "#fff" }}
                  >
                    {s}
                  </span>
                  <span className="ml-auto text-[0.55rem] uppercase tracking-widest text-white/20">
                    {i === 0 ? "Human" : "System"}
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-7 text-xs leading-relaxed text-white/50">
              One decision belongs to the user: what they want to know. Everything
              between the question and the evidence is orchestration.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
