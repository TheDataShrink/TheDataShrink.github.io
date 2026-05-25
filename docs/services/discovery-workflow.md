# Discovery Workflow — Delivering The Reflection

How [The Reflection](../product/the-reflection.md) is actually delivered, step
by step, inside a customer's boundary. This is the operational playbook behind
the offer.

The whole engagement is **metadata-first** and **sovereign by default**: no
business data is read, and nothing leaves the customer boundary.

---

## At a glance

| Stage | Name | Duration | Headline output |
| --- | --- | --- | --- |
| 0 | Sovereign setup | 2–3 days | Tooling running inside their boundary |
| 1 | Synthetic proof | 1–2 days | The Reflection demonstrated on synthetic data |
| 2 | Estate ingestion | 2–4 days | Estate Inventory (metadata only) |
| 3 | Reflection build | 3–5 days | The Architecture Reflection + Capability Baseline |
| 4 | Opportunity & roadmap | 2–3 days | Opportunity Map + Remediation Roadmap |
| 5 | Enablement & handover | 1–2 days | Team trained, tooling left behind |

Total: ~2–4 weeks depending on estate size and security onboarding.

---

## Stage 0 — Sovereign setup

**Goal:** prove, before any data is touched, that the platform runs entirely
inside their boundary.

- Deploy the agent runtime locally (Docker / VM / air-gapped) inside their
  tenancy. See [agent runtime](../agents/agent-runtime.md).
- Confirm the network posture: metadata-only, no external egress, offline
  inference where required.
- Agree read-only access scope to PBIP repositories and/or the Power BI REST
  metadata APIs. **Read-only. Metadata only.**

**Customer provides:** a sandbox/VM inside their boundary; read-only metadata
access; a named technical contact.

---

## Stage 1 — Synthetic proof

**Goal:** de-risk procurement. Show the full Reflection experience on
synthetic data so the agency sees the outcome before exposing anything real.

- Run the `reflect-architecture` and `generate-architecture-visuals` skills
  against a synthetic PBIP estate.
- Walk the stakeholder through the interactive map.

This is the moment that converts scepticism into curiosity, with zero exposure.

---

## Stage 2 — Estate ingestion (metadata only)

**Goal:** build the canonical metadata picture of their real estate.

Ingest, as metadata only:

- reports, pages, visuals
- datasets, semantic models, measures, relationships, hierarchies
- refresh jobs and refresh chains
- gateways and source references
- external dependencies (SharePoint Excel, CSV, manual mappings)

**Output:** the **Estate Inventory** — the structured catalogue.

See [requirement 001 — PBIP integration](../requirements/001-pbip-integration.md)
and [requirement 003 — lineage agent](../requirements/003-lineage-agent.md).

---

## Stage 3 — Reflection build

**Goal:** turn the inventory into understanding.

- Build semantic topology: report-to-model relationships, shared dimensions,
  measure reuse, lineage flows, semantic anchors.
- Surface consumption patterns and semantic hotspots.
- Produce the interactive **Architecture Reflection** artefact.
- Produce the **Capability Baseline** (the scored maturity axes).

Throughout this stage, language stays reflective — "appears to", "functions
as", "likely serves". No critique yet. (See the `reflect-architecture` skill
and [ADR 0002](../adr/0002-reflection-before-optimisation.md).)

---

## Stage 4 — Opportunity & roadmap

**Goal:** only now, with understanding established, introduce findings.

- Generate the **Opportunity Map**: prioritised, plain-language findings with
  estimated impact (hidden dependencies, performance risks, drift/duplication).
- Generate the **Remediation Roadmap**: staged, human-governed, what-first.

All findings are advisory. Nothing is changed in any production system. See
[human-in-the-loop governance](../governance/human-in-the-loop.md).

---

## Stage 5 — Enablement & handover

**Goal:** lift capability and leave.

- Working session: teach the team to read the map and the baseline.
- Leave the local tooling so they can re-run the Reflection.
- Agree the optional follow-on (Phase 2 pilot optimisation) — but only if they
  want it.

The engagement ends with the team **more capable than when you arrived**, and
the artefacts in their hands.

---

## Inputs required from the customer (summary)

- A sandbox/VM inside their boundary (Docker or VM).
- Read-only, metadata-only access to PBIP repos and/or Power BI metadata APIs.
- A named technical contact and a named business stakeholder.

## What the customer never has to give up

- No business data leaves the boundary.
- No production system is modified.
- No ongoing dependency on us is created.
