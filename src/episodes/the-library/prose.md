# The library

Last episode ended with a confession: one brick is a trick. The Governed KPI Card is a satisfying demo — drift becomes a compile error — but a single visual doesn't change how an organisation builds reports. A *set* does. This episode we turn the brick into a library, and in doing so we change the unit of work from "a visual" to "a module."

## What makes it a library, not a folder of visuals

You could put four custom visuals in a folder and call it a library. It wouldn't be one. Three things turn a pile of bricks into a library, and all three are visible in the registry below:

**One brand, defined once.** Every module imports the same `BRAND` tokens — font, ink, accent, the good/warn/bad colours, the corner radius. Not "everyone follows the style guide." *Inherited from a single source.* Change the accent colour in one place and the whole library — and every report built from it — moves together. Identity stops being a discipline and becomes a property.

**A contract per module.** Each brick declares, in one sentence, the rule it guarantees:

- KPI Card → *headline must be a certified measure; provenance always shown.*
- Trend → *time axis must be a conformed date dimension — no ad-hoc date columns.*
- Variance → *actual and target share units; colour follows brand good/bad, never red-means-up.*
- Governed Table → *columns are certified measures only; dimensions must be conformed.*

These aren't documentation. They're enforced the way Episode 4's card enforced its rule: bind something that violates the contract and you get a governance state, not a wrong-but-pretty result. The library is a set of refusals as much as a set of renderers.

**A registry — the API.** This is the piece that earns the rest. `LIBRARY` is a typed list: each module's id, the inputs it binds, its contract, its minimum footprint on the grid. It renders nothing. Its whole job is to *declare what exists and what each module needs*, in a form something else can read.

Look at the gallery: four modules, one brand, each badged GOVERNED with its contract on the card. That's the product an author sees. The registry is the same library seen by a machine.

## Why the registry is the important part

It's tempting to think the visuals are the library and the registry is bookkeeping. It's the reverse.

A human author doesn't strictly need the registry — they can see the bricks in the visuals pane and read the contracts. But the registry is what lets the library be *consumed without a human in the loop*. It's a stable seam: `moduleById('tds.kpiCard')` returns everything you need to know to place that module correctly — what to bind, what it guarantees, how much space it needs.

That seam is the entire setup for the next episode. When the agent assembles a report (Episode 6), it does not look at pixels or drag anything. It reads the registry, picks modules, binds certified measures to their declared inputs, and lays them out using `minSize`. The library being machine-readable is precisely what `.pbip` made possible for the report layer — and it's why this method becomes an *Engine* and not just a tidy way for one careful person to work.

> **Modular Visual Intelligence** — reports are *assembled* from governed modules rather than hand-built, so identity and knowledge are guarded by construction. The team shifts from building singular reports to **curating collective intelligence**.

## The shift this creates

Here's the line from the registry's closing comment, because it's the whole economic argument:

> A hand-built report is a liability that decays; a library is an asset that appreciates.

A hand-built report is correct on the day it ships and drifts every day after — a measure gets swapped, a colour gets tweaked, someone copies it and forgets why a filter was there. Entropy, exactly as we defined it in Episode 2.

A library inverts the decay. Improve the KPI Card's accessibility once — better contrast, a screen-reader label — and *every* report that uses it inherits the fix, retroactively, without anyone touching those reports. Add a contract to catch a new failure mode and every future report is protected from it. The library *appreciates*: it's worth more next quarter than this one, because every lesson learned anywhere gets baked into the brick and propagates everywhere.

That's no longer report-building. It's **curating collective intelligence** — the team's accumulated knowledge about what "good" means here, encoded in objects that enforce it.

## Still a tool a person uses — for one more episode

Be precise about where we are. We have a governed, branded, machine-readable library. A skilled author can now assemble safe reports faster than before, and the reports they make can't drift the way Episode 1's did.

But it's still a person doing the assembling. The library made the work *safe and fast*; it didn't make it *repeatable without them*. That last step — turning "a careful person assembles from the registry" into "the Engine assembles from a brief" — is the next episode, and it's the moment the method stops being something you do and becomes something that runs.
