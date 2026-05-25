"""
Episode 3, sample 3 — hybrid retrieval (semantic + lexical) with RRF fusion.

Run:
    export DATABASE_URL=postgresql://...
    export VOYAGE_API_KEY=...
    python 03-retrieve.py "what did we decide about reykjavik"
"""

import os
import sys

import psycopg
import voyageai

VOYAGE = voyageai.Client(api_key=os.environ["VOYAGE_API_KEY"])
EMBEDDING_MODEL = "voyage-3-lite"
DATABASE_URL = os.environ["DATABASE_URL"]


def embed_query(text: str) -> list[float]:
    """Note: input_type='query' is important; it's a different prompt path."""
    return VOYAGE.embed([text], model=EMBEDDING_MODEL, input_type="query").embeddings[0]


def rrf(rankings: list[list[dict]], k: int = 60, top_n: int = 8) -> list[dict]:
    """Reciprocal Rank Fusion. Each ranking is a list of dicts with an 'id' field."""
    scores: dict[int, float] = {}
    payloads: dict[int, dict] = {}
    for ranking in rankings:
        for rank, item in enumerate(ranking):
            scores[item["id"]] = scores.get(item["id"], 0.0) + 1.0 / (k + rank)
            payloads.setdefault(item["id"], item)
    ordered_ids = sorted(scores, key=scores.get, reverse=True)[:top_n]
    return [payloads[i] | {"score": scores[i]} for i in ordered_ids]


def retrieve(query: str, k: int = 8) -> list[dict]:
    query_vec = embed_query(query)

    with psycopg.connect(DATABASE_URL) as conn, conn.cursor() as cur:
        cur.execute(
            """
            SELECT id, content
              FROM chunks
             ORDER BY embedding <=> %s::vector
             LIMIT %s
            """,
            (query_vec, k * 3),
        )
        semantic = [{"id": r[0], "content": r[1]} for r in cur.fetchall()]

        cur.execute(
            """
            SELECT id, content
              FROM chunks
             WHERE tsv @@ plainto_tsquery('english', %s)
             ORDER BY ts_rank(tsv, plainto_tsquery('english', %s)) DESC
             LIMIT %s
            """,
            (query, query, k * 3),
        )
        lexical = [{"id": r[0], "content": r[1]} for r in cur.fetchall()]

    return rrf([semantic, lexical], top_n=k)


if __name__ == "__main__":
    q = " ".join(sys.argv[1:]) or "reykjavik plans"
    for r in retrieve(q, k=5):
        print(f"#{r['id']}  score={r['score']:.4f}")
        print(f"  {r['content'][:200]}{'...' if len(r['content']) > 200 else ''}\n")
