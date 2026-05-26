# The Engine does not change production automatically

**Decision:** The Engine discovers, models, analyses, explains, recommends, and
generates candidate artefacts (SQL views, refactored models, deployment
scripts). It never applies them to a production system on its own.

**Why:**

- Human governance is the trust contract with sovereign and government buyers —
  it is a feature, not a limitation (see [the-reflection.md](../docs/product/the-reflection.md)).
- Auto-remediation would make us responsible for an estate's runtime behaviour
  we don't control and can't fully test from metadata alone.
- "We recommend, you approve, you roll out" is defensible internally for the
  official who buys us. Silent writes are not.

**Principle:** Every change passes through human review and controlled rollout.
The Engine's output is a proposal, not an action.
