import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Share2, Copy, Check } from 'lucide-react'
import type { Result } from './scoring'
import type { Dimension } from './questions'
import { TLDR } from './archetypes'

const DIM_LABEL: Record<Dimension, string> = {
  pain: 'Pain',
  data: 'Data',
  noise: 'Noise',
}

const DIM_NOTE: Record<Dimension, string> = {
  pain: 'High = more career anxiety / overwhelm. Low = settled.',
  data: 'High = strong data discipline. Low = ungoverned drift.',
  noise: 'High = signal-rich, focused. Low = scattered, captured by noise.',
}

function DimensionBar({ label, score, band, note }:
  { label: string; score: number; band: string; note: string }) {
  const color = band === 'high' ? 'bg-emerald-500'
              : band === 'mid' ? 'bg-amber-500'
              : 'bg-red-500/80'
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="font-display font-700 text-sm text-slate-200">{label}</span>
        <span className="font-mono text-sm text-slate-300">{score} <span className="text-slate-600">/ 100</span></span>
      </div>
      <div className="h-2 bg-sky-500/8 rounded">
        <div className={`h-full rounded ${color}`} style={{ width: `${score}%` }} />
      </div>
      <p className="text-xs text-slate-600 font-body mt-1">{note} <span className="font-mono uppercase tracking-wider text-slate-700">band: {band}</span></p>
    </div>
  )
}

