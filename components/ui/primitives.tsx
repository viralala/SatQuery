"use client";

import Link from "next/link";
import { ChevronRight, Satellite } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/lib/hooks/useInView";

/* ------------------------------------------------------------------- mark */
/** Abstract four-quadrant curve mark. */
export function LogoMark({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" className={className} fill="currentColor" aria-hidden>
      <path d="M 0 128 C 70.692 128 128 185.308 128 256 L 64 256 C 64 220.654 35.346 192 0 192 Z M 256 192 C 220.654 192 192 220.654 192 256 L 128 256 C 128 185.308 185.308 128 256 128 Z M 128 0 C 128 70.692 70.692 128 0 128 L 0 64 C 35.346 64 64 35.346 64 0 Z M 192 0 C 192 35.346 220.654 64 256 64 L 256 128 C 185.308 128 128 70.692 128 0 Z" />
    </svg>
  );
}

/* ----------------------------------------------------------------- button */
/** White pill CTA: mark, label, chevron that nudges on hover. */
export function BrandButton({
  label = "Explore SatQuery",
  href = "#demo",
  full = false,
}: {
  label?: string;
  href?: string;
  full?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-medium text-sm px-5 py-3 transition-all hover:bg-white/90 active:scale-[0.98] ${
        full ? "w-full" : ""
      }`}
    >
      <Satellite className="w-4 h-4" strokeWidth={2} />
      <span>{label}</span>
      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-[1px]" />
    </Link>
  );
}

export function GhostButton({
  label,
  href,
  icon = true,
}: {
  label: string;
  href: string;
  icon?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 text-white text-sm font-medium px-5 py-3 transition-all hover:bg-white/5"
    >
      <span>{label}</span>
      {icon && (
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-[1px]" />
      )}
    </Link>
  );
}

/* ---------------------------------------------------------------- eyebrow */
export function SectionEyebrow({
  label,
  tag,
  className = "",
}: {
  label: string;
  tag?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 text-xs ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-white" aria-hidden />
      <span className="text-white/70 font-medium tracking-wide">{label}</span>
      {tag && (
        <span className="px-2 py-0.5 rounded-full border border-white/10 text-white/50">
          {tag}
        </span>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- gradient */
/** Shiny gradient fill used on the emphasised half of a headline. */
export const gradientStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(to right, #091020 0%, #0B2551 12.5%, #A4F4FD 32.5%, #00d2ff 50%, #0B2551 67.5%, #091020 87.5%, #091020 100%)",
  backgroundSize: "200% auto",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
  filter: "url(#c3-noise)",
};

/* ----------------------------------------------------------------- reveal */
/** Scroll-triggered entrance using transform and opacity only. */
export function Reveal({
  children,
  delay = 0,
  y = 20,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : `translate3d(0, ${y}px, 0)`,
        transition: `opacity 700ms var(--ease-out-soft) ${delay}ms, transform 700ms var(--ease-out-soft) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* --------------------------------------------------------------- headings */
export function SectionTitle({
  lines,
  className = "",
  size = "lg",
}: {
  lines: ReactNode[];
  className?: string;
  size?: "lg" | "md";
}) {
  const scale =
    size === "lg"
      ? "text-4xl md:text-6xl"
      : "text-3xl md:text-5xl";
  return (
    <h2 className={`${scale} font-semibold tracking-tight leading-[1.02] ${className}`}>
      {lines.map((l, i) => (
        <span key={i} className="block">
          {l}
        </span>
      ))}
    </h2>
  );
}

export function Lede({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-white/60 text-base leading-[1.6] max-w-md ${className}`}>{children}</p>
  );
}

/* ------------------------------------------------------------------ shell */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`max-w-6xl mx-auto px-6 ${className}`}>{children}</div>;
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative z-10 scroll-mt-24 py-20 md:py-28 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/* ------------------------------------------------------------------- chip */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs text-white/70 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03]">
      {children}
    </span>
  );
}
