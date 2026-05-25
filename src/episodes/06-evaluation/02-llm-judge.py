"""
Episode 6, sample 2 — AI-as-judge with self-consistency.

The judge runs N times per output. We take the median overall score
and majority-vote each per-criterion verdict. This is the cheapest
honest way to score freeform output.

Validate the judge against humans on 50–100 cases before trusting it.
If agreement is below ~80%, the judge is unreliable for your task and
you need to either improve the rubric or change the judge model.

Run:
    export ANTHROPIC_API_KEY=...
    python 02-llm-judge.py
"""

import json
import statistics
from collections import Counter

import anthropic

JUDGE_MODEL = "claude-opus-4-7"   # judge with the strongest available


JUDGE_PROMPT = """\
You are evaluating an agent output against a rubric. Be strict. If a
criterion is borderline, FAIL it.

Original request:
{request}

Rubric:
{rubric}

Agent output:
{output}

For each rubric criterion, decide PASS or FAIL and give a one-sentence
reason. Then give an overall score from 1 (unusable) to 5 (excellent).

Return JSON only:
{{
  "criteria": [
    {{"name": "<criterion name>", "verdict": "PASS"|"FAIL", "reason": "..."}}
  ],
  "overall": 1,
  "overall_reason": "..."
}}
"""


def _aggregate_criteria(judgments: list[dict]) -> list[dict]:
    by_name: dict[str, list[dict]] = {}
    for j in judgments:
        for c in j.get("criteria", []):
            by_name.setdefault(c["name"], []).append(c)
    out = []
    for name, items in by_name.items():
        verdicts = [i["verdict"] for i in items]
        verdict = Counter(verdicts).most_common(1)[0][0]
        out.append({
            "name": name,
            "verdict": verdict,
            "agreement": verdicts.count(verdict) / len(verdicts),
            "sample_reason": items[0]["reason"],
        })
    return out


def judge(request: str, rubric: str, output: str, n_samples: int = 5) -> dict:
    client = anthropic.Anthropic()
    judgments: list[dict] = []
    for _ in range(n_samples):
        resp = client.messages.create(
            model=JUDGE_MODEL,
            max_tokens=1500,
            messages=[{"role": "user", "content":
                JUDGE_PROMPT.format(request=request, rubric=rubric, output=output)}],
        )
        try:
            judgments.append(json.loads(resp.content[0].text))
        except json.JSONDecodeError:
            continue
    if not judgments:
        return {"overall": 0, "n_samples": 0, "criteria": [], "error": "no valid judgments"}

    overall_scores = sorted(j["overall"] for j in judgments)
    median_overall = overall_scores[len(overall_scores) // 2]
    return {
        "overall": median_overall,
        "overall_stdev": statistics.pstdev(overall_scores) if len(overall_scores) > 1 else 0.0,
        "n_samples": len(judgments),
        "criteria": _aggregate_criteria(judgments),
    }


if __name__ == "__main__":
    demo = judge(
        request="Plan 3 days in Reykjavik for a solo traveler, $1500, no driving.",
        rubric=(
            "- has day-by-day structure\n"
            "- respects $1500 budget with explicit total\n"
            "- does not require driving\n"
            "- includes indoor backup plans for bad weather"
        ),
        output=(
            "Day 1: Blue Lagoon (shuttle from airport).\n"
            "Day 2: City walking tour, Hallgrimskirkja, Harpa.\n"
            "Day 3: Golden Circle bus tour.\n"
            "Indoor backups: Perlan museum, Sundhollin pool.\n"
            "Total: $1380."
        ),
        n_samples=5,
    )
    print(json.dumps(demo, indent=2))
