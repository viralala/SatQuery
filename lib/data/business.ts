/**
 * Business case content.
 *
 * SOURCING RULE for this file: every figure is tagged with its basis.
 * - "official"  — a published government policy target or agency statement
 * - "deck"      — a target stated in the team's own SIH idea submission
 * - "estimate"  — derived by the team from the stated assumptions, shown as
 *                 an assumption, never as a measured fact
 *
 * Anything tagged "estimate" is a modelling assumption for discussion, not a
 * forecast. Verify the "official" figures against their primary source before
 * putting them in front of judges — policy targets get revised.
 */

export type Basis = "official" | "deck" | "estimate";

/* ------------------------------------------------------------ the status quo */
export const STATUS_QUO = [
  {
    stat: "1 analyst-day",
    label: "to triage a single scene",
    detail:
      "A non-trivial question about one scene means selecting imagery, pre-processing it in a GIS toolchain, choosing a model, tuning parameters and interpreting a raster — before anyone reads an answer.",
    basis: "deck" as Basis,
  },
  {
    stat: "4+ tools",
    label: "one per task, per modality",
    detail:
      "Land-cover classification, object detection, VQA and change detection are shipped as separate single-task systems. Each has its own inputs, formats and operators.",
    basis: "deck" as Basis,
  },
  {
    stat: "Expert-only",
    label: "access to the archive",
    detail:
      "A district officer, a forest ranger or a relief coordinator cannot ask the archive a question directly. The data is open; the ability to interrogate it is not.",
    basis: "deck" as Basis,
  },
];

/* -------------------------------------------------------------- market sizing */
export const MARKET = [
  {
    tier: "TAM",
    name: "India's geospatial economy",
    value: "₹1,00,000 cr",
    approx: "~US$12B by 2030",
    body: "The National Geospatial Policy 2022 sets a target for the size of India's geospatial economy by 2030. Earth-observation analytics is one segment inside it.",
    basis: "official" as Basis,
    source: "National Geospatial Policy 2022, Department of Science & Technology",
  },
  {
    tier: "SAM",
    name: "EO decision-support for public bodies",
    value: "₹6,000–9,000 cr",
    approx: "the analytics slice we could serve",
    body: "The portion of that economy attributable to recurring Earth-observation analysis commissioned by central and state government bodies — agriculture, disaster management, forestry, water, urban planning and infrastructure.",
    basis: "estimate" as Basis,
    source: "Team estimate: 6–9% of the 2030 geospatial target, from segment mix",
  },
  {
    tier: "SOM",
    name: "Reachable in the first three years",
    value: "₹40–70 cr",
    approx: "annual recurring, year 3",
    body: "Institutional deployments across a realistic count of state and central departments, at the institutional licence band, plus one or two national-mission engagements.",
    basis: "estimate" as Basis,
    source: "Team estimate: 25–40 institutional deployments + 1–2 mission contracts",
  },
];

export const MARKET_CONTEXT = [
  {
    value: "~US$8B",
    label: "India's space economy today",
    note: "IN-SPACe reported scale",
    basis: "official" as Basis,
  },
  {
    value: "US$44B",
    label: "stated national target by 2033",
    note: "IN-SPACe / Department of Space",
    basis: "official" as Basis,
  },
  {
    value: "Free",
    label: "Sentinel-1 & Sentinel-2 archives",
    note: "Copernicus open data — zero acquisition cost",
    basis: "official" as Basis,
  },
  {
    value: "CC-BY 4.0",
    label: "BigEarthNet adaptation corpus",
    note: "no licensing barrier to training",
    basis: "official" as Basis,
  },
];

/* ------------------------------------------------------------ unit economics */
/** Hours of specialist time per 100 comparable queries. */
export const UNIT_ECONOMICS = {
  caption: "Specialist hours per 100 scene-level queries",
  assumptions:
    "Traditional: 6 h of analyst time per query (selection, pre-processing, model run, interpretation). SatQuery: sub-minute automated answer plus ~5 min of human verification per query. Both figures are illustrative of the intended system, not measured benchmarks.",
  series: [
    { name: "Traditional GIS workflow", hours: 600, emphasis: false },
    { name: "SatQuery, with human review", hours: 8.3, emphasis: true },
  ],
  footnote: "SatQuery target: under 30 s median end-to-end query latency.",
};

/* -------------------------------------------------- deployment / licence tiers */
export const PLANS = [
  {
    id: "community",
    tier: "Open core",
    name: "Community",
    price: "Free",
    cadence: "self-hosted, forever",
    desc: "The full agent, the adapters and the tool registry, under an open licence. For researchers, students and anyone evaluating the system.",
    features: [
      "Complete agent and specialist registry",
      "Open adapter weights",
      "Single-image, cross-modal and bi-temporal tasks",
      "Self-hosted on one 16 GB GPU",
      "Community support",
    ],
    cta: "Read the docs",
    href: "#demo",
    featured: false,
  },
  {
    id: "institutional",
    tier: "Per department",
    name: "Institutional",
    price: "₹12–18 L",
    cadence: "per year, per deployment",
    desc: "An on-premise deployment for a state department or agency, with the sensor adaptation and support that operational use needs.",
    features: [
      "On-premise install, no data leaves the network",
      "Adapter retraining for your sensors",
      "Auditable execution traces and report export",
      "Priority support and version pinning",
      "Training for non-specialist operators",
    ],
    cta: "Talk to the team",
    href: "#contact",
    featured: true,
  },
  {
    id: "mission",
    tier: "National scale",
    name: "Mission",
    price: "Engagement",
    cadence: "scoped per programme",
    desc: "Integration with national geoportals and mission archives, with adapters maintained per sensor as new missions come online.",
    features: [
      "Bhuvan / Bhoonidhi integration surface",
      "New-sensor adapters within the same agent",
      "Multi-tenant deployment across departments",
      "Model cards and reproducibility guarantees",
      "Co-development with the operating agency",
    ],
    cta: "Discuss scope",
    href: "#contact",
    featured: false,
  },
];

