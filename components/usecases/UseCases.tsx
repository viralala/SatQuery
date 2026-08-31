"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { USE_CASES } from "@/lib/data/content";
import { SectionEyebrow } from "@/components/ui/primitives";

/**
 * Applications as a horizontal reel. Each panel pairs a scene with the kind of
 * question that domain actually asks of it.
 */
export function UseCases() {
  const scroller = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 12);
    setAtEnd(el.scrollLeft + el.clientWidth > el.scrollWidth - 12);
  };

  const page = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 700), behavior: "smooth" });
  };

  return (
    <section
      id="applications"
      className="relative z-10 py-20 md:py-28 border-t border-white/10 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionEyebrow label="Applications" tag="Seven domains" />
            <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.02]">
              Seven domains.
              <br />
              One interface.
            </h2>
          </div>

          <div className="flex items-center gap-5">
            <p className="hidden max-w-[30ch] text-xs leading-snug text-white/40 sm:block">
              Each of these is a real question asked of satellite imagery today.
            </p>
            <div className="flex gap-2">
              {([-1, 1] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => page(d)}
                  disabled={d === -1 ? atStart : atEnd}
                  aria-label={d === -1 ? "Previous applications" : "Next applications"}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:bg-white/5 hover:text-white disabled:cursor-default disabled:opacity-25"
                >
                  {d === -1 ? (
                    <ChevronLeft className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        onScroll={onScroll}
        tabIndex={0}
        aria-label="Application domains, horizontally scrollable"
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        style={{
          scrollbarWidth: "none",
          // Start the reel on the container's left edge, then let it bleed right.
          paddingInline: "max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))",
          scrollPaddingInline: "max(1.5rem, calc((100vw - 72rem) / 2 + 1.5rem))",
        }}
      >
        {USE_CASES.map((u) => (
          <article
            key={u.id}
            className="liquid-glass group relative w-[78vw] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[46vw] lg:w-[26vw] lg:max-w-[380px]"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src={u.image}
                alt={`Synthetic satellite scene representing ${u.domain.toLowerCase()}`}
                fill
                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 380px"
                className="object-cover transition-transform duration-[1100ms] group-hover:scale-[1.05]"
                style={{ transitionTimingFunction: "var(--ease-out-soft)" }}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(12,12,12,0.35) 0%, rgba(12,12,12,0.05) 28%, rgba(12,12,12,0.88) 76%, rgba(12,12,12,0.96) 100%)",
                }}
              />

              <span className="absolute left-5 top-5 text-[0.65rem] font-semibold uppercase tracking-widest text-white/70">
                {u.domain}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-sm md:text-base leading-[1.45] text-white">
                  &ldquo;{u.query}&rdquo;
                </p>
                <div
                  className="mt-3 h-px w-full origin-left transition-transform duration-500 group-hover:scale-x-100"
                  style={{ background: "rgba(0,210,255,0.6)", transform: "scaleX(0.14)" }}
                  aria-hidden
                />
                <p className="mt-3 text-xs leading-snug text-white/40">{u.note}</p>
              </div>
            </div>
          </article>
        ))}
        <span className="w-2 shrink-0" aria-hidden />
      </div>
    </section>
  );
}
