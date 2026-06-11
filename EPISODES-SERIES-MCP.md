# Series: The Engine Gets a Socket — Building the Data Shrink MCP Server

A 6-episode arc on building `datashrink-mcp-pbip`: an MCP server that gives any AI
agent governed hands over a Power BI estate. Continuation of the applied track
(Northvale ED / "the agent rebuilds the report" / "the development wheel") — the
method became an Engine; this series makes the Engine a product any agent can call.

**Format:** applied-track voice (~6–9 min read per episode), one real colocated
artifact per episode — actual outputs of the server against the 19-project PBIP
test estate, never constructed examples.

**Through-line:** trust is built in the same order for software as for consulting.
Read → index → write-behind-a-gate → own the unowned layers → prove it
adversarially. Each episode adds one capability and one piece of evidence.

**Source material:** the real build — `mcp-pbip/` in the PBIB workspace
(package `datashrink_pbip`, v0.2.0, 24 `pbip.*` tools, 41 unit tests), its design
doc `building-mcp.md`, and the live testing session of 2026-06-11.

---

## Episode 1 — The layer nobody owns

- **Slug:** `the-layer-nobody-owns`
- **Hook:** Microsoft ships two Power BI MCP servers. Neither touches the layer the organisation actually experiences.
- **Sections:** the Engine needs a socket; what MCP is (one paragraph, deferring to agent-series Ep 2); the Microsoft baseline table; the unowned report/governance/M layer as the moat; why PBIP-as-text makes it buildable; the four design invariants (filesystem as truth, diffable text edits, side-effect-free scanning, delegation to Modeling MCP).
- **Artifact:** none (thesis episode).

## Episode 2 — A server that only reads

- **Slug:** `a-server-that-only-reads`
- **Hook:** The first version cannot write — not "doesn't," cannot. That's why it sold.
- **Sections:** read-only as a trust posture (the HIPAA-shaped sentence, ported to software procurement); the reflection tools (`project.list/inventory`, deep TMDL parser, `report.list_pages`, `portfolio.audit`); the doc generators as automated narration; the honest seam — writing *about* the estate vs writing *the* estate; read-only as a complete sellable governance product.
- **Artifact:** `01-inventory-excerpt.json` — real `semantic_model.describe`-level scan of the comparative income statement project (10 pages, 4 tables, 5 measures with DAX).

## Episode 3 — A registry of decisions

- **Slug:** `a-registry-of-decisions`
- **Hook:** The least interesting-sounding episode contains the idea the write path stands on.
- **Sections:** `component.libraries/search/get`; what a module actually stores; the **binding contract** (human-readable slot → model-reference prose, not literal PBIR); why literal-JSON templates rot (snapshot vs intent — entropy with a version number); resolution against the live scan as a governance check; search as agent context-loading.
- **Artifact:** `01-binding-contract.json` — the real contract of the multi-year account waterfall module.

## Episode 4 — The write path

- **Slug:** `the-write-path`
- **Hook:** Keep, inside a server that edits files, the property that made the read-only server safe: the worst case is nothing happens.
- **Sections:** the authoring verbs (`visual.insert/update/delete`, `report.create_page/delete_page`, `component.stamp`); **stage → validate → commit**; dry-run by default; validation vetoes `write=True`; backups + git as outer nets; stamp *builds* PBIR from contract + live model, never pastes; PBIR-preview honesty note.
- **Artifact:** `01-two-phase-results.json` — real captured pair: a dry-run insert, and a `write=True` stamp **blocked** by `unbound_slot` errors with zero bytes written.

## Episode 5 — The layer Microsoft cannot touch

- **Slug:** `the-layer-microsoft-cannot-touch`
- **Hook:** Modeling MCP explicitly stops above Power Query. That's where the spreadsheets hide.
- **Sections:** `m.read` / `m.lint` (hard-coded paths, local-file deps, embedded secrets); the portfolio run — **71 hard-coded paths, 77 local-file dependencies, 2 of 19 projects clean**; the dependencies-in-plain-sight callback (m.lint = the blast-radius question as a standing tool); the honest disclosure (it's our own estate); `theme.read/apply` as governed branding at report scope.
- **Artifact:** `01-m-lint-portfolio.json` — unedited lint output across all 19 projects.

## Episode 6 — Proving it real

- **Slug:** `proving-it-real`
- **Hook:** An AI agent tested the server that gives AI agents hands.
- **Sections:** three levels of proof — (1) the wire: a real MCP stdio client, 14/14 checks, incl. two harness-side bugs as evidence of why protocol testing matters; (2) trying to make it lie: the deliberate wrong-slot `write=True` stamp refused with zero bytes written, then the correct stamp committed (the gate witnessed from both sides); (3) the renderer: Power BI Desktop loads the server-authored page/visuals; the engagement loop (propose → review → commit → render → diff); the roadmap coda (multi-tenant remote, M auto-patching, schema-shim tests).
- **Artifact:** `01-smoke_mcp_client.py` — the actual 14-check protocol harness.

---

## Cross-references woven in

- Agent series Ep 2 (give-it-hands) — MCP as "hands for every agent."
- Agent series Ep 6 (evaluation) — demos pass, evals decide; quoted in Ep 6.
- Applied track: estate-as-we-found-it / reading-the-map (reflection → read layer),
  dependencies-in-plain-sight (blast radius → m.lint), the-library (modules →
  registry), the-first-custom-visual (brand-impossible-to-violate → theming),
  the-agent-rebuilds-the-report (the generate-time gate → the protocol-boundary gate),
  the-development-wheel (cadence → the server itself as a photograph).

## Open questions before publishing

- Series title on the site: "The Engine Gets a Socket" vs something plainer.
- Whether Ep 5's "our own estate has 148 findings" disclosure needs softening for
  client-facing positioning (recommendation: keep — it's the strongest paragraph).
- ~~Link policy to the `mcp-pbip` repo~~ — decided 2026-06-11: the PBIP repo is
  **private**; episodes must not link to it. Colocated artifacts are the public
  face of the build (sanitized — no local paths).
- Whether Ep 6 should embed the actual Desktop screenshot once taken.

## Status

- **2026-06-11**: Outline locked; all 6 episodes drafted. Artifacts generated from
  the live server (not mocked): inventory excerpt, binding contract, two-phase
  results (incl. the real blocked commit), portfolio M-lint, protocol harness.
- **2026-06-11 (later)**: Site infrastructure blocker cleared — the series is
  registered in `src/episodes/index.ts` as series id `the-engine-gets-a-socket`
  (order 2, after the applied and agent tracks), episodes numbered 1–6.
  `npm run build` passes; artifacts verified free of local paths. Working title
  "The Engine Gets a Socket" used on the index — still open to a plainer title
  (one string in `SERIES` to change).
- **Pending**: Desktop screenshot for Ep 6; final title pass; commit + publish
  (all six episode folders, the registry edit, and this file are untracked —
  deliberately left uncommitted for owner review).

## Files written

```
src/episodes/
  the-layer-nobody-owns/                prose.md
  a-server-that-only-reads/             prose.md  01-inventory-excerpt.json
  a-registry-of-decisions/              prose.md  01-binding-contract.json
  the-write-path/                       prose.md  01-two-phase-results.json
  the-layer-microsoft-cannot-touch/     prose.md  01-m-lint-portfolio.json
  proving-it-real/                      prose.md  01-smoke_mcp_client.py
EPISODES-SERIES-MCP.md
```
