# Applied Series — Reflecting a Real Power BI Estate

The existing episode series ([EPISODES-SERIES.md](../../EPISODES-SERIES.md),
"Building an Agent from Scratch") teaches agent engineering in the abstract.

This is the **applied** track: take a real PBIP project and walk it through the
whole Data Shrink method, end to end, on screen. Theory becomes demonstration.

> Goal: someone watching should think *"I can see exactly how this applies to
> my estate — and I want the engine that does it."*

It is also a working proof of the [product ladder](product-ladder.md): the
method is shown openly; the episodes make people want The Reflection and the
Engine.

---

## The arc

Each episode adds one stage of the method, against the *same* real PBIP estate.

| # | Title | Shows | Skill / concept |
| --- | --- | --- | --- |
| 0 | The estate as we found it | Open by honouring the real, evolved system | `reflect-architecture`, [reflection](../concepts/architecture-reflection.md) |
| 1 | Reading the map | Build + walk the semantic topology of the real estate | `generate-architecture-visuals` |
| 2 | The dependencies hiding in plain sight | Trace lineage; surface the shadow Excel/SharePoint | [lineage agent](../requirements/003-lineage-agent.md) |
| 3 | What "good" looks like here | Turn findings into this customer's standards | [analytics entropy](../concepts/analytics-entropy.md) |
| 4 | The first custom visual | Build one visual as a contract on the gold layer | [modular visual intelligence](../concepts/modular-visual-intelligence.md) |
| 5 | The library | A reusable, branded, governed component set | modular visual intelligence |
| 6 | The agent rebuilds the report | Assemble a report by importing library widgets | the Engine |
| 7 | The development wheel | Cadence + compounding; the team's collective intelligence | [product ladder](product-ladder.md) |

Episodes 0–3 are **Reflection** (understanding). Episodes 4–7 are **the
Engine** (acceleration). The split mirrors the product ladder exactly.

---

## Format (matches the existing series)

- Lives under `src/episodes/<slug>/` with `prose.md` + colocated code/artefact
  files, registered via the catalogue in `src/episodes/index.ts`
  (see [types.ts](../../src/episodes/types.ts)).
- Self-contained, locally runnable artefacts (HTML + D3) for the visuals — no
  cloud, consistent with sovereign-by-default.
- The custom visual episodes ship real Power BI custom-visual source.

---

## What we need to build it (from you)

To make this *real* rather than theoretical, the applied track needs a concrete
PBIP example. Please share, when ready:

1. **A sample PBIP project** — ideally one that shows the entropy honestly
   (hidden Excel/SharePoint dependencies, duplicated measures, an oversized
   model). Synthetic or anonymised is perfect, and matches our synthetic-data
   start.
2. **The target data layer** — how the gold layer *should* look, so the custom
   visuals can be written as contracts against it.
3. **The brand/identity** — colours, typography, conventions to bake into the
   visuals.
4. **The Zebra-BI-style examples you mentioned** — the custom visuals you have
   already built, so we model the library on proven work.

With those, Episodes 0–2 can be built against the real estate immediately, and
4–6 can ship actual custom-visual code.

---

## Status

Plan only. No episode content generated yet — deliberately, so it is built on a
real PBIP rather than invented. Episodes are scaffolded once the example lands.
