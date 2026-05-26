# The first custom visual

For three episodes we changed nothing. We mapped, traced, and scored — reflection, then a baseline that told us *shadow-IT exposure first, reuse second*. Now we build. And the first thing we build is not a fix to the estate. It's a brick.

A custom visual. But not the way you're picturing it — not "the bar chart but on-brand." If that's all a custom visual is, it isn't worth the toolchain. The reframe that makes the whole library worth building is this:

> A custom visual is a **contract on the gold layer**, expressed as a thing an author drags onto a canvas.

## Why reports drift in the first place

Go back to Episode 1's drift: three "Total Patients", three definitions, three numbers on executive reports. *How* did that happen? Not malice. The report author needed a patients number, opened the model they had, found *a* measure that looked right, and dropped it on a card. The card visual did its job perfectly — it rendered whatever number it was handed. It had no opinion about whether that number was the *governed* one.

That's the root cause. **The standard card visual is a willing accomplice.** It will render a certified gold-layer measure and a hand-rolled bronze hack with identical confidence and identical styling. Governance lives in a wiki nobody reads, so it doesn't live anywhere.

> **Modular Visual Intelligence** — a customer-shaped library of custom visuals that consume the governed data layer and bake in standards, governance, and brand identity. Reports are *assembled* from these modules rather than hand-built, so identity and knowledge are guarded by construction.

"Guarded by construction" is the whole idea. Move the governance *into the brick*, and a report becomes safe not because someone reviewed it but because it was impossible to build wrong.

## The contract, made literal

Here is the first brick: a **Governed KPI Card**. Its rule is one sentence — *a headline number may only come from a certified semantic measure, and its provenance is always visible* — and the visual enforces it physically.

Play with the demo. Three bindings, all from the Awatea estate, all the "total patients" intent:

- Bind the **certified** Patient Flow measure → you get a clean number and a green provenance line naming its source. Governed.
- Bind either **uncertified** measure (Finance's `COUNTROWS`, Workforce's `Patient Load`) → you do *not* get a number. You get an `UNGOVERNED SOURCE` warning that names the offending measure and tells the author exactly how to fix it.

An author who tries to recreate Episode 1's drift with this card *cannot*. The drift fix isn't a policy; it's a compile error.

## How it knows

The mechanism is unremarkable, which is the point — governance this strong shouldn't need cleverness. Look at the visual's `read()`:

```ts
const objs = meta.objects?.governance
return {
  certified: Boolean(objs?.certified ?? false),
  source: (objs?.qualifiedName as string) ?? meta.queryName,
  // ...
}
```

It reads a `governance` metadata object off the bound measure — the same `certified` flag the reflection scored back in Episode 3. The semantic layer already knows what's certified; the baseline made that knowledge explicit. The custom visual just *refuses to ignore it.* Everything connects: reflection found the certification gaps, the baseline scored them, and now the visual consumes that exact metadata to enforce the result.

That's why the library can only exist *after* reflection. A governed visual is worthless without a governed layer underneath it to point at. You earn the right to build bricks by first defining what "certified" means for this estate — which is precisely what the baseline did.

## One brick is a demo. The library is the product.

Be honest about what this episode is: one visual. By itself it's a nice trick. Its value is as the *first* of a set — KPI card, trend, variance, the team's standard table — each a contract, each carrying Awatea's brand and Awatea's governance rules. Once that set exists, the unit of report-building stops being "a visual" and becomes "a module," and something shifts:

- **Identity is guarded by construction.** Every report looks right because it's assembled from right-looking parts.
- **Knowledge is guarded by construction.** Every report is *correct* because the parts refuse incorrect inputs.
- The team stops hand-building singular reports and starts **curating collective intelligence** — improve the brick once, every report that uses it improves.

That last line is the hinge into the Engine. A hand-built report is a liability that decays. A library of governed modules is an asset that compounds — fix the KPI card's accessibility once and forty reports inherit it.

## Where this is going

We've built the first brick and shown it enforces a contract the reflection discovered. Next episode we make it a **library** — a reusable, branded, governed set — and the one after, we let the agent *assemble* a report by importing modules instead of dragging visuals one at a time. That's the moment the method stops being something a person does carefully and becomes something the Engine does repeatably, on every estate, getting sharper each time.

The number from Episode 3 has somewhere to go now. Every brick we add moves *reuse / conformance* off the floor — and the first time we point this card at a governed bed-capacity dimension instead of the spreadsheet, *shadow-IT exposure* moves too.
