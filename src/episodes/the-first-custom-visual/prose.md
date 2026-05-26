# The first custom visual

For three episodes we changed nothing. We mapped, traced, and scored — reflection, then a baseline that told us *RLS first, patient-count drift second, date model third*. Now we build. And the first thing we build is not a fix to the estate. It's a brick.

A custom visual. But not the way you're picturing it — not "the column chart but on-brand." If that's all a custom visual is, it isn't worth the toolchain. The reframe that makes the whole library worth building is this:

> A custom visual is a **contract**, expressed as a thing an author drags onto a canvas.

The brick we'll use is real: [`seffMonthlyVarianceWaterfall`](https://github.com/spectrumefficiencylimited/power-bi-template/tree/main/custom-visuals/seffMonthlyVarianceWaterfall) from the template — an IBCS-style monthly variance waterfall. Below is a faithful sketch of it; the repo is the source of truth.

## Why reports drift in the first place

Go back to Episode 1's drift: the same "Number of Patients" counted three ways. *How* did that happen? Not malice. An author needed a patients number, opened the model they had, found *a* measure that looked right, and dropped it on a chart. The chart did its job perfectly — it rendered whatever number it was handed, in whatever colour the author clicked. It had no opinion about whether the number was governed or whether the colour meant anything.

That's the root cause. **A stock visual is a willing accomplice.** It renders a certified measure and a hand-rolled one with identical confidence, and it lets an author paint a regression in cheerful green because green was one click away. Governance and brand live in a wiki nobody reads, so they don't live anywhere.

> **Modular Visual Intelligence** — a customer-shaped library of custom visuals that consume the governed data layer and bake in standards, governance, and brand identity. Reports are *assembled* from these modules rather than hand-built, so identity and knowledge are guarded by construction.

"Guarded by construction" is the whole idea. Move the standard *into the brick*.

## The contract, made literal

The variance waterfall's contract is two sentences: *variance is coloured by meaning — favourable in the brand's good colour, unfavourable in its bad colour, never by author whim — and the palette is the organisation's, baked from the theme.* The author binds three roles (a category, an `actual` measure, a `previousYear` measure) and gets a correct, on-brand IBCS variance chart. They do **not** get a colour picker for "make the drop green."

Play with the demo. Two things to notice:

- Every bar's colour is computed from the *variance*, not chosen. Volume up vs last year → the brand's green; down → the brand's red. The author can't override it.
- Toggle to **"Avg Wait Time (up = bad)"**. The visual flips polarity — now a *rise* is unfavourable and goes red — because "good" is a property of the metric, declared once, not a colour the author remembers to invert. This is exactly the trap a stock chart walks into: someone copies the patient-volume chart for wait time and forgets that up is now bad. The brick can't make that mistake.

An author trying to recreate Episode 1's chaos — off-brand colours, a regression painted green — *cannot*. Those choices aren't exposed. They're baked.

## How it knows

The mechanism is unremarkable, which is the point. Look at the visual's `capabilities.json`: three data roles (`category`, `actual`, `previousYear`) and an `objects.theme` that exposes only the brand palette — `positiveStrongColor`, `negativeStrongColor`, `neutralColor`, a reference-line colour. There is deliberately *no* "bar colour" property for the author to set. The visual computes variance in `parse()` and resolves the fill from the theme by meaning. Brand and correctness aren't reviewed in; they're the only options the visual offers.

Tie this back: bind the `actual` role to the certified `DISTINCTCOUNT` patient measure from Episode 3, and you have a variance chart that is governed *and* on-brand *and* IBCS-correct — by construction, in one drag.

## One brick is a demo. The library is the product.

Be honest about what this episode is: one visual. By itself it's a nice trick. Its value is as the *first* of a set — the variance waterfall, a KPI strip, a gauge, a governed table — each a contract, each carrying the estate's brand and rules. Once that set exists, the unit of report-building stops being "a visual" and becomes "a module," and something shifts:

- **Identity is guarded by construction.** Every report looks right because it's assembled from right-looking parts.
- **Knowledge is guarded by construction.** Every report is *correct* because the parts refuse incorrect inputs and incorrect encodings.
- The team stops hand-building singular reports and starts **curating collective intelligence** — improve the brick once, every report that uses it improves.

That last line is the hinge into the Engine. A hand-built report is a liability that decays; a library of governed modules is an asset that compounds.

## Where this is going

We've built the first brick and shown it enforces a contract the reflection discovered. Next episode we make it a **library** — the real `modules/` set in the template, with its own schema — and the one after, we let the engine *assemble* a report by generating modules from a config instead of dragging visuals one at a time. That's the moment the method stops being something a person does carefully and becomes something that runs.
