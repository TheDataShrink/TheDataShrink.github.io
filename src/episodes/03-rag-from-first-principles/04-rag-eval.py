"""
Episode 3, sample 4 — recall@k on a labelled query set.

Build a small fixture: each entry is a natural-language query and the
set of chunk ids that a human (you) considers correct sources for the
answer. Measure what fraction of queries have at least one correct chunk
in the top-k retrieved set.

This is the smallest honest evaluation of retrieval quality. Run it
every time you change the chunker, the embedding model, or the
retrieval logic. If recall@10 drops, you broke something.

Run:
    python 04-rag-eval.py labelled_queries.json
"""

import json
import sys
from dataclasses import dataclass
from pathlib import Path

import importlib.util
_spec = importlib.util.spec_from_file_location(
    "retrieve_mod", Path(__file__).parent / "03-retrieve.py"
)
retrieve_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(retrieve_mod)
retrieve = retrieve_mod.retrieve


@dataclass
class LabelledQuery:
    query: str
    correct_chunk_ids: set[int]


def recall_at_k(queries: list[LabelledQuery], k: int) -> float:
    hits = 0
    for q in queries:
        retrieved_ids = {c["id"] for c in retrieve(q.query, k=k)}
        if retrieved_ids & q.correct_chunk_ids:
            hits += 1
    return hits / len(queries) if queries else 0.0


def mrr(queries: list[LabelledQuery], k: int) -> float:
    """Mean reciprocal rank of the first correct hit in top-k. 0 if no hit."""
    total = 0.0
    for q in queries:
        for rank, c in enumerate(retrieve(q.query, k=k), start=1):
            if c["id"] in q.correct_chunk_ids:
                total += 1.0 / rank
                break
    return total / len(queries) if queries else 0.0


def main(fixtures_path: str) -> None:
    raw = json.loads(Path(fixtures_path).read_text())
    queries = [LabelledQuery(q["query"], set(q["correct_chunk_ids"])) for q in raw]

    for k in (1, 5, 10):
        print(f"recall@{k:>2} = {recall_at_k(queries, k):.3f}")
    print(f"MRR@10     = {mrr(queries, 10):.3f}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "labelled_queries.json")
