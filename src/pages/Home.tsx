import { Link } from 'react-router-dom'
import { ArrowRight, Radio, Shield, BarChart3 } from 'lucide-react'
import TierCard from '@/components/TierCard'

const penalties = [
  { amount: '$12,000,420', company: 'Optus', reason: 'Triple-0 network outage — emergency call failure' },
  { amount: '$7,500,000', company: 'CBA', reason: 'Spam Act — 65 million unsolicited messages' },
  { amount: '$3,004,800', company: 'Telstra', reason: 'TCP Code — misleading vulnerable consumers' },
]

const pillars = [
  {
    icon: <Radio className="w-4 h-4" />,
    tag: 'SPECTRUM & RADIO',
    title: 'Spectrum Licensing',
    desc: 'ACMA Accredited Person legally authorised to certify FAC and IIC applications. Licence management, audits, RF design.',
    price: 'from $500',
    href: '/services#spectrum',
  },
  {
    icon: <Shield className="w-4 h-4" />,
    tag: 'COMPLIANCE',
    title: 'Regulatory Compliance',
    desc: 'ACMA, TCP Code, Spam Act, Privacy Act, CDR obligations. Fractional compliance officer cover from $2,500/month.',
    price: 'from $1,500',
    href: '/services#compliance',
  },
  {
    icon: <BarChart3 className="w-4 h-4" />,
    tag: 'DATA & AI',
    title: 'Data & Automation',
    desc: 'Warehouses, ETL pipelines, Power BI, R/Python analytics. AI automation retainers from $100/month.',
    price: 'from $100',
    href: '/services#data',
  },
]

const tiers = [
  {
    name: 'Starter',
    price: '$500',
    description: 'Core regulatory monitoring for small operators.',
    features: [
      'Weekly ACMA regulatory digest',
      'TCP Code obligation tracker',
      'Spam Act & Privacy Act alerts',
      'Monthly compliance briefing (1hr)',
      'Email support — 48hr SLA',
    ],
    cta: 'Start free trial',
    href: '/contact',
  },
  {
    name: 'Growth',
    price: '$1,500',
    description: 'Full compliance + spectrum monitoring for active licence holders.',
    features: [
      'Everything in Starter',
      'Spectrum licence expiry alerts',
      'ACMA enforcement monitoring',
      'CDR & data sovereignty updates',
      'Fortnightly strategy call (1hr)',
      'Priority support — 24hr SLA',
    ],
    cta: 'Start free trial',
    href: '/contact',
    featured: true,
  },
  {
    name: 'Compliance Pro',
    price: '$3,500',
    description: 'Fractional compliance officer. Named cover. Full regulatory posture.',
    features: [
      'Everything in Growth',
      'Named compliance officer',
      'Unlimited regulatory queries',
      'Draft ACMA responses',
      'Quarterly board report',
      'Emergency escalation — same-day',
    ],
    cta: 'Book a call',
    href: '/contact',
  },
]

