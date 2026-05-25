# Episode 5 — The planning loop: ReAct, plans, and replanning

*Series: Building an Agent from Scratch. Episode 5 of 12.*

---

## Why a loop, not a chain

When you were learning to tie your shoes, I didn't write you a 14-step
procedure and walk away. I sat next to you. You tried something, it
came out wrong, you looked at me, I said *try the other loop bigger*,
you tried again. Try, look, adjust, try again. That's a loop. It is
how things in the real world actually get learned and done. Almost
nothing important works by following a fixed script.

The first generation of "AI applications" did try to follow fixed
scripts. They were called *chains*. The pattern was: prompt the model,
take its output, feed it into the next prompt, take that output, feed
it into the next, and so on. A pipeline. A `for` loop with the steps
hardcoded.

Chains work for tasks where you know the steps in advance. *Translate
this, then summarize the translation* is a chain. It's fine. It will
work forever.

But most tasks worth building an agent for are *not* like that. The
steps depend on what you find. A trip-planning task might need to
search for flights, find none under budget, decide to look at
neighboring dates, find one that works, then check the weather, then
discover a hotel constraint, then re-plan. You can't write that
script in advance because the script depends on what the world says
back to you.

That's why we need a loop. A loop is **a chain that decides what
its next step is at runtime, based on what just happened.** It is
literally the difference between *narrating to* the world and *talking
with* it. Same fork as Episode 0, in code.

---

## ReAct: the smallest honest planner

The dominant pattern for this loop, and the one that survived three
years of churn, is called **ReAct** — short for *Reasoning + Acting*.
It came out of a paper in 2022 (Yao et al., Princeton/Google). The
idea fits on a postcard:

