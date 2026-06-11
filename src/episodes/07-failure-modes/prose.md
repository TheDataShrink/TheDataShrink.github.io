# Episode 7 — When agents go wrong: a failure-mode taxonomy

*Series: Building an Agent from Scratch. Episode 7 of 12.*

---

## "The agent is bad" is never the diagnosis

When you were learning to read and a sentence stumped you, *bad
reader* was never the answer. The answer was always more specific:
*you skipped a word*, *you confused two letters that look alike*,
*the sentence had a name you'd never seen*, *your eyes were tired*.
Each of these has a different fix. Calling it *bad reading* would
have helped neither of us.

It's the same with agents. When an agent fails, *the agent is bad*
is almost never the diagnosis. There are about five recurring shapes,
and naming the shape is most of the fix. If you can't name the
shape, you'll patch a symptom and the failure will return wearing a
different mask.

This is a short episode. The taxonomy is the whole point. Carry it
with you and re-read traces through it.

A father's principle: **name the shape before you reach for the
medicine.** A cough is not a diagnosis. *"My agent failed"* is the
same — it's a symptom, not a problem. The five shapes below are the
problems.

---

## The five shapes

After watching a lot of agents go wrong — your own, and many that
weren't yours — almost every failure I've seen sorts into one of
five buckets.

### 1. Planning failure

The agent picked the wrong overall approach. It went left when it
should have gone right. The individual steps all worked; the
strategy was wrong.

*Looks like:* the trace is clean. Each tool call succeeds. The final
answer is confidently wrong because the agent solved the wrong
problem.

