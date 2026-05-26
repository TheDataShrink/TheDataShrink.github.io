# What "good" looks like here

We've earned it. Three episodes of reflection — the map, the anchors, the blast radius — and we never once said *optimisation*. We catalogued the drift, the shadow IT, the broken date model in the language of consequences, in front of the people who built the estate, and they trusted us with it. That trust is the asset, and now we get to spend it.

But not yet on fixes. On a definition.

Because "optimisation" is meaningless until you've answered *optimise toward what?* And the answer is never the generic best-practice checklist you could copy off a Microsoft docs page. The answer is **this estate's own definition of good** — specific to this team, these constraints, this risk appetite. In healthcare it's sharper still, because "good" has rules with severity levels attached.

## A number they can show upward

> **The Capability Baseline** — a scored maturity assessment across a small number of axes. Gives the team a number to improve and something to show their own executives.

Five axes. Each scored 0–5, from the reflection — metadata only, no new data gathering. And here's what makes this estate's baseline different from a generic one: **each axis maps to a real validation rule** in the template the engine runs. These aren't opinions; they're the rules with `severity: error` and `severity: critical` next to them.

The scorecard above is doing three jobs at once.

**It's honest without being cruel.** Every score has a *why* and a *rule*. "Semantic governance: 1.5 — 'Number of Patients' defined three ways → `patient_count_distinct` (error)." That's not a new accusation. It's the drift from Episode 1, given a coordinate and a rule reference. They've already seen it. The number just totals it.

**It's a baseline, not a verdict.** The word is deliberate. A verdict is a judgement you pass on someone; a baseline is a starting line you measure *progress* from. "1.5 overall" isn't "you're failing" — it's "this is where the wheel starts, and in two quarters you'll show your executive a bigger number." Reframing the same score from judgement to trajectory is the difference between a defensive room and a motivated one.

**It's defensible internally.** The official who brought us in has to justify the spend. "We hired a consultant and they said nice things" doesn't survive a budget review. "We baselined at 1.5 across five governance axes — including a HIPAA-critical RLS gap — here's the roadmap to 3.0" survives anything.

## Why these five axes

They aren't arbitrary. Each is the measurable shadow of a rule the template already enforces:

| Axis | Validation rule | Where you saw it |
| --- | --- | --- |
| **Semantic governance** | `patient_count_distinct` (error) | the three "Number of Patients" |
| **Time intelligence** | `no_datetime_joins` + `calendar_table_required` (error) | Exec Summary's DateTime join |
| **Reuse / conformance** | `no_hardcoded_sla` (warning) | the 30-min SLA hard-coded in three visuals |
| **Performance posture** | — | the 1.28 GB, 47-min Exec Summary |
| **Compliance & shadow-IT** | `patient_details_security` (critical) | Patient Details with no RLS |

A team can argue with an adjective. They cannot argue with "Patient Details has no row-level security and the rule for that is `critical`," because we showed them the map and the rule is the template's, not ours. The baseline works precisely because reflection came first — every score is a receipt for something already on screen.

## "Good" is the gap, not the ceiling

Here's the move that turns a baseline into a strategy. You don't define "good" as 5/5 on every axis. An emergency department does not need a perfect score on reuse. **Good is the specific gap that, if closed, removes the most risk for the least disruption** — for *this* estate.

Look at the two 1.0s. Time intelligence and Compliance/shadow-IT are tied for lowest, but they are not equally urgent. Compliance is a 1.0 *and* its rule is `critical` — its failure mode is "row-level patient data exposed to people who shouldn't see it." Time intelligence is a 1.0 whose failure mode is "the month-over-month chart lies." Both are real. Only one of them is a notifiable privacy breach.

So "good," for Northvale, starts as: *close the HIPAA RLS gap on Patient Details first* — non-negotiable, `critical` — *then* fix the patient-count drift to `DISTINCTCOUNT` (one certified measure, three reports corrected at once), *then* the date model so time intelligence can be trusted. The baseline didn't just measure the estate; it **sequenced the work, severity-first.**

## This is the hinge of the whole method

Step back and look at the shape so far:

- Episodes 0–2 were **reflection**: understand, map, trace — build trust, change nothing.
- This episode is the **hinge**: convert understanding into *this estate's* definition of good, expressed as a baseline that sequences the work against real rules.
- Episodes 4 onward are **the Engine**: acceleration — and now every fix has a coordinate to move, a rule to satisfy, and a reason to be first.

That split mirrors the product exactly. The method is open: anyone can learn to run a reflection and score a baseline against published rules. The Engine is what runs it continuously, sharpens the scoring across every estate it sees, and keeps the number climbing without the team owning the R&D.

Next episode we stop talking and build something. The first custom visual — not a chart, a *contract* — the first brick of a library that makes the next report impossible to build wrong.
