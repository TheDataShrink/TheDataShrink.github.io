import { useEffect, useMemo, useRef } from 'react'
import { Marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

/**
 * Markdown renderer for episode prose.
 * - marked for parsing
 * - highlight.js for fenced code blocks
 * - one Marked instance per render configuration (avoid global state)
 */

const marked = new Marked({
  gfm: true,
  breaks: false,
})

marked.use({
  renderer: {
    code(token: { text: string; lang?: string }) {
      const raw = typeof token === 'string' ? token : token.text
      const lang = typeof token === 'string' ? arguments[1] : token.lang
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
      const highlighted = language === 'plaintext'
        ? escapeHtml(raw)
        : hljs.highlight(raw, { language }).value
      return `<pre class="hljs rounded-md p-4 overflow-x-auto text-[12.5px] leading-relaxed border border-sky-500/10"><code class="language-${language}">${highlighted}</code></pre>`
    },
  },
})

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

export default function Markdown({ source }: { source: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const html = useMemo(() => marked.parse(source) as string, [source])

  // re-run highlight on any code blocks that slipped through unhighlighted
  useEffect(() => {
    if (!ref.current) return
    ref.current.querySelectorAll('pre code:not(.hljs-applied)').forEach((el) => {
      hljs.highlightElement(el as HTMLElement)
      el.classList.add('hljs-applied')
    })
  }, [html])

  return (
    <div
      ref={ref}
      className="prose-episode"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
