"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { MoveHorizontal } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import generated from "@/lib/data/generated.json";
import { SectionEyebrow } from "@/components/ui/primitives";
import { useInView } from "@/lib/hooks/useInView";

const u = generated.urbanChange;

const FINDINGS = [
  { label: "Built-up expansion", value: `+${u.builtUpDeltaPct}%`, tone: "#f59e0b" },
  { label: "New structures", value: `${u.newBuiltUpKm2} km²`, tone: "#f59e0b" },
  { label: "Vegetation loss", value: `${u.vegetationLossKm2} km²`, tone: "#10b981" },
  { label: "Water change", value: `−${u.waterLossKm2} km²`, tone: "#00d2ff" },
];

/**
 * Bi-temporal comparison. The divider is draggable by pointer and by keyboard;
 * revealing the change map fades in the measured transition mask and the
 * regions extracted from it.
 */
export function Temporal() {
  const [split, setSplit] = useState(52);
  const [revealed, setRevealed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  const setFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setSplit(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => setFromClientX(e.clientX);
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [dragging, setFromClientX]);

  return (
    <section
      id="temporal"
      className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 scroll-mt-24"
    >
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-end">
        <div>
          <SectionEyebrow label="Temporal" tag="Bi-temporal" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
            Don&rsquo;t just see Earth.
            <br />
            See how it changes.
          </h2>
        </div>
        <p className="text-white/60 text-base leading-[1.6] max-w-md">
          Two images of the same ground, acquired months apart, hold information neither
          holds alone. SatQuery reads the pair as a single question: what changed, where,
          and by how much.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        ref={ref}
        className="mt-12"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-white/60">
            <span className="font-medium">June 2025</span>
            <span className="text-white/25">→</span>
            <span className="font-medium">September 2025</span>
          </div>
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-pressed={revealed}
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-2.5 rounded-full border px-5 text-xs font-medium transition-all duration-300"
            style={{
              borderColor: revealed ? "rgba(245,158,11,0.55)" : "rgba(255,255,255,0.15)",
              color: revealed ? "#f59e0b" : "rgba(255,255,255,0.7)",
              background: revealed ? "rgba(245,158,11,0.08)" : "transparent",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full transition-all duration-300"
              style={{ background: revealed ? "#f59e0b" : "rgba(255,255,255,0.3)" }}
            />
            {revealed ? "Change map on" : "Reveal change"}
          </button>
        </div>

        <div
          ref={frameRef}
          className="liquid-glass relative aspect-[16/11] w-full select-none overflow-hidden rounded-2xl sm:aspect-[16/9]"
          style={{ cursor: dragging ? "ew-resize" : "default", touchAction: "pan-y" }}
          onPointerDown={(e) => {
            setDragging(true);
            setFromClientX(e.clientX);
          }}
        >
          <Image
            src="/imagery/urban-t2.webp"
            alt="Synthetic optical scene of the settlement in September 2025, showing expanded built-up area"
            fill
            sizes="(max-width: 1024px) 100vw, 1100px"
            className="object-cover"
          />

          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              clipPath: `inset(0 ${100 - split}% 0 0)`,
              transition: dragging ? "none" : "clip-path 420ms var(--ease-out-soft)",
            }}
          >
            <Image
              src="/imagery/urban-t1.webp"
              alt="The same settlement in June 2025, before the expansion"
              fill
              sizes="(max-width: 1024px) 100vw, 1100px"
              className="object-cover"
            />
            <span className="absolute left-5 top-4 text-xs font-semibold drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              JUN 2025
            </span>
          </div>

          <span className="absolute right-5 top-4 text-xs font-semibold drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
            SEP 2025
          </span>

          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-[900ms]"
            style={{ opacity: revealed ? 1 : 0 }}
          >
            <Image
              src="/imagery/urban-change-mask.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1100px"
              className="object-cover"
            />
          </div>

          {u.builtRegions.map((b, i) => (
            <span
              key={i}
              aria-hidden
              className="pointer-events-none absolute rounded-sm border"
              style={{
                left: `${b.x * 100}%`,
                top: `${b.y * 100}%`,
                width: `${b.w * 100}%`,
                height: `${b.h * 100}%`,
                borderColor: "rgba(245,158,11,0.9)",
                boxShadow: "0 0 22px rgba(245,158,11,0.22) inset",
                opacity: revealed ? 1 : 0,
                transform: revealed ? "scale(1)" : "scale(1.06)",
                transition: `opacity 600ms var(--ease-out-soft) ${340 + i * 140}ms, transform 600ms var(--ease-out-soft) ${340 + i * 140}ms`,
              }}
            >
              <span
                className="absolute -top-5 left-0 whitespace-nowrap text-[0.6rem] font-medium"
                style={{ color: "#f59e0b" }}
              >
                R{String(i + 1).padStart(2, "0")} · new built-up
              </span>
            </span>
          ))}

          <div
            className="absolute inset-y-0 z-10 w-px bg-white/85"
            style={{
              left: `${split}%`,
              transition: dragging ? "none" : "left 420ms var(--ease-out-soft)",
              boxShadow: "0 0 18px rgba(255,255,255,0.35)",
            }}
          >
            <button
              type="button"
              role="slider"
              aria-label="Compare acquisitions"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(split)}
              aria-valuetext={`${Math.round(split)}% June 2025`}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") setSplit((s) => Math.max(0, s - 4));
                if (e.key === "ArrowRight") setSplit((s) => Math.min(100, s + 4));
                if (e.key === "Home") setSplit(0);
                if (e.key === "End") setSplit(100);
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                setDragging(true);
              }}
              className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-white/40 bg-black/60 backdrop-blur-sm transition-transform duration-200 hover:scale-110"
            >
              <MoveHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FINDINGS.map((f, i) => (
            <div
              key={f.label}
              className="liquid-glass rounded-xl p-5"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translate3d(0,12px,0)",
                transition: `opacity 600ms var(--ease-out-soft) ${i * 100}ms, transform 600ms var(--ease-out-soft) ${i * 100}ms`,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-sm" style={{ background: f.tone }} aria-hidden />
                <dt className="text-[0.65rem] uppercase tracking-widest text-white/40">
                  {f.label}
                </dt>
              </div>
              <dd className="mt-3 text-2xl font-semibold tracking-tight" style={{ color: f.tone }}>
                {f.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-4">
          <p className="max-w-[62ch] text-sm leading-relaxed text-white/55">
            {u.changedFraction}% of the scene changed class between the two dates. The
            expansion is concentrated on the eastern edge of the settlement.
          </p>
          <p className="font-mono text-xs text-white/30">
            synthetic reference · {u.width}×{u.height} px · {u.gsd} m GSD
          </p>
        </div>
      </motion.div>
    </section>
  );
}
