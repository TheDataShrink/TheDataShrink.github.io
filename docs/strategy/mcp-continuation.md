# Continuing where Microsoft's Power BI MCP left off

Microsoft shipped two Power BI MCP servers (preview, [overview](https://learn.microsoft.com/en-us/power-bi/developer/mcp/mcp-servers-overview)):
a **remote** server (query semantic models, Copilot-generated DAX, Fabric-hosted)
and a **local** server (author models — TMDL, measures, relationships; runs on
your machine). They are the *plumbing*. They do not reflect an estate, score its
entropy, enforce a governance standard, or generate governed modules. That gap —
*semantic architecture intelligence* — is what the Engine continues.

This doc records the architecture decisions from the grilling session
(2026-05-26).

## What we're building (decision: B)

Not a competing server, and not a fork of Microsoft's. The **Engine Runtime** is
an **MCP aggregator server**: it exposes the Data Shrink intelligence as tools to
the customer's host (e.g. GitHub Copilot in VS Code), and is itself a **client**
of Microsoft's *local* server, to which it delegates low-level model writes.

```
VS Code (host) → Copilot (client) → Data Shrink MCP server   → Microsoft local MCP server
                                     (Engine Runtime)            (TMDL / model authoring)
                                     reflect · score ·         → PBIP files in a git branch
                                     validate · generate
```

Server to the host; client to Microsoft. We add a *higher-order* layer; we never
replace their query or authoring servers.

## Tools (v1) — the Data Shrink MCP server surface

Five orthogonal tools, mapping to the method's arc (reflect → score → validate →
generate → remediate). Decided 2026-05-26; recommended granularity, pending a
confirm pass.

| Tool | Input | Output | R/W | Backed by |
| --- | --- | --- | --- | --- |
| `reflect_estate` | path to a PBIP project | semantic topology **+ lineage** (nodes/edges), the same model that drives the Ep 1–2 visuals | read | `pbip_project_analyzer.py` |
| `score_baseline` | a reflected estate | capability baseline: per-axis scores + findings, each tagged with the rule it fails | read | `validation_tools.py` |
| `validate_change` | a proposed change (measure def, model edit) | pass / violations with severity | read | the estate's rule config (`hospital_er.yaml`-style) |
| `generate_module` | module type + certified bindings | a governed module written to the branch | **write (branch)** | `module_generator.py` |
| `propose_remediation` | a finding id / target | candidate TMDL/model edits on the branch, delegated to Microsoft's local server | **write (branch)** | Microsoft local MCP server |

**Two invariants that keep the surface honest:**

1. **Read tools never touch files.** `reflect_estate`, `score_baseline`,
   `validate_change` are pure reads over metadata.
2. **Every write tool calls `validate_change` first.** `generate_module` and
   `propose_remediation` run the gate internally before writing, so the Engine
   *cannot* write a change that fails the estate's own rules — and they only ever
   write to a branch ([ADR 0003](../adr/0003-engine-writes-to-version-control-not-production.md)).

`validate_change` is therefore both a standalone tool *and* the shared gate the
write tools depend on — one rule engine, two entry points.

## Boundaries (the decisions that keep it honest)

- **Branch-writes only** — the Engine writes to versioned PBIP/TMDL on a feature
  branch; the PR/merge is the human gate; never a live workspace.
  See [ADR 0003](../adr/0003-engine-writes-to-version-control-not-production.md).
- **Local server only** — we do not consume Microsoft's remote (query, cloud)
  server; it returns business data and breaks sovereignty.
  See [.out-of-scope/0004](../../.out-of-scope/0004-no-remote-query-mcp.md).
- **Metadata only** — the Engine sees structure, not values.
  See [.out-of-scope/0002](../../.out-of-scope/0002-metadata-only-no-business-data.md).
- **No production writes** — [.out-of-scope/0001](../../.out-of-scope/0001-no-production-writes.md).
- **Host-agnostic reasoning** — works with a cloud host (Copilot) or a fully-local
  model; the customer chooses by sovereignty posture.
  See [ADR 0004](../adr/0004-host-agnostic-reasoning-cloud-or-local.md).

## Relationship to `power-bi-template`

The [real repo](https://github.com/spectrumefficiencylimited/power-bi-template)
already holds the engine's *guts* — the Python analyzer, generator, validator, the
module library, the custom visual. The Engine Runtime is the **MCP skin** over
that: it wraps those capabilities as MCP tools and wires the model-write tools
through Microsoft's local server. The repo is the source of truth for behaviour;
this layer makes it agent-invocable.

## Why this is the moat, not a wrapper

Anyone can call Microsoft's MCP. The value is the *higher-order operations* and
the *rules behind them* — reflection-before-optimisation, the entropy/governance
scoring, the cross-estate pattern library that sharpens every quarter. Microsoft
gives the verbs (read model, write measure); we give the **judgement** (which
changes, in what order, against whose definition of good).
