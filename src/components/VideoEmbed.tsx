import { useState } from 'react'
import { Play, Film } from 'lucide-react'
import type { EpisodeVideo } from '@/episodes/types'

/**
 * Per-episode video companion. Lazy: shows a poster with a play button and
 * only mounts the YouTube iframe on click (no third-party JS until then).
 * When no video exists yet, renders a slim "in production" placeholder so the
 * blog + video pairing is visible on every episode.
 */
export default function VideoEmbed({ video, title }: { video?: EpisodeVideo; title: string }) {
  const [playing, setPlaying] = useState(false)

  if (!video) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-md border border-dashed border-sky-500/20 bg-[#070d18] text-slate-500">
        <Film className="w-4 h-4 text-sky-500/60 flex-shrink-0" />
        <span className="text-sm font-body">Video companion — in production.</span>
      </div>
    )
  }

  const thumb = `https://i.ytimg.com/vi/${video.id}/maxresdefault.jpg`
  const embed = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`

  return (
    <div className="rounded-md overflow-hidden border border-sky-500/15 bg-black aspect-video relative">
      {playing ? (
        <iframe
          className="w-full h-full"
          src={embed}
          title={`${title} — video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 w-full h-full"
          aria-label={`Play video: ${title}`}
        >
          <img
            src={thumb}
            alt=""
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-sky-500/90 group-hover:bg-sky-400 transition-colors shadow-lg">
              <Play className="w-7 h-7 text-[#04080f] translate-x-0.5" fill="currentColor" />
            </span>
          </span>
        </button>
      )}
    </div>
  )
}
