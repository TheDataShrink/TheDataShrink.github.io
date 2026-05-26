# The agent rebuilds the report

Everything so far was a person doing careful work. Reflection was us, reading a map aloud. The baseline was us, scoring axes. Even the library — governed, branded, machine-readable — still needed a skilled author to assemble a report from it.

This episode the author leaves the room. A brief goes in; a finished, governed Power BI report comes out; no human drags a single visual. This is the line between *a method* and *an Engine*, and it's worth being precise about why it's now possible — because for most of Power BI's history, it wasn't.

## Why this couldn't be done with `.pbix`

A `.pbix` file is a compressed binary blob. An agent can't read it, can't write it, can't reason about it. For fifteen years, "build me a report" meant a person clicking — because the report *was* a binary artefact only the Power BI client could author.

`.pbip` changed the substrate. A Power BI Project saves the report as an open folder of JSON and TMDL — text. The report layer and the semantic model are decoupled, both human- and machine-readable. The moment the report became text, writing one became something an LLM is *good at*: it's just emitting structured JSON against a schema.

> The shift from `.pbix` to `.pbip` is the wedge — not the headline. It's the enabler: code-first analytics, parallel assembly, and closed-loop CI/CD that compiles and validates.

So the agent doesn't "drive the UI." It writes a file. Everything in this episode is just *generating `report.json` correctly* — and "correctly" is where the previous five episodes get paid back.

## The orchestration, end to end

The shape, from brief to file:

```
brief  →  orchestrator (plan)  →  bind measures  →  lay out  →  report.json
```

1. **The brief.** "An executive patient-flow summary." A planner resolves that intent to module ids from the library — two KPI cards, a trend, a governed table. (In the demo the brief arrives pre-resolved; resolving natural language to modules is the orchestrator's job.)
2. **Bind measures.** Each module's registry entry declares what it needs. The assembler binds measures to those roles — and runs them through the same gate Episode 4's card used.
3. **Lay out.** Greedy placement on a 12-column grid using each module's declared `minSize`. No pixel math; the registry already said how big each brick wants to be.
4. **Emit.** Write `report.json` — a real PBIP report definition Power BI opens directly.

The output is the second file in this episode. It's not a mock. It's the shape Power BI reads: `sections` → `visualContainers`, each naming a module, a grid `layout`, and its `bindings`.

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
