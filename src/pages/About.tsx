import { useState } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'

const credentials = [
  { tag: 'AU', label: 'ACMA Accredited Person', desc: 'FAC & IIC sign-off authority' },
  { tag: 'NZ', label: 'ARE #176', desc: 'NZ Approved Radio Engineer' },
  { tag: 'REG', label: 'Former Regulator', desc: 'MBIE Radio Spectrum Management' },
  { tag: 'DATA', label: 'BI & Data Manager', desc: 'UniSC — team of 4' },
  { tag: 'AI', label: 'AI-Native Builder', desc: 'SEFF Spectrum Platform — live' },
  { tag: 'DEV', label: 'R & Python Expert', desc: '12+ years analytics' },
  { tag: 'GEO', label: 'AU · NZ · Pacific', desc: 'Cross-jurisdiction coverage' },
  { tag: 'AWD', label: 'MBIE Award 2019', desc: 'Ministerial Services excellence' },
]

const timeline = [
  { year: '2026', role: 'TheDataShrink™ — Founder', org: 'ABN registered · AU & NZ', color: 'sky' as const, desc: 'Solo consulting practice: spectrum licensing, compliance, data analytics, and AI automation for AU/NZ telecom operators.' },
  { year: '2023–26', role: 'Manager, BI & Data Warehousing', org: 'University of the Sunshine Coast', color: 'default' as const, desc: 'Led team of 4 delivering enterprise data warehouse, Power BI, and ETL pipelines. Built the SEFF Spectrum Platform — live system processing 70K+ licence records.' },
  { year: '2022–23', role: 'Spectrum Analyst', org: 'Spectrum Efficiency Ltd', color: 'default' as const, desc: 'Spectrum analytics, R modelling, and regulatory reporting for the SEFF platform.' },
  { year: '2020–23', role: 'Data Analyst / BI Developer', org: 'New Zealand Government', color: 'default' as const, desc: 'Data engineering, Power BI, and analytics across NZ government agencies. Data governance and privacy compliance throughout.' },
  { year: '2019–20', role: 'Senior Policy Analyst', org: 'MBIE Ministerial Services', color: 'default' as const, desc: 'Policy analysis and ministerial correspondence. Excellence award recipient.' },
  { year: '2017–19', role: 'Radio Engineer — ARE Audit Management', org: 'MBIE Radio Spectrum Management', color: 'amber' as const, desc: 'Managed the NZ ARE audit regime from inside the regulator. Compliance expectations, audit methodology, and enforcement — from the other side of the desk.' },
  { year: '2015–17', role: 'Spectrum Engineer — ARE & Licensing', org: 'Spark New Zealand', color: 'amber' as const, desc: '2.5 years zero-infringement record at NZ\'s largest telco. Spectrum licence management, frequency coordination, and regulatory compliance.' },
  { year: '2014–15', role: 'RF Engineer', org: 'Huawei Technologies — Copenhagen', color: 'default' as const, desc: 'RF network design and optimisation for European 4G deployments.' },
  { year: '2010–14', role: 'RF Network Engineer', org: 'Alcatel-Lucent — Romania', color: 'default' as const, desc: 'Radio access network planning, RF propagation modelling, and performance optimisation for Tier 1 operators.' },
]

const differentiators = [
  { n: '01', title: 'ACMA Accredited Person', desc: 'Not just compliance advice. Legally authorised to sign FAC and IIC certificates — the only path for ACMA spectrum applications.' },
  { n: '02', title: 'Former Regulator', desc: 'Ran the ARE audit regime from inside MBIE. I know what auditors look for because I ran the audits.' },
  { n: '03', title: 'Builds Real Systems', desc: 'SEFF Spectrum Platform: 70,000+ licence records in production. I ship working systems, not just recommendations.' },
  { n: '04', title: 'AI-Native Delivery', desc: 'Every engagement is augmented by AI automation. Analysis that took days takes hours. The saving gets passed on.' },
]

