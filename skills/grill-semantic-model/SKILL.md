---
name: grill-semantic-model
description: Analyse a semantic model aggressively for governance drift, semantic entropy, hidden dependencies, oversized structures, and modelling anti-patterns.
---

# Grill Semantic Model

> Use this skill only after `reflect-architecture` has established shared
> understanding and trust. Reflection precedes critique.

Interview the semantic model relentlessly.

Do not assume:

- dimensions are governed
- measures are reusable
- lineage is complete
- relationships are intentional

Inspect:

- duplicated measures
- oversized dimensions
- excessive cardinality
- many-to-many misuse
- unmanaged transformations
- semantic drift
- hidden business logic

For every issue:

- explain why it matters
- estimate architectural risk
- estimate performance impact
- suggest governed remediation

Prefer:

- reusable semantic assets
- governed dimensions
- aggregate optimisation
- explainable modelling

Avoid:

- direct bronze-layer access
- duplicated transformations
- unmanaged augmentation
