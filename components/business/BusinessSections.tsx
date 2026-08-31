"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import {
  GOVERNMENT,
  MARKET,
  MARKET_CONTEXT,
  RISKS,
  ROADMAP,
  SCALING,
  STATUS_QUO,
  type Basis,
} from "@/lib/data/business";
import { EffortChart } from "./EffortChart";
import { SectionEyebrow, gradientStyle } from "@/components/ui/primitives";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Every figure on this page states whether it is policy, target, or estimate. */
function BasisTag({ basis }: { basis: Basis }) {
  const map: Record<Basis, { label: string; color: string }> = {
    official: { label: "Published target", color: "#10b981" },
    deck: { label: "Project target", color: "#00d2ff" },
    estimate: { label: "Team estimate", color: "#f59e0b" },
  };
  const m = map[basis];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2 py-0.5">
      <span className="h-1 w-1 rounded-full" style={{ background: m.color }} />
      <span className="text-[0.6rem] tracking-wide text-white/50">{m.label}</span>
    </span>
  );
}

/* ------------------------------------------------------------------- hero */
export function BusinessHero() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 pt-14 pb-16 md:pt-20 md:pb-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to SatQuery
      </Link>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        className="mt-10 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.0] max-w-[16ch]"
      >
        The case for{" "}
        <span className="relative inline-block">
          <span className="animate-shiny" style={gradientStyle}>
            scale
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ color: "#fff", opacity: 0.34, mixBlendMode: "screen" }}
          >
            scale
          </span>
        </span>
        .
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        className="mt-8 max-w-xl text-base leading-[1.65] text-white/60"
      >
        SatQuery is built for an ISRO problem statement, but the question judges
        and funders both ask is the same: who needs this, what does it replace,
        and what keeps it running after the hackathon? This page answers that.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.42, ease: EASE }}
        className="mt-10 flex flex-wrap gap-3"
      >
        {[
          ["Market", "#market"],
          ["Business model", "#model"],
          ["Government fit", "#government"],
          ["Roadmap", "#roadmap"],
        ].map(([label, href]) => (
          <a
            key={href}
            href={href}
            className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-xs text-white/70 transition-all hover:border-white/30 hover:text-white"
          >
            {label}
          </a>
        ))}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------- status quo */
