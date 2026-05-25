"""
Episode 1, sample 2 — the prompt as code.

Same task as 01-baseline.py, but the prompt is a named, versioned
constant, the inputs are typed, and the system message is doing real
work. This is the shape every later episode builds on.

Run:
    export ANTHROPIC_API_KEY=...
    python 02-prompt-template.py
"""

from dataclasses import dataclass
from textwrap import dedent

import anthropic


@dataclass
class TripPlanRequest:
    destination: str
    duration_days: int
    party: str            # e.g. "family of four including a 6yo"
    constraints: str      # e.g. "motion sickness, halal food"
    budget_usd: int


PROMPT_V3 = dedent("""\
    You are helping plan a family trip. Be specific and realistic.

    Trip parameters:
    - Destination: {destination}
    - Duration: {duration_days} days
    - Party: {party}
    - Constraints to respect: {constraints}
    - Total budget: ${budget_usd} USD

    First, briefly list the main considerations that will shape this trip
    (weather, accessibility, the constraints above, the budget split between
    flights / lodging / food / activities). Two or three sentences only.

    Then produce a day-by-day plan. For each day include:
      1. Morning activity (with estimated cost)
      2. Lunch suggestion (cuisine, price tier)
      3. Afternoon activity (with estimated cost)
      4. Dinner suggestion
      5. One thing that could go wrong, and how to handle it

    End with a total estimated cost and a one-sentence risk note.

    If any constraint cannot reasonably be met within the budget,
    say so up front and explain what would need to give.
""")

SYSTEM = (
    "You are a careful, honest travel planner. "
    "You acknowledge what you don't know. "
    "You say so when a request can't reasonably be met within the constraints given."
)


def build_prompt(req: TripPlanRequest) -> str:
    return PROMPT_V3.format(**req.__dict__)


def plan_trip(req: TripPlanRequest) -> str:
    client = anthropic.Anthropic()
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=SYSTEM,
        messages=[{"role": "user", "content": build_prompt(req)}],
    )
    return response.content[0].text


if __name__ == "__main__":
    print(plan_trip(TripPlanRequest(
        destination="Tokyo",
        duration_days=5,
        party="family of four including a 6-year-old who gets motion sick",
        constraints="motion sickness, halal food where possible",
        budget_usd=4000,
    )))
