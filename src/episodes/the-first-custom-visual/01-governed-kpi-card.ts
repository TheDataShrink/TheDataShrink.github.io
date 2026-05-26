/**
 * Governed KPI Card — the first brick of the modular visual library.
 *
 * This is not "a nicer card visual". It is a *contract* on the gold layer.
 * The rule it enforces, by construction: a headline number on a report may
 * only come from a certified semantic measure, and its provenance is always
 * visible. An author physically cannot wire an uncertified measure into it
 * and get a clean number out — they get a governance warning instead.
 *
 * Built against the powerbi-visuals-api (pbiviz). Trimmed to the parts that
 * carry the idea; styling lives in the .less file in a real project.
 */
import powerbi from 'powerbi-visuals-api'
import IVisual = powerbi.extensibility.visual.IVisual
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions
import DataView = powerbi.DataView

interface Bound {
  label: string
  value: number
  format: string
  /** From the model metadata: is the measure's home model certified? */
  certified: boolean
  /** The measure's fully-qualified name, shown as provenance. */
  source: string
}

export class GovernedKpiCard implements IVisual {
  private root: HTMLElement

  constructor(options: VisualConstructorOptions) {
    this.root = options.element
    this.root.classList.add('tds-kpi')
  }

  public update(options: VisualUpdateOptions): void {
    const bound = this.read(options.dataViews?.[0])

    if (!bound) {
      return this.render(`<div class="tds-empty">Drag a certified measure here.</div>`)
    }

    // The contract. An uncertified measure never renders as a headline number.
    if (!bound.certified) {
      return this.render(`
        <div class="tds-warn">
          <div class="tds-warn-flag">UNGOVERNED SOURCE</div>
          <div class="tds-warn-msg">
            <b>${esc(bound.label)}</b> is driven by <code>${esc(bound.source)}</code>,
            which is not a certified semantic measure.
          </div>
          <div class="tds-warn-hint">
            Point this card at a certified measure, or certify the source model.
          </div>
        </div>`)
    }

    // Governed path: the number, plus always-on provenance.
    this.render(`
      <div class="tds-value">${formatNumber(bound.value, bound.format)}</div>
      <div class="tds-label">${esc(bound.label)}</div>
      <div class="tds-provenance" title="Certified semantic measure">
        <span class="tds-dot"></span>${esc(bound.source)}
      </div>`)
  }

  /** Pull the single measure + its governance metadata out of the dataView. */
  private read(dv?: DataView): Bound | null {
    const col = dv?.categorical?.values?.[0]
    if (!col) return null
    const meta = col.source
    const objs = meta.objects?.governance
    return {
      label: meta.displayName,
      value: Number(col.values?.[0] ?? 0),
      format: (meta.format as string) ?? '#,0',
      certified: Boolean(objs?.certified ?? false),
      source: (objs?.qualifiedName as string) ?? meta.queryName,
    }
  }

  private render(html: string): void {
    this.root.innerHTML = html
  }
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))
}

function formatNumber(v: number, _format: string): string {
  // Real visual delegates to powerbi.extensibility.utils.formatting; kept simple here.
  return v >= 1000 ? v.toLocaleString('en-NZ') : String(v)
}