const credentials = [
  'ACMA Accredited Person',
  'NZ ARE #176',
  '20 Years RF & Data',
  'UniSC BI Manager',
  'SEFF Spectrum Platform',
  'MBIE Radio Spectrum Mgmt',
  'Spark NZ Spectrum',
  'AU · NZ · Pacific',
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
                ACMA ACCREDITED PERSON &nbsp;·&nbsp; NZ ARE #176 &nbsp;·&nbsp; 20 YEARS RF &amp; DATA
              </p>
              <h1 className="font-display font-800 text-4xl md:text-5xl lg:text-[3.25rem] text-slate-100 leading-[1.1] mb-6">
                Spectrum compliance and data automation for AU/NZ telecom operators.
              </h1>
              <p className="text-slate-400 font-body text-lg leading-relaxed mb-10 max-w-lg">
                Expert regulatory coverage without the cost of a full-time compliance team.
                Spectrum licences. Privacy Act. ACMA obligations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/contact" className="btn-primary">
                  Book a free call <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/services" className="btn-ghost">
                  View services <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Terminal card */}
            <div className="terminal animate-in delay-2 rounded-sm overflow-hidden">
              <div className="terminal-header">
                <div className="terminal-dot bg-red-500/70" />
                <div className="terminal-dot bg-amber-500/70" />
                <div className="terminal-dot bg-emerald-500/70" />
                <span className="ml-2 text-[0.65rem] text-slate-600 tracking-wider">COMPLIANCE-STATUS.sh</span>
              </div>
              <div className="p-5 space-y-1.5 text-[0.78rem] leading-relaxed">
                <p className="text-sky-400">{'>'} ACMA COMPLIANCE STATUS</p>
                <p className="text-slate-600">{'─'.repeat(34)}</p>
                <div className="flex justify-between">
                  <span className="text-slate-400">TCP Code</span>
                  <span className="text-emerald-400">✓ COMPLIANT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Spam Act</span>
                  <span className="text-emerald-400">✓ COMPLIANT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Privacy Act</span>
                  <span className="text-amber-400">⚠ REVIEW DUE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Spectrum Lic.</span>
                  <span className="text-emerald-400">✓ 14 ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ARE Certified</span>
                  <span className="text-emerald-400">✓ ARE #176</span>
                </div>
                <p className="text-slate-600">{'─'.repeat(34)}</p>
                <p className="text-slate-600 text-[0.72rem]">
                  LAST SCAN: 2026-03-22 09:41 AEST{' '}
                  <span className="cursor" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Penalties */}
      <section className="py-24 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-10">ENFORCEMENT REALITY — 2024</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {penalties.map((p) => (
              <div key={p.company}>
                <div className="font-mono font-700 text-4xl text-amber-400 mb-2 tracking-tight">{p.amount}</div>
                <div className="text-sm font-display font-600 text-slate-300 mb-1">{p.company}</div>
                <p className="text-sm text-slate-600 font-body leading-relaxed">{p.reason}</p>
              </div>
            ))}
          </div>
          <p className="text-xs font-mono text-slate-700">Source: ACMA enforcement register 2024 · Figures are AUD</p>
        </div>
      </section>

      {/* Service pillars */}
      <section className="py-24 bg-grid">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-10">WHAT WE DO</div>
          <div style={{ borderTop: '1px solid rgba(14,165,233,0.07)' }}>
            {pillars.map((p) => (
              <Link
                key={p.title}
                to={p.href}
                className="flex items-center gap-6 py-5 group transition-colors hover:bg-sky-500/5"
                style={{ borderBottom: '1px solid rgba(14,165,233,0.07)' }}
              >
                <div className="w-8 h-8 rounded-sm bg-sky-500/10 border border-sky-500/15 flex items-center justify-center text-sky-500 flex-shrink-0">
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="font-display font-700 text-slate-200 group-hover:text-slate-100 transition-colors">
                      {p.title}
                    </span>
                    <span className="label text-[0.6rem] hidden sm:block">{p.tag}</span>
                  </div>
                  <p className="text-sm text-slate-600 font-body">{p.desc}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="data-value text-sm">{p.price}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-3">COMPLIANCE MONITOR</div>
          <h2 className="font-display font-800 text-3xl text-slate-100 mb-2">
            Always-on regulatory intelligence.
          </h2>
          <p className="text-slate-500 font-body text-sm mb-10">30-day free trial. Cancel any time. No lock-in.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map((t) => (
              <TierCard key={t.name} {...t} />
            ))}
          </div>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="font-display font-700 text-2xl text-slate-100 mb-1">Ready to talk?</h2>
              <p className="text-slate-500 font-body text-sm">30 minutes. Free. No pitch. No obligation.</p>
            </div>
            <Link to="/contact" className="btn-primary flex-shrink-0">
              Book a free discovery call <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
