/**
 * The Awatea visual library — registry.
 *
 * Episode 4 built one brick (the Governed KPI Card). A brick is a trick.
 * The library is the product: a small, named set of governed modules, each
 * carrying the same two non-negotiables — brand identity and a governance
 * contract — so that a report assembled from them is right and on-brand by
 * construction.
 *
 * This registry is the seam the agent (Episode 6) reads from. It does not
 * render anything; it declares what exists, what each module needs, and the
 * rule each one enforces. The registry is the library's API.
 */

/** Shared brand tokens — defined once, inherited by every module. */
export const BRAND = {
  font: 'Inter, system-ui, sans-serif',
  ink: '#0f172a',
  muted: '#64748b',
  accent: '#0ea5e9',
  good: '#10b981',
  warn: '#f59e0b',
  bad: '#ef4444',
  radius: 10,
} as const

/** Every module declares the data it binds and the contract it enforces. */
export interface ModuleSpec {
  /** Stable id the agent references when assembling a report. */
  id: string
  name: string
  /** What an author must bind. `certifiedMeasure` fields refuse uncertified inputs. */
  inputs: Array<{ role: string; kind: 'certifiedMeasure' | 'dimension' | 'measure'; required: boolean }>
  /** The one-sentence contract this module guarantees. */
  contract: string
  /** Minimum grid footprint (PBIP layout units) — used by the assembler. */
  minSize: { w: number; h: number }
}

export const LIBRARY: ModuleSpec[] = [
  {
    id: 'tds.kpiCard',
    name: 'Governed KPI Card',
    inputs: [{ role: 'value', kind: 'certifiedMeasure', required: true }],
    contract: 'Headline number must be a certified measure; provenance always shown.',
    minSize: { w: 3, h: 2 },
  },
  {
    id: 'tds.trend',
    name: 'Trend',
    inputs: [
      { role: 'value', kind: 'certifiedMeasure', required: true },
      { role: 'time', kind: 'dimension', required: true },
    ],
    contract: 'Time axis must be a conformed date dimension — no ad-hoc date columns.',
    minSize: { w: 6, h: 3 },
  },
  {
    id: 'tds.variance',
    name: 'Variance vs Target',
    inputs: [
      { role: 'actual', kind: 'certifiedMeasure', required: true },
      { role: 'target', kind: 'certifiedMeasure', required: true },
    ],
    contract: 'Actual and target must share units; colour follows brand good/bad, never red-means-up.',
    minSize: { w: 4, h: 2 },
  },
  {
    id: 'tds.governedTable',
    name: 'Governed Table',
    inputs: [
      { role: 'rows', kind: 'dimension', required: true },
      { role: 'measures', kind: 'certifiedMeasure', required: true },
    ],
    contract: 'Columns are certified measures only; dimensions must be conformed.',
    minSize: { w: 6, h: 4 },
  },
]

/** Look-up used by the assembler in Episode 6. */
export const moduleById = (id: string): ModuleSpec | undefined =>
  LIBRARY.find((m) => m.id === id)

/**
 * Improve a brick once, every report inherits it. That is the compounding the
 * development wheel (Episode 7) runs on: a hand-built report is a liability
 * that decays; a library is an asset that appreciates.
 */
