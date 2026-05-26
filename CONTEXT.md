# The Data Shrink — Shared Domain Language

## Core Philosophy

The Data Shrink is a semantic observability platform focused on enterprise Power BI ecosystems.

The platform analyses semantic models, reports, lineage, governance, and dependencies to reduce analytics entropy.

The dashboard is rarely the root problem.

The dashboard exposes upstream architectural entropy.

---

## Core Terms

### Analytics Entropy

The gradual degradation of enterprise analytics ecosystems caused by:

- semantic drift
- hidden dependencies
- governance erosion
- duplicated transformations
- unmanaged augmentation

---

### Semantic Observability

The practice of analysing enterprise analytics ecosystems from the semantic consumption layer downward.

Unlike infrastructure observability, semantic observability focuses on:

- business logic
- semantic consistency
- lineage
- report behaviour
- governance maturity

_Avoid_: "monitoring" (implies infra metrics), "BI auditing", "data observability" (the data-engineering category, not ours), "optimisation platform" (that's the outcome, not the practice).

---

### Shadow IT

Unmanaged business logic or data dependencies introduced outside governed architecture.

Examples:

- SharePoint Excel files
- local CSV files
- unmanaged dimensions
- report-level transformations

---

### Gold Layer Erosion

The gradual bypassing of curated semantic assets in favour of:

- bronze ingestion tables
- operational joins
- unmanaged direct queries

---

### Semantic Drift

The same business metric evolving differently across teams.

Symptoms:

- duplicated measures
- inconsistent filters
- conflicting KPI definitions

---

### Semantic Asset

A governed, reusable business-facing data structure.

Examples:

- dimensions
- measures
- aggregate tables
- certified semantic models

---

### Architecture Intelligence

The ability to reason about:

- lineage
- governance
- semantic quality
- optimisation opportunities
- dependency risk

across the analytics ecosystem.

---

### Architecture Reflection

The process of visualising and explaining an enterprise analytics ecosystem
*before* attempting optimisation or governance analysis. Reflection precedes
critique. Trust precedes optimisation.

_Avoid_: "discovery scan", "audit", "assessment", "health check" — all imply
judgement-first, which inverts the wedge. Reflection honours what they built
before it critiques anything.

---

### Semantic Anchor

A highly reused asset that connects multiple business domains (for example a
date dimension, customer dimension, or organisational hierarchy).

---

### The Reflection

The packaged flagship offer: a fixed-scope, sovereign diagnostic and capability
uplift that delivers a plain-English map of a customer's Power BI estate
(produced inside their boundary) plus enablement to maintain it. The
commercial expression of the "reflection before optimisation" wedge. See
[docs/product/the-reflection.md](docs/product/the-reflection.md).

_Avoid_: "discovery scan", "the diagnostic", "the report", "the audit" — The
Reflection is the named, fixed-scope offer; lesser nouns dilute it.

---

### The Engine

The recurring, compounding product: sovereign access to the continuously
improving reflection/optimisation system plus the acceleration cadence. The
"magic we keep" — operationalised, getting sharper across every estate. The
method is open; the Engine is paid. See
[docs/product/product-thesis.md](docs/product/product-thesis.md).

---

### Modular Visual Intelligence

A customer-shaped library of custom Power BI visuals that consume the governed
data layer and bake in standards, governance, and brand identity. Reports are
*assembled* from these modules rather than hand-built, so identity and
knowledge are guarded by construction. The team shifts from building singular
reports to curating collective intelligence. See
[docs/concepts/modular-visual-intelligence.md](docs/concepts/modular-visual-intelligence.md).

---

### PBIP (Power BI Project)

The plain-text, folder-based save format for Power BI Desktop work: a
`<name>.SemanticModel/` folder, a `<name>.Report/` folder, a `.gitignore`, and
an optional `<name>.pbip` pointer file. The shift from the `.pbix` binary to
PBIP is what makes Power BI legible to agents and Git. **Currently in preview** —
say so when leaning on it. Full notes: [docs/strategy/pbip-facts.md](docs/strategy/pbip-facts.md).

_Avoid_: calling `.pbip` "the file that holds the report" — it's a *pointer* to
the report folder and is optional. Don't imply the whole format is GA.

### TMDL (Tabular Model Definition Language)

The plain-text format for a PBIP **semantic model** definition. This is the
**supported** programmatic surface today — read/write via the Tabular Object
Model (TOM) or by editing TMDL text. Where governed, agent-driven model change
is production-ready now.

_Avoid_: "model.bim" (the older JSON serialisation, not what PBIP writes).

### PBIR (Power BI Enhanced Report format)

The plain-text format for a PBIP **report** definition (`definition.pbir` +
`report.json`). It makes the report layer text — which *enables* code-first
assembly — but the `report.json` schema is **undocumented and unsupported for
external editing during preview**. The report layer is the frontier, not yet a
stable contract; validate report output through Power BI Desktop / Fabric.

_Avoid_: claiming agents can freely author `report.json` today — they can author
the **model** (TMDL); the report layer is emerging. See [[project-pivot-agentic-powerbi]].

## Strategic Positioning

Microsoft provides:

- PBIP
- Fabric
- MCP
- semantic accessibility

The Data Shrink provides:

- semantic intelligence
- governance reasoning
- entropy reduction
- sovereign optimisation
- explainable remediation
