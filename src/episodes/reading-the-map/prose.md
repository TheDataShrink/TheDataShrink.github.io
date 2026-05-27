# Reading the map

Last episode we sat with the *shape* of the Northvale ED estate and refused to grade it. This episode we make it legible. We take the metadata — `estate.json` from Episode 0 — and turn it into a single picture you can put on a screen in front of the people who built it and **read out loud.**

That last part matters. The deliverable of reflection isn't the picture. It's the *narration*. A map nobody can read is just a prettier version of the confusion you started with.

## What we build from, and what we don't

We build the map from **metadata only**. Not one patient row is read. Everything on the screen — reports, models, measures, sources, gateways, refresh jobs, and the edges between them — comes from the structure Power BI already exposes about itself: the report-to-dataset bindings, the model's tables and measures, the data source declarations, the gateway and refresh configuration.

> **Semantic Observability** — analysing an enterprise analytics ecosystem from the semantic consumption layer downward: business logic, semantic consistency, lineage, report behaviour, governance maturity. *Avoid* calling it "monitoring" — that implies infrastructure metrics, the opposite end of the stack.

In healthcare this is the difference between a yes and a no. "We read the *shape* of your reporting, never a patient record, and we can start on synthetic data" is a sentence a HIPAA-conscious buyer can actually approve.

## The map

Here is the whole estate on one screen. Drag the nodes; the layout is force-directed, so related things cluster. Hover anything for detail.

Read it the way you'd read it to a room:

> "These five circles are your **reports**. The one with the green ring — Demographics — is certified. The other four aren't. Each report leans on one or two **semantic models**, the blue-grey nodes. Follow the lines down and you reach your **sources**: the patient admin system — and these two amber nodes."

The amber nodes are where the room goes quiet.

## What the colours are telling you

The map encodes the method's vocabulary directly, so the findings are *visible* before they're spoken:

- **Green rings = certified.** One report, one model. At a glance you can see how little of the estate is governed.
- **Amber, dashed = shadow IT.** `Triage_Capacity.xlsx` and `satisfaction_survey.csv`. Notice the spreadsheet isn't a leaf — *two* models depend on it. A file a charge nurse updates between patients is on the critical path to the Capacity report.
- **Red solid = gold-layer bypass.** The **Exec Summary** model doesn't refresh from a governed layer — it *direct-queries the PAS operational tables*, the live patient admin system, with no curated model in between.
- **Red dotted = a modelling fault.** The Exec Summary is wired to a `DateTime` join with no calendar table — which the template flags as two separate errors (`no_datetime_joins`, `require_calendar`). It's why month-over-month numbers on that report can't be trusted.

> **Gold Layer Erosion** — the gradual bypassing of curated semantic assets in favour of operational tables and unmanaged direct queries. That red line, from the executive model straight into the live patient system, is gold-layer erosion you can point at.

- **Green measure nodes.** Three of them, and two carry the label "Number of Patients" wired into different models — `DISTINCTCOUNT` in one, `COUNT` in another. The map doesn't argue that this is wrong. It puts them on the same screen, where the question asks itself.

## Reading is the skill

Anyone can run a tool that emits a graph. The capability we're transferring — the thing the team keeps after we leave — is **reading** one. The discipline is a fixed order:

1. **Start at consumption.** Reports first, because that's what the organisation experiences. Work *downward* toward sources, never the reverse.
2. **Name the anchors.** Which nodes have the most edges into them? The patient admin system and the ER Reporting Model here. Those are the load-bearing walls; touch them carelessly and everything shakes.
3. **Trace the surprising path.** For every report a stakeholder cares about, follow its lines down and stop at the first thing that surprises *them*. It's almost always a colour they didn't expect under a number they trust.
4. **Say the dependency out loud.** "Your executive monthly numbers come from a model that direct-queries the live patient system and counts visits, not patients." Said plainly, in front of the map, this lands as a shared discovery — not an accusation.

## Still not optimising

Look how much is now *visible*: the drift, the shadow dependencies, the gold-layer bypass, the broken date model, the uncertified sprawl. Every instinct says start fixing.

We don't. The map is reflection's deliverable: the *"I finally see what we built"* moment. We've earned the room's trust by showing them their own estate more clearly than they'd ever seen it, and we've done it without grading anyone. That trust is the asset.

In the next episode we cash a piece of it — we trace lineage *backwards*, from the sources nobody documented, and ask of each one: if this is wrong, which reports are wrong, and how late does anyone find out?
