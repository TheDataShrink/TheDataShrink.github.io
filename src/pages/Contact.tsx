import { Mail, Linkedin, Radio, ArrowRight } from 'lucide-react'

const directContacts = [
  {
    icon: <Mail className="w-4 h-4" />,
    label: 'GENERAL',
    value: 'contact@thedatashrink.com',
    href: 'mailto:contact@thedatashrink.com',
    desc: 'Data, analytics, compliance, and automation enquiries.',
  },
  {
    icon: <Radio className="w-4 h-4" />,
    label: 'SPECTRUM',
    value: 'spectrum@thedatashrink.com',
    href: 'mailto:spectrum@thedatashrink.com',
    desc: 'FAC/IIC applications, licence audits, and RF engineering.',
  },
  {
    icon: <Linkedin className="w-4 h-4" />,
    label: 'LINKEDIN',
    value: 'stoianandreimircea',
    href: 'https://www.linkedin.com/in/stoianandreimircea/',
    desc: 'Connect for updates and industry news.',
  },
]

const steps = [
  { n: '01', title: 'You reach out', desc: 'Book a call, email, or LinkedIn. Whatever feels right.' },
  { n: '02', title: 'Reply within 24hrs', desc: 'Business hours AEST. Spectrum queries get same-day acknowledgement.' },
  { n: '03', title: 'Discovery call — 30 min', desc: 'No slides. No pitch. Just a conversation about what\'s on your plate.' },
  { n: '04', title: 'Proposal or quick start', desc: 'Fixed-fee SOW or a retainer letter. Most engagements start within a week.' },
]

export default function Contact() {
  return (
    <>
      <section className="pt-[52px] bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="label mb-4">GET IN TOUCH</div>
          <h1 className="font-display font-800 text-3xl text-slate-100 mb-2">
            Let's talk about what's on your plate.
          </h1>
          <p className="text-slate-500 font-body text-sm mb-14 max-w-md">
            Spectrum issue. Compliance gap. Data project. Automation idea. Bring it.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Left — direct contact */}
            <div>
              <div className="label mb-6">DIRECT CONTACT</div>
              <div style={{ border: '1px solid rgba(14,165,233,0.08)', borderRadius: '3px' }}>
                {directContacts.map((c, i) => (
                  <a key={c.label} href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="flex items-start gap-4 px-5 py-4 hover:bg-sky-500/5 transition-colors group"
                    style={{ borderBottom: i < directContacts.length - 1 ? '1px solid rgba(14,165,233,0.06)' : 'none' }}>
                    <div className="w-8 h-8 rounded-sm bg-sky-500/8 border border-sky-500/15 flex items-center justify-center text-sky-500 flex-shrink-0 mt-0.5">
                      {c.icon}
                    </div>
                    <div>
                      <div className="label text-[0.6rem] mb-0.5">{c.label}</div>
                      <div className="text-sm font-mono text-sky-400 group-hover:text-sky-300 transition-colors">{c.value}</div>
                      <p className="text-xs text-slate-600 font-body mt-1">{c.desc}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Availability note */}
              <div className="mt-6 flex items-center gap-2.5 card rounded-sm px-4 py-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" style={{ boxShadow: '0 0 6px #10b981' }} />
                <p className="text-xs font-mono text-slate-500">
                  Available for new engagements · AU & NZ · Remote-first · AEST
                </p>
              </div>
            </div>

            {/* Right — booking + steps */}
            <div>
              <div className="label mb-6">HOW TO START</div>

              {/* Book call CTA */}
              <div className="card-sky rounded-sm p-6 mb-8">
                <div className="font-display font-700 text-base text-slate-100 mb-1">Book a Discovery Call</div>
                <p className="text-xs text-slate-500 font-body mb-4">30 minutes. Free. No pitch. No obligation.</p>
                <ul className="space-y-1.5 mb-5">
                  {['No slides, no sales deck', 'I research your business before the call', 'Written summary sent after'].map((item, i) => (
                    <li key={i} className="text-xs text-slate-500 font-body flex items-center gap-2">
                      <span className="text-sky-600 font-mono">—</span> {item}
                    </li>
                  ))}
                </ul>
                <a href="[CALENDLY_LINK]" target="_blank" rel="noreferrer" className="btn-primary text-sm">
                  Book on Calendly <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Steps */}
              <div className="label mb-4">RESPONSE PROCESS</div>
              <div className="space-y-0" style={{ border: '1px solid rgba(14,165,233,0.08)', borderRadius: '3px' }}>
                {steps.map((s, i) => (
                  <div key={s.n} className="flex gap-4 px-5 py-4"
                    style={{ borderBottom: i < steps.length - 1 ? '1px solid rgba(14,165,233,0.06)' : 'none' }}>
                    <span className="font-mono font-700 text-xl text-sky-500/20 flex-shrink-0 leading-none mt-0.5">{s.n}</span>
                    <div>
                      <div className="font-display font-600 text-sm text-slate-200 mb-0.5">{s.title}</div>
                      <p className="text-xs text-slate-500 font-body">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
