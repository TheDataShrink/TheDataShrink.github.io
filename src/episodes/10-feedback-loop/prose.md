# Episode 10 — The feedback loop: getting better over time

*Series: Building an Agent from Scratch. Episode 10 of 12.*

---

## The agent you ship is your worst agent

I want you to hear me on this: the version of an agent you ship on
day one is the version everyone will remember if you don't improve
it. And the only way to improve it, after the launch, is to listen
to what people actually do with it. Not what they say in surveys.
Not what your eval harness from Episode 6 says (though that's
necessary too). What they *do.*

A father's lesson, hard-won: **the day you stop being curious about
what your kid is actually thinking, you start parenting a person who
isn't there.** Same goes for users. Same goes for the model you put
between yourself and them. The product is a conversation, in both
directions, and it stays alive only as long as the listening
continues.

This episode is about closing that loop. Capturing what users tell
you (directly and indirectly), storing it in a way you can use, and
turning the bad outputs into the next eval fixtures so the agent
literally gets better at the things it most recently got wrong.

---

## The two kinds of feedback

There's the kind users give you on purpose and the kind they give
you without realizing.

**Explicit feedback.** Thumbs up / thumbs down. A *"this was helpful"*
button. A 1–5 rating. A *"flag this response"* link. Users have to
choose to give it; most of them don't. You'll get explicit feedback
from maybe 1–5% of conversations.

**Conversational (implicit) feedback.** What the user *does* in
response to the agent's output. Did they accept the suggestion? Did
they edit it? Did they ask the same thing again, rephrased? Did
they abandon the conversation? Did they regenerate the response?

Conversational feedback is the larger signal, by far. It covers
the 95–99% of conversations that never leave explicit feedback.
It's also harder to interpret — silence can mean *satisfied* or
*gave up*. But the signal is there if you instrument for it.

Both matter. Both should land in the same schema.

---

## A schema that's useful in six months

Most feedback systems are built to look good on launch day and
become useless within a quarter because the schema doesn't support
the questions you eventually want to ask. The schema below is the
result of watching that mistake several times.

```sql
-- 01-feedback-schema.sql
CREATE TABLE IF NOT EXISTS feedback_events (
    id              BIGSERIAL PRIMARY KEY,
    trace_id        TEXT NOT NULL,                  -- ties back to the conversation trace
    message_id      TEXT,                           -- the specific message, if applicable
    user_id         TEXT NOT NULL,
    kind            TEXT NOT NULL CHECK (kind IN (
                        'rating', 'thumbs', 'regenerate',
                        'edit', 'flag', 'abandon', 'accept', 'copy'
                    )),
    value           JSONB,                          -- shape varies by kind
    surface         TEXT NOT NULL,                  -- where in the UI (web, mobile, slack...)
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS feedback_trace_idx ON feedback_events (trace_id);
CREATE INDEX IF NOT EXISTS feedback_user_idx  ON feedback_events (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS feedback_kind_idx  ON feedback_events (kind, created_at DESC);
```

What this lets you ask, that simpler schemas can't:

- *What's the regenerate rate this week, broken down by agent version?*
- *Which kinds of queries get the most "edit" feedback?*
- *What's the trace of every "flag" event in the last 24 hours?*
- *Are users on mobile leaving more thumbs-down than users on web?*

The `value` is JSONB on purpose. A thumbs-down value might be
`{"reason": "wrong info"}`. A rating value might be `{"score": 3}`.
An edit value might be `{"original": "...", "edited": "..."}`.
Forcing all of this into normalized columns ages badly; JSONB lets
the schema evolve.

The `surface` column is the one most often forgotten. Mobile users
behave differently from web users; Slack-embed users differently
from both. Without `surface`, your aggregate numbers lie.

---

## Capturing without being creepy

This is a section I want to be careful about, because the line
between *attentive product* and *surveillance* is real and important.

A few principles:

**Tell users what you collect.** A short, plain-language note in
your privacy policy, and ideally a notice in the UI: *"We log this
conversation to improve the assistant. You can delete it any time."*

**Let users delete.** A working delete endpoint. Not *"contact
support."* A button. When a user deletes a conversation, the
feedback rows for that conversation go with it.

**Don't capture content where intent doesn't require it.** If you
just want to know which kind of query gets the most thumbs-down,
you don't need the message body to compute that. Aggregate first,
inspect specific cases only when needed and with proper access
controls.

**Be honest about what's automated.** *"Your conversation may be
reviewed to improve the system"* should mean something. If a human
reviews it, say so. If an LLM-as-judge reviews it, say so.

A father's principle: **the things you'd be ashamed of doing in the
open, don't do in private either.** That holds for parenting and
product. Especially for product.

---

## Turning feedback into the next eval

This is the trick that, more than anything else in the series,
separates teams that improve and teams that plateau:

**Bad outputs that get explicit negative feedback (or strong
implicit signals like regenerate + edit) should automatically
become candidates for your eval fixture set.**

The pipeline:

1. A user gives thumbs-down (or regenerates twice, or edits the
   response substantially).
2. A nightly job pulls these events, fetches the conversation trace,
   extracts the input that produced the bad output.
