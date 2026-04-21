import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface ServiceRowProps {
  title: string
  who: string
  price: string
  description: string
  index: number
}

export default function ServiceCard({ title, who, price, description, index }: ServiceRowProps) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`border-b transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.012]'}`}
      style={{ borderColor: 'rgba(14,165,233,0.07)' }}
    >
      <div
        className="flex items-center justify-between gap-4 px-4 py-3.5 hover:bg-sky-500/5 transition-colors"
        onClick={() => setOpen(v => !v)}
        role="button"
        aria-expanded={open}
      >
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <span className="font-display font-600 text-sm text-slate-200 truncate">{title}</span>
          <span className="text-xs font-mono text-slate-600 hidden sm:block whitespace-nowrap">{who}</span>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="data-value text-sm">{price}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-600 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>
      {open && (
        <div className="px-4 pb-4 pt-0">
          <p className="text-sm text-slate-400 font-body leading-relaxed border-l-2 border-sky-500/30 pl-3">
            {description}
          </p>
          <p className="text-xs font-mono text-slate-600 mt-2 pl-3">{who}</p>
        </div>
      )}
    </div>
  )
}
