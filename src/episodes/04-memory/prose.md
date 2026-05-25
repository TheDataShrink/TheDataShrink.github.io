# Episode 4 — Memory: short and long term

*Series: Building an Agent from Scratch. Episode 4 of 12.*

---

## The amnesia problem

There's a way I sometimes catch you not really listening to me. I'll
tell you a story about my day, and an hour later you'll ask me a
question that the story already answered. You weren't being rude. The
story just slid past without finding anything to stick to. There was no
shelf in your head ready for it.

The language model in our agent has the same problem, except much
worse. By default it has no shelves at all. Every API call is amnesia.
The model that planned your Tokyo trip yesterday has no idea who you
are when you come back today. It has no memory of the four trips you've
discussed, the fact that your daughter gets motion sick, your strong
opinion against early-morning flights. It will ask you the same questions
again, get the same answers, and produce a plan that ignores everything
it learned the last three times.

This is fixable. Like everything else in this series, the fix is
unglamorous. We just have to build the shelves, and we have to be
honest about what goes on them.

A father's framing: **listening is most of love.** A system that
remembers what you said is showing you a form of respect. A system that
makes you repeat yourself is, however unintentionally, treating you the
way the fear posture treats children — *what you said before isn't
relevant; tell me again.*

---

## What "memory" actually means

The word *memory* in the agent world is used for at least four
different things. Mixing them up is the source of most confusion. Let's
sort them.

**1. The context window.** Whatever's in the messages list on the
current API call. The model "remembers" all of it perfectly. This isn't
really memory — it's the current conversation. It vanishes the moment
the request ends.

**2. The scratchpad.** Notes the agent writes to itself within a single
task: *"I already searched for flights, no need to do that again."*
Lives inside one conversation. Can be implemented as part of the
prompt, or as a structured field the agent reads and writes.

**3. Conversation memory.** The history of the current
*conversation* (potentially across many turns), persisted so a user
returning tomorrow continues where they left off. This is what most
chatbots call memory.

**4. Long-term memory across conversations.** Facts the agent learns
*about you* across all conversations: your name, your preferences,
your past trips, your standing constraints. The thing that makes the
agent feel like it knows you, instead of meeting you for the first
time every Monday.

This episode is mostly about types 3 and 4 — the persistent kinds.
Type 1 we've used since Episode 1. Type 2 will show up implicitly when
we build the planner in Episode 5.

---

## The naïve approach and why it fails

The first thing everyone tries: just keep appending to the message list
forever. Conversation has 200 turns? Send all 200 every time.

This works until it doesn't. The failure modes:

- **Cost.** Tokens charged per call, multiplied by every turn ever.
  After a few hundred turns the per-message cost is dollars, not cents.
- **Latency.** The model has to process the whole history before it
  can answer.
- **Context limits.** Even with 200k-token windows, real conversations
  blow past them in a few weeks of daily use.
- **Attention drift.** Buried in 50,000 tokens of history, the *current*
  question gets less attention than it deserves. Quality degrades.
- **Irrelevance.** Most of the history isn't relevant to the current
  turn. Carrying it forward is paying for noise.

We need something smarter. Specifically: we need to **summarize what
can be summarized, store what should be stored, and retrieve only what
matters right now.**

---

## A hybrid that works

After watching a lot of memory systems succeed and fail in production,
here's the shape I trust:

1. **A rolling window** of the last N turns, sent verbatim. This is
   the working set — recent context the model needs in full.
2. **A rolling summary** of everything before the window. As old turns
   fall out of the window, the summary absorbs them. The summary lives
   in the system prompt or as a special early message.
3. **A fact store**, in Postgres with vector search (the same setup
   from Episode 3, reused). Specific facts about the user get
   *extracted* from conversations and stored as discrete records.
   These are looked up at the start of each turn and the relevant ones
   are injected into the prompt.

Three layers. Each handles what it's good at. Together they give the
agent a sense of continuity without exploding the token bill.

The decisions that matter at each layer:

**The window: how big?** Usually 10–20 turns. Big enough to feel
continuous, small enough to keep cost predictable. Pick a number, hold
it constant, change it deliberately when you have data.

**The summary: how often refreshed?** Every time a turn rolls out of
the window. Send the model the *old* summary plus the rolling-out turn
and ask for a *new* summary. This is one extra cheap call per N turns.

