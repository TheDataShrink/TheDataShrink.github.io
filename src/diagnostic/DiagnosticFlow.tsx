import { useState } from 'react'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import {
  QUESTIONS,
  LIKERT_LABELS,
  type Question,
} from './questions'
import { computeResult, type LikertResponses, type SituationalResponses, type Result } from './scoring'
import { submitDiagnostic } from '@/lib/email'
import ResultPanel from './ResultPanel'

type Stage = 'questions' | 'email' | 'result'

const ADVANCE_DELAY_MS = 220

export default function DiagnosticFlow() {
  const [stage, setStage] = useState<Stage>('questions')
  const [idx, setIdx] = useState(0)
  const [likert, setLikert] = useState<LikertResponses>({})
  const [situational, setSituational] = useState<SituationalResponses>({})
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [locking, setLocking] = useState(false)

  const total = QUESTIONS.length
  const q: Question = QUESTIONS[idx]
  const progress = Math.round(((idx) / total) * 100)

  const advance = () => {
    if (idx + 1 < total) {
      setIdx(idx + 1)
    } else {
      setStage('email')
    }
    setLocking(false)
  }

  const pickLikert = (value: number) => {
    if (locking) return
    const nextLikert = { ...likert, [q.id]: value }
    setLikert(nextLikert)
    console.log(`[diagnostic] ${q.id} =`, value)
    setLocking(true)
    setTimeout(advance, ADVANCE_DELAY_MS)
  }

  const pickSituational = (choiceId: string) => {
    if (locking) return
    const nextSit = { ...situational, [q.id]: choiceId }
    setSituational(nextSit)
    console.log(`[diagnostic] ${q.id} =`, choiceId)
    setLocking(true)
    setTimeout(advance, ADVANCE_DELAY_MS)
  }

  const back = () => {
    if (idx > 0 && !locking) setIdx(idx - 1)
  }

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const r = computeResult(likert, situational)
    // Show result instantly; submit to backend in parallel (don't block reveal on network)
    setResult(r)
    setStage('result')
    void submitDiagnostic({
      email,
      archetype: r.archetype.id,
      scores: {
        pain: r.scores.pain.score,
        data: r.scores.data.score,
        noise: r.scores.noise.score,
      },
      likert_responses: likert,
      situational_responses: situational,
    })
  }

  if (stage === 'result' && result) {
    return <ResultPanel result={result} email={email} />
  }

  if (stage === 'email') {
    return (
      <div className="card-sky rounded-sm p-6 max-w-xl">
        <div className="label mb-3">FINAL STEP</div>
        <h3 className="font-display font-700 text-xl text-slate-100 mb-2">Where should we send your full report?</h3>
        <p className="text-sm text-slate-400 font-body mb-5">
          Your archetype + dimension scores appear instantly. A full PDF with your 90-day plan lands in your inbox.
          We don&rsquo;t send marketing email loops.
        </p>
        <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleEmailSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@somewhere.com"
            className="flex-1 px-4 py-2.5 rounded-sm font-mono text-sm bg-[#060d18] border border-sky-500/25 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
          />
          <button type="submit" className="btn-primary">
            See my archetype <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
        <p className="mt-4 text-xs font-mono text-slate-600">
          {Object.keys(likert).length} of 24 Likert answered · {Object.keys(situational).length} of 4 situational answered
        </p>
      </div>
    )
  }

  // Questions stage
  return (
    <div className="max-w-2xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-baseline mb-2">
          <span className="label">QUESTION {idx + 1} OF {total}</span>
          <span className="text-xs font-mono text-slate-600">{progress}%</span>
        </div>
        <div className="h-[2px] bg-sky-500/10 rounded">
          <div
            className="h-full bg-sky-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="font-display font-600 text-2xl text-slate-100 leading-snug mb-8">
        {q.prompt}
      </h2>

      {/* Answer options — click auto-advances */}
      {q.kind === 'likert' ? (
        <div className="space-y-2">
          {LIKERT_LABELS.map((label, i) => {
            const selected = likert[q.id] === i
            return (
              <button
                key={i}
                type="button"
                disabled={locking}
                onClick={() => pickLikert(i)}
                className={`w-full text-left px-4 py-3 rounded-sm border transition-colors flex items-center justify-between disabled:cursor-wait ${
                  selected
                    ? 'bg-sky-500/10 border-sky-500 text-slate-100'
                    : 'border-sky-500/15 text-slate-400 hover:border-sky-500/40 hover:text-slate-200'
                }`}
              >
                <span className="text-sm">{label}</span>
                {selected && <Check className="w-4 h-4 text-sky-400" />}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {q.choices.map((c) => {
            const selected = situational[q.id] === c.id
            return (
              <button
                key={c.id}
                type="button"
                disabled={locking}
                onClick={() => pickSituational(c.id)}
                className={`w-full text-left px-4 py-3 rounded-sm border transition-colors flex items-start gap-3 disabled:cursor-wait ${
                  selected
                    ? 'bg-sky-500/10 border-sky-500 text-slate-100'
                    : 'border-sky-500/15 text-slate-400 hover:border-sky-500/40 hover:text-slate-200'
                }`}
              >
                <span className="font-mono text-xs text-sky-500/70 mt-0.5 flex-shrink-0">{c.id}</span>
                <span className="text-sm flex-1">{c.label}</span>
                {selected && <Check className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />}
              </button>
            )
          })}
        </div>
      )}

      {/* Back-only navigation. Forward happens on click. */}
      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={idx === 0 || locking}
          className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-xs font-mono text-slate-600">
          Pick to continue <ArrowRight className="w-3 h-3 inline-block ml-1" />
        </span>
      </div>
    </div>
  )
}
