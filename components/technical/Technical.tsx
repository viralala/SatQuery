"use client";

import { motion } from "motion/react";
import { DATASETS, TASK_FAMILIES, TECH_PILLARS } from "@/lib/data/content";
import { SectionEyebrow } from "@/components/ui/primitives";

/**
 * Technical grounding, kept deliberately compact: enough to show this is not a
 * generic LLM wrapper, without turning the page into an implementation doc.
 */
export function Technical() {
  return (
    <section
      id="technical"
      className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 scroll-mt-24"
    >
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-end">
        <div>
          <SectionEyebrow label="Technical" tag="Domain-adapted" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
            Not a general model
            <br />
            pointed at satellites.
          </h2>
        </div>
        <p className="text-white/60 text-base leading-[1.6] max-w-md">
          A general-purpose LLM or VLM cannot perform these tasks reliably without
          adaptation to remote-sensing imagery, sensor characteristics and domain
          terminology. SatQuery is built around that constraint.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {TECH_PILLARS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            className="liquid-glass flex h-full flex-col rounded-2xl p-7"
          >
            <span className="font-mono text-[0.6rem] text-white/25">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight leading-snug">
              {p.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-[1.65] text-white/55">{p.body}</p>
            <ul className="mt-6 space-y-2 border-t border-white/10 pt-5">
              {p.items.map((it) => (
                <li key={it} className="flex items-start gap-2.5">
                  <span
                    className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full"
                    style={{ background: "#00d2ff" }}
                    aria-hidden
                  />
                  <span className="text-xs leading-snug text-white/45">{it}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-12 md:gap-14">
        <div className="md:col-span-5">
          <span className="text-[0.65rem] uppercase tracking-widest text-white/40">
            Task families the router selects from
          </span>
          <ol className="mt-5">
            {TASK_FAMILIES.map((t, i) => (
              <li
                key={t}
                className="flex items-baseline gap-4 border-b border-white/10 py-3.5"
              >
                <span className="font-mono text-[0.6rem] text-white/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-white/65">{t}</span>
                {i === 0 && (
                  <span
                    className="ml-auto text-[0.55rem] uppercase tracking-widest"
                    style={{ color: "#00d2ff" }}
                  >
                    Mandatory
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="md:col-span-7">
          <span className="text-[0.65rem] uppercase tracking-widest text-white/40">
            Adaptation corpus and evaluation benchmarks
          </span>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            {DATASETS.map((d) => (
              <div key={d.name} className="liquid-glass rounded-xl p-5">
                <dt className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-semibold tracking-tight">{d.name}</span>
                  <span className="text-[0.55rem] uppercase tracking-widest text-white/30">
                    {d.role}
                  </span>
                </dt>
                <dd className="mt-2 text-xs leading-relaxed text-white/45">{d.detail}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-white/35">
            Final evaluation additionally uses an ISRO/SAC dataset of pre-georeferenced,
            co-registered Cartosat-2S optical and RISAT SAR image pairs.
          </p>
        </div>
      </div>
    </section>
  );
}
