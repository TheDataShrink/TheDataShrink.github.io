"""
Episode 6, sample 1 — a minimal evaluation harness.

Inputs go in, agent runs over each, scorers score each output, results
aggregate into a report. The shape is deliberately small so it stays
honest as it grows.

Run:
    python 01-eval-harness.py fixtures.json
"""

import json
import statistics
import sys
from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Callable


@dataclass
class Fixture:
    id: str
    input: dict
    rubric: dict
    expected: dict | None = None
    tags: dict = field(default_factory=dict)


@dataclass
class Score:
    fixture_id: str
    metric: str
    value: float
    details: dict = field(default_factory=dict)


# --- example scorers -------------------------------------------------------

def scorer_has_total_cost(fx: Fixture, output: str) -> list[Score]:
    ok = "total" in output.lower() and "$" in output
    return [Score(fx.id, "has_total_cost", 1.0 if ok else 0.0)]


def scorer_acknowledges_constraint(fx: Fixture, output: str) -> list[Score]:
    constraint = fx.input.get("constraints", "").lower().split(",")[0].strip()
    if not constraint:
        return []
    mentioned = any(w in output.lower() for w in constraint.split() if len(w) > 3)
    return [Score(fx.id, "acknowledges_constraint", 1.0 if mentioned else 0.0)]


def scorer_budget_respected(fx: Fixture, output: str) -> list[Score]:
    """Functional check: does the output's stated total fit within budget?"""
    import re
    budget = fx.input.get("budget_usd")
    if not budget:
        return []
    # naive: find the largest dollar figure that looks like a total
    matches = [int(m.group(1).replace(",", ""))
               for m in re.finditer(r"\$([\d,]+)", output)]
    if not matches:
        return [Score(fx.id, "budget_respected", 0.0, {"note": "no $ figures found"})]
    stated_total = max(matches)
    ok = stated_total <= budget * 1.05  # 5% grace
    return [Score(fx.id, "budget_respected", 1.0 if ok else 0.0,
                  {"stated_total": stated_total, "budget": budget})]


# --- the harness -----------------------------------------------------------

def run_eval(agent: Callable[[dict], str],
             fixtures: list[Fixture],
             scorers: list[Callable]) -> list[Score]:
    scores: list[Score] = []
    for fx in fixtures:
        output = agent(fx.input)
        for scorer in scorers:
            scores.extend(scorer(fx, output))
    return scores


def report(scores: list[Score], fixtures: list[Fixture]) -> None:
    by_metric: dict[str, list[float]] = defaultdict(list)
    for s in scores:
        by_metric[s.metric].append(s.value)
    print("\n=== overall ===")
    for metric, vals in sorted(by_metric.items()):
        print(f"  {metric:<30}  mean={statistics.mean(vals):.3f}  n={len(vals)}")

    # per-tag slice
    tag_keys = sorted({k for fx in fixtures for k in fx.tags.keys()})
    if not tag_keys:
        return
    print("\n=== slices ===")
    fx_index = {fx.id: fx for fx in fixtures}
    for key in tag_keys:
        per_value: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))
        for s in scores:
            val = fx_index[s.fixture_id].tags.get(key)
            if val is None:
                continue
            per_value[val][s.metric].append(s.value)
        for val, metrics in per_value.items():
            print(f"  {key}={val}")
            for metric, vals in sorted(metrics.items()):
                print(f"    {metric:<28}  mean={statistics.mean(vals):.3f}  n={len(vals)}")


# --- demo agent (stand-in) -------------------------------------------------

def _demo_agent(inp: dict) -> str:
    """Stand-in for the real agent. Replace with your plan_trip etc."""
    return (f"Plan for {inp.get('destination')}:\n"
            f"Day 1: arrive, dinner. Day 2: sightseeing.\n"
            f"Constraints noted: {inp.get('constraints', 'none')}.\n"
            f"Total: ${inp.get('budget_usd', 0)}.\n")


def main(fixtures_path: str) -> None:
    raw = json.loads(Path(fixtures_path).read_text())
    fixtures = [Fixture(**fx) for fx in raw]
    scorers = [scorer_has_total_cost, scorer_acknowledges_constraint, scorer_budget_respected]
    scores = run_eval(_demo_agent, fixtures, scorers)
    report(scores, fixtures)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "fixtures.json")
