"use client";

import { motion } from "motion/react";
import {
  Archive,
  Download,
  Inbox,
  Layers,
  MoreHorizontal,
  Paperclip,
  RotateCw,
  Search,
  Send,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import generated from "@/lib/data/generated.json";

const u = generated.urbanChange;

const NAV = [
  { icon: Inbox, label: "Scenes", count: 12, active: true },
  { icon: Star, label: "Pinned", count: 3 },
  { icon: Send, label: "Runs" },
  { icon: Layers, label: "Reports", count: 2 },
  { icon: Archive, label: "Archive" },
  { icon: Trash2, label: "Trash" },
];

const LAYERS = [
  { name: "Optical", color: "#00d2ff" },
  { name: "SAR", color: "#A4F4FD" },
  { name: "Change", color: "#f59e0b" },
  { name: "Water", color: "#10b981" },
];

const QUERIES = [
  {
    scene: "Kharagpur · T1/T2",
    subject: "Has the built-up area increased?",
    preview: `Built-up grew ${u.builtUpDeltaPct}% — expansion along the eastern edge…`,
    time: "9:41 AM",
    unread: true,
    active: true,
  },
  {
    scene: "Godavari Basin",
    subject: "Where did the water-covered region change?",
    preview: "Water extent up 145.8% — inundation south of the main channel…",
    time: "8:12 AM",
    unread: true,
  },
  {
    scene: "Cuttack Delta",
    subject: "Identify built-up and water from optical + SAR",
    preview: "Cross-modal extraction resolved 8.32 km² built-up, 24.39 km² water.",
    time: "Yesterday",
  },
  {
    scene: "Nashik Scene 04",
    subject: "Describe the land-cover and major objects",
    preview: "Predominantly cropland with a settlement in the south-east quadrant.",
    time: "Yesterday",
  },
  {
    scene: "Sundarbans T2",
    subject: "Highlight the water body referred to in the query",
    preview: "Grounded region returned · surface extent 21.79 km².",
    time: "Mon",
  },
  {
    scene: "Bhuj Corridor",
    subject: "What changed between these two dates?",
    preview: `Change map generated · ${u.changedFraction}% of scene reclassified.`,
    time: "Mon",
  },
];

/**
 * A mockup of the SatQuery workspace: scene library, query history, and the
 * grounded result for the selected run. Static — it sets expectations for the
 * live demo further down the page.
 */
export function Console() {
  return (
    <div id="console" className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24 scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl"
      >
        {/* Title bar */}
        <div className="relative flex items-center px-4 h-10 border-b border-white/10">
          <div className="flex gap-2">
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <span key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <span className="absolute left-1/2 -translate-x-1/2 text-xs text-white/50">
            SatQuery — Analysis
          </span>
        </div>

        <div className="grid grid-cols-12 h-[520px]">
          {/* Sidebar */}
          <aside className="col-span-3 border-r border-white/10 bg-black/30 p-4 hidden md:block">
            <button
              type="button"
              className="w-full rounded-lg bg-white text-black text-xs font-semibold px-3 py-2 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              New query
            </button>

            <nav className="mt-5 space-y-0.5">
              {NAV.map((n) => (
                <div
                  key={n.label}
                  className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                    n.active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5"
                  }`}
                >
                  <n.icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="flex-1 truncate">{n.label}</span>
                  {n.count && <span className="text-[0.65rem] text-white/40">{n.count}</span>}
                </div>
              ))}
            </nav>

            <div className="mt-7">
              <span className="text-[0.6rem] uppercase tracking-[0.16em] text-white/35">
                Layers
              </span>
              <ul className="mt-3 space-y-2">
                {LAYERS.map((l) => (
                  <li key={l.name} className="flex items-center gap-2.5 px-2.5 text-xs text-white/60">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: l.color }}
                    />
                    {l.name}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Query list */}
          <div className="col-span-12 md:col-span-4 border-r border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 px-4 h-11 border-b border-white/10">
              <Search className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs text-white/40">Search scenes and queries</span>
            </div>
            <ul className="overflow-y-auto" style={{ maxHeight: 468 }}>
              {QUERIES.map((q) => (
                <li
                  key={q.subject}
                  className={`px-4 py-3 border-b border-white/[0.06] cursor-pointer transition-colors ${
                    q.active ? "bg-white/[0.07]" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={`text-xs truncate ${
                        q.unread ? "text-white font-semibold" : "text-white/70"
                      }`}
                    >
                      {q.scene}
                    </span>
                    <span className="text-[0.65rem] text-white/35 shrink-0">{q.time}</span>
                  </div>
                  <p
                    className={`mt-1 text-xs truncate ${
                      q.unread ? "text-white/90" : "text-white/60"
                    }`}
                  >
                    {q.subject}
                  </p>
                  <p className="mt-1 text-[0.7rem] text-white/35 truncate">{q.preview}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Result */}
          <div className="col-span-5 hidden lg:flex flex-col">
            <div className="flex items-center gap-1 px-4 h-11 border-b border-white/10">
              {[RotateCw, Download, Archive, Trash2].map((Icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-white/55 transition-colors"
                  aria-hidden
                  tabIndex={-1}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
              <button
                type="button"
                className="ml-auto w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-white/55"
                aria-hidden
                tabIndex={-1}
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <h3 className="text-sm font-semibold">Has the built-up area increased?</h3>

              <div className="mt-3 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#0B2551] flex items-center justify-center text-[0.6rem] font-bold shrink-0">
                  SQ
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium">SatQuery</p>
                  <p className="text-[0.65rem] text-white/40">
                    Kharagpur T1/T2 · 9:41 AM
                  </p>
                </div>
                <span className="text-[0.6rem] px-2 py-0.5 rounded-full border border-white/10 text-white/50 shrink-0">
                  change_vqa
                </span>
              </div>

              {/* agent summary */}
              <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: "#A4F4FD" }} />
                  <span className="text-[0.65rem] font-semibold text-white/80">
                    Summary by SatQuery
                  </span>
                </div>
                <p className="mt-2 text-[0.72rem] leading-[1.55] text-white/60">
                  Built-up area increased {u.builtUpDeltaPct}%, from {u.builtUpT1Km2} km² to{" "}
                  {u.builtUpT2Km2} km². Expansion concentrated on the eastern edge.
                  Confidence 0.87. Evidence attached.
                </p>
              </div>

              <div className="mt-5 space-y-3 text-[0.75rem] leading-[1.6] text-white/70">
                <p>Analysis complete.</p>
                <p>
                  The two acquisitions were validated as a co-registered bi-temporal pair
                  at 10 m ground sample distance, then routed to the change specialist and
                  a change-VQA head.
                </p>
                <p>
                  {u.newBuiltUpKm2} km² of previously vegetated and bare land was converted
                  to built-up, with smaller infill inside the existing core.{" "}
                  {u.vegetationLossKm2} km² of vegetation was lost and the reservoir
                  drew down by {u.waterLossKm2} km².
                </p>
                <p className="text-white/50">— Execution trace attached</p>
              </div>

              <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
                <Paperclip className="w-3.5 h-3.5 text-white/45" />
                <span className="text-[0.7rem] text-white/70">change-map-2025-09.geojson</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
