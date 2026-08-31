# SatQuery AI — product showcase

Prototype marketing/showcase site for **SIH 2026 problem statement 26167** —
*SatQuery AI: An Interactive Vision-Language Assistant for Multimodal Remote
Sensing Image Analysis through Text Queries* (ISRO / Department of Space).

The site communicates the product story — **ask → analyze → explain** — to
judges, mentors and technical evaluators. The AI backend is not implemented;
every analysis result shown is pre-computed to illustrate intended behaviour.

## Pages

| Route | What it is |
| --- | --- |
| `/` | The product showcase — story, capabilities, interactive demo, deployment tiers |
| `/business` | Market sizing, unit economics, scaling, government alignment, roadmap |
| `/workspace` | Google-gated account area; shows a setup panel until OAuth is configured |

`DEPLOY.md` covers pushing to GitHub, deploying to Vercel, and enabling Google
sign-in. `docs/judge-brief.md` has the demo script and anticipated questions.

## Run it

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>. `npm run build` produces a fully static
export of the single page.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — design tokens live in `app/globals.css` under `@theme`
- **motion** (Framer Motion v12) for entrance and scroll animation
- **lucide-react** for iconography
- **Inter** (400–900) via Google Fonts

## Design system

Dark cinematic treatment on a `#0c0c0c` ground:

| Element | Where |
| --- | --- |
| Fixed looping background video + still fallback | `components/chrome/Backdrop.tsx` |
| Vertical guide rules at the 36rem container edges | `components/chrome/Backdrop.tsx` |
| `c3-noise` SVG grain filters | `Backdrop.tsx` (root) and `scopes/InputScopes.tsx` (watermark) |
| `.liquid-glass` card treatment | `app/globals.css` |
| Shiny gradient headline (`.animate-shiny`) | `app/globals.css` + `gradientStyle` in `ui/primitives.tsx` |
| Cinematic scope cards + watermark (`.c3-*`) | `app/globals.css` |

Accent palette: cyan `#00d2ff` / ice `#A4F4FD` for instrument and SAR cues,
amber `#f59e0b` for change and evidence, green `#10b981` for vegetation.

The background video is loaded from an external CloudFront URL. One of the
generated SAR scenes sits behind it as a still fallback, so the page still
reads correctly if that request is slow or blocked.

## Structure

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

## Imagery

All satellite imagery is **procedurally generated**, not stock photography.
`scripts/build_imagery.py` builds a land-cover label map for each scene and
renders two products from it:

- an **optical** composite using Sentinel-2 TCI-like per-class colour endpoints,
  terrain shading, atmospheric scatter and a sensor point-spread blur;
- a **SAR** amplitude image from per-class σ⁰ backscatter in dB (water ≈ −22 dB,
  built-up ≈ −1 dB with a double-bounce term), with Gamma-distributed speckle.

Because both products come from the same label map, the bi-temporal pairs have
real, measurable change. The script derives change masks, connected-component
region boxes and area statistics from those labels and writes them to
`lib/data/generated.json` — so the figures quoted in the UI match the pixels
they describe.

Regenerate with:

```bash
python scripts/build_imagery.py
```

Requires `numpy`, `opencv-python` and `Pillow`.

## Screenshots

`scripts/screenshot.mjs` captures per-section screenshots for design review:

```bash
node scripts/screenshot.mjs ./shots 1440 900
```

Requires the dev server running and `npx playwright install chromium`.

## Authentication

Google sign-in is wired with Auth.js v5 but **conditional**: if
`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` and `AUTH_SECRET` are absent, the
provider list is empty and `/workspace` renders a setup panel. The site builds,
deploys and renders correctly with no credentials set — a showcase should never
500 because an OAuth app has not been registered yet. See `.env.example`.

## Honesty notes

The site is a prototype showcase and says so where it matters:

- imagery is labelled synthetic reference data;
- demo results are labelled pre-computed, not production predictions;
- the "Built for" section describes operational roles and the questions they
  ask — it contains no testimonials and no endorsements from real people or
  organisations;
- on `/business`, every figure carries a basis tag: **published target**
  (government policy or agency statement), **project target** (from the team's
  own submission), or **team estimate** (a modelling assumption, not a forecast).
  Verify the published figures against their primary source before citing them —
  policy targets get revised.
