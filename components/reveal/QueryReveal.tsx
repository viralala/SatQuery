"use client";

import { motion } from "motion/react";
import { SectionEyebrow } from "@/components/ui/primitives";
import { useInView } from "@/lib/hooks/useInView";
import { useSequence } from "@/lib/hooks/useSequence";

const STEPS = [
  { id: "task", label: "Task detection", note: "change_vqa" },
  { id: "valid", label: "Image validation", note: "pair co-registered" },
  { id: "model", label: "Specialist model", note: "change_net" },
  { id: "analysis", label: "Change analysis", note: "class transition" },
  { id: "evidence", label: "Spatial evidence", note: "change map" },
  { id: "answer", label: "Final answer", note: "grounded response" },
] as const;

/** One written question resolving into the chain of decisions behind it. */
export function QueryReveal() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const { step } = useSequence(STEPS.length, inView, 460);

  return (
    <section
      id="reveal"
      className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 scroll-mt-24"
    >
      <div className="flex flex-col items-center text-center">
        <SectionEyebrow label="The system" tag="One query" />
        <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
          One question.
          <br />
          Multiple intelligences.
        </h2>
      </div>

      <div ref={ref} className="mt-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="liquid-glass rounded-2xl px-6 py-7 md:px-9 md:py-9 max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#00d2ff" }} />
            <span className="text-xs text-white/45">Natural-language query</span>
          </div>
          <p className="mt-4 text-xl md:text-3xl font-semibold tracking-tight leading-[1.25]">
            &ldquo;What changed between these two dates,
            <br className="hidden sm:block" /> and where did the change occur?&rdquo;
            <span
              className="ml-1 inline-block h-[0.95em] w-[2px] translate-y-[0.12em] animate-caret align-baseline"
              style={{ background: "#00d2ff" }}
            />
          </p>
        </motion.div>

        {/* connector */}
        <div className="mx-auto flex h-14 w-px justify-center overflow-hidden">
          <span
            className="w-px"
            style={{
              height: "100%",
              background: "linear-gradient(180deg, rgba(0,210,255,0.7), rgba(255,255,255,0.06))",
              transformOrigin: "top",
              transform: `scaleY(${step >= 0 ? 1 : 0})`,
              transition: "transform 520ms var(--ease-out-soft)",
            }}
          />
        </div>

        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => {
            const on = step >= i;
            const current = step === i;
            return (
              <li
                key={s.id}
                className="liquid-glass rounded-xl p-5 transition-all duration-500"
                style={{
                  opacity: on ? 1 : 0.35,
                  transform: on ? "none" : "translate3d(0,10px,0)",
                  background: on
                    ? "linear-gradient(180deg, rgba(0,210,255,0.07), rgba(255,255,255,0.01))"
                    : undefined,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="text-sm font-semibold tracking-tight transition-colors duration-500"
                    style={{ color: on ? "#fff" : "rgba(255,255,255,0.45)" }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-500"
                    style={{
                      background: on ? "#00d2ff" : "rgba(255,255,255,0.2)",
                      boxShadow: current ? "0 0 0 4px rgba(0,210,255,0.15)" : "none",
                    }}
                  />
                </div>
                <p className="mt-2 font-mono text-[0.7rem] text-white/40">{s.note}</p>
                <span className="mt-3 block text-[0.6rem] text-white/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </li>
            );
          })}
        </ol>

        <p className="mx-auto mt-10 max-w-[62ch] text-center text-sm leading-[1.7] text-white/55">
          The user writes one sentence. SatQuery decides that this is a change question,
          confirms the two images are a valid bi-temporal pair, calls the change
          specialist, and returns an answer bound to the region it found.
        </p>
      </div>
    </section>
  );
}
