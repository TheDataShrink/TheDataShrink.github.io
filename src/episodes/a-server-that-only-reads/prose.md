# A server that only reads

The first version of the server cannot write. Not "doesn't write yet, pending a flag" — *cannot*. There is no code path from any tool to the disk. This is the single most important design decision in the whole build, and it was made for the same reason reflection precedes critique in an engagement: **trust precedes optimisation, and for software, safety precedes trust.**

Think about what you're asking a client to do when they install an MCP server: *let an AI agent loose on the files that produce the board pack.* If the first version can edit those files, the security review takes a quarter and the answer is probably no. If the first version is provably read-only — every tool side-effect-free, every output a markdown report or a JSON structure — the conversation is the same one that opened the Northvale engagement: "we read the *shape* of your reporting, never the rows, and we can't change anything." That sentence gets you in the building.

## Reflection, done by tools

What does a read-only server *do*? Exactly what Episodes 1–3 of the applied track did by hand. It reflects.

- `pbip.project.list` — walk a root folder, find every PBIP project. The estate census.
- `pbip.project.inventory` — one project, fully structured: pages, visuals, tables, sources.
- `pbip.semantic_model.describe` — the deep read. This is where the engineering lives: a real **TMDL parser** that recovers column data types and hidden flags, every measure's DAX expression, the relationships, the culture settings. The colocated `01-inventory-excerpt.json` is its actual output against the comparative income statement project — ten pages, four tables, the five `∑ Key Measures` with their DAX intact.
- `pbip.report.list_pages` — display order, names, dimensions. The consumption layer, listed in the order the user meets it.
- `pbip.portfolio.audit` — every project under a root, cross-tabulated into one matrix. The whole-estate view from the map episode, as a tool call.

And the documentation generators, because reflection's deliverable was always the *narration*: `pbip.docs.knowledge_register` writes the Knowledge Register, `pbip.docs.prompt_pack` writes the prompt pack, `pbip.docs.semantic_model` auto-fills the model documentation from the live scan, `pbip.docs.scaffold` lays down the canonical thirteen-document suite from the template. The documents a consultant assembles in week one, emitted in seconds, and *always current* because they're regenerated from the files rather than maintained by hand.

> **Architecture Reflection** — visualising and explaining an ecosystem *before* attempting optimisation. The read-only server is reflection with a protocol contract: it can describe everything and disturb nothing.

## The honest seam in the design

One nuance, because it will matter when the write path arrives. The doc generators accept a `write=True` flag — they can save the markdown they produce. Isn't that a write?

It is, and the distinction the server draws is deliberate: **writing *about* the estate is not writing *the estate*.** A Knowledge Register landing next to the `.pbip` file changes nothing about what the report does. The line the server will not cross — yet — is the `definition/` folder: the pages, the visuals, the model. Documents are output; definitions are sacred. Keeping that line crisp in phase one is what makes the phase-three conversation ("now let it edit definitions") a negotiation about *one* boundary instead of a re-audit of everything.

## Already sellable, which is the point

Here is the commercially interesting fact: this version — scanner, parser, docs, audit — was already a product. A governance-and-audit MCP. Point an agent at an estate and ask, in plain English: *which projects have no documentation? Which measures changed since the register was written? Which pages are hidden and empty?* Every answer comes from tools that cannot cause harm, which means the procurement conversation is short.

The lesson generalises beyond Power BI: **ship the version that can't hurt anyone first.** Not as a crippled demo of the real thing — as a complete, honest product whose completeness *is* its safety. The estates that buy the audit are the estates that will trust the authoring later, for the same reason the Northvale team accepted the drift finding: by the time we asked for write access, we'd proven we could see.

## What reading can't do

But the method doesn't stop at seeing, and neither can the server. The applied track had a library episode — governed, branded, machine-readable modules, each one a decision about what *good* looks like, encoded so it can't drift. Right now those modules sit in a `modules/` folder as JSON files, legible to humans and invisible to agents.

Next episode we give the library an index: the component registry — and meet the deceptively simple idea that makes the whole write path possible, the **binding contract**.
