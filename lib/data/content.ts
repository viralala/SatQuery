/**
 * Narrative content for the SatQuery AI showcase.
 *
 * Every capability, task family and benchmark named here is drawn from the
 * SIH 2026 problem statement 26167 and the team's idea submission. Analysis
 * figures come from `generated.json`, which is measured off the synthetic
 * scenes shipped in /public/imagery — they illustrate the intended product,
 * they are not production model output.
 */

export const NAV_LINKS = [
  { label: "Capabilities", href: "/#capabilities" },
  { label: "How It Works", href: "/#agent" },
  { label: "Applications", href: "/#applications" },
  { label: "Demo", href: "/#demo" },
  { label: "Pricing", href: "/#plans" },
  { label: "Business", href: "/business" },
] as const;

/* ------------------------------------------------------------- the problem */
export const COMPLEXITY_STACK = [
  { term: "IMAGE", note: "GeoTIFF, 12 bands, unknown projection" },
  { term: "SENSOR", note: "Optical, multispectral or SAR" },
  { term: "MODEL", note: "One network per task, per modality" },
  { term: "WORKFLOW", note: "Resample, co-register, speckle-filter" },
  { term: "PARAMETERS", note: "Thresholds, band maths, GSD" },
] as const;

/* ------------------------------------------- the agent's observable pipeline */
export const PIPELINE = [
  {
    id: "understand",
    step: "01",
    title: "UNDERSTAND",
    caption: "Interpret the query and classify the requested task",
    detail:
      "The question is parsed into an intent and the entities it refers to, then classified into one of five task families.",
    trace: "task = change_vqa",
  },
  {
    id: "validate",
    step: "02",
    title: "VALIDATE",
    caption: "Check modality, format, metadata and compatibility",
    detail:
      "Band count, projection, ground sample distance, acquisition dates and pair co-registration are all checked before any model runs.",
    trace: "crs = EPSG:32643 · gsd = 10 m · pair = co-registered",
  },
  {
    id: "select",
    step: "03",
    title: "SELECT",
    caption: "Choose specialist models from a declared registry",
    detail:
      "The controller picks and sequences tools from a JSON-schema registry, binding only the parameters that task permits.",
    trace: "tools = [validator, change_net, change_vqa]",
  },
  {
    id: "analyze",
    step: "04",
    title: "ANALYZE",
    caption: "Execute the planned workflow",
    detail:
      "Each selected specialist runs in order, producing text, masks, boxes or band statistics as its native output.",
    trace: "threshold = 0.50 · looks = 4",
  },
  {
    id: "fuse",
    step: "05",
    title: "FUSE",
    caption: "Combine textual and spatial outputs",
    detail:
      "Outputs from separate tools are merged into a single response, with spatial evidence aligned to the source imagery.",
    trace: "merge(text, mask, statistics)",
  },
  {
    id: "verify",
    step: "06",
    title: "VERIFY",
    caption: "Cross-check agreement and estimate confidence",
    detail:
      "Where tools disagree, or an input fails validation, the system abstains and explains rather than answering.",
    trace: "confidence = 0.87 · abstain = false",
  },
  {
    id: "explain",
    step: "07",
    title: "EXPLAIN",
    caption: "Return the answer with its evidence and execution trace",
    detail:
      "The response carries the overlay it is grounded in, plus an auditable summary of task, models and parameters.",
    trace: "answer + overlay + audit",
  },
] as const;

/* ----------------------------------------------------------- capabilities */
export const CAPABILITIES = [
  {
    id: "single",
    index: "01",
    title: "Single-image understanding",
    lede: "Visual question answering over one optical, multispectral or SAR observation.",
    body: "The mandatory baseline. Ask what a scene contains, what dominates its land cover, or what a specific structure is — answered from one image, with captioning and scene description alongside.",
    tag: "VQA · CAPTIONING",
  },
  {
    id: "multimodal",
    index: "02",
    title: "Cross-modal analysis",
    lede: "Joint reasoning over co-registered optical and SAR pairs.",
    body: "Optical carries spectral and contextual information; SAR carries structure and sees through cloud, day or night. Read together they resolve built-up and water-covered regions that either modality alone would leave ambiguous.",
    tag: "OPTICAL + SAR",
  },
  {
    id: "temporal",
    index: "03",
    title: "Multitemporal change",
    lede: "Change description and change VQA across bi-temporal pairs.",
    body: "Two spatially corresponding images acquired at different dates become a question about what changed, where it changed, and by how much — with a spatial change map where reference masks exist.",
    tag: "BI-TEMPORAL",
  },
  {
    id: "grounding",
    index: "04",
    title: "Text-guided grounding",
    lede: "Connect the words in a question to regions in the imagery.",
    body: "A referring expression — \"the water body north of the settlement\" — is resolved to a box or mask on the scene, so the answer points at something rather than merely describing it.",
    tag: "REFERRING EXPRESSION",
  },
  {
    id: "agentic",
    index: "05",
    title: "Agentic orchestration",
    lede: "The question decides the pipeline, not the developer.",
    body: "A controller classifies the task, validates the inputs, selects and sequences specialist models from a registry, binds only permitted parameters, and integrates what comes back.",
    tag: "TASK ROUTING",
  },
  {
    id: "evidence",
    index: "06",
    title: "Evidence-grounded results",
    lede: "Every claim tied to something visible.",
    body: "Answers arrive with the mask, box or band statistic they rest on, a confidence estimate, and an execution summary naming the task, the models and the key parameters used.",
    tag: "AUDITABLE TRACE",
  },
] as const;

