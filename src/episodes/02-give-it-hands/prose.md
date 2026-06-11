# Episode 2 — Give it hands: tools and function calling

*Series: Building an Agent from Scratch. Episode 2 of 12.*

---

## Wanting without doing

If I ask you what you want for dinner and you tell me *pasta with butter*,
that's a thought. It's a very nice thought. But the pasta doesn't arrive
because you said the words. Someone has to fill a pot, light a burner,
salt the water, watch the clock, drain the strainer, melt the butter, find
the parmesan. Without hands, your wanting just stays inside you.

The model we built in [Episode 1](/episodes/01-just-a-prompt) has thoughts. It can produce a five-day
Tokyo itinerary that reads like a careful travel agent wrote it. What it
cannot do is *check the actual weather in Tokyo this week*, or *see whether
the flight it just suggested is still available*, or *book anything*.
It's all wanting, no doing.

This episode is about hands. In our world they're called **tools**, and
the discipline of letting a language model use them is called **function
calling**. It's the smallest change that turns "a chatbot" into something
people are willing to call an agent.

It's also the place where the love-versus-fear posture from [Episode 0](/episodes/00-what-is-an-agent)
shows up most concretely in code. When you give a model tools, you're
deciding *what it's allowed to touch in the world.* You can do that
generously (love: a set of small, orthogonal tools, each well-named,
trusted within its scope) or fearfully (fear: one massive tool with a
hundred flags, locked-down, brittle). Both produce code. Only one
produces an agent that can actually help.

---

## What a tool actually is

Strip away the marketing and a tool is just **a typed function the model
is allowed to ask you to call.**

That's the whole thing. You write a normal function in Python (or any
language). You describe its name, its purpose, and its parameters in a
machine-readable schema. You hand both — the function and the schema —
to the agent. On each turn, the model can either reply with text or
reply with *"please call this function with these arguments."* You
execute the call, hand the result back, and the model continues.

Notice what didn't happen in that description: the model never actually
ran the function. It only *asked.* The execution is yours. The trust
boundary is yours. The audit log is yours. This matters more than any
other architectural detail in agent design, and we'll come back to it
many times. **The model proposes, the program disposes.** Always.

---

## The function-calling protocol

Here's the round-trip in plain language. Five steps.

1. **You** send a normal request to the model — *"plan a trip to Tokyo
   next week"* — and along with the messages you include a list of
   tools the model is allowed to ask for.
2. **The model** decides: either it has enough information to answer,
   in which case it replies with text; or it doesn't, in which case it
   replies with a *tool use* — a structured object that says
   `{"name": "get_weather", "input": {"city": "Tokyo", "date": "next week"}}`.
3. **You** receive that tool-use message. You inspect it. You decide
   whether to actually run it (almost always yes, but not always —
   imagine a `send_email` tool). You run the corresponding Python
   function and capture its return value.
4. **You** send the result back to the model as a *tool result* message,
   continuing the same conversation.
5. **The model** now has the information it needed. It either answers,
   or it asks for another tool, and the loop continues.

When the model decides it has answered the question fully, it replies
with plain text instead of a tool use, and the loop stops.

That loop, repeated, is most of what people mean when they say "agent."
[Episode 5](/episodes/05-the-planning-loop) will make it explicit. For now we'll do exactly one trip
through it, by hand, so you can see every part.

---

## Defining a tool

Let's give our trip planner a weather lookup. In the real world this
calls an API. For this episode we'll mock it — the point is the shape
of the integration, not the integration itself.

```python
# 01-tool-schema.py
def get_weather(city: str, date: str) -> dict:
    """Look up the forecast for a city on a date. Pretend this calls an API."""
    return {"city": city, "date": date, "high_c": 14, "low_c": 7, "summary": "light rain"}
```

That's the function. Now its schema — what we tell the model:

