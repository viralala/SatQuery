"use client";

import Image from "next/image";
import { motion } from "motion/react";
import generated from "@/lib/data/generated.json";
import { SectionEyebrow } from "@/components/ui/primitives";
import { useInView } from "@/lib/hooks/useInView";

const u = generated.urbanChange;
const region = u.builtRegions[0];
const CONFIDENCE = 0.87;

/**
 * The anatomy of a response: the sentence, the region it refers to, the
 * confidence attached to it, and the execution summary behind it.
 */
export function Evidence() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section
      id="evidence"
      className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 scroll-mt-24"
    >
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-end">
        <div>
          <SectionEyebrow label="Evidence" tag="Grounded" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
            Answers
            <br />
            you can see.
          </h2>
        </div>
        <p className="text-white/60 text-base leading-[1.6] max-w-md">
          A sentence on its own is not an analysis. Every answer SatQuery returns carries
          the region it is grounded in, the confidence attached to it, and a summary of
          exactly which models produced it.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        ref={ref}
        className="mt-12 grid gap-6 lg:grid-cols-12"
      >
        <div className="liquid-glass relative aspect-[4/3] overflow-hidden rounded-2xl lg:col-span-7 lg:aspect-auto lg:min-h-[520px]">
          <Image
            src="/imagery/urban-t2.webp"
            alt="Synthetic optical scene with the eastern expansion area outlined as evidence"
            fill
            sizes="(max-width: 1024px) 100vw, 760px"
            className="object-cover"
            style={{ objectPosition: "72% 45%" }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(78% 62% at 62% 46%, transparent 20%, rgba(12,12,12,0.78) 100%)",
            }}
          />

          <span
            aria-hidden
            className="absolute rounded-sm border-2"
            style={{
              left: "38%",
              top: "24%",
              width: "40%",
              height: "48%",
              borderColor: "#f59e0b",
              boxShadow: "0 0 40px rgba(245,158,11,0.3) inset, 0 0 26px rgba(245,158,11,0.16)",
              opacity: inView ? 1 : 0,
              transform: inView ? "scale(1)" : "scale(1.08)",
              transition:
                "opacity 800ms var(--ease-out-soft) 420ms, transform 800ms var(--ease-out-soft) 420ms",
            }}
          >
            <span
              className="absolute -top-6 left-0 flex items-center gap-2 whitespace-nowrap"
              style={{ opacity: inView ? 1 : 0, transition: "opacity 600ms 900ms" }}
            >
              <span
                className="h-1.5 w-1.5 animate-blink rounded-full"
                style={{ background: "#f59e0b" }}
              />
              <span className="text-[0.65rem] font-medium" style={{ color: "#f59e0b" }}>
                Eastern edge · {u.newBuiltUpKm2} km² new built-up
              </span>
            </span>
          </span>

          <div className="absolute bottom-4 left-5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#f59e0b" }} />
            <span className="text-[0.65rem] uppercase tracking-widest text-white/60">
              Grounded region
            </span>
          </div>
        </div>

        <div className="liquid-glass flex flex-col justify-between gap-8 rounded-2xl p-7 lg:col-span-5 lg:p-8">
          <div>
            <span className="text-[0.65rem] uppercase tracking-widest text-white/40">
              Response
            </span>
            <p className="mt-4 text-base md:text-lg leading-[1.6] text-white/90">
              &ldquo;Built-up area increased primarily along the eastern edge of the
              settlement, where {u.newBuiltUpKm2} km² of previously vegetated and bare land
              was converted between the two acquisitions.&rdquo;
            </p>

            <div className="mt-7">
              <div className="flex items-baseline justify-between">
                <span className="text-[0.65rem] uppercase tracking-widest text-white/40">
                  Confidence
                </span>
                <span className="text-sm font-semibold">{CONFIDENCE.toFixed(2)}</span>
              </div>
              <div className="mt-2.5 h-[3px] w-full rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #0B2551, #00d2ff)",
                    width: inView ? `${CONFIDENCE * 100}%` : "0%",
                    transition: "width 1200ms var(--ease-out-soft) 600ms",
                  }}
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/35">
                Below the gate, the system abstains and explains instead of answering.
              </p>
            </div>
          </div>

          <div>
            <span className="text-[0.65rem] uppercase tracking-widest text-white/40">
              Supporting evidence
            </span>
            <ul className="mt-4">
              {[
                ["Change map", `${u.changedFraction}% of scene reclassified`],
                [
                  "Region geometry",
                  `${u.builtRegions.length} regions · largest ${region ? (region.area / 1e4).toFixed(1) : "—"} ha`,
                ],
                ["Area statistics", `${u.builtUpT1Km2} → ${u.builtUpT2Km2} km²`],
                ["Class transitions", "vegetation → bare → built-up"],
              ].map(([k, v], i) => (
                <li
                  key={k}
                  className="flex items-baseline justify-between gap-4 border-b border-white/8 py-3"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "none" : "translate3d(0,8px,0)",
                    transition: `opacity 450ms var(--ease-out-soft) ${420 + i * 80}ms, transform 450ms var(--ease-out-soft) ${420 + i * 80}ms`,
                  }}
                >
                  <span className="text-sm text-white/70">{k}</span>
                  <span className="text-right font-mono text-[0.7rem] text-white/45">{v}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <span className="text-[0.6rem] uppercase tracking-widest text-white/35">
                Execution summary
              </span>
              <p className="mt-2 break-words font-mono text-[0.66rem] leading-relaxed text-white/45">
                {"{ task: change_vqa · tools: [validator, change_net, change_vqa] · params: { thr: 0.5, gsd: 10m } · confidence: 0.87 }"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
