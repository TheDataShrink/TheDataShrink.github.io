import { Link } from 'react-router-dom'
import { ArrowRight, GitBranch, Gauge, ShieldCheck, Sparkles } from 'lucide-react'

const debts = [
  { metric: 'semantic drift', detail: 'the same business term, three different definitions across reports' },
  { metric: 'duplicated logic', detail: 'measures and transformations rebuilt instead of reused' },
  { metric: 'raw-layer querying', detail: 'reports hitting source tables with no governed model between' },
  { metric: 'shadow IT', detail: 'spreadsheets and manual steps holding the estate together' },
]

const agents = [
  { icon: <GitBranch className="w-4 h-4" />, name: 'Lineage', desc: 'report → source, every dependency' },
  { icon: <Gauge className="w-4 h-4" />, name: 'Performance', desc: 'heavy models, bad DAX, wasted cardinality' },
  { icon: <ShieldCheck className="w-4 h-4" />, name: 'Governance', desc: 'shadow IT, drift, ungoverned transforms' },
  { icon: <Sparkles className="w-4 h-4" />, name: 'Optimisation', desc: 'SQL views, aggregates, curated assets' },
]

const credentials = [
  'Agentic Power BI',
  'PBIP · TMDL',
  'Sovereign AI',
  'Knowledge Graphs',
  'Semantic Modelling',
  'Microsoft Fabric',
  'DAX Optimisation',
  'Medallion Architecture',
  'Human-in-the-Loop',
  'NZ · Pacific',
]

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="pt-[52px] bg-grid min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-6 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="animate-in">
              <p className="label mb-6">
                AGENT-DRIVEN POWER BI OPTIMISATION &nbsp;·&nbsp; SOVEREIGN &nbsp;·&nbsp; HUMAN-GOVERNED
              </p>
              <h1 className="font-display font-800 text-4xl md:text-5xl lg:text-[3.25rem] text-slate-100 leading-[1.1] mb-6">
                Your dashboards are telling you where the architecture is broken.
              </h1>
              <p className="text-slate-400 font-body text-lg leading-relaxed mb-6 max-w-lg">
                The Data Shrink is a sovereign agent system that reads your Power BI estate —
                reports, semantic models, lineage, queries — and finds the technical debt
                upstream. It recommends the fix. You approve it.
              </p>
              <p className="text-slate-500 font-body text-sm leading-relaxed mb-10 max-w-lg">
                Runs inside your firewall. Zero data leakage. Nothing reaches production
                without human review.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/platform" className="btn-primary">
                  Explore the platform <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/diagnostic" className="btn-ghost">
                  Run a discovery scan <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Terminal card */}
            <div className="terminal animate-in delay-2 rounded-sm overflow-hidden">
              <div className="terminal-header">
                <div className="terminal-dot bg-red-500/70" />
                <div className="terminal-dot bg-amber-500/70" />
                <div className="terminal-dot bg-emerald-500/70" />
                <span className="ml-2 text-[0.65rem] text-slate-600 tracking-wider">discovery-scan.sh</span>
              </div>
              <div className="p-5 space-y-1.5 text-[0.78rem] leading-relaxed">
                <p className="text-sky-400">{'>'} SCANNING PBIP ESTATE</p>
                <p className="text-slate-600">{'─'.repeat(34)}</p>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reports parsed</span>
                  <span className="text-emerald-400">✓ 142</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Semantic models</span>
                  <span className="text-emerald-400">✓ 28</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duplicate measures</span>
                  <span className="text-amber-400">⚠ 61 found</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DirectQuery misuse</span>
                  <span className="text-amber-400">⚠ 9 models</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lineage gaps</span>
                  <span className="text-amber-400">⚠ 17 fragile</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data egress</span>
                  <span className="text-emerald-400">✓ 0 bytes</span>
                </div>
                <p className="text-slate-600">{'─'.repeat(34)}</p>
                <p className="text-slate-600 text-[0.72rem]">
                  RUNNING LOCAL · SOVEREIGN MODE{' '}
                  <span className="cursor" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The debt */}
      <section className="py-24 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-3">WHAT WE FIND</div>
          <h2 className="font-display font-800 text-3xl text-slate-100 mb-2 max-w-2xl">
            The dashboard is rarely the problem.
          </h2>
          <p className="text-slate-500 font-body text-sm mb-12 max-w-xl">
            Power BI is the customer-facing truth layer — it exposes the inefficiencies that
            originate upstream, in poorly structured data assets.
          </p>
          <div style={{ borderTop: '1px solid rgba(14,165,233,0.07)' }}>
            {debts.map((d) => (
              <div
                key={d.metric}
                className="flex items-baseline gap-6 py-5"
                style={{ borderBottom: '1px solid rgba(14,165,233,0.07)' }}
              >
                <span className="font-mono text-sm text-amber-400 w-44 flex-shrink-0">{d.metric}</span>
                <p className="text-sm text-slate-500 font-body">{d.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents preview */}
      <section className="py-24 bg-grid">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-3">THE AGENTS</div>
          <h2 className="font-display font-800 text-3xl text-slate-100 mb-2">
            Specialists that share one knowledge graph.
          </h2>
          <p className="text-slate-500 font-body text-sm mb-10 max-w-xl">
            Each reads the same map of your estate. Six in all — here are four.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {agents.map((a) => (
              <div key={a.name} className="card rounded-sm p-5">
                <div className="w-8 h-8 rounded-sm bg-sky-500/10 border border-sky-500/15 flex items-center justify-center text-sky-400 mb-4">
                  {a.icon}
                </div>
                <h3 className="font-display font-700 text-slate-100 mb-1">{a.name} Agent</h3>
                <p className="text-sm text-slate-500 font-body leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
          <Link to="/platform" className="btn-outline">
            See all six + how it works <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Credential marquee */}
      <section className="py-5 overflow-hidden" style={{ borderTop: '1px solid rgba(14,165,233,0.06)', borderBottom: '1px solid rgba(14,165,233,0.06)' }}>
        <div className="marquee-track flex gap-14 w-max">
          {[...credentials, ...credentials].map((c, i) => (
            <span key={i} className="text-[0.65rem] font-mono text-slate-700 tracking-[0.2em] uppercase whitespace-nowrap">
              {c} <span className="text-sky-900 mx-1">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="font-display font-700 text-2xl text-slate-100 mb-1">Ready to talk?</h2>
              <p className="text-slate-500 font-body text-sm">30 minutes. Free. No pitch. We&rsquo;ll scope a discovery scan.</p>
            </div>
            <Link to="/contact" className="btn-primary flex-shrink-0">
              Book a free discovery call <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-xs text-slate-600 font-body">
            Still need NZ spectrum, RSM licensing, or compliance? That&rsquo;s the{' '}
            <Link to="/spectrum" className="text-sky-400 hover:text-sky-300 underline underline-offset-2">
              regulatory consulting arm
            </Link>{' '}
            — quanta pricing and all.
          </p>
        </div>
      </section>
    </>
  )
}