*Often caused by:* missing context (the agent didn't know X), a
confusing system prompt (multiple objectives, no priority order),
or a question that's genuinely ambiguous and the agent guessed.

*Fixes that work:* clarify the system prompt. Make priorities
explicit (*"if the user's request conflicts with their stated
preferences, ask before proceeding"*). Add an upfront
clarification step for ambiguous inputs. Improve the planner's
context window with retrieval ([Episode 3](/episodes/03-rag-from-first-principles)) and memory ([Episode 4](/episodes/04-memory)).

*Fixes that don't work:* retraining the model. Adding more tools.
Switching frameworks. The plan was wrong; none of those address
that.

### 2. Tool failure

The agent picked the right tool with the wrong arguments, or the
right approach with a tool that's broken or misused.

*Looks like:* the trace shows a tool call that returned an error,
or returned something the model couldn't interpret. The next step
either ignores the result or invents one.

*Often caused by:* sloppy tool schemas ([Episode 2](/episodes/02-give-it-hands)), parameters that
require the model to invent values, tools that silently return `[]`
on error, or tools whose semantics differ from their names.

*Fixes that work:* tighter input schemas with enums and parameter
descriptions. Loud, descriptive errors with hints. Renaming tools to
match what they actually do. Splitting one tool into two.

*Fixes that don't work:* telling the model "use the tool more
carefully." The model's behavior follows the interface; the
interface needs to be honest.

### 3. Perception failure

The agent received a tool result and *misread it.* The fact was
there; the model interpreted it wrong.

*Looks like:* the observation in the trace clearly contains the
right answer; the next thought misrepresents it.

*Often caused by:* tool outputs that are too verbose, ambiguously
structured, or that bury the relevant fact in noise. Outputs that
use jargon the model doesn't understand. Outputs that vary in shape
between calls.

*Fixes that work:* design tool outputs for the model, not for
humans. Lead with the most important field. Use consistent keys.
Strip noise before returning. If a result needs context (*"this is
in JPY, not USD"*), include the context in the result.

*Fixes that don't work:* prompting the model to "read the output
carefully." It is reading it carefully. The output is misleading.

### 4. Memory failure

The agent forgot or misremembered something it had access to.

*Looks like:* the agent asks a question whose answer is two turns
back, or contradicts a fact from earlier in the conversation, or
ignores a stored preference it should have retrieved.

*Often caused by:* a context window that's overflowed silently, a
summary that dropped the important detail, a fact store that
retrieved the wrong facts because the query embedding didn't match
the fact embedding.

*Fixes that work:* dedicated tests for memory recall (the user
states X at turn 3; check that X influences a decision at turn 8).
Tune the summary prompt to preserve specifics. Tune retrieval for
the fact store with the same recall@k discipline as [Episode 3](/episodes/03-rag-from-first-principles).

*Fixes that don't work:* increasing the context window size.
Sometimes helps, often masks the underlying issue.

### 5. Termination failure

The agent didn't stop when it should have, or stopped when it
shouldn't have.

*Looks like:* an agent that loops past the obvious answer, calling
tools to "verify" what it already knows. Or one that quits with
*"I don't have enough information"* when it absolutely does.

*Often caused by:* missing stopping conditions, no step budget, a
system prompt that incentivizes continued effort over decisive
answers, or replanning logic that's too eager to replan.

*Fixes that work:* the budget discipline from [Episode 5](/episodes/05-the-planning-loop) (every
loop, hard caps). Explicit stopping criteria in the system prompt:
*"Stop and answer when you have enough information for a useful
response."* For premature stops: a prompt that gives the model
permission to make reasonable assumptions when data is missing.

*Fixes that don't work:* trusting the model to "know when to stop."
Sometimes it does. Often it doesn't. The budget is non-negotiable.

---

## How to use the taxonomy

When you watch a bad trace, walk it through these questions in
order:

1. **Was the strategy right?** If no, it's a *planning* failure.
2. **Did each tool call work?** If no, it's a *tool* failure.
3. **Did the agent correctly understand the tool results?** If no,
   it's a *perception* failure.
4. **Did the agent use everything it should have known?** If no,
   it's a *memory* failure.
5. **Did the agent stop at the right moment?** If no, it's a
   *termination* failure.

Multiple buckets can apply at once. That's fine. Pick the one
*earliest* in the list — if planning was wrong, tools couldn't
have saved the run, so fixing tools first is wasted effort.

A father's principle: **upstream fixes are cheaper than downstream
ones.** A bad plan poisons every step after it. Fix planning first
whenever it's in play.

---

## The frequency you'll see

In my experience, on production agents that have made it past the
demo stage, the rough distribution is:

- **Tool failures: ~35%.** Most common, most addressable. The good
  news.
- **Perception failures: ~25%.** Underdiagnosed. Most engineers
  jump to "model isn't smart enough" when the real culprit is a
  tool output the model can't parse.
- **Planning failures: ~20%.** Concentrated on hard, ambiguous, or
  multi-step queries.
- **Memory failures: ~15%.** Concentrated on long conversations and
  multi-session users.
- **Termination failures: ~5%.** Rare if budgets are set, common
  and expensive if they aren't.

These numbers are not from a benchmark; they're a working estimate.
Your distribution will be different. The point of measuring is to
know what *your* distribution actually is, because where you spend
fix-time should follow it.

The D3 visualization in `01-failure-treemap.html` shows a treemap of
failure modes from a hypothetical run set. Replace the data with
your own to see your distribution. The visualization is intentional:
a bar chart hides which bucket is dominant; a treemap makes the
dominant rectangle impossible to ignore.

---

## Building a failure log

The single highest-leverage practice in this episode: **for every
failure you encounter, log it with its taxonomy bucket.**

```python
# 02-classify.py (excerpt)
@dataclass
class FailureRecord:
    trace_id: str
    user_query: str
    final_output: str
    bucket: Literal["planning","tool","perception","memory","termination"]
    diagnosis: str            # one sentence
    fix_attempted: str | None = None
    fixed_at: datetime | None = None
```

A spreadsheet works. A Postgres table is better. A dashboard that
shows the bucket counts trending over time is best.

Two things will happen if you keep this log:

1. **Patterns emerge.** You'll notice that 60% of your tool failures
   are the same tool. That tool needs work, not the model.
2. **Fixes get measured.** When you change something, the failure
   rate in that bucket should drop. If it doesn't, the change didn't
   actually address the cause; back out and try again.

This is the failure-mode equivalent of an issue tracker. It is
worth its weight in code.

---

## What you have now

The agent now has:

- A vocabulary for talking about *what specifically* goes wrong
  rather than handwaving about "the agent."
- A practice for logging failures by bucket.
- A clear order of operations for fixing them.

What's still missing:

- **Cost discipline.** Even a working, well-evaluated agent can be
  too expensive to ship. [Episode 8](/episodes/08-cheap-and-fast).
- **Production-shape guardrails and observability.** What sits
  around the agent in real deployments. [Episode 9](/episodes/09-guardrails-gateway-observability).
- **A feedback loop with users.** How the agent gets better after
  it ships. [Episode 10](/episodes/10-feedback-loop).

---

## Where we go next

[Episode 8](/episodes/08-cheap-and-fast) is about making the agent cheap and fast. Right now our
agent makes many model calls per user request, hits the most
capable model for everything, and re-does work it's already done.
Each of those is a cost lever. Pulling them right turns a $0.40
per-request agent into a $0.04 one, with the same quality on the
hard cases — that's the whole game.

— Dad

---

*Code: `01-failure-treemap.html` (D3 treemap of a hypothetical
failure distribution — swap the data for your own), `02-classify.py`
(skeleton of a failure-classification log with the taxonomy fields).*

*Source: Chip Huyen,* AI Engineering, *Chapter 6 §Agent Failure
Modes (p298–300). Recommended reading: "Why You Need Evals" — a
recurring theme on production LLM blogs; every team that's been
burned writes some version of it.*
