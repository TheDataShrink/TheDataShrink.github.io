"""
Episode 8, sample 2 — semantic query cache with Postgres + pgvector.

Embed each incoming query. Look for a near-duplicate in the cache. If
the cosine similarity is above a threshold and the entry hasn't
expired, return the cached answer.

Schema (apply alongside Episode 3's tables):

    CREATE TABLE IF NOT EXISTS query_cache (
        id         BIGSERIAL PRIMARY KEY,
        query      TEXT NOT NULL,
        answer     TEXT NOT NULL,
        embedding  VECTOR(1024) NOT NULL,
        category   TEXT NOT NULL DEFAULT 'default',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        ttl_seconds INT NOT NULL DEFAULT 3600
    );

    CREATE INDEX IF NOT EXISTS query_cache_embedding_idx
        ON query_cache USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
"""

import os
from dataclasses import dataclass

import psycopg
import voyageai

VOYAGE = voyageai.Client(api_key=os.environ["VOYAGE_API_KEY"])
DATABASE_URL = os.environ["DATABASE_URL"]
EMBEDDING_MODEL = "voyage-3-lite"

# Tighter is safer (fewer cache hits, lower risk of returning the wrong
# answer to a subtly different question). 0.95 is a reasonable start.
DEFAULT_THRESHOLD = 0.95


@dataclass
class CacheHit:
    answer: str
    similarity: float
    age_seconds: int


def _embed(text: str) -> list[float]:
    return VOYAGE.embed([text], model=EMBEDDING_MODEL, input_type="query").embeddings[0]


def lookup(query: str, category: str = "default",
           threshold: float = DEFAULT_THRESHOLD) -> CacheHit | None:
    vec = _embed(query)
    with psycopg.connect(DATABASE_URL) as cn, cn.cursor() as cur:
        cur.execute(
            """
            SELECT answer,
                   1 - (embedding <=> %s::vector) AS similarity,
                   EXTRACT(EPOCH FROM (now() - created_at))::int AS age,
                   ttl_seconds
              FROM query_cache
             WHERE category = %s
             ORDER BY embedding <=> %s::vector
             LIMIT 1
            """,
            (vec, category, vec),
        )
        row = cur.fetchone()
        if not row:
            return None
        answer, sim, age, ttl = row
        if sim < threshold:
            return None
        if age > ttl:
            return None
        return CacheHit(answer=answer, similarity=sim, age_seconds=age)


def store(query: str, answer: str, category: str = "default",
          ttl_seconds: int = 3600) -> None:
    vec = _embed(query)
    with psycopg.connect(DATABASE_URL) as cn, cn.cursor() as cur:
        cur.execute(
            "INSERT INTO query_cache (query, answer, embedding, category, ttl_seconds) "
            "VALUES (%s,%s,%s,%s,%s)",
            (query, answer, vec, category, ttl_seconds),
        )
        cn.commit()


# Convenience wrapper to use around any agent call.
def with_cache(agent_fn, query: str, category: str = "default",
               threshold: float = DEFAULT_THRESHOLD,
               ttl_seconds: int = 3600) -> tuple[str, bool]:
    hit = lookup(query, category=category, threshold=threshold)
    if hit:
        return hit.answer, True
    answer = agent_fn(query)
    store(query, answer, category=category, ttl_seconds=ttl_seconds)
    return answer, False


if __name__ == "__main__":
    def fake_agent(q: str) -> str:
        return f"<<answer to: {q}>>"

    print(with_cache(fake_agent, "What's the weather in Tokyo?", category="weather"))
    print(with_cache(fake_agent, "How's the Tokyo forecast?", category="weather"))
    # The second call should hit the cache if similarity > threshold.
