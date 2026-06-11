# The agent rebuilds the report

Everything so far was a person doing careful work. Reflection was us, reading a map aloud. The baseline was us, scoring axes against the rules. Even the library — governed, branded, machine-readable — still needed a skilled author to assemble a report from it.

This episode the author leaves the room. A **config** goes in; governed Power BI modules come out; no human drags a single visual. This is the line between *a method* and *an Engine*, and it's worth being precise about why it's now possible — because for most of Power BI's history, it wasn't.

## Why this couldn't be done with `.pbix`

A `.pbix` file is a compressed binary blob. A script can't read it, write it, or reason about it. For years, "build me a report" meant a person clicking.

`.pbip` changed the substrate. A Power BI Project saves the work as open text — a `SemanticModel/` folder (model metadata as **TMDL**) and a `Report/` folder (**PBIR**). The moment the artefacts became text, generating them became something a program is good at.

**The honest part, because a sovereign buyer will check.** PBIP is in *preview*, and the layers aren't equally ready. The **semantic model (TMDL) is the supported programmatic surface today** — generate measures, tables, relationships via the Tabular Object Model or TMDL text. The **report layer (PBIR) is the frontier**: its `report.json` schema is undocumented and external editing isn't supported during preview. So the engine's safest, production-ready work is on the model and on *module definitions*; report output is validated through Power BI Desktop / Fabric rather than treated as a stable contract. (Full notes: [`docs/strategy/pbip-facts.md`](../../docs/strategy/pbip-facts.md).)

## The orchestration, end to end

The real flow lives in the template's `pbip_automation_orchestrator.py`. Its shape:

```
config.yaml → analyze → validate (gate) → generate modules → migrate DAX/M → SQL gold → validate
```

1. **The config is the brief.** `hospital_er.yaml` — the second file here — declares the project, the brand, the KPIs with their aggregations, and the validation rules. "Build the ED dashboards" is a YAML file, not a sentence someone types.
2. **Analyze.** `pbip_project_analyzer.py` reads the existing PBIP structure — the same reflection from Episodes 1–2, done in code.
3. **Validate — the gate.** Before generating anything, the config is checked against its own `validation_rules`. This is the piece to dwell on.
4. **Generate.** `module_generator.py` (first file) emits governed modules — the KPI strip, the gauge, the slicers — binding the required certified measures, in brand.
5. **Migrate.** The orchestrator also plans a DAX/M → **SQL gold layer** migration — pushing business logic down into a governed layer instead of leaving it scattered in models. (This is the cure for the gold-layer erosion the map showed in [Episode 1](/episodes/reading-the-map).)

## The contract didn't relax — it moved earlier

Look at `validate()` in `module_generator.py`. Before any module is generated, every KPI is checked against its `aggregation_must_be` rule, and the date config against `no_datetime_joins` / `require_calendar`. Give it a config where patient count is `COUNT`, and it **raises** — nothing is generated.

This is exactly [Episode 4](/episodes/the-first-custom-visual)'s idea, but moved all the way upstream. There, an off-brand encoding was impossible *at design time* in one visual. Here, an entire estate's worth of drift is caught *at generate time*, before a single file is written. The Engine literally **cannot generate a drifting report**, because the only configs it will build from are ones that satisfy the rules the baseline scored.

Notice how the whole series converges here. Reflection found the certification gaps and the `COUNT` drift. The baseline scored them against real rules. The library encoded those rules into module contracts. And now the generator enforces them at the moment of creation. Six episodes, one thread: *the metadata about what's trustworthy, propagated all the way to the act of building.*

## Why this is the product, not a parlour trick

A skeptic says: "fine, it generates a report — so does Copilot." The difference is what it generates *from*. A generic generator produces a plausible report from a prompt. This produces a **governed** report from a config, because every module it can emit is a contract, every measure it binds is certified, and the gate rejects any config that breaks a rule. It can only build right — and the template's internal estimates point to substantial time savings and several-times-faster delivery (illustrative, not yet independently benchmarked).

> **The Engine** — the recurring, compounding product: sovereign access to the continuously improving reflection/assembly system. The method is open; the Engine is paid.

## One thing left

We now have an Engine that reflects an estate, scores it against real rules, and generates governed modules from a config. Run once, that's an impressive demo.

But a reflection is a *moment*. An estate keeps evolving the day after you leave: new reports, new measures, a fresh spreadsheet quietly wired in. A one-time run is a photograph of a thing that's still moving. The last episode turns the photograph into a film — the cadence that keeps the baseline climbing, and the cross-estate intelligence that makes the Engine worth more next quarter than today. The development wheel.
