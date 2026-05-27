import { useEffect, useRef, useState } from 'react'
import hljs from 'highlight.js'
import { Copy, Check } from 'lucide-react'
import type { Language } from '@/episodes/types'

const HLJS_NAME: Record<Language, string> = {
  python: 'python',
  sql: 'sql',
  r: 'r',
  typescript: 'typescript',
  javascript: 'javascript',
  html: 'xml',
  json: 'json',
  yaml: 'yaml',
  d3: 'xml',
}

interface Props {
  filename: string
  source: string
  language: Language
}

export default function CodeBlock({ filename, source, language }: Props) {
  const codeRef = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!codeRef.current) return
    const lang = HLJS_NAME[language] ?? 'plaintext'
    codeRef.current.innerHTML = hljs.getLanguage(lang)
      ? hljs.highlight(source, { language: lang }).value
      : escapeHtml(source)
  }, [source, language])

  const copy = async () => {
    await navigator.clipboard.writeText(source)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-md overflow-hidden border border-sky-500/15 bg-[#0a1322] my-6">
      <div className="flex items-center justify-between px-4 py-2 border-b border-sky-500/10 bg-[#070d18]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-slate-400">{filename}</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-sky-500/70 border border-sky-500/20 px-1.5 py-0.5 rounded-sm">
            {language}
          </span>
        </div>
        <button
          onClick={copy}
          className="text-slate-500 hover:text-sky-400 transition-colors flex items-center gap-1 text-[11px]"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className="hljs p-4 overflow-x-auto text-[12.5px] leading-relaxed">
        <code ref={codeRef} className={`language-${HLJS_NAME[language]}`} />
      </pre>
    </div>
  )
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}
