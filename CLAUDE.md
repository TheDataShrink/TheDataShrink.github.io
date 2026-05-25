# The Data Shrink — Engineering Operating Model

This file orients any agent (or human) working in this repository. Read it
together with [CONTEXT.md](CONTEXT.md), which defines the shared domain
language. The domain vocabulary is specialised — use it precisely.

## What this repository is

Two things live here:

1. **The product foundation** — `/docs` and `/skills`. This is the
   specification, IP, and composable agent skills for a sovereign semantic
   observability platform for Microsoft Power BI ecosystems.
2. **The public site** — `/src` is a Vite + React + Tailwind app deployed to
   GitHub Pages (thedatashrink.github.io). It is the marketing/education
   surface, including the "Building an Agent from Scratch" episode series.

## The thesis (memorise this)

The Power BI layer is the truth surface of enterprise analytics. The dashboard
is rarely the root problem — it *exposes* upstream architectural entropy:
shadow Excel, gold-layer erosion, semantic drift, duplicated logic, hidden
dependencies. We make that entropy visible, explainable, and reducible —
sovereignly, inside the customer boundary, with humans in the loop.

## The V1 wedge

**Reflection before optimisation.** The first deliverable is *understanding*,
not criticism. We visualise and explain what the organisation built before we
score, flag, or remediate anything. See
[docs/concepts/architecture-reflection.md](docs/concepts/architecture-reflection.md)
and the `reflect-architecture` skill.

## Working principles

- **Honour the complexity.** Existing ecosystems are evolved systems shaped by
  real constraints. Never open with an audit or a failure report.
- **Trust precedes optimisation.** Use reflective language ("appears to",
  "functions as", "likely serves") during discovery. Reserve judgement until
  understanding is established.
- **Sovereign by default.** Everything must be able to run locally, in Docker
  or a VM, air-gapped, with no external data leakage. Prefer self-contained
  artefacts (static HTML + D3) over heavy frameworks or cloud coupling.
- **Human-in-the-loop is mandatory.** The platform discovers, analyses, and
  recommends. It never changes production systems automatically. Every
  recommendation must be explainable: why, expected impact, impacted assets,
  confidence, rollback.
- **Avoid AGI framing.** Enterprise buyers want explainability, determinism,
  observability, and governance — not "self-evolving autonomous intelligence."
- **Metadata first.** Start by ingesting metadata only, not data.

## Workflow discipline

- **Shared language first.** Keep [CONTEXT.md](CONTEXT.md) authoritative. If a
  new domain term appears, add it there.
- **ADRs for decisions.** Record significant architectural decisions in
  `/docs/adr/NNNN-title.md`. They compound over time.
- **Requirements are numbered and buildable.** `/docs/requirements/NNN-*.md`
  should be specific enough for an engineer to start.
- **Skills are small and composable.** Prefer many tiny, focused, MCP-style
  skills (`/skills/<name>/SKILL.md`) over giant monolithic prompts. A skill has
  a clear name, description, inputs, outputs, and governance posture.
- **Stage scope.** The vision is broad; the build is incremental. Keep
  `/docs/roadmap` honest about what is V1 vs later.

## Skill file convention

Each skill lives in `/skills/<skill-name>/` with:

- `SKILL.md` — frontmatter (`name`, `description`) + the operating instructions.
- `REFERENCE.md` — deeper background, patterns, and guidance (optional).
- `EXAMPLES.md` — worked input/output examples (optional).

## House style for writing in this repo

- Markdown, short declarative lines, generous headings — consistent with the
  existing docs.
- Australian/British spelling (optimise, visualise, behaviour) to match the
  product voice.
- Don't over-explain. Lead with the insight, then the detail.
