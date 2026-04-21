import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ServiceCard from '@/components/ServiceCard'
import TierCard from '@/components/TierCard'

const sections = [
  { id: 'spectrum', label: '01 Spectrum', num: '01' },
  { id: 'compliance', label: '02 Compliance', num: '02' },
  { id: 'data', label: '03 Data', num: '03' },
  { id: 'automation', label: '04 Automation', num: '04' },
  { id: 'subscription', label: '05 Monitor', num: '05' },
]

const spectrumServices = [
  { title: 'FAC Certificates', who: 'Carriers · ISPs · Private networks', price: '$500–$2,000', description: 'Frequency Assignment Certificates prepared and submitted by an ACMA Accredited Person. Legally authorised sign-off — not just advice. Includes application preparation, ACMA liaison, and confirmation.' },
  { title: 'IIC Certificates', who: 'Broadcasters · Major spectrum users', price: '$2,000–$5,000', description: 'Interference Impact Certificates for complex environments. Multi-party coordination, propagation modelling, and regulatory submission included.' },
  { title: 'Spectrum Licence Audit', who: 'Operators with 10+ licences', price: '$2,500–$6,000 fixed', description: 'Full inventory of your spectrum holdings. Identify at-risk licences, expiry dates, and compliance gaps before ACMA does. Delivered as a prioritised action register.' },
  { title: 'Spectrum Lifecycle Management', who: 'Ongoing spectrum users', price: '$1,500–$3,500/mo', description: 'Monthly retainer covering renewals, variation applications, monitoring, and proactive regulatory engagement. You focus on operations; we manage the licences.' },
  { title: 'International Frequency Coordination', who: 'Satellite · Border region operators', price: '$3,000–$15,000', description: 'ITU coordination, MBIE/ACMA submission management, and cross-border frequency clearance for AU and NZ operations.' },
  { title: 'RF Network Design & Optimisation', who: 'Network teams · Integrators', price: 'from $220/hr', description: 'Propagation modelling, interference analysis, frequency planning, and link budget reviews for fixed and mobile networks.' },
]

const complianceServices = [
  { title: 'ACMA Compliance Audit', who: 'Carriers · CSPs', price: '$3,500–$8,000', description: 'End-to-end review of your ACMA obligations: licence conditions, record-keeping, reporting, and TCP Code alignment. Delivered with a prioritised remediation roadmap.' },
  { title: 'TCP Code Review', who: 'RSPs · Resellers · MVNOs', price: '$2,500–$5,000', description: 'Gap analysis against the Telecommunications Consumer Protections Code. Includes remediation roadmap and board briefing.' },
  { title: 'Spam Act Review', who: 'Marketing-heavy operators', price: '$1,500–$3,000', description: 'Consent framework audit, unsubscribe mechanism testing, and policy documentation to ACMA standard.' },
  { title: 'Data Governance Framework', who: 'Growth-stage telcos', price: '$8,000–$25,000', description: 'Policies, standards, and data catalogue implementation. Microsoft Purview or open-source stack — your choice. Delivered in phases.' },
  { title: 'Privacy Act Assessment', who: 'Any data-holding operator', price: '$3,000–$7,000', description: 'APP compliance review, data flow mapping, and PIAs for new products. Ready for the Privacy Act 2024 reforms.' },
  { title: 'CDR Readiness Assessment', who: 'Telcos entering CDR regime', price: '$4,000–$10,000', description: 'Gap assessment against CDR Rules, data holder obligations, and phased implementation plan.' },
  { title: 'Data Sovereignty Review', who: 'GovTech · Defence suppliers', price: '$5,000–$15,000', description: 'Identify data residency risks, cloud provider obligations, and sovereignty controls for AU/NZ government contracts.' },
  { title: 'Fractional Compliance Officer', who: 'Operators without in-house compliance', price: '$2,500–$5,000/mo', description: 'Your named compliance officer on retainer. ACMA liaison, board reporting, and regulatory horizon scanning. Month-to-month.' },
]

const dataServices = [
  { title: 'Data Warehouse Build', who: 'Operators scaling data', price: 'from $8,000', description: 'Modern lakehouse on DuckDB, Snowflake, or Databricks. Bronze/silver/gold architecture with full lineage and automated testing.' },
  { title: 'ETL / ELT Pipelines', who: 'Data engineering teams', price: 'from $220/hr', description: 'Python/R data pipelines with incremental load, error handling, and monitoring. OSS-first, cloud-optional.' },
  { title: 'Power BI Dashboards', who: 'Operations · Management', price: '$2,500–$8,000', description: 'Executive and operational dashboards. DAX modelling, row-level security, and embedded reporting.' },
  { title: 'R & Python Analytics', who: 'Research · Regulatory teams', price: 'from $220/hr', description: 'Statistical modelling, forecasting, geospatial analysis, and automated reporting. 12+ years deep expertise.' },
  { title: 'Microsoft Purview', who: 'M365 operators', price: '$3,000–$10,000', description: 'Data catalogue, sensitivity labels, DLP policies, and audit trails for regulated data assets.' },
  { title: 'R Training', who: 'Analyst teams', price: '$1,500/day', description: 'Custom R workshops: data wrangling (tidyverse), visualisation (ggplot2), and reporting (R Markdown/Quarto). Half-day or multi-day.' },
]

