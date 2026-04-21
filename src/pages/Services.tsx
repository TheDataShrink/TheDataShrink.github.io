import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ServiceCard from '@/components/ServiceCard'
import TierCard from '@/components/TierCard'

const sections = [
  { id: 'spectrum', label: '01 Spectrum', num: '01' },
  { id: 'compliance', label: '02 Compliance', num: '02' },
  { id: 'data', label: '03 Systems', num: '03' },
  { id: 'automation', label: '04 Automation', num: '04' },
  { id: 'subscription', label: '05 Monitor', num: '05' },
]

const spectrumServices = [
  { title: 'ARE Endorsement Applications', who: 'NZ spectrum users', price: '$500–$1,500', description: 'RSM licence endorsements prepared and submitted by NZ ARE #176. Legally authorised sign-off from inside the system — I ran the ARE audit regime at MBIE before doing this commercially.' },
  { title: 'RSM Licence Management', who: 'NZ operators with active licences', price: '$1,000–$3,000/mo', description: 'Monthly retainer covering RSM licence renewals, variations, expiry tracking, and proactive MBIE engagement. Built on the same system powering the SEFF Spectrum Platform (70K+ records).' },
  { title: 'Spectrum Licence Audit', who: 'Operators with 10+ licences', price: '$2,500–$6,000 fixed', description: 'Full inventory of your RSM spectrum holdings. Identify at-risk licences, expiry dates, and compliance gaps before RSM does. Delivered as a prioritised action register.' },
  { title: 'International Frequency Coordination', who: 'Satellite · Border region operators', price: '$3,000–$15,000', description: 'ITU coordination, RSM/MBIE submission management, and cross-border frequency clearance for NZ and Pacific operations.' },
  { title: 'RF Network Design & Optimisation', who: 'Network teams · Integrators', price: 'from $250/hr', description: 'Propagation modelling, interference analysis, frequency planning, and link budget reviews for fixed and mobile networks. 15+ years field and regulatory experience.' },
]

const complianceServices = [
  { title: 'RSM Compliance Audit', who: 'NZ carriers · RSPs', price: '$3,000–$7,000', description: 'End-to-end review of your RSM obligations: licence conditions, record-keeping, and Radiocommunications Act compliance. Delivered with a prioritised remediation roadmap by a former MBIE auditor.' },
  { title: 'Telecommunications Act (NZ) Review', who: 'RSPs · Resellers · MVNOs', price: '$2,500–$5,000', description: 'Gap analysis against NZ Telecommunications Act obligations, Commerce Commission requirements, and Telecommunications Development Levy. Includes remediation roadmap and board briefing.' },
  { title: 'Privacy Act 2020 Assessment', who: 'Any data-holding operator', price: '$3,000–$7,000', description: 'NZ Privacy Act 2020 compliance review: information privacy principles, privacy impact assessments, breach notification obligations, and data flow mapping.' },
  { title: 'Unsolicited Electronic Messages Review', who: 'Marketing-heavy operators', price: '$1,500–$3,000', description: 'Consent framework audit and policy documentation against the NZ Unsolicited Electronic Messages Act 2007.' },
  { title: 'Data Governance Framework', who: 'Growth-stage operators', price: '$8,000–$25,000', description: 'Policies, standards, and data catalogue implementation. Microsoft Purview or open-source stack — your choice. Delivered in phases with ownership and stewardship built in.' },
  { title: 'Data Sovereignty Review', who: 'GovTech · Defence suppliers', price: '$5,000–$15,000', description: 'Identify data residency risks, cloud provider obligations, and sovereignty controls for NZ government contracts and NZISM alignment.' },
  { title: 'Fractional Compliance Officer', who: 'Operators without in-house compliance', price: '$2,500–$5,000/mo', description: 'Your named compliance officer on retainer. RSM liaison, board reporting, and regulatory horizon scanning. Month-to-month.' },
]

