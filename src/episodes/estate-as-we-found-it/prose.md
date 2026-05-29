# The estate as we found it

There is a temptation, the first time you open someone else's Power BI estate, to start counting the sins. The patients counted three different ways. The thirty-minute SLA hard-coded into a dozen visuals. The row-level patient table with no security on it. You can have a list of problems before you've finished your first coffee.

Resist it. Not because the problems aren't real — they are, and we'll get to every one — but because **leading with criticism is how you lose the room before you've earned it.**

This series is the applied track. We take one Power BI estate and walk it through the whole Data Shrink method, end to end. And the method begins, deliberately, with the part everyone wants to skip: **reflection before optimisation.**

## What reflection is

> **Architecture Reflection** — the process of visualising and explaining an enterprise analytics ecosystem *before* attempting optimisation or governance analysis. Reflection precedes critique. Trust precedes optimisation.

Reflection is not an audit. It is not a maturity scolding. It is the act of showing a team a clear, plain-English picture of *what they built* — and being able to explain it back to them more clearly than they could themselves.

That sounds modest. It is the most important thing you will do in the whole engagement.

## A real estate, not a toy

Everything in this series runs against a Power BI estate for a hospital emergency department — **Northvale ED**. It's a stand-in hospital, but it is *not* a toy: the fact table (`ER_Data`), the fields, the measures, the DAX, the branding, and — crucially — the rules for what "good" looks like are the real ones from the [Spectrum Efficiency `power-bi-template`](https://github.com/spectrumefficiencylimited/power-bi-template). We model the estate; we don't invent the standards.

That matters for a reason that is itself part of the method. The Data Shrink reads **metadata only** — the structure of the estate, never the patient rows inside it. That is a deliberate design constraint, not a limitation: a governance tool that can read the data it governs becomes, itself, the largest piece of shadow IT in the building. By staying above the row level, the tool can be trusted everywhere the data cannot follow. A real engagement starts on synthetic or de-identified data for the same reason — so the first proof requires access to nothing sensitive. In healthcare, where every row is HIPAA-relevant, that isn't a nicety; it's the only way the door opens at all.

## Meet the estate

The estate is deliberately honest. It has the entropy a real one has:

- **Five reports** across ED Operations, Quality & Safety, and Planning — one certified, four not.
- **Three semantic models**: a tidy, certified *ER Reporting Model*; an *SLA Tracker* and an *Exec Summary* that grew up ad-hoc. The Exec Summary is the biggest (1.28 GB, 26 tables), refreshes hourly, and nobody has certified it.
- **A patient admin system** (PAS), plus two pieces of shadow IT: `Triage_Capacity.xlsx` on SharePoint, updated by a charge nurse each shift, and `satisfaction_survey.csv` on a shared drive.

The full estate — every node and edge — ships alongside this episode as `estate.json`. In the next episode we turn it into a map you can read at a glance. For now, just sit with the shape of it.

## What reflection is *looking* for

Reflection isn't passive admiration. While you're honouring the estate, you're quietly building the vocabulary you'll need later — watching for the shapes the method has names for: **semantic anchors** (the patient identifier, the admission date, the calendar), **consumption patterns** (which models feed the certified reports), and **the honest dependencies**, including the ones that are a spreadsheet.

Notice what's *not* on that list: scores, gradings, recommendations. Those come later, and they land far harder once the team already trusts that you see the system the way they do.

## The drift we're not mentioning yet

Here is the discipline. Look at how "number of patients" is defined across three models:

| Report it feeds | Measure | How it's defined |
| --- | --- | --- |
| Demographics (certified) | `Number of Patients` | `DISTINCTCOUNT('ER_Data'[Patient ID])` |
| ER Executive Monthly | `Number of Patients` | `COUNT('ER_Data'[Patient ID])` |
| Wait Times & SLA | `Patient Volume` | `COUNTROWS('ER_Data')` |

Three reports. Three numbers for the same idea. And this isn't a matter of taste — the template's own validation rule is explicit:

> *Patient counts must use `DISTINCTCOUNT` aggregation.* (`patient_count_distinct`, severity: error.)

A patient who is seen, discharged, and returns the same week is one patient — but `COUNT` and `COUNTROWS` count the visits, so the Executive Monthly report quietly overstates demand. This is **semantic drift**, and it is exactly the kind of finding that, delivered too early, sounds like *"your executive dashboard has been wrong for a year."* Which is true, and which is a terrible opening line.

We *see* it now. We write it down. We do not *lead* with it. It becomes a finding in the Opportunity Map, after we've shown the team their estate clearly enough that the drift is something we discover *together* rather than something I accuse them of.

That ordering — see early, surface late, always after understanding — is the whole method in one move.

## The reflex to build

Reflection before optimisation. Trust before critique. Understand the estate as an evolved, human thing — built by busy people under real deadlines — before you touch a single measure.

It is not the fun part. The fun part is the refactor: the patient count unified to `DISTINCTCOUNT`, the calendar table that finally makes time intelligence trustworthy, the RLS that makes Patient Details safe to share. We'll do all of it. But every one of those wins is *cashing a cheque that reflection wrote.*

Next episode: we take `estate.json` and build the map — the semantic topology of the whole estate, on one screen, that you can read out loud to a room of people who built it.
