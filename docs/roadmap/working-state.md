# Working State — in-flight operations

Operational handover notes that live in chat history otherwise. Anything
strategic is in [status-map.md](status-map.md) and [whats-next.md](whats-next.md);
this file is the *in-flight* state. Snapshot: 2026-06-10.

## Branch state

- All product/strategy work is on `claude/data-product-md-files-eW69V`.
- `main` has moved independently: Pages re-enabled, CNAME shipped in the build
  artifact, GA4/GTM wired, multi-series episodes merged, teleprompter at
  `/teleprompter`, **Ep 6 generator/config fixed**, **CodeBlock `yaml` fixed**.
- The branch has NOT been rebased onto the new `main`. Before merging, rebase
  or merge `main` in — expect overlap in `src/episodes/*` (main's copies are
  newer and fixed; prefer main's where they conflict).

## Pending: repo separation (decided, partially done)

Decision: this repo stays the front-end; product foundation moves out with
history. README already reworded for the front-end role (`abe607c`).

1. **On the Mac** — create the product repo, then extract with history:

   ```bash
   brew install git-filter-repo
   git clone https://github.com/thedatashrink/thedatashrink.github.io.git datashrink-product
   cd datashrink-product
   git checkout claude/data-product-md-files-eW69V
   git filter-repo --path docs/ --path skills/ --path .out-of-scope/ \
     --path CONTEXT.md --path CLAUDE.md
   git branch -M main
   git remote add origin https://github.com/<owner>/datashrink-product.git
   git push -u origin main
   ```

2. **Then, in this repo** (any session can run it once step 1 is confirmed):

   ```bash
   git rm -r docs skills .out-of-scope CONTEXT.md CLAUDE.md
   git commit -m "Move product foundation to its own repo"
   git push
   ```

Do NOT run step 2 before step 1 is pushed and verified.

## Stockpile access (constraint, not a bug)

- The stockpile lives at `StoianAndrei/TheDataShrink-stockpile` (private),
  **not** under the `TheDataShrink` org.
- Claude Code web sessions for this project are hard-scoped to
  `thedatashrink/thedatashrink.github.io` — both the GitHub MCP tools and the
  git proxy refuse any other repo ("repository not authorized").
- To work on stockpile content: start a session scoped to the stockpile repo,
  paste files into chat, or push a throwaway `stockpile-import` branch to this
  repo and delete it afterwards.

## Open items on the site (small, high-leverage)

- `index.html` `<title>` + `<meta description>` still say "Compliance co-pilot
  for AU/NZ telecom operators" — stale telco copy in every search result and
  link preview. Replace with the agentic Power BI positioning.
- Home hero says "optimisation"; the thesis line ("the .pbix era is ending —
  code + agents") is not yet on the landing page.
- Verify on `main`: Awatea→Northvale slip in `the-development-wheel/prose.md`,
  and the unsourced "85% / 3–5×" metrics in Ep 5/Ep 6 prose.
