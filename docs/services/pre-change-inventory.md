# Pre-Change Inventory

> **Nothing changes in the model until everything below is documented.**

This is the operational checklist that turns the principle —
[reflection before optimisation](../concepts/architecture-reflection.md) — into
a literal gate. It is the same inventory the Engine performs before its first
`generate` or `remediate` tool will run; running it as a human is how you
*understand* the estate, and writing it down is how you *prove* you do.

The pass is **backwards**: surface to source, dashboard to spreadsheet. You are
doing archaeology, not architecture. You don't get to start fresh.

## How to use this

- Tick every item that applies; mark **N/A** for items that genuinely don't.
  An untouched checkbox is a *gap*, not a default.
- Capture findings as metadata (lists, IDs, sizes, names) — never as the data
  itself. See [.out-of-scope/0002](../../.out-of-scope/0002-metadata-only-no-business-data.md).
- Treat **red flags** as stop signs: if you find one, document it and continue
  the inventory; do not start fixing.
- The output is the **Estate Inventory** artefact described in
  [the-reflection.md](../product/the-reflection.md) — a structured, navigable
  record, not prose.

---

## Stratum 1 — The Pain Surface (Visualisation)

The room you walked into. Capture what the business actually feels.

### Reports & pages

- [ ] Every report enumerated by workspace: ID, name, owner, last-published date.
- [ ] Per report: certification status (certified / promoted / neither).
- [ ] Per report: page count, visual count, custom-visual usage.
- [ ] Bookmarks, drill-throughs, page navigation, custom interactions noted.
- [ ] Mobile / paginated / embedded variants identified.
- [ ] **Pain log:** the actual user complaints — slow, wrong, broken, missing.

### Performance & freshness

- [ ] Worst-case page render time per report (the page that hurts).
- [ ] Refresh duration per dataset, last 30 days, distribution not just mean.
- [ ] Refresh failure history, last 30 days.
- [ ] The **90-minute-refresh question** answered explicitly: what's the slowest
      refresh in this estate, and what does the business currently do about it?

### Usage

- [ ] Active users per report, last 30 / 90 days.
- [ ] Pages actually opened vs pages that exist (dead pages are a finding).
- [ ] Exports to Excel / CSV — frequency and by whom (a quiet shadow-IT signal).

### Red flags at this stratum

- Refresh longer than the working day.
- Reports with no owner.
- Visuals exporting to Excel that get re-imported elsewhere — a *loop*.
- A "live" certified report behind a dataset that fails to refresh weekly.

---

## Stratum 2 — The Semantic Layer

Open every model. Inventory before you judge.

### Models

- [ ] Every semantic model: ID, name, owner, certification, storage mode mix
      (Import / DirectQuery / Dual / hybrid).
- [ ] Model size on disk; row counts per table; expanded vs compressed.
- [ ] Refresh schedule and partition strategy (incremental refresh?).

### Measures, columns, relationships

- [ ] Every measure exported (TMDL or via DAX Studio): name, table, expression.
- [ ] **Duplication map:** measures with the same expression under different
      names; same name under different definitions. (This is where semantic
      drift lives.)
- [ ] Calculated columns inventoried — *separately* from measures. A heavy
      calculated-column count is a red flag.
- [ ] Relationships: cardinality, cross-filter direction, active/inactive,
      ambiguous paths.
- [ ] High-cardinality columns (>1M unique) listed; whether they're actually
      used in visuals or just imported.

### Hierarchies, roles, perspectives

- [ ] Hierarchies and perspectives present.
- [ ] **RLS roles** enumerated; membership audited; tables they apply to.
- [ ] Object-level security usage.
- [ ] Calculation groups in use.

### Red flags at this stratum

- The same KPI defined three ways (the patient-count problem).
- A "fact" table that's actually a denormalised everything-table.
- Many-to-many relationships used to paper over modelling.
- Calculated columns doing work that belongs in SQL.
- An RLS role assigned to "Everyone" — usually means RLS doesn't actually exist.

---

## Stratum 3 — Movement (Medallion)

Trace every measure upstream. *Where does this number actually come from?*

- [ ] Bronze / silver / gold layer existence confirmed (or absence noted).
- [ ] For every key measure: the chain from visual → measure → table → source
      written out, end to end.
- [ ] **Bronze-direct queries flagged** — any visual or measure pulling from a
      raw ingestion table without going through gold. (Gold-layer erosion in
      plain sight.)
- [ ] Dataflows enumerated: name, owner, refresh, what feeds them, what they
      feed.
- [ ] Promotion path documented: who promotes silver → gold, by what criteria,
      how often.
- [ ] Certified semantic assets list — and the population of *uncertified* ones
      that production reports depend on.

### Red flags at this stratum

- Any visual querying a bronze table.
- A gold table that *also* has a SharePoint Excel join inside Power Query.
- A "gold" model with no documented promotion criteria — it's not gold, it's
  just named gold.
- Multiple semantic models redoing the same gold-shape work.

---

## Stratum 4 — Architecture (Power Query, dataflows, refresh chains)

Why is the data shaped the way it is, and where does that shaping happen?

### Power Query / M

- [ ] Every query in every model inspected and listed.
- [ ] Joins performed in Power Query identified — should usually be in SQL.
- [ ] Pivot / unpivot / group-by operations identified.
- [ ] **Query folding status** per query: folds / partially folds / does not
      fold. (Non-folding = client-side ETL = refresh pain.)
