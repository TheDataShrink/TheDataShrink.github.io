# The Engine writes to version control, never to a live workspace

We are building the Engine as an MCP client/agent layer on top of Microsoft's
Power BI MCP servers (see [why-now.md](../strategy/why-now.md)). Microsoft's
*local* MCP server can write semantic models — create measures, edit TMDL, bulk-
update objects. That capability collides with
[.out-of-scope/0001](../../.out-of-scope/0001-no-production-writes.md) ("the
Engine never changes production automatically"), so the boundary must be explicit.

**Decision:** When the Engine invokes Microsoft's write tools, it writes **only to
PBIP / TMDL files under version control** (a feature branch), never to a live
Power BI Desktop session or Fabric workspace. The pull request and its human merge
*are* the human-in-the-loop gate; CI/CD promotes a merged change to production.

**Why:** This reconciles the write capability with `0001`. Writing TMDL to a
branch is not a "production write" — it is exactly the *"generate candidate
solutions, produce deployment scripts, require human review, support controlled
rollout"* that `0001` already permits. It also keeps the Engine on the
TMDL/model layer, which [pbip-facts.md](../strategy/pbip-facts.md) confirms is
the supported programmatic surface (the report layer is preview). It mirrors
Microsoft's own framing: "changes follow your existing source control and review
workflows."

## Considered Options

1. **Read-only** — the Engine only calls query/read tools and emits candidate
   artefacts a human applies by hand. Safe, but discards half of Microsoft's MCP
   and most of the acceleration.
2. **Branch-writes (chosen)** — write to versioned project files; PR/merge is the
   gate.
3. **Direct writes to the live workspace** — rejected: violates `0001` outright
   and destroys the sovereign-buyer trust the whole pitch rests on.

## Consequences

- The Engine requires a Git-backed PBIP project to operate on; "no repo, no
  writes" is a hard precondition.
- A merged PR is the single promotion path to production — auditable by design,
  which suits regulated/government buyers.
- The Engine's reflection/scoring tools remain read-only regardless; only
  generation/remediation tools touch files, and only on a branch.
