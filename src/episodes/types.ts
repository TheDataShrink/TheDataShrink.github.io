/**
 * Episode model — Candidate 1 from the architecture-review v2.
 *
 * Each episode lives in a folder under src/episodes/<slug>/ with a prose.md
 * and one or more code files. This type pins the shape; the catalog in
 * ./index.ts loads everything via Vite's import.meta.glob.
 */

export type Language = 'python' | 'sql' | 'r' | 'typescript' | 'javascript' | 'html' | 'json' | 'd3'

export interface CodeFile {
  filename: string
  source: string
  language: Language
}

/** A content track. Episodes belong to exactly one series. */
export interface Series {
  id: string                   // stable slug, e.g. 'building-an-agent'
  title: string
  tagline: string              // one line under the series title on the index
  description: string          // longer blurb for the series header
  order: number                // display order on the index (lower = first)
}

export interface EpisodeMeta {
  slug: string
  number: number
  series: string               // Series.id this episode belongs to
  title: string
  hook: string                 // one-sentence summary for the index card
  date: string                 // ISO date
  primaryLanguage: Language    // pill shown in the index
  languages: Language[]        // every language touched in this episode
  tags: string[]
  readingMinutes: number       // estimated read time for the prose
  source: string               // "Huyen Ch 5, p220–235" etc.
  optional?: boolean
}

export interface Episode extends EpisodeMeta {
  prose: string                // raw markdown
  code: CodeFile[]             // colocated code, sorted by filename
}
