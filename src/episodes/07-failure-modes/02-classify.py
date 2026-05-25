"""
Episode 7, sample 2 — failure classification log.

A small typed record per failure, written to a Postgres table (or a CSV
in dev), so that the failure mix can be tracked over time and the high-
leverage fixes become visible.

Run:
    python 02-classify.py log         # show recent records
    python 02-classify.py add         # interactive add
"""

import csv
import json
import sys
from dataclasses import dataclass, asdict, field
from datetime import datetime
from pathlib import Path
from typing import Literal

LOG_PATH = Path("failures.csv")
BUCKETS = ("planning", "tool", "perception", "memory", "termination")


@dataclass
class FailureRecord:
    trace_id: str
    timestamp: str
    user_query: str
    final_output: str
    bucket: Literal["planning", "tool", "perception", "memory", "termination"]
    diagnosis: str                         # one-sentence cause, in your words
    suspected_subcause: str = ""           # e.g. "silent empty result", "ambiguous units"
    fix_attempted: str = ""
    fixed_at: str = ""                     # ISO timestamp when fix landed; empty if open
    notes: str = ""

    def validate(self) -> None:
        assert self.bucket in BUCKETS, f"bucket must be one of {BUCKETS}"
        assert self.trace_id, "trace_id is required"
        assert self.diagnosis, "diagnosis is required (one sentence)"


# --- read / write ----------------------------------------------------------

def append(rec: FailureRecord) -> None:
    rec.validate()
    new = not LOG_PATH.exists()
    with LOG_PATH.open("a", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(asdict(rec).keys()))
        if new:
            w.writeheader()
        w.writerow(asdict(rec))


def load_all() -> list[FailureRecord]:
    if not LOG_PATH.exists():
        return []
    with LOG_PATH.open() as f:
        return [FailureRecord(**row) for row in csv.DictReader(f)]


# --- reporting -------------------------------------------------------------

def summarize(records: list[FailureRecord]) -> None:
    if not records:
        print("(no records)")
        return
    print(f"\n{len(records)} failures logged\n")
    counts: dict[str, int] = {b: 0 for b in BUCKETS}
    open_counts: dict[str, int] = {b: 0 for b in BUCKETS}
    for r in records:
        counts[r.bucket] += 1
        if not r.fixed_at:
            open_counts[r.bucket] += 1
    print(f"{'bucket':<14} {'total':>6} {'open':>6}")
    for b in BUCKETS:
        print(f"{b:<14} {counts[b]:>6} {open_counts[b]:>6}")

    print("\nrecent diagnoses:")
    for r in records[-5:]:
        flag = "OPEN " if not r.fixed_at else "fixed"
        print(f"  [{r.bucket:<11}] {flag} {r.diagnosis[:80]}")


# --- interactive add -------------------------------------------------------

def interactive_add() -> None:
    def ask(prompt: str, default: str = "") -> str:
        suffix = f" [{default}]" if default else ""
        val = input(f"{prompt}{suffix}: ").strip()
        return val or default

    rec = FailureRecord(
        trace_id=ask("trace_id"),
        timestamp=datetime.utcnow().isoformat(timespec="seconds") + "Z",
        user_query=ask("user_query"),
        final_output=ask("final_output (one line; details in notes)"),
        bucket=ask(f"bucket {BUCKETS}").lower(),
        diagnosis=ask("diagnosis (one sentence)"),
        suspected_subcause=ask("suspected subcause", default=""),
        fix_attempted=ask("fix attempted (blank if not yet)", default=""),
        notes=ask("notes", default=""),
    )
    append(rec)
    print("recorded.")


# --- entrypoint ------------------------------------------------------------

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "log"
    if cmd == "log":
        summarize(load_all())
    elif cmd == "add":
        interactive_add()
    else:
        print(f"unknown command: {cmd}")
        sys.exit(1)
