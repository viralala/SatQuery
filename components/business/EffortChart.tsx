"use client";

import { useState } from "react";
import { UNIT_ECONOMICS } from "@/lib/data/business";

/**
 * Emphasis bar chart: one series is the point, the other is context.
 *
 * Palette validated against the #0c0c0c surface — both steps sit inside the
 * dark-mode lightness band, contrast >= 3:1, and the pair separates at
 * dE 15.5 under deuteranopia. Values are direct-labelled, so identity and
 * magnitude never depend on colour alone.
 */
const ACCENT = "#1f9dc4";
const CONTEXT = "#5a6670";

export function EffortChart() {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...UNIT_ECONOMICS.series.map((s) => s.hours));

  return (
    <figure className="liquid-glass rounded-2xl p-6 md:p-8">
      <figcaption className="text-sm font-semibold tracking-tight">
        {UNIT_ECONOMICS.caption}
      </figcaption>
      <p className="mt-1.5 text-xs text-white/40">
        Lower is better. Hover a bar for the exact figure.
      </p>

      <div className="mt-7 space-y-6">
        {UNIT_ECONOMICS.series.map((s, i) => {
          // Floor the width so the small bar stays visible; the label carries truth.
          const pct = Math.max((s.hours / max) * 100, 0.6);
          const on = hover === i;
          return (
            <div
              key={s.name}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              tabIndex={0}
              className="group relative cursor-default rounded-md outline-none"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span
                  className="text-sm"
                  style={{ color: s.emphasis ? "#fff" : "rgba(255,255,255,0.55)" }}
                >
                  {s.name}
                </span>
                <span
                  className="shrink-0 font-mono text-sm tabular-nums"
                  style={{ color: s.emphasis ? "#fff" : "rgba(255,255,255,0.55)" }}
                >
                  {s.hours} h
                </span>
              </div>

              {/* Hit target is the whole row, not just the mark. */}
              <div className="mt-2.5 h-6 w-full rounded-[3px] bg-white/[0.04]">
                <div
                  className="h-full rounded-[3px] transition-all duration-300"
                  style={{
                    width: `${pct}%`,
                    background: s.emphasis ? ACCENT : CONTEXT,
                    opacity: hover === null || on ? 1 : 0.55,
                    minWidth: 3,
                  }}
                />
              </div>

              {on && (
                <div
                  role="tooltip"
                  className="pointer-events-none absolute -top-2 left-0 z-10 -translate-y-full rounded-lg border border-white/12 bg-[#111418] px-3 py-2 shadow-xl"
                >
                  <p className="text-xs font-medium">{s.name}</p>
                  <p className="mt-0.5 font-mono text-[0.7rem] tabular-nums text-white/60">
                    {s.hours} specialist hours / 100 queries
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Table alternative — the chart is never the only way to read this. */}
      <details className="mt-7 border-t border-white/10 pt-4">
        <summary className="cursor-pointer text-xs text-white/45 transition-colors hover:text-white/70">
          View as table and assumptions
        </summary>
        <table className="mt-4 w-full text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th scope="col" className="pb-2 text-[0.65rem] uppercase tracking-widest text-white/35">
                Workflow
              </th>
              <th scope="col" className="pb-2 text-right text-[0.65rem] uppercase tracking-widest text-white/35">
                Hours / 100 queries
              </th>
            </tr>
          </thead>
          <tbody>
            {UNIT_ECONOMICS.series.map((s) => (
              <tr key={s.name} className="border-b border-white/[0.06]">
                <td className="py-2.5 text-xs text-white/70">{s.name}</td>
                <td className="py-2.5 text-right font-mono text-xs tabular-nums text-white/70">
                  {s.hours}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-xs leading-relaxed text-white/40">
          {UNIT_ECONOMICS.assumptions}
        </p>
      </details>

      <p className="mt-4 text-xs text-white/35">{UNIT_ECONOMICS.footnote}</p>
    </figure>
  );
}
