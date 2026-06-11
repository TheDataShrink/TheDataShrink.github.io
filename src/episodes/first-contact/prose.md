# First contact

> **Previously** — Six episodes built `datashrink-mcp-pbip` in trust order: [a read layer](/episodes/a-server-that-only-reads), [a component registry](/episodes/a-registry-of-decisions), [a write path behind a two-phase gate](/episodes/the-write-path), [the Power Query and theming layers](/episodes/the-layer-microsoft-cannot-touch). Then [the proof episode](/episodes/proving-it-real) climbed three rungs: a real protocol client (14/14), a deliberate betrayal the gate refused, and Power BI Desktop rendering the server's work. The series declared the line drawn. The very next day, a fourth rung appeared.

Every test so far had one thing in common: an expert at the keyboard. The harness was written by the people who wrote the server. The adversarial stamp knew exactly which slots to get wrong. Even the renderer test was driven by hands that knew what "should" happen. There is one test none of that covers, and it's the one a product actually lives or dies on: **a first-time user, with zero MCP experience, sits down and tries to use it.**

So that's what happened. Not as a designed experiment — as a Tuesday.

## The workshop tour, with real questions

The first stop was the **MCP Inspector** — the official developer UI that launches a server and lets you poke its tools by hand. To someone who has never seen MCP plumbing, it is genuinely alarming, and the questions it raised are worth answering in the order they were actually asked:

- **"What are all these environment variables, and why are they masked?"** The Inspector runs the server as a child process and shows the environment it passes through — `PATH`, `APPDATA`, ordinary Windows furniture. The dots are a default precaution because env vars *can* hold secrets. These don't. You never touch this panel.
- **"What are these two JSON blobs?"** Convenience snippets to paste into an MCP client's config. The big env block is optional noise; the working config is just *command + args*.
- **"How do we authenticate?"** You don't — and that's correct, not careless. This is a **local stdio server**: it runs as a child process under your own account, speaking over stdin/stdout. There is no network, so there is nothing to authenticate. Auth enters the story only when the server becomes a hosted service — a roadmap phase, not a gap.
- **"Why are there no resources, no prompts?"** By design. Both are optional MCP features; this is a tools-only server.
- **Three tool calls failed.** All for the same reason: `project_path` left empty. The Inspector doesn't know your filesystem — a human must paste full paths. Which is precisely the friction an agent removes: Claude *knows* the paths.

> **Workshop vs car** — the Inspector is the workshop; an MCP client like Claude is the car. You only go back to the workshop to debug. From the driver's seat, all of the above disappears: you say "lint Working Capital" and the protocol happens behind the scenes, every write still defaulting to a dry run.

## The clean sweep

Then the server was connected to a real client and driven natively — its first run as a product rather than a test subject — deliberately pointed at projects no episode had ever touched. All twenty-four tools, **24/24**: seven pages read out of HR analytics with two honest standards warnings; the deep model scan returning Daily Sales Flash whole — twenty-three tables, forty measures, every relationship; the doc generators emitting a Knowledge Register and full model documentation for Working Capital; the M lint finding four hard-coded paths there, the same class of finding as everywhere else; the registry discovering three component libraries (9, 19, and 32 components) and searching KPI cards across all of them; binding validation resolving `Main Measures[AC]` and `Calendar.Month` against a model the contract had never met; all seven write tools previewing in dry-run with `committed: false` and zero disk changes; and the portfolio audit cross-tabulating all nineteen projects in one matrix.

The colocated `01-native-session-results.json` is the session record. The question it answers is the one that matters commercially: *is this general, or a demo tuned to one project?* Every tool takes a path. From the five-page Cost Benefit Analysis to the 120-column Daily Sales Flash, the answer was the same.

## What only a beginner finds

And the best part: real use caught **three bugs that three levels of expert testing missed.**

1. **The parser lied politely.** In Working Capital and Daily Sales Flash, some multi-line DAX measures came back with their expression reduced to a literal three-backtick fence — the TMDL parser mishandles fence-wrapped expressions. The income statement project never triggered it, so no earlier test could have seen it.
2. **The Destructive badge.** The Inspector showed ✓ Destructive on provably read-only tools. The server doesn't declare tool *annotations* yet, so clients assume the worst case. A first-time user spotted it because a first-time user is exactly who that badge exists for.
3. **The version leak.** `serverInfo.version` reported the SDK's version, not the server's. Trivial — and invisible to anyone who already knew which server they were running.

The harness was ours. The renderer was Microsoft's. The beginner was neither — and the beginner found what both missed. That is the fourth rung of the proof ladder, and it can't be climbed by the people who built the thing.

## The paper trail

The same day produced the paperwork trust actually runs on. A fifteen-phase acceptance run against a clean environment: fresh virtual env, 41/41 unit tests, the official Inspector CLI — a client we did not write — discovering all twenty-four tools, and six *deliberate* failure tests, each answered with a clean named error and a server that stayed alive. The full end-to-end authoring scenario — test page created, KPI card and trend chart inserted, theme applied, bindings validated, portfolio audited — lands in git as **five insertions, three deletions, and one self-contained page folder.** An afternoon of AI authoring, reviewable on one screen.

And an honest score, because the method forbids grading your own homework generously: **78/100** — production-ready as a local, single-user consultant's tool; *not yet* a hosted multi-tenant service, which is a roadmap phase, not an oversight. The gaps are named in priority order, and the top two came straight from this session: a persisted write-audit journal, and the tool annotations whose absence put that Destructive badge on read-only tools.

## The trust order, completed

Read. Index. Write behind a gate. Own the unowned layers. Prove it adversarially. And then — hand it to someone who has never seen any of it, answer their questions honestly, and fix what their fresh eyes catch. [The development wheel](/episodes/the-development-wheel) said reflection is a photograph of a moving thing; first contact is the photograph of the *product*, taken by its first real user. What they were confused by became the curriculum — the whole journey now ships with the server as a beginner's tutorial: install → inspect, with every scary panel explained → first read-only conversation → first dry-run → first commit. What they found became the fix list. Both are now part of the build.
