# Modular Visual Intelligence

A custom visual library is how a team stops rebuilding reports from scratch and
starts compounding its collective intelligence — with standards, governance,
and brand identity baked in.

## The problem with one-off reports

Every report rebuilt by hand is a fresh set of decisions:

- which visual, which colours, which layout
- how to shape the data behind it
- how to label, format, and aggregate

The result is drift. The same KPI looks different in five reports. Branding
erodes. Effort duplicates. Knowledge lives in individual heads, not in the
team. This is analytics entropy expressed at the *presentation* layer.

---

## The insight

Build a **library of custom Power BI visuals** that:

- consume the customer's **exact governed data layer** — the visual expects
  data in a known, contracted shape;
- encode **how the data should look** — the standard rendering, formatting, and
  interaction;
- carry the **brand and identity** — colours, typography, conventions, baked in.

This is taking complexity *out*. The per-report decisions disappear because
they are made once, well, inside the component.

There is precedent: vendors such as Zebra BI have built successful businesses
on custom Power BI visuals that enforce a consistent reporting standard. We
apply the same mechanism, but the library is shaped to **each customer's** data
layer and identity, and assembled by the engine.

---

## The visual as a contract

A library visual is a contract between the presentation layer and the
[governed semantic assets](semantic-observability.md):

- it expects data from the **gold layer**, in a specific shape;
- it refuses to render the wrong thing the wrong way;
- it enforces conformance simply by being the path of least resistance.

This turns governance from a rulebook into a default. Using the library *is*
following the standard.

---

## Agent-assembled reports

When the engine (or a team member) builds or rebuilds a report, it does not
hand-craft visuals. It **imports modular widgets from the library** and wires
them to the governed data.

Because identity, standards, and logic are baked into the components:

- every report the agent builds carries the brand automatically;
- the knowledge is **guarded** — it cannot be accidentally left out;
- rebuilds are fast, consistent, and governed by construction.

The agent never has to "remember" the standard. The standard is the material it
builds with.

---

## From report-builders to a team intelligence

This is the cultural shift the library enables:

- The team moves away from building **singular reports**.
- It moves toward curating a **shared set of modules** — the collective
  intelligence of the team, made reusable.
- Each module encodes hard-won understanding of the customer's needs and data.
- New reports become **compositions** of trusted modules, not fresh inventions.

The library becomes a compounding asset: every good decision made once is
reused everywhere, forever.

---

## Where this sits in the product

Modular Visual Intelligence is part of [The Engine](../product/product-ladder.md)
— the recurring, compounding product. The library is one of the clearest
expressions of "the magic we keep": the *method* of building governed visuals
is open, but the **accumulated, customer-shaped library and the engine that
assembles with it** are the product.

It is also a direct driver of the **development wheel**: each cycle, the team
ships better reports faster, because the modules keep improving.

---

## Governance posture

- Visuals consume metadata and governed data contracts; they do not bypass the
  gold layer.
- Human-in-the-loop still applies: the engine assembles candidates; humans
  review and approve what ships.
- The library is versioned and auditable, like any other governed asset.
