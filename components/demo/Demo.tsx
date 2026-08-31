"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ChevronRight, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SCENARIOS } from "@/lib/data/scenarios";
import { SectionEyebrow } from "@/components/ui/primitives";
import { useReducedMotion } from "@/lib/hooks/useInView";

type Status = "idle" | "running" | "done";

const TONE: Record<string, string> = {
  signal: "#f59e0b",
  ice: "#00d2ff",
  verd: "#10b981",
  neutral: "#ffffff",
};

/**
 * A miniature of the intended product. The workflow, timings and figures are
 * mocked — no model runs in the browser — but every number shown is measured
 * from the scene on screen, and the trace mirrors the real execution summary.
 */
export function Demo() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [status, setStatus] = useState<Status>("idle");
  const [stage, setStage] = useState(-1);
  const [frame, setFrame] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const reduced = useReducedMotion();

  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setStatus("idle");
    setStage(-1);
    setFrame(0);
    setShowOverlay(true);
  }, [clearTimers]);

  useEffect(() => reset(), [scenarioId, reset]);
  useEffect(() => clearTimers, [clearTimers]);

  const run = () => {
    clearTimers();
    setStatus("running");
    setStage(-1);

    if (reduced) {
      setStage(scenario.trace.length - 1);
      setStatus("done");
      setFrame(scenario.frames.length - 1);
      return;
    }

    const unit = 330;
    let elapsed = 220;
    scenario.trace.forEach((t, i) => {
      timers.current.push(
        setTimeout(() => {
          setStage(i);
          if (i === 3 && scenario.frames.length > 1) setFrame(scenario.frames.length - 1);
        }, elapsed)
      );
      elapsed += t.weight * unit;
    });
    timers.current.push(setTimeout(() => setStatus("done"), elapsed + 120));
  };

  const done = status === "done";

  return (
    <section
      id="demo"
      className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 scroll-mt-24"
    >
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-end">
        <div>
          <SectionEyebrow label="Demo" tag="Interactive" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
            See SatQuery
            <br />
            in action.
          </h2>
        </div>
        <p className="text-white/60 text-base leading-[1.6] max-w-md">
          Choose a scenario, read the question, and run it. The workflow mirrors the
          execution trace the real system produces — the analysis is pre-computed for
          this preview, not live model output.
        </p>
      </div>

      {/* Scenario selector */}
      <div
        className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        role="tablist"
        aria-label="Demo scenarios"
      >
        {SCENARIOS.map((s) => {
          const on = s.id === scenarioId;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={on}
              type="button"
              onClick={() => setScenarioId(s.id)}
              className="liquid-glass cursor-pointer rounded-xl p-5 text-left transition-all duration-300"
              style={{
                background: on ? "rgba(0,210,255,0.07)" : undefined,
                transform: on ? "translateY(-2px)" : undefined,
              }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                  style={{ background: on ? "#00d2ff" : "rgba(255,255,255,0.22)" }}
                />
                <span className="text-[0.65rem] uppercase tracking-widest text-white/40">
                  {s.kicker}
                </span>
              </span>
              <span
                className="mt-3 block text-base font-semibold tracking-tight transition-colors duration-300"
                style={{ color: on ? "#fff" : "rgba(255,255,255,0.6)" }}
              >
                {s.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Console */}
      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <div className="liquid-glass overflow-hidden rounded-2xl lg:col-span-8">
          {/* Query bar */}
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-start gap-2.5">
              <Sparkles className="mt-0.5 w-4 h-4 shrink-0" style={{ color: "#00d2ff" }} />
              <p className="min-w-0 text-sm md:text-base leading-snug text-white">
                {scenario.query}
              </p>
            </div>
            <button
              type="button"
              onClick={done ? reset : run}
              disabled={status === "running"}
              className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-all duration-300 active:scale-[0.98] disabled:cursor-wait"
              style={{
                background: done ? "transparent" : "#fff",
                color: done ? "rgba(255,255,255,0.8)" : "#000",
                border: done ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
                opacity: status === "running" ? 0.6 : 1,
              }}
            >
              {status === "running" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing
                </>
              ) : done ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </>
              ) : (
                <>
                  Analyze
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Stage */}
          <div className="relative aspect-[16/11] w-full overflow-hidden sm:aspect-[16/9]">
            {scenario.frames.map((f, i) => (
              <div
                key={f.id}
                className="absolute inset-0 transition-opacity duration-700"
                style={{ opacity: i === frame ? 1 : 0 }}
              >
                <Image
                  src={f.src}
                  alt={`${scenario.name}: ${f.caption}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 780px"
                  className="object-cover"
                />
              </div>
            ))}

            {scenario.overlay && (
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-[900ms]"
                style={{ opacity: done && showOverlay ? 1 : 0 }}
              >
                <Image
                  src={scenario.overlay.src}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 780px"
                  className="object-cover"
                />
              </div>
            )}

            {done &&
              showOverlay &&
              scenario.boxes.map((b, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="pointer-events-none absolute rounded-sm border"
                  style={{
                    left: `${b.x * 100}%`,
                    top: `${b.y * 100}%`,
                    width: `${b.w * 100}%`,
                    height: `${b.h * 100}%`,
                    borderColor: "rgba(245,158,11,0.92)",
                    boxShadow: "0 0 26px rgba(245,158,11,0.2) inset",
                    animation: `drift-in 520ms var(--ease-out-soft) ${i * 130}ms both`,
                  }}
                >
                  <span
                    className="absolute -top-5 left-0 text-[0.58rem] font-medium"
                    style={{ color: "#f59e0b" }}
                  >
                    R{String(i + 1).padStart(2, "0")}
                  </span>
                </span>
              ))}

            {status === "running" && !reduced && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-1/3"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(0,210,255,0.18), transparent)",
                  animation: "sweep 1.6s cubic-bezier(0.65,0,0.35,1) infinite",
                }}
              />
            )}

            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(12,12,12,0.45) 0%, transparent 20%, transparent 66%, rgba(12,12,12,0.85) 100%)",
              }}
            />

            {/* frame switcher */}
            <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
              {scenario.frames.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFrame(i)}
                  aria-pressed={i === frame}
                  className="min-h-[30px] cursor-pointer rounded-full px-3 text-[0.65rem] font-medium backdrop-blur-md transition-all duration-300"
                  style={{
                    background: i === frame ? "rgba(255,255,255,0.9)" : "rgba(12,12,12,0.55)",
                    color: i === frame ? "#000" : "rgba(255,255,255,0.65)",
                  }}
                >
                  {f.label}
                </button>
              ))}
              {scenario.overlay && done && (
                <button
                  type="button"
                  onClick={() => setShowOverlay((v) => !v)}
                  aria-pressed={showOverlay}
                  className="min-h-[30px] cursor-pointer rounded-full px-3 text-[0.65rem] font-medium backdrop-blur-md transition-all duration-300"
                  style={{
                    background: showOverlay ? "rgba(245,158,11,0.25)" : "rgba(12,12,12,0.55)",
                    color: showOverlay ? "#f59e0b" : "rgba(255,255,255,0.65)",
                  }}
                >
                  {scenario.overlay.label}
                </button>
              )}
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-x-5 gap-y-1 p-4">
              {scenario.inputs.map((inp) => (
                <span key={inp.label} className="flex items-baseline gap-2">
                  <span className="text-[0.68rem] font-medium text-white">{inp.label}</span>
                  <span className="text-[0.62rem] text-white/40">{inp.meta}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Trace */}
        <div className="liquid-glass flex flex-col rounded-2xl lg:col-span-4">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <span className="text-[0.65rem] uppercase tracking-widest text-white/40">
              Execution trace
            </span>
            <span className="font-mono text-[0.65rem] text-white/35">
              {scenario.task}
            </span>
          </div>

          <ol className="flex-1 px-5 py-5">
            {scenario.trace.map((t, i) => {
              const on = stage >= i;
              const current = stage === i && status === "running";
              return (
                <li key={t.stage} className="relative flex gap-3.5 pb-4 last:pb-0">
                  {i < scenario.trace.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[5px] top-4 w-px transition-colors duration-500"
                      style={{
                        height: "calc(100% - 0.5rem)",
                        background: on ? "rgba(0,210,255,0.4)" : "rgba(255,255,255,0.07)",
                      }}
                    />
                  )}
                  <span
                    aria-hidden
                    className="relative z-10 mt-[5px] h-[11px] w-[11px] shrink-0 rounded-full border transition-all duration-300"
                    style={{
                      borderColor: on ? "#00d2ff" : "rgba(255,255,255,0.16)",
                      background: on ? "#00d2ff" : "transparent",
                      boxShadow: current ? "0 0 0 5px rgba(0,210,255,0.16)" : "none",
                    }}
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className="block text-xs font-semibold tracking-wide transition-colors duration-300"
                      style={{ color: on ? "#fff" : "rgba(255,255,255,0.28)" }}
                    >
                      {t.stage}
                    </span>
                    <span
                      className="mt-0.5 block text-[0.7rem] leading-snug transition-colors duration-300"
                      style={{ color: on ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)" }}
                    >
                      {t.detail}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>

          <div
            className="overflow-hidden border-t border-white/10 transition-all duration-700"
            style={{ maxHeight: done ? 260 : 0, opacity: done ? 1 : 0 }}
          >
            <div className="px-5 py-4">
              <span className="text-[0.6rem] uppercase tracking-widest text-white/35">
                Tools invoked
              </span>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {scenario.tools.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-white/12 px-2.5 py-1 font-mono text-[0.6rem] text-white/60"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {Object.entries(scenario.params).map(([k, v]) => (
                  <div key={k} className="flex items-baseline gap-1.5">
                    <dt className="font-mono text-[0.6rem] text-white/30">{k}</dt>
                    <dd className="font-mono text-[0.6rem] text-white/55">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      <div
        className="mt-4 grid gap-4 overflow-hidden transition-all duration-[800ms] lg:grid-cols-12"
        style={{
          maxHeight: done ? 760 : 0,
          opacity: done ? 1 : 0,
          transitionTimingFunction: "var(--ease-out-soft)",
        }}
        aria-live="polite"
      >
        <div className="liquid-glass rounded-2xl p-7 lg:col-span-8 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[0.65rem] uppercase tracking-widest text-white/40">
              Answer
            </span>
            <span className="flex items-center gap-2.5">
              <span className="text-[0.65rem] uppercase tracking-widest text-white/40">
                Confidence
              </span>
              <span className="text-sm font-semibold">{scenario.confidence.toFixed(2)}</span>
              <span className="h-[3px] w-20 rounded-full bg-white/10">
                <span
                  className="block h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #0B2551, #00d2ff)",
                    width: done ? `${scenario.confidence * 100}%` : "0%",
                    transition: "width 1000ms var(--ease-out-soft) 300ms",
                  }}
                />
              </span>
            </span>
          </div>
          <p className="mt-5 max-w-[68ch] text-base leading-[1.68] text-white/90">
            {scenario.answer}
          </p>
          <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-relaxed text-white/35">
            Pre-computed result for this preview. Figures are measured from the synthetic
            scene displayed above — they are not production model predictions.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-3 lg:col-span-4 lg:grid-cols-1">
          {scenario.findings.slice(0, 4).map((f) => (
            <div
              key={f.label}
              className="liquid-glass flex items-baseline justify-between gap-3 rounded-xl p-4"
            >
              <dt className="text-[0.6rem] uppercase tracking-widest text-white/40">
                {f.label}
              </dt>
              <dd className="text-base font-semibold" style={{ color: TONE[f.tone] }}>
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