export const PLAN_NOTE =
  "The core system stays open and self-hostable. Revenue comes from operating it — sensor adaptation, on-premise support and integration — not from locking the capability behind a licence. That is what keeps it deployable inside ISRO/SAC without vendor lock-in.";

/* ------------------------------------------------------------------- scaling */
export const SCALING = [
  {
    step: "01",
    title: "One backbone, swappable adapters",
    body: "Four specialists share a single vision-language backbone. Adding a capability means training an adapter — under 1% of parameters — not building and hosting another model.",
  },
  {
    step: "02",
    title: "A new sensor is a new adapter",
    body: "When a future ISRO mission comes online, its radiometry and ground sample distance are absorbed by a thin band-adapter layer. The agent, the registry and the interface do not change.",
  },
  {
    step: "03",
    title: "Deployment is a container",
    body: "The whole stack serves from one 16 GB GPU at 4-bit, with an ONNX CPU fallback. A department can run it on hardware it already owns.",
  },
  {
    step: "04",
    title: "The interface is language",
    body: "The query layer is language-agnostic, so extending to Indian languages widens access without touching the analysis pipeline.",
  },
];

/* -------------------------------------------------------- government alignment */
export const GOVERNMENT = [
  {
    title: "National Geospatial Policy 2022",
    body: "Sets out democratised access to geospatial data and a target for the geospatial economy. SatQuery addresses the access half directly: open data is only democratic if non-specialists can interrogate it.",
    tag: "Policy alignment",
  },
  {
    title: "Operational fit for ISRO / SAC",
    body: "Every answer carries an auditable execution summary naming the task, the models and the parameters used. That is the property that makes an AI system usable in an operational government workflow rather than an exploratory one.",
    tag: "Auditability",
  },
  {
    title: "Indigenous stack, no foreign API",
    body: "Open weights, open datasets and on-premise inference. No dependency on an external commercial model provider for national Earth-observation analysis.",
    tag: "Sovereignty",
  },
  {
    title: "Cloud-independent monitoring",
    body: "SAR acquisition through cloud, day or night, means monsoon-season flood assessment does not wait for a clear optical pass — the window in which relief decisions are actually made.",
    tag: "Disaster response",
  },
  {
    title: "Bhuvan and Bhoonidhi as the surface",
    body: "A containerised REST backend can serve the existing ISRO geoportals, so the capability reaches users through platforms they already use rather than another new portal.",
    tag: "Distribution",
  },
  {
    title: "Capacity building",
    body: "Students and researchers get entry-level access to Earth-observation analysis with no GIS or ML background, widening the pipeline of people able to work on national EO problems.",
    tag: "Human capital",
  },
];

/* ------------------------------------------------------------------- roadmap */
export const ROADMAP = [
  {
    phase: "W1–2",
    title: "Data and baselines",
    body: "Loaders, splits and the metric harness for VRSBench, RSVQA and CDVQA.",
    horizon: "hackathon" as const,
  },
  {
    phase: "W3–5",
    title: "Remote-sensing adaptation",
    body: "LoRA on BigEarthNet.txt for the VQA baseline plus captioning and grounding.",
    horizon: "hackathon" as const,
  },
  {
    phase: "W6–8",
    title: "Paired reasoning",
    body: "Change VQA with a change map, and optical–SAR joint extraction.",
    horizon: "hackathon" as const,
  },
  {
    phase: "W9–10",
    title: "Agent and interface",
    body: "Router, tool registry, evidence overlays and the audit trace.",
    horizon: "hackathon" as const,
  },
  {
    phase: "W11–12",
    title: "Evaluate and harden",
    body: "Benchmark runs, latency work, containerisation.",
    horizon: "hackathon" as const,
  },
  {
    phase: "Year 1",
    title: "First operational pilot",
    body: "One state department running it on real acquisitions, with the feedback loop that only production use produces.",
    horizon: "beyond" as const,
  },
  {
    phase: "Year 2",
    title: "Sensor breadth",
    body: "Cartosat and RISAT adapters hardened; a geoportal integration; Indian-language query layer.",
    horizon: "beyond" as const,
  },
  {
    phase: "Year 3",
    title: "Multi-department scale",
    body: "Shared deployment serving several departments, with per-sensor adapters maintained as a versioned registry.",
    horizon: "beyond" as const,
  },
];

/* --------------------------------------------------------------------- risks */
export const RISKS = [
  {
    risk: "Procurement cycles are slow",
    answer:
      "The open core removes the first barrier — a department can evaluate it without a purchase decision. Paid engagement starts only once it is already running on their data.",
  },
  {
    risk: "A generic VLM improves and closes the gap",
    answer:
      "The moat is not the language model. It is the remote-sensing adaptation, the specialist registry and the evidence-grounded execution trace — none of which a general model provides on its own.",
  },
  {
    risk: "Trust in AI output for operational decisions",
    answer:
      "Confidence gating with an explicit abstain path, and every claim bound to a mask, box or band statistic the operator can inspect. The system is designed to refuse rather than guess.",
  },
  {
    risk: "Dependence on a single funder",
    answer:
      "Three revenue surfaces — institutional deployments, mission engagements and adapter development — across independent departments, rather than one programme.",
  },
];
