import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, Calendar, MessageSquare, Award, Youtube } from 'lucide-react'
import { submitWaitlist } from '@/lib/email'

// When YouTube launches, set this to the video ID of the latest "watch first" episode.
// Leave empty to render the placeholder card instead of the embed.
const LATEST_VIDEO_ID = ''

const SKOOL_LIVE = import.meta.env.VITE_SKOOL_LIVE === 'true'
const SKOOL_URL = 'https://www.skool.com/the-data-shrink-practice'

const benefits = [
  {
    icon: <Users className="w-4 h-4" />,
    tag: 'COMMUNITY',
    title: 'Operator-tier peers',
    desc: 'Capped membership. No vendor pitches, no influencer posturing. Sanitized real situations from real teams.',
  },
  {
    icon: <Calendar className="w-4 h-4" />,
    tag: 'LIVE',
    title: 'Weekly live session',
    desc: 'Wednesday clinic, deep-dive, or hot seat. Recorded if you can\'t make it, but live is where most unsticking happens.',
  },
  {
    icon: <MessageSquare className="w-4 h-4" />,
    tag: 'ACCOUNTABILITY',
    title: 'Friday ship thread',
    desc: 'Every Friday: what did you ship this week? Public, specific, low-stakes. The habit is the leverage.',
  },
  {
    icon: <Award className="w-4 h-4" />,
    tag: 'FOUNDERS',
    title: 'Founding-member terms',
    desc: '75 founding seats total — 50 at $49/mo, 25 at $199/mo. Founder pricing is lifetime. Cap fills, price rises.',
  },
]

export default function Community() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <>
      {/* Hero */}
      <section className="pt-[52px] bg-grid">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="label mb-6">THE PRACTICE &nbsp;·&nbsp; FOUNDING-MEMBER WAITLIST</p>
          <h1 className="font-display font-800 text-4xl md:text-5xl text-slate-100 leading-[1.1] mb-6 max-w-3xl">
            A practice for data professionals navigating the AI era.
          </h1>
          <p className="text-slate-400 font-body text-lg leading-relaxed mb-10 max-w-2xl">
            We diagnose. We prescribe. You ship. We repeat. The community opens later this year, capped at 75 founding seats.
            Diagnostic-takers get first access.
          </p>

          <div className="card-sky rounded-sm p-6 max-w-xl">
            {SKOOL_LIVE ? (
              <>
                <div className="label mb-3 text-emerald-400">OPEN NOW</div>
                <h3 className="font-display font-700 text-xl text-slate-100 mb-2">
                  The Practice is live on Skool.
                </h3>
                <p className="text-sm text-slate-400 font-body mb-5">
                  Founder pricing is active until the cap fills. Lifetime founder price; locked at signup.
                </p>
                <a href={SKOOL_URL} target="_blank" rel="noreferrer" className="btn-primary">
                  Join the Practice <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </>
            ) : !submitted ? (
              <>
                <div className="label mb-3">WAITLIST</div>
                <p className="text-sm text-slate-400 font-body mb-5">
                  Drop your email and you&rsquo;ll get the founding-member invite seven days before public open.
                  Diagnostic-takers are prioritized.
                </p>
                <form
                  className="flex flex-col sm:flex-row gap-3"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const data = new FormData(e.currentTarget)
                    const email = String(data.get('email') ?? '')
                    setSubmitted(true)
                    void submitWaitlist(email, 'community-waitlist')
                  }}
                >
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@somewhere.com"
                    className="flex-1 px-4 py-2.5 rounded-sm font-mono text-sm bg-[#060d18] border border-sky-500/25 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
                  />
                  <button type="submit" className="btn-primary">
                    Join the waitlist <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
                <p className="mt-4 text-xs font-mono text-slate-600">
                  Single email only. No marketing loops. Unsubscribe in one click.
                </p>
              </>
            ) : (
              <>
                <div className="label mb-3 text-emerald-400">YOU&rsquo;RE ON THE LIST</div>
                <p className="text-sm text-slate-300 font-body mb-4">
                  We&rsquo;ll email you seven days before the Practice opens. Founding-member invite first; public open after.
                </p>
                <p className="text-sm text-slate-400 font-body">
                  While you wait &mdash; if you haven&rsquo;t already, take the Diagnostic. The founding-member email
                  is prioritized by Diagnostic completion.
                </p>
                <Link to="/diagnostic" className="btn-outline mt-5">
                  Take the Diagnostic <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="py-24 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-10">WHAT&rsquo;S INSIDE THE PRACTICE</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b) => (
              <div key={b.tag} className="card rounded-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-sm bg-sky-500/10 border border-sky-500/15 flex items-center justify-center text-sky-500">
                    {b.icon}
                  </div>
                  <span className="label text-[0.6rem]">{b.tag}</span>
                </div>
                <h3 className="font-display font-700 text-slate-100 text-lg mb-2">{b.title}</h3>
                <p className="text-sm text-slate-500 font-body leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest video / YouTube hub */}
      <section className="py-24 bg-grid">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="label mb-10">FROM THE CHANNEL</div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              {LATEST_VIDEO_ID ? (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute inset-0 w-full h-full rounded-sm border border-sky-500/20"
                    src={`https://www.youtube.com/embed/${LATEST_VIDEO_ID}`}
                    title="The Data Shrink — latest episode"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="terminal rounded-sm p-6 min-h-[280px] flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Youtube className="w-4 h-4 text-sky-500" />
                    <span className="label text-[0.6rem]">PRIVATE BETA &middot; NO PUBLIC VIDEOS YET</span>
                  </div>
                  <p className="text-slate-300 font-mono text-sm leading-relaxed">
                    {'>'} The Data Shrink&trade; YouTube channel goes live with Episodes 1, 2, 3 on Reveal Day.<br />
                    {'>'} Subscribe by joining the waitlist above &mdash; we&rsquo;ll notify you.
                  </p>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-display font-700 text-slate-100 text-xl mb-3">Season 1</h3>
              <p className="text-sm text-slate-500 font-body leading-relaxed mb-5">
                12 episodes. One per week. Pillars rotate: Pain &rarr; Data &rarr; Noise.
                Each episode CTAs back to the Diagnostic; companion essays live on the Resources page.
              </p>
              <ul className="space-y-2 text-sm text-slate-400 font-body">
                <li>&mdash; Ep 1 &middot; <em>Manifesto</em></li>
                <li>&mdash; Ep 2 &middot; <em>Why your data team can&rsquo;t ship</em></li>
                <li>&mdash; Ep 3 &middot; <em>The Diagnostic, explained</em></li>
                <li>&mdash; Ep 4–11 &middot; <em>The eight archetypes &amp; the three pillars</em></li>
                <li>&mdash; Ep 12 &middot; <em>Starting over in data, today</em></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-link to consulting */}
      <section className="py-16 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rule mb-10" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="label mb-2">THE OTHER ARM</div>
              <h2 className="font-display font-700 text-xl text-slate-100 mb-1">
                Need spectrum, compliance, or data-team work?
              </h2>
              <p className="text-slate-500 font-body text-sm">
                The Data Shrink&trade; consulting practice &mdash; AU/NZ telecom operators, spectrum licensing, governance, BI &amp; data.
              </p>
            </div>
            <Link to="/spectrum" className="btn-outline flex-shrink-0">
              View consulting services <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
