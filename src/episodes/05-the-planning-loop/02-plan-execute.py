"""
Episode 5, sample 2 — plan-then-execute with parallel DAG and replanning.

The model produces a JSON plan: a small DAG of tool calls with
dependencies. The executor runs ready steps in parallel, surfaces
results, and lets the model replan when reality contradicts the plan.

Run:
    export ANTHROPIC_API_KEY=...
    python 02-plan-execute.py "compare weather in Tokyo, Kyoto, Osaka on 2026-05-28"
"""

import json
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
import importlib.util

import anthropic

MODEL = "claude-sonnet-4-6"

_ep2 = Path(__file__).resolve().parents[1] / "02-give-it-hands" / "01-tool-schema.py"
_spec = importlib.util.spec_from_file_location("tools_ep2", _ep2)
tools_ep2 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(tools_ep2)
TOOL_DESCS = [tools_ep2.WEATHER_TOOL, tools_ep2.HOTELS_TOOL]
FNS = {"get_weather": tools_ep2.get_weather, "search_hotels": tools_ep2.search_hotels}


PLAN_PROMPT = """\
You have these tools available:
{tools}

Produce a JSON plan to answer the user's question. Each step is one of:
  {{"type":"tool","id":"s1","tool":"name","input":{{...}},"depends_on":[]}}
  {{"type":"merge","id":"s4","depends_on":["s1","s2","s3"]}}

Rules:
- Steps with no dependencies run in parallel.
- A merge step combines prior results before the next stage.
- Keep the plan short. Fewest steps that will answer.

User question: {question}

Return ONLY the JSON object, no preamble. Shape: {{"steps":[...]}}.
"""

REPLAN_PROMPT = """\
Executed so far ({n_done} steps):
{executed}

Remaining planned steps:
{remaining}

Given the new information, choose one:
  {{"decision":"continue"}}
  {{"decision":"replan","new_steps":[...]}}
  {{"decision":"done","answer":"..."}}

Be conservative. Continue unless something has clearly changed.
"""


def call(messages: list[dict], max_tokens: int = 2000) -> str:
    client = anthropic.Anthropic()
    resp = client.messages.create(model=MODEL, max_tokens=max_tokens, messages=messages)
    return "".join(b.text for b in resp.content if b.type == "text").strip()


def make_plan(question: str) -> dict:
    prompt = PLAN_PROMPT.format(
        tools=json.dumps([{"name": t["name"], "description": t["description"]} for t in TOOL_DESCS], indent=2),
        question=question,
    )
    return json.loads(call([{"role": "user", "content": prompt}]))


def run_step(step: dict, results: dict) -> object:
    if step["type"] == "merge":
        return {d: results[d] for d in step["depends_on"]}
    fn = FNS[step["tool"]]
    return fn(**step["input"])


def execute_until_done(question: str, max_steps: int = 16) -> str:
    plan = make_plan(question)
    print("PLAN:", json.dumps(plan, indent=2))

    results: dict[str, object] = {}
    remaining: list[dict] = list(plan["steps"])
    executed_log: list[dict] = []

    for _ in range(max_steps):
        ready = [s for s in remaining if all(d in results for d in s["depends_on"])]
        if not ready:
            break

        # parallel execution of ready tool steps
        tool_ready = [s for s in ready if s["type"] == "tool"]
        merge_ready = [s for s in ready if s["type"] == "merge"]
        with ThreadPoolExecutor(max_workers=8) as ex:
            futures = {ex.submit(run_step, s, results): s for s in tool_ready}
            for fut in as_completed(futures):
                step = futures[fut]
                results[step["id"]] = fut.result()
                executed_log.append({"step": step, "result": results[step["id"]]})
                print(f"executed {step['id']} {step.get('tool','merge')}")
        for s in merge_ready:
            results[s["id"]] = run_step(s, results)
            executed_log.append({"step": s, "result": "merged"})
        for s in ready:
            remaining.remove(s)

        # replan check
        if remaining:
            resp = call([{"role": "user", "content": REPLAN_PROMPT.format(
                n_done=len(executed_log),
                executed=json.dumps(executed_log, default=str)[:4000],
                remaining=json.dumps(remaining),
            )}])
            try:
                decision = json.loads(resp)
            except json.JSONDecodeError:
                continue
            if decision["decision"] == "done":
                return decision["answer"]
            if decision["decision"] == "replan":
                remaining = decision["new_steps"]
                print("REPLANNED to:", json.dumps(remaining, indent=2))

    # synthesize a final answer from results
    final = call([{"role": "user", "content":
        f"Question: {question}\n\nTool results:\n{json.dumps(results, default=str)[:6000]}\n\n"
        "Write the final answer for the user."
    }])
    return final


if __name__ == "__main__":
    q = " ".join(sys.argv[1:]) or "compare weather in Tokyo, Kyoto, Osaka on 2026-05-28"
    print("\n=== FINAL ===\n" + execute_until_done(q))