const dataServices = [
  { title: 'Systems Thinking Engagement', who: 'Teams with complex data problems', price: 'from $3,500', description: 'Before building anything: map the system. Understand feedback loops, data flows, and where decisions actually get made. Delivered as a system map + intervention points report. TOGAF and COBIT-aligned.' },
  { title: 'Enterprise Architecture', who: 'Organisations scaling data capability', price: 'from $5,000', description: 'Capability mapping, architecture roadmaps, governance operating models, and investment sequencing. TOGAF · COBIT · ITIL · NIST. Built and delivered in government and higher education contexts.' },
  { title: 'Cloud Data Platform Build', who: 'Teams moving to modern lakehouse', price: 'from $12,000', description: 'Medallion architecture (bronze/silver/gold) on Azure Synapse, Databricks, or Snowflake. dbt transformation layers, lineage, automated testing, and governed Power BI semantic models on top.' },
  { title: 'Analytical Pattern Library (R)', who: 'Research · Analytics teams', price: 'from $250/hr', description: 'Extract reusable EDA, modelling, and communication patterns from your domain. Built on 70+ TidyTuesday episodes — the same methodology applied to your data. Tidyverse · ggplot2 · Quarto.' },
  { title: 'D3 + React Interactive Viz', who: 'Teams publishing data publicly', price: 'from $3,000', description: 'Custom interactive data visualisations built with D3.js and React. SVG, scales, tooltips, geo, force-directed graphs. From the training platform used to teach analysts web-first data storytelling.' },
  { title: 'ETL / ELT Pipelines', who: 'Data engineering teams', price: 'from $250/hr', description: 'Python/R data pipelines with incremental load, error handling, and monitoring. OSS-first, cloud-optional. Azure Data Factory, dbt, or custom Python.' },
  { title: 'Power BI Dashboards', who: 'Operations · Management', price: '$2,500–$8,000', description: 'Executive and operational dashboards. DAX modelling, row-level security, and embedded reporting on governed semantic models.' },
  { title: 'Microsoft Purview', who: 'M365 operators', price: '$3,000–$10,000', description: 'Data catalogue, sensitivity labels, DLP policies, and audit trails for regulated data assets. NZ Privacy Act 2020 and NZISM alignment.' },
  { title: 'R Training (TidyTuesday Method)', who: 'Analyst teams', price: '$1,500/day', description: 'Custom R workshops using real datasets and EDA-first workflows: tidyverse, ggplot2, R Markdown/Quarto. Learn by building, not by slides.' },
]

const automationServices = [
  { title: 'Starter Automation Retainer', who: 'Single process', price: '$150/mo', description: 'One automation deployed and running. Ideal for a single repetitive process: weekly reports, meeting summaries, or invoice extraction. Includes monthly maintenance.' },
  { title: 'Growth Automation Retainer', who: '3 automations', price: '$300/mo', description: 'Three automations plus AI-augmented analysis. The most popular entry point for compliance-heavy operators. Includes fortnightly check-in and one new automation per quarter.' },
  { title: 'Full Stack Retainer', who: 'Unlimited automations', price: '$600/mo', description: 'Full automation stack: reporting, comms, compliance, and document processing. Custom AI workflow design, weekly optimisation review, and same-day support.' },
  { title: 'Weekly Compliance Report', who: 'Pre-built · 3-day setup', price: 'incl. Growth+', description: 'Input: RSM feed + licence DB. Output: PDF email to stakeholders. Saves 3hr/week.' },
  { title: 'Meeting Notes & Actions', who: 'Pre-built · 3-day setup', price: 'incl. Growth+', description: 'Input: Audio recording / transcript. Output: Structured Markdown + action items. Saves 1hr/meeting.' },
  { title: 'Regulatory Digest', who: 'Pre-built · 3-day setup', price: 'incl. Growth+', description: 'Input: RSM · MBIE · OPC feeds. Output: Prioritised briefing with impact flags. Saves 4hr/week.' },
]

