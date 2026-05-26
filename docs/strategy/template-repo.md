# The real engine — `power-bi-template`

Our episodes were written on a *synthetic* estate with *invented* abstractions.
The real versions already exist in
[`spectrumefficiencylimited/power-bi-template`](https://github.com/spectrumefficiencylimited/power-bi-template).
This doc maps what's real to what the series teaches, so the two don't drift.
Read 2026-05-26.

## What the repo actually contains

- **A real PBIP template** — `Project.Template.Report/definition/report.json`,
  `Project.Template.SemanticModel/definition/model.tmdl`, `Project.Template.pbip`.
  (Note: model is **TMDL**, exactly the supported surface from [pbip-facts.md](pbip-facts.md).)
- **A real custom visual** — `custom-visuals/seffMonthlyVarianceWaterfall/`: a
  Zebra-BI/IBCS-style **monthly variance waterfall** (pbiviz, with `src/visual.ts`,
  `capabilities.json`, a built `.pbiviz`). Data roles: category / actual /
  previousYear; theme colours positive-strong/soft, neutral, negative-soft/strong,
  reference line. This is the "Zebra-BI example" `applied-series.md` was waiting for.
- **A real module library** — `modules/{kpi,charts,filters,layouts}/_template_*.json`.
  Module schema: `{ module: { name, type, category, description, version, author,
  dependencies, measures_required, config: { visualType, objects } } }`.
- **A real config-driven generator** — `config/examples/hospital_er.yaml` etc. plus
  Python automation (`module_generator.py`, `pbip_automation_orchestrator.py`,
  `pbip_project_analyzer.py`, `visual_module_manager.py`, `validation_tools.py`).
  The orchestrator: analyse PBIP → generate modules → **migration plan (DAX/M →
  SQL Gold Layer)** → validate → document.
- **Validation baked into config** — e.g. hospital_er.yaml enforces
  `Patient ID` aggregation **must be DISTINCTCOUNT**, `no_datetime_joins`,
  `require_calendar`. Governance-as-contract, for real.
- **An agent operating discipline** — `prompts-power-bi-template.md`,
  `KNOWLEDGE-REGISTER.md`. Non-negotiable rules: "treat the folder PBIP as the
  source of truth", "don't assume a warehouse/Synapse/automation unless it exists
  in this folder", "preserve actual page/visual names", "capture DAX/M exactly".

## How it maps to the series

| Series concept (invented) | Real artefact |
| --- | --- |
| Synthetic Awatea estate | `config/examples/hospital_er.yaml` (real ER pattern) |
| Ep 1–2 reflection/lineage | `pbip_project_analyzer.py` (reads PBIP structure) |
| Ep 3 baseline / "what good is" | YAML `validation:` rules (DISTINCTCOUNT, require_calendar) |
| Ep 4 "Governed KPI Card" | real `seffMonthlyVarianceWaterfall` custom visual |
| Ep 5 library + `tds.kpiCard` registry | `modules/` + the real module JSON schema |
| Ep 6 TS assembler → report.json | Python `module_generator` + `pbip_automation_orchestrator` |
| Ep 7 "85% faster" claims | `MODULAR_SYSTEM_BENEFITS.md` (85% time cut, 3-5x delivery, 95% fewer brand violations) |

## Where the series currently diverges (and should be reconciled)

1. **Estate**: synthetic Awatea vs the repo's hospital-ER config. Note the *same*
   insight in both — patient count must be DISTINCTCOUNT — so they're compatible.
2. **Custom visual (Ep 4)**: invented "Governed KPI Card" vs the real variance
   waterfall. The governance *idea* is sound; the artefact differs.
3. **Module schema (Ep 5)**: clean `tds.kpiCard` registry vs real
   `module.config.objects`. Ours is a teaching simplification.
4. **Assembler (Ep 6)**: TypeScript vs the real Python orchestrator + YAML config.
5. **Gold-layer migration**: the real orchestrator does DAX/M → SQL Gold Layer
   migration; the series mentions gold-layer erosion but not the migration step.

**Honesty rule going forward** (mirrors the repo's own): don't let the blog claim
artefacts or numbers that the real repo doesn't have. When the series and the repo
disagree, the repo is the source of truth.
