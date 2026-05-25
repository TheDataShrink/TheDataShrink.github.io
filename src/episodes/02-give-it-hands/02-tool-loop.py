"""
Episode 2, sample 2 — the smallest agent loop.

Send a question, let the model ask for tools, run them, send results
back, repeat until the model is done. A budget caps the loop.

Run:
    export ANTHROPIC_API_KEY=...
    python 02-tool-loop.py "Should we bring umbrellas for Tokyo on 2026-05-28?"
"""

import sys
import importlib.util
from pathlib import Path

import anthropic

# load tool definitions from the sibling file (filename starts with a digit)
_spec = importlib.util.spec_from_file_location(
    "tools", Path(__file__).parent / "01-tool-schema.py"
)
tools_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(tools_mod)

TOOLS = [tools_mod.WEATHER_TOOL, tools_mod.HOTELS_TOOL]
FUNCTIONS = {
    "get_weather": tools_mod.get_weather,
    "search_hotels": tools_mod.search_hotels,
}

SYSTEM = (
    "You are a careful trip planner. You have tools available. "
    "Use them when the answer depends on live information (weather, prices). "
    "Do not make up data you could look up."
)


def run_with_tools(user_question: str, max_turns: int = 5) -> str:
    client = anthropic.Anthropic()
    messages = [{"role": "user", "content": user_question}]

    for turn in range(max_turns):
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2048,
            system=SYSTEM,
            tools=TOOLS,
            messages=messages,
        )

        if response.stop_reason == "tool_use":
            # record the assistant's full response (text + tool_use blocks)
            messages.append({"role": "assistant", "content": response.content})

            # execute every tool the model asked for, in order
            tool_uses = [b for b in response.content if b.type == "tool_use"]
            results = []
            for use in tool_uses:
                fn = FUNCTIONS.get(use.name)
                if fn is None:
                    output = {"ok": False, "error": f"unknown tool: {use.name}"}
                else:
                    try:
                        output = fn(**use.input)
                    except Exception as e:
                        # let the model see what broke — don't silently swallow
                        output = {"ok": False, "error": f"{type(e).__name__}: {e}"}
                results.append({
                    "type": "tool_result",
                    "tool_use_id": use.id,
                    "content": str(output),
                })
            messages.append({"role": "user", "content": results})
            continue

        # the model is done — collect any text blocks and return
        text_parts = [b.text for b in response.content if b.type == "text"]
        return "\n".join(text_parts).strip()

    raise RuntimeError(f"agent did not finish within {max_turns} turns")


if __name__ == "__main__":
    question = (
        " ".join(sys.argv[1:])
        or "Should we bring umbrellas for our Tokyo trip on 2026-05-28?"
    )
    print(run_with_tools(question))
