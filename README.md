# The Data Shrink — Website

The public marketing and education site for The Data Shrink, built with Vite +
React + TypeScript + Tailwind and deployed to GitHub Pages at
[thedatashrink.com](https://www.thedatashrink.com/).

This repository is **the front-end only**. The product foundation and the
engine live in their own repositories (see [Related repositories](#related-repositories)).

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # tsc -b && vite build → ./dist
npm run preview    # preview the production build
```

## Structure

```text
src/
  pages/        route components (Home, Platform, Episodes, Diagnostic, …)
  components/   shared UI (Navbar, Footer, Markdown, CodeBlock, VideoEmbed, …)
  episodes/     the episode series content + multi-series catalogue
  diagnostic/   the interactive diagnostic flow
index.html      app entry
CNAME           custom domain (www.thedatashrink.com)
.github/workflows/deploy.yml   GitHub Pages deploy
```

## Episode series

The site hosts long-form episode series under `src/episodes/`. Each episode is a
folder with a `prose.md` and colocated code/artefact files, registered via the
catalogue in `src/episodes/index.ts`. See
[EPISODES-SERIES.md](EPISODES-SERIES.md) for the original "Building an Agent
from Scratch" plan.

## Deployment

`deploy.yml` builds and publishes to GitHub Pages on every push to `main`.
Work happens on feature branches; merging to `main` ships the site.

> GitHub Pages requires the repository to be public **or** the account to be on
> a paid plan (Pro/Team/Enterprise) while private.

## Related repositories

- **Product / Method** — the docs, concepts, skills, requirements, and ADRs
  (the open "method" layer). _Separate repository._
- **Engine** — the analyzer, generator, validator, and MCP server (the
  proprietary "engine" layer): `spectrumefficiencylimited/power-bi-template`.
