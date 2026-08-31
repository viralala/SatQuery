"use client";

import { motion } from "motion/react";
import { Search } from "lucide-react";
import { LogoMark } from "@/components/ui/primitives";

const MENUS = ["File", "Edit", "View", "Analysis", "Window", "Help"];

/** Desktop-class application chrome, framing the console below it. */
export function MenuBar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
      className="relative z-10 h-10 bg-black/40 backdrop-blur-md border-t border-b border-white/10"
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <LogoMark className="w-3.5 h-3.5 text-white" />
          <span className="font-bold text-white">SatQuery</span>
          {MENUS.map((m, i) => (
            <span
              key={m}
              className={`text-white/60 ${i > 2 ? "hidden sm:inline" : ""} ${
                i > 3 ? "hidden md:inline" : ""
              }`}
            >
              {m}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-white/60">
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Wed Sep 24 · 09:41 IST</span>
        </div>
      </div>
    </motion.div>
  );
}
