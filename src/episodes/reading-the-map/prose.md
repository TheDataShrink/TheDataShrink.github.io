# Reading the map

Last episode we sat with the *shape* of the estate and refused to grade it. This episode we make it legible. We take the metadata — `estate.json` from Episode 0 — and turn it into a single picture you can put on a screen in front of the people who built it and **read out loud.**

That last part matters. The deliverable of reflection isn't the picture. It's the *narration*. A map nobody can read is just a prettier version of the confusion you started with.

## What we build from, and what we don't

We build the map from **metadata only**. Not one row of patient data is read. Everything on the screen — reports, models, measures, sources, gateways, refresh jobs, and the edges between them — comes from the structure Power BI already exposes about itself: the report-to-dataset bindings, the model's tables and measures, the data source declarations, the gateway and refresh configuration.

> **Semantic Observability** — analysing an enterprise analytics ecosystem from the semantic consumption layer downward: business logic, semantic consistency, lineage, report behaviour, governance maturity. *Avoid* calling it "monitoring" — that implies infrastructure metrics, which is the opposite end of the stack.

This is why the engagement can start on synthetic data, and why a government buyer can say yes before any procurement battle: the thing that produces the map never needs to see anything sensitive.

## The map

Here is the whole estate on one screen. Drag the nodes around; the layout is force-directed, so related things cluster. Hover anything for detail.

Read it the way you'd read it to a room:

> "These five circles on the outside are your **reports**. The two with the green ring are certified — Executive Performance and ED Wait Times. The other three aren't. Each report leans on one or two **semantic models**, the purple nodes. Follow the lines down from the models and you reach your **sources**: the warehouse, the immunisation feed — and these two amber nodes."

The amber nodes are where the room goes quiet.

## What the colours are telling you

The map encodes the method's vocabulary directly, so the findings are *visible* before they're spoken:

- **Green rings = certified.** Two reports, one model. At a glance you can see how little of the estate is governed.
- **Amber, dashed = shadow IT.** `Bed_Capacity_Manual.xlsx` and `roster_export.csv`. Notice the Excel file isn't a leaf — *two* models depend on it, including the one behind **Finance Monthly**. A spreadsheet a coordinator updates by hand, on a schedule held together by memory, is on the critical path to a board report.
- **Red edge = gold-layer bypass.** One link is red: the **Finance Model** doesn't refresh *from* the warehouse, it *direct-queries the bronze tables*, reaching past the curated gold layer the Patient Flow Model uses politely.

> **Gold Layer Erosion** — the gradual bypassing of curated semantic assets in favour of bronze ingestion tables, operational joins, and unmanaged direct queries. That single red line is gold-layer erosion you can point at.

- **Green measure nodes.** There are three, and two of them carry the *same label* — "Total Patients" — wired into different models. The map doesn't argue that this is wrong. It just puts them on the same screen, where the question asks itself.

## Reading is the skill

Anyone can run a tool that emits a graph. The capability we're transferring — the thing the team keeps after we leave — is **reading** one. The discipline is a fixed order:

1. **Start at consumption.** Reports first, because that's what the organisation actually experiences. Work *downward* toward sources, never the reverse. (This is the "from the semantic consumption layer downward" in the definition, made literal.)
2. **Name the anchors.** Which nodes have the most edges into them? Those are your **semantic anchors** — the load-bearing walls. The warehouse and the Patient Flow Model here. Touch those carelessly and everything shakes.
3. **Trace the surprising path.** For every report a stakeholder cares about, follow its lines all the way down and stop at the first thing that surprises *them*. It is almost always a colour they didn't expect under a number they trust.
4. **Say the dependency out loud.** "Your Finance Monthly board report depends on a spreadsheet one person updates by hand." Said plainly, in front of the map, this lands as a shared discovery — not an accusation.

## Still not optimising

Look at how much is now *visible*: the drift, the shadow dependencies, the erosion, the uncertified sprawl. Every instinct says start fixing.

We don't. The map is reflection's deliverable: the *"I finally see what we built"* moment. We've earned the room's trust by showing them their own estate more clearly than they'd ever seen it, and we've done it without grading anyone. That trust is the asset.

In the next episode we cash it. We take what the map made visible and turn it into *this estate's* definition of "good" — and only then does the method let us reach for the word **optimisation.**
