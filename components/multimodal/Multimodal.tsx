"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import generated from "@/lib/data/generated.json";
import { SectionEyebrow } from "@/components/ui/primitives";

const MODES = [
  {
    id: "optical",
    label: "Optical",
    src: "/imagery/cross-optical.webp",
    alt: "Synthetic optical multispectral composite of a settlement, river and reservoir",
    reads: "Spectral signature, land-cover context, colour",
    limits: "Blocked by cloud. Dark at night. Built-up and bare soil look alike.",
  },
  {
    id: "sar",
    label: "SAR",
    src: "/imagery/cross-sar.webp",
    alt: "Synthetic synthetic-aperture-radar backscatter image of the same area",
    reads: "Surface structure, roughness, geometry",
    limits: "No colour. Speckle. Hard to interpret in isolation.",
  },
  {
    id: "combined",
    label: "Combined",
    src: "/imagery/cross-sar.webp",
    alt: "The same area with built-up, water and vegetation extracted from both modalities",
    reads: "Structure confirmed by spectrum, and the reverse",
    limits: "Requires co-registration — which the agent validates first.",
  },
] as const;

const c = generated.crossModal;

export function Multimodal() {
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("optical");
  const active = MODES.find((m) => m.id === mode)!;
  const combined = mode === "combined";

  return (
    <section
      id="multimodal"
      className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 scroll-mt-24"
    >
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-end">
        <div>
          <SectionEyebrow label="Multimodal" tag="Optical + SAR" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
            Earth doesn&rsquo;t speak
            <br />
            in one sensor.
          </h2>
        </div>
        <p className="text-white/60 text-base leading-[1.6] max-w-md">
          Optical imagery carries spectrum and context. SAR carries structure, and
          acquires through cloud, day or night. Read together, over the same patch of
          ground, they answer questions neither can answer alone.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mt-12"
      >
        <div
          className="mb-4 flex flex-wrap items-center justify-between gap-4"
          role="tablist"
          aria-label="Imaging modality"
        >
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
            {MODES.map((m) => {
              const on = mode === m.id;
              return (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={on}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className="min-h-[38px] cursor-pointer rounded-full px-5 text-xs font-medium transition-all duration-300"
                  style={{
                    background: on ? "#fff" : "transparent",
                    color: on ? "#000" : "rgba(255,255,255,0.6)",
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
          <span className="hidden items-center gap-2 text-xs text-white/45 md:flex">
            <span
              className="h-1.5 w-1.5 animate-blink rounded-full"
              style={{ background: "#00d2ff" }}
            />
            Co-registered · same extent · 10 m GSD
          </span>
        </div>

        <div className="liquid-glass relative aspect-[16/10] w-full overflow-hidden rounded-2xl sm:aspect-[16/9]">
          {MODES.slice(0, 2).map((m) => (
            <div
              key={m.id}
              className="absolute inset-0 transition-opacity duration-[900ms]"
              style={{ opacity: mode === m.id || (combined && m.id === "sar") ? 1 : 0 }}
            >
              <Image
                src={m.src}
                alt={m.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 1100px"
                className="object-cover"
              />
            </div>
          ))}

          <div
            className="absolute inset-0 transition-opacity duration-[900ms]"
            style={{ opacity: combined ? 1 : 0 }}
          >
            <Image
              src="/imagery/cross-fusion.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1100px"
              className="object-cover mix-blend-screen"
            />
          </div>
          <div
            className="absolute inset-0 transition-opacity duration-[900ms]"
            style={{ opacity: combined ? 0.32 : 0 }}
          >
            <Image
              src="/imagery/cross-optical.webp"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1100px"
              className="object-cover mix-blend-soft-light"
            />
          </div>

          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(12,12,12,0.5) 0%, transparent 24%, transparent 60%, rgba(12,12,12,0.9) 100%)",
            }}
          />

          <div className="absolute left-5 top-4 flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full transition-colors duration-500"
              style={{ background: combined ? "#f59e0b" : "#00d2ff" }}
            />
            <span className="text-xs font-semibold tracking-wide">{active.label}</span>
          </div>

          <div
            className="absolute right-5 top-4 flex gap-4 transition-opacity duration-500"
            style={{ opacity: combined ? 1 : 0 }}
          >
            {[
              ["Built-up", "#f59e0b"],
              ["Water", "#00d2ff"],
              ["Forest", "#10b981"],
            ].map(([k, col]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-sm" style={{ background: col }} />
                <span className="text-[0.65rem] text-white/70">{k}</span>
              </span>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
            <div className="grid gap-4 md:grid-cols-2 md:gap-10">
              <div>
                <span className="text-[0.65rem] uppercase tracking-widest text-white/40">
                  Reads
                </span>
                <p className="mt-1.5 text-sm text-white">{active.reads}</p>
              </div>
              <div>
                <span className="text-[0.65rem] uppercase tracking-widest text-white/40">
                  On its own
                </span>
                <p className="mt-1.5 text-sm text-white/45">{active.limits}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-10 grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-2xl md:text-3xl font-semibold tracking-tight">
            <span className="text-white/50">Optical</span>
            <span className="text-white/25">+</span>
            <span className="text-white/50">SAR</span>
            <span className="text-white/25">=</span>
            <span style={{ color: "#00d2ff" }}>Richer understanding</span>
          </div>
          <p className="mt-6 border-l border-white/12 pl-5 text-sm leading-[1.7] text-white/60">
            &ldquo;Combining optical context with SAR structure improves interpretation of
            built-up and water-covered regions — high backscatter separates structures
            from the bare soil they resemble spectrally, and water&rsquo;s near-zero
            return gives a boundary that haze cannot blur.&rdquo;
          </p>
        </div>

        <div>
          <dl className="grid grid-cols-2 gap-3">
            {[
              ["Built-up extracted", `${c.builtUpKm2} km²`, "#f59e0b"],
              ["Water extracted", `${c.waterKm2} km²`, "#00d2ff"],
              ["Scene built-up", `${c.builtUpPct}%`, "#ffffff"],
              ["Scene water", `${c.waterPct}%`, "#ffffff"],
            ].map(([k, v, col]) => (
              <div key={k} className="liquid-glass rounded-xl p-5">
                <dt className="text-[0.65rem] uppercase tracking-widest text-white/40">{k}</dt>
                <dd className="mt-2 text-xl font-semibold tracking-tight" style={{ color: col }}>
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-white/35">
            Figures measured from the synthetic reference scene above. Illustrative of
            intended output, not a production prediction.
          </p>
        </div>
      </div>
    </section>
  );
}