3. The input is added to a triage queue.
4. A human reviews each item in the queue. For each: drop it (the
   user was unreasonable), promote it to the eval set (this is a
   real bug), or convert it to a different kind of issue (this
   exposes a missing feature, or a tool change).
5. Promoted items get labelled with the expected behavior and added
   to the fixture set used by the eval harness from Episode 6.
6. The next prompt or model change is required to pass the new
   fixtures before it can ship.

```python
# 02-feedback-to-fixtures.py (excerpt)
def promote_to_fixture(event: FeedbackEvent, expected: dict) -> Fixture:
    trace = load_trace(event.trace_id)
    return Fixture(
        id=f"prod-{event.id}",
        input=trace["initial_input"],
        rubric=infer_rubric_from_feedback(event),
        expected=expected,
        tags={"source": "production_feedback", "kind": event.kind},
    )
```

What this gives you over time:

- The eval set is no longer something you imagined; it's a record of
  what your users actually struggled with.
- Every regression in production becomes a permanent test.
- The team has an objective shared backlog: the fixtures that are
  still failing. Not opinions about what to work on next, but
  evidence.

This is the loop that closes itself. It's the difference between
*we'll improve when we get time* and *we're improving every week,
measurably, on the things users care about most.*

---

## What feedback can't tell you

I want to be honest about the limits.

**Selection bias.** The 1–5% who leave explicit feedback are not
representative of all users. They're disproportionately people
who are very satisfied or very frustrated. The middle is silent.
Triangulate with implicit signals.

**The silent majority.** A working agent might have low explicit
feedback volume because everyone's happy, *or* because everyone's
mildly disappointed and nobody cares enough to complain. The two
look identical at the dashboard level. Periodic user research
(actual conversations with users) is the only honest way to tell
them apart. There is no automated substitute.

**Sycophancy in the feedback loop.** If you train the agent to
*reduce thumbs-down*, you'll get an agent that's better at avoiding
thumbs-down, not necessarily an agent that's more helpful. These
diverge. *"Hedge more"* and *"refuse less"* both reduce thumbs-down
and both reduce usefulness. Watch the value of feedback as a metric,
not as the goal.

**Drift.** Users' expectations change over time. The fixture that
was hard last year is easy now. The bar moves. The eval set has to
move with it, or the agent gets better at passing yesterday's tests
while failing today's needs.

A father's principle: **listen, but don't let the listening replace
the looking.** Feedback tells you about the moments users noticed.
Plenty matters that they don't notice and won't tell you. Stay
curious about both.

---

## A weekly digest

The most useful artifact you can build with the feedback system is
a weekly digest sent to the team:

- New fixtures added to the eval set this week (with source links).
- Regressions: fixtures that previously passed and now fail.
- Top failure buckets (Episode 7 taxonomy) and their trends.
- Top user-reported issues from explicit feedback (themes, not
  individual events).
- Cost trend (Episode 8).
- The four signals (Episode 9): latency, traffic, errors, cost.

Sent at the same time every week. Read by the whole team. Acted on
within two weeks of the issue surfacing. This is how an agent
improves at the pace of a real product.

```python
# 03-feedback-dash.py (excerpt)
def weekly_digest(week_start: date) -> str:
    new_fixtures   = count_fixtures_added(since=week_start)
    regressions    = find_regressions(since=week_start)
    top_buckets    = top_failure_buckets(since=week_start, n=5)
    top_themes     = top_feedback_themes(since=week_start, n=5)
    cost_trend     = cost_per_request_delta(week_start)
    signals        = four_signals(since=week_start)
    return render_template("digest.md", **locals())
```

The template is intentionally markdown. A human reads it. The act
of reading it is the act of staying connected to the work.

---

## What you have now

The agent now has:

- A persistent record of every piece of explicit and implicit
  feedback, in one schema that supports growth.
- A pipeline that turns flagged failures into eval fixtures so
  the agent measurably improves at the things users care about.
- A weekly digest that makes the loop visible to the whole team.
- Explicit user control over what's collected and what's deleted.

This is the loop, closed. The agent is now a system that gets
*systematically* better, week over week, based on real use.

What's still missing:

- For a small fraction of teams: at some point, **finetuning** the
  underlying model on your domain. Almost everyone reaches for this
  too early. The optional Episode 11 is the test for when it's
  actually time.

---

## Where we go next

Episode 11 is optional, and that's not me hedging — it's literally
optional for most readers. We'll cover when finetuning earns its
keep (and the four conditions to verify before you start), why
dataset quality is the real blocker, and what minimal LoRA finetune
looks like in code. If your agent is working, evaluated, cheap, and
listening, you might never need it. That's a happy place to be.

— Dad

---

*Code: `01-feedback-schema.sql` (the tables), `02-feedback-to-fixtures.py`
(promoting bad outputs to permanent eval cases), `03-feedback-dash.py`
(the weekly digest generator).*

*Source: Chip Huyen,* AI Engineering, *Chapter 10 §User Feedback
(p474–490) and §Feedback Limitations (p490). Recommended reading:
"On the Dangers of Stochastic Parrots" (Bender et al., 2021) for the
ethical framing around what we capture and why; the "How Did Your
Users Use Your Product" series of essays from various product-led
companies for practical instrumentation patterns.*
