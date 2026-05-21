// The Data Shrink™ Diagnostic — scoring + archetype assignment

import { LIKERT_QUESTIONS, SITUATIONAL_QUESTIONS, type Dimension } from './questions'
import { ARCHETYPES, type Archetype, type ArchetypeId, type Band } from './archetypes'

export type LikertResponses = Record<string, number> // q.id -> 0..4
export type SituationalResponses = Record<string, string> // q.id -> choice id

export type DimensionScore = { dimension: Dimension; raw: number; max: number; score: number; band: Band }

export function scoreDimension(dim: Dimension, responses: LikertResponses): DimensionScore {
  const qs = LIKERT_QUESTIONS.filter(q => q.dimension === dim)
  let raw = 0
  for (const q of qs) {
    const v = responses[q.id] ?? 2 // default to neutral if skipped
    raw += q.reverse ? (4 - v) : v
  }
  const max = qs.length * 4
  const score = Math.round((raw / max) * 100)
  const band: Band = score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low'
  return { dimension: dim, raw, max, score, band }
}

export function scoreAll(responses: LikertResponses) {
  return {
    pain: scoreDimension('pain', responses),
    data: scoreDimension('data', responses),
    noise: scoreDimension('noise', responses),
  }
}

// Situational tie-breaker weights — see DIAGNOSTIC-SPEC §6
const SITUATIONAL_PUSH: Record<string, Record<string, ArchetypeId[]>> = {
  Q21: {
    A: ['AnxiousAnalyst', 'StalledSenior'],
    B: ['HypeRider'],
    C: ['VendorCapturedManager'],
    D: ['Drifter'],
    E: ['AIRefusenik'],
  },
  Q22: {
    A: ['QuietlyEffectiveOperator'],
    B: ['QuietArchitect'],
    C: ['Drifter'],
    D: ['AIRefusenik'],
    E: ['VendorCapturedManager'],
  },
  Q23: {
    A: ['QuietlyEffectiveOperator'],
    B: ['AIRefusenik', 'StalledSenior'],
    C: ['Drifter', 'AnxiousAnalyst'],
    D: ['QuietArchitect'],
    E: ['QuietlyEffectiveOperator', 'HypeRider'],
  },
  Q24: {
    A: ['QuietArchitect', 'StalledSenior'],
    B: ['HypeRider', 'QuietlyEffectiveOperator'],
    C: ['AnxiousAnalyst', 'Drifter'],
    D: ['AnxiousAnalyst', 'VendorCapturedManager'],
    E: ['StalledSenior'],
  },
}

// Candidate archetypes by (Pain, Data, Noise) band triple.
// Multiple candidates allowed; situational tie-breakers decide.
function candidatesFor(pain: Band, data: Band, noise: Band): ArchetypeId[] {
  // High Data + High Noise (low-noise lives = high score; reminder: "Noise" dim score HIGH = signal HIGH)
  if (data === 'high' && noise === 'high' && (pain === 'low' || pain === 'mid')) {
    return pain === 'low' ? ['QuietlyEffectiveOperator'] : ['QuietArchitect']
  }
  if (pain === 'high' && data === 'low') {
    return ['AnxiousAnalyst']
  }
  if (pain === 'high' && (data === 'mid' || data === 'high') && noise === 'low') {
    return ['StalledSenior']
  }
  if (pain === 'mid' && data === 'mid' && noise === 'low') {
    return ['AIRefusenik', 'Drifter']
  }
  if (pain === 'mid' && data === 'low' && (noise === 'low' || noise === 'mid')) {
    return ['VendorCapturedManager', 'HypeRider']
  }
  if (pain === 'low' && data === 'mid') {
    return ['Drifter', 'QuietArchitect']
  }
  // Fallback: pick by dominant pattern
  if (pain === 'high') return ['AnxiousAnalyst', 'StalledSenior']
  if (data === 'high') return ['QuietArchitect']
  if (noise === 'low') return ['Drifter', 'HypeRider']
  return ['Drifter']
}

export type Result = {
  scores: ReturnType<typeof scoreAll>
  archetype: Archetype
  candidates: ArchetypeId[]
  situationalUsed: boolean
}

export function computeResult(
  likert: LikertResponses,
  situational: SituationalResponses,
): Result {
  const scores = scoreAll(likert)
  const candidates = candidatesFor(scores.pain.band, scores.data.band, scores.noise.band)

  let chosen: ArchetypeId
  let situationalUsed = false

  if (candidates.length === 1) {
    chosen = candidates[0]
  } else {
    // Tally situational pushes for each candidate
    const tallies: Record<string, number> = {}
    for (const c of candidates) tallies[c] = 0

    for (const sq of SITUATIONAL_QUESTIONS) {
      const ans = situational[sq.id]
      if (!ans) continue
      const pushed = SITUATIONAL_PUSH[sq.id]?.[ans] ?? []
      for (const pid of pushed) {
        if (pid in tallies) tallies[pid]++
      }
    }

    let best = candidates[0]
    let bestScore = -1
    for (const c of candidates) {
      if (tallies[c] > bestScore) {
        best = c
        bestScore = tallies[c]
      }
    }
    chosen = best
    situationalUsed = true
  }

  return {
    scores,
    archetype: ARCHETYPES[chosen],
    candidates,
    situationalUsed,
  }
}
