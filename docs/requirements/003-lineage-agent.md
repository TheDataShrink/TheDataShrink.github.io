# Requirement 003 — Lineage Agent

## Objective

Build a lineage engine capable of tracing dependencies from Power BI reports back to source systems.

---

## Why This Matters

Enterprise analytics environments contain hidden dependencies:

- Excel files
- SharePoint lists
- unmanaged transformations
- duplicated SQL logic
- direct bronze-layer access

These dependencies create:

- technical debt
- governance risk
- performance instability

---

## Functional Requirements

The lineage agent must:

- Trace report-to-source relationships
- Identify transformation chains
- Detect unmanaged dependencies
- Map upstream and downstream assets
- Analyse gateway relationships
- Build dependency trees

---

## Knowledge Graph Integration

The lineage agent contributes to the enterprise knowledge graph.

Entities:

- reports
- visuals
- datasets
- SQL views
- APIs
- gateways
- users

Relationships:

- depends_on
- transforms
- refreshes_from
- aggregates
- joins_with

---

## Outputs

Generate:

- lineage diagrams
- dependency graphs
- shadow IT detection reports
- refresh-chain analysis
- governance risk scoring

---

## Risks

- incomplete metadata
- undocumented external dependencies
- gateway visibility limitations

---

## Future Extensions

- real-time lineage monitoring
- automated lineage anomaly detection