const automationServices = [
  { title: 'Starter Automation Retainer', who: 'Single process', price: '$100–$150/mo', description: 'One automation deployed and running. Ideal for a single repetitive process: weekly reports, meeting summaries, or invoice extraction. Includes monthly maintenance.' },
  { title: 'Growth Automation Retainer', who: '3 automations', price: '$200/mo', description: 'Three automations plus AI-augmented analysis. The most popular entry point for compliance-heavy operators. Includes fortnightly check-in and one new automation per quarter.' },
  { title: 'Full Stack Retainer', who: 'Unlimited automations', price: '$400/mo', description: 'Full automation stack: reporting, comms, compliance, and document processing. Custom AI workflow design, weekly optimisation review, and same-day support.' },
  { title: 'Weekly Compliance Report', who: 'Pre-built · 3-day setup', price: 'incl. Growth+', description: 'Input: ACMA feed + licence DB. Output: PDF email to stakeholders. Saves 3hr/week.' },
  { title: 'Meeting Notes & Actions', who: 'Pre-built · 3-day setup', price: 'incl. Growth+', description: 'Input: Audio recording / transcript. Output: Structured Markdown + action items. Saves 1hr/meeting.' },
  { title: 'Regulatory Digest', who: 'Pre-built · 3-day setup', price: 'incl. Growth+', description: 'Input: ACMA · MBIE · OAIC feeds. Output: Prioritised briefing with impact flags. Saves 4hr/week.' },
]

const monitorTiers = [
  {
    name: 'Starter',
    price: '$500',
    description: 'Core regulatory monitoring for small operators.',
    features: ['Weekly ACMA regulatory digest', 'TCP Code obligation tracker', 'Spam Act & Privacy Act alerts', 'Monthly compliance briefing (1hr)', 'Email support — 48hr SLA'],
    cta: 'Start free trial',
    href: '/contact',
  },
  {
    name: 'Growth',
    price: '$1,500',
    description: 'Full compliance + spectrum for active licence holders.',
    features: ['Everything in Starter', 'Spectrum licence expiry alerts', 'ACMA enforcement monitoring', 'CDR & data sovereignty updates', 'Fortnightly strategy call (1hr)', 'Priority support — 24hr SLA'],
    cta: 'Start free trial',
    href: '/contact',
    featured: true,
  },
  {
    name: 'Compliance Pro',
    price: '$3,500',
    description: 'Fractional compliance officer. Named cover.',
    features: ['Everything in Growth', 'Named compliance officer', 'Unlimited regulatory queries', 'Draft ACMA responses', 'Quarterly board report', 'Emergency escalation — same-day'],
    cta: 'Book a call',
    href: '/contact',
  },
]

