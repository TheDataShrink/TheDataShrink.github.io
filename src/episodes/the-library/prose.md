# The library

Last episode ended with a confession: one brick is a trick. The variance waterfall is a satisfying demo — off-brand, mis-coloured charts become impossible — but a single visual doesn't change how an organisation builds reports. A *set* does. This episode we turn the brick into a library, and in doing so we change the unit of work from "a visual" to "a module."

This isn't aspirational. The library is real: [`modules/`](https://github.com/spectrumefficiencylimited/power-bi-template/tree/main/modules) in the template, with `kpi/`, `charts/`, `filters/`, and `layouts/` folders of module definitions. We'll use the ED set.

## What makes it a library, not a folder of visuals

You could put visuals in a folder and call it a library. It wouldn't be one. Three things turn a pile of bricks into a library, and all three are visible in the gallery and the module file below:

**One brand, defined once.** Every module carries `"primary_color": "#0066CC"` — the medical blue from the config. Not "everyone follows the style guide." *Generated from one source.* Change the brand in the config and every module — and every report built from them — moves together.

**A contract per module.** Look at the gallery. Each brick names the rule it guarantees:

- **ED KPI Strip** → *patient count must be DISTINCTCOUNT; SLA threshold from parameters.*
- **Variance Waterfall** → *variance coloured by meaning; polarity declared, never author-picked.*
- **SLA Gauge** → *colour zones (70/85) and target from config, never hard-coded.*
- **Day × Hour Heatmap** → *DISTINCTCOUNT of patients; sequential scale.*
- **Month-Year Slicer** → *bound to the Calendar table, never a raw DateTime column.*

Read those again against [Episode 3](/episodes/what-good-looks-like-here)'s baseline. Every failing axis has a brick whose contract *is* the fix. The patient-count drift, the hard-coded SLA, the missing calendar — each is now something the library refuses to let happen.

**A schema — the API.** Open `01-kpi-strip.module.json`. It's the real module shape: `module.name`, `type`, `category`, `dependencies` (`ER_Data`, `Calendar`), `measures_required`, and a `config` with the cards and their contracts. It renders nothing. Its job is to *declare what the module is and needs*, in a form something else can read.

## Why the schema is the important part

It's tempting to think the visuals are the library and the JSON is bookkeeping. It's the reverse.

A human author doesn't strictly need the schema — they can see the bricks in the visuals pane. But the schema is what lets the library be *consumed without a human in the loop*. `measures_required` says exactly what to bind; `dependencies` says what tables must exist; the `contract` fields say what must hold. That's a stable seam a machine can read.

That seam is the entire setup for the next episode. When the engine generates a report from a config, it does not drag anything. It reads the module definitions, binds the required certified measures, and writes the files. The library being machine-readable JSON is precisely what makes the method an *Engine* and not just a tidy way for one careful person to work.

> **Modular Visual Intelligence** — reports are *assembled* from governed modules rather than hand-built, so identity and knowledge are guarded by construction. The team shifts from building singular reports to **curating collective intelligence**.

## The shift this creates

A hand-built report is correct on the day it ships and drifts every day after. A library inverts the decay. Improve the KPI strip's accessibility once and *every* report that uses it inherits the fix, retroactively. Add a contract to catch a new failure mode and every future report is protected. The library *appreciates*. The template's own internal estimates suggest gains on the order of *much less time per visual, several times faster delivery, far fewer brand-guideline violations* (`MODULAR_SYSTEM_BENEFITS.md`) — illustrative, not independently benchmarked, and worth treating as direction rather than a guarantee until measured on a real estate.

That's no longer report-building. It's **curating collective intelligence** — the team's accumulated knowledge about what "good" means here, encoded in modules that enforce it.

## Still a tool a person uses — for one more episode

Be precise about where we are. We have a governed, branded, machine-readable library. A skilled author can now assemble safe reports faster, and the reports they make can't drift the way [Episode 1](/episodes/reading-the-map)'s did.

But it's still a person doing the assembling. The library made the work *safe and fast*; it didn't make it *repeatable without them*. That last step — turning "a careful person assembles from the library" into "the engine generates from a config" — is the next episode, and it's the moment the method stops being something you do and becomes something that runs.