**The fact store: what counts as a fact?** This is the hard one and
where most systems get it wrong. We'll get to it.

---

## Schema

We're extending the schema from Episode 3.

```sql
-- 03-memory.sql
CREATE TABLE IF NOT EXISTS conversations (
    id         BIGSERIAL PRIMARY KEY,
    user_id    TEXT NOT NULL,
    summary    TEXT,                 -- rolling summary
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
    id              BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    ord             INT NOT NULL,
    role            TEXT NOT NULL CHECK (role IN ('user','assistant','tool')),
    content         TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_conversation_ord_idx
    ON messages (conversation_id, ord);

CREATE TABLE IF NOT EXISTS facts (
    id          BIGSERIAL PRIMARY KEY,
    user_id     TEXT NOT NULL,
    kind        TEXT NOT NULL,        -- 'preference' | 'constraint' | 'history' | 'identity'
    content     TEXT NOT NULL,
    source_msg  BIGINT REFERENCES messages(id) ON DELETE SET NULL,
    embedding   VECTOR(1024),
    confidence  REAL NOT NULL DEFAULT 0.8,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at  TIMESTAMPTZ            -- optional TTL
);

CREATE INDEX IF NOT EXISTS facts_user_idx ON facts (user_id);
CREATE INDEX IF NOT EXISTS facts_embedding_idx
    ON facts USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

Three things worth noting:

**`kind` is a small enum, not freeform.** Preferences (*"prefers
window seats"*), constraints (*"can't fly more than 6 hours"*), history
(*"went to Lisbon in March 2025"*), identity (*"father of two, ages 6
and 9"*). Each category gets handled slightly differently downstream —
preferences are sticky, constraints are sticky-and-strict, history is
recallable, identity is always-included. Mixing them turns
"memory" into "everything we ever said," which is back to the
amnesia-or-overload trap.

**`source_msg` is a back-link.** When the agent surfaces a fact, you
can show the user the exact message it came from. Audit trail.
Critical for the moments when the fact is wrong.

**`expires_at` is optional but useful.** A fact like *"is currently
planning a trip to Tokyo"* should expire. A fact like *"prefers window
seats"* probably shouldn't. The schema lets you express both.

---

## Fact extraction

After every few turns, we run a small call: *"From this exchange, what
new durable facts did you learn about the user?"* The model returns a
structured list. We dedupe against existing facts, embed the new ones,
and insert.

```python
EXTRACTION_PROMPT = """\
From the recent exchange below, list any new durable facts you learned
about the user. A "durable fact" is something likely to remain true and
useful in future conversations.

Categories:
- preference: a preference or taste ("prefers aisle seats")
- constraint: a hard limit ("can't fly more than 6 hours")
- history:    a past event ("traveled to Lisbon in March 2025")
- identity:   a stable identifier ("father of two")

Do NOT include:
- Trip-specific details that won't matter next time.
- Anything you inferred without the user saying it.
- Restatements of facts you already knew.

Return JSON: {{"facts": [{{"kind": "...", "content": "..."}}]}}.

Exchange:
{exchange}

Already-known facts (to deduplicate against):
{known_facts}
"""
```

The discipline that matters:

**"From what the user said."** Not "what you inferred." If the model
hallucinates facts, the fact store becomes a slow-motion disaster — bad
facts compound over time. Be conservative.

**Deduplicate before insert.** Search the existing facts for the user
with a semantic similarity threshold; if a new fact is within 0.85
cosine similarity of an existing one, update the existing one
(refresh timestamp, possibly bump confidence) instead of inserting.

**Confidence, not certainty.** The `confidence` column lets you weight
old, well-confirmed facts more heavily than recent guesses. Optional
but pays off.

---

## Retrieval at conversation time

When the user starts a turn:

1. Load the conversation summary and the last N messages from
   `conversations` and `messages`. That's the working context.
2. Embed the user's new message. Query the `facts` table for the
   user's top-k semantically-relevant facts. Include them in the system
   prompt under "What you know about this user."
3. Run the agent turn as usual.

```python
def assemble_context(user_id: str, conv_id: int, user_msg: str) -> list[dict]:
    summary       = load_conversation_summary(conv_id)
    recent        = load_recent_messages(conv_id, n=20)
    user_msg_vec  = embed_query(user_msg)
    facts         = retrieve_facts(user_id, user_msg_vec, k=8)
    identity      = retrieve_facts(user_id, kind="identity", limit=None)

    system = SYSTEM_BASE
    if identity:
        system += "\n\nWho you're talking to:\n" + "\n".join(f"- {f.content}" for f in identity)
    if facts:
        system += "\n\nPossibly relevant facts about this user:\n" + "\n".join(f"- {f.content}" for f in facts)
    if summary:
        system += f"\n\nConversation so far:\n{summary}"

    return system, recent + [{"role": "user", "content": user_msg}]
