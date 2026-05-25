# Episode 8 — Cheap and fast: inference, caching, routing

*Series: Building an Agent from Scratch. Episode 8 of 12.*

---

## The cost no one warns you about

The first time you put a real agent in front of real users, you'll
notice something the demos never show: each conversation costs money.
Not a lot, individually. A few cents. But cents add up. A modestly
successful product — ten thousand users, five conversations a day, ten
turns a conversation — is half a million model calls a day. At a
nickel a call, that's twenty-five thousand dollars a day in inference.
A year of that buys a house.

The shrugged answer is *"models will get cheaper."* They will. They
have. They still cost money. And the price of model usage drops slower
than the urge to use models more — your users' next request always
wants a smarter model, a longer context, an extra tool call. Cost
discipline is not an end-state to wait for; it's a permanent
practice.

A father's principle, from a different domain: **the things you don't
think about while you're rich are the things that bankrupt you when
you're not.** Build the cost-awareness in early, when the bills are
small. By the time they're big, the architecture either supports
cheapness or it doesn't, and rewiring after the fact is much harder
than building it in.

---

## Where the money actually goes

Three numbers explain almost every model bill you'll ever see:

- **Input tokens** — what you send. Charged per million. Generally
  cheaper than output.
- **Output tokens** — what you get back. Charged per million.
  Generally more expensive (2x–5x input). Often the larger of the
  two on tool-using agents.
- **Number of calls** — multiplicative with both above. Every loop
  iteration is another call.

Pricing varies by provider and model, and changes often. The shape
doesn't. Three actionable levers:

1. **Send fewer tokens.** Trim system prompts, summarize history,
   strip tool outputs.
2. **Receive fewer tokens.** Constrain output length, ask for
   structured output, stop generating when the answer is complete.
3. **Make fewer calls.** Cache. Batch. Parallelize across user
   requests (not within — that doesn't help cost).

A fourth lever cuts across all three: **use a cheaper model when a
cheaper model is enough.** Most queries are routine. Most agents use
the most powerful model for every step. That's the easiest single fix
in this whole episode.

---

## The three caches that matter

Caching in agent systems isn't one thing. It's three things at three
different layers. Each catches a different kind of repetition.

### 1. Prompt caching (provider-level)

Most providers now offer **prompt caching**: if your prompt starts
with the same long prefix as a previous call (system prompt, tool
definitions, large reference document), the provider charges you a
small fraction of the cost for the cached portion. Anthropic and
OpenAI both support this in 2026.

This is free money for agents. Your system prompt and tool
definitions are 1000+ tokens and they're identical on every call.
Cache them. The setup is one extra field in the API call:

```python
response = client.messages.create(
    model=MODEL,
    system=[{
        "type": "text",
        "text": LONG_SYSTEM_PROMPT,
        "cache_control": {"type": "ephemeral"},   # cache this prefix
    }],
    tools=TOOLS,
    messages=messages,
)
```

In a tool-using agent where the system + tools take ~2000 tokens and
you make 8 calls per conversation, prompt caching cuts input cost by
roughly 90% on calls 2–8. That's a typical 60% reduction in total
input cost across the conversation. For one config change.

### 2. Semantic caching (application-level)

Many user questions are semantically the same as ones you've answered
before. *"What's the weather in Tokyo?"* and *"How's the Tokyo
forecast?"* should retrieve the same cached answer, even though the
strings differ.

Pattern: embed each incoming question. Look up in a small store of
prior questions. If the cosine similarity to a prior question is
above some threshold (0.95 is a safe start), return the cached
answer instead of running the agent.

```python
# 02-semantic-cache.py (excerpt)
def maybe_cached(query: str, threshold: float = 0.95) -> str | None:
    qvec = embed(query)
    hit = nearest_neighbor(qvec, table="query_cache")
    if hit and hit.similarity >= threshold and not_stale(hit):
        return hit.answer
    return None
```

Tradeoffs:

- **Tighter threshold** → fewer hits, lower risk of returning a
  wrong answer for a subtly different question.
- **Looser threshold** → more hits, more risk.
- **TTL matters.** A weather answer is good for an hour. A
  policy answer might be good for a month. Vary by query category.

Semantic caching is most effective on read-heavy, repeat-query
workloads (search, FAQs, customer support). Less effective on
exploratory work (each conversation is unique).

### 3. Result caching (function-level)

The cheapest cache, and the one most often forgotten: just memoize
your tools. If `get_weather("Tokyo", "2026-05-28")` was called five
minutes ago, don't call the API again — use the result.

```python
@cached(ttl=600)
def get_weather(city: str, date: str) -> dict:
    ...
```

Trivial. Adds a few lines. Often eliminates 30–50% of tool-call
volume in production, because agents redundantly look up the same
information across replans and retries.

---

## Model routing

The single highest-leverage cost lever: **send routine requests to a
cheap model; escalate hard ones to a smart model.**

The shape:

```python
# 03-router.py (excerpt)
def route(query: str) -> str:
    if is_simple(query):
        return CHEAP_MODEL          # ~$0.001/1k output tokens
    return SMART_MODEL              # ~$0.015/1k output tokens
```

The hard question is `is_simple(query)`. Options, in increasing
sophistication:

**Rule-based.** Short queries, queries matching certain patterns,
queries with no tool requirements → cheap. Everything else → smart.
Trivial to implement. Catches the easy wins. Misses subtleties.

**Classifier-based.** A tiny model (or your cheap model with a
classification prompt) decides which tier the query needs. Cheap
queries pay one extra small model call; smart queries pay the
classifier plus the smart model. The classifier itself needs to be
fast and reliable; if it isn't, you've made everything slower.

**Confidence-based escalation.** Always start on the cheap model. If
the cheap model's response is low-confidence (it says it doesn't
know, the answer fails a validation check, a subsequent step looks
bad), retry on the smart model. Pays smart-model price only when
needed. Pays cheap-model price first, always.

