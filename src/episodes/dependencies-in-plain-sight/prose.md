# The dependencies hiding in plain sight

The map from the last episode reads top-down: reports at the edge, models in the middle, sources at the bottom. That's the right way to *present* an estate, because it starts where the organisation lives — at consumption.

But it's the wrong way to find the things that will hurt you. For that, you read the map **backwards.** You start at the bottom, at the sources nobody documented, and you trace *upward* — asking, of each one: if this is wrong, who finds out, and how late?

That question has a name in lineage work. It's the **blast radius.**

## Lineage is a direction, not a diagram

Everyone says they want "lineage." What they usually mean is a diagram with arrows. But a diagram is just a noun. Lineage is useful only as a *verb* — the act of following a dependency all the way to its consequences.

> **Analytics Entropy** — the gradual degradation of an analytics ecosystem caused by semantic drift, **hidden dependencies**, governance erosion, duplicated transformations, and unmanaged augmentation.

"Hidden dependencies" is the entry this episode is about. And the word doing the work is *hidden* — not absent. The dependency is right there in the metadata. It's hidden because nobody ever traced it to the thing it threatens.

## Trace it upward

Below is the same estate, redrawn as directed lineage: **source → model → report.** Pick a source and the map lights up everything downstream of it — the exact set of reports that go wrong if that source is wrong.

It opens on `Triage_Capacity.xlsx` on purpose.

Click the patient admin system, `PAS`, first. Big blast radius — all three models, most of the reports. That's expected and, importantly, *fine*: it's the system of record, it's owned, it's monitored, everyone knows it's load-bearing. A large blast radius on a managed asset is just architecture.

Now click `Triage_Capacity.xlsx`.

## The spreadsheet is load-bearing

Two models light up — the SLA Tracker and the Exec Summary — and through them, the **Capacity & Peak Hours** report and the **ER Executive Monthly**.

Sit with what that means. A spreadsheet on SharePoint, updated by hand by a charge nurse between patients, on a rhythm held together by memory, is on the critical path to the reports that drive ED staffing and the executive's monthly view. There is no refresh log for "did someone update the file this shift." There is no test for "are the numbers in it still shaped right." If the nurse is slammed with a trauma and the file goes stale, the capacity dashboard reports complete success the whole way down. Green lights, wrong answer — in a department where the wrong answer is a staffing gap at 2am.

> **Shadow IT** — unmanaged business logic or data dependencies introduced outside governed architecture. SharePoint Excel files, local CSVs, unmanaged dimensions, report-level transformations.

The spreadsheet isn't a bug someone introduced. It's the residue of a reasonable decision: triage capacity wasn't in PAS, the report needed it, so it got wired in "for now." The entropy isn't the spreadsheet. The entropy is that nobody ever drew the line from it to the staffing decisions it silently feeds.

## Why the blast-radius framing wins the room

You could deliver this finding as *"you have an ungoverned Excel dependency, severity high."* That's a true sentence that makes people defensive.

Or you can turn the screen around, click the file, and let the highlighted nodes say it: *"if this spreadsheet is wrong, these are the reports that are wrong, and two of them set your staffing."* Now it's not an accusation — it's a shared *"oh."* The room arrives at the risk themselves, in the language of consequences they already care about. Same fact. Completely different conversation.

This is reflection's discipline carried into the risk work: **surface the dependency as a consequence, not a verdict.**

## What the lineage agent is actually doing

Under the hood this is not clever. For every source node, walk the directed edges forward; collect every report you can reach. The set you collect *is* the blast radius. The judgement — *which* radii matter — isn't in the algorithm; it's in two questions you ask about each one:

1. **Is the asset governed?** A large radius on the patient admin system is architecture. The same radius on a hand-maintained file is a liability.
2. **Does the radius reach something certified, board-facing, or safety-relevant?** A shadow dependency feeding a scratch report is a shrug. The same dependency feeding the staffing report is the headline of the engagement.

`Triage_Capacity.xlsx` fails both tests. That's why it's the default selection, and why it'll be near the top of the Opportunity Map.

## Still cataloguing, not fixing

We now have, in consequence-language, the hidden dependencies the estate was carrying. We have *not* proposed a fix — not the governed capacity table that should replace the spreadsheet, not the contract that would make it safe. That's coming.

Because before we can say what to *fix*, we have to say what *good* looks like — and "good" isn't a generic best-practice checklist. It's specific to this estate, and in healthcare it has teeth: patient counts must be `DISTINCTCOUNT`, the date model must support time intelligence, Patient Details must have row-level security. That's the next episode — turning everything the map and the blast radius made visible into **this estate's** definition of good, the one thing that finally earns the word *optimisation.*
