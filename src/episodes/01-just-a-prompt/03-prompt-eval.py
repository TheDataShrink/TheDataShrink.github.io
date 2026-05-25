"""
Episode 1, sample 3 — the smallest useful regression check.

Runs the trip planner over a small fixture set, applies a handful of
dumb-on-purpose smoke tests, and writes both each run's output and a
summary to disk.

This is NOT an evaluation harness. Real evaluation comes in Episode 6.
This is the smallest thing that lets you change a prompt and see whether
it got better or worse before you ship the change.

Run:
    export ANTHROPIC_API_KEY=...
    python 03-prompt-eval.py

Outputs:
    runs/<destination>.md   one file per fixture (for human diffing)
    summary.json            one record per fixture with check pass/fail
"""

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Callable

# import the code under test
import importlib.util
_spec = importlib.util.spec_from_file_location(
    "prompt_v3", Path(__file__).parent / "02-prompt-template.py"
)
prompt_v3 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(prompt_v3)
TripPlanRequest = prompt_v3.TripPlanRequest
plan_trip = prompt_v3.plan_trip

FIXTURES = Path(__file__).parent / "fixtures.json"
RUNS = Path(__file__).parent / "runs"


@dataclass
class Check:
    name: str
    test: Callable[[str], bool]


CHECKS = [
    Check("mentions a total cost",
          lambda out: "total" in out.lower() and "$" in out),
    Check("has day-by-day structure",
          lambda out: sum(out.lower().count(f"day {i}") for i in range(1, 8)) >= 3),
    Check("handles the constraint or admits it can't",
          lambda out: any(w in out.lower()
                          for w in ["motion sick", "wheelchair", "driving",
                                    "cannot", "would need", "tight"])),
]


def main() -> None:
    RUNS.mkdir(exist_ok=True)
    fixtures = json.loads(FIXTURES.read_text())

    summary = []
    for fx in fixtures:
        req = TripPlanRequest(**fx)
        out = plan_trip(req)
        (RUNS / f"{fx['destination'].lower()}.md").write_text(out)

        results = {c.name: c.test(out) for c in CHECKS}
        summary.append({"fixture": fx["destination"], **results})
        marks = " ".join("✓" if v else "✗" for v in results.values())
        print(f"{fx['destination']:>12}  {marks}")

    (Path(__file__).parent / "summary.json").write_text(
        json.dumps(summary, indent=2)
    )


if __name__ == "__main__":
    main()
