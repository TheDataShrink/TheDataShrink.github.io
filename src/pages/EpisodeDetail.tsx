import { useParams, Link, Navigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock, Play } from 'lucide-react'
import { adjacentEpisodes, episodeBySlug } from '@/episodes'
import Markdown from '@/components/Markdown'
import CodeBlock from '@/components/CodeBlock'
import VideoEmbed from '@/components/VideoEmbed'

export default function EpisodeDetail() {
  const { slug = '' } = useParams<{ slug: string }>()
  const episode = episodeBySlug(slug)

  if (!episode) {
    return <Navigate to="/episodes" replace />
  }

  const { prev, next } = adjacentEpisodes(slug)

  return (
    <div className="pt-[52px]">
      {/* Header */}
      <header className="border-b border-sky-500/10 bg-grid">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Link to="/episodes" className="nav-link inline-flex items-center gap-1.5 mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> All episodes
          </Link>
          <p className="label mb-3">
            Episode {String(episode.number).padStart(2, '0')}
            {episode.optional ? ' · Optional' : ''}
          </p>
          <h1 className="font-display font-700 text-3xl md:text-4xl text-slate-100 leading-tight tracking-tight">
            {episode.title}
          </h1>
          <p className="mt-5 text-slate-400 text-lg leading-relaxed">
            {episode.hook}
          </p>
          <div className="mt-6 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" /> {episode.readingMinutes} min read
            </span>
            {episode.video?.durationMin && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1 text-sky-400/80">
                  <Play className="w-3 h-3" fill="currentColor" /> {episode.video.durationMin} min watch
                </span>
              </>
            )}
            <span>·</span>
            <span className="font-mono">{episode.date}</span>
            <span>·</span>
            <span className="font-mono text-slate-500">{episode.source}</span>
          </div>
        </div>
      </header>

      {/* Prose */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Video companion — paired with every episode */}
        <div className="mb-12">
          <VideoEmbed video={episode.video} title={episode.title} />
        </div>

        <Markdown source={episode.prose} />

        {/* Interactive visualizations (D3 / standalone HTML) */}
        {episode.code.filter((f) => f.language === 'html' || f.language === 'd3').length > 0 && (
          <section className="mt-16 pt-12 border-t border-sky-500/10">
            <p className="label mb-2">Visualization</p>
            <h2 className="font-display font-700 text-2xl text-slate-100 mb-8">
              Interactive
            </h2>
            {episode.code
              .filter((f) => f.language === 'html' || f.language === 'd3')
              .map((file) => (
                <div key={file.filename} className="mb-8">
                  <div className="flex items-center justify-between px-4 py-2 border border-sky-500/15 border-b-0 bg-[#070d18] rounded-t-md">
                    <span className="font-mono text-[11px] text-slate-400">{file.filename}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-300/80 border border-emerald-500/30 px-1.5 py-0.5 rounded-sm">
                      live · D3
                    </span>
                  </div>
                  <iframe
                    title={file.filename}
                    srcDoc={file.source}
                    sandbox="allow-scripts"
                    className="w-full h-[560px] border border-sky-500/15 rounded-b-md bg-[#0b1220]"
                  />
                </div>
              ))}
          </section>
        )}

        {/* Code files (everything that isn't a standalone visualization) */}
        {episode.code.filter((f) => f.language !== 'html' && f.language !== 'd3').length > 0 && (
          <section className="mt-16 pt-12 border-t border-sky-500/10">
            <p className="label mb-2">Code files</p>
            <h2 className="font-display font-700 text-2xl text-slate-100 mb-2">
              Run it yourself
            </h2>
            <p className="text-sm text-slate-400 mb-8">
              Copy and run locally; the full series shares one running example (a trip planner)
              that accretes from Episode 1.
            </p>
            <div>
              {episode.code
                .filter((f) => f.language !== 'html' && f.language !== 'd3')
                .map((file) => (
                  <CodeBlock
                    key={file.filename}
                    filename={file.filename}
                    source={file.source}
                    language={file.language}
                  />
                ))}
            </div>
          </section>
        )}

        {/* Prev / next */}
        <nav className="mt-16 pt-8 border-t border-sky-500/10 grid grid-cols-2 gap-4">
          <div>
            {prev && (
              <Link to={`/episodes/${prev.slug}`} className="block card hover:border-sky-500/30 rounded-md p-4 transition-colors group">
                <span className="label !text-[10px] flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Previous
                </span>
                <span className="block mt-2 text-sm text-slate-300 group-hover:text-sky-300 transition-colors">
                  {String(prev.number).padStart(2, '0')} · {prev.title}
                </span>
              </Link>
            )}
          </div>
          <div>
            {next && (
              <Link to={`/episodes/${next.slug}`} className="block card hover:border-sky-500/30 rounded-md p-4 transition-colors group text-right">
                <span className="label !text-[10px] flex items-center justify-end gap-1">
                  Next <ArrowRight className="w-3 h-3" />
                </span>
                <span className="block mt-2 text-sm text-slate-300 group-hover:text-sky-300 transition-colors">
                  {String(next.number).padStart(2, '0')} · {next.title}
                </span>
              </Link>
            )}
          </div>
        </nav>
      </article>
    </div>
  )
}
