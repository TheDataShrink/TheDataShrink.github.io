# ADR 0002 — Reflection Before Optimisation

## Status

Accepted

---

## Context

Enterprise analytics ecosystems are evolved systems, shaped by delivery
pressure and real organisational constraints. Teams are frequently proud of
what they built.

An AI platform that opens by criticising — flagging governance violations,
scoring entropy, listing failures — loses trust before it establishes
understanding. Humans disengage when they do not feel understood.

This insight reframes the V1 product. The first deliverable is not
optimisation, governance, or remediation. It is *architecture understanding*.

---

## Decision

The Data Shrink will lead with **architecture reflection**: visualising and
explaining the existing ecosystem before performing any optimisation or
governance analysis.

- The first skill is `reflect-architecture`, not `grill-semantic-model`.
- The first user experience answers "Show me what we actually built."
- Reflective, non-judgemental language ("appears to", "functions as", "likely
  serves") is mandatory during discovery.
- Governance scoring, entropy analysis, and remediation are introduced only
  after shared understanding is established.

---

## Consequences

### Positive

- builds psychological trust and earns the right to analyse
- non-threatening, curiosity-inducing first interaction
- visually impressive with a lightweight stack (HTML/CSS/JS + D3)
- differentiates from audit-first enterprise tooling

### Negative

- delays "hard" findings the buyer may also want quickly
- requires high-quality visualisation and storytelling, not just detection
- requires discipline to suppress optimisation language early