export function StatusQuo() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-white/10">
      <SectionEyebrow label="The cost today" tag="Why it matters" />
      <h2 className="mt-5 max-w-[20ch] text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
        Open data nobody can question isn&rsquo;t open.
      </h2>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {STATUS_QUO.map((s, i) => (
          <motion.div
            key={s.stat}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.09, ease: EASE }}
            className="liquid-glass rounded-2xl p-7"
          >
            <p className="text-3xl font-semibold tracking-tight">{s.stat}</p>
            <p className="mt-1.5 text-sm text-white/50">{s.label}</p>
            <p className="mt-5 text-sm leading-[1.65] text-white/60">{s.detail}</p>
            <div className="mt-5">
              <BasisTag basis={s.basis} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- market */
export function Market() {
  return (
    <section
      id="market"
      className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-white/10 scroll-mt-24"
    >
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-end">
        <div>
          <SectionEyebrow label="Market" tag="TAM / SAM / SOM" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
            How big the
            <br />
            addressable problem is.
          </h2>
        </div>
        <p className="max-w-md text-base leading-[1.6] text-white/60">
          Sized from India&rsquo;s own published geospatial target downward, not
          from a global market figure inward. Each tier states whether it is a
          published number or our estimate.
        </p>
      </div>

      {/* Containment, not a scale — the values differ by orders of magnitude,
          so these are stat tiles rather than bars pretending to be comparable. */}
      <div className="mt-12 space-y-4">
        {MARKET.map((m, i) => (
          <motion.div
            key={m.tier}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
            className="liquid-glass rounded-2xl p-7 md:p-8"
            style={{ marginLeft: `${i * 4}%`, marginRight: `${i * 2}%` }}
          >
            <div className="grid gap-6 md:grid-cols-12 md:items-baseline">
              <div className="md:col-span-3">
                <p className="font-mono text-xs tracking-widest" style={{ color: "#00d2ff" }}>
                  {m.tier}
                </p>
                <p className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                  {m.value}
                </p>
                <p className="mt-1 text-xs text-white/40">{m.approx}</p>
              </div>
              <div className="md:col-span-6">
                <p className="text-sm font-semibold">{m.name}</p>
                <p className="mt-2 text-sm leading-[1.65] text-white/55">{m.body}</p>
              </div>
              <div className="md:col-span-3 md:text-right">
                <BasisTag basis={m.basis} />
                <p className="mt-2.5 text-[0.68rem] leading-snug text-white/35">
                  {m.source}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MARKET_CONTEXT.map((c) => (
          <div key={c.label} className="liquid-glass rounded-xl p-5">
            <p className="text-xl font-semibold tracking-tight">{c.value}</p>
            <p className="mt-1 text-xs text-white/55">{c.label}</p>
            <p className="mt-2 text-[0.68rem] text-white/35">{c.note}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 max-w-[70ch] text-xs leading-relaxed text-white/35">
        Published targets are quoted from government policy documents and agency
        statements; verify them against the primary source before citing. Tiers
        marked as estimates are modelling assumptions for discussion, not forecasts.
      </p>
    </section>
  );
}

/* ------------------------------------------------------------ unit economics */
export function UnitEconomics() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-white/10">
      <div className="grid gap-10 md:gap-14 lg:grid-cols-12 items-center">
        <div className="lg:col-span-5">
          <SectionEyebrow label="Unit economics" tag="What it displaces" />
          <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight leading-[1.05]">
            The saving is specialist time.
          </h2>
          <p className="mt-6 text-base leading-[1.65] text-white/60">
            SatQuery does not sell imagery — the archives are already free. It
            sells back the hours that currently go into turning imagery into an
            answer, and it puts that answer within reach of people who could
            never have produced it themselves.
          </p>
          <p className="mt-5 text-sm leading-[1.65] text-white/45">
            At the institutional band, one deployment pays for itself against the
            analyst time it displaces well inside a year — and that ignores the
            decisions that simply were not possible at analyst-day latency.
          </p>
        </div>
        <div className="lg:col-span-7">
          <EffortChart />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- scaling */
export function Scaling() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-white/10">
      <SectionEyebrow label="Scaling" tag="Architecture as strategy" />
      <h2 className="mt-5 max-w-[22ch] text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
        Growth costs an adapter, not a rebuild.
      </h2>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {SCALING.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className="liquid-glass rounded-2xl p-7"
          >
            <span className="font-mono text-[0.65rem] text-white/25">{s.step}</span>
            <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.title}</h3>
            <p className="mt-3 text-sm leading-[1.65] text-white/55">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- government */
export function Government() {
  return (
    <section
      id="government"
      className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-white/10 scroll-mt-24"
    >
      <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-end">
        <div>
          <SectionEyebrow label="Government fit" tag="Public value" />
          <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
            Why this belongs
            <br />
            in public hands.
          </h2>
        </div>
        <p className="max-w-md text-base leading-[1.6] text-white/60">
          The capability is most valuable exactly where it is least commercially
          obvious: departments with open data, real decisions, and no in-house
          remote-sensing team.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {GOVERNMENT.map((g, i) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
            className="liquid-glass flex h-full flex-col rounded-2xl p-6"
          >
            <span className="text-[0.6rem] uppercase tracking-widest" style={{ color: "#00d2ff" }}>
              {g.tag}
            </span>
            <h3 className="mt-3 text-base font-semibold tracking-tight leading-snug">
              {g.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-[1.65] text-white/55">{g.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- roadmap */
export function Roadmap() {
  const hack = ROADMAP.filter((r) => r.horizon === "hackathon");
  const beyond = ROADMAP.filter((r) => r.horizon === "beyond");

  return (
    <section
      id="roadmap"
      className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-white/10 scroll-mt-24"
    >
      <SectionEyebrow label="Roadmap" tag="12 weeks, then 3 years" />
      <h2 className="mt-5 max-w-[20ch] text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
        From vertical slice to operational service.
      </h2>

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
        {[
          { label: "Build phase", items: hack, accent: "#00d2ff" },
          { label: "Beyond the hackathon", items: beyond, accent: "#f59e0b" },
        ].map((col) => (
          <div key={col.label}>
            <p className="text-[0.65rem] uppercase tracking-widest text-white/40">
              {col.label}
            </p>
            <ol className="relative mt-6">
              <span
                aria-hidden
                className="absolute left-[5px] top-2 bottom-2 w-px"
                style={{ background: "rgba(255,255,255,0.1)" }}
              />
              {col.items.map((r, i) => (
                <motion.li
                  key={r.phase}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                  className="relative flex gap-5 pb-7 last:pb-0"
                >
                  <span
                    aria-hidden
                    className="relative z-10 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border"
                    style={{ borderColor: col.accent, background: "#0c0c0c" }}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-3">
                      <span className="font-mono text-xs" style={{ color: col.accent }}>
                        {r.phase}
                      </span>
                      <span className="text-sm font-semibold tracking-tight">{r.title}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-[1.6] text-white/50">{r.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- risks */
export function Risks() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-24 border-t border-white/10">
      <SectionEyebrow label="Objections" tag="Answered" />
      <h2 className="mt-5 max-w-[20ch] text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
        The questions worth asking.
      </h2>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {RISKS.map((r, i) => (
          <motion.div
            key={r.risk}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: EASE }}
            className="liquid-glass rounded-2xl p-7"
          >
            <p className="text-base font-semibold tracking-tight text-white/85">
              &ldquo;{r.risk}&rdquo;
            </p>
            <p className="mt-4 border-l-2 pl-4 text-sm leading-[1.65] text-white/55" style={{ borderColor: "#00d2ff" }}>
              {r.answer}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- closing */
export function BusinessCta() {
  return (
    <section id="contact" className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-28 scroll-mt-24">
      <div className="liquid-glass relative overflow-hidden rounded-3xl px-8 py-16 text-center md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px circle at 50% 0%, rgba(255,255,255,0.15), transparent 70%)",
            opacity: 0.3,
          }}
        />
        <div className="relative">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
            See the system
            <br />
            the case is built on.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-sm leading-[1.6] text-white/60">
            The business case only matters if the thing works. The demo runs four
            scenarios end to end, with the evidence each answer rests on.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#demo"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition-all hover:bg-white/90 active:scale-[0.98]"
            >
              Open the demo
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-[1px]" />
            </Link>
            <Link
              href="/#plans"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white transition-all hover:bg-white/5"
            >
              Deployment tiers
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
