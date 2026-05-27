/**
 * seffMonthlyVarianceWaterfall — the first brick of the real library.
 *
 * This is a faithful sketch of the actual custom visual in
 * spectrumefficiencylimited/power-bi-template (custom-visuals/
 * seffMonthlyVarianceWaterfall). The real source is the source of truth; this
 * trims it to the parts that carry the idea.
 *
 * It is not "a nicer column chart". It is a *contract* — an IBCS-style variance
 * visual that bakes in two things by construction: the organisation's brand
 * theme, and the convention that variance is coloured by meaning (good/bad),
 * never by accident. An author cannot ship an off-brand or mis-coloured
 * variance chart from it, because those choices aren't exposed — they're baked.
 */
import powerbi from 'powerbi-visuals-api'
import IVisual = powerbi.extensibility.visual.IVisual
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions

// capabilities.json — the three data roles the visual binds:
//   category     (Grouping)  e.g. Month
//   actual       (Measure)   e.g. Number of Patients  ← bind the certified one
//   previousYear (Measure)   e.g. Number of Patients SPLY
// objects.theme exposes the brand palette, nothing else colour-related:
//   positiveStrongColor, positiveSoftColor, neutralColor,
//   negativeSoftColor, negativeStrongColor, referenceLineColor

interface VarianceDatum {
  category: string
  actual: number
  previousYear: number | null
  variance: number | null
  variancePct: number | null
  fill: string            // resolved from the theme by meaning, not by the author
}

export class Visual implements IVisual {
  private container: HTMLElement

  constructor(options: VisualConstructorOptions) {
    this.container = options.element
  }

  public update(options: VisualUpdateOptions): void {
    const data = this.parse(options)
    // ... d3 renders the waterfall: actual bars, variance deltas, a reference line.
    this.render(data)
  }

  /** Variance is computed here, and its colour is decided here — not by the user. */
  private parse(options: VisualUpdateOptions): VarianceDatum[] {
    const rows = readRoles(options) // category + actual + previousYear from the dataView
    const theme = this.theme()
    return rows.map((r) => {
      const variance = r.previousYear == null ? null : r.actual - r.previousYear
      const variancePct = r.previousYear ? variance! / r.previousYear : null
      return {
        ...r,
        variance,
        variancePct,
        // The contract: a positive variance is always the brand's "good" colour,
        // negative always "bad". For most metrics up is good; for a metric where
        // up is bad (e.g. wait time) the visual's polarity flag flips this — but
        // the *author* never picks the hex, so a report can't drift off-brand or
        // accidentally paint a regression green.
        fill: variance == null ? theme.neutral
            : variance >= 0 ? theme.positiveStrong
            : theme.negativeStrong,
      }
    })
  }

  private theme() {
    // Pulled from objects.theme — defaults are the brand palette, so an unstyled
    // instance is already on-brand.
    return {
      positiveStrong: '#28A745',
      positiveSoft: '#A7D7B5',
      neutral: '#64748b',
      negativeSoft: '#F1B0B7',
      negativeStrong: '#DC3545',
      referenceLine: '#0066CC',
    }
  }

  private render(_data: VarianceDatum[]): void {
    // d3 draw — see 02-waterfall-demo.html for the rendered result.
  }
}

declare function readRoles(o: VisualUpdateOptions): Array<{ category: string; actual: number; previousYear: number | null }>