The third pattern is what most production systems converge on,
because it auto-tunes: easy queries pay only cheap-model price, hard
queries pay slightly more than smart-model price (cheap + smart), and
the mix follows the actual workload.

A father's principle: **don't use the good knife for the easy job.**
You wouldn't open a cardboard box with the chef's knife. Don't route
*"is it raining?"* to your largest model.

---

## The latency problem (and the streaming trick)

Cost is one axis; latency is the other. Users tolerate cost — they
don't see it. They don't tolerate waiting. Three seconds of silence
is forever in a chat interface.

The hard truth about LLM latency: the model fundamentally takes
hundreds of milliseconds to start producing output, and tens of
milliseconds per token after that. A 500-token answer is 5–10 seconds
end-to-end. There's no magic that makes this go away.

There is a UX trick that hides it: **streaming.** Start showing tokens
the moment they arrive. The user sees the answer appearing in real
time, the way a person types. Subjectively this is much faster than
waiting 10 seconds for a finished response, even though the total time
is identical.

```python
with client.messages.stream(...) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

Stream by default. Even for short responses. The difference in
perceived quality is large and the implementation cost is small.

For multi-step agents, streaming gets harder — you might be on step 3
of 8 and have nothing visible to show. The pattern that works:
stream *intermediate state* as well as final output. *"Looking up
flights..."*, *"Comparing options..."*, *"Drafting your itinerary..."*
Even if the strings are templated and not from the model, they
keep the user oriented. Honest narration of where the agent is.

---

## The Pareto curve

Most cost/latency optimizations are tradeoffs. Faster usually costs
more. Cheaper usually means slower or less accurate. But not always
— sometimes a change moves you toward the upper-left of the
cost-accuracy plane (cheaper *and* better). Those are the wins.

The D3 visualization in `04-pareto.html` is interactive: each point
is a configuration of (model, caching strategy, routing logic). The
axes are average cost per request and average response time. The
upper-left is good. The lower-right is the budget version of bad.
Hover for the config; the Pareto-optimal frontier is highlighted.

The discipline: when you're considering a change, plot it on this
plane against the alternatives. If the new config is strictly
dominated by an existing one (slower *and* more expensive *and* not
better), don't ship it. Sounds obvious. Easily forgotten under
deadline pressure.

A father's principle: **draw the picture before you choose.** The
plot reveals which trade-offs are real and which are a bad config
masquerading as a tough call.

---

## Putting it all together: realistic numbers

A trip-planning agent before optimization:

- 8 turns per conversation, average.
- Smart model on every turn.
- No caching of any kind.
- System prompt + tools = ~2000 tokens.
- User context per turn ≈ 500 tokens, output ≈ 600 tokens.

Per-conversation cost (Sonnet-class pricing): about **$0.42**.

After applying this episode's techniques:

- Prompt caching: input cost on calls 2–8 cuts by ~90%.
- Tool memoization: ~40% fewer tool calls and their associated model
  follow-ups → effectively ~5 turns instead of 8.
- Routing: 70% of conversations are "simple" enough for the cheap
  model after a first-pass classifier. Smart model only on the
  remaining 30%.
- Semantic cache: ~15% of queries hit the cache outright, paying
  nothing.

Per-conversation cost: about **$0.04**. An order of magnitude.

Quality (measured with Episode 6's harness): essentially unchanged.
A little better on simple queries because the cheap model is more
decisive; a little worse on the edge cases where the cheap model
was tried first and the smart model had to be asked to retry —
mostly invisible in the aggregate.

This is the goal: substantial cost reduction with no quality
regression. It requires all the previous episodes — without the
eval harness, you couldn't have known quality didn't drop.

---

## What you have now

The agent now:

- Caches prompts at the provider level.
- Caches results semantically and at the function level.
- Routes between models based on query difficulty.
- Streams responses to feel fast.
- Has measured cost per conversation, not just per call.

What's still missing:

- **Guardrails and a gateway** in front of all this — the production
  infrastructure that catches prompt injection, enforces rate
  limits, and gives you a single chokepoint for logging.
  Episode 9.
- **A real feedback loop** from users. The eval harness from
  Episode 6 only knows what you fed it. Episode 10 adds the loop
  that closes itself.

---

## Where we go next

Episode 9 wraps the agent in the things production demands: input
validation, output safety filtering, a model gateway, and the
observability that turns a black box into a system you can debug at
3am when the customer says *"it just did the thing."*

— Dad

---

*Code: `01-prompt-cache.py` (correct usage of provider prompt
caching), `02-semantic-cache.py` (embedding-based query cache with
SQL backing), `03-router.py` (confidence-based model escalation),
`04-pareto.html` (interactive cost-vs-latency frontier viz).*

*Source: Chip Huyen,* AI Engineering, *Chapter 9 (Inference
Optimization) and Chapter 10 step 4 (Reduce Latency with Caches).
Provider docs to keep open: Anthropic's prompt caching guide; the
OpenAI batch API docs for the cases where async batch makes sense.*