```python
WEATHER_TOOL = {
    "name": "get_weather",
    "description": (
        "Look up the weather forecast for a given city and date. "
        "Use this whenever a plan depends on weather (outdoor activities, "
        "what to pack, indoor backup plans)."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "city": {"type": "string", "description": "City name, e.g. 'Tokyo'."},
            "date": {"type": "string", "description": "ISO date or natural phrase like 'next Tuesday'."},
        },
        "required": ["city", "date"],
    },
}
```

A few things deserve attention here, because they look like
boilerplate but each line is doing real work.

**The name.** It's a verb. `get_weather`, not `weather_service` and not
`WeatherToolHandler`. Models are trained on Python and JavaScript, where
functions are verbs. Naming a tool like a function gets you better
behavior than naming it like a class.

**The description.** It's not for humans. It's for the model. It answers
two questions: *what does this do* and *when should you use it*. The
"when" matters as much as the "what." If you only describe what the
tool does, the model has to guess when to reach for it. If you tell it
when, it reaches at the right moments.

**The input schema.** Standard JSON Schema. Parameter descriptions are
not optional. *"date: ISO date or natural phrase like 'next Tuesday'"*
is the difference between the model passing `"2026-05-25"` and the
model passing `"sometime next week"` and your code blowing up.

You can write all of this by hand. In a real project you'd probably
generate it from your function signatures using something like Pydantic
or `inspect`. For learning, by-hand is better. You see what you're
actually telling the model.

---

## The simplest possible loop

Now we ask the model a question that requires the tool, let it call,
and feed the result back.

```python
# 02-tool-loop.py (excerpt — full file alongside)
import anthropic
from tools import WEATHER_TOOL, get_weather  # the function and its schema

TOOLS = [WEATHER_TOOL]
FUNCTIONS = {"get_weather": get_weather}

def run_with_tools(user_question: str, max_turns: int = 5) -> str:
    client = anthropic.Anthropic()
    messages = [{"role": "user", "content": user_question}]

    for turn in range(max_turns):
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2048,
            tools=TOOLS,
            messages=messages,
        )

        # case 1: the model wants to call a tool
        if response.stop_reason == "tool_use":
            tool_uses = [b for b in response.content if b.type == "tool_use"]
            # record the assistant's tool request
            messages.append({"role": "assistant", "content": response.content})
            # execute each requested tool and append the results
            results = []
            for use in tool_uses:
                fn = FUNCTIONS[use.name]
                output = fn(**use.input)
                results.append({
                    "type": "tool_result",
                    "tool_use_id": use.id,
                    "content": str(output),
                })
            messages.append({"role": "user", "content": results})
            continue

        # case 2: the model is done — return its final text
        text_parts = [b.text for b in response.content if b.type == "text"]
        return "\n".join(text_parts)

    raise RuntimeError(f"agent did not finish within {max_turns} turns")
```

Five things to notice about this loop.

**It is just a `for` loop.** No framework. No "agent runtime." Forty
lines of code wraps the whole thing. You should be suspicious of any
library that wraps this much in five thousand lines of indirection.

**The conversation is mutated in place.** Each turn appends to
`messages`. The model sees the full history every time. That's how it
knows what tools it's already called and what they returned.

**`stop_reason == "tool_use"` is the only fork.** Either the model
wants to call a tool, or it's done. (Other providers use different
names — `tool_calls`, `function_call` — but the shape is identical.)

**Tool calls can come in batches.** A single model response can request
multiple tool calls. Run them all, send all the results back together.

**`max_turns` is a budget.** Without it, a confused model can loop
forever, racking up your bill. *Every* loop in this series will have a
budget. There is no exception.

If you run this with a question like *"Should we bring umbrellas for
our Tokyo trip on May 25?"* you'll see the model decide it needs the
weather, call `get_weather`, get back `{"summary": "light rain"}`, and
then answer in English: *"Yes — light rain is forecast, so pack
compact umbrellas."* That's a real agent moment, in fewer lines than
most React components.

---

## Designing tools the model can actually use

The single most common mistake I see, by a wide margin, is
**designing tools the model can't actually use.** They look fine. They
type-check. They pass tests. The model just won't call them right,
and engineers blame the model.

