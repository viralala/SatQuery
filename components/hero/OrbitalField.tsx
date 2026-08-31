"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useInView";

type Marker = { u: number; v: number; phase: number; warm: boolean };

/**
 * Ambient geospatial motion for the hero: a drifting graticule, two orbital
 * arcs, and a handful of tracked ground markers. Deliberately quiet — it sits
 * under the headline and must never compete with it.
 *
 * Pauses when the tab is hidden and renders a single static frame when the
 * user prefers reduced motion.
 */
export function OrbitalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const markers: Marker[] = [
      { u: 0.19, v: 0.36, phase: 0.0, warm: true },
      { u: 0.71, v: 0.27, phase: 1.7, warm: false },
      { u: 0.84, v: 0.63, phase: 3.1, warm: true },
      { u: 0.42, v: 0.72, phase: 4.4, warm: false },
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /** Meridians and parallels of a globe whose centre sits off the right edge. */
    const graticule = (t: number) => {
      const cx = w * 1.06;
      const cy = h * 0.52;
      const r = Math.max(w, h) * 0.82;
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.055)";
      ctx.lineWidth = 1;
      for (let i = -5; i <= 5; i++) {
        const lat = (i / 6) * (Math.PI / 2);
        const rr = r * Math.cos(lat);
        const yy = cy + r * Math.sin(lat) * 0.62;
        ctx.beginPath();
        ctx.ellipse(cx, yy, rr, rr * 0.13, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + t * 0.028;
        const squash = Math.cos(a);
        if (squash < 0.02) continue;
        ctx.globalAlpha = Math.min(1, squash * 1.5);
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * squash, r * 0.62, 0, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }
      ctx.restore();
    };

    /** Two inclined orbits with a satellite riding each one. */
    const orbits = (t: number) => {
      const cx = w * 1.06;
      const cy = h * 0.52;
      const specs = [
        { r: Math.max(w, h) * 0.95, tilt: -0.42, speed: 0.075, warm: true },
        { r: Math.max(w, h) * 1.16, tilt: 0.3, speed: -0.052, warm: false },
      ];
      for (const s of specs) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(s.tilt);
        ctx.strokeStyle = s.warm
          ? "rgba(232,163,61,0.16)"
          : "rgba(127,180,214,0.14)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, s.r, s.r * 0.34, 0, 0, Math.PI * 2);
        ctx.stroke();

        const a = t * s.speed;
        const px = Math.cos(a) * s.r;
        const py = Math.sin(a) * s.r * 0.34;
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 26);
        const c = s.warm ? "232,163,61" : "127,180,214";
        glow.addColorStop(0, `rgba(${c},0.75)`);
        glow.addColorStop(1, `rgba(${c},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = s.warm ? "#f0b75e" : "#a9d0e6";
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    /** Ground markers: a crosshair plus an expanding acquisition ring. */
    const tracked = (t: number) => {
      for (const m of markers) {
        const x = m.u * w;
        const y = m.v * h;
        const cyc = (t * 0.42 + m.phase) % 4.2;
        const c = m.warm ? "232,163,61" : "127,180,214";

        if (cyc < 2.2) {
          const p = cyc / 2.2;
          ctx.strokeStyle = `rgba(${c},${(1 - p) * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, 6 + p * 30, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.strokeStyle = `rgba(${c},0.55)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 7, y);
        ctx.lineTo(x - 2.5, y);
        ctx.moveTo(x + 2.5, y);
        ctx.lineTo(x + 7, y);
        ctx.moveTo(x, y - 7);
        ctx.lineTo(x, y - 2.5);
        ctx.moveTo(x, y + 2.5);
        ctx.lineTo(x, y + 7);
        ctx.stroke();
        ctx.fillStyle = `rgba(${c},0.9)`;
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      graticule(t);
      orbits(t);
      tracked(t);
    };

    let start = performance.now();
    const loop = (now: number) => {
      draw((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };

    const stop = () => cancelAnimationFrame(raf);
    const play = () => {
      stop();
      start = performance.now() - 3200; // begin mid-cycle, never from empty
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => (document.hidden ? stop() : play());
    const onResize = () => {
      resize();
      if (reduced) draw(3.2);
    };

    resize();
    if (reduced) {
      draw(3.2);
    } else {
      play();
      document.addEventListener("visibilitychange", onVisibility);
    }
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
