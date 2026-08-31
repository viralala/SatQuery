"use client";

import Link from "next/link";
import { CircleUser, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/data/content";
import { BrandButton, LogoMark } from "@/components/ui/primitives";

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="relative z-40">
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        aria-label="Primary"
        className="max-w-6xl mx-auto px-6 pt-6 flex items-center justify-between"
      >
        <Link href="/#top" aria-label="SatQuery AI, home" className="text-white">
          <LogoMark />
        </Link>

        <div className="hidden md:flex gap-8">
          {NAV_LINKS.map((l, i) => (
            <motion.a
              key={l.href}
              href={l.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: "easeOut" }}
              className="text-white/70 text-sm font-medium hover:text-white transition-colors"
            >
              {l.label}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/workspace"
            aria-label="Workspace"
            className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-white/25 hover:text-white"
          >
            <CircleUser className="w-4 h-4" />
          </Link>
          <div className="hidden md:block">
            <BrandButton />
          </div>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white"
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile sheet */}
      <div
        className="md:hidden overflow-hidden transition-all duration-500"
        style={{ maxHeight: open ? 420 : 0, opacity: open ? 1 : 0 }}
      >
        <div className="max-w-6xl mx-auto px-6 pt-4">
          <div className="liquid-glass rounded-2xl p-4">
            <ul className="flex flex-col">
              {[...NAV_LINKS, { label: "Workspace", href: "/workspace" }].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[52px] items-center border-b border-white/10 text-white/80 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <BrandButton full />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
