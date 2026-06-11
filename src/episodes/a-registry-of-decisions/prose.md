# A registry of decisions

> **Previously** — The server can [read everything and change nothing](/episodes/a-server-that-only-reads). Separately, the applied track's [library episode](/episodes/the-library) built a folder of governed visual components ("modules") — JSON files describing on-brand KPI cards, slicers, waterfalls. This episode connects the two: the library becomes searchable by agents, and we meet the idea the whole write path will stand on.

[The library episode](/episodes/the-library) of the applied track ended with a quiet claim: a governed module is *a decision, encoded* — this KPI card, in brand, bound to certified measures, impossible to assemble off-standard. This episode the server makes those decisions **discoverable**. Three tools: `pbip.component.libraries` finds every `modules/` folder and counts what's inside; `pbip.component.search` filters by free text, category, or visual type; `pbip.component.get` returns one component whole.

A registry over a folder of JSON files. It sounds like the least interesting episode of the series. It contains the idea the entire write path stands on.

## What's actually inside a module

Open the colocated `01-binding-contract.json` — the real contract of the multi-year account waterfall from the income-statement project's library. Look at the `data_bindings` block:

```json
"Values (AC)": "∑ Key Measures[AC] = CALCULATE(SELECTEDVALUE(PnL[Value], BLANK()), ...).
                AC returns the monetary value for the selected account in the selected year.",
"PreviousYear (PY)": "∑ Key Measures[PY] — uses integer year offset (VAR _PY = _year - 1)
                to look up the prior year value from PnL. Not DATEADD-based."
```

That is not machine configuration. That is a **paragraph** — what the slot is for, which measure satisfies it, *why the DAX works the way it does*, what the modelling constraint is (no calendar table; integer-offset time intelligence — and the contract says so). The component's slots aren't fields to fill; they're documented decisions with names.

> **Binding contract** — a component's declared data slots, written as human-readable model references (`Table[Measure]`, `Table.Column`) with the reasoning attached, rather than as literal report-layer query JSON.

## The decision hiding in that decision

Why prose instead of the literal PBIR query JSON the visual would actually contain — the raw report-layer JSON Power BI stores on disk? The first draft did store literal JSON, and it was a mistake worth dissecting, because it's the mistake every template system makes eventually.

A literal config is a *snapshot*: this visual, bound to these exact tables, in that exact report. Copy it into another report and one of two things happens. Either the table names happen to match — and you've built a system that works until someone renames a column, then fails inside a 4,000-line JSON blob nobody can read. Or they don't match, and you're regex-rewriting query JSON you don't control, in a schema that is *undocumented and in preview*. Both paths lead to the same place: a library that silently rots, which is [**analytics entropy**](/episodes/what-good-looks-like-here) with a version number — drift you installed on purpose.

The contract approach inverts it. The module stores the visual's *type* and its *named slots*. At stamping time — next episode — the server **builds** fresh, valid PBIR from the contract plus a binding map the agent supplies, resolving every reference against the live model scan from the read layer. The component carries the *intent*; the target estate supplies the *facts*. Nothing is copied that could go stale, because nothing is stored that was ever specific to a report.

And notice what the resolution step is, in method terms: checking `∑ Key Measures[AC]` against the scanned model *is* a governance check. If the measure doesn't exist in the target estate, the binding fails — loudly, by name, before anything is written. The same lookup that makes stamping possible makes drift impossible. One mechanism, both jobs.

## Search is for agents, not humans

A human with nine modules doesn't need search; they need a folder. The registry exists because the *agent* needs it. When an agent is asked "add a year-over-year waterfall to the planning page," its first move is `component.search(query="waterfall")` — and what it gets back isn't a file listing but the contracts: names, categories, visual types, slots, and the prose explaining what each slot wants. The registry is how the library's accumulated judgement gets *into the context window* at the moment of assembly.

This is the same trick the whole method keeps playing, one level down: put the metadata where the decision happens. [The map](/episodes/reading-the-map) put lineage in front of the room. The contract puts the modelling decision in front of the agent.

## The shelf is stocked

So the shelf is now indexed: nine governed components in the income-statement library alone — cards, slicers, the waterfall, the P&L matrix — each one searchable, each one carrying its own documentation and its own demands.

What we have not done is take a component off the shelf and put it on a page. That requires the server to do the thing phase one swore it couldn't: open a report's `definition/` folder and change it. Next episode, the write path — and the two-phase gate that makes "an AI edited the board pack" a sentence a governance team can hear calmly.