/* ------------------------------------------------------------- use cases */
export const USE_CASES = [
  {
    id: "agriculture",
    domain: "Agriculture",
    image: "/imagery/case-agriculture.webp",
    query: "Which parcels show reduced crop vigour compared with last season?",
    note: "Crop-cover and irrigation questions answered per district, per season.",
  },
  {
    id: "disaster",
    domain: "Disaster Management",
    image: "/imagery/case-disaster.webp",
    query: "What changed between the pre-event and post-event imagery?",
    note: "Flood and cyclone extent through cloud cover, day or night, using SAR.",
  },
  {
    id: "urban",
    domain: "Urban Planning",
    image: "/imagery/case-urban.webp",
    query: "Has the built-up area increased, decreased, or remained unchanged?",
    note: "Settlement growth quantified against a dated baseline, with a change map as proof.",
  },
  {
    id: "forest",
    domain: "Forest Monitoring",
    image: "/imagery/case-forest.webp",
    query: "Describe the land-cover and identify any cleared areas in this image.",
    note: "Deforestation and encroachment tracked from bi-temporal pairs.",
  },
  {
    id: "water",
    domain: "Water Resources",
    image: "/imagery/case-water.webp",
    query: "Where has the water-covered region changed since the earlier date?",
    note: "Reservoir drawdown and water-body extent measured over time.",
  },
  {
    id: "infrastructure",
    domain: "Infrastructure",
    image: "/imagery/case-infrastructure.webp",
    query: "Highlight the transport corridor referred to in the query.",
    note: "Text-guided grounding of linear infrastructure and new structures.",
  },
  {
    id: "environment",
    domain: "Environmental Analysis",
    image: "/imagery/case-environment.webp",
    query: "Use the optical and SAR images together to identify built-up and water-covered regions.",
    note: "Cross-modal extraction where a single optical image is not enough.",
  },
] as const;

/* ------------------------------------------------------ why it is different */
export const WORKFLOW_TRADITIONAL = [
  "Acquire and inspect imagery",
  "Choose sensor and dataset",
  "Pre-process in a GIS toolchain",
  "Select a task-specific model",
  "Configure thresholds and parameters",
  "Run the analysis",
  "Interpret the raster output",
] as const;

export const WORKFLOW_SATQUERY = [
  "Ask the question",
  "SatQuery agent",
  "Evidence-grounded answer",
] as const;

/* --------------------------------------------------- technical credibility */
export const TECH_PILLARS = [
  {
    title: "Remote-sensing adaptation",
    body: "A vision-language component adapted to satellite imagery rather than natural photographs — sensor terminology, polarisation and land-cover vocabulary learned, not guessed.",
    items: ["LoRA / QLoRA adapters", "RS image–text encoders", "Sensor-agnostic preprocessing"],
  },
  {
    title: "Specialist model registry",
    body: "Four remote-sensing specialists behind one backbone, declared in a schema the controller reads — not a single generic model answering everything.",
    items: ["RS-VQA and captioning", "Text-guided grounding", "Change understanding", "Optical–SAR extraction"],
  },
  {
    title: "Agentic controller",
    body: "Deterministic, testable orchestration: classify the task, validate the inputs, plan the tool chain, bind allow-listed parameters, integrate the outputs.",
    items: ["Task classification", "Input compatibility checks", "Tool planning and sequencing", "Confidence gating with abstention"],
  },
] as const;

export const DATASETS = [
  {
    name: "BigEarthNet.txt",
    role: "Adaptation corpus",
    detail: "Co-registered Sentinel-1 SAR and Sentinel-2 multispectral scenes with paired text annotations.",
  },
  {
    name: "VRSBench",
    role: "Captioning · grounding · VQA",
    detail: "Versatile remote-sensing benchmark for single-image understanding.",
  },
  {
    name: "RSVQA",
    role: "Visual question answering",
    detail: "Remote-sensing VQA benchmark across low- and high-resolution splits.",
  },
  {
    name: "CDVQA",
    role: "Change-based VQA",
    detail: "Bi-temporal change visual question answering.",
  },
] as const;

export const TASK_FAMILIES = [
  "Single-image VQA",
  "Captioning / scene description",
  "Text-guided region grounding",
  "Bi-temporal change VQA + change map",
  "Optical–SAR joint extraction",
] as const;
