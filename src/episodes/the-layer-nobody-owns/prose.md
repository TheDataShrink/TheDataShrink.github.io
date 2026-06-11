# The layer nobody owns

The Engine, as we left it, is a private miracle. It reflects an estate, scores it against real rules, and generates governed modules from a config — but only if the config arrives through *our* scripts, on *our* machine, driven by *our* hands. The agent series gave one agent hands. This series is about giving **every** agent the same hands, over a standard socket.

That socket is the **Model Context Protocol** — MCP. An MCP server is a small program that advertises typed tools; any AI client that speaks the protocol (Claude, Copilot, an IDE) can discover those tools and call them. The agent doesn't get smarter. It gets *capable*: the difference between an analyst who knows your standards and an analyst who knows your standards *and is allowed in the building*.

So the obvious move is: wrap the Engine in MCP, ship it. And the obvious move is wrong, because of a question you must answer before writing a line of server code: **what does Microsoft already own?**

## The Microsoft baseline

Microsoft ships two Power BI MCP servers, and they are good at what they do:

| Layer | Owner |
| --- | --- |
| Semantic-model editing — tables, measures, relationships, RLS | Microsoft **Modeling MCP**, connected to the live Desktop model |
| Model querying — DAX, schema exploration | Microsoft **Remote MCP**, Fabric-hosted |
| Report and visual authoring, components, theming, Power Query, governance, documentation | **nobody** |

Sit with the third row. The model layer — the part with the official Tabular Object Model, decades of tooling, a supported programmatic surface — is owned twice over. The **report layer** — the part the organisation actually *experiences*, the pages and visuals and brands, plus the Power Query that feeds everything and the governance that makes any of it trustworthy — is unowned.

This is not an oversight to gloat about. It's the same asymmetry the whole method rests on: tooling gravitates to the layers with clean APIs, and the entropy accumulates in the layers without them. The drift we found in Northvale ED lived in measures *as consumed by reports*. The shadow IT lived in *queries*. The off-brand visuals lived in *pages*. The unowned layer is where the method earns its keep — so the unowned layer is what the server must own.

**Rebuild nothing Microsoft ships. Own everything Microsoft doesn't.** That single sentence is the product strategy, and it has a name in the code: when a request needs a measure created or a relationship changed, our server *delegates* — it tells the agent to use Modeling MCP. Complement, never compete. A server that re-implements the model layer is a maintenance treadmill; a server that owns the report layer is a moat.

## Why this is buildable at all

One more inheritance from the agent-rebuilds-the-report episode, because it's load-bearing: none of this works against `.pbix`. A `.pbix` is a binary blob; a program can't reason about it. **PBIP** changed the substrate — a Power BI project saved as open text, TMDL for the model, PBIR JSON for the report. The moment the estate became files, it became something a server can scan, diff, validate, and edit.

That gives us the design invariants the whole series will keep returning to:

- **The filesystem is the source of truth.** Every operation reads or writes PBIP text files. No hidden state, no live-session magic.
- **Every write is a deterministic, diffable text edit.** If it can't be reviewed in a git diff, the server doesn't do it.
- **Scanning is side-effect-free.** Reading an estate must be exactly as safe as looking at it.
- **Model-layer changes are delegated**, not reimplemented.

> **Semantic Observability** — analysing an enterprise analytics ecosystem from the semantic consumption layer downward. The server is this idea with a protocol in front of it: the reflection that was a consulting deliverable becomes a tool surface an agent can call.

## The shape of the build

The server is called `datashrink-mcp-pbip`, and it grows in the order trust grows. First a server that can only *read* — inventory, deep model parsing, documentation, portfolio audit. Then a *registry* — the governed component library made machine-searchable. Then, and only then, the **write path**: stamping governed visuals onto real report pages, behind a validation gate that would rather do nothing than do harm. Then the layers Microsoft's servers explicitly can't touch — theming and Power Query. And finally the part most builds skip: proving, adversarially, against the real renderer, that none of it is wishful thinking.

The test corpus is not a toy, because the method forbids toys: nineteen real PBIP projects — financial statements, working capital, manufacturing OEE, a comparative income statement with a full module library — the same estate discipline as Northvale, pointed at our own workshop.

Reflection before optimisation held for consulting. It holds for products too: **a server must earn the right to write.** Next episode, the version that can't hurt anything — and why that version was already sellable.