const monitorTiers = [
  {
    name: 'Starter',
    price: '$500',
    description: 'Core regulatory monitoring for small operators.',
    features: ['Weekly RSM regulatory digest', 'Telecommunications Act obligation tracker', 'Privacy Act & Spam Act alerts', 'Monthly compliance briefing (1hr)', 'Email support — 48hr SLA'],
    cta: 'Start free trial',
    href: '/contact',
  },
  {
    name: 'Growth',
    price: '$1,500',
    description: 'Full compliance + spectrum for active licence holders.',
    features: ['Everything in Starter', 'Spectrum licence expiry alerts', 'RSM enforcement monitoring', 'Data sovereignty updates', 'Fortnightly strategy call (1hr)', 'Priority support — 24hr SLA'],
    cta: 'Start free trial',
    href: '/contact',
    featured: true,
  },
  {
    name: 'Compliance Pro',
    price: '$3,500',
    description: 'Fractional compliance officer. Named cover.',
    features: ['Everything in Growth', 'Named compliance officer', 'Unlimited regulatory queries', 'Draft RSM responses', 'Quarterly board report', 'Emergency escalation — same-day'],
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
      <section className="pt-[52px] pb-0 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="label mb-4">SERVICES & PRICING</div>
          <h1 className="font-display font-800 text-4xl text-slate-100 mb-3">
            Straightforward pricing. No surprises.
          </h1>
          <p className="text-slate-500 font-body text-sm max-w-lg">
            Fixed-fee engagements wherever possible. Retainers are month-to-month. All prices NZD exclusive of GST.
          </p>
        </div>
      </section>

      <div className="sticky top-[52px] z-40 bg-[#04080f]/95 backdrop-blur-sm" style={{ borderBottom: '1px solid rgba(14,165,233,0.08)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex gap-1 overflow-x-auto py-2">
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`}
                className={`px-3 py-1.5 text-xs font-mono whitespace-nowrap transition-colors rounded-sm ${
                  active === s.id ? 'text-sky-400 bg-sky-500/10' : 'text-slate-600 hover:text-slate-300'
                }`}>
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">

        <section id="spectrum" className="scroll-mt-24">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-mono font-600 text-[4rem] text-sky-500/10 leading-none select-none">01</span>
            <div>
              <div className="label mb-1">SPECTRUM & RADIO</div>
              <h2 className="font-display font-700 text-2xl text-slate-100">Spectrum Licensing — RSM</h2>
            </div>
          </div>
          <div style={{ border: '1px solid rgba(14,165,233,0.08)', borderRadius: '3px' }}>
            <div className="flex items-center gap-6 px-4 py-2.5 text-xs font-mono text-slate-700" style={{ borderBottom: '1px solid rgba(14,165,233,0.07)', background: 'rgba(255,255,255,0.01)' }}>
              <span className="flex-1">SERVICE</span>
              <span className="hidden sm:block w-48">WHO</span>
              <span className="w-28 text-right">PRICE (NZD)</span>
              <span className="w-4" />
            </div>
            {spectrumServices.map((s, i) => (
              <ServiceCard key={s.title} {...s} index={i} />
            ))}
          </div>
        </section>

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
              <span className="w-28 text-right">PRICE (NZD)</span>
              <span className="w-4" />
            </div>
            {complianceServices.map((s, i) => (
              <ServiceCard key={s.title} {...s} index={i} />
            ))}
          </div>
        </section>

        <section id="data" className="scroll-mt-24">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-mono font-600 text-[4rem] text-sky-500/10 leading-none select-none">03</span>
            <div>
              <div className="label mb-1">SYSTEMS THINKING</div>
              <h2 className="font-display font-700 text-2xl text-slate-100">Systems Thinking & Data</h2>
            </div>
          </div>
          <div style={{ border: '1px solid rgba(14,165,233,0.08)', borderRadius: '3px' }}>
            <div className="flex items-center gap-6 px-4 py-2.5 text-xs font-mono text-slate-700" style={{ borderBottom: '1px solid rgba(14,165,233,0.07)', background: 'rgba(255,255,255,0.01)' }}>
              <span className="flex-1">SERVICE</span>
              <span className="hidden sm:block w-48">WHO</span>
              <span className="w-28 text-right">PRICE (NZD)</span>
              <span className="w-4" />
            </div>
            {dataServices.map((s, i) => (
              <ServiceCard key={s.title} {...s} index={i} />
            ))}
          </div>
        </section>

        <section id="automation" className="scroll-mt-24">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-mono font-600 text-[4rem] text-sky-500/10 leading-none select-none">04</span>
            <div>
              <div className="label mb-1">AI AUTOMATION</div>
              <h2 className="font-display font-700 text-2xl text-slate-100">AI Automation Retainers</h2>
            </div>
          </div>

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
              <span className="w-28 text-right">PRICE (NZD)</span>
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
