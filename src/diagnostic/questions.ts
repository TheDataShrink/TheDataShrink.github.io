// The Data Shrink™ Diagnostic — question bank v1
// Source of truth: ../../../TheDataShrink-stockpile/diagnostic/DIAGNOSTIC-SPEC.md

export type Dimension = 'pain' | 'data' | 'noise'

export type LikertQuestion = {
  id: string
  kind: 'likert'
  prompt: string
  dimension: Dimension
  reverse: boolean // true = high-agree means LOW dimension score
}

export type SituationalChoice = { id: string; label: string }
export type SituationalQuestion = {
  id: string
  kind: 'situational'
  prompt: string
  choices: SituationalChoice[]
}

export type Question = LikertQuestion | SituationalQuestion

export const LIKERT_LABELS = [
  'Strongly disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly agree',
] as const

export const QUESTIONS: Question[] = [
  // Pain (8)
  { id: 'Q1',  kind: 'likert', dimension: 'pain', reverse: false,
    prompt: 'When I hear about a new AI model release, my first reaction is anxiety, not curiosity.' },
  { id: 'Q2',  kind: 'likert', dimension: 'pain', reverse: false,
    prompt: 'I sometimes lie awake wondering whether my job will exist in 3 years.' },
  { id: 'Q3',  kind: 'likert', dimension: 'pain', reverse: true,
    prompt: 'I have a clear narrative for how AI fits into my career trajectory.' },
  { id: 'Q4',  kind: 'likert', dimension: 'pain', reverse: false,
    prompt: 'Most weeks, I feel like I’m falling behind even when I’m working hard.' },
  { id: 'Q5',  kind: 'likert', dimension: 'pain', reverse: false,
    prompt: 'When I look at job descriptions in my field, I feel less qualified than I did a year ago.' },
  { id: 'Q6',  kind: 'likert', dimension: 'pain', reverse: true,
    prompt: 'I know what I would learn next if I had a free weekend.' },
  { id: 'Q7',  kind: 'likert', dimension: 'pain', reverse: true,
    prompt: 'I have at least one person I can talk to honestly about my career anxiety.' },
  { id: 'Q8',  kind: 'likert', dimension: 'pain', reverse: true,
    prompt: 'I’d describe my relationship to my current job as “in motion” rather than “stuck.”' },

  // Data (8)
  { id: 'Q9',  kind: 'likert', dimension: 'data', reverse: false,
    prompt: 'I can name the three most important data quality issues in my current org without thinking.' },
  { id: 'Q10', kind: 'likert', dimension: 'data', reverse: false,
    prompt: 'I have, in the last 12 months, deleted or deprecated a meaningful piece of data infrastructure.' },
  { id: 'Q11', kind: 'likert', dimension: 'data', reverse: false,
    prompt: 'When someone asks me “what does this metric mean?”, I can answer without checking the code.' },
  { id: 'Q12', kind: 'likert', dimension: 'data', reverse: false,
    prompt: 'I can explain my org’s data governance model (or lack of one) in under two minutes.' },
  { id: 'Q13', kind: 'likert', dimension: 'data', reverse: false,
    prompt: 'I have shipped at least one piece of work in the last quarter that I’d happily show a stranger.' },
  { id: 'Q14', kind: 'likert', dimension: 'data', reverse: false,
    prompt: 'When I read a vendor pitch, I can usually identify the one technical claim that’s misleading.' },
  { id: 'Q15', kind: 'likert', dimension: 'data', reverse: true,
    prompt: 'If I removed my favorite dashboard tomorrow, fewer than three people would notice.' },
  { id: 'Q16', kind: 'likert', dimension: 'data', reverse: true,
    prompt: 'I trust the data I work with more than I distrust it.' },

  // Noise (8) — note: only 4 written in v1 spec; padding with 4 derived from the framework
  { id: 'Q17', kind: 'likert', dimension: 'noise', reverse: true,
    prompt: 'In a typical week, I spend more time on work that compounds than on work that resets.' },
  { id: 'Q18', kind: 'likert', dimension: 'noise', reverse: true,
    prompt: 'I can name the one project that, if it went well, would change my year.' },
  { id: 'Q19', kind: 'likert', dimension: 'noise', reverse: true,
    prompt: 'Most of my meetings produce a clear decision or artifact.' },
  { id: 'Q20', kind: 'likert', dimension: 'noise', reverse: false,
    prompt: 'I check Slack/email more than 10 times per day.' },
  { id: 'Q20b', kind: 'likert', dimension: 'noise', reverse: false,
    prompt: 'I follow more than 10 newsletters or feeds related to my field.' },
  { id: 'Q20c', kind: 'likert', dimension: 'noise', reverse: true,
    prompt: 'I have written down what I am ignoring this quarter and why.' },
  { id: 'Q20d', kind: 'likert', dimension: 'noise', reverse: false,
    prompt: 'I have started more side projects in the last 12 months than I have finished.' },
  { id: 'Q20e', kind: 'likert', dimension: 'noise', reverse: true,
    prompt: 'When I ship something, I can usually point to the specific decision that made it ship.' },

  // Situational (4 tie-breakers)
  { id: 'Q21', kind: 'situational',
    prompt: 'A new AI tool launches tomorrow that does 80% of your job. Your first move is to:',
    choices: [
      { id: 'A', label: 'Update your CV.' },
      { id: 'B', label: 'Try the tool the same day.' },
      { id: 'C', label: 'Ask your manager what it means for the team.' },
      { id: 'D', label: 'Quietly wait and see.' },
      { id: 'E', label: 'Ignore it.' },
    ]},
  { id: 'Q22', kind: 'situational',
    prompt: 'Your team’s data warehouse has 4,000 tables. You discover ~150 are actively queried. You:',
    choices: [
      { id: 'A', label: 'Propose a deletion project.' },
      { id: 'B', label: 'Build a usage dashboard and present it.' },
      { id: 'C', label: 'Note it and move on.' },
      { id: 'D', label: 'Don’t believe the number.' },
      { id: 'E', label: 'Get permission first, then propose a project.' },
    ]},
  { id: 'Q23', kind: 'situational',
    prompt: 'Your manager asks you to add a metric to the executive dashboard. You think the metric is misleading. You:',
    choices: [
      { id: 'A', label: 'Add it but flag your concern in writing.' },
      { id: 'B', label: 'Refuse and explain.' },
      { id: 'C', label: 'Add it without comment.' },
      { id: 'D', label: 'Add it and add a second metric that contextualizes the first.' },
      { id: 'E', label: 'Schedule a meeting with the executive directly.' },
    ]},
  { id: 'Q24', kind: 'situational',
    prompt: 'You have one free hour per week to invest in yourself. You spend it:',
    choices: [
      { id: 'A', label: 'Reading.' },
      { id: 'B', label: 'Building a side project.' },
      { id: 'C', label: 'Talking to someone more senior.' },
      { id: 'D', label: 'Doing a structured course.' },
      { id: 'E', label: 'Resting — that IS the investment.' },
    ]},
]

export const LIKERT_QUESTIONS = QUESTIONS.filter(
  (q): q is LikertQuestion => q.kind === 'likert',
)
export const SITUATIONAL_QUESTIONS = QUESTIONS.filter(
  (q): q is SituationalQuestion => q.kind === 'situational',
)
