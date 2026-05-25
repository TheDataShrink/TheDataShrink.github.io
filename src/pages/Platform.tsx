import { Link } from 'react-router-dom'
import {
  ArrowRight, GitBranch, Boxes, Gauge, ShieldCheck, Sparkles, GraduationCap,
  Network, Lock, Workflow,
} from 'lucide-react'

const agents = [
  {
    icon: <GitBranch className="w-4 h-4" />,
    name: 'Lineage Agent',
    desc: 'Traces dependencies from report to source, builds end-to-end lineage, and flags fragile links and unsupported manual processes.',
  },
  {
    icon: <Boxes className="w-4 h-4" />,
    name: 'Semantic Model Agent',
    desc: 'Audits star-schema quality — snowflaking, duplicated measures, ambiguous relationships, wrong granularity, misused fact tables.',
  },
  {
    icon: <Gauge className="w-4 h-4" />,
    name: 'Performance Agent',
    desc: 'Finds memory-heavy models, oversized visuals, inefficient DAX, unused columns, excess cardinality, and DirectQuery misuse.',
  },
  {
    icon: <ShieldCheck className="w-4 h-4" />,
    name: 'Governance Agent',
    desc: 'Surfaces shadow IT, Excel dependencies, ungoverned transformations, and duplicated business definitions across the estate.',
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    name: 'Optimisation Agent',
    desc: 'Recommends SQL views, aggregate tables, dimensional restructuring, curated semantic assets, and incremental refresh.',
  },
  {
    icon: <GraduationCap className="w-4 h-4" />,
    name: 'Education Agent',
    desc: 'Explains the architecture to your team — PBIP method, semantic modelling, lineage thinking, medallion trade-offs, governance maturity.',
  },
]

const phases = [
  { num: '01', name: 'Discovery', desc: 'Rapid architecture scan. Technical-debt analysis, dependency mapping, performance scoring, governance maturity assessment.' },
  { num: '02', name: 'Pilot Optimisation', desc: 'Optimise one business domain end to end. Demonstrate measurable wins — smaller models, faster refresh, tighter governance.' },
  { num: '03', name: 'Enablement', desc: 'Transfer the architecture knowledge. Train internal teams on semantic design and establish reusable governance patterns.' },
  { num: '04', name: 'Ongoing Cadence', desc: 'Quarterly architecture health checks, governance maturity reviews, and agent-assisted optimisation cycles.' },
]

const skills = [
  { name: 'PBIP', desc: 'Report + semantic metadata, Git-integrated analytics workflows.' },
  { name: 'DAX', desc: 'Evaluation context, query plans, measure and filter-propagation optimisation.' },
  { name: 'SQL', desc: 'Query optimisation, index usage, aggregation and dimensional modelling.' },
  { name: 'Lineage', desc: 'Upstream/downstream dependencies, semantic propagation, data contracts.' },
  { name: 'Governance', desc: 'Ownership, stewardship, certification, gold/silver/bronze violations.' },
  { name: 'Fabric', desc: 'Lakehouse and warehouse patterns, notebook orchestration, semantic endpoints.' },
]

const sovereignty = [
  'Runs inside your firewall — local agents, Docker, isolated VMs',
  'Air-gapped deployments supported',
  'Local embeddings and vector stores',
  'Sovereign / offline inference — your models, your hardware',
  'Zero external data leakage',
  'Customer-owned infrastructure, end to end',
]

