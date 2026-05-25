import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import { episodes } from '@/episodes'
import type { Language } from '@/episodes/types'

const LANG_COLOR: Record<Language, string> = {
  python:     'bg-sky-500/10 text-sky-400 border-sky-500/30',
  sql:        'bg-purple-500/10 text-purple-300 border-purple-500/30',
  r:          'bg-blue-500/10 text-blue-300 border-blue-500/30',
  typescript: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  javascript: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  html:       'bg-orange-500/10 text-orange-300 border-orange-500/30',
  json:       'bg-slate-500/10 text-slate-300 border-slate-500/30',
  d3:         'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
}

function LangPill({ lang }: { lang: Language }) {
  return (
    <span className={`font-mono text-[10px] uppercase tracking-wider border px-1.5 py-0.5 rounded-sm ${LANG_COLOR[lang]}`}>
      {lang === 'typescript' ? 'ts' : lang === 'javascript' ? 'js' : lang}
    </span>
  )
}

export default function Episodes() {
  return (
    <div className="pt-[52px]">
      {/* Hero */}
      <section className="relative bg-grid border-b border-sky-500/10">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <p className="label mb-3">Series · 12 episodes</p>
          <h1 className="font-display font-700 text-4xl md:text-5xl text-slate-100 leading-tight tracking-tight">
            Building an Agent from Scratch
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
            A father&rsquo;s notes to his children on how they would build an AI agent if
            they were starting from nothing. Twelve episodes that go from a single
            language-model call to a working, evaluated, production-shaped agent.
          </p>
          <p className="mt-4 text-sm text-slate-500 max-w-2xl leading-relaxed">
            Each episode adds <em>one capability</em> to the agent built in the previous one.
            By Episode 5 you have a real ReAct loop. By Episode 10 you have something that
            could plausibly run in production. The code accretes; nothing is thrown away.
            Source material includes Chip Huyen&rsquo;s <em>AI Engineering</em> (O&rsquo;Reilly, 2024),
            among others — but the voice and the choices are mine.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="label !text-slate-500 !text-[10px]">Languages used:</span>
            {(['python', 'sql', 'r', 'typescript', 'd3'] as Language[]).map((l) => (
              <LangPill key={l} lang={l} />
            ))}
          </div>
        </div>
      </section>

      {/* Episode list */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <ol className="space-y-4">
          {episodes.map((ep) => (
            <li key={ep.slug}>
              <Link
                to={`/episodes/${ep.slug}`}
                className="group block card hover:border-sky-500/40 transition-colors rounded-md p-6"
              >
                <div className="flex items-start gap-6">
                  <div className="font-mono text-3xl font-700 text-sky-500/80 leading-none w-12 flex-shrink-0 mt-1">
                    {String(ep.number).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-display font-600 text-xl text-slate-100 group-hover:text-sky-300 transition-colors">
                        {ep.title}
                      </h2>
                      {ep.optional && (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 border border-slate-500/30 px-1.5 py-0.5 rounded-sm">
                          optional
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                      {ep.hook}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ep.readingMinutes} min read
                      </span>
                      <span>·</span>
                      <span className="font-mono text-[11px] text-slate-500">{ep.code.length} code files</span>
                      <span>·</span>
                      <div className="flex items-center gap-1.5">
                        {ep.languages.map((l) => <LangPill key={l} lang={l} />)}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-sky-400 transition-colors mt-2 flex-shrink-0" />
                </div>
              </Link>
            </li>
          ))}
        </ol>

        <p className="mt-12 text-xs text-slate-500 text-center">
          Code samples are MIT-licensed unless noted. Source attributions inside each episode.
        </p>
      </section>
    </div>
  )
}
