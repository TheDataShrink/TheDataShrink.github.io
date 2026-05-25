"""
Episode 8, sample 3 — confidence-based model routing.

Always try the cheap model first. If its answer is low-confidence or
fails a validation check, escalate to the smart model. This pays
smart-model price only when needed.

Run:
    export ANTHROPIC_API_KEY=...
    python 03-router.py "is it usually warm in tokyo in may?"
"""

import json
import sys

import anthropic

CHEAP_MODEL = "claude-haiku-4-5-20251001"
SMART_MODEL = "claude-sonnet-4-6"

CONFIDENCE_PROMPT_SUFFIX = """

After your answer, on a new line, emit a JSON line ONLY:
{"confidence": 0.0-1.0, "needs_smarter_model": true|false}
"""


def call(model: str, query: str, max_tokens: int = 600) -> tuple[str, dict]:
    client = anthropic.Anthropic()
    resp = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": query + CONFIDENCE_PROMPT_SUFFIX}],
    )
    text = "".join(b.text for b in resp.content if b.type == "text")
    # the last line should be the JSON marker
    lines = [ln for ln in text.strip().splitlines() if ln.strip()]
    meta = {"confidence": 0.5, "needs_smarter_model": False}
    if lines:
        try:
            meta = json.loads(lines[-1])
            text = "\n".join(lines[:-1]).strip()
        except json.JSONDecodeError:
            pass
    return text, meta


def answer(query: str,
           confidence_floor: float = 0.7) -> tuple[str, dict]:
    cheap_text, cheap_meta = call(CHEAP_MODEL, query)
    if cheap_meta.get("needs_smarter_model") or cheap_meta.get("confidence", 0) < confidence_floor:
        smart_text, smart_meta = call(SMART_MODEL, query)
        return smart_text, {
            "route": "smart_after_cheap",
            "cheap_confidence": cheap_meta.get("confidence"),
            "smart_confidence": smart_meta.get("confidence"),
        }
    return cheap_text, {"route": "cheap_only", "confidence": cheap_meta.get("confidence")}


if __name__ == "__main__":
    q = " ".join(sys.argv[1:]) or "what's the capital of japan?"
    text, meta = answer(q)
    print(text)
    print(f"\n[route: {meta}]")
