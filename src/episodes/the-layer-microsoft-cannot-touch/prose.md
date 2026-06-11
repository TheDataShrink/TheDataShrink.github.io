# The layer Microsoft cannot touch

Microsoft's Modeling MCP is explicit about its boundary: it edits the semantic model — tables, measures, relationships — and it does not touch **Power Query**. The M expressions that actually *fetch and shape the data*, the layer every model stands on, sit outside its writ. Outside Remote MCP's too.

Which should sound familiar. The applied track had a name for what accumulates in layers nobody watches, and an episode about where it hides: the dependency that isn't absent, just untraced. In Northvale it was a spreadsheet a charge nurse updated between patients. In the M layer, it's a file path.

## Two small tools

`pbip.m.read` extracts the M expression for every table partition in a project — the queries are right there in the TMDL, readable the moment the estate became text. `pbip.m.lint` walks those expressions looking for three shapes:

- **`hardcoded_path`** — an absolute or UNC path baked into the query. Works on the author's machine; breaks on refresh from anywhere else.
- **`local_file_dependency`** — `File.Contents` against a local file. The query *depends on a file that lives on one laptop*.
- **embedded secrets** — credentials or keys sitting in query text, where they'll travel with every copy of the project.

Modest tooling. Then we pointed it at our own workshop.

## A hundred and forty-eight findings

The colocated `01-m-lint-portfolio.json` is the unedited output of `m.lint` across all nineteen projects of the test estate. The totals: **71 hard-coded paths and 77 local-file dependencies. Two projects clean, of nineteen.**

Read one finding the way the blast-radius episode taught:

> `AccountHierarchy.AccountHierarchy: hard-coded absolute/UNC path in the M query — this breaks on refresh from another machine.`

The account hierarchy — the table that gives the P&L its *structure* — loads from a path that exists on exactly one computer. Publish that model to the service, schedule a refresh, and the comparative income statement fails. Not subtly: completely, and only after publication, which is the most expensive possible moment to learn it.

> **Shadow IT** — unmanaged business logic or data dependencies introduced outside governed architecture. SharePoint files, local CSVs, unmanaged dimensions — *and the M queries that wire them in.*

Here is the link worth pausing on. The estate map found `Triage_Capacity.xlsx` because we modelled the estate's sources by hand. The M lint finds the same *class* of dependency — the local file on the critical path — automatically, from the query text, across an entire portfolio, in seconds. The dependencies-in-plain-sight episode asked, of every source: *if this is wrong, who finds out, and how late?* `m.lint` is that question, running as a tool. Seventy-seven local-file dependencies is seventy-seven blast radii nobody had drawn.

And the honest disclosure: this is our own demo estate. Nineteen projects built by people who write episodes about governance, and seventeen of them carry the finding. That's not embarrassing; that's the *point*. Entropy isn't a discipline failure — it's the default state of any estate that grows. Which is exactly why detection has to be a standing tool rather than a one-time cleanup.

## Theming: the brand as a governed write

The episode's second half is smaller but rhymes. `pbip.theme.read` reports a project's theme configuration; `pbip.theme.apply` registers a theme JSON as the report's custom theme — through the same two-phase gate as every other write, dry-run by default, backup on overwrite.

The first-custom-visual episode made the case that brand violations should be *impossible at design time*, not caught in review. A governed theme, applied as a validated, diffable write, is that idea at report scope: the palette and typography arrive as one reviewed change, not forty manual visual-by-visual touch-ups that each might drift. The component library guarantees the modules are in brand; the theme guarantees the canvas under them is.

## The surface is complete

Count what the server now owns: the read layer (reflect anything), the registry (the library, indexed), the write path (governed authoring behind a gate), and now the M layer and theming — the floors above and below the model that Microsoft's servers bracket but don't enter. Twenty-four tools. The unowned layer from the first episode has an owner.

Every claim so far has come with an artifact — an inventory, a contract, a lint report. But artifacts of *construction* aren't proof of *function*, and a server whose tools each work in isolation can still lie to a real client over a real wire. The last episode does the only thing that settles it: we hand the server to an actual agent, over the actual protocol, point it at the actual estate — and we include the test where we tried to make it break its promise.
