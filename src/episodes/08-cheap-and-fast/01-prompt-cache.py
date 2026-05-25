"""
Episode 8, sample 1 — provider-level prompt caching, done correctly.

For a long-running agent, the system prompt and the tool definitions
are identical across every turn. Caching them at the provider drops
input cost on calls 2..N by ~90%.

Run:
    export ANTHROPIC_API_KEY=...
    python 01-prompt-cache.py
"""

import anthropic

MODEL = "claude-sonnet-4-6"

# A deliberately large system prompt so the cache savings are visible.
LONG_SYSTEM = """\
You are a careful trip planner. You consider weather, accessibility,
dietary constraints, family composition, motion sickness, jet lag, and
budget. You acknowledge what you don't know. You explain the trade-offs
behind your choices. When constraints can't be met within budget, you
say so up front and explain what would need to give.
""" + "\n".join(
    f"Guideline {i}: Be specific, concrete, and conservative with estimates."
    for i in range(1, 80)
)


def call(messages, use_cache: bool):
    client = anthropic.Anthropic()
    if use_cache:
        system = [{
            "type": "text",
            "text": LONG_SYSTEM,
            "cache_control": {"type": "ephemeral"},   # cache this prefix
        }]
    else:
        system = LONG_SYSTEM
    return client.messages.create(
        model=MODEL,
        max_tokens=300,
        system=system,
        messages=messages,
    )


def show_usage(label: str, resp) -> None:
    u = resp.usage
    cache_read = getattr(u, "cache_read_input_tokens", 0) or 0
    cache_create = getattr(u, "cache_creation_input_tokens", 0) or 0
    print(f"{label:>16}  input={u.input_tokens}  cache_read={cache_read} "
          f"cache_create={cache_create}  output={u.output_tokens}")


if __name__ == "__main__":
    msgs = [{"role": "user", "content": "Pick one city for a March long weekend in Europe."}]

    print("WITHOUT prompt caching:")
    for i in range(3):
        r = call(msgs, use_cache=False)
        show_usage(f"call {i+1}", r)

    print("\nWITH prompt caching:")
    for i in range(3):
        r = call(msgs, use_cache=True)
        show_usage(f"call {i+1}", r)

    print("\nThe second and third 'with caching' calls should show "
          "cache_read ≈ the system prompt size and input ≈ just the user message.")