> On each turn, the model produces a **thought** (what it's thinking),
> then either an **action** (a tool call) or a **final answer.** If it
> took an action, it sees the result as an **observation**, and the
> next turn begins.

That's the whole pattern. Thought, action, observation, repeat. The
"thought" is the part that's new compared to plain tool use: the model
*reasons out loud* before it acts. That out-loud reasoning, weirdly,
makes its actions much better — same effect as Episode 1's "give it
room to think," but applied to every loop iteration.

Modern providers have made this almost transparent. When you use
Claude or GPT with tools, the model emits text and tool-use blocks in
sequence. The text *is* the thought; the tool-use *is* the action;
your code provides the observation. ReAct is now the default. It's
just not always labeled.

What we'll do in this episode is build it ourselves so you see every
line. Then we'll add two things providers don't give you: an
**explicit planner** (for tasks that benefit from laying out the
plan first), and **replanning** (for what to do when the world
contradicts your plan).

---

## ReAct in thirty lines

We already built this in Episode 2. Here it is again, cleaner, with
the thought-action-observation cycle made explicit.

```python
# 01-react.py (excerpt)
def react(question: str, tools, fns, max_steps: int = 8) -> str:
    client = anthropic.Anthropic()
    messages = [{"role": "user", "content": question}]

    for step in range(max_steps):
        resp = client.messages.create(
            model=MODEL, max_tokens=2048, system=SYSTEM,
            tools=tools, messages=messages,
        )

        # the model's "thought" is whatever text it produced this turn
        thoughts = [b.text for b in resp.content if b.type == "text"]
        if thoughts:
            log("thought", thoughts[0])

        if resp.stop_reason == "tool_use":
            # action(s)
            uses = [b for b in resp.content if b.type == "tool_use"]
            messages.append({"role": "assistant", "content": resp.content})

            # observation(s)
            results = []
            for use in uses:
                log("action", f"{use.name}({use.input})")
                output = fns[use.name](**use.input)
                log("observation", str(output)[:200])
                results.append({"type":"tool_result","tool_use_id":use.id,"content":str(output)})
            messages.append({"role": "user", "content": results})
            continue

        # final answer
        return "\n".join(thoughts).strip()

    raise StopBudget(f"reached {max_steps} steps without finishing")
```

The structural difference from Episode 2 is the `log()` calls. They
print the trace of *what the model thought, what it did, what it
saw.* This trace is the single most useful debugging artifact in
agent work. Save it. Look at it. Most "the agent did something weird"
moments resolve themselves the second you read the trace.

A father's diagnostic: **when a system is misbehaving, the first thing
to look at is what it actually saw, not what it should have seen.**
Trace before theory.

---

## What ReAct gets wrong

ReAct is good. It's not enough.

Specifically, the ReAct loop is **reactive** — the clue is in the
name. The model decides the next action based on the last
observation. For simple tasks (look up the weather, summarize a
document, fetch one record) this is fine. For complex tasks (plan a
multi-leg trip with budget, dietary, and weather constraints) it's
weak in two ways:

**It can get lost.** Without an overall plan, each step is local. The
agent can spend ten tool calls exploring a dead end before noticing.

**It can't parallelize.** Each step waits for the previous
observation. *"Get the weather for five cities so I can compare them"*
becomes five sequential calls when it could be one.

The fix for both is the same: **let the model plan first.** Produce
an explicit list of steps, with dependencies between them, and
execute the steps according to the plan. When reality contradicts
the plan, replan.

This pattern has names. *Plan-and-Execute.* *LLMCompiler.* The
specifics vary; the shape is the same.

---

## Plan-then-execute

```python
# 02-plan-execute.py (excerpt)
PLAN_PROMPT = """\
You have the following tools available:
{tool_descriptions}

Produce a JSON plan to answer the user's question. Each step must be
either:
  {{"type": "tool",  "id": "s1", "tool": "name", "input": {{...}},
    "depends_on": []}}
  {{"type": "merge", "id": "s4", "depends_on": ["s1","s2","s3"]}}

Rules:
- Steps with no dependencies will run in parallel.
- A 'merge' step lets you combine results before the next stage.
- Keep the plan short. Use the fewest steps that will answer.

User question: {question}

Return ONLY the JSON plan, no preamble.
"""
```

The model produces a plan that looks like:

```json
{
  "steps": [
    {"type":"tool","id":"s1","tool":"get_weather","input":{"city":"Tokyo","date":"2026-05-28"},"depends_on":[]},
    {"type":"tool","id":"s2","tool":"get_weather","input":{"city":"Kyoto","date":"2026-05-28"},"depends_on":[]},
    {"type":"tool","id":"s3","tool":"get_weather","input":{"city":"Osaka","date":"2026-05-28"},"depends_on":[]},
    {"type":"merge","id":"s4","depends_on":["s1","s2","s3"]}
  ]
}
```

The executor reads the plan, runs steps in topological order, runs
parallelizable steps in parallel, then sends the merged results back
to the model for a final answer.

This is mostly bookkeeping. Forty lines of executor code:

```python
def execute_plan(plan: dict, fns: dict) -> dict:
    results: dict[str, object] = {}
    remaining = list(plan["steps"])
    while remaining:
        ready = [s for s in remaining if all(d in results for d in s["depends_on"])]
        if not ready:
            raise RuntimeError("plan has a dependency cycle")
        # run all ready steps in parallel
        with ThreadPoolExecutor(max_workers=8) as ex:
            futures = {
                ex.submit(_run_step, s, fns, results): s
                for s in ready if s["type"] == "tool"
            }
            for fut in as_completed(futures):
                step = futures[fut]
                results[step["id"]] = fut.result()
        # merge steps are bookkeeping, not work
        for s in ready:
            if s["type"] == "merge":
                results[s["id"]] = {d: results[d] for d in s["depends_on"]}
        for s in ready:
            remaining.remove(s)
    return results
```

If you've worked with build systems (Make, Bazel, anything DAG-shaped),
this is comfortingly familiar. An agent plan is a small DAG. The
executor is a DAG runner. The "AI" part is just that the DAG was
written by a language model instead of a human.

---

## Replanning: what to do when reality says no

The plan is a hypothesis about what will work. Reality often disagrees.
The flight you assumed was available isn't. The hotel you assumed was
within budget is fully booked. The weather you assumed was sunny is a
typhoon. A plan that can't react to these is brittle, and brittle
agents are the ones that fail in the demos most loudly.

The fix is replanning. After each batch of steps executes, ask the
model: *given what we just learned, is the rest of the plan still
right?* If yes, continue. If no, replace the remaining steps with a
new plan.

```python
REPLAN_PROMPT = """\
The original plan is below. The following steps have executed with
these results:
{executed}

Remaining steps from the original plan:
{remaining}

Given the new information, is the remaining plan still correct?
Return JSON:
  {{"decision": "continue"}}                — original plan still good
  {{"decision": "replan", "new_steps": [...]}} — replace the remaining steps
  {{"decision": "done", "answer": "..."}}     — we have enough to answer

Be conservative. Continue unless something has clearly changed.
"""
```

The executor loops: plan, execute a batch, check, maybe replan,
execute again. Until the model says *done* — or we hit the step
budget.

Two practical notes:

**Budgets are not optional.** Every loop has a `max_steps` and a
`max_tokens` and ideally a `max_dollars`. The check happens between
every batch. A planner without a budget is a slot machine.

**Replanning is itself a tool call.** Track its cost. If you're
calling the planner more often than you're calling actual tools, the
plan is fighting the world and you should debug that, not iterate
faster.

---

## Stopping for real

A surprising amount of agent failure is *not stopping when it should
have stopped.* The model keeps going because no condition told it to
end. Termination conditions are part of the design, not an
afterthought.

The conditions I always include:

- **The model declared done.** Final answer in plain text, no tool
  call.
- **Step budget exhausted.** Hard cap. Return whatever partial
  result we have, with an explicit *"didn't finish in budget"* flag.
- **Token budget exhausted.** Same.
- **No progress for N steps.** If the same observations keep coming
  back, the model is spinning. Stop.
- **Confidence check.** Optional: every K steps, ask the model
  *"how confident are you that you're making progress?"* Below a
  threshold, stop and tell the user.

The principle: **an agent that quits cleanly is more useful than one
that keeps trying.** When it quits, the human knows the agent is done
and can take over. When it spins, the human just watches money burn
and trust evaporates.

---

## Putting it all together

The full agent now has all four boxes from Episode 0:

- **Look** — context, memory, retrieval (Episodes 3, 4).
- **Decide** — the prompt and the model (Episode 1), now wrapped in a
  planner that lays out steps (this episode).
- **Act** — tools (Episode 2), now executed in parallel where the plan
  allows.
- **Observe** — tool results flowing back into the loop, with explicit
  replanning when they contradict the plan (this episode).

The trip planner we've been building can now do something genuinely
agent-shaped: take *"plan a 5-day trip to Japan in late May for a
family of four, budget $5000, motion sickness in the youngest"* and:

1. Plan to look up weather for Tokyo, Kyoto, Osaka in parallel.
2. Plan to search hotels under $200/night in each in parallel.
3. Plan to search flights from your home airport in parallel.
4. After observing prices, replan if necessary (drop a city, shift dates).
5. Recall from memory that the family prefers Airbnb to hotels and the
   father can't stand red-eyes.
6. Search the notes from the last Japan trip to avoid repeating
   restaurants the family didn't like.
7. Produce a final, structured plan with citations to specific facts
   and tool results.

That's a real agent. Not in the magazine-cover sense — it can't
*book* anything yet without your confirmation, and it can't operate
for hours unattended — but in the honest sense: it loops, it
chooses, it adjusts, it stops cleanly. From here on the series is
about making this honest agent into a *trustworthy* one. Different
problem. Just as important.

---

## What you have now

The agent now:

- Plans before acting, when planning helps.
- Executes steps in parallel where dependencies allow.
- Replans when reality contradicts the plan.
- Stops cleanly under explicit termination conditions.
- Carries memory across sessions and retrieves relevant facts.
- Cites its sources.

What's still missing:

- **Honest evaluation.** Does it actually work, on average, on the
  cases that matter? You don't know yet. That's Episode 6, the most
  important episode in the series.
- **Failure-mode awareness.** When it goes wrong, *how* does it go
  wrong, and which of those are addressable? Episode 7.
- **Cost discipline.** This agent is now expensive. Making it cheap
  enough to ship is Episode 8.

---

## A small note on frameworks

We built this from scratch with `anthropic`, `psycopg`, and
`ThreadPoolExecutor`. No LangChain, LlamaIndex, AutoGen, or CrewAI.
That was on purpose, for learning.

In a real project, you might choose to use one of those. Some of them
are good. None of them are magic. If you've followed along, you now
know what each of them is doing under the hood, which is the only way
to use them well or to leave them when they hurt more than they help.

A father's bias: **own the loop.** Everything else can be borrowed.

---

## Where we go next

Episode 6 is evaluation. This is the episode that separates real
practitioners from people who built one demo and stopped. We will
build an evaluation harness that can tell you, with confidence
intervals, whether the change you just made to your agent helped or
hurt. We'll use Python and R, and we'll spend most of the episode on
the part that nobody enjoys but everybody pays for if they skip:
*deciding what "good" means before you measure.*

— Dad

---

*Code: `01-react.py` (ReAct loop with tracing), `02-plan-execute.py`
(planner + DAG executor + replanning), `03-budget.py` (termination
conditions and budget enforcement).*

*Source: Chip Huyen,* AI Engineering, *Chapter 6 §Planning (p281–298).
Foundational papers: ReAct (Yao et al., 2022); Plan-and-Execute
(Wang et al., 2023); LLMCompiler (Kim et al., 2023). Read at least
the ReAct paper. It's short.*
