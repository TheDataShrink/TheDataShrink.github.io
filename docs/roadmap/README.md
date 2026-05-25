# Roadmap

The vision is broad. The build is incremental. This roadmap stages scope so
the platform does not try to do everything at once.

---

## V1 — Reflection (the wedge)

**Outcome: "Show me what we actually built."**

Lead with architecture reflection, not optimisation. Earn trust by
demonstrating understanding before introducing critique. See
[ADR 0002](../adr/0002-reflection-before-optimisation.md).

Scope:

- PBIP metadata ingestion (metadata only — no data) — [req 001](../requirements/001-pbip-integration.md)
- Semantic architecture map, lineage topology, consumption heatmap, semantic
  reuse graph
- Lightweight, self-contained, locally runnable visual artefacts (HTML/CSS/JS + D3)
- Reflective, non-judgemental storytelling

Skills: `reflect-architecture`, `generate-architecture-visuals`.

The single measurable V1 promise is **understanding**. A strong commercial
framing of the same wedge: *"Find why Power BI is slow"* — but only after the
reflection layer has been shown first.

---

## V2 — Analysis

**Outcome: explain the entropy, with evidence.**

Once trust is established, introduce:

- Semantic model grilling — `grill-semantic-model`, [req 002](../requirements/002-semantic-model-agent.md)
- Lineage tracing and shadow IT detection — [req 003](../requirements/003-lineage-agent.md)
- Performance bottleneck analysis — [req 004](../requirements/004-performance-agent.md)
- Entropy / governance / lineage-confidence scoring
- Before/after evidence capture

---

## V3 — Remediation & Governance

**Outcome: governed, human-approved change.**

- Recommendation engine (SQL views, aggregates, dimensional restructuring)
- Human-in-the-loop deployment workflow — [governance](../governance/human-in-the-loop.md)
- Knowledge graph as the persistent memory layer
- Multi-agent orchestration
- Recurring architecture cadence (ArchOps)

---

## Documentation backlog

Foundational docs identified but not yet written. Each becomes a file when we
build toward it; listed here so scope stays visible rather than sprawling.

| Doc | Path | Stage |
| --- | --- | --- |
| Shadow IT detection | `docs/requirements/005-shadow-it-detection.md` | V2 |
| Medallion enforcement | `docs/governance/medallion-enforcement.md` | V2 |
| Knowledge graph schema | `docs/knowledge-graph/schema.md` | V2 |
| Agent skill standard | `docs/agents/skill-standard.md` | V2 |
| Multi-agent orchestration | `docs/agents/orchestration-engine.md` | V3 |
| Architecture health scoring | `docs/scoring/architecture-health-model.md` | V2 |
| Discovery-as-a-Service workflow | `docs/services/discovery-workflow.md` | V1 |
| Enablement / training framework | `docs/training/enablement-framework.md` | V3 |
| Sovereign AI architecture | `docs/deployment/sovereign-ai.md` | V1 |
| Synthetic data safety policy | `docs/security/synthetic-data-policy.md` | V1 |
| Case study / before-after template | `docs/examples/case-study-template.md` | V2 |
| Human systems / adoption resistance | `docs/concepts/human-systems.md` | V2 |
| Semantic cinematic skill | `skills/generate-semantic-cinematic/SKILL.md` | V2 |
