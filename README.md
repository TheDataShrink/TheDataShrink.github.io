# The Data Shrink

The Data Shrink is a sovereign AI-powered analytics optimisation platform focused on Microsoft Power BI ecosystems.

The platform analyses:

- PBIP projects
- Semantic models
- DAX
- Data lineage
- Gateway dependencies
- Report structures
- Refresh patterns
- Governance maturity

The goal is to uncover hidden technical debt, optimise semantic models, reduce report latency, and improve enterprise analytics governance.

---

## Core Principles

- Sovereign deployment
- Human-in-the-loop governance
- Metadata-first architecture
- Knowledge graph reasoning
- Agent-driven discovery
- Explainable optimisation
- Enterprise-ready deployment

---

## Key Capabilities

- Semantic model analysis
- Power BI lineage mapping
- Dependency detection
- Knowledge graph generation
- Governance scoring
- SQL optimisation recommendations
- Shadow IT detection
- PBIP observability
- Performance remediation workflows

---

## Architecture Overview

```text
PBIP / Power BI / Synapse / SQL / SharePoint
                ↓
        Metadata Extraction Layer
                ↓
         Knowledge Graph Engine
                ↓
          Agent Runtime Layer
                ↓
      Recommendation Engine
                ↓
      Human Governance Review
                ↓
     Controlled Enterprise Rollout
```

---

## Deployment Model

The platform supports:

- Local Docker deployment
- VM-based deployment
- Air-gapped environments
- Sovereign enterprise environments

No customer data leaves the customer boundary.

---

## Current Focus

Version 1 focuses on:

- Identifying why Power BI environments become slow
- Detecting hidden dependencies
- Identifying semantic model misuse
- Discovering shadow Excel and SharePoint dependencies
- Recommending governed remediation paths

---

## Repository Layout

```text
/docs
  /adr             Architecture Decision Records
  /agents          Agent runtime and orchestration design
  /concepts        Foundational IP (semantic observability, entropy, reflection)
  /governance      Human-in-the-loop and governance design
  /requirements    Numbered, buildable requirement specs
  /roadmap         Staged product decomposition (V1 → V3)
  /strategy        Market timing and positioning
/skills            Composable, MCP-style agent skills
```

See [CONTEXT.md](CONTEXT.md) for the shared domain language and
[CLAUDE.md](CLAUDE.md) for the engineering operating model.

> Note: this repository also contains the public marketing site
> (`src/`, a Vite + React + Tailwind app deployed to GitHub Pages). The
> `/docs` and `/skills` trees are the product foundation; the site is the
> public-facing surface.