```

A few things this is doing on purpose:

- **Identity facts go in always.** They're cheap (a handful) and they
  stabilize the agent's tone.
- **Other facts are retrieved, not dumped.** Even if you have 200
  facts about a user, only the ones relevant to *this turn* go in. The
  vector search keeps it cheap.
- **Summary goes after facts.** The model pays more attention to the
  end of the system prompt. Summary is what frames the immediate
  conversation; facts are background. Adjust to taste.

---

## Forgetting on purpose

This is the part that almost nobody discusses. **Your memory system
needs to forget things.** Not lose them in a bug — *choose* to forget
them.

Three reasons:

- **The user changes.** Preferences from two years ago may no longer
  apply. The diet has changed. The kids are older. The hard "no"
  became a soft "maybe."
- **Facts conflict.** When the user contradicts an existing fact
  (*"actually I love red-eye flights now"*), the new fact should
  supersede the old. Without an explicit forgetting step, you keep
  both, and the agent acts on whichever one happens to retrieve.
- **Trust.** The user should be able to say *"forget that I said that"*
  and have it actually forget. Memory the user doesn't control is a
  surveillance tool, not a helper.

A simple set of forgetting rules:

- When a new fact contradicts an existing one, mark the old fact
  expired and insert the new one.
- Periodically (weekly cron job) decay confidence on facts that
  haven't been retrieved recently. Facts below 0.3 confidence drop out
  of retrieval.
- Always expose a `forget(fact_id)` endpoint or command. Build it into
  the UI.

A father's principle: **the right to be misremembered is part of being
known.** Same goes for the user.

---

## Watching the cost shape

I promised a visualization earlier in the series. This is the episode
where it matters most.

The D3 piece for this episode (in `04-memory-viz.html`) shows the
token cost and accuracy-of-recall of four memory strategies as a
function of conversation length:

1. **No memory** — flat cost, flat (low) recall.
2. **Full history** — cost grows linearly with turns, recall is
   perfect until you hit the context limit and falls off a cliff.
3. **Rolling summary only** — cost stays flat, recall is moderate and
   degrades slowly as the summary loses detail.
4. **Hybrid (summary + facts)** — cost stays flat, recall stays high
   because the relevant specific facts are retrieved on demand.

Play with it. Slide the conversation length up. The hybrid is the
only line that stays in the upper-left of the cost/accuracy plane as
conversations grow long. That's why this is the shape worth building.

---

## What you have now

The agent now:

- Carries a rolling summary of long conversations without ballooning
  the context.
- Stores durable facts about users in a typed, audited, expirable
  store.
- Retrieves relevant facts per turn based on what the user just said.
- Can be told to forget things.

What's still missing:

- **A real planner.** Right now the agent reacts: each turn picks one
  action. For multi-step jobs that benefits from laying out a plan
  first and replanning when reality interferes. Episode 5.
- **Honest evaluation of the memory.** Are the right facts being
  retrieved? Are extracted facts accurate? That's Episode 6.

---

## Where we go next

Episode 5 is the centerpiece of the build arc: the **planning loop.**
We take everything from Episodes 1–4 — the prompted call, the tools,
the retrieval, the memory — and wrap them in the ReAct loop that lets
the agent decide, on its own, what to do next, observe the result,
and decide again. By the end of it you'll have a real agent in the
strong sense. From there the rest of the series is about making it
honest, cheap, and trustworthy.

— Dad

---

*Code: `01-memory-types.py` (four memory strategies behind one
interface), `02-hybrid-memory.py` (summary + fact store, integrated),
`03-memory.sql` (schema additions), `04-memory-viz.html` (D3
cost-vs-recall visualization).*

*Source: Chip Huyen,* AI Engineering, *Chapter 6 §Memory (p300–305).
For the long-context attention drift findings: "Lost in the Middle"
(Liu et al., 2023). For the broader memory taxonomy: the MemGPT paper
(Packer et al., 2023) is the modern foundation.*
