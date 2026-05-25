# ADR 0001 — Semantic Observability First

## Status

Accepted

---

## Context

Traditional observability platforms focus on:

- infrastructure
- pipelines
- query telemetry

But enterprise analytics failures frequently originate in:

- semantic inconsistency
- unmanaged dependencies
- duplicated business logic
- governance erosion

These problems become visible from the Power BI layer.

---

## Decision

The Data Shrink will adopt a semantic-observability-first architecture.

The platform will:

- analyse semantic models
- inspect report behaviour
- reason about lineage
- detect semantic entropy
- identify governance drift

before focusing on infrastructure optimisation.

---

## Consequences

### Positive

- aligns directly with business pain
- exposes hidden dependencies
- enables governance reasoning
- differentiates from infrastructure observability tools

### Negative

- requires deep semantic modelling expertise
- requires metadata-heavy architectures
- requires domain-specific knowledge graphs