function TimelineItem({ item }: { item: typeof timeline[0] }) {
  const [open, setOpen] = useState(false)

  const borderColor = {
    sky: '#0ea5e9',
    amber: '#f59e0b',
    default: 'rgba(14,165,233,0.15)',
  }[item.color]

  const roleColor = {
    sky: 'text-sky-400',
    amber: 'text-amber-400',
    default: 'text-slate-200',
  }[item.color]

  return (
    <div
      className="relative pl-5 cursor-pointer group"
      style={{ borderLeft: `1px solid ${borderColor}` }}
      onClick={() => setOpen(v => !v)}
      role="button"
      aria-expanded={open}
    >
      <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full" style={{ background: borderColor }} />
      <div className="py-3 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className={`font-display font-600 text-sm ${roleColor}`}>{item.role}</div>
          <div className="text-xs font-mono text-slate-600 mt-0.5">{item.org}</div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs font-mono text-slate-600">{item.year}</span>
          <ChevronDown className={`w-3 h-3 text-slate-700 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {open && (
        <p className="text-sm text-slate-500 font-body leading-relaxed pb-3 pr-2">{item.desc}</p>
      )}
    </div>
  )
}

export default function About() {
  return (
    <>
      {/* Header */}
      <section className="pt-[52px] bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Bio */}
            <div>
              <div className="label mb-5">ABOUT</div>
              <h1 className="font-display font-800 text-4xl text-slate-100 mb-6 leading-tight">
                20 years of spectrum.<br />Now working for you.
              </h1>
              <div className="space-y-4 text-slate-400 font-body text-sm leading-relaxed mb-8">
                <p>
                  RF engineer → NZ ARE #176 → MBIE spectrum regulator → BI manager → founder. Twenty years on both sides of the compliance fence.
                </p>
                <p>
                  I hold NZ ARE #176 and am an ACMA Accredited Person in Australia — legally authorised to sign FAC and IIC certificates. This isn't advice. This is authorised sign-off.
                </p>
                <p>
                  I also build systems that run. The SEFF Spectrum Platform processes 70,000+ licence records in production. When I recommend a solution, I've already shipped one.
                </p>
              </div>
              <a href="https://www.linkedin.com/in/stoianandreimircea/" target="_blank" rel="noreferrer"
                className="btn-outline inline-flex">
                View LinkedIn profile <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Credentials grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {credentials.map((c) => (
                <div key={c.label} className="card rounded-sm p-3.5 flex items-start gap-3">
                  <span className="label text-[0.6rem] mt-0.5 flex-shrink-0">{c.tag}</span>
                  <div>
                    <div className="font-display font-600 text-xs text-slate-200">{c.label}</div>
                    <div className="text-xs text-slate-600 font-body mt-0.5">{c.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-grid">
        <div className="max-w-3xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-3">EXPERIENCE</div>
          <h2 className="font-display font-700 text-2xl text-slate-100 mb-2">Career timeline</h2>
          <p className="text-xs font-mono text-slate-600 mb-10">Click any role to expand</p>
          <div className="space-y-0">
            {timeline.map((t, i) => (
              <TimelineItem key={i} item={t} />
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-20 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-3">WHY THEDATASHRINK</div>
          <h2 className="font-display font-700 text-2xl text-slate-100 mb-10">
            Most consultants advise. DataShrink certifies.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ border: '1px solid rgba(14,165,233,0.08)', borderRadius: '3px' }}>
            {differentiators.map((d, i) => (
              <div key={d.n}
                className="p-7 flex gap-5"
                style={{
                  borderRight: i % 2 === 0 ? '1px solid rgba(14,165,233,0.08)' : 'none',
                  borderBottom: i < 2 ? '1px solid rgba(14,165,233,0.08)' : 'none',
                }}>
                <span className="font-mono font-700 text-[2rem] text-sky-500/15 leading-none flex-shrink-0 select-none">{d.n}</span>
                <div>
                  <h3 className="font-display font-700 text-sm text-slate-100 mb-2">{d.title}</h3>
                  <p className="text-sm text-slate-500 font-body leading-relaxed">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-grid">
        <div className="max-w-3xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-3">HOW I WORK</div>
          <h2 className="font-display font-700 text-2xl text-slate-100 mb-8">A few things I won't do.</h2>
          <div style={{ border: '1px solid rgba(14,165,233,0.08)', borderRadius: '3px' }}>
            {[
              'Bill you for reading the Act. I already know it.',
              'Recommend a solution before I understand your problem.',
              'Lock you into a 12-month contract you didn\'t need.',
              'Write a 50-page report when a 5-page one will do.',
              'Give you advice I couldn\'t defend in front of ACMA.',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-3.5" style={{ borderBottom: i < 4 ? '1px solid rgba(14,165,233,0.06)' : 'none' }}>
                <span className="text-sky-500/40 font-mono text-xs mt-0.5 flex-shrink-0">—</span>
                <span className="text-sm text-slate-400 font-body">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
