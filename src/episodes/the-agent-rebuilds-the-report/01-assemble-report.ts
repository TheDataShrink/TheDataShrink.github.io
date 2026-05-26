/**
 * The assembler — a brief in, a PBIP report out.
 *
 * This is the Engine doing what a careful person did in Episode 5: choosing
 * governed modules and placing them. The agent never touches pixels. It reads
 * the library registry, binds *certified* measures to declared inputs, lays the
 * modules out on the grid, and emits a .pbip report definition that Power BI
 * opens directly. Because .pbip is text/JSON, this is just writing a file.
 *
 * The orchestration shape from the strategy doc:
 *   brief  ->  orchestrator (plan)  ->  bind measures  ->  lay out  ->  report.json
 */
import { LIBRARY, moduleById, type ModuleSpec } from '../the-library/01-library-registry'

interface Brief {
  title: string
  /** What the requester asked for, already resolved to module ids by the planner. */
  wants: Array<{ moduleId: string; bind: Record<string, string> }>
}

/** The estate's certified measures — the only things the assembler may bind. */
const CERTIFIED = new Set<string>([
  'Patient Flow Model.Total Patients',
  'Patient Flow Model.ED Median Wait',
  'Patient Flow Model.Occupancy %',
])

interface PlacedVisual {
  module: string
  x: number; y: number; w: number; h: number
  bindings: Record<string, string>
}

const GRID_COLS = 12

/** Greedy left-to-right, top-to-bottom placement using each module's minSize. */
function layout(modules: Array<{ spec: ModuleSpec; bind: Record<string, string> }>): PlacedVisual[] {
  const placed: PlacedVisual[] = []
  let x = 0, y = 0, rowH = 0
  for (const { spec, bind } of modules) {
    if (x + spec.minSize.w > GRID_COLS) { x = 0; y += rowH; rowH = 0 }
    placed.push({ module: spec.id, x, y, w: spec.minSize.w, h: spec.minSize.h, bindings: bind })
    x += spec.minSize.w
    rowH = Math.max(rowH, spec.minSize.h)
  }
  return placed
}

/** The contract gate: refuse to bind anything that isn't certified. */
function assertGoverned(spec: ModuleSpec, bind: Record<string, string>): void {
  for (const input of spec.inputs) {
    if (input.kind !== 'certifiedMeasure') continue
    const bound = bind[input.role]
    if (input.required && !bound) {
      throw new Error(`${spec.id}: input "${input.role}" is required`)
    }
    if (bound && !CERTIFIED.has(bound)) {
      // Same rule as Episode 4's card — enforced now at assembly time, before
      // a single pixel is drawn. The Engine cannot build a drifting report.
      throw new Error(`${spec.id}: "${bound}" is not certified — refusing to assemble`)
    }
  }
}

/** Assemble a brief into a PBIP report definition. */
export function assemble(brief: Brief) {
  const modules = brief.wants.map((w) => {
    const spec = moduleById(w.moduleId)
    if (!spec) throw new Error(`unknown module ${w.moduleId}`)
    assertGoverned(spec, w.bind)
    return { spec, bind: w.bind }
  })

  const placed = layout(modules)

  // Shape mirrors a PBIP report's report.json visualContainers.
  return {
    $schema: 'https://developer.microsoft.com/json-schemas/fabric/item/report/definition',
    name: brief.title,
    sections: [
      {
        name: 'Page1',
        displayName: brief.title,
        visualContainers: placed.map((v, i) => ({
          id: `vc${i}`,
          module: v.module,
          layout: { x: v.x, y: v.y, w: v.w, h: v.h },
          bindings: v.bindings,
        })),
      },
    ],
    provenance: {
      assembledBy: 'tds-engine',
      library: LIBRARY.map((m) => m.id),
      certifiedOnly: true,
    },
  }
}

// Example brief — "an executive patient-flow summary":
export const EXEC_BRIEF: Brief = {
  title: 'Executive Patient Flow',
  wants: [
    { moduleId: 'tds.kpiCard', bind: { value: 'Patient Flow Model.Total Patients' } },
    { moduleId: 'tds.kpiCard', bind: { value: 'Patient Flow Model.Occupancy %' } },
    { moduleId: 'tds.trend', bind: { value: 'Patient Flow Model.ED Median Wait', time: 'Date.Date' } },
    { moduleId: 'tds.governedTable', bind: { rows: 'Facility.Name', measures: 'Patient Flow Model.Total Patients' } },
  ],
}
