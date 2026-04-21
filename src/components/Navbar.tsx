import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const serviceLinks = [
  { label: 'Spectrum & Radio', href: '/services#spectrum' },
  { label: 'Compliance & Governance', href: '/services#compliance' },
  { label: 'Systems Thinking', href: '/services#data' },
  { label: 'AI Automation', href: '/services#automation' },
  { label: 'Compliance Monitor', href: '/services#subscription' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <>
      <header style={{ background: '#04080f', borderBottom: '1px solid rgba(14,165,233,0.08)' }}
        className="fixed top-0 inset-x-0 z-50 h-[52px]">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="font-mono text-xs font-600 text-sky-500 border border-sky-500/30 px-1.5 py-0.5 rounded-sm tracking-widest">
              TDS
            </span>
            <span className="font-display font-700 text-sm text-slate-100 tracking-tight">
              TheDataShrink<span className="text-slate-500 font-400">™</span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link
                key={l.href}
                to={l.href}
                className={`nav-link ${pathname === l.href ? '!text-slate-200 after:!w-full' : ''}`}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/contact" className="btn-outline py-1.5 px-4 text-xs ml-2">
              Book a Call
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(v => !v)}
            className="md:hidden p-1.5 text-slate-500 hover:text-slate-200 transition-colors">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute top-[52px] inset-x-0 bg-[#070d1a] border-b border-sky-500/10 p-6">
            <div className="label mb-4">Navigation</div>
            {serviceLinks.map(l => (
              <Link key={l.href} to={l.href} onClick={() => setOpen(false)}
                className="block py-2.5 text-sm text-slate-400 hover:text-slate-100 font-body border-b border-white/5 transition-colors">
                {l.label}
              </Link>
            ))}
            <Link to="/about" onClick={() => setOpen(false)}
              className="block py-2.5 text-sm text-slate-400 hover:text-slate-100 font-body border-b border-white/5 transition-colors">
              About
            </Link>
            <div className="pt-4">
              <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
                Book a free call
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