export default function ResultPanel({ result, email }: { result: Result; email: string }) {
  const { scores, archetype, situationalUsed } = result
  const dims: Dimension[] = ['pain', 'data', 'noise']
  const [copied, setCopied] = useState(false)

  const aiPrompt = [
    `I just took a career diagnostic for data professionals. My result:`,
    ``,
    `Archetype: ${archetype.name}`,
    `Tagline: "${archetype.oneLiner}"`,
    ``,
    `Dimension scores (0-100):`,
    `- Pain (career anxiety / AI overwhelm): ${scores.pain.score} — band: ${scores.pain.band}`,
    `- Data (technical discipline & governance): ${scores.data.score} — band: ${scores.data.band}`,
    `- Noise (signal vs distraction): ${scores.noise.score} — band: ${scores.noise.band}`,
    ``,
    `What I want from you for the next 30 minutes:`,
    `1. Ask me 3 short questions to understand my specific role, org, current stack, and what frustrated me most last week.`,
    `2. Based on my answers, propose ONE concrete action I can take this week — under 30 minutes of effort, no new tools required.`,
    `3. Be specific. No platitudes. No generic career advice. If I push back, push back harder.`,
    `4. End by writing the exact words I should say to my manager (or peer, or LinkedIn) to commit to the action publicly.`,
    ``,
    `Start now with question 1.`,
  ].join('\n')

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(aiPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      alert('Copy failed. Select the text and copy manually.')
    }
  }

  return (
    <div className="space-y-12 max-w-3xl">
      {/* Header */}
      <div>
        <div className="label mb-3 text-emerald-400">DIAGNOSIS COMPLETE</div>
        <h1 className="font-display font-800 text-3xl md:text-4xl text-slate-100 leading-[1.1]">
          You are <span className="text-sky-400">{archetype.name}</span>.
        </h1>
        <p className="mt-4 text-lg text-slate-300 font-body italic max-w-2xl">&ldquo;{archetype.oneLiner}&rdquo;</p>
        {situationalUsed && (
          <p className="mt-3 text-xs font-mono text-slate-600">
            Tie-breaker: your situational answers resolved this from {result.candidates.length} candidate archetypes.
          </p>
        )}
      </div>

      {/* TL;DR — read this even if you read nothing else */}
      <div className="card-sky rounded-sm p-6">
        <div className="label mb-3">YOUR ONE MOVE THIS WEEK</div>
        <p className="font-display font-600 text-xl text-slate-100 leading-snug">
          {TLDR[archetype.id]}
        </p>
        <p className="mt-3 text-xs font-mono text-slate-600">
          Read nothing else on this page. Do this. The rest is here when you have time.
        </p>
      </div>

      {/* Paste-into-AI prompt — turns the diagnosis into a coaching session */}
      <div className="card rounded-sm p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="label mb-2">PASTE THIS INTO YOUR AI</div>
            <h3 className="font-display font-700 text-lg text-slate-100 leading-snug">
              30 minutes with ChatGPT, Claude, or Gemini turns this diagnosis into a plan for <em>you</em>.
            </h3>
          </div>
          <button
            type="button"
            onClick={copyPrompt}
            className="btn-outline flex-shrink-0"
            aria-label="Copy prompt"
          >
            {copied ? (
              <><Check className="w-3.5 h-3.5" /> Copied</>
            ) : (
              <><Copy className="w-3.5 h-3.5" /> Copy prompt</>
            )}
          </button>
        </div>
        <pre className="terminal rounded-sm p-4 text-[0.78rem] leading-relaxed text-slate-300 whitespace-pre-wrap overflow-x-auto">
{aiPrompt}
        </pre>
        <p className="mt-4 text-xs font-mono text-slate-600">
          Paste it into whatever AI you already use. It&rsquo;ll interview you, then prescribe one specific action. Works best on a model with strong reasoning (Claude Opus, GPT-5, Gemini 2.5 Pro).
        </p>
      </div>

      {/* Dimension bars */}
      <div className="card rounded-sm p-6 space-y-5">
        <div className="label">YOUR DIMENSION SCORES</div>
        {dims.map(d => (
          <DimensionBar
            key={d}
            label={DIM_LABEL[d]}
            score={scores[d].score}
            band={scores[d].band}
            note={DIM_NOTE[d]}
          />
        ))}
      </div>

      {/* Description */}
      <div>
        <div className="label mb-3">WHAT THIS ARCHETYPE LOOKS LIKE</div>
        <p className="text-slate-300 font-body leading-relaxed">{archetype.description}</p>
      </div>

      {/* 90-day plan */}
      <div>
        <div className="label mb-5">YOUR 90-DAY SHRINK PLAN</div>
        <div className="space-y-6">
          <div className="card rounded-sm p-5">
            <div className="font-display font-700 text-sm text-slate-100 mb-3">
              Days 0–30 &middot; Shrink the pain
            </div>
            <ul className="space-y-2.5">
              {archetype.plan.pain.map((p, i) => (
                <li key={i} className="text-sm text-slate-400 font-body flex gap-3">
                  <span className="text-sky-500/70 font-mono">{(i + 1).toString().padStart(2, '0')}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card rounded-sm p-5">
            <div className="font-display font-700 text-sm text-slate-100 mb-3">
              Days 31–60 &middot; Shrink the data
            </div>
            <ul className="space-y-2.5">
              {archetype.plan.data.map((p, i) => (
                <li key={i} className="text-sm text-slate-400 font-body flex gap-3">
                  <span className="text-sky-500/70 font-mono">{(i + 1).toString().padStart(2, '0')}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card rounded-sm p-5">
            <div className="font-display font-700 text-sm text-slate-100 mb-3">
              Days 61–90 &middot; Shrink the noise
            </div>
            <ul className="space-y-2.5">
              {archetype.plan.noise.map((p, i) => (
                <li key={i} className="text-sm text-slate-400 font-body flex gap-3">
                  <span className="text-sky-500/70 font-mono">{(i + 1).toString().padStart(2, '0')}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Next step */}
      <div className="card-sky rounded-sm p-6">
        <div className="label mb-3">WHAT&rsquo;S NEXT</div>
        <h2 className="font-display font-700 text-xl text-slate-100 mb-2">
          The community opens later this year.
        </h2>
        <p className="text-sm text-slate-400 font-body mb-5 max-w-xl">
          Founding-member access is capped at 50 seats and goes to the warmest of the email list first. We&rsquo;ll send your full PDF report to <span className="font-mono text-sky-400">{email || 'your inbox'}</span> and a single invite when the community opens. Nothing else.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-outline"
            onClick={() => {
              const text = `I'm ${archetype.name} on the Data Shrink Diagnostic. What are you?`
              if (navigator.share) {
                navigator.share({ text }).catch(() => undefined)
              } else {
                navigator.clipboard.writeText(text).catch(() => undefined)
                alert('Copied to clipboard.')
              }
            }}
          >
            <Share2 className="w-3.5 h-3.5" /> Share my result
          </button>
          <Link to="/resources" className="btn-ghost">
            Other resources <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Honest footer */}
      <div className="rule pt-6 text-xs text-slate-600 font-mono leading-relaxed max-w-2xl">
        The Diagnostic is in private beta. Scoring rubric and archetype assignment are v1 and will be tuned as more data comes in.
        Your responses are stored only for follow-up and product improvement; never sold.
      </div>
    </div>
  )
}
