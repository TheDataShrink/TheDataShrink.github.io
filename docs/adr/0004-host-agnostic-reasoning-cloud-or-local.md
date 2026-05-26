# The Engine Runtime is host-agnostic: cloud or fully-local reasoning

In MCP, the **host's client LLM** does the reasoning — by default that's GitHub
Copilot, a cloud model. Even though the Engine Runtime is metadata-only
([.out-of-scope/0002](../../.out-of-scope/0002-metadata-only-no-business-data.md)),
the schema it reasons over (table, column, measure names like `Patient Wait
Time`) would still reach that cloud model. For some buyers that's fine; for an
air-gapped agency, the names themselves are sensitive.

**Decision:** The Engine Runtime is **host-agnostic** — it is a standard MCP
server and does not care which client/LLM calls it. We support **both** modes:

- **Cloud host (e.g. Copilot)** — where the customer permits it (many government
  agencies do). Convenient, most capable.
- **Fully-local reasoning** — a local-model host (e.g. Ollama on the customer's
  own server) for sovereign / air-gapped estates, so data, metadata, *and*
  reasoning all stay inside the boundary.

The customer chooses by their sovereignty posture; we don't force either.

**Why:** This makes "nothing leaves your boundary" literally true when an estate
needs it, without penalising the majority who are happy with Copilot. It keeps
the sovereign pitch honest (the leak we'd otherwise have is reasoning-over-
metadata, not just business data).

## Consequences

- The Engine Runtime must not hardwire a model provider; model choice is host
  configuration, not baked in.
- The sovereign (local-model) tier may get less fluent agent behaviour than the
  cloud tier — local models are weaker. State this plainly in the pitch; it is a
  trade-off the buyer accepts for full sovereignty, not a defect.
