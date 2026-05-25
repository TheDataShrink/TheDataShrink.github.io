/**
 * Central episode catalog.
 *
 * Hand-written metadata (CATALOG) is the source of truth for what shows up
 * on the index page and in what order. Prose and code files are loaded in
 * bulk via Vite's import.meta.glob — adding a new episode means: create the
 * folder, drop in prose.md and code, append one entry here.
 */

import type { CodeFile, Episode, EpisodeMeta, Language } from './types'

const PROSE = import.meta.glob('./*/prose.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>
const CODE = import.meta.glob('./*/*.{py,sql,ts,js,R,r,html,json}', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>

function detectLanguage(filename: string): Language {
  const ext = filename.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'py') return 'python'
  if (ext === 'sql') return 'sql'
  if (ext === 'r') return 'r'
  if (ext === 'ts') return 'typescript'
  if (ext === 'js') return 'javascript'
  if (ext === 'html') return 'html'
  if (ext === 'json') return 'json'
  return 'python'
}

const CATALOG: EpisodeMeta[] = [
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

export const adjacentEpisodes = (slug: string): { prev?: Episode; next?: Episode } => {
  const i = episodes.findIndex((e) => e.slug === slug)
  if (i < 0) return {}
  return { prev: episodes[i - 1], next: episodes[i + 1] }
}

export type { Episode, EpisodeMeta, CodeFile, Language } from './types'
