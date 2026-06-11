/**
 * Central episode catalog.
 *
 * Hand-written metadata (CATALOG) is the source of truth for what shows up
 * on the index page and in what order. Prose and code files are loaded in
 * bulk via Vite's import.meta.glob — adding a new episode means: create the
 * folder, drop in prose.md and code, append one entry here.
 */

import type { CodeFile, Episode, EpisodeMeta, Language, Series } from './types'

/** Content tracks. Order controls how they stack on the /episodes index. */
export const SERIES: Series[] = [
  {
    id: 'reflecting-an-estate',
    title: 'Reflecting a Real Power BI Estate',
    tagline: 'The applied track — the Data Shrink method, end to end, on one estate.',
    description:
      'Take a Power BI estate and walk it through the whole method: reflection before optimisation. ' +
      'Build the semantic map, surface the dependencies hiding in plain sight, define what good looks like ' +
      'here, then assemble reports from a governed, branded visual library. Built on a synthetic estate so ' +
      'nothing sensitive moves — the same synthetic-data start the engagement uses.',
    order: 0,
  },
  {
    id: 'building-an-agent',
    title: 'Building an Agent from Scratch',
    tagline: 'The foundations track — from one model call to a production-shaped agent.',
    description:
      'A father’s notes to his children on how they would build an AI agent from nothing. Twelve episodes ' +
      'that go from a single language-model call to a working, evaluated, production-shaped agent. Each adds ' +
      'one capability to the agent built in the previous one; the code accretes, nothing is thrown away.',
    order: 1,
  },
  {
    id: 'the-engine-gets-a-socket',
    title: 'The Engine Gets a Socket',
    tagline: 'The product track — the Engine becomes an MCP server any agent can call.',
    description:
      'The applied track ended with an Engine that rebuilds reports from governed modules — driven by our ' +
      'scripts, on our machine. This series wraps it in the Model Context Protocol so any AI agent gets the ' +
      'same governed hands over a Power BI estate. Six episodes, built in trust order: read, index, write ' +
      'behind a gate, own the layers Microsoft doesn’t, then try to make it lie. Every artifact is a real ' +
      'output of the server against a 19-project test estate — nothing constructed.',
    order: 2,
  },
]

