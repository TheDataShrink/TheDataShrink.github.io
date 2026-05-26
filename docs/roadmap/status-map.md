# Status Map — built · target · missing

A single picture of where The Data Shrink is right now: what is **built**, what
is **designed but not built**, and what is **missing**. Snapshot: 2026-05-26.

> Tip: this Mermaid diagram renders automatically when you view the file on
> GitHub.

```mermaid
flowchart TB
  classDef done fill:#14532d,stroke:#4ade80,color:#ecfdf5
  classDef warn fill:#713f12,stroke:#facc15,color:#fffbeb
  classDef design fill:#1e3a8a,stroke:#60a5fa,color:#eff6ff
  classDef missing fill:#1f2937,stroke:#f87171,color:#fee2e2,stroke-dasharray:5 3

  subgraph M["TIER 1 — THE METHOD · open · DONE"]
    direction TB
    F["Foundation<br/>CONTEXT · CLAUDE · README<br/>concepts x4 · ADRs 0001-0004 · out-of-scope x4"]:::done
    P["Product docs<br/>the-reflection · thesis · ladder<br/>pitch-rehearsal · discovery-workflow · applied-series"]:::done
    S["Skills<br/>reflect-architecture<br/>generate-architecture-visuals · grill-semantic-model"]:::done
    R["Requirements 001-004 · why-now · pbip-facts · template-repo"]:::done
  end

  subgraph E["APPLIED SERIES — the proof · BUILT, NEEDS FIXES"]
    direction TB
    EA["Reflection arc · Ep 0-2"]:::done
    EH["Hinge · Ep 3 capability baseline"]:::done
    EE["Engine arc · Ep 4-7"]:::done
    EX["build red — CodeBlock missing yaml lang<br/>Ep6 generator crashes on its own config<br/>Awatea to Northvale name · unsourced 85pct metrics"]:::warn
  end

  subgraph X["TIER 3 — THE ENGINE RUNTIME · DESIGNED, NOT BUILT"]
    direction LR
    H["Host<br/>Copilot or local model"]:::design
    DS["Data Shrink MCP server<br/>reflect · score · validate · generate · remediate"]:::design
    MS["Microsoft local MCP server<br/>TMDL model writes"]:::design
    GIT["PBIP on a git branch"]:::design
    PROD["Merged PR to CI/CD to production<br/>the human gate"]:::design
    H --> DS --> MS --> GIT --> PROD
  end

  subgraph MISS["MISSING / NEXT"]
    direction TB
    M1["MCP server implementation<br/>the 5 tools, for real"]:::missing
    M2["Wire to power-bi-template guts<br/>analyzer · generator · validator · visual"]:::missing
    M3["Req 006 — custom-visual-library build spec"]:::missing
    M4["Live synthetic-data Reflection<br/>the artefact for the pitch room"]:::missing
    M5["Episode code to real repo files<br/>+ record video companions"]:::missing
    M6["Report layer PBIR<br/>model layer first; report layer on GA"]:::missing
  end

  M ==> E
  E -. "concepts shown — now make them real" .-> X
  X ==> MISS
```

## Legend

- **Green — DONE.** Written, in the repo, coherent.
- **Amber — BUILT, NEEDS FIXES.** Shipped but with known defects (see below).
- **Blue — DESIGNED, NOT BUILT.** The architecture is decided in docs/ADRs; no
  running code yet.
- **Grey/dashed — MISSING.** Not started.

## What is built

- **The Method (Tier 1):** the whole documented foundation, product narrative,
  three skills, four requirements, four ADRs, the MCP continuation design, and
  the PBIP fact base. This is the open layer — done.
- **The Applied Series:** all 8 episodes, re-grounded on the real Northvale ED
  (hospital-ER) estate, with D3 artefacts and a multi-series episode engine.

## What needs fixing (built, but defective)

1. **Build is red** — `src/components/CodeBlock.tsx` is missing the `yaml`
   entry in `HLJS_NAME`; `tsc -b` fails, so the site can't deploy.
2. **Ep 6 demo crashes** — `module_generator.py` reads config keys
   (`has_calendar_table`, `uses_datetime_join`) that `hospital_er.yaml` does not
   have, so the gate raises instead of generating the modules the prose
   promises.
3. **Editorial** — `the-development-wheel/prose.md` still says "Awatea" (should
   be Northvale); the "85% / 3–5×" metrics are sourced only to an internal file
   and should be softened for a regulated buyer.

## What is designed but not built (Tier 3 — The Engine Runtime)

The MCP aggregator: a Data Shrink MCP **server** to the host, **client** of
Microsoft's *local* MCP server, writing TMDL to a git branch where the PR/merge
is the human gate. Fully specified in
[mcp-continuation.md](../strategy/mcp-continuation.md) and ADRs 0003/0004 — but
no server code exists yet.

## What is missing

- The **MCP server implementation** (the five tools as real MCP).
- **Wiring to `power-bi-template`** — the analyzer/generator/validator/visual
  that hold the actual behaviour.
- **Requirement 006** — the custom-visual-library build spec (referenced by the
  roadmap, not yet written).
- The **live synthetic-data Reflection** artefact for the pitch room.
- Pointing episode code at the **real repo files** and recording the **video
  companions**.
- The **report layer (PBIR)** — deliberately deferred until GA; model layer
  (TMDL) first.
