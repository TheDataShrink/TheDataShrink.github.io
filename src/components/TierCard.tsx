import { Link } from 'react-router-dom'

interface TierCardProps {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  cta?: string
  href?: string
  featured?: boolean
}

export default function TierCard({ name, price, period = '/mo', description, features, cta = 'Get started', href = '/contact', featured = false }: TierCardProps) {
  return (
    <div className={`rounded-sm p-6 flex flex-col gap-5 relative ${featured ? 'card-sky' : 'card'}`}
      style={featured ? { borderColor: 'rgba(14,165,233,0.35)' } : {}}>
      {featured && (
        <div className="absolute -top-px left-0 right-0 h-px bg-sky-500" />
      )}

      <div>
        <div className="label mb-2">{name}</div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-display font-800 text-2xl text-slate-100">{price}</span>
          <span className="text-xs font-mono text-slate-600">{period}</span>
        </div>
        <p className="text-xs text-slate-500 font-body mt-2 leading-relaxed">{description}</p>
      </div>

      <ul className="flex flex-col gap-2 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-slate-400 font-body">
            <span className="text-sky-600 font-mono mt-px">—</span>
            {f}
          </li>
        ))}
      </ul>

      <Link to={href}
        className={`text-center text-sm font-display font-600 py-2 rounded-sm transition-all ${
          featured
            ? 'bg-sky-500 text-[#04080f] hover:bg-sky-400'
            : 'border border-sky-500/30 text-sky-400 hover:border-sky-400 hover:bg-sky-500/8'
        }`}>
        {cta}
      </Link>
    </div>
  )
}
