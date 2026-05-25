# Episode 3 — Knowledge: RAG from first principles

*Series: Building an Agent from Scratch. Episode 3 of 12.*

---

## What the model doesn't know

When you were small and you didn't know something, you asked. You'd ask
me, your mother, your grandmother, the librarian. The asking was the
thing. Not knowing was fine; *pretending to know* was the problem.

The language model in Episode 1 has a different relationship with not
knowing. It has read most of the internet up to some cutoff date. That's
a lot. It often sounds like it knows everything. But:

- It doesn't know what's happened since its cutoff.
- It doesn't know anything specific to *you* — your past trips, your
  family's allergies, your company's internal policies.
- It doesn't know the documents in your laptop, the rows in your
  database, the tickets in your queue.

When you ask the model about something in any of those categories, one
of three things happens. It says it doesn't know (best case, rarely
happens). It refuses to answer (better than making things up, sometimes
happens). It invents an answer that sounds right (this is what most
people mean when they say *hallucination*, and it's the failure mode
that gets companies in trouble).

There is a fix for this. It's the most-used pattern in production AI
today, and it has an unflattering name: **Retrieval-Augmented
Generation**, usually shortened to **RAG**. Strip the jargon and it's
this: **before you ask the model, go find the relevant facts, and
include them in the prompt.**

That's it. That's the whole pattern. Everything else is engineering.

A father's framing: **don't expect the model to remember; expect it to
read.** Give it the right page open in front of it and it will do the
right thing. Don't, and it will make something up to be helpful, the
way a kid who hasn't done the reading will bluff through the
discussion.

---

## Why RAG instead of just a bigger context window

A reasonable objection: *if the model can read 200,000 tokens of
context, why not just paste everything in?*

You can. People do. It works, sometimes. The problems with it are real:

- **Cost.** Tokens cost money on every call. Pasting your entire
  knowledge base in every time gets expensive fast.
- **Latency.** Long prompts take longer to process. Users notice.
- **Distraction.** Even modern models pay less attention to the middle
  of a long context. The needle-in-a-haystack tests show this clearly.
  More context isn't always better signal.
- **Freshness.** Your knowledge base changes. RAG lets you update one
  document; "paste everything" means re-uploading.
- **Citations.** With RAG you know which document the model was
  looking at when it answered. Without RAG, you're guessing.

RAG is older than language models. Search engines have been doing
something similar since the 1990s. What's new is that the *consumer* of
the search result is now a model that can reason over it instead of a
human who has to read ten blue links. That changes the design of the
search, and that's most of the engineering in this episode.

---

## The shape of the system we'll build

Three pieces. None of them are exotic.

1. **An ingestion pipeline.** Read source documents, split them into
   chunks, compute an embedding for each chunk, store everything in
   Postgres. Run this when documents change, not at query time.
2. **A retriever.** Given a query, find the top-k most relevant chunks.
   We'll do both lexical (BM25-style) and semantic (vector cosine)
   retrieval, then combine them.
3. **A tool that the agent calls.** When our trip planner needs to
   know what we said about Reykjavik last time, it calls
   `search_notes("Reykjavik")` and gets back the relevant snippets.

All three pieces fit in about 200 lines of Python and one SQL file.
This is one of the cleanest examples in the series of how a name with
a lot of marketing weight (RAG) is, underneath, just a few simple
parts wired together.

---

## The database schema

We're going to use **Postgres** with the `pgvector` extension. Postgres
because most of you already have one running and a vector store doesn't
need to be a separate service for most workloads until you're operating
at scale. `pgvector` because it's mature, free, and the SQL is normal
SQL.

```sql
-- 01-schema.sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS documents (
    id          BIGSERIAL PRIMARY KEY,
    source      TEXT NOT NULL,            -- e.g. file path or URL
    title       TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chunks (
    id          BIGSERIAL PRIMARY KEY,
    document_id BIGINT REFERENCES documents(id) ON DELETE CASCADE,
    ord         INT NOT NULL,             -- order within the document
    content     TEXT NOT NULL,
    embedding   VECTOR(1024),             -- one of the smaller embedding sizes
    tsv         TSVECTOR                  -- for lexical search
);

CREATE INDEX IF NOT EXISTS chunks_embedding_idx
    ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS chunks_tsv_idx
    ON chunks USING GIN (tsv);
```

Notice we're storing **two** searchable representations of each chunk: a
dense vector (`embedding`) and a sparse text-search vector (`tsv`).
That's deliberate. Each is good at things the other is bad at, and
combining them beats either alone in almost every real benchmark.
We'll see why in a moment.

A few schema choices worth flagging:

- **`ord`** lets us re-assemble chunks in order if we want to. Most
  RAG mistakes I've seen come from losing the document structure
  during chunking; keeping the order around is cheap insurance.
- **`ON DELETE CASCADE`** means deleting a document deletes its chunks.
  You will appreciate this the first time you re-ingest.
