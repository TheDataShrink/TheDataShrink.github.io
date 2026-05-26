# The estate as we found it

There is a temptation, the first time you open someone else's Power BI estate, to start counting the sins. The duplicated measures. The spreadsheet on SharePoint that turns out to be load-bearing. The model that takes seventy-three minutes to refresh. You can have a list of problems before you've finished your first coffee.

Resist it. Not because the problems aren't real — they are, and we'll get to every one of them — but because **leading with criticism is how you lose the room before you've earned it.**

This series is the applied track. We take one Power BI estate and walk it through the whole Data Shrink method, end to end. And the method begins, deliberately, with the part everyone wants to skip: **reflection before optimisation.**

## What reflection is

> **Architecture Reflection** — the process of visualising and explaining an enterprise analytics ecosystem *before* attempting optimisation or governance analysis. Reflection precedes critique. Trust precedes optimisation.

Reflection is not an audit. It is not a maturity scolding. It is not a failure report. It is the act of showing a team a clear, plain-English picture of *what they built* — and being able to explain it back to them more clearly than they could themselves.

That sounds modest. It is the most important thing you will do in the whole engagement, and here is why.

## An estate is an evolved system, not a design

Nobody sat down and *designed* the estate you're looking at. It accreted. A report was needed for a board meeting in 2021, so someone built it over a weekend. The rostering data only came out of the source system as a CSV, so a coordinator started exporting it by hand. Finance needed a number that wasn't in the gold layer yet, so the model reached past it and queried the warehouse directly — just for now, just until the proper table existed. The proper table never came.

Every one of those decisions was reasonable at the time. The estate is a fossil record of reasonable decisions made under deadline. The people who made them are usually still in the building, and they are usually proud of what they built — because it works, mostly, and it kept working while they were also doing their actual jobs.

If you walk in and your first move is to list what's wrong, you are telling those people that their reasonable decisions were stupid. They will defend the estate, and they will be right to, and you will spend the rest of the engagement pushing a boulder uphill.

If instead your first move is to *understand* it — to map it, narrate it, and show them you see why it looks the way it does — something different happens. They relax. They start telling you things the metadata can't: which report the CEO actually opens, which refresh everyone quietly works around, which spreadsheet "you absolutely cannot touch." Reflection is what earns you that conversation.

## Meet the estate

Everything in this series runs against a synthetic estate — **Awatea Regional Health**, a regional health authority I made up. Synthetic is not a compromise here; it's the point. The Data Shrink method reads *metadata only* — the structure of the estate, never the business rows inside it — and the real engagement starts on synthetic data precisely so the first proof requires access to nothing sensitive. We are eating our own cooking.

The estate is deliberately honest. It has the entropy a real one has:

- **Five reports**, two certified, three not, owned by five different teams.
- **Four semantic models**, ranging from a tidy 1.8 GB certified *Patient Flow Model* to a sprawling 2.1 GB, 40-table *Workforce Model* that nobody has certified and that takes seventy-three minutes to refresh.
- **A warehouse**, an immunisation API — and two pieces of shadow IT: `Bed_Capacity_Manual.xlsx` living on SharePoint, and `roster_export.csv` on a shared drive, both maintained by a human, by hand, on a schedule held together by memory.

The full estate — every node and edge — is in [`estate.json`](#) below. In the next episode we'll turn it into a map you can read at a glance. For now, just sit with the shape of it.

## What reflection is *looking* for

Reflection isn't passive admiration. While you're honouring the estate, you're quietly building the vocabulary you'll need later. You're watching for the shapes the method has names for:

- **Semantic anchors** — the assets everything leans on. The date dimension, the patient identifier, the org hierarchy. Find these and you've found the load-bearing walls.
- **Consumption patterns** — which models feed the certified reports, which feed the ones run off someone's laptop.
- **The honest dependencies** — including the ones that don't appear in any architecture diagram because they're a spreadsheet.

Notice what's *not* on that list: scores, gradings, recommendations. Those come later, and they land far harder once the team already trusts that you see the system the way they do.

## The drift we're not mentioning yet

Here is the discipline. Look at three measures in the estate:

| Report it feeds | Measure | How it's defined |
| --- | --- | --- |
| Executive Performance | `Total Patients` | `DISTINCTCOUNT(Encounter[NHI])` |
| Finance Monthly | `Total Patients` | `COUNTROWS(Admissions)` |
| Workforce & Roster | `Patient Count` | `SUM(Activity[PatientLoad])` |

Three reports. Three numbers. The same words on two of them. This is **semantic drift** — the same business metric evolving differently across teams — and it is exactly the kind of finding that, delivered too early, sounds like *"your executives have been looking at three different truths and calling them the same thing."* Which is true, and which is a terrible opening line.

We *see* it now. We write it down. We do not *lead* with it. It becomes a finding in the Opportunity Map, two episodes from now, after we've shown the team their estate clearly enough that the drift is something we discover *together* rather than something I accuse them of.

That ordering — see early, surface late, always after understanding — is the whole method in one move.

## The reflex to build

Reflection before optimisation. Trust before critique. Understand the system as an evolved, human thing before you touch a single measure.

It is not the fun part. The fun part is the refactor, the 73-minute refresh you cut to nine, the certified model that finally replaces the spreadsheet. We'll do all of it. But every one of those wins is *cashing a cheque that reflection wrote.* Skip it and the team fights you. Do it well and they hand you the keys.

Next episode: we take `estate.json` and build the map — the semantic topology of the whole estate, on one screen, that you can read out loud to a room of people who built it.
