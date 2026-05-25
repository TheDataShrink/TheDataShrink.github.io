# Requirement 002 — Semantic Model Agent

## Objective

Build an agent capable of analysing semantic models for optimisation opportunities, governance violations, and modelling weaknesses.

---

## Core Philosophy

Most Power BI performance problems originate from semantic model design.

The goal is to identify:

- excessive cardinality
- duplicated business logic
- weak dimensional modelling
- semantic drift
- improper granularity
- oversized fact models

---

## Functional Requirements

The agent must:

- Analyse table relationships
- Detect many-to-many misuse
- Detect oversized dimensions
- Detect unused columns
- Detect duplicate measures
- Analyse DAX complexity
- Identify snowflake anti-patterns
- Evaluate star-schema quality

---

## Key Metrics

### Model Health Score

Factors:

- relationship quality
- measure duplication
- table width
- column cardinality
- unused assets
- hidden technical debt

---

## Outputs

Generate:

- semantic optimisation recommendations
- dimension extraction recommendations
- aggregate table recommendations
- SQL view candidates
- model health reports

---

## Human Governance

No model changes are automatically applied.

All recommendations require:

- review
- approval
- controlled deployment

---

## Future Extensions

- automated TMDL refactoring
- semantic pattern libraries
- governance certification scoring