const PROSE = import.meta.glob('./*/prose.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>
const CODE = import.meta.glob('./*/*.{py,sql,ts,js,R,r,html,json,yaml,yml}', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>

function detectLanguage(filename: string): Language {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'py') return 'python'
  if (ext === 'sql') return 'sql'
  if (ext === 'r') return 'r'
  if (ext === 'ts') return 'typescript'
  if (ext === 'js') return 'javascript'
  if (ext === 'html') return 'html'
  if (ext === 'json') return 'json'
  if (ext === 'yaml' || ext === 'yml') return 'yaml'
  return 'python'
}

type EpisodeSeed = Omit<EpisodeMeta, 'series'>

/** "Building an Agent from Scratch" — the foundations track. */
const AGENT_EPISODES: EpisodeSeed[] = [
  {
    slug: '00-what-is-an-agent',
    number: 0,
    title: 'What even is an agent?',
    hook: 'A letter to my children: the why before the how, and the love-vs-fear posture that shows up in every line of agent code.',
    date: '2026-05-23',
    primaryLanguage: 'd3',
    languages: ['d3'],
    tags: ['intro', 'philosophy'],
    readingMinutes: 10,
    source: 'Huyen Ch 1; Ch 6 §Agents Overview p275–278',
  },
  {
    slug: '01-just-a-prompt',
    number: 1,
    title: 'The cheapest version: a prompted LLM',
    hook: 'Before any framework, before any tool — can a single well-written prompt solve 60% of your problem? Usually yes.',
    date: '2026-05-23',
    primaryLanguage: 'python',
    languages: ['python'],
    tags: ['prompting', 'baseline'],
    readingMinutes: 15,
    source: 'Huyen Ch 5 §Best Practices p220–235; §Defensive Prompt Engineering p235–251',
  },
  {
    slug: '02-give-it-hands',
    number: 2,
    title: 'Give it hands: tools and function calling',
    hook: 'An LLM that cannot act is a search engine with extra steps. Tools are how it acts — and how it goes wrong.',
    date: '2026-05-23',
    primaryLanguage: 'python',
    languages: ['python'],
    tags: ['tools', 'function-calling'],
    readingMinutes: 18,
    source: 'Huyen Ch 6 §Tools p278–281; §Agent Failure Modes p298–300',
  },
  {
    slug: '03-rag-from-first-principles',
    number: 3,
    title: 'Knowledge: RAG from first principles',
    hook: 'Build a tiny hybrid retriever with Postgres and pgvector — no framework — and evaluate recall@k before evaluating the agent.',
    date: '2026-05-23',
    primaryLanguage: 'python',
    languages: ['python', 'sql'],
    tags: ['rag', 'retrieval', 'pgvector'],
    readingMinutes: 25,
    source: 'Huyen Ch 6 §RAG p253–273',
  },
  {
    slug: '04-memory',
    number: 4,
    title: 'Memory: short and long term',
    hook: 'Hybrid memory — rolling summary plus a typed fact store with semantic dedup and an explicit right to be forgotten.',
    date: '2026-05-23',
    primaryLanguage: 'python',
    languages: ['python', 'sql', 'd3'],
    tags: ['memory', 'pgvector', 'visualization'],
    readingMinutes: 22,
    source: 'Huyen Ch 6 §Memory p300–305',
  },
  {
    slug: '05-the-planning-loop',
    number: 5,
    title: 'The planning loop: ReAct, plans, and replanning',
    hook: 'ReAct in thirty lines, then plan-then-execute with a parallel DAG and replanning when reality contradicts the plan.',
    date: '2026-05-23',
    primaryLanguage: 'python',
    languages: ['python'],
    tags: ['planning', 'react', 'agent-loop'],
    readingMinutes: 25,
    source: 'Huyen Ch 6 §Planning p281–298',
  },
  {
    slug: '06-evaluation',
    number: 6,
    title: 'How do I know it works? Evaluation',
    hook: 'The episode that separates real practitioners from people who built one demo and stopped. AI-as-judge with self-consistency and bootstrap confidence intervals in R.',
    date: '2026-05-23',
    primaryLanguage: 'python',
    languages: ['python', 'r'],
    tags: ['evaluation', 'judge', 'statistics'],
    readingMinutes: 28,
    source: 'Huyen Ch 3 (Eval Methodology); Ch 4 (Evaluate AI Systems)',
  },
  {
    slug: '07-failure-modes',
    number: 7,
    title: 'When agents go wrong: a failure-mode taxonomy',
    hook: 'Five recurring shapes account for almost every agent failure. Name the shape before reaching for the medicine.',
    date: '2026-05-23',
    primaryLanguage: 'd3',
    languages: ['d3', 'python'],
    tags: ['failure-modes', 'debugging', 'taxonomy'],
    readingMinutes: 15,
    source: 'Huyen Ch 6 §Agent Failure Modes p298–300',
  },
  {
    slug: '08-cheap-and-fast',
    number: 8,
    title: 'Cheap and fast: inference, caching, routing',
    hook: 'A working agent that costs forty cents per turn is a prototype. Three caches, one router, and an honest Pareto plot.',
    date: '2026-05-23',
    primaryLanguage: 'python',
    languages: ['python', 'd3'],
    tags: ['cost', 'latency', 'caching', 'routing'],
    readingMinutes: 22,
    source: 'Huyen Ch 9 (Inference Optimization); Ch 10 step 4 (caches)',
  },
  {
    slug: '09-guardrails-gateway-observability',
    number: 9,
    title: 'Guardrails, gateway, observability',
    hook: 'What stands between the model and the world: input/output validators, a Node gateway with retries and routing, and OpenTelemetry traces.',
    date: '2026-05-23',
    primaryLanguage: 'python',
    languages: ['python', 'typescript'],
    tags: ['production', 'observability', 'security'],
    readingMinutes: 22,
    source: 'Huyen Ch 10 steps 1–3; §Monitoring p465–472',
  },
  {
    slug: '10-feedback-loop',
    number: 10,
    title: 'The feedback loop: getting better over time',
    hook: 'The agent you ship is your worst agent. The schema, pipeline, and weekly digest that turn bad outputs into the next eval fixtures.',
    date: '2026-05-23',
    primaryLanguage: 'python',
    languages: ['python', 'sql'],
    tags: ['feedback', 'improvement', 'flywheel'],
    readingMinutes: 20,
    source: 'Huyen Ch 10 §User Feedback p474–490',
  },
  {
    slug: '11-when-finetuning-earns-its-keep',
    number: 11,
    title: 'When finetuning earns its keep',
    hook: 'Almost never as early as you think. The four conditions, the data work that’s the real blocker, and a minimal LoRA in fifty lines.',
    date: '2026-05-23',
    primaryLanguage: 'python',
    languages: ['python', 'r'],
    tags: ['finetuning', 'lora', 'optional'],
    readingMinutes: 20,
    source: 'Huyen Ch 7 (Finetuning); Ch 8 (Dataset Engineering)',
    optional: true,
  },
]

/** "Reflecting a Real Power BI Estate" — the applied track. */
const POWERBI_EPISODES: EpisodeSeed[] = [
  {
    slug: 'estate-as-we-found-it',
    number: 0,
    title: 'The estate as we found it',
    hook: 'Reflection before optimisation. Open by honouring the real, evolved system — what they built, and why it looks the way it does — before a single recommendation.',
    date: '2026-05-26',
    primaryLanguage: 'd3',
    languages: ['d3', 'json'],
    tags: ['reflection', 'method', 'trust'],
    readingMinutes: 14,
    source: 'CONTEXT.md · concepts/architecture-reflection.md',
  },
  {
    slug: 'reading-the-map',
    number: 1,
    title: 'Reading the map',
    hook: 'Build the semantic topology of the real estate from metadata alone — reports → datasets → models → sources → gateways — and learn to read it out loud.',
    date: '2026-05-26',
    primaryLanguage: 'd3',
    languages: ['d3', 'json'],
    tags: ['reflection', 'semantic-observability', 'lineage'],
    readingMinutes: 18,
    source: 'skills/generate-architecture-visuals · concepts/semantic-observability.md',
  },
  {
    slug: 'dependencies-in-plain-sight',
    number: 2,
    title: 'The dependencies hiding in plain sight',
    hook: 'Trace lineage upward from the sources nobody documented. The spreadsheet on SharePoint turns out to be load-bearing for a board report — here is its blast radius.',
    date: '2026-05-26',
    primaryLanguage: 'd3',
    languages: ['d3', 'json'],
    tags: ['lineage', 'shadow-it', 'risk'],
    readingMinutes: 16,
    source: 'requirements/003-lineage-agent.md · concepts/analytics-entropy.md',
  },
  {
    slug: 'what-good-looks-like-here',
    number: 3,
    title: 'What "good" looks like here',
    hook: 'Turn everything the map and the blast radius made visible into this estate’s own definition of good — a capability baseline with a number to improve. This is what finally earns the word optimisation.',
    date: '2026-05-26',
    primaryLanguage: 'd3',
    languages: ['d3', 'json'],
    tags: ['analytics-entropy', 'baseline', 'governance'],
    readingMinutes: 17,
    source: 'concepts/analytics-entropy.md · the-reflection.md (Capability Baseline)',
  },
  {
    slug: 'the-first-custom-visual',
    number: 4,
    title: 'The first custom visual',
    hook: 'Stop hand-building reports. The real seffMonthlyVarianceWaterfall as a contract — variance coloured by meaning, brand baked from the theme, drift impossible by construction. The first brick of the library.',
    date: '2026-05-26',
    primaryLanguage: 'typescript',
    languages: ['typescript', 'd3'],
    tags: ['modular-visual-intelligence', 'custom-visual', 'ibcs'],
    readingMinutes: 19,
    source: 'power-bi-template custom-visuals/seffMonthlyVarianceWaterfall',
  },
  {
    slug: 'the-library',
    number: 5,
    title: 'The library',
    hook: 'One brick is a trick; a set is a product. The real modules/ library — KPI strip, gauge, heatmap, slicers — with a JSON schema machine-readable enough that a report can be generated instead of hand-built.',
    date: '2026-05-26',
    primaryLanguage: 'json',
    languages: ['json', 'd3'],
    tags: ['modular-visual-intelligence', 'library', 'modules'],
    readingMinutes: 17,
    source: 'power-bi-template modules/ · MODULAR_SYSTEM_BENEFITS.md',
  },
  {
    slug: 'the-agent-rebuilds-the-report',
    number: 6,
    title: 'The agent rebuilds the report',
    hook: 'A YAML config in, governed modules out — generated by the real Python orchestrator, gated by the estate’s own validation rules. The Engine doing what the method used to do by hand.',
    date: '2026-05-26',
    primaryLanguage: 'python',
    languages: ['python', 'yaml'],
    tags: ['agent', 'pbip', 'automation', 'engine'],
    readingMinutes: 20,
    source: 'power-bi-template modules/scripts · strategy/pbip-facts.md',
  },
  {
    slug: 'the-development-wheel',
    number: 7,
    title: 'The development wheel',
    hook: 'Reflection is a moment; the wheel is forever. Cadence, compounding cross-estate intelligence, and the baseline number climbing quarter over quarter — the part a single team cannot bootstrap alone.',
    date: '2026-05-26',
    primaryLanguage: 'd3',
    languages: ['d3'],
    tags: ['cadence', 'compounding', 'flywheel'],
    readingMinutes: 16,
    source: 'product-thesis.md · product-ladder.md',
  },
]

/** "The Engine Gets a Socket" — the product track (datashrink-mcp-pbip). */
const MCP_EPISODES: EpisodeSeed[] = [
  {
    slug: 'the-layer-nobody-owns',
    number: 1,
    title: 'The layer nobody owns',
    hook: 'Microsoft ships two Power BI MCP servers. Neither touches the layer the organisation actually experiences — and that gap is the product.',
    date: '2026-06-11',
    primaryLanguage: 'json',
    languages: [],
    tags: ['mcp', 'strategy', 'pbip'],
    readingMinutes: 7,
    source: 'datashrink_pbip v0.2.0 design notes · Microsoft MCP server docs',
  },
  {
    slug: 'a-server-that-only-reads',
    number: 2,
    title: 'A server that only reads',
    hook: 'The first version cannot write — not "doesn’t," cannot. That constraint is why it sold.',
    date: '2026-06-11',
    primaryLanguage: 'json',
    languages: ['json'],
    tags: ['mcp', 'read-only', 'governance', 'trust'],
    readingMinutes: 7,
    source: 'datashrink_pbip v0.2.0 · live scan of the 19-project estate',
  },
  {
    slug: 'a-registry-of-decisions',
    number: 3,
    title: 'A registry of decisions',
    hook: 'The least interesting-sounding episode contains the idea the write path stands on: store the intent, not the snapshot.',
    date: '2026-06-11',
    primaryLanguage: 'json',
    languages: ['json'],
    tags: ['mcp', 'components', 'binding-contract'],
    readingMinutes: 7,
    source: 'datashrink_pbip v0.2.0 · the multi-year waterfall module contract',
  },
  {
    slug: 'the-write-path',
    number: 4,
    title: 'The write path',
    hook: 'Keep, inside a server that edits files, the property that made the read-only server safe: the worst case is nothing happens.',
    date: '2026-06-11',
    primaryLanguage: 'json',
    languages: ['json'],
    tags: ['mcp', 'two-phase-write', 'validation', 'safety'],
    readingMinutes: 7,
    source: 'datashrink_pbip v0.2.0 · captured dry-run and blocked commit',
  },
  {
    slug: 'the-layer-microsoft-cannot-touch',
    number: 5,
    title: 'The layer Microsoft cannot touch',
    hook: 'Modeling MCP explicitly stops above Power Query. That is where the spreadsheets hide — 71 hard-coded paths across one real estate.',
    date: '2026-06-11',
    primaryLanguage: 'json',
    languages: ['json'],
    tags: ['mcp', 'power-query', 'm-lint', 'lineage'],
    readingMinutes: 7,
    source: 'datashrink_pbip v0.2.0 · unedited M-lint run across 19 projects',
  },
  {
    slug: 'proving-it-real',
    number: 6,
    title: 'Proving it real',
    hook: 'An AI agent tested the server that gives AI agents hands: 14 protocol checks, one deliberate lie refused, and Power BI Desktop rendering the result.',
    date: '2026-06-11',
    primaryLanguage: 'python',
    languages: ['python'],
    tags: ['mcp', 'testing', 'protocol', 'evidence'],
    readingMinutes: 8,
    source: 'datashrink_pbip v0.2.0 · the 14-check stdio harness, live session 2026-06-11',
  },
]

/** One catalog per series, each tagged with its series id. */
const CATALOG: EpisodeMeta[] = [
  ...POWERBI_EPISODES.map((m) => ({ ...m, series: 'reflecting-an-estate' })),
  ...AGENT_EPISODES.map((m) => ({ ...m, series: 'building-an-agent' })),
  ...MCP_EPISODES.map((m) => ({ ...m, series: 'the-engine-gets-a-socket' })),
]

function loadCode(slug: string): CodeFile[] {
  const prefix = `./${slug}/`
  return Object.entries(CODE)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, source]) => {
      const filename = path.slice(prefix.length)
      return { filename, source, language: detectLanguage(filename) }
    })
    .sort((a, b) => a.filename.localeCompare(b.filename))
}

