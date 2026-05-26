# The Engine reads metadata, not business data

**Decision:** The Engine analyses the *structure* of the estate — reports,
datasets, measures, relationships, refresh jobs, gateways, lineage, M/DAX
definitions. It does not read the business rows inside the tables.

**Why:**

- It is the foundation of the sovereignty wrapper: an engagement can start on
  synthetic data, so the first proof requires access to nothing sensitive
  (see [the-reflection.md](../docs/product/the-reflection.md)).
- Semantic observability operates on the semantic and architectural layer; the
  insight lives in how things are modelled and connected, not in the values.
- "No business data leaves the boundary, and we don't even read it" is a
  stronger procurement claim than encryption-in-transit promises.

**Principle:** Metadata in → topology → narrative → baseline → roadmap. Business
data stays untouched inside the customer boundary.