- **`VECTOR(1024)`** must match your embedding model's output
  dimension. If you switch models, you switch this number, and you
  re-embed everything. Plan for it.

---

## Ingestion: read, chunk, embed, store

```python
# 02-ingest.py (excerpt)
def chunk_text(text: str, target_words: int = 200, overlap_words: int = 40) -> list[str]:
    """Split on paragraphs; merge until target size; overlap between chunks."""
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    chunks, buf = [], []
    buf_len = 0
    for p in paragraphs:
        words = p.split()
        if buf_len + len(words) > target_words and buf:
            chunks.append(" ".join(buf))
            # carry the tail forward as overlap
            tail = " ".join(buf).split()[-overlap_words:]
            buf, buf_len = tail, len(tail)
        buf.extend(words)
        buf_len += len(words)
    if buf:
        chunks.append(" ".join(buf))
    return chunks
```

Chunking is the part of RAG that engineers undervalue and pay for
later. Bad chunking gives the retriever bad raw material; no amount of
clever vector math fixes that downstream.

The chunker above is opinionated:

- **Split on paragraph boundaries first.** A paragraph is almost always
  a coherent unit of meaning. Splitting in the middle of one is how you
  get fragments that say things like *"...whereas in practice the
  recommended approach is..."* with no context for what's recommended.
- **Target a word count, not a token count.** Words are easier to
  reason about. Token counts are model-specific; words are universal.
  200 words is roughly 250–300 tokens in English, which is a sweet spot
  for most embedding models.
- **Overlap the tail.** Two adjacent chunks share ~40 words. This
  helps when a question's answer straddles a chunk boundary. The cost
  is a small amount of duplication. Worth it.

When the document has structure — headings, lists, code blocks — use it.
A markdown-aware chunker will outperform a paragraph-aware one for
documentation. A code-aware splitter (one chunk per function) will
outperform either for source code. There's no universal best chunker;
there's only a chunker that respects your document type.

