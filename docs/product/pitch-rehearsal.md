# Pitch Rehearsal — Selling The Reflection to a Government Team

A script to rehearse with. The scenario: you walk into an agency (think
MBIE-scale) and say *"We're The Data Shrink, and we're here to lift your
capability."* This is how that conversation goes.

Rehearse it out loud. The goal is not to memorise lines — it's to internalise
the **arc**: honour → understand → reveal → de-risk → small first step.

---

## The room

Likely in attendance:

- A **business owner** (cares about: reports that work, exec credibility).
- A **data/BI lead** (cares about: not being blamed, capability, control).
- A **security / sovereignty person** (cares about: nothing leaks, ever).
- Sometimes **procurement** (cares about: bounded scope, defensible spend).

Each has a different fear. The pitch must defuse all four.

---

## The arc (5 beats)

### Beat 1 — Honour the complexity (open here, always)

> "Before anything else — what you've built is a real, evolved system. It was
> shaped under deadlines, changing requirements, and real constraints. We don't
> walk in with an audit. We start by helping you *see* it clearly."

Why: every BI lead in the room is braced for criticism. Removing that threat in
the first 30 seconds is the whole game. (See
[ADR 0002](../adr/0002-reflection-before-optimisation.md).)

### Beat 2 — Name the shared problem (without blame)

> "Most agencies don't have a single, complete picture of their Power BI estate.
> Reports depend on datasets, which depend on sources — and somewhere in there
> are spreadsheets and SharePoint files quietly holding it together. Nobody set
> out to build it that way. It just accumulates. We call it analytics entropy."

Why: this is recognition, not accusation. They nod because it's true.

### Beat 3 — Reveal the deliverable (the wow)

> "So the first thing we give you isn't advice — it's a map. An interactive
> picture of your whole estate: every report, dataset, model, gateway, and the
> hidden dependencies you can't currently see. It runs in your browser, offline,
> inside your own environment. You'll look at it and say *'I finally see what we
> built.'*"

If you can show the synthetic-data version live here, do it. The artefact sells
itself.

### Beat 4 — De-risk it (for security and procurement)

> "It all runs inside your boundary. We read **metadata only** — never your
> business data — and nothing leaves your environment. We can even start on
> synthetic data, so you see the entire outcome before exposing anything real.
> It's fixed scope, fixed price, two to four weeks, and everything we produce is
> yours to keep."

Why: this is the line that gets you past the security person and procurement in
one breath.

### Beat 5 — The small first step (the close)

> "We'd suggest starting small: one fixed-scope Reflection. You get a map, a
> capability baseline, a prioritised list of opportunities, and we teach your
> team to read and re-run it themselves. If it's useful, there's a natural next
> step — but you don't have to decide that today."

Why: government buys small, bounded, defensible first steps. Don't pitch the
platform. Pitch the Reflection.

---

## Discovery questions (ask, don't tell)

Use these to make it a conversation, and to tailor the close:

- "How many Power BI reports do you reckon are in active use? ...and how
  confident are you in that number?"
- "If a key dataset broke tomorrow, would you know everything downstream that
  depends on it?"
- "Are there spreadsheets or SharePoint files that reports quietly rely on?"
- "Has anyone ever drawn you a complete picture of how it all connects?"
- "When something's slow, how do you currently work out why?"

The honest answers ("no", "not really", "probably") *are* the sale.

---

## Objection handling

**"We already have lineage / a catalogue tool."**
> "Great — those tend to show you the plumbing. We start from the semantic
> layer, where the business actually feels the pain, and we focus on the hidden,
> ungoverned dependencies catalogues usually miss. And we leave your team able
> to read it."

**"How do we know nothing leaks?"**
> "It runs inside your boundary, metadata only, no external calls. We'll prove
> it on synthetic data before touching anything of yours. Sovereignty isn't a
> feature we added — it's the default."

**"This sounds like consulting."**
> "The difference is we leave the tool behind. The map is produced by software,
> it's repeatable, and your team can re-run it after we're gone. You're more
> capable when we leave, not more dependent."

**"Is this just for Power BI?"**
> "Power BI is where we focus today — it's where the pain is sharpest and the
> market is huge. The method generalises to other stacks, but we're deliberately
> not spreading thin. There's more than enough work in Power BI alone."

**"What does it cost / how long?"**
> "Fixed price, two to four weeks, bounded scope. Small enough to start without
> a big procurement exercise."

---

## What "lifting capability" actually means (say this plainly)

> "We're not here to become a permanent dependency. We're here to give your
> team a clearer picture than they've ever had, a way to measure improvement,
> and the tooling to keep doing it themselves. You lift; we leave."

---

## The one sentence to land

If they remember nothing else:

> *"We give you a plain-English map of your Power BI estate — built inside your
> own environment — and we teach your team to keep it."*
