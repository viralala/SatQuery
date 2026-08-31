import generated from "./generated.json";

/**
 * Mock scenarios for the in-page demo.
 *
 * Areas, percentages and evidence boxes are measured from the synthetic
 * scenes in /public/imagery by scripts/build.py, so what the demo reports
 * matches the pixels it displays. These are illustrative of the intended
 * product behaviour — not production model predictions.
 */

export type EvidenceBox = { x: number; y: number; w: number; h: number; area: number };

export type TraceStage = {
  stage: string;
  detail: string;
  /** Rough share of the run, used only to pace the animation. */
  weight: number;
};

export type Finding = {
  label: string;
  value: string;
  tone: "signal" | "ice" | "verd" | "neutral";
};

export type Scenario = {
  id: string;
  name: string;
  kicker: string;
  query: string;
  task: string;
  inputs: { label: string; meta: string }[];
  /** Frames shown in the viewer, in order. */
  frames: { id: string; label: string; src: string; caption: string }[];
  overlay: { src: string; label: string } | null;
  boxes: EvidenceBox[];
  trace: TraceStage[];
  tools: string[];
  params: Record<string, string>;
  findings: Finding[];
  answer: string;
  confidence: number;
};

const u = generated.urbanChange;
const c = generated.crossModal;
const w = generated.waterChange;
const s = generated.single;

