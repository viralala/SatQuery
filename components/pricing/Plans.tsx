"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import { useState } from "react";
import { PLANS, PLAN_NOTE } from "@/lib/data/business";
import { SectionEyebrow } from "@/components/ui/primitives";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Multi-year commitments are how public procurement actually buys. */
const MULTI_YEAR: Record<string, string> = {
  community: "Free",
  institutional: "₹10–15 L",
  mission: "Engagement",
};

export function Plans() {
  const [multiYear, setMultiYear] = useState(false);

  return (
    <section
      id="plans"
      className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 scroll-mt-24"
    >
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-end">
        <div>
          <SectionEyebrow label="Deployment" tag="Open core" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
            Free to run.
            <br />
            Paid to operate.
          </h2>
        </div>
        <p className="max-w-md text-base leading-[1.6] text-white/60">
          The system itself stays open and self-hostable — that is what makes it
          deployable inside a government network without lock-in. What is paid for
          is running it: sensor adaptation, on-premise support and integration.
        </p>
      </div>

      {/* Term toggle */}
      <div className="mt-10 flex items-center justify-center gap-3">
        <span
          className="text-sm transition-colors"
          style={{ color: multiYear ? "rgba(255,255,255,0.45)" : "#fff" }}
        >
          Annual
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={multiYear}
          aria-label="Show multi-year pricing"
          onClick={() => setMultiYear((v) => !v)}
          className={`c3-toggle ${multiYear ? "active" : ""}`}
        >
          <span className="c3-toggle-knob" />
        </button>
        <span
          className="text-sm transition-colors"
          style={{ color: multiYear ? "#fff" : "rgba(255,255,255,0.45)" }}
        >
          3-year term
        </span>
        <span
          className="ml-1 rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem]"
          style={{ color: "#00d2ff" }}
        >
          ~15% lower
        </span>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {PLANS.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: i * 0.09, ease: EASE }}
            className="liquid-glass relative flex flex-col rounded-2xl p-7 md:p-8"
            style={
              p.featured
                ? { boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1), 0 0 0 1px rgba(0,210,255,0.35)" }
                : undefined
            }
          >
            {p.featured && (
              <span
                className="absolute right-6 top-6 rounded-full px-2.5 py-1 text-[0.6rem] font-medium"
                style={{ background: "rgba(0,210,255,0.14)", color: "#00d2ff" }}
              >
                Most common
              </span>
            )}

            <p className="text-xs text-white/45">{p.tier}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{p.name}</h3>

            <div className="mt-6">
              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                {multiYear ? MULTI_YEAR[p.id] : p.price}
              </p>
              <p className="mt-1 text-xs text-white/40">{p.cadence}</p>
            </div>

            <p className="mt-5 min-h-[4.5em] text-sm leading-[1.6] text-white/50">
              {p.desc}
            </p>

            <ul className="mt-2 mb-8 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "rgba(255,255,255,0.12)" }}
                  >
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <span className="text-sm leading-snug text-white/70">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={p.href}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all active:scale-[0.98]"
              style={
                p.featured
                  ? { background: "#fff", color: "#000" }
                  : { border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }
              }
            >
              {p.cta}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-center">
        <p className="text-sm leading-[1.65] text-white/45 md:col-span-8">{PLAN_NOTE}</p>
        <div className="md:col-span-4 md:text-right">
          <Link
            href="/business"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition-all hover:bg-white/5"
          >
            Market, model and scale
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-[1px] group-hover:-translate-y-[1px]" />
          </Link>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-white/30">
        Indicative pricing for discussion. Figures reflect the cost of operating and
        supporting a deployment, not a licence on the capability itself — the core
        system is open and can be self-hosted at no cost.
      </p>
    </section>
  );
}
