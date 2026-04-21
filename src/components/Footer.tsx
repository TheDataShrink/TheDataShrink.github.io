import { Link } from 'react-router-dom'
import { Mail, Linkedin, Twitter } from 'lucide-react'

const serviceLinks = [
  ['Spectrum & Radio', '/services#spectrum'],
  ['Compliance & Governance', '/services#compliance'],
  ['Data & Analytics', '/services#data'],
  ['AI Automation', '/services#automation'],
  ['Compliance Monitor', '/services#subscription'],
]

const contactLinks = [
  ['contact@thedatashrink.com', 'mailto:contact@thedatashrink.com'],
  ['spectrum@thedatashrink.com', 'mailto:spectrum@thedatashrink.com'],
  ['LinkedIn', 'https://www.linkedin.com/in/stoianandreimircea/'],
  ['Twitter / X', 'https://twitter.com/TheDataShrink'],
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(14,165,233,0.08)' }} className="bg-[#04080f]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="font-mono text-xs font-600 text-sky-500 border border-sky-500/30 px-1.5 py-0.5 rounded-sm tracking-widest">TDS</span>
              <span className="font-display font-700 text-sm text-slate-200">TheDataShrink<span className="text-slate-600 font-400">™</span></span>
            </div>
            <p className="text-sm text-slate-600 font-body leading-relaxed max-w-xs mb-5">
              Spectrum · Compliance · Data · AI Automation<br />
              for AU/NZ telecom operators.
            </p>
            <div className="flex gap-3">
              <a href="https://www.linkedin.com/in/stoianandreimircea/" target="_blank" rel="noreferrer"
                className="text-slate-600 hover:text-sky-400 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com/TheDataShrink" target="_blank" rel="noreferrer"
                className="text-slate-600 hover:text-sky-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="mailto:contact@thedatashrink.com"
                className="text-slate-600 hover:text-sky-400 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <div className="label mb-4">Services</div>
            <ul className="space-y-2">
              {serviceLinks.map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-slate-600 hover:text-sky-400 font-body transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="label mb-4">Contact</div>
            <ul className="space-y-2">
              {contactLinks.map(([label, href]) => (
                <li key={label}>
                  <a href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="text-sm text-slate-600 hover:text-sky-400 font-body transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }} className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-700 font-mono">
            © 2026 TheDataShrink™ · Andrei Stoian · ABN registered · AU · NZ
          </p>
          <p className="text-xs text-slate-700 font-mono">
            ACMA Accredited Person · NZ ARE #176
          </p>
        </div>
      </div>
    </footer>
  )
}