export const SCENARIOS: Scenario[] = [
  {
    id: "urban-expansion",
    name: "Urban Expansion",
    kicker: "Bi-temporal · optical",
    query: "Has the built-up area increased, decreased, or remained unchanged?",
    task: "change_vqa",
    inputs: [
      { label: "T1 · 2025-06-14", meta: "Optical · 10 m GSD" },
      { label: "T2 · 2025-09-21", meta: "Optical · 10 m GSD" },
    ],
    frames: [
      { id: "t1", label: "JUNE 2025", src: "/imagery/urban-t1.webp", caption: "Baseline acquisition" },
      { id: "t2", label: "SEPTEMBER 2025", src: "/imagery/urban-t2.webp", caption: "Later acquisition" },
    ],
    overlay: { src: "/imagery/urban-change-mask.png", label: "CHANGE MAP" },
    boxes: u.builtRegions,
    trace: [
      { stage: "UNDERSTAND", detail: "Query classified as change VQA", weight: 1 },
      { stage: "VALIDATE", detail: "Pair co-registered · dates differ · 10 m GSD", weight: 1.2 },
      { stage: "SELECT", detail: "change_net → change_vqa", weight: 0.9 },
      { stage: "ANALYZE", detail: "Bi-temporal difference and class transition", weight: 2.1 },
      { stage: "FUSE", detail: "Change map merged with area statistics", weight: 1.1 },
      { stage: "VERIFY", detail: "Tool agreement checked · confidence estimated", weight: 1 },
      { stage: "EXPLAIN", detail: "Answer bound to change regions", weight: 0.8 },
    ],
    tools: ["input_validator", "change_net", "change_vqa", "area_statistics"],
    params: { threshold: "0.50", gsd: "10 m", "min-region": "0.26 km²" },
    findings: [
      { label: "BUILT-UP EXPANSION", value: `+${u.builtUpDeltaPct}%`, tone: "signal" },
      { label: "NEW BUILT-UP AREA", value: `${u.newBuiltUpKm2} km²`, tone: "signal" },
      { label: "VEGETATION LOSS", value: `${u.vegetationLossKm2} km²`, tone: "verd" },
      { label: "WATER CHANGE", value: `−${u.waterLossKm2} km²`, tone: "ice" },
    ],
    answer: `Built-up area increased. Between the two acquisitions the built-up class grew from ${u.builtUpT1Km2} km² to ${u.builtUpT2Km2} km², a rise of ${u.builtUpDeltaPct}%. The expansion is concentrated along the eastern edge of the settlement, where ${u.newBuiltUpKm2} km² of previously vegetated and bare land was converted, with smaller infill inside the existing core.`,
    confidence: 0.87,
  },
  {
    id: "multimodal",
    name: "Multimodal Analysis",
    kicker: "Cross-modal · optical + SAR",
    query: "Use the optical and SAR images together to identify built-up and water-covered regions.",
    task: "cross_modal_extraction",
    inputs: [
      { label: "Optical", meta: "Multispectral · 10 m GSD" },
      { label: "SAR", meta: "VV backscatter · co-registered" },
    ],
    frames: [
      { id: "optical", label: "OPTICAL", src: "/imagery/cross-optical.webp", caption: "Spectral and contextual information" },
      { id: "sar", label: "SAR", src: "/imagery/cross-sar.webp", caption: "Structural information, cloud-independent" },
    ],
    overlay: { src: "/imagery/cross-fusion.png", label: "FUSED CLASSES" },
    boxes: c.builtRegions,
    trace: [
      { stage: "UNDERSTAND", detail: "Query classified as cross-modal extraction", weight: 1 },
      { stage: "VALIDATE", detail: "Two modalities · co-registration confirmed", weight: 1.3 },
      { stage: "SELECT", detail: "optical_sar_fusion → grounding", weight: 0.9 },
      { stage: "ANALYZE", detail: "Spectral context joined to backscatter structure", weight: 2.2 },
      { stage: "FUSE", detail: "Class maps reconciled across modalities", weight: 1.2 },
      { stage: "VERIFY", detail: "Cross-modal agreement checked", weight: 1 },
      { stage: "EXPLAIN", detail: "Regions bound to both inputs", weight: 0.8 },
    ],
    tools: ["input_validator", "optical_sar_fusion", "region_grounding"],
    params: { polarisation: "VV", looks: "4", gsd: "10 m" },
    findings: [
      { label: "BUILT-UP EXTRACTED", value: `${c.builtUpKm2} km²`, tone: "signal" },
      { label: "WATER EXTRACTED", value: `${c.waterKm2} km²`, tone: "ice" },
      { label: "SCENE BUILT-UP", value: `${c.builtUpPct}%`, tone: "neutral" },
      { label: "SCENE WATER", value: `${c.waterPct}%`, tone: "neutral" },
    ],
    answer: `Built-up and water-covered regions were resolved from both inputs together. Built-up areas return high backscatter in SAR from double-bounce off structures, which separates them from the bare soil they resemble spectrally; water returns almost none, giving a sharp boundary where optical alone is ambiguous under haze. Combining the two yields ${c.builtUpKm2} km² of built-up (${c.builtUpPct}% of the scene) and ${c.waterKm2} km² of water (${c.waterPct}%).`,
    confidence: 0.91,
  },
  {
    id: "water",
    name: "Water Analysis",
    kicker: "Bi-temporal · flood extent",
    query: "Where did the water-covered region change between these two dates?",
    task: "change_vqa",
    inputs: [
      { label: "Pre-event", meta: "Optical · 10 m GSD" },
      { label: "Post-event", meta: "Optical · 10 m GSD" },
    ],
    frames: [
      { id: "pre", label: "PRE-EVENT", src: "/imagery/water-t1.webp", caption: "Normal channel extent" },
      { id: "post", label: "POST-EVENT", src: "/imagery/water-t2.webp", caption: "Inundated extent" },
    ],
    overlay: { src: "/imagery/water-change-mask.png", label: "NEW WATER" },
    boxes: w.regions,
    trace: [
      { stage: "UNDERSTAND", detail: "Query classified as change VQA with grounding", weight: 1 },
      { stage: "VALIDATE", detail: "Pair co-registered · acquisition dates differ", weight: 1.2 },
      { stage: "SELECT", detail: "change_net → water_index → change_vqa", weight: 1 },
      { stage: "ANALYZE", detail: "Water extent differenced across dates", weight: 2 },
      { stage: "FUSE", detail: "Extent mask merged with affected-area statistics", weight: 1.1 },
      { stage: "VERIFY", detail: "Boundary agreement checked", weight: 1 },
      { stage: "EXPLAIN", detail: "Answer bound to inundated regions", weight: 0.8 },
    ],
    tools: ["input_validator", "change_net", "water_index", "change_vqa"],
    params: { threshold: "0.45", gsd: "10 m", index: "NDWI-equivalent" },
    findings: [
      { label: "WATER EXPANSION", value: `+${w.waterDeltaPct}%`, tone: "ice" },
      { label: "NEW WATER AREA", value: `${w.newWaterKm2} km²`, tone: "ice" },
      { label: "PRE-EVENT EXTENT", value: `${w.waterT1Km2} km²`, tone: "neutral" },
      { label: "POST-EVENT EXTENT", value: `${w.waterT2Km2} km²`, tone: "neutral" },
    ],
    answer: `The water-covered region expanded substantially. Extent grew from ${w.waterT1Km2} km² to ${w.waterT2Km2} km², an increase of ${w.waterDeltaPct}%. The new water is contiguous with the existing channel and spreads south across low-lying agricultural land, with ${w.newWaterKm2} km² newly inundated. Under cloud, the same extent would be recoverable from SAR alone.`,
    confidence: 0.89,
  },
  {
    id: "single-image",
    name: "Scene Understanding",
    kicker: "Single image · grounding",
    query: "Describe the land-cover and highlight the water body referred to in the query.",
    task: "vqa_grounding",
    inputs: [{ label: "Single scene", meta: "Optical · 10 m GSD" }],
    frames: [
      { id: "scene", label: "SINGLE IMAGE", src: "/imagery/single-scene.webp", caption: "One optical observation" },
    ],
    overlay: { src: "/imagery/single-water-mask.png", label: "GROUNDED REGION" },
    boxes: s.waterRegions,
    trace: [
      { stage: "UNDERSTAND", detail: "Query classified as VQA with grounding", weight: 1 },
      { stage: "VALIDATE", detail: "Single optical input · bands and CRS read", weight: 1 },
      { stage: "SELECT", detail: "rs_vqa → captioning → grounding", weight: 0.9 },
      { stage: "ANALYZE", detail: "Scene described, referring expression resolved", weight: 1.9 },
      { stage: "FUSE", detail: "Caption joined to grounded mask", weight: 1 },
      { stage: "VERIFY", detail: "Region-to-text agreement checked", weight: 0.9 },
      { stage: "EXPLAIN", detail: "Answer bound to the highlighted region", weight: 0.8 },
    ],
    tools: ["input_validator", "rs_vqa", "captioning", "region_grounding"],
    params: { "top-k": "1", gsd: "10 m" },
    findings: s.classes.map((k) => ({
      label: k.name.toUpperCase(),
      value: `${k.pct}%`,
      tone: (k.name === "Water" ? "ice" : k.name === "Built-up" ? "signal" : "verd") as Finding["tone"],
    })),
    answer: `The scene is predominantly agricultural, with cropland parcels covering ${s.classes[0].pct}% of the image and a settlement occupying the south-east quadrant at ${s.classes[1].pct}% built-up. A river crosses the scene from west to east. The water body referred to in the query is the reservoir in the northern section, highlighted here, with a surface extent of ${s.waterKm2} km².`,
    confidence: 0.93,
  },
];
