# The Data Shrink Accelerator

> **Land your first agentic Power BI capability — FAST.**
> The only project-based program that takes you from click-driven `.pbix` to
> code + agents working together, walked end-to-end on one real estate,
> sovereignly inside your own boundary.

A ten-module accelerator that teaches the open
[Method](../product/product-thesis.md) the same way it would be delivered: as
a single, honest journey on one estate. By the capstone you have a
Reflection-grade portfolio piece — the exact artefact a government agency
would buy.

## The MRE Method

The program rests on three habits that mirror the product ladder:

| Letter | Habit | Mirrors |
| --- | --- | --- |
| **M** — Method | Learn the craft openly. Read, write, and teach the way of thinking. | [The Method (Tier 1)](../product/product-ladder.md) |
| **R** — Reflection | Apply it to one real estate. Build the map, the baseline, the opportunity. | [The Reflection (Tier 2)](../product/the-reflection.md) |
| **E** — Engine | Wire agents to the work. Code, MCP, governed generation, sovereign delivery. | [The Engine (Tier 3)](../product/product-ladder.md) |

## Who this is for, and what changes

This is for the Power BI developer or team that knows their `.pbix`-clicking
days are numbered and wants the new craft before the market reorganises around
it. By the end you can:

- Read a Power BI estate as a system, not a folder of reports.
- Refactor a semantic model in **TMDL** — text, in git, on a branch.
- Build a **custom visual** that *is* a data contract.
- Drive an **MCP-aware agent** that proposes governed changes you approve.
- Deliver and *teach* a Reflection on a real estate — the artefact the buyer pays for.

## The capstone deliverable

Every module produces an artefact. The capstone composes them into a single
self-contained, sovereign-safe Reflection on the estate of your choice:

- a topology map (HTML/D3, runs offline)
- an estate inventory (metadata only)
- a capability baseline scored against the estate's own rules
- an opportunity map with a remediation roadmap
- a recorded walkthrough using the [/teleprompter](/teleprompter)

This is the same shape as a paid [Reflection](../product/the-reflection.md).
Graduates leave able to deliver one.

---

## The 10 modules

Each module = **one craft skill** + **one project step on Northvale ED** + **one identity/distribution habit** + **one artefact** you keep.

### Module 1 — Foundations: from `.pbix` to PBIP

- **Craft:** Why the singular-`.pbix` era is ending. PBIP, TMDL, PBIR — what each
  is, what's GA today and what is preview ([pbip-facts](../strategy/pbip-facts.md)).
  Stand up the developer stack: VS Code, git, Power BI Desktop, Tabular Editor,
  Power BI CLI.
- **Project:** Convert a real `.pbix` to PBIP. First commit on a feature branch.
- **Habit:** Rewrite your LinkedIn/GitHub identity as a *code-first Power BI engineer*.
- **Artefact:** Your first PBIP commit, public on GitHub.

### Module 2 — Reflection 101: reading the estate

- **Craft:** Architecture reflection. Reflective language. Metadata-only as a
  *principle*, not a limitation ([architecture-reflection](../concepts/architecture-reflection.md)).
- **Project:** Scan Northvale ED's PBIP; produce an estate inventory as `estate.json`.
- **Habit:** Write a public "what we found" post in reflective tone — no audit voice.
- **Artefact:** `estate.json` + the inventory post.

### Module 3 — Reading the map: semantic topology + a public portfolio

- **Craft:** Force-directed graphs in D3. Semantic anchors, hotspots, lineage clusters.
- **Project:** Render the Northvale ED topology as a single self-contained HTML.
- **Habit:** Publish a GitHub Pages portfolio. *Your* Reflection lives there.
- **Artefact:** Live topology page on your portfolio.

### Module 4 — Hidden dependencies: lineage + blast radius

- **Craft:** Tracing report → dataset → source → spreadsheet. Shadow IT detection.
- **Project:** Build the Northvale ED blast-radius lineage view in D3.
- **Habit:** Cold-message a Power BI lead with the blast-radius for a problem
  they posted about. *Be useful first.*
- **Artefact:** Blast-radius D3 + one warm conversation.

