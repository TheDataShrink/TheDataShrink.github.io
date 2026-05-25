"""
Episode 5, sample 1 — ReAct from scratch with explicit tracing.

The smallest honest agent loop. Thought → action → observation, repeat.
Every step gets logged so you can read the trace afterward, which is
the single most useful debugging artifact in agent work.

Run:
    export ANTHROPIC_API_KEY=...
    python 01-react.py "should we bring umbrellas for Tokyo on 2026-05-28?"
"""

import json
import sys
from typing import Callable

import anthropic

MODEL = "claude-sonnet-4-6"

# import the tools from Episode 2 — this is the same agent, growing.
import importlib.util
from pathlib import Path
_ep2 = Path(__file__).resolve().parents[1] / "02-give-it-hands" / "01-tool-schema.py"
_spec = importlib.util.spec_from_file_location("tools_ep2", _ep2)
tools_ep2 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(tools_ep2)

TOOLS = [tools_ep2.WEATHER_TOOL, tools_ep2.HOTELS_TOOL]
FNS = {"get_weather": tools_ep2.get_weather, "search_hotels": tools_ep2.search_hotels}

SYSTEM = (
    "You are a careful trip planner. Reason briefly about what you need "
    "to find out, then call the tool that will tell you. Repeat until you "
    "can answer the user's question. Be honest about what you don't know."
)


class StopBudget(RuntimeError):
    pass


def log(kind: str, payload: str) -> None:
    print(f"[{kind:>11}] {payload}")


def react(question: str, max_steps: int = 8) -> str:
    client = anthropic.Anthropic()
    messages = [{"role": "user", "content": question}]
    log("user", question)

    for step in range(max_steps):
        resp = client.messages.create(
            model=MODEL,
            max_tokens=2048,
            system=SYSTEM,
            tools=TOOLS,
            messages=messages,
        )

        thoughts = [b.text for b in resp.content if b.type == "text"]
        for t in thoughts:
            if t.strip():
                log("thought", t.strip()[:200])

        if resp.stop_reason == "tool_use":
            uses = [b for b in resp.content if b.type == "tool_use"]
            messages.append({"role": "assistant", "content": resp.content})

            results = []
            for use in uses:
                log("action", f"{use.name}({json.dumps(use.input)})")
                fn: Callable = FNS.get(use.name)
                if fn is None:
                    output = {"ok": False, "error": f"unknown tool: {use.name}"}
                else:
                    try:
                        output = fn(**use.input)
                    except Exception as e:
                        output = {"ok": False, "error": f"{type(e).__name__}: {e}"}
                log("observation", str(output)[:200])
                results.append({
                    "type": "tool_result",
                    "tool_use_id": use.id,
                    "content": str(output),
                })
            messages.append({"role": "user", "content": results})
            continue

        final = "\n".join(thoughts).strip()
        log("final", final[:200])
        return final

    raise StopBudget(f"reached {max_steps} steps without a final answer")


if __name__ == "__main__":
    q = " ".join(sys.argv[1:]) or "should we bring umbrellas for Tokyo on 2026-05-28?"
    react(q)
