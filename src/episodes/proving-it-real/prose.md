# Proving it real

> **Previously** — Five episodes built the surface: [a read layer](/episodes/a-server-that-only-reads), [a component registry](/episodes/a-registry-of-decisions), [a write path behind a two-phase gate](/episodes/the-write-path), and [Power Query lint plus governed theming](/episodes/the-layer-microsoft-cannot-touch). Every claim shipped with a real artifact. This episode tests the whole thing the way a stranger would: over the actual protocol, adversarially, ending in Power BI Desktop.

Every episode so far ends with a claim: the parser parses, the registry resolves, the gate holds. This episode we stop claiming. [The evaluation episode of the agent series](/episodes/06-evaluation) said the quiet part: *most agent demos pass on a handful of inputs and fail in production — eval is the difference.* The same is true of agent tooling. A unit-tested MCP server is a server whose functions work; whether the *product* works is a different question, answerable only over the real protocol, against the real estate, ending at the real renderer.

So the test rig is the product's own pitch, turned on itself: **an AI agent tested the server that gives AI agents hands.**

## Level one: the wire

Forty-one unit tests pass in about a second. Good — and insufficient, because unit tests call Python functions, and no client will ever call a Python function. Clients spawn the server as a subprocess and speak MCP over stdio: initialize, list tools, call tools, parse structured results. A server can have a perfect core and still fail at the boundary — a tool name that doesn't match the docs, a parameter the schema mis-describes, a result that doesn't survive serialisation.

The colocated `01-smoke_mcp_client.py` is the harness: a real MCP client that launches the real server exactly as Claude or VS Code would, then walks the surface. Fourteen checks — discovery finds all nineteen projects; the deep model read returns the income statement's four tables and five measures; the standards lint returns real findings (one warning, eight informational — honest numbers from an honest estate); binding validation resolves `∑ Key Measures[AC]` against the live model; dry-run inserts stage and decline to commit.

**14 of 14, over the wire.** And two failures along the way that were the harness's own bugs, not the server's — wrong parameter names, a console that couldn't print `∑`. Worth recording, because that's what protocol-level testing is *for*: half of what it catches is the gap between what you documented and what a stranger's code actually sends.

## Level two: trying to make it lie

[The write-path episode](/episodes/the-write-path) promised that validation can veto an explicit `write=True`. A promise like that gets tested by betrayal, so the next test stamped the waterfall component onto a real page with `write=True` — and deliberately wrong binding slots.

The server refused. Four `unbound_slot` errors, `committed: false` — and then the part that matters: we checked the *filesystem*, not the response. The visuals folder was untouched. **Zero bytes had been written on a call that explicitly requested writing.** The response even listed the writes it had planned and declined to make. Then the same stamp with the contract's real slots — `Category (Year)` → `PnL.Year`, `Values (AC)` → `∑ Key Measures[AC]`, `PreviousYear (PY)`, `Group (PC Level 1)` — and a complete, schema-stamped waterfall visual appeared on disk, all four projections resolved, next to a `.bak` of the page list it amended.

One mechanism, witnessed from both sides in one afternoon: the same gate that *built* the correct visual *blocked* the incorrect one. That pair of observations — not either alone — is what "governed authoring" means.

## Level three: the only judge that counts

Schema-valid JSON can still be wrong — PBIR is a preview surface, and the test that settles it isn't ours to write. So the final level is the renderer itself: open the modified project in **Power BI Desktop** and look. A test page, created by the server; a card and the stamped waterfall, built by the server; loaded by the application Microsoft ships, without complaint.

The loop a real engagement will run is exactly the loop we ran: agent proposes (dry run) → human reviews the plan → agent commits → Desktop renders → git diff shows precisely what changed, with backups beside it. Every layer of the safety story from the write-path episode appeared in practice, unprompted, because the defaults make it the path of least resistance.

> **Proof over promise** — a tool surface is real when a client you didn't write can drive it, a gate you tried to break holds, and a renderer you don't control accepts the output. Below that bar, "it works" is a hypothesis.

## The wheel, again

[The development-wheel episode](/episodes/the-development-wheel) argued that a reflection is a photograph of a moving thing — the value is in the cadence. The same holds one level up: this server is *itself* a photograph. PBIR's preview schema will drift. Microsoft's servers will grow. The roadmap already knows its next turns — multi-tenant remote delivery with real authentication so the server can be *sold* rather than installed, M auto-patching to fix the hundred and forty-eight findings rather than just count them, schema-shim tests against Microsoft's preview drift.

But the line this series set out to draw is drawn. The layer nobody owned has an owner; the owner has a protocol; the protocol has been tested by an agent, adversarially, down to the renderer. The method became an Engine; the Engine, a socket. What plugs into it next — [we found out the very next day](/episodes/first-contact).
