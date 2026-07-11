import { Link } from 'react-router-dom'
import { ArrowRight, HeartPulse, Brain, AudioWaveform } from 'lucide-react'

const philosophy = [
  {
    icon: <HeartPulse className="w-4 h-4" />,
    tag: 'A&R',
    title: 'Therapeutic A&R',
    desc: 'We never scouted for hits. We scouted for stories of struggle and resilience — artists chosen for authentic vulnerability and a desire to heal.',
  },
  {
    icon: <Brain className="w-4 h-4" />,
    tag: 'AI',
    title: 'AI-Powered Songwriting',
    desc: 'Proprietary models read the emotional data in journals and interviews, then suggested harmonic structures and lyrical themes that amplified the therapeutic impact. The same instinct now reads spectrum, compliance, and systems.',
  },
  {
    icon: <AudioWaveform className="w-4 h-4" />,
    tag: 'MIX',
    title: 'Sonic Alchemy',
    desc: 'Production tuned to the frequencies, rhythms, and soundscapes known to induce calm, reflection, and catharsis. Signal shaped on purpose — the discipline behind every dashboard since.',
  },
]

const bridge = [
  { from: 'A song', to: 'A semantic model', note: 'Both are structure imposed on raw feeling until it can be understood.' },
  { from: 'A studio session', to: 'A discovery scan', note: 'Listen first. Find the real signal before you touch a single control.' },
  { from: 'A healing frequency', to: 'A clean data pipeline', note: 'Resonance and lineage are the same idea: get the source right and everything downstream settles.' },
]

export default function Origin() {
  return (
    <>
      {/* Hero */}
      <section className="pt-[52px] bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="label mb-5">ORIGIN · THE LABEL</div>
          <h1 className="font-display font-800 text-4xl md:text-5xl text-slate-100 mb-6 leading-[1.1] max-w-3xl">
            Before the data,<br />there was a song.
          </h1>
          <div className="space-y-4 text-slate-400 font-body text-sm leading-relaxed max-w-2xl">
            <p>
              TheDataShrink<span className="text-slate-600">™</span> did not start as a consultancy.
              It started as a record label — a new kind of label, built on one premise:
              <span className="text-slate-200"> music is medicine.</span>
            </p>
            <p>
              We partnered with artists to turn raw human experience into data-driven, therapeutic art.
              The first artist the label produced was <span className="text-slate-200">Doctor&nbsp;Shrink</span>.
              Everything you see today — the spectrum work, the compliance engines, the agentic platform —
              grew out of that studio.
            </p>
            <p className="text-slate-500">
              Because sonic data is still data. This was never just data. It was always data <em>and</em> music.
            </p>
          </div>
        </div>
      </section>

      {/* 01 — The Label */}
      <section className="py-20 bg-grid">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-baseline gap-4 mb-8">
            <span className="font-mono font-600 text-[4rem] text-sky-500/10 leading-none select-none">01</span>
            <div>
              <div className="label mb-1">A NEW KIND OF LABEL</div>
              <h2 className="font-display font-700 text-2xl text-slate-100">Music is medicine.</h2>
            </div>
          </div>
          <p className="text-slate-400 font-body text-sm leading-relaxed max-w-2xl mb-4">
            The philosophy was simple: <span className="text-slate-200">Data Meets Soul.</span> We blended the
            art of music with the science of healing so that every song was not just heard, but felt on a
            deeply therapeutic level. That was the lab where our methods were born.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            {philosophy.map((c) => (
              <div key={c.title} className="card rounded-sm p-6">
                <div className="flex items-center gap-2.5 mb-4 text-sky-400">
                  {c.icon}
                  <span className="label">{c.tag}</span>
                </div>
                <h3 className="font-display font-700 text-sm text-slate-100 mb-2">{c.title}</h3>
                <p className="text-sm text-slate-500 font-body leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — The First Artist */}
      <section className="py-20 bg-[#04080f]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-baseline gap-4 mb-10">
            <span className="font-mono font-600 text-[4rem] text-sky-500/10 leading-none select-none">02</span>
            <div>
              <div className="label mb-1">THE FIRST ARTIST</div>
              <h2 className="font-display font-700 text-2xl text-slate-100">Doctor Shrink</h2>
            </div>
          </div>
          <div className="card-sky rounded-sm p-8 max-w-3xl">
            <div className="label mb-3">ARTIST · VISIONARY · FOUNDER</div>
            <p className="text-slate-300 font-body text-base leading-relaxed mb-4">
              A data scientist who found solace in music after a personal tragedy, Doctor Shrink founded the
              label on a single idea:
              <span className="text-slate-100"> if data can model the world, it can also model the path to healing.</span>
            </p>
            <p className="text-slate-500 font-body text-sm leading-relaxed">
              He pioneered the label's techniques — turning his own journey into the therapeutic anthems that
              became the core of the TheDataShrink<span className="text-slate-600">™</span> sound. The pattern he
              found in grief, he later found in spectrum licences, compliance regimes, and broken data estates.
              Same method. Different medium.
            </p>
          </div>
        </div>
      </section>

      {/* 03 — Sonic data is data */}
      <section className="py-20 bg-grid">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-baseline gap-4 mb-10">
            <span className="font-mono font-600 text-[4rem] text-sky-500/10 leading-none select-none">03</span>
            <div>
              <div className="label mb-1">THE THROUGH-LINE</div>
              <h2 className="font-display font-700 text-2xl text-slate-100">Sonic data is data.</h2>
            </div>
          </div>
          <p className="text-slate-400 font-body text-sm leading-relaxed max-w-2xl mb-10">
            Nothing was thrown away in the pivot — it was translated. The instincts that shaped a song are the
            instincts that shape a system. It is complex, and it was always meant to be: not just data, also music.
          </p>
          <div style={{ border: '1px solid rgba(14,165,233,0.08)', borderRadius: '3px' }}>
            <div className="hidden sm:flex items-center gap-6 px-5 py-2.5 text-xs font-mono text-slate-700"
              style={{ borderBottom: '1px solid rgba(14,165,233,0.07)', background: 'rgba(255,255,255,0.01)' }}>
              <span className="w-44">THEN — THE LABEL</span>
              <span className="w-44">NOW — THE PRACTICE</span>
              <span className="flex-1">WHY IT'S THE SAME</span>
            </div>
            {bridge.map((b, i) => (
              <div key={b.from}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-5 py-4"
                style={{ borderBottom: i < bridge.length - 1 ? '1px solid rgba(14,165,233,0.06)' : 'none' }}>
                <span className="w-44 flex-shrink-0 font-display font-600 text-sm text-slate-300">{b.from}</span>
                <span className="w-44 flex-shrink-0 flex items-center gap-2 font-display font-600 text-sm text-sky-400">
                  <ArrowRight className="w-3 h-3 text-slate-700 sm:hidden" />{b.to}
                </span>
                <span className="flex-1 text-sm text-slate-500 font-body leading-relaxed">{b.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — the school */}
      <section className="py-20 bg-[#04080f]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="rule mb-12" />
          <div className="card-sky rounded-sm p-8 text-center">
            <div className="label mb-4">WHERE THIS IS HEADING</div>
            <h2 className="font-display font-800 text-2xl text-slate-100 mb-4">
              The studio is becoming a school.
            </h2>
            <p className="text-slate-400 font-body text-sm leading-relaxed max-w-xl mx-auto mb-8">
              The label taught songs. The practice teaches the method — how to read the signal in your own
              work and ship the change. That's what we're evolving into now.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/community" className="btn-primary">
                Join the practice <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/episodes" className="btn-outline">
                Read the episodes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
