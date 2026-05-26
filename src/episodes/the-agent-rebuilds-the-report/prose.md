# The agent rebuilds the report

Everything so far was a person doing careful work. Reflection was us, reading a map aloud. The baseline was us, scoring axes. Even the library — governed, branded, machine-readable — still needed a skilled author to assemble a report from it.

This episode the author leaves the room. A brief goes in; a finished, governed Power BI report comes out; no human drags a single visual. This is the line between *a method* and *an Engine*, and it's worth being precise about why it's now possible — because for most of Power BI's history, it wasn't.

## Why this couldn't be done with `.pbix`

A `.pbix` file is a compressed binary blob. An agent can't read it, can't write it, can't reason about it. For fifteen years, "build me a report" meant a person clicking — because the report *was* a binary artefact only the Power BI client could author.

`.pbip` changed the substrate. A Power BI Project saves the work as an open folder of plain text — a `<name>.SemanticModel/` folder (model metadata as **TMDL**) and a `<name>.Report/` folder (the report definition, **PBIR**: `definition.pbir` + `report.json`). The `.pbip` file at the root is just a *pointer* to the report folder; you can open the report straight from `definition.pbir`. The report layer and the model are decoupled, both human- and machine-readable.

> The shift from `.pbix` to `.pbip` is the wedge — not the headline. It's the enabler: code-first analytics, parallel assembly, and closed-loop CI/CD that compiles and validates.

**Now the honest part, because a sovereign buyer will check.** PBIP is in *preview*, and the two layers are not equally ready. The **semantic model is the supported programmatic surface today** — you can read and write its TMDL via the Tabular Object Model or by editing the text directly; generating measures, tables, and relationships is fully sanctioned. The **report layer is the frontier**: PBIR makes `report.json` text, which is what *enables* code-first assembly, but its schema is undocumented and editing it outside Power BI Desktop isn't supported during preview.

So the truthful version of this episode is: the assembler below shows the *shape* of code-first report assembly — the direction `.pbip` opens up — and the way you ship it safely today is to **let Power BI Desktop and Fabric validate the output** rather than treating `report.json` as a stable public contract. The fully-production-ready Engine work, right now, is on the model layer where the [entropy](../concepts/analytics-entropy.md) lives anyway. (Full notes: [`docs/strategy/pbip-facts.md`](../../docs/strategy/pbip-facts.md).)

## The orchestration, end to end

The shape, from brief to file:

```
brief  →  orchestrator (plan)  →  bind measures  →  lay out  →  report.json
```

1. **The brief.** "An executive patient-flow summary." A planner resolves that intent to module ids from the library — two KPI cards, a trend, a governed table. (In the demo the brief arrives pre-resolved; resolving natural language to modules is the orchestrator's job.)
2. **Bind measures.** Each module's registry entry declares what it needs. The assembler binds measures to those roles — and runs them through the same gate Episode 4's card used.
3. **Lay out.** Greedy placement on a 12-column grid using each module's declared `minSize`. No pixel math; the registry already said how big each brick wants to be.
4. **Emit.** Write the report definition into the `.Report` folder — `report.json` beside its `definition.pbir`.

The output is the second file in this episode. It's illustrative of the PBIR `report.json` shape — `sections` → `visualContainers`, each naming a module, a grid `layout`, and its `bindings` — not a byte-for-byte spec, because (as above) that schema is undocumented in preview. The point isn't the exact keys; it's that the report is now a *file an agent composes from the registry*, and that Power BI Desktop / Fabric are what validate it before it ships.

## The contract didn't relax — it moved earlier

Look at `assertGoverned` in the assembler. Before any module is placed, every `certifiedMeasure` input is checked against the estate's certified set. Bind an uncertified measure and the assembler **throws** — the report is never written.

This is exactly Episode 4's rule, but moved upstream. There, an uncertified measure rendered a warning *at view time*, on a card a human had already placed. Here, it's caught *at assembly time*, before a pixel exists. The Engine literally **cannot emit a drifting report.** The three "Total Patients" problem from Episode 1 isn't mitigated by review — it's structurally unreachable, because the only measures the assembler will bind are the certified ones, and the report carries `"certifiedOnly": true` in its provenance to prove it.

Notice how the whole series converges here. Reflection found the certification gaps. The baseline scored them and made `certified` a real flag. The library encoded it into each module's contract. And now the assembler enforces that contract at the moment of creation. Five episodes, one thread: *the metadata about what's trustworthy, propagated all the way to the act of building.*

## Why this is the product, not a parlour trick

A skeptic says: "fine, it generates a report — so does Copilot." The difference is what it generates *from*. A generic generator produces a plausible report from a prompt. This produces a **governed** report from a brief, because every brick it can reach is a contract and every measure it can bind is certified. It can only build right.

That's the moat made concrete. The open method — reflection, baseline, the idea of governed modules — anyone can learn. The Engine is the operationalised version: the orchestration, the registry, the assembler, the gate, running on every estate and getting sharper each time. A team could build their own. Most won't, for the same reason they don't machine their own car: they want the capability now, improving every quarter, without owning the R&D.

> **The Engine** — the recurring, compounding product: sovereign access to the continuously improving reflection/assembly system. The method is open; the Engine is paid.

## One thing left

We now have an Engine that reflects an estate, scores it, and rebuilds its reports — governed, branded, certified — from a brief. Run once, that's an impressive demo.

But a reflection is a *moment*. An estate keeps evolving the day after you leave: new reports, new measures, new spreadsheets quietly wired in. A one-time Engine run is a photograph of a thing that's still moving.

The last episode is about turning the photograph into a *film* — the cadence that keeps the baseline number climbing, and the cross-estate intelligence that makes the Engine worth more next quarter than it is today. The development wheel.