### Module 5 — The baseline: scoring an estate against its own rules

- **Craft:** Validation rules in YAML; capability axes; severity tiers.
- **Project:** Write `hospital_er.yaml` for Northvale ED. Score the estate. Render
  the baseline as D3.
- **Habit:** A teach-back: explain *why this estate scores what it does*, recorded.
- **Artefact:** `validation rules` YAML + baseline view.

### Module 6 — TMDL: the semantic model as code

- **Craft:** TMDL as the *supported* programmatic surface today. Tabular Editor.
  TOM API. Patient-count fix as a refactor.
- **Project:** Refactor Northvale ED's `Number of Patients` to `DISTINCTCOUNT` in
  TMDL, on a branch, with a PR.
- **Habit:** PR hygiene — small commits, clear titles, reviewable diffs.
- **Artefact:** A merged PR fixing a semantic drift in code.

### Module 7 — Custom visuals as contracts

- **Craft:** Why hand-built visuals fragment. The visual as a *contract* on the
  gold layer. Build your first.
- **Project:** Build the **variance waterfall** custom visual; demo it with sample
  data in a self-contained HTML.
- **Habit:** Brand it — colour, typography, accessibility. Identity bakes in.
- **Artefact:** Packaged visual + demo page.

### Module 8 — The library: modular visual intelligence

- **Craft:** A library of branded, governed modules that *know* the data
  contract ([modular visual intelligence](../concepts/modular-visual-intelligence.md)).
- **Project:** Define a **KPI Strip** module in JSON; render the gallery.
- **Habit:** Pair-teach the library to a colleague; their feedback shapes v2.
- **Artefact:** Module schema + gallery page.

### Module 9 — Agents on the estate: MCP + the development wheel

- **Craft:** Microsoft's local + remote MCP servers — what each does and the
  asymmetry. The Data Shrink MCP aggregator design (reflect · score · validate ·
  generate · remediate) and the branch-write
  governance posture ([ADR 0003](../adr/0003-engine-writes-to-version-control-not-production.md)).
- **Project:** Wire VS Code's Copilot to Microsoft's *local* MCP server. Ask the
  agent to add a calendar table to TMDL on a branch. Reject a bad config and
  watch the gate hold.
- **Habit:** "Trust precedes optimisation" in code review — the human approves; the
  agent never bypasses.
- **Artefact:** A merged agent-authored PR with the gate's validation log attached.

### Module 10 — The capstone: your first Reflection

- **Craft:** Compose everything into a Reflection-grade deliverable for an estate
  of your choice (your own, your employer's anonymised, or a synthetic one).
- **Project:** Topology + inventory + baseline + opportunity map + remediation
  roadmap + a recorded walkthrough.
- **Habit:** Rehearse the [5-beat pitch](../product/pitch-rehearsal.md) on camera.
- **Artefact:** A self-contained, sovereign-safe Reflection package — the same
  shape a government buyer would pay for.

---

## Format (matches Avery's shape, not the brand)

- **Project-first.** No isolated lectures; every module is a step on the same estate.
- **Knowledge check** at the end of each module — the same five questions you'd
  ask a buyer about their own estate.
- **Live sessions** with the Spectrum Efficiency team for office hours and reviews.
- **Community** — graduates form the early cohort that gets first look at Engine
  releases.
- **Guest lectures** from PBIP engineers, government BI leads, and a regulated-buyer
  voice (sovereignty, audit, governance).
- **Bonus tracks**: cold-outreach to BI leads (be useful first), portfolio reviews,
  custom-visual deep dives.

## How this fits the product

The Accelerator *is* Tier 1 of the product ladder — the open Method, packaged.
Graduates know how to read, score, and Reflect on an estate; they are the
natural early adopters of the Engine and the natural carriers of the message
("the `.pbix` era is over") into their own organisations.

A small fraction of graduates will go on to deliver Reflections themselves —
that's healthy. The wedge is wider, not narrower, when many people speak the
method fluently.

## Status

Curriculum outline only. Lessons, project briefs, knowledge checks, and the
graduation rubric to be authored next. Tracked in
[roadmap](../roadmap/whats-next.md) under content-and-structure.
