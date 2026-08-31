"use client";

import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CAPABILITIES } from "@/lib/data/content";
import { SectionEyebrow } from "@/components/ui/primitives";

/**
 * Capabilities as an editorial index rather than a card grid — one open row at
 * a time, so the list reads as a table of contents for the functional scope.
 */
export function Capabilities() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="capabilities"
      className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 scroll-mt-24"
    >
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-end">
        <div>
          <SectionEyebrow label="Capabilities" tag="Functional scope" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
            What the system
            <br />
            can be asked.
          </h2>
        </div>
        <p className="text-white/60 text-base leading-[1.6] max-w-md">
          Six capabilities, defined by the functional scope of the problem statement.
          Single-image understanding is the mandatory baseline; paired cross-modal and
          multitemporal reasoning is the principal focus.
        </p>
      </div>

      <div className="mt-12 liquid-glass rounded-2xl px-5 md:px-7">
        {CAPABILITIES.map((cap, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={cap.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="border-b border-white/10 last:border-b-0"
            >
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`cap-${cap.id}`}
                  className="group flex w-full cursor-pointer items-start gap-5 py-6 text-left md:items-center md:gap-8"
                >
                  <span
                    className="mt-1 font-mono text-xs transition-colors duration-300 md:mt-0"
                    style={{ color: isOpen ? "#00d2ff" : "rgba(255,255,255,0.28)" }}
                  >
                    {cap.index}
                  </span>

                  <span className="flex-1">
                    <span
                      className="block text-xl md:text-2xl font-semibold tracking-tight transition-colors duration-300"
                      style={{ color: isOpen ? "#fff" : "rgba(255,255,255,0.62)" }}
                    >
                      {cap.title}
                    </span>
                    <span className="mt-1.5 block max-w-[46ch] text-xs leading-snug text-white/40 lg:hidden">
                      {cap.lede}
                    </span>
                  </span>

                  <span className="hidden max-w-[28ch] flex-1 text-xs leading-snug text-white/40 lg:block">
                    {cap.lede}
                  </span>

                  <span
                    aria-hidden
                    className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 md:mt-0"
                    style={{
                      borderColor: isOpen ? "rgba(0,210,255,0.6)" : "rgba(255,255,255,0.14)",
                      transform: isOpen ? "rotate(45deg)" : "none",
                      color: isOpen ? "#00d2ff" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </span>
                </button>
              </h3>

              <div
                id={`cap-${cap.id}`}
                className="overflow-hidden transition-all duration-[600ms]"
                style={{
                  maxHeight: isOpen ? 320 : 0,
                  opacity: isOpen ? 1 : 0,
                  transitionTimingFunction: "var(--ease-out-soft)",
                }}
              >
                <div className="grid gap-4 pb-8 md:grid-cols-12 md:gap-8">
                  <div className="md:col-span-3 md:col-start-2">
                    <span className="text-[0.6rem] uppercase tracking-widest text-white/35">
                      {cap.tag}
                    </span>
                  </div>
                  <p className="max-w-[62ch] text-sm leading-[1.7] text-white/60 md:col-span-8">
                    {cap.body}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