A father's principle, transferable: **if a child can't follow your
instruction, the instruction is probably wrong, not the child.** Same
here.

Here are the rules I've come to trust.

### Small and orthogonal

One tool per verb. `get_weather` is a tool. `book_flight` is a tool.
`get_weather_and_book_flight_and_check_traffic` is a disaster waiting
to happen.

The model can compose small tools. It cannot reliably decompose big
ones. If you find yourself adding flags — *"set `include_hourly=True`
to also get hourly data"* — that's a sign you've got two tools
pretending to be one. Split them.

### Named for the action, scoped to the noun

`search_hotels`, not `hotel_module`. `send_email`, not `email_helper`.
The name should be answer the question *"what does it do?"* in three
or four words. If you can't, the tool is doing too much.

### One return shape per tool

The output should always have the same structure. Don't return a list
sometimes and a dict other times. Don't return `None` for "not found"
and a string for errors. Pick a shape and stick to it. The model is
much better at reasoning about predictable shapes.

A good convention: every tool returns `{"ok": bool, "data": ..., "error": ...}`.
The model learns this once and uses it everywhere.

### Descriptions that say *when*, not just *what*

I said this above but it bears repeating, because it's the single
biggest lever on whether the model picks the right tool.

Bad:

> `get_weather`: Returns weather data.

Good:

> `get_weather`: Look up the weather forecast for a given city and date.
> Use this whenever a plan depends on weather — outdoor activities,
> what to pack, deciding between indoor and outdoor options.

The good description tells the model not just what the function returns
but in what *situations* it should reach for it. That's the part that
shows up in the model's decisions.

### Errors that explain themselves

When a tool fails, the model is going to read the error message and
decide what to do next. Make the error message *useful to a reader who
doesn't know your codebase.* `{"error": "ValueError"}` is useless.
`{"error": "city 'Tokoy' not found — did you mean 'Tokyo'?"}` lets the
model try again with the right input.

This is honestly one of the easiest cheap wins in agent design.
Spend an hour making your tool errors readable and you'll save days of
agent debugging later.

---

## How tools go wrong

I want to show you three concrete failures, because seeing them
beats reading about them.

The full file `03-bad-tools.py` defines three tools that *look* fine
but confuse the model in different ways. Run it and watch what
happens. The pattern is below.

### Failure 1: overlapping responsibilities

Two tools that could each plausibly answer the question. The model
flips between them or, worse, calls both and then has to reconcile two
different answers.

```python
LOOKUP_PLACE = {"name": "lookup_place", "description": "Find information about a place.", ...}
GET_CITY_INFO = {"name": "get_city_info", "description": "Get city info.", ...}
```

The fix is brutal: delete one of them. *Always* prefer a smaller tool
set with no overlap to a larger tool set with overlap. The model isn't
choosing the wrong tool; you gave it a choice that didn't need to
exist.

### Failure 2: parameters the model has to invent

```python
GET_HOTEL_DEALS = {
    "name": "get_hotel_deals",
    "input_schema": {
        "properties": {
            "city": {"type": "string"},
            "deal_tier": {"type": "string"},  # what values? unclear
        },
    },
}
```

`deal_tier` could be `"budget" | "midrange" | "luxury"`, or it could be
`"silver" | "gold" | "platinum"`, or it could be a star rating. The
model will guess. Sometimes correctly. Often not.

The fix is to constrain the schema:

```python
"deal_tier": {
    "type": "string",
    "enum": ["budget", "midrange", "luxury"],
    "description": "Price tier. Budget: under $100/night. Midrange: $100-300. Luxury: $300+.",
},
```

Now there's no inventing. The model can only pass a value the API
actually accepts.

### Failure 3: tools that don't fail loudly

```python
def search_flights(origin: str, destination: str, date: str) -> list:
    try:
        return _real_search(origin, destination, date)
    except Exception:
        return []   # ← the model now thinks there are zero flights
```

Returning `[]` on error is one of the most expensive bugs you can write
in agent code. The model sees an empty result, accepts it as truth, and
plans around the false fact that no flights exist. It will not retry.
It will not investigate. It will confidently tell the user there are no
flights from Tokyo to Lisbon.