export const episodes: Episode[] = CATALOG.map((meta) => {
  const proseKey = `./${meta.slug}/prose.md`
  const prose = PROSE[proseKey]
  if (!prose) throw new Error(`prose.md missing for ${meta.slug}`)
  return { ...meta, prose, code: loadCode(meta.slug) }
})

export const episodeBySlug = (slug: string): Episode | undefined =>
  episodes.find((e) => e.slug === slug)

/** Episodes in one series, in episode-number order. */
export const episodesInSeries = (seriesId: string): Episode[] =>
  episodes.filter((e) => e.series === seriesId).sort((a, b) => a.number - b.number)

/** Series in display order, paired with their episodes. */
export const seriesWithEpisodes = (): { series: Series; episodes: Episode[] }[] =>
  [...SERIES]
    .sort((a, b) => a.order - b.order)
    .map((series) => ({ series, episodes: episodesInSeries(series.id) }))
    .filter((s) => s.episodes.length > 0)

/** Prev/next scoped to the episode's own series. */
export const adjacentEpisodes = (slug: string): { prev?: Episode; next?: Episode } => {
  const current = episodeBySlug(slug)
  if (!current) return {}
  const within = episodesInSeries(current.series)
  const i = within.findIndex((e) => e.slug === slug)
  return { prev: within[i - 1], next: within[i + 1] }
}

export type { Episode, EpisodeMeta, CodeFile, Language, Series } from './types'
