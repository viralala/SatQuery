# Judge brief — SatQuery AI (PS 26167)

Internal prep. Not linked from the site.

---

## The 60-second pitch

> Remote-sensing AI today ships as isolated single-task tools. To get an answer
> you need to know which sensor you're looking at, which model fits the question,
> how to pre-process the imagery, and how to read the raster that comes back.
> That's a specialist's job, and it takes about a day per scene.
>
> SatQuery replaces that with a question. You give it an image — or an
> optical–SAR pair, or two dates of the same ground — and ask in plain language.
> An agent classifies the task, validates that your inputs can actually support
> it, picks the right specialist models from a registry, runs them, and returns
> an answer bound to the evidence it came from, with a confidence score and an
> auditable trace of exactly what ran.
>
> The novelty isn't the language model. It's that the query decides the pipeline.

---

## Mapping to the mandatory functional scope

Have this ready — judges score against the problem statement, not the pitch.

| PS requirement | Where it lands |
| --- | --- |
| Remote-sensing adaptation (BigEarthNet.txt or open data) | LoRA adapters on a small VLM backbone; RS encoders (RemoteCLIP / GeoChat-class) |
| Single-image VQA — **mandatory** | Task family 1, the baseline every query path falls back to |
| One additional single-image task | Both: captioning/scene description **and** text-guided grounding |
| Multi-image change analysis — **mandatory** | Change VQA + spatial change map from a bi-temporal pair |
| Cross-modal pair analysis | Optical–SAR joint extraction with co-registration validation |
| Agentic orchestration | Controller: task classification → input validation → tool planning → parameter binding → fusion |
| Auditable execution summary | Every response carries `{ task, tools, params, confidence }` |
| Interactive GUI / web application | The demo section; the workspace mockup shows the intended full product |
| Visual evidence + confidence | Masks, boxes and area statistics attached to every answer |
| Downloadable reports | PDF + GeoJSON export in the intended build |

**The one sentence that matters:** *"A generic LLM or VLM without remote-sensing
adaptation will not satisfy the requirements"* — this is in the PS. Lead with the
adaptation and the specialist registry, not the chat interface.

---

## Demo script (3 minutes)

1. **Hero, 10s.** "Ask Earth. Get intelligence." Don't linger.
2. **Workspace mockup, 20s.** "This is the product surface — scene library,
   query history, and the grounded result." Establishes it's a real application,
   not a chatbot.
3. **Problem section, 20s.** Walk the stack: image + sensor + model + workflow +
   parameters = complexity. Then the collapse to natural language.
4. **Agent pipeline, 30s.** Hover two or three stages. Say explicitly: *"only the
   observable trace is exposed — no chain-of-thought, which is what the PS asks
   for."*
5. **Multimodal, 25s.** Toggle Optical → SAR → Combined. The line to use:
   *"SAR separates built-up from bare soil, which look alike spectrally. That's
   the question a single optical image cannot answer."*
6. **Temporal, 30s.** Drag the slider. Hit **Reveal change**. Let the regions
   animate in. This is the strongest visual moment — pause here.
7. **Demo, 45s.** Pick *Urban Expansion* → **Analyze**. Let the trace run. Read
   the answer and point at the confidence and the tool list.
8. **Close, 10s.** "Every number on this page is measured off the imagery shown.
   The analysis is pre-computed for the preview — the pipeline behind it is what
   we're building."

Then offer `/business` if the panel asks about scale or sustainability.

---

## Questions you will get

**"How is this different from just uploading an image to GPT-4V / Gemini?"**
Three ways. First, adaptation: a general VLM has not learned sensor terminology,
polarisation, or backscatter behaviour — it will describe a SAR image as a
black-and-white photograph. Second, task routing: change detection over a
bi-temporal pair is a different model, not a longer prompt. Third, evidence: we
return the mask and the statistic the claim rests on, and abstain below a
confidence gate. A general model produces fluent text with nothing behind it.

**"What if the model hallucinates?"**
Confidence gating with an explicit abstain path. Every claim is bound to a mask,
box or band statistic the operator can inspect. On mis-registered or wrong-modality
input the system refuses and explains rather than answering — the input validator
runs before any model does.

**"Cartosat and RISAT differ from Sentinel. Will it transfer?"**
That's the main domain-gap risk and we've scoped for it: radiometric
normalisation, resample to a fixed GSD, a thin band-adapter layer, and test-time
augmentation. The adapter-per-sensor architecture is exactly why this is a
training run rather than a rebuild.

**"Can you actually train this?"**
We're not training from scratch. Open-weight RS encoders plus a 2–7B backbone,
with LoRA on under 1% of parameters — roughly 25 GPU-hours per adapter on free
T4/A100 sessions, and 4-bit inference on a single 16 GB GPU.

**"Is the demo real?"**
No, and we say so on the page. The imagery is procedurally generated synthetic
reference data and the results are pre-computed. But the change masks, region
geometry and area figures are measured from those generated scenes — so the
numbers shown are consistent with the pixels, not invented. *(Be first to say
this. Volunteering it reads as rigour; being caught reads as overclaiming.)*

**"What's the business model?"** → `/business`. Open core, paid operation.
The system stays self-hostable so it can run inside a government network without
lock-in; revenue is sensor adaptation, on-premise support and integration.

**"How big is the market?"** → National Geospatial Policy 2022 targets a
₹1 lakh crore geospatial economy by 2030. Be careful to say which figures are
published targets and which are our estimates — the page labels every one.

---

## Known gaps — answer honestly if asked

- The AI backend is not implemented; this is the product and interface case.
- Benchmark numbers are targets, not results. We have not run VRSBench, RSVQA or
  CDVQA yet.
- The pricing is indicative, for discussion.
- No ISRO/SAC data has been used — the evaluation set is not disclosed to teams.

Do not oversell any of these. A panel of ISRO scientists will find the seam, and
being straight about scope is worth more than a claim you can't defend.

---

## Before you present

- [ ] Load the site once so the hero video is cached
- [ ] Run the demo end to end at least once
- [ ] Have `/business` open in a second tab
- [ ] Know your three numbers: **+55.3%** built-up change, **0.87** confidence,
      **5 task families**
- [ ] Decide who answers technical vs business questions
