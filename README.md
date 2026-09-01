<div align="center">

# 🛰️ SatQuery AI

### *Ask Earth. Get Intelligence.*

**An Interactive Vision-Language Assistant for Multimodal Remote Sensing Image Analysis through Text Queries**

[![Smart India Hackathon](https://img.shields.io/badge/SIH-2026-orange?style=for-the-badge)](https://sih.gov.in)
[![Problem Statement](https://img.shields.io/badge/PS-26167-blue?style=for-the-badge)]()
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red?style=for-the-badge)](./LICENSE)

*Built for ISRO / Department of Space*

</div>

<br>

```
                    .
                   .:.
                  .:::.
        .        .:::::.        .
         `.    .:::::::::.    .`
           `.:::::::::::::.:`
      ┌───────────────────────────┐
     ╱│        SATQUERY AI        │╲
    ╱ │  ┌───┐           ┌───┐    │ ╲
   ▕──┤  │ ▢ │═══════════│ ▢ │    ├──▏
    ╲ │  └───┘    ◈◈◈    └───┘    │ ╱
     ╲│        ▲──┴──▲           │╱
      └────────┤ ●●● ├───────────┘
               ▲└─────┘▲
              ╱         ╲
             ╱           ╲
        · ·           · ·
      ·                     ·
                ⟶ orbit · scan · answer ⟶
```

<br>

## 📡 What is SatQuery?

Remote-sensing AI today ships as **isolated single-task tools**. To get an answer, an analyst needs to know which sensor they're looking at, which model fits the question, how to pre-process the imagery, and how to read the raster that comes back — a specialist's job that takes roughly a day per scene.

**SatQuery replaces that with a question.** Give it an image — or an optical–SAR pair, or two dates of the same ground — and ask in plain language. An orchestrating agent classifies the task, validates that the inputs can actually support it, selects the right specialist models from a registry, runs them, and returns an answer **bound to visual evidence**, with a confidence score and an auditable trace of exactly what ran.

> **The novelty isn't the language model. It's that the query decides the pipeline.**

> [!NOTE]
> This repository is a **product showcase** built for SIH judging. The site communicates the intended product story (ask → analyze → explain); the AI inference backend is not implemented here, and every analysis result shown is pre-computed to illustrate intended behaviour. Nothing in the UI claims to be a live model. See [Honesty Notes](#-honesty-notes).

<br>

## 🧭 Table of Contents

| Section | Description |
| --- | --- |
| [What is SatQuery?](#-what-is-satquery) | Elevator pitch and scope |
| [Problem → Capability Mapping](#-problem--capability-mapping) | How the site maps to the SIH mandate |
| [System Architecture](#-system-architecture) | Query pipeline and site structure |
| [Pages](#-pages) | Route map |
| [Tech Stack](#-tech-stack) | Frameworks and libraries |
| [Design System](#-design-system) | Visual language |
| [Synthetic Imagery Pipeline](#-synthetic-imagery-pipeline) | How the optical/SAR scenes are generated |
| [Getting Started](#-getting-started) | Local setup |
| [Authentication](#-authentication) | Google sign-in |
| [Project Structure](#-project-structure) | Directory layout |
| [Honesty Notes](#-honesty-notes) | What's real vs. illustrative |
| [Team](#-built-by) | Credits |
| [License](#-license) | Usage terms |

<br>

## 🎯 Problem → Capability Mapping

| PS 26167 Requirement | How SatQuery Addresses It |
| --- | --- |
| Remote-sensing domain adaptation | LoRA adapters on a small VLM backbone; RS encoders (RemoteCLIP / GeoChat-class) |
| Single-image VQA *(mandatory)* | Task Family 1 — the baseline every query path falls back to |
| Additional single-image task | Captioning / scene description **and** text-guided grounding |
| Multi-image change analysis *(mandatory)* | Change VQA + spatial change map from a bi-temporal pair |
| Cross-modal pair analysis | Optical–SAR joint extraction with co-registration validation |
| Agentic orchestration | Controller: classify → validate → plan tools → bind parameters → fuse |
| Auditable execution summary | Every response carries `{ task, tools, params, confidence }` |
| Interactive GUI / web application | This showcase + the workspace mockup of the intended full product |
| Visual evidence + confidence | Masks, bounding boxes and area statistics attached to every answer |
| Downloadable reports | PDF + GeoJSON export *(intended production build)* |

<br>

## 🏗️ System Architecture

### Intended query pipeline

```
┌──────────────┐     ┌───────────────────┐     ┌──────────────────┐
│   USER QUERY  │ ──▶ │  TASK CLASSIFIER   │ ──▶ │  INPUT VALIDATOR  │
│ "Has this      │     │  VQA · Change ·    │     │  sensor match ·   │
│  area flooded?"│     │  Caption · Ground  │     │  co-registration  │
└──────────────┘     └───────────────────┘     └────────┬──────────┘
                                                          │
        ┌─────────────────────────────────────────────────┘
        ▼
┌──────────────────┐     ┌───────────────────┐     ┌──────────────────┐
│   TOOL PLANNER     │ ──▶ │  MODEL REGISTRY     │ ──▶ │  FUSION + EVIDENCE │
│  picks specialist   │     │  VQA · Change ·      │     │  binds answer to    │
│  models for the task│     │  SAR-optical · Ground│     │  mask / box / score │
└──────────────────┘     └───────────────────┘     └────────┬──────────┘
                                                              │
                                                              ▼
                                                 ┌───────────────────────┐
                                                 │   GROUNDED RESPONSE     │
                                                 │  answer + confidence +  │
                                                 │  auditable trace        │
                                                 └───────────────────────┘
```

Only the **observable trace** is exposed end-to-end — no chain-of-thought — matching the auditability requirement in the problem statement.

### Site composition

```
Backdrop (video/noise) ─┬─ Navigation + Hero
                          ├─ Problem → Reveal (query collapses complexity)
                          ├─ Agent Pipeline + Task Routing
                          ├─ Multimodal (Optical ⇄ SAR) + Temporal (bi-date slider)
                          ├─ Evidence anatomy (grounded response breakdown)
                          ├─ Capabilities accordion
                          ├─ Interactive Demo (pre-computed scenarios)
                          ├─ Workspace mockup (macOS-style app chrome)
                          ├─ Audiences + Use-case reel
                          ├─ Pricing / Deployment tiers
                          └─ CTA + Footer
```

<br>

## 🗺️ Pages

| Route | What it is |
| --- | --- |
| `/` | The product showcase — story, capabilities, interactive demo, deployment tiers |
| `/business` | Market sizing, unit economics, scaling, government alignment, roadmap |
| `/workspace` | Google-gated account area; shows a setup panel until OAuth is configured |

`DEPLOY.md` covers pushing to GitHub, deploying to Vercel, and enabling Google sign-in. `docs/judge-brief.md` has the demo script and anticipated questions.

<br>

## 🧰 Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | **Next.js 15** (App Router) |
| UI Library | **React 19** + **TypeScript** |
| Styling | **Tailwind CSS v4** — design tokens in `app/globals.css` under `@theme` |
| Motion | **motion** (Framer Motion v12) — entrance and scroll animation |
| Icons | **lucide-react** |
| Auth | **Auth.js v5** (Google OAuth, conditional) |
| Typeface | **Inter** (400–900) via Google Fonts |
| Imagery pipeline | **Python** — `numpy`, `opencv-python`, `Pillow` |
| Screenshot tooling | **Playwright** |
| Hosting | **Vercel** |

<br>

## 🎨 Design System

Dark cinematic treatment on a `#0c0c0c` ground:

| Element | Where |
| --- | --- |
| Fixed looping background video + still fallback | `components/chrome/Backdrop.tsx` |
| Vertical guide rules at the 36rem container edges | `components/chrome/Backdrop.tsx` |
| `c3-noise` SVG grain filters | `Backdrop.tsx` (root) and `scopes/InputScopes.tsx` (watermark) |
| `.liquid-glass` card treatment | `app/globals.css` |
| Shiny gradient headline (`.animate-shiny`) | `app/globals.css` + `gradientStyle` in `ui/primitives.tsx` |
| Cinematic scope cards + watermark (`.c3-*`) | `app/globals.css` |

**Accent palette**

| Swatch | Hex | Used for |
| --- | --- | --- |
| 🔵 Cyan | `#00d2ff` | Instrument and SAR cues |
| 🧊 Ice | `#A4F4FD` | Instrument and SAR cues |
| 🟠 Amber | `#f59e0b` | Change and evidence |
| 🟢 Green | `#10b981` | Vegetation |

The background video streams from an external CloudFront URL. One of the generated SAR scenes sits behind it as a still fallback, so the page still reads correctly if that request is slow or blocked.

<br>

## 🛰️ Synthetic Imagery Pipeline

All satellite imagery is **procedurally generated**, not stock photography. `scripts/build_imagery.py` builds a land-cover label map for each scene and renders two products from it:

| Product | Method |
| --- | --- |
| **Optical** composite | Sentinel-2 TCI-like per-class colour endpoints, terrain shading, atmospheric scatter, sensor point-spread blur |
| **SAR** amplitude image | Per-class σ⁰ backscatter in dB (water ≈ −22 dB, built-up ≈ −1 dB with a double-bounce term) with Gamma-distributed speckle |

Because both products come from the same label map, bi-temporal pairs have **real, measurable change**. The script derives change masks, connected-component region boxes and area statistics from those labels and writes them to `lib/data/generated.json` — so the figures quoted in the UI match the pixels they describe.

```bash
python scripts/build_imagery.py
```

Requires `numpy`, `opencv-python`, `Pillow`.

<br>

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Then open **http://localhost:3000**. `npm run build` produces a fully static export of the site.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint the codebase |

<br>

## 🔐 Authentication

Google sign-in is wired with **Auth.js v5** but **conditional**: if `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` and `AUTH_SECRET` are absent, the provider list is empty and `/workspace` renders a setup panel instead. The site builds, deploys and renders correctly with **no credentials set** — a showcase should never 500 because an OAuth app hasn't been registered yet. See `.env.example`.

<br>

## 📁 Project Structure

```
app/                     layout, globals.css, page composition
components/
  chrome/                background video, guide lines, noise filters
  navigation/  hero/     nav bar and hero
  mockup/                macOS menu bar + SatQuery workspace mockup
  problem/  reveal/      the problem, and the query-to-pipeline reveal
  agent/  routing/       agent pipeline and task routing
  multimodal/ temporal/  optical-SAR switcher, bi-temporal slider
  evidence/              anatomy of a grounded response
  capabilities/          functional scope accordion
  logos/  usecases/      benchmark cloud, application reel
  demo/                  interactive scenario demo
  why/  audiences/       workflow comparison, who it is for
  scopes/                the three defined input configurations
  technical/  cta/  footer/
lib/
  data/content.ts        narrative copy, sourced from the problem statement
  data/scenarios.ts      demo scenarios
  data/generated.json    figures measured from the generated imagery
  hooks/                 useInView, useReducedMotion, useSequence
scripts/                 imagery generator and screenshot tooling
public/imagery/          generated scenes, masks and overlays
```

<br>

## ✅ Honesty Notes

This is a prototype showcase, and it says so where it matters:

- Imagery is labelled **synthetic reference data**.
- Demo results are labelled **pre-computed**, not production predictions.
- The "Built for" section describes operational roles and the questions they ask — it contains **no testimonials** and no endorsements from real people or organisations.
- On `/business`, every figure carries a basis tag: **published target** (government policy or agency statement), **project target** (from the team's own submission), or **team estimate** (a modelling assumption, not a forecast). Verify published figures against their primary source before citing them — policy targets get revised.

<br>

## 💙 Built By

<div align="center">

### **Team TMS<3**

*Smart India Hackathon 2026 · Problem Statement 26167*

**Built with orbit-level ambition and ground-level care.**

</div>

<br>

## 📜 License

This project is **proprietary and confidential**.

**© 2026 Team TMS<3. All Rights Reserved.**

No part of this repository — code, design, documentation, or generated assets — may be copied, modified, distributed, or reused in any form without **explicit written permission** from Team TMS<3. See [`LICENSE`](./LICENSE) for full terms.

<div align="center">

<br>

`⟡ ask → analyze → explain ⟡`

</div>
