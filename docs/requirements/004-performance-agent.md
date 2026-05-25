# Requirement 004 — Performance Agent

## Objective

Detect and explain Power BI performance bottlenecks.

---

## Core Philosophy

Power BI slowness is usually architectural.

The issue is often:

- oversized semantic models
- poor dimensional modelling
- excessive cardinality
- inefficient DAX
- over-ingestion of detail
- misuse of DirectQuery

---

## Functional Requirements

The agent must:

- analyse model memory pressure
- inspect DAX query complexity
- identify high-cardinality columns
- detect oversized visuals
- identify refresh bottlenecks
- analyse query folding behaviour
- detect unnecessary columns

---

## Key Insight

A table with:

- 3 million rows
- 2 columns

may perform dramatically better than:

- 3 million rows
- 40 columns

The platform must reason about:

- compression
- memory expansion
- filter propagation
- evaluation context

---

## Outputs

Generate:

- bottleneck reports
- refresh optimisation plans
- aggregation recommendations
- model simplification recommendations
- memory reduction estimates

---

## Human Review

All remediation suggestions are advisory until approved.

---

## Future Extensions

- benchmark simulations
- predictive performance scoring
- Fabric capacity optimisation