export default function Services() {
  const [active, setActive] = useState('spectrum')

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }) },
      { rootMargin: '-25% 0px -65% 0px' }
    )
    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* Page header */}
      <section className="pt-[52px] pb-0 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="label mb-4">SERVICES & PRICING</div>
          <h1 className="font-display font-800 text-4xl text-slate-100 mb-3">
            Straightforward pricing. No surprises.
          </h1>
          <p className="text-slate-500 font-body text-sm max-w-lg">
            Fixed-fee engagements wherever possible. Retainers are month-to-month. All prices AUD exclusive of GST.
          </p>
        </div>
      </section>

      {/* Sticky section nav */}
      <div className="sticky top-[52px] z-40 bg-[#04080f]/95 backdrop-blur-sm" style={{ borderBottom: '1px solid rgba(14,165,233,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`}
                className={`px-3 py-1.5 text-xs font-mono whitespace-nowrap transition-colors rounded-sm ${
                  active === s.id
                    ? 'text-sky-400 bg-sky-500/10'
                    : 'text-slate-600 hover:text-slate-300'
                }`}>
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">

        {/* 01 Spectrum */}
        <section id="spectrum" className="scroll-mt-24">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-mono font-600 text-[4rem] text-sky-500/10 leading-none select-none">01</span>
            <div>
              <div className="label mb-1">SPECTRUM & RADIO</div>
              <h2 className="font-display font-700 text-2xl text-slate-100">Spectrum Licensing</h2>
            </div>
          </div>
          <div style={{ border: '1px solid rgba(14,165,233,0.08)', borderRadius: '3px' }}>
            <div className="flex items-center gap-6 px-4 py-2.5 text-xs font-mono text-slate-700" style={{ borderBottom: '1px solid rgba(14,165,233,0.07)', background: 'rgba(255,255,255,0.01)' }}>
              <span className="flex-1">SERVICE</span>
              <span className="hidden sm:block w-48">WHO</span>
              <span className="w-28 text-right">PRICE (AUD)</span>
              <span className="w-4" />
            </div>
            {spectrumServices.map((s, i) => (
              <ServiceCard key={s.title} {...s} index={i} />
            ))}
          </div>
        </section>

        {/* 02 Compliance */}
        <section id="compliance" className="scroll-mt-24">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-mono font-600 text-[4rem] text-sky-500/10 leading-none select-none">02</span>
            <div>
              <div className="label mb-1">COMPLIANCE & GOVERNANCE</div>
              <h2 className="font-display font-700 text-2xl text-slate-100">Compliance & Data Governance</h2>
            </div>
          </div>
          <div style={{ border: '1px solid rgba(14,165,233,0.08)', borderRadius: '3px' }}>
            <div className="flex items-center gap-6 px-4 py-2.5 text-xs font-mono text-slate-700" style={{ borderBottom: '1px solid rgba(14,165,233,0.07)', background: 'rgba(255,255,255,0.01)' }}>
              <span className="flex-1">SERVICE</span>
              <span className="hidden sm:block w-48">WHO</span>
              <span className="w-28 text-right">PRICE (AUD)</span>
              <span className="w-4" />
            </div>
            {complianceServices.map((s, i) => (
              <ServiceCard key={s.title} {...s} index={i} />
            ))}
          </div>
        </section>

        {/* 03 Data */}
        <section id="data" className="scroll-mt-24">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-mono font-600 text-[4rem] text-sky-500/10 leading-none select-none">03</span>
            <div>
              <div className="label mb-1">DATA & ANALYTICS</div>
              <h2 className="font-display font-700 text-2xl text-slate-100">Data & Analytics</h2>
            </div>
          </div>
          <div style={{ border: '1px solid rgba(14,165,233,0.08)', borderRadius: '3px' }}>
            <div className="flex items-center gap-6 px-4 py-2.5 text-xs font-mono text-slate-700" style={{ borderBottom: '1px solid rgba(14,165,233,0.07)', background: 'rgba(255,255,255,0.01)' }}>
              <span className="flex-1">SERVICE</span>
              <span className="hidden sm:block w-48">WHO</span>
              <span className="w-28 text-right">PRICE (AUD)</span>
              <span className="w-4" />
            </div>
            {dataServices.map((s, i) => (
              <ServiceCard key={s.title} {...s} index={i} />
            ))}
          </div>
        </section>

        {/* 04 Automation */}
        <section id="automation" className="scroll-mt-24">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-mono font-600 text-[4rem] text-sky-500/10 leading-none select-none">04</span>
            <div>
              <div className="label mb-1">AI AUTOMATION</div>
              <h2 className="font-display font-700 text-2xl text-slate-100">AI Automation Retainers</h2>
            </div>
          </div>

          {/* Arbitrage callout */}
          <div className="card-amber rounded-sm p-5 mb-8 font-mono text-sm">
            <span className="text-slate-600 line-through">$420/mo</span>
            <span className="text-slate-600 mx-3">→</span>
            <span className="text-emerald-400 font-700">$150/mo</span>
            <span className="text-slate-600 mx-3">=</span>
            <span className="text-sky-400">$270/mo saved · forever.</span>
            <span className="text-slate-600 ml-3 text-xs">3hr/week task at $35/hr → automated.</span>
          </div>

          <div style={{ border: '1px solid rgba(14,165,233,0.08)', borderRadius: '3px' }}>
            <div className="flex items-center gap-6 px-4 py-2.5 text-xs font-mono text-slate-700" style={{ borderBottom: '1px solid rgba(14,165,233,0.07)', background: 'rgba(255,255,255,0.01)' }}>
              <span className="flex-1">SERVICE</span>
              <span className="hidden sm:block w-48">WHO</span>
              <span className="w-28 text-right">PRICE (AUD)</span>
              <span className="w-4" />
            </div>
            {automationServices.map((s, i) => (
              <ServiceCard key={s.title} {...s} index={i} />
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <Link to="/contact" className="btn-outline">
              Is my process automatable? <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* 05 Monitor */}
        <section id="subscription" className="scroll-mt-24">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-mono font-600 text-[4rem] text-sky-500/10 leading-none select-none">05</span>
            <div>
              <div className="label mb-1">COMPLIANCE MONITOR</div>
              <h2 className="font-display font-700 text-2xl text-slate-100">Compliance Monitor Subscription</h2>
            </div>
          </div>
          <p className="text-slate-500 font-body text-sm mb-8 max-w-xl">
            Always-on regulatory intelligence. 30-day free trial. Cancel any time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {monitorTiers.map(t => (
              <TierCard key={t.name} {...t} />
            ))}
          </div>
        </section>

      </div>
    </>
  )
}
