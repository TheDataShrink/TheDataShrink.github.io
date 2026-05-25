"""
Episode 4, sample 2 — production-ish hybrid memory.

Rolling summary + Postgres fact store with extraction and dedup.
Reuses the embedding setup from Episode 3.

Run (assuming the schema from 03-memory.sql is applied):
    export DATABASE_URL=...
    export ANTHROPIC_API_KEY=...
    export VOYAGE_API_KEY=...
    python 02-hybrid-memory.py
"""

import json
import os
from dataclasses import dataclass

import anthropic
import psycopg
import voyageai

VOYAGE = voyageai.Client(api_key=os.environ["VOYAGE_API_KEY"])
CLAUDE = anthropic.Anthropic()
DATABASE_URL = os.environ["DATABASE_URL"]
EMBEDDING_MODEL = "voyage-3-lite"
MODEL = "claude-sonnet-4-6"
DEDUP_THRESHOLD = 0.85          # cosine similarity above this = same fact


@dataclass
class Fact:
    id: int | None
    user_id: str
    kind: str
    content: str
    confidence: float = 0.8


def embed(texts: list[str], input_type: str = "document") -> list[list[float]]:
    return VOYAGE.embed(texts, model=EMBEDDING_MODEL, input_type=input_type).embeddings


# --- summarization ---------------------------------------------------------

SUMMARIZER_PROMPT = """\
You are maintaining a rolling summary of a conversation. Here is the
summary so far, and the next message that just rolled out of the
short-term window. Update the summary to incorporate it, keeping the
total length under 400 words. Preserve durable details (preferences,
constraints, decisions). Drop transient details (greetings, fillers).

Existing summary:
{summary}

Rolled-out message ({role}):
{content}

Return only the new summary, no preamble."""


def update_summary(summary: str, role: str, content: str) -> str:
    resp = CLAUDE.messages.create(
        model="claude-haiku-4-5-20251001",          # cheap model for cheap work
        max_tokens=600,
        messages=[{"role": "user", "content": SUMMARIZER_PROMPT.format(
            summary=summary or "(empty)", role=role, content=content)}],
    )
    return resp.content[0].text.strip()


# --- fact extraction -------------------------------------------------------

EXTRACTION_PROMPT = """\
From the recent exchange below, list any new durable facts you learned
about the user. A "durable fact" is something likely to remain true and
useful in future conversations.

Categories:
- preference: a preference or taste ("prefers aisle seats")
- constraint: a hard limit ("can't fly more than 6 hours")
- history:    a past event ("traveled to Lisbon in March 2025")
- identity:   a stable identifier ("father of two")

Rules:
- ONLY include facts the user explicitly stated. Do not infer.
- Do NOT include trip-specific details that won't matter next time.
- Do NOT restate facts in the "already known" list.

Already-known facts:
{known}

Recent exchange:
{exchange}

Return JSON only: {{"facts": [{{"kind": "...", "content": "..."}}]}}
"""


def extract_facts(exchange: list[dict], known: list[str]) -> list[dict]:
    exchange_str = "\n".join(f"{m['role']}: {m['content']}" for m in exchange)
    known_str = "\n".join(f"- {k}" for k in known) or "(none)"
    resp = CLAUDE.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=800,
        messages=[{"role": "user", "content": EXTRACTION_PROMPT.format(
            exchange=exchange_str, known=known_str)}],
    )
    try:
        return json.loads(resp.content[0].text).get("facts", [])
    except json.JSONDecodeError:
        return []


# --- fact store ------------------------------------------------------------

class FactStore:
    def __init__(self, user_id: str):
        self.user_id = user_id

    def known_facts(self, limit: int = 50) -> list[str]:
        with psycopg.connect(DATABASE_URL) as cn, cn.cursor() as cur:
            cur.execute(
                "SELECT content FROM facts WHERE user_id=%s AND (expires_at IS NULL OR expires_at > now()) "
                "ORDER BY created_at DESC LIMIT %s",
                (self.user_id, limit),
            )
            return [r[0] for r in cur.fetchall()]

    def search(self, query: str, k: int = 5) -> list[str]:
        vec = embed([query], input_type="query")[0]
        with psycopg.connect(DATABASE_URL) as cn, cn.cursor() as cur:
            cur.execute(
                """
                SELECT content FROM facts
                 WHERE user_id=%s AND (expires_at IS NULL OR expires_at > now())
                 ORDER BY embedding <=> %s::vector
                 LIMIT %s
                """,
                (self.user_id, vec, k),
            )
            return [r[0] for r in cur.fetchall()]

    def add_with_dedup(self, kind: str, content: str) -> None:
        vec = embed([content])[0]
        with psycopg.connect(DATABASE_URL) as cn, cn.cursor() as cur:
            # check semantic dedup
            cur.execute(
                """
                SELECT id, 1 - (embedding <=> %s::vector) AS sim
                  FROM facts
                 WHERE user_id=%s AND kind=%s
                 ORDER BY embedding <=> %s::vector
                 LIMIT 1
                """,
                (vec, self.user_id, kind, vec),
            )
            row = cur.fetchone()
            if row and row[1] >= DEDUP_THRESHOLD:
                # refresh the existing fact rather than insert a duplicate
                cur.execute("UPDATE facts SET created_at=now() WHERE id=%s", (row[0],))
            else:
                cur.execute(
                    "INSERT INTO facts (user_id, kind, content, embedding) VALUES (%s,%s,%s,%s)",
                    (self.user_id, kind, content, vec),
                )
            cn.commit()


# --- demo ------------------------------------------------------------------

if __name__ == "__main__":
    store = FactStore(user_id="demo-user")

    exchange = [
        {"role": "user", "content": "I prefer aisle seats and I can't fly more than 6 hours at a stretch."},
        {"role": "assistant", "content": "Noted: aisle seats, and we'll keep individual flights under 6 hours."},
    ]
    new = extract_facts(exchange, store.known_facts())
    for f in new:
        store.add_with_dedup(f["kind"], f["content"])
        print(f"+ {f['kind']}: {f['content']}")

    print("\nRecall for 'should I book the redeye':")
    for r in store.search("should I book the redeye", k=3):
        print(f"  • {r}")