export default function Platform() {
  return (
    <>
      {/* Hero */}
      <section className="pt-[52px] bg-grid">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
          <p className="label mb-4">THE PLATFORM · AGENT-DRIVEN POWER BI OPTIMISATION</p>
          <h1 className="font-display font-800 text-4xl md:text-5xl text-slate-100 leading-[1.1] max-w-3xl mb-6">
            A sovereign agent system that finds the technical debt your dashboards are hiding.
          </h1>
          <p className="text-slate-400 font-body text-lg leading-relaxed max-w-2xl mb-4">
            The platform reads your Power BI estate the way an LLM reads code — reports,
            semantic models, gateways, queries, transformations, and lineage — then maps
            the architecture, scores the debt, and proposes deployable fixes.
          </p>
          <p className="text-slate-500 font-body text-sm leading-relaxed max-w-2xl mb-10">
            It discovers, models, analyses, explains, and recommends. It never touches
            production on its own — every change goes through human review.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/diagnostic" className="btn-primary">
              Start with a discovery scan <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/contact" className="btn-outline">
              Talk through your estate <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Thesis */}
      <section className="py-20 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-8">THE THESIS</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <p className="font-display font-600 text-2xl text-slate-200 leading-snug">
              The dashboard is rarely the problem. It&rsquo;s the customer-facing truth layer
              that exposes everything broken upstream.
            </p>
            <div className="space-y-4 text-slate-400 font-body text-[0.95rem] leading-relaxed">
              <p>
                Power BI is where organisational pain becomes visible: semantic drift,
                duplicated business logic, missing dimensions, raw-layer querying,
                spreadsheet dependencies, shadow IT.
              </p>
              <p>
                The real inefficiency lives upstream — ingestion patterns, weak dimensional
                design, excess transformation logic, the absence of governed, reusable data
                products. The platform exposes those issues safely and systematically, and
                points at the curated assets that would replace them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PBIP wedge */}
      <section className="py-20 bg-grid">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="label mb-4">WHY NOW — THE PBIP SHIFT</div>
              <h2 className="font-display font-700 text-2xl text-slate-100 mb-5 leading-tight">
                The move from <span className="font-mono text-slate-400">.pbix</span> to{' '}
                <span className="font-mono text-sky-400">.pbip</span> is what made agents possible.
              </h2>
              <div className="space-y-4 text-slate-400 font-body text-[0.95rem] leading-relaxed">
                <p>
                  A <span className="font-mono text-xs text-slate-400">.pbix</span> file is a
                  compressed binary blob — an LLM is blind to it. A{' '}
                  <span className="font-mono text-xs text-slate-400">.pbip</span> project is an
                  open folder of JSON, TMDL, and text. Agents can read the exact schemas, reason
                  about them, and write changes back.
                </p>
                <p>
                  That&rsquo;s the wedge — not the headline. PBIP is the enabler: code-first
                  analytics, parallel multi-agent builds, and closed-loop CI/CD that compiles,
                  validates, and self-corrects against Fabric and Git.
                </p>
              </div>
            </div>

            {/* Orchestration diagram, terminal-styled */}
            <div className="terminal rounded-sm overflow-hidden">
              <div className="terminal-header">
                <div className="terminal-dot bg-red-500/70" />
                <div className="terminal-dot bg-amber-500/70" />
                <div className="terminal-dot bg-emerald-500/70" />
                <span className="ml-2 text-[0.65rem] text-slate-600 tracking-wider">agentic-build.flow</span>
              </div>
              <pre className="p-5 text-[0.7rem] leading-relaxed text-slate-400 overflow-x-auto">{`        ┌───────────────────────────┐
        │     user natural prompt    │
        └─────────────┬─────────────┘
                      ▼
        ┌───────────────────────────┐
        │     orchestrator agent     │
        └─────────────┬─────────────┘
              ┌────────┴────────┐
              ▼                 ▼
      ┌──────────────┐  ┌──────────────┐
      │ data / DAX   │  │ UI sub-agents│
      └──────┬───────┘  └──────┬───────┘
             └────────┬────────┘
                      ▼
        ┌───────────────────────────┐
        │     merged .pbip folder    │
        └───────────────────────────┘`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Agents */}
      <section className="py-20 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-3">THE AGENTS</div>
          <h2 className="font-display font-800 text-3xl text-slate-100 mb-2">
            Six specialists, one knowledge graph.
          </h2>
          <p className="text-slate-500 font-body text-sm max-w-2xl mb-10">
            Each agent has its own skills, tools, and memory, and shares a knowledge graph of
            your estate — reports, measures, tables, columns, gateways, jobs, and the
            relationships between them.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {agents.map((a) => (
              <div key={a.name} className="card rounded-sm p-5">
                <div className="w-8 h-8 rounded-sm bg-sky-500/10 border border-sky-500/15 flex items-center justify-center text-sky-400 mb-4">
                  {a.icon}
                </div>
                <h3 className="font-display font-700 text-slate-100 mb-2">{a.name}</h3>
                <p className="text-sm text-slate-500 font-body leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core insight engine */}
      <section className="py-20 bg-grid">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="label mb-4">CORE INSIGHT ENGINE</div>
              <h2 className="font-display font-700 text-2xl text-slate-100 mb-5 leading-tight">
                It reasons about cost the way a modeller does.
              </h2>
              <p className="text-slate-400 font-body text-[0.95rem] leading-relaxed mb-4">
                Three million rows × 2 columns can be cheaper than three million rows × 40.
                The engine weighs memory pressure, compression, cardinality, relationship
                expansion, filter propagation, and DAX evaluation context — then favours the
                minimal viable semantic asset.
              </p>
              <p className="text-slate-500 font-body text-sm leading-relaxed">
                Curated datasets. Reusable dimensions. Governed transformations. Shared business
                logic. Less entropy.
              </p>
            </div>
            <div className="card-sky rounded-sm p-6 font-mono text-[0.78rem] text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 mb-3"><Network className="w-3.5 h-3.5" /> KNOWLEDGE GRAPH</div>
              <p><span className="text-slate-600">entities &nbsp;</span> reports · measures · tables · columns · gateways · jobs · APIs · SQL objects</p>
              <p><span className="text-slate-600">edges &nbsp;&nbsp;&nbsp;&nbsp;</span> uses · depends-on · transforms · duplicates · joins-with · refreshes-from · aggregates</p>
              <p className="pt-2 text-slate-500">→ the shared memory layer every agent reads from.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sovereignty */}
      <section className="py-20 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="label mb-4">SOVEREIGN BY DEFAULT</div>
              <h2 className="font-display font-700 text-2xl text-slate-100 mb-5 leading-tight">
                Your data never leaves your infrastructure.
              </h2>
              <p className="text-slate-400 font-body text-[0.95rem] leading-relaxed">
                Security isn&rsquo;t a setting — it&rsquo;s the architecture. The runtime is built
                to operate entirely inside customer-controlled infrastructure, with MCP-style
                modular skills and tool routing.
              </p>
            </div>
            <ul className="space-y-3">
              {sovereignty.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm text-slate-400 font-body">
                  <Lock className="w-3.5 h-3.5 text-emerald-400 mt-1 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* MCP skills */}
      <section className="py-20 bg-grid">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-3">MCP SKILLS</div>
          <h2 className="font-display font-800 text-3xl text-slate-100 mb-10">
            Modular skills, routed per task.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-sky-500/10 border border-sky-500/10 rounded-sm overflow-hidden">
            {skills.map((s) => (
              <div key={s.name} className="bg-[#04080f] p-5">
                <div className="font-mono text-xs text-sky-400 mb-2 tracking-wider uppercase">{s.name}</div>
                <p className="text-sm text-slate-500 font-body leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Human in the loop */}
      <section className="py-20 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="card-amber rounded-sm p-6 flex items-start gap-4">
            <Workflow className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-700 text-slate-100 mb-2">Human governance is mandatory.</h3>
              <p className="text-sm text-slate-400 font-body leading-relaxed max-w-2xl">
                The platform discovers, analyses, recommends, generates candidate solutions, and
                produces deployment scripts — then stops. A human reviews, approves, and controls
                the rollout. Nothing reaches production automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery phases */}
      <section className="py-20 bg-grid">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-3">HOW WE WORK</div>
          <h2 className="font-display font-800 text-3xl text-slate-100 mb-10">
            Four phases, from scan to cadence.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {phases.map((p) => (
              <div key={p.num} className="card rounded-sm p-5">
                <span className="font-mono font-700 text-3xl text-sky-500/30 leading-none">{p.num}</span>
                <h3 className="font-display font-700 text-slate-100 mt-4 mb-2">{p.name}</h3>
                <p className="text-sm text-slate-500 font-body leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + spectrum link */}
      <section className="py-16 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="font-display font-700 text-2xl text-slate-100 mb-1">See it on your own estate.</h2>
              <p className="text-slate-500 font-body text-sm">A discovery scan is the cheapest way to find out what&rsquo;s hiding. 30 minutes to scope it.</p>
            </div>
            <Link to="/contact" className="btn-primary flex-shrink-0">
              Book a discovery call <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-xs text-slate-600 font-body">
            Need the regulatory side instead? Spectrum, RSM licensing, compliance, and data
            engineering live on the{' '}
            <Link to="/spectrum" className="text-sky-400 hover:text-sky-300 underline underline-offset-2">
              consulting arm
            </Link>.
          </p>
        </div>
      </section>
    </>
  )
}
