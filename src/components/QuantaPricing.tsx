const examples = [
  { task: 'RSM licence application', quanta: 3, note: '18 min' },
  { task: 'Compliance gap assessment', quanta: 5, note: '30 min' },
  { task: 'Privacy Act review', quanta: 4, note: '24 min' },
  { task: 'Spectrum audit report', quanta: 7, note: '42 min' },
  { task: 'Architecture briefing', quanta: 5, note: '30 min' },
]

function QuantaDots({ filled, total = 10 }: { filled: number; total?: number }) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-[2px] transition-colors ${
            i < filled
              ? 'bg-sky-500'
              : 'bg-sky-500/10 border border-sky-500/20'
          }`}
        />
      ))}
    </div>
  )
}

export default function QuantaPricing() {
  return (
    <div className="card rounded-sm p-8 space-y-10">

      {/* Header concept */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="label mb-3">HOW BILLING WORKS</div>
          <h3 className="font-display font-800 text-2xl text-slate-100 mb-3 leading-tight">
            You pay for quanta consumed.<br />
            Not time blocked.
          </h3>
          <p className="text-sm text-slate-500 font-body leading-relaxed">
            One quantum is six minutes of focused, skilled work. AI automation means most tasks
            take far fewer quanta than traditional consulting. You are billed only for what was
            actually needed — not an hourly estimate rounded up.
          </p>
        </div>

        {/* Clock diagram */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center"
            style={{ border: '1px solid rgba(14,165,233,0.2)', background: 'rgba(14,165,233,0.04)' }}
          >
            {/* 10 tick marks around the clock */}
            {Array.from({ length: 10 }).map((_, i) => {
              const angle = (i / 10) * 360 - 90
              const rad = (angle * Math.PI) / 180
              const r = 46
              const x = 56 + r * Math.cos(rad)
              const y = 56 + r * Math.sin(rad)
              return (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-sky-500/60"
                  style={{ left: x - 3, top: y - 3 }}
                />
              )
            })}
            <div className="text-center">
              <div className="font-mono font-700 text-sky-400 text-lg leading-none">10</div>
              <div className="font-mono text-slate-600 text-[0.6rem] leading-tight mt-0.5">quanta</div>
            </div>
          </div>
          <div className="text-center space-y-0.5">
            <p className="font-mono text-xs text-slate-400">
              <span className="text-sky-400 font-700">1 quantum</span> = 6 minutes
            </p>
            <p className="font-mono text-xs text-slate-600">10 quanta = 1 hour</p>
          </div>
        </div>
      </div>

      {/* Quanta examples */}
      <div>
        <div className="label mb-4">TYPICAL ENGAGEMENT COST</div>
        <div className="space-y-3">
          {examples.map((e) => (
            <div key={e.task} className="flex items-center gap-4">
              <div className="w-52 flex-shrink-0">
                <span className="text-xs text-slate-400 font-body">{e.task}</span>
              </div>
              <QuantaDots filled={e.quanta} />
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-mono text-xs text-sky-400 font-700">{e.quanta}Q</span>
                <span className="font-mono text-xs text-slate-700">{e.note}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-700 font-mono mt-4">
          AI automation compresses delivery. A traditional 3-hour engagement may cost 4–6 quanta here.
        </p>
      </div>

      {/* Bottom tagline */}
      <div
        className="flex items-start gap-3 p-4 rounded-sm"
        style={{ background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.1)' }}
      >
        <span className="text-sky-500 font-mono text-lg leading-none flex-shrink-0 mt-0.5">≡</span>
        <p className="text-sm text-slate-400 font-body leading-relaxed">
          <span className="text-slate-200 font-display font-600">I will not charge you for time you did not need.</span>{' '}
          Quanta billing means the efficiency gain from automation is passed directly to you — not
          absorbed as margin.
        </p>
      </div>
    </div>
  )
}
