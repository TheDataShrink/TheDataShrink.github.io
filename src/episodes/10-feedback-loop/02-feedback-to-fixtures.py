"""
Episode 10, sample 2 — promote bad outputs to permanent eval fixtures.

Nightly job: pull recent negative feedback events, fetch the
corresponding traces, build candidate fixtures, write them to a triage
queue. A human reviews; promoted candidates become entries in the
shared eval set used by Episode 6's harness.

The crucial property: every shipped regression becomes a permanent
test. The agent gets measurably better at the things it most recently
got wrong.

Run:
    export DATABASE_URL=postgresql://...
    python 02-feedback-to-fixtures.py
"""

import json
import os
from dataclasses import dataclass, asdict
from datetime import datetime, timedelta
from pathlib import Path

import psycopg

DATABASE_URL = os.environ["DATABASE_URL"]
FIXTURES_DIR = Path("eval_fixtures")
FIXTURES_DIR.mkdir(exist_ok=True)


NEGATIVE_KINDS = {"thumbs", "regenerate", "flag", "edit"}


@dataclass
class CandidateFixture:
    id: str
    source_event_id: int
    trace_id: str
    input: dict
    rubric: dict
    expected: dict | None
    tags: dict


def pull_recent_negative(since: datetime) -> list[dict]:
    """Return feedback events that look like negative signals."""
    with psycopg.connect(DATABASE_URL) as cn, cn.cursor() as cur:
        cur.execute(
            """
            SELECT id, trace_id, message_id, user_id, kind, value, created_at
              FROM feedback_events
             WHERE created_at >= %s
               AND kind = ANY(%s)
             ORDER BY created_at ASC
            """,
            (since, list(NEGATIVE_KINDS)),
        )
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, row)) for row in cur.fetchall()]


def is_negative(event: dict) -> bool:
    """Some kinds need value inspection to be sure they're negative."""
    if event["kind"] == "flag":
        return True
    if event["kind"] == "regenerate":
        return True
    if event["kind"] == "thumbs":
        return (event.get("value") or {}).get("direction") == "down"
    if event["kind"] == "edit":
        # any non-trivial edit counts
        v = event.get("value") or {}
        return len(v.get("edited", "")) > 0 and v.get("edited") != v.get("original")
    return False


def load_trace(trace_id: str) -> dict:
    """Stub: fetch the trace from your observability backend (Episode 9)."""
    # In a real impl this queries Tempo/Jaeger/Honeycomb/etc.
    return {"initial_input": {"destination": "unknown", "budget_usd": 0},
            "final_output": "(stub)", "tool_calls": []}


def infer_rubric_from_feedback(event: dict) -> dict:
    """Build a starting rubric from what the user told us."""
    base = {
        "must_have": ["addresses the original request"],
        "must_not_have": [],
        "nice_to_have": [],
    }
    if event["kind"] == "thumbs" and (event.get("value") or {}).get("reason"):
        base["must_not_have"].append(event["value"]["reason"])
    if event["kind"] == "flag" and (event.get("value") or {}).get("reason"):
        base["must_not_have"].append(event["value"]["reason"])
    return base


def insert_triage(event_id: int) -> None:
    with psycopg.connect(DATABASE_URL) as cn, cn.cursor() as cur:
        cur.execute(
            "INSERT INTO feedback_triage (feedback_event_id) VALUES (%s) "
            "ON CONFLICT DO NOTHING",
            (event_id,),
        )
        cn.commit()


def build_candidate(event: dict) -> CandidateFixture:
    trace = load_trace(event["trace_id"])
    return CandidateFixture(
        id=f"prod-{event['id']}",
        source_event_id=event["id"],
        trace_id=event["trace_id"],
        input=trace["initial_input"],
        rubric=infer_rubric_from_feedback(event),
        expected=None,
        tags={"source": "production_feedback", "kind": event["kind"]},
    )


def main() -> None:
    since = datetime.utcnow() - timedelta(days=1)
    events = [e for e in pull_recent_negative(since) if is_negative(e)]
    print(f"{len(events)} negative events in the last 24h")

    for e in events:
        cand = build_candidate(e)
        path = FIXTURES_DIR / f"{cand.id}.json"
        path.write_text(json.dumps(asdict(cand), default=str, indent=2))
        insert_triage(e["id"])
        print(f"  candidate: {path.name}  (event #{e['id']}, kind={e['kind']})")


if __name__ == "__main__":
    main()