- [ ] Inline transformations that hardcode business rules (e.g. "30 minutes"
      as an SLA constant baked into the query).

### Dataflows

- [ ] All dataflows enumerated with owner, premium/Pro, capacity binding.
- [ ] Linked entities vs computed entities noted.
- [ ] Whether dataflows feed multiple models (reuse) or are 1:1 with a single
      report (waste).

### Refresh chains

- [ ] Dependency graph of refreshes: source → dataflow → semantic model →
      report cache.
- [ ] Refresh window timings; any overlaps with source-side ETL.
- [ ] Gateway dependencies: which gateway, who owns it, what happens if it
      dies tomorrow.

### Red flags at this stratum

- A Power Query that joins three sources and does not fold.
- An SLA threshold hardcoded in M (it belongs in a parameter or a contract).
- A refresh that starts before its upstream ETL has finished.
- A gateway with one owner who is on extended leave.

---

## Stratum 5 — Infrastructure (where the data physically lives)

The sediment. The actual estate is not a system; it's a deposit.

### Sources

- [ ] Every source system listed: SQL Server, Synapse, Fabric lakehouse,
      warehouse, SharePoint, Excel / CSV files, REST APIs, mainframe extracts.
- [ ] Authentication mode per source (service principal, Windows auth, OAuth,
      basic, anonymous — yes, this is asked because it does happen).
- [ ] Source-side RLS / object security state.
- [ ] Source ownership: a real human's name, per source.
- [ ] Source-side refresh / ETL window per source.

### The load-bearing-spreadsheet inventory (most critical)

- [ ] Every SharePoint Excel that feeds a production model — file path,
      who updates it, on what cadence, and *what fails if it doesn't update*.
- [ ] Every loose CSV — same questions.
- [ ] Every "email attachment of the week" file — same questions.
- [ ] Every manual data-entry sheet (charge nurse's triage capacity,
      timesheet exports, manual price lists, etc.).

### Capacity & licensing

- [ ] Power BI capacity / SKU; current utilisation; throttling events.
- [ ] Pro / PPU / Fabric SKU assignments per user/workspace.
- [ ] Cost — monthly, who pays, who could turn it off.

### Red flags at this stratum

- A SharePoint Excel updated by one person whose holiday breaks the dashboard.
- A source nobody owns ("it's been there since before Sarah left").
- A "service account" using a human's expiring password.
- Capacity throttling masked by 30-day-old cached refreshes.

---

## Cross-cutting — people, history, governance

These cut through every stratum and must be captured separately.

### People

- [ ] **A real human's name** against every report, every model, every source,
      every gateway. "The team" is not a name.
- [ ] Power BI workspace permissions audit: who is admin, member, contributor,
      viewer; service principals and groups expanded.
- [ ] Who has write access to source systems and SharePoint files.
- [ ] Who signs off changes — named, single point of authority per domain.

### History

- [ ] Activity log / audit log review, last 30–90 days: who edited what.
- [ ] Deployment pipeline history if one exists.
- [ ] Sensitivity labels in use; any data-loss-prevention policies.
- [ ] Known incidents in the last 12 months — wrong number on a dashboard, a
      breach scare, a refresh-failure escalation.

### Pre-change gates (must all be present before any write tool runs)

- [ ] **PBIP** form of the project exists, or conversion is the first change
      and is itself the PR.
- [ ] **Git repository** for the PBIP exists with a clear default branch.
- [ ] **A non-production workspace** for testing changes exists.
- [ ] **Pull-request review** is the change-promotion path (see
      [ADR 0003](../adr/0003-engine-writes-to-version-control-not-production.md)).
- [ ] **Synthetic or de-identified data** is available so the first changes
      run without touching live business data.
- [ ] **Rollback plan** documented for the first proposed change.
- [ ] **Named human approver** for the first change set, in writing.

> If any pre-change gate is missing, the answer is *fix the gate first*,
> not *skip the gate this once*.

---

## What the output looks like

A single navigable artefact (HTML/D3 or structured JSON+report) containing:

1. **Inventory** — every list above, as metadata.
2. **Topology** — the semantic + lineage graph (as Ep 1–2 ship).
3. **Pain log** — the user complaints, paired with their probable upstream
   cause from the inventory.
4. **Red-flag register** — every red flag found, with severity and stratum.
5. **Pre-change-gate status** — each gate green/amber/red with what's missing.
6. **Open questions** — anything the inventory exposed that no human in the
   room could answer ("who owns this dataflow?" "what does this Excel feed?").

The open-questions list is the deliverable that gets sent back into the team
before any optimisation work starts. *Closing those questions is the first
deliverable of the engagement*, not the model fix.

## What this is not

- Not an audit. The language stays reflective ("functions as", "appears to")
  per [architecture-reflection.md](../concepts/architecture-reflection.md).
- Not a list of failures. A red flag is a *thing to discuss with the team*,
  not a finding to publish.
- Not a one-time exercise. The inventory is re-run on every cadence pass —
  the estate keeps moving even when you're not looking.

## Related

- [discovery-workflow.md](discovery-workflow.md) — the engagement this fits inside.
- [pbip-facts.md](../strategy/pbip-facts.md) — what is supported to read and write.
- [the-reflection.md](../product/the-reflection.md) — the offer this evidence feeds.
- [whats-next.md](../roadmap/whats-next.md) — where this work sits on the path.
