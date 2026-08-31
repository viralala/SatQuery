"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { PIPELINE } from "@/lib/data/content";
import { SectionEyebrow } from "@/components/ui/primitives";
import { useInView } from "@/lib/hooks/useInView";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The agent's observable workflow. Only the execution trace is shown — the
 * stages, the tools they call, the parameters they bind. No internal reasoning
 * is exposed, matching what the problem statement evaluates.
 */
export function AgentPipeline() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 });
  const [active, setActive] = useState(0);
  const stage = PIPELINE[active];

  return (
    <section
      id="agent"
      className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 scroll-mt-24"
    >
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <SectionEyebrow label="Architecture" tag="Observable" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
            The agent behind
            <br />
            the answer.
          </h2>
          <p className="mt-6 text-white/60 text-base leading-[1.6] max-w-md">
            SatQuery identifies the task the question implies, checks that the supplied
            imagery can actually support it, selects the specialist models needed,
            executes the workflow, and returns a result you can trace back to its
            evidence.
          </p>

          <div className="mt-8 liquid-glass rounded-2xl p-5">
            <div className="flex items-baseline gap-3">
              <span className="text-xs font-mono" style={{ color: "#00d2ff" }}>
                {stage.step}
              </span>
              <h3 className="text-sm font-semibold tracking-wide">{stage.title}</h3>
            </div>
            <p className="mt-3 text-sm leading-[1.6] text-white/60">{stage.detail}</p>
            <p className="mt-4 font-mono text-[0.7rem] leading-relaxed text-white/40">
              <span className="text-white/25">trace ▸ </span>
              {stage.trace}
            </p>
          </div>

          <p className="mt-5 max-w-md text-xs leading-relaxed text-white/35">
            The controller may plan internally. Only this observable trace — the task,
            the models and tools, the permitted parameters and the outputs — is surfaced
            or evaluated.
          </p>
        </motion.div>

        {/* The chain */}
        <div ref={ref}>
          <div className="relative">
            <span
              aria-hidden
              className="absolute left-[13px] top-2 w-px"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,210,255,0.6), rgba(255,255,255,0.12), transparent)",
                height: inView ? "calc(100% - 1rem)" : "0%",
                transition: "height 1500ms var(--ease-out-soft) 180ms",
              }}
            />

            <ol>
              <li
                className="flex items-center gap-4 pb-3"
                style={{ opacity: inView ? 1 : 0, transition: "opacity 600ms" }}
              >
                <span
                  className="relative z-10 flex h-[27px] w-[27px] items-center justify-center rounded-md border bg-[#0c0c0c]"
                  style={{ borderColor: "rgba(0,210,255,0.5)" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#00d2ff" }} />
                </span>
                <span className="text-sm font-semibold" style={{ color: "#00d2ff" }}>
                  QUERY
                </span>
                <span className="hidden text-xs text-white/35 sm:inline">
                  plus one, two or a pair of images
                </span>
              </li>

              {PIPELINE.map((s, i) => {
                const on = active === i;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      aria-current={on}
                      className="group flex w-full cursor-pointer items-center gap-4 py-2.5 text-left"
                      style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? "none" : "translate3d(-10px,0,0)",
                        transition: `opacity 600ms var(--ease-out-soft) ${180 + i * 100}ms, transform 600ms var(--ease-out-soft) ${180 + i * 100}ms`,
                      }}
                    >
                      <span
                        className="relative z-10 flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-md border bg-[#0c0c0c] font-mono text-[0.6rem] transition-all duration-300"
                        style={{
                          borderColor: on ? "#00d2ff" : "rgba(255,255,255,0.14)",
                          color: on ? "#00d2ff" : "rgba(255,255,255,0.3)",
                          boxShadow: on ? "0 0 0 4px rgba(0,210,255,0.09)" : "none",
                        }}
                      >
                        {s.step}
                      </span>

                      <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5">
                        <span
                          className="text-base font-semibold tracking-tight transition-colors duration-300"
                          style={{ color: on ? "#fff" : "rgba(255,255,255,0.45)" }}
                        >
                          {s.title}
                        </span>
                        <span
                          className="text-xs leading-snug transition-colors duration-300"
                          style={{ color: on ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.28)" }}
                        >
                          {s.caption}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}

              <li
                className="flex items-center gap-4 pt-3"
                style={{ opacity: inView ? 1 : 0, transition: "opacity 700ms 960ms" }}
              >
                <span className="relative z-10 flex h-[27px] w-[27px] items-center justify-center rounded-md border border-white/25 bg-[#0c0c0c]">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <span className="text-sm font-semibold">Evidence-grounded answer</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
