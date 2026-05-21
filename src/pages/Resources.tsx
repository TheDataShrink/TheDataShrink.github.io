import { Link } from 'react-router-dom'
import { ArrowRight, FileText, Compass, Filter, Activity } from 'lucide-react'

const resources = [
  {
    icon: <Activity className="w-4 h-4" />,
    tag: 'DIAGNOSTIC',
    title: 'The Data Shrink™ Diagnostic',
    desc: 'A 4-minute assessment across Pain, Data, and Noise. Returns your archetype and a personalized 90-day plan.',
    cta: 'Start the Diagnostic',
    href: '/diagnostic',
    available: true,
  },
  {
    icon: <Compass className="w-4 h-4" />,
    tag: 'PLAYBOOK',
    title: 'The Metadata Moat Starter',
    desc: 'A 90-day metadata-first roadmap. The 50-table starter list, contract templates, and deprecation protocol.',
    cta: 'Coming soon',
    href: '#',
    available: false,
  },
  {
    icon: <FileText className="w-4 h-4" />,
    tag: 'FIELD GUIDE',
    title: 'Governance Anti-Patterns',
    desc: 'Three anti-patterns with worked examples, decision flowcharts, and the conversation scripts that work in the room.',
    cta: 'Coming soon',
    href: '#',
    available: false,
  },
  {
    icon: <Filter className="w-4 h-4" />,
    tag: 'PROTOCOL',
    title: 'The 30-day Input Fast',
    desc: 'The five inputs that matter, the cull protocol, and what to expect in weeks 1–4.',
    cta: 'Coming soon',
    href: '#',
    available: false,
  },
]

export default function Resources() {
  return (
    <>
      {/* Hero */}
      <section className="pt-[52px] bg-grid">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="label mb-6">RESOURCES</p>
          <h1 className="font-display font-800 text-4xl md:text-5xl text-slate-100 leading-[1.1] mb-6 max-w-3xl">
            Free downloads. Gated by email. No marketing loops.
          </h1>
          <p className="text-slate-400 font-body text-lg leading-relaxed max-w-2xl">
            Playbooks, frameworks, and field guides from the The Data Shrink&trade; community arm.
            We send your download, and a single follow-up if it&rsquo;s a multi-part asset.
          </p>
        </div>
      </section>

      {/* Resource list */}
      <section className="py-20 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div style={{ borderTop: '1px solid rgba(14,165,233,0.07)' }}>
            {resources.map((r) => {
              const body = (
                <>
                  <div className="w-8 h-8 rounded-sm bg-sky-500/10 border border-sky-500/15 flex items-center justify-center text-sky-500 flex-shrink-0">
                    {r.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-display font-700 text-slate-200">{r.title}</span>
                      <span className="label text-[0.6rem] hidden sm:block">{r.tag}</span>
                    </div>
                    <p className="text-sm text-slate-600 font-body leading-relaxed">{r.desc}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {r.available ? (
                      <>
                        <span className="data-value text-sm">free</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                      </>
                    ) : (
                      <span className="text-xs font-mono text-slate-700 uppercase tracking-wider">{r.cta}</span>
                    )}
                  </div>
                </>
              )

              return r.available ? (
                <Link
                  key={r.title}
                  to={r.href}
                  className="flex items-center gap-6 py-5 group transition-colors hover:bg-sky-500/5"
                  style={{ borderBottom: '1px solid rgba(14,165,233,0.07)' }}
                >
                  {body}
                </Link>
              ) : (
                <div
                  key={r.title}
                  className="flex items-center gap-6 py-5 opacity-60"
                  style={{ borderBottom: '1px solid rgba(14,165,233,0.07)' }}
                >
                  {body}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
