import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Play } from 'lucide-react'
import { seriesWithEpisodes } from '@/episodes'
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
  const tracks = seriesWithEpisodes()

  return (
    <div className="pt-[52px]">
      {/* Page hero */}
      <section className="relative bg-grid border-b border-sky-500/10">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <p className="label mb-3">Episodes · {tracks.length} series</p>
          <h1 className="font-display font-700 text-4xl md:text-5xl text-slate-100 leading-tight tracking-tight">
            The open method, written down.
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
            We teach the way of seeing enterprise analytics openly — and sell the engine that
            does it for you. These are the long-form episodes: an applied walkthrough of the
            Data Shrink method on a real-shaped estate, and the foundations track on building
            agents from scratch.
          </p>
          {tracks.length > 1 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {tracks.map(({ series }) => (
                <a
                  key={series.id}
                  href={`#${series.id}`}
                  className="font-mono text-xs text-slate-500 hover:text-sky-400 border border-sky-500/15 hover:border-sky-500/40 px-3 py-1.5 rounded-sm transition-colors"
                >
                  {series.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* One block per series */}
      {tracks.map(({ series, episodes }) => (
        <section key={series.id} id={series.id} className="max-w-4xl mx-auto px-6 py-16 scroll-mt-[60px]">
          <div className="mb-10">
            <p className="label mb-2">Series · {episodes.length} episodes</p>
            <h2 className="font-display font-700 text-2xl md:text-3xl text-slate-100 tracking-tight">
              {series.title}
            </h2>
            <p className="mt-2 text-sky-300/70 font-body text-sm">{series.tagline}</p>
            <p className="mt-4 text-sm text-slate-500 max-w-2xl leading-relaxed">{series.description}</p>
          </div>

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
                        <h3 className="font-display font-600 text-xl text-slate-100 group-hover:text-sky-300 transition-colors">
                          {ep.title}
                        </h3>
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
                        {ep.video && (
                          <>
                            <span>·</span>
                            <span className="inline-flex items-center gap-1 text-sky-400/80 font-mono text-[10px] uppercase tracking-wider">
                              <Play className="w-2.5 h-2.5" fill="currentColor" /> video
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-sky-400 transition-colors mt-2 flex-shrink-0" />
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ))}

      <p className="max-w-4xl mx-auto px-6 pb-16 text-xs text-slate-500 text-center">
        Code samples are MIT-licensed unless noted. Source attributions inside each episode.
      </p>
    </div>
  )
}