The rest of ingestion is mechanical: for each chunk, get an embedding
from your provider (we'll use a small Voyage or OpenAI model), build a
text-search vector with `to_tsvector('english', content)`, and `INSERT`.

---

## Retrieval: hybrid is the honest default

When you have a question, you need to find the chunks most likely to
contain the answer. There are two main ways to do this.

**Lexical search** matches words. It uses TF-IDF or BM25 to weight rare,
informative terms more than common ones. It's fast, it's old, it's
extremely good at queries with specific names, numbers, or jargon
(*"clause 4.2.1"*, *"error code E_QUOTA_EXCEEDED"*). It's poor at
queries that paraphrase (*"how do I reset my password"* won't find a
document about *"credential recovery procedure"*).

**Semantic search** matches *meaning.* Both the query and each chunk
are converted to vectors by an embedding model; the chunks closest to
the query in vector space are returned. It handles paraphrase
beautifully. It's worse at exact-term matches because the embedding
abstracts away exact tokens.

**Hybrid search** runs both and combines the results. The simplest
honest combiner is **Reciprocal Rank Fusion (RRF)**: each chunk gets a
score of `1 / (k + rank)` from each ranker, sum the scores, sort by
the total. It has one parameter (`k`, usually 60), it has no learned
weights, and it just works.

```python
# 03-retrieve.py (excerpt)
def retrieve(query: str, k: int = 8) -> list[dict]:
    query_vec = embed(query)

    with conn() as cx, cx.cursor() as cur:
        cur.execute("""
            SELECT id, content
              FROM chunks
             ORDER BY embedding <=> %s
             LIMIT %s
        """, (query_vec, k * 3))
        semantic = cur.fetchall()

        cur.execute("""
            SELECT id, content
              FROM chunks
             WHERE tsv @@ plainto_tsquery('english', %s)
             ORDER BY ts_rank(tsv, plainto_tsquery('english', %s)) DESC
             LIMIT %s
        """, (query, query, k * 3))
        lexical = cur.fetchall()

    return rrf(semantic, lexical, k=k)
```

`<=>` is pgvector's cosine-distance operator. `@@` is Postgres's
full-text match. `plainto_tsquery` turns a natural-language query into
a text-search query — it's the boring kind of magic that's been in
Postgres for fifteen years.

The `rrf()` function (in the full file) is twelve lines. Read it. It's
the entire ranking model.

---

## Evaluating the retriever before you evaluate the agent

A trap people fall into: they build the whole RAG-augmented agent,
notice it gives bad answers, and start tuning the prompt. The prompt
isn't the problem. The retrieval is the problem. If the right chunk
isn't in the top-k, no amount of prompting will save the model — it
literally cannot see the answer.

So evaluate the retriever in isolation, before you wire it into the
agent. The metric is **recall@k**: out of a set of queries with known
correct chunks, in what fraction of cases is the correct chunk in the
top-k results?

```python
# 04-rag-eval.py (excerpt)
@dataclass
class LabelledQuery:
    query: str
    correct_chunk_ids: set[int]    # chunks a human marked as containing the answer

def recall_at_k(queries: list[LabelledQuery], k: int) -> float:
    hits = 0
    for q in queries:
        retrieved = {c["id"] for c in retrieve(q.query, k=k)}
        if retrieved & q.correct_chunk_ids:
            hits += 1
    return hits / len(queries)
```

You need maybe 30–50 labelled queries to get a useful signal. Real
queries from real users beat synthetic ones every time, but synthetic
ones are better than none. A starter pattern: take real documents,
have a model generate plausible questions about each one, store the
chunk id of the source as the "correct" answer.

Track `recall@1`, `recall@5`, `recall@10`. A healthy starter RAG
system on a small corpus should get `recall@10 > 0.8` and `recall@1 >
0.5` without much tuning. If you're below those numbers, fix retrieval
before doing anything else.

This is the part of RAG that almost no tutorial covers and almost
every production system needs. **You cannot improve what you don't
measure.** A father's principle applied to vector math.

---

## Wiring it into the agent

Now we expose retrieval to the model as a tool, the same way we
exposed `get_weather` in Episode 2.

```python
SEARCH_NOTES_TOOL = {
    "name": "search_notes",
    "description": (
        "Search the user's saved trip notes for relevant snippets. "
        "Use this whenever the user refers to past trips, past plans, "
        "or things you don't have in your own knowledge."
    ),
    "input_schema": {
        "type": "object",
        "properties": {
            "query": {"type": "string", "description": "Search query in natural language."},
        },
        "required": ["query"],
    },
}

def search_notes(query: str) -> dict:
    results = retrieve(query, k=5)
    snippets = [{"id": r["id"], "text": r["content"]} for r in results]
    return {"ok": True, "data": snippets}
```

The tool returns the snippets with their ids. The model can now do
things like *"based on note #47 from your last Reykjavik trip, you
preferred Airbnb over hotels — should we go that direction again?"*
The id is your citation. When the model says something surprising, you
can pull up note #47 and verify it actually said what the model
claims.

That's the second-most-important property of RAG, after fixing
hallucinations: **it makes the model's outputs auditable.**

---

## When RAG isn't the answer

I want to be honest about the limits.

- **Reasoning across many documents** is hard. RAG gives the model
  some chunks; it doesn't restructure them into a coherent argument.
  *"Summarize everything we've ever discussed about Iceland"* — across
  fifty notes — strains the pattern. You'll get a summary, but it
  will favor the chunks that happened to score highest, not the most
  important chunks. Multi-hop reasoning needs more (Episode 5's
  planner helps here).
- **Tables and structured data** want SQL, not vectors. If your
  question is *"how much did we spend on hotels last year"*, RAG over
  receipts will fail. A `SELECT SUM(amount) FROM expenses WHERE ...`
  succeeds. The right tool for the right shape of data.
- **Very small corpora** don't need RAG. If your knowledge base is
  twenty paragraphs, paste it all into the prompt. The cost is lower
  than the engineering.
- **Very fast-changing data** wants live queries, not periodic
  ingestion. If the answer can change in the next five minutes, a tool
  that hits the live source beats a vector index that's five minutes
  old.

A father's pattern: **the simplest thing that works is almost always
the right thing.** RAG is sometimes the simplest thing. Sometimes it's
overkill. The skill is knowing which.

---

## What you have now

Your agent can:

- Call tools when it needs to act in the world (Episode 2).
- Search a corpus of your documents when it needs information outside
  its training data (this episode).
- Cite where its information came from, in the form of chunk ids you
  can audit.

What's still missing:

- **Memory across sessions.** Each conversation is amnesia. RAG over
  your notes is close, but it's not the same as the agent
  *remembering* what you said two turns ago in a long conversation.
  Episode 4.
- **A planner.** Right now the model decides what to do reactively,
  one tool call at a time. For multi-step jobs that benefits from
  laying out a plan first. Episode 5.
- **Honest agent-level evaluation.** Retrieval has recall@k. The
  end-to-end agent needs more. Episode 6.

---

## Where we go next

Episode 4 is memory. Specifically: how to give the agent enough of a
"who I'm talking to and what we've discussed" that conversations feel
continuous, without exploding the token budget or making things up.
We'll mix in-conversation summarization with a small vector store of
**facts**, and we'll see why the two together beat either alone.

— Dad

---

*Code: `01-schema.sql` (the database), `02-ingest.py` (chunk + embed +
store), `03-retrieve.py` (hybrid search + RRF), `04-rag-eval.py`
(recall@k harness). Set `DATABASE_URL` and `VOYAGE_API_KEY` (or
swap the embedding call for your provider).*

*Source: Chip Huyen,* AI Engineering, *Chapter 6 §RAG (p253–273).
Recommended further reading: pgvector's docs (especially the index
tuning guide), and "Lost in the Middle" (Liu et al., 2023) for the
needle-in-a-haystack problem.*
