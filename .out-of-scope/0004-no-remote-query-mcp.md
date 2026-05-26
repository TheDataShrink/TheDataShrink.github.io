# The Engine Runtime does not consume the remote (query) MCP server

**Decision:** The Engine Runtime consumes only Microsoft's **local** Power BI MCP
server (model authoring — TMDL, measures, relationships; runs on the customer's
machine) plus the PBIP files. It does **not** consume the **remote** Power BI MCP
server (DAX query, Fabric-hosted in the cloud).

**Why:**

- The remote server returns **business data** (DAX query results) — patient rows
  in the ER estate. Consuming it breaks
  [.out-of-scope/0002](0002-metadata-only-no-business-data.md) (metadata only).
- It is a **cloud-hosted** endpoint, which breaks the sovereignty promise the
  whole pitch rests on ("runs inside your boundary, nothing leaves").
- We don't need it. Reflection, baseline scoring, and governed generation all run
  on **metadata** — the local server and PBIP files supply everything required.
  Querying live data is what Copilot users want; it isn't what the Engine needs.

**Principle:** The Engine sees structure, not values. The remote query server is
a different product for a different job.