The fix: never silently convert errors to empty results. Let the
exception propagate, or return your `{"ok": false, "error": "..."}`
shape. The model is much better at handling "I tried and it broke than"
than at handling "I tried and got nothing."

---

## Trust boundaries

Now that the model can ask for things to happen in the world, you have
to decide which of those things you're willing to let happen
automatically and which require a human in the loop.

A useful taxonomy, ordered by blast radius:

1. **Read-only, free.** `get_weather`, `search_documents`. Let the model
   call these freely. No confirmation needed.
2. **Read-only, costly.** Anything that costs money per call (paid APIs,
   LLM-as-judge with another model). Cache aggressively. Budget per
   conversation.
3. **Write to internal state.** Adding to the user's draft, updating
   their preferences. Let the model do it, but make sure the user can
   undo.
4. **Write to external state with reversibility.** Creating a calendar
   event, drafting an email. Let the model do it; require explicit
   user-visible confirmation in the UI.
5. **Write to external state without reversibility.** Sending an email,
   making a payment, deleting data. **Require human confirmation
   inside the loop.** No agent should ever do these autonomously
   without a `confirm: true` from a human on the specific action.

I'll be honest: most agent disasters you read about are someone putting
a category-5 action behind a category-1 trust level. Don't be them.

The pattern for category 5 is simple. The "send_email" tool doesn't
send. It returns *"I have drafted this email. The user must confirm
before it sends."* The actual send happens through a different code
path that requires the user to press a button. The model's role is to
*propose*; the user's role is to *dispose*. Same posture as the model
itself: propose, don't impose.

---

## What you have now

If you've worked through this episode, your agent can now:

- Be given a list of tools and choose when to call them.
- Receive tool results and continue reasoning from them.
- Loop until it has enough information, bounded by a budget.

This is, in 2026, what a great many shipped "AI products" actually are.
A prompted LLM with a handful of well-designed tools and a loop with a
budget. Not glamorous. Effective.

What you still don't have:

- **Knowledge from outside the model's training data.** The model can
  ask for the weather, but it can't search your company wiki or your
  database. That's [Episode 3](/episodes/03-rag-from-first-principles) — retrieval.
- **Memory across sessions.** Every conversation starts from zero.
  [Episode 4](/episodes/04-memory).
- **A planning step.** Right now the model picks tools reactively, one
  at a time. Sometimes you want it to lay out a plan first. [Episode 5](/episodes/05-the-planning-loop).
- **Honest evaluation.** Same caveat as last time. Smoke tests catch
  obvious breaks, not subtle regressions. [Episode 6](/episodes/06-evaluation).

A father's pacing reminder: **don't add the next capability until the
current one is solid.** If your tool-using agent occasionally calls the
wrong tool, fixing the tool descriptions will help more than adding a
planner on top. The planner will just plan with the wrong tool faster.

---

## Where we go next

In [Episode 3](/episodes/03-rag-from-first-principles) we teach the agent to read. Specifically: to look things
up in a body of knowledge that isn't in its training data — your
documents, your database, your tickets, your past conversations. We'll
build a small retrieval system from scratch using Postgres and
pgvector. No framework. No magic. Just SQL and embeddings and a tool
the model can call.

By the end of that episode, our trip planner will be able to answer
*"what did we decide about Reykjavik last time we discussed it?"* — a
question that today's version cannot touch, because the answer lives
in our notes, not in the model's head.

— Dad

---

*Code for this episode: `01-tool-schema.py` (a tool and its schema),
`02-tool-loop.py` (the full request → tool-use → result → respond
loop), `03-bad-tools.py` (three deliberately bad tools that show how
the model breaks when tool design is sloppy).*

*Source: Chip Huyen,* AI Engineering, *Chapter 6 §Tools (p278–281) and
§Agent Failure Modes (p298–300). Provider docs to keep open while
working: Anthropic's tool-use guide and OpenAI's function-calling
guide. They differ in syntax, agree in shape.*
