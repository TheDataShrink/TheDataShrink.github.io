import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Activity, Database, Filter } from 'lucide-react'
import DiagnosticFlow from '@/diagnostic/DiagnosticFlow'

const dimensions = [
  {
    icon: <Activity className="w-4 h-4" />,
    tag: 'PAIN',
    title: 'Shrink the pain',
    desc: 'Career anxiety, AI overwhelm, impostor signals, drift.',
  },
  {
    icon: <Database className="w-4 h-4" />,
    tag: 'DATA',
    title: 'Shrink the data',
    desc: 'Lean architecture, governance discipline, deletion as a feature.',
  },
  {
    icon: <Filter className="w-4 h-4" />,
    tag: 'NOISE',
    title: 'Shrink the noise',
    desc: 'The five inputs that matter. Focus. Signal up, noise down.',
  },
]

const archetypes = [
  'The Anxious Analyst',
  'The Stalled Senior',
  'The Quiet Architect',
  'The AI Refusenik',
  'The Vendor-Captured Manager',
  'The Hype Rider',
  'The Quietly Effective Operator',
  'The Drifter',
]

export default function Diagnostic() {
  const [started, setStarted] = useState(false)

  if (started) {
    return (
      <section className="pt-[52px] bg-[#04080f] min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <DiagnosticFlow />
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-[52px] bg-grid">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="label mb-6">THE DATA SHRINK&trade; DIAGNOSTIC &nbsp;·&nbsp; PRIVATE BETA</p>
          <h1 className="font-display font-800 text-4xl md:text-5xl text-slate-100 leading-[1.1] mb-6 max-w-3xl">
            Future-proof your data career &mdash; without the hype.
          </h1>
          <p className="text-slate-400 font-body text-lg leading-relaxed mb-10 max-w-2xl">
            24 questions. 4 minutes. Three dimensions: Pain, Data, Noise.
            You get an archetype, a dimension breakdown, and a personalized 90-day shrink plan.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setStarted(true)}
              className="btn-primary"
            >
              Start the Diagnostic <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono text-slate-600">
              ~ 4 min &middot; No login &middot; Email asked only before the reveal
            </span>
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="py-24 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-10">WHAT THE DIAGNOSTIC MEASURES</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dimensions.map((d) => (
              <div key={d.tag} className="card rounded-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-sm bg-sky-500/10 border border-sky-500/15 flex items-center justify-center text-sky-500">
                    {d.icon}
                  </div>
                  <span className="label text-[0.6rem]">{d.tag}</span>
                </div>
                <h3 className="font-display font-700 text-slate-100 text-lg mb-2">{d.title}</h3>
                <p className="text-sm text-slate-500 font-body leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Archetypes */}
      <section className="py-24 bg-grid">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-10">THE EIGHT ARCHETYPES</div>
          <p className="text-slate-400 font-body text-base leading-relaxed mb-10 max-w-2xl">
            You are probably one of these. The Diagnostic tells you which &mdash; and what to do about it.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {archetypes.map((a) => (
              <div
                key={a}
                className="card rounded-sm px-4 py-3.5"
              >
                <div className="font-display font-600 text-sm text-slate-200">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-link to consulting */}
      <section className="py-16 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-10" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="label mb-2">THE OTHER ARM</div>
              <h2 className="font-display font-700 text-xl text-slate-100 mb-1">
                Need spectrum or compliance work for your team?
              </h2>
              <p className="text-slate-500 font-body text-sm">
                The Data Shrink&trade; consulting practice covers AU/NZ telecom operators &mdash; spectrum licensing, compliance, BI & data.
              </p>
            </div>
            <Link to="/spectrum" className="btn-outline flex-shrink-0">
              View consulting services <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
