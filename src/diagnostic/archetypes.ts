// The Data Shrink™ Diagnostic — archetype catalog v1

export type Band = 'low' | 'mid' | 'high'

export type Archetype = {
  id: string
  name: string
  oneLiner: string
  description: string
  plan: { pain: string[]; data: string[]; noise: string[] }
}

export const ARCHETYPES: Record<string, Archetype> = {
  AnxiousAnalyst: {
    id: 'AnxiousAnalyst',
    name: 'The Anxious Analyst',
    oneLiner: 'You’re drowning in AI hype with no architectural ground to stand on.',
    description:
      'You’re 1–4 years into a data career. AI is moving faster than your learning curve and you can feel the gap widening. You don’t need 14 courses; you need one technical depth thread you can defend, three things shipped in 90 days, and zero new tool subscriptions until you finish what’s in front of you.',
    plan: {
      pain: [
        'Write a one-page narrative of where your career goes if AI gets 2× better in 12 months. Read it weekly.',
        'Pick one mentor or peer who has 5+ years on you. Schedule a recurring 30-min monthly check-in.',
        'Cap your daily “AI news” consumption to 15 minutes. Set a timer.',
      ],
      data: [
        'Pick ONE depth thread (SQL/modeling, data engineering, ML/AI, governance, BI). Own it for 90 days.',
        'Ship three concrete pieces of work tied to that thread.',
        'Write a public post about one of them.',
      ],
      noise: [
        'Cut your tool/subscription list to the top 3 you actually use weekly.',
        'Unsubscribe from every newsletter you haven’t opened in the last 30 days.',
        'Cap Slack/email to 3 checks per day for 14 days. Document the difference.',
      ],
    },
  },
  StalledSenior: {
    id: 'StalledSenior',
    name: 'The Stalled Senior',
    oneLiner: 'You know your craft. AI keeps moving it. You haven’t moved with it.',
    description:
      'You have 10+ years of real depth — SQL, modeling, architecture, governance — and you’re watching parts of it become one-prompt work. The grief is real and rarely named. The craft is forking. One fork doesn’t survive. The other does, and it’s closer to your skill set than you think.',
    plan: {
      pain: [
        'Name what you’re grieving. Write it down in three lines.',
        'Identify two skills you have that AI got noticeably worse at this year. Lean into them.',
        'Stop reading vendor blogs. They are the noise pretending to be signal.',
      ],
      data: [
        'Ship one AI-native thing this quarter — RAG over your doc estate, a metadata-driven AI flow, an LLM-augmented review.',
        'Document the architecture choice publicly.',
        'Mentor one junior on what you know that AI can’t cover.',
      ],
      noise: [
        'Pick one technical thread you want to be known for in 24 months. Defend it visibly.',
        'Cancel one recurring meeting that produces no artifact.',
        'Write one decision per month in public. Format: decided / considered / chose-this / revisit-when.',
      ],
    },
  },
  QuietArchitect: {
    id: 'QuietArchitect',
    name: 'The Quiet Architect',
    oneLiner: 'You’re doing the work. Nobody knows. You’re undervalued and you know it.',
    description:
      'High technical depth. High discipline. Low visibility. You make the right calls in design reviews and the wrong people get promoted. This is not a self-promotion problem. It’s a decision-visibility problem, and it has a specific fix.',
    plan: {
      pain: [
        'Acknowledge the cost of invisibility. Quiet excellence is its own career risk.',
        'Find one external peer (outside your org) who can validate the work you ship. Compounding signal.',
        'Stop confusing humility with effacement.',
      ],
      data: [
        'Keep doing what you’re doing. Don’t dilute the depth.',
        'Pick one mid-career engineer in your org and teach them the most important pattern you use.',
        'Submit one piece of your real work to community feedback this quarter.',
      ],
      noise: [
        'Write one decision per month publicly. Template: what you decided, what you considered, why, when to revisit.',
        'Speak first in one meeting per week where you usually wait.',
        'Build a 1-page “what I do” doc and link it from your profile.',
      ],
    },
  },
  AIRefusenik: {
    id: 'AIRefusenik',
    name: 'The AI Refusenik',
    oneLiner: 'You’re resisting AI on principle. The principle is calcifying your career.',
    description:
      'Your skepticism has merit. Some of the most important critiques of AI come from people like you. But there’s a difference between “I disagree with X for these reasons” and “I refuse to engage,” and the second is becoming an identity. Identity calcifies. Careers built on calcified identity get passed over quietly.',
    plan: {
      pain: [
        'Separate “I disagree” from “I won’t engage.” Write both lists.',
        'Notice the difference between a position and a reflex.',
        'Find one AI-skeptic peer who is still engaged. Talk to them monthly.',
      ],
      data: [
        'Use AI on ONE workflow for 14 days. No commitment. Just data.',
        'Document what worked, what didn’t, what surprised you. Public if possible.',
        'Keep your specific technical objections sharp; let go of the diffuse refusal.',
      ],
      noise: [
        'Stop reading takes about AI. Read primary sources only for 30 days.',
        'Pick one specific harm/risk you care about and own it as your beat.',
        'Decline one meeting per week where you’d be the dissenter without leverage.',
      ],
    },
  },
  VendorCapturedManager: {
    id: 'VendorCapturedManager',
    name: 'The Vendor-Captured Manager',
    oneLiner: 'Your stack owns your roadmap. You don’t have a governance spine.',
    description:
      'You’re leading a team or function and your roadmap looks suspiciously like your vendor’s roadmap. That’s not malice; it’s drift. The fix isn’t a new vendor. It’s writing the governance principles BEFORE the next RFP — the principles that let you say no.',
    plan: {
      pain: [
        'Take an honest inventory: which of your last 3 strategic decisions would you have made without your current vendor existing?',
        'Name the political constraint that prevents you from changing the answer.',
        'Find one peer in another org who’s navigated this. Coffee, quarterly.',
      ],
      data: [
        'Write your team’s governance principles in one page before the next vendor decision.',
        'Audit your top 3 vendor contracts for lock-in clauses. Document.',
        'Cancel one recurring vendor demo cycle that’s become routine.',
      ],
      noise: [
        'Block one recurring meeting that’s vendor-driven content delivery.',
        'Stop attending sponsored conferences as a substitute for strategy work.',
        'Replace one vendor newsletter with one operator newsletter.',
      ],
    },
  },
  HypeRider: {
    id: 'HypeRider',
    name: 'The Hype Rider',
    oneLiner: 'You’re chasing every new model. You’ve shipped nothing that compounds.',
    description:
      'Your CV looks busy. So does your GitHub. You’ve touched everything and own nothing. Your tweet game is fine. Your career is treading water because there’s no depth thread to defend. Pick one. Defend it for 90 days. Resist the next shiny.',
    plan: {
      pain: [
        'Acknowledge that breadth has become a coping mechanism.',
        'Look at the last 12 months. Which projects compounded vs. reset?',
        'Notice the dopamine pattern around “new model dropped.”',
      ],
      data: [
        'Pick one model/tool/stack you can defend in deep technical detail.',
        'Build one thing in it that you’d still defend 18 months from now.',
        'Stop posting takes on tools you haven’t shipped with.',
      ],
      noise: [
        'Stop posting hot takes for 30 days. Read, ship, write long.',
        'Limit “tools to try” list to 1 per quarter.',
        'Unfollow 50% of the AI accounts you follow.',
      ],
    },
  },
  QuietlyEffectiveOperator: {
    id: 'QuietlyEffectiveOperator',
    name: 'The Quietly Effective Operator',
    oneLiner: 'You are the target state. We don’t need to shrink much — we need to amplify you.',
    description:
      'High signal. Low noise. Real discipline. You’re where the rest of the archetypes are trying to get. The next move isn’t personal growth — it’s leverage. Teach what you know. Increase your visibility surface. Compound.',
    plan: {
      pain: [
        'Minimal pain. Don’t fabricate any. Keep going.',
        'Find one structural risk you’re carrying (single point of failure on a project, key-person dependence). Plan its mitigation.',
      ],
      data: [
        'Teach what you know. One internal workshop or external talk this quarter.',
        'Mentor one earlier-career operator. Pick someone who would otherwise not get access to you.',
        'Pick one architectural decision in your org that’s wrong and quietly drive its correction.',
      ],
      noise: [
        'Increase visibility deliberately. One post / decision / artifact per month, public.',
        'Take on one project that scales beyond your direct work.',
        'Audit where your time is being captured by lower-leverage work. Negotiate it down.',
      ],
    },
  },
  Drifter: {
    id: 'Drifter',
    name: 'The Drifter',
    oneLiner: 'You’re not in pain yet but you can feel the floor moving.',
    description:
      'No acute symptoms. Just a faint, persistent sense that you’re drifting. This is the worst archetype to be in because the urgency hasn’t arrived. By the time it does, you’ve drifted further than you can comfortably correct. Pick a destination. Even a wrong one. Drift is the disease.',
    plan: {
      pain: [
        'Write down where you want your career to be in 24 months. One paragraph. Even if you’re wrong.',
        'Name what you’re avoiding by drifting.',
        'Find one person who can hold you accountable to a specific 30-day move.',
      ],
      data: [
        'Pick one specific data discipline thread to deepen. Anything is better than continuing to sample.',
        'Ship something — anything — concrete and public within 30 days.',
        'Document one decision per week. Build the habit.',
      ],
      noise: [
        'Do 30 minutes of focused work, 5 times per week, for 4 weeks. Track it.',
        'Eliminate one input that contributes nothing (a newsletter, a Slack, a conference).',
        'Replace passive consumption with one active project for the next month.',
      ],
    },
  },
}

export type ArchetypeId = keyof typeof ARCHETYPES

// One-sentence "do this week" hook — shown above the fold, before the long plan.
// Strict rule: under 25 words, present-tense imperative, ONE action.
export const TLDR: Record<string, string> = {
  AnxiousAnalyst:
    'Pick ONE technical depth thread today. Cancel the rest of your tabs. Ship one small thing in it this week.',
  StalledSenior:
    'Name the part of your craft you’re grieving. Then ship one AI-native thing this quarter, however small.',
  QuietArchitect:
    'Write your last good architectural decision as one public paragraph this week. Decided / considered / chose / revisit.',
  AIRefusenik:
    'Use AI on ONE workflow for 14 days. No commitment. Just data. Document what surprised you.',
  VendorCapturedManager:
    'Write your team’s governance principles on one page before the next vendor decision. This week.',
  HypeRider:
    'Stop posting takes for 30 days. Pick ONE tool you can defend in deep detail and ship something real in it.',
  QuietlyEffectiveOperator:
    'Teach what you know. Pick one internal workshop or one external talk for this quarter and lock the date.',
  Drifter:
    'Write where you want your career to be in 24 months — one paragraph, even if wrong. Then tell one person.',
}
