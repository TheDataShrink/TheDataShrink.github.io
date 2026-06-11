# The write path

Phase one swore the server couldn't write. This episode it learns to — and the entire design problem is preserving, *inside* a server that edits files, the property that made the read-only version trustworthy: the worst case of any interaction is nothing happens.

The tools themselves read like a report author's verbs: `pbip.visual.insert`, `pbip.visual.update`, `pbip.visual.delete`, `pbip.report.create_page`, `pbip.report.delete_page`, and the headline — `pbip.component.stamp`, which takes a component from the registry, a target page, and a binding map, and puts a governed visual onto a real report. Every one of them shares a single discipline.

## Two phases, one gate

Every write tool runs the same pipeline: **stage → validate → commit.** Stage builds the complete planned change in memory — the full PBIR JSON of the new visual, the page entry, the file list. Validate resolves every field binding against the live model scan and checks every contract slot. Commit writes files — and *only* runs if two conditions hold at once: the caller passed `write=True`, **and** validation produced zero errors.

The defaults do the heavy lifting:

- **Dry run unless `write=True`.** An agent that calls `visual.insert` gets back the full preview — the exact JSON that *would* be written, the validation findings, the file paths — and the disk is untouched. The agent's natural workflow becomes propose → show the human → commit, because that's the path of least resistance.
- **Validation can veto a commit.** `write=True` is a *request*, not an override. Errors block the write no matter what the caller asked for.
- **Backups before harm.** Any overwrite or delete copies the original to a `.bak` first. And because every change is a text edit to files under version control, git remains the outer safety net behind the inner two.

The colocated `01-two-phase-results.json` shows both halves, captured from the real server against the real income-statement project. The first half is a dry-run insert: `ok: true, committed: false`, full preview attached. The second half is the one to study.

## The gate, tested by being wrong

In the second half, `component.stamp` is called on the waterfall component with `write=True` — and with the wrong binding slots, the generic `Values`/`Category` instead of the contract's named slots. The server's answer:

```json
"ok": false, "committed": false,
"validation": [
  {"level": "error", "code": "unbound_slot",
   "message": "Required binding slot 'Category (Year)' was not provided."},
  {"level": "error", "code": "unbound_slot",
   "message": "Required binding slot 'Values (AC)' was not provided."},
  ...
]
```

`write=True`, and **zero bytes written** — the response even lists the writes it *planned*, so the caller can see exactly what was refused. The contract from last episode is doing its job at the only moment that matters: the moment of creation. This is the agent-rebuilds-the-report gate again — *the Engine cannot generate a drifting report* — re-implemented at the protocol boundary, where the caller is no longer our own orchestrator but any agent anyone connects.

> **Two-phase authoring** — stage → validate → commit, dry-run by default, validation able to veto an explicit write. The property it buys: an agent's worst mistake is a refused plan, never a broken report.

## Stamp builds; it never pastes

It's worth saying precisely what `component.stamp` does when the bindings *are* right, because "applies a template" undersells it. The component stores no report-specific JSON — only the visual type and the contract. Stamp **builds** a fresh `visual.json`: it parses each binding (`∑ Key Measures[AC]` → measure `AC` on table `∑ Key Measures`; `PnL.Year` → column), resolves each against the scanned model — that resolution *is* the validation — and emits the PBIR projection structure from scratch, schema-stamped, positioned, named. The same builder backs plain `visual.insert` for visuals that don't come from the library.

The honesty note from the agent series still applies: PBIR is the frontier layer, its schema in preview. Building minimal, well-formed structures from a small vocabulary we control — rather than mutating arbitrary JSON we don't — is the conservative bet, and the final judge of correctness is Power BI Desktop itself. We'll put that judge on the bench, formally, two episodes from now.

## What the estate feels

Step back to the method. Reflection saw the estate; the baseline scored it; the library encoded *good*; the registry indexed it. The write path is where all of that **touches the estate back** — and the touch inherits every constraint upstream of it. A visual stamped through this path is in brand because the component is, correctly bound because the contract demanded it, and reviewable because it arrived as a diffable text change with a backup beside it.

Optimisation, finally — and it took four episodes of earned trust to get here, which is the point.

Next episode, the server goes where Microsoft's tooling explicitly doesn't: under the model, into Power Query — where we'll run one lint across nineteen projects and find a hundred and forty-eight reasons the M layer needed an owner.
