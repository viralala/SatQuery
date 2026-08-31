"use client";

import { useState } from "react";

/**
 * The three defined input configurations from the problem statement, rendered
 * in the cinematic card treatment. The toggle switches each card between the
 * tasks a configuration supports and the outputs it returns.
 */
const SCOPES = [
  {
    tier: "Input scope",
    name: "Single image",
    desc: "One optical, multispectral or SAR observation. The mandatory baseline every solution must demonstrate.",
    tasks: [
      "Visual question answering",
      "Captioning and scene description",
      "Text-guided region grounding",
      "Land-cover composition",
      "GeoTIFF, TIFF, PNG and JPEG inputs",
    ],
    outputs: [
      "Natural-language answer",
      "Region box or mask overlay",
      "Class composition statistics",
      "Confidence estimate",
      "Execution trace",
    ],
  },
  {
    tier: "Input scope",
    name: "Cross-modal pair",
    desc: "Co-registered optical/multispectral and SAR imagery of the same ground, read together.",
    tasks: [
      "Joint information extraction",
      "Built-up identification under haze",
      "Water boundary delineation",
      "Structure confirmed by backscatter",
      "Co-registration validation",
    ],
    outputs: [
      "Fused class map",
      "Per-class area in km²",
      "Modality agreement check",
      "Confidence estimate",
      "Execution trace",
    ],
  },
  {
    tier: "Input scope",
    name: "Bi-temporal pair",
    desc: "Two spatially corresponding images acquired at different dates — the principal focus of the system.",
    tasks: [
      "Change detection and description",
      "Change-based visual question answering",
      "Spatial change map generation",
      "Built-up and water area deltas",
      "Acquisition-date validation",
    ],
    outputs: [
      "Change map overlay",
      "Changed-region geometry",
      "Before/after area statistics",
      "Confidence estimate",
      "Execution trace",
    ],
    featured: true,
  },
];

function Check() {
  return (
    <span className="c3-check">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M20 6L9 17l-5-5"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function InputScopes() {
  const [outputs, setOutputs] = useState(false);

  return (
    <section id="scopes" className="c3-scope-section relative z-10 scroll-mt-24">
      <svg className="absolute w-0 h-0" aria-hidden focusable="false">
        <filter id="c3-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.5"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.075" />
          </feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" result="noise" />
          <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
        </filter>
      </svg>

      <div className="c3-watermark-container">
        <div className="c3-watermark-main">
          <span className="c3-watermark-line-1">Ask Earth.</span>
          <span className="c3-watermark-line-2">Get intelligence</span>
        </div>
      </div>

      <div className="c3-grid">
        {SCOPES.map((s) => (
          <article key={s.name} className={`c3-card ${s.featured ? "c3-card-pro" : ""}`}>
            <p className="c3-tier-small">{s.tier}</p>
            <h3 className="c3-tier-large">{s.name}</h3>
            <p className="c3-desc">{s.desc}</p>
            <ul className="c3-list">
              {(outputs ? s.outputs : s.tasks).map((item) => (
                <li key={item}>
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a href="#demo" className="c3-btn" style={{ textDecoration: "none" }}>
              Run in demo
            </a>
          </article>
        ))}
      </div>

      <div className="c3-toggle-wrap">
        <span className="text-sm text-white/70">Show outputs</span>
        <button
          type="button"
          role="switch"
          aria-checked={outputs}
          aria-label="Show outputs instead of supported tasks"
          onClick={() => setOutputs((v) => !v)}
          className={`c3-toggle ${outputs ? "active" : ""}`}
        >
          <span className="c3-toggle-knob" />
        </button>
      </div>
    </section>
  );
}
