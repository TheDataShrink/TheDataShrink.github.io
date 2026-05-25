"""
Episode 1, sample 1 — the baseline.

The smallest honest thing you can build with a language model.
No framework, no abstractions. Three real lines of work.

Run:
    export ANTHROPIC_API_KEY=...
    python 01-baseline.py
"""

import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from the environment

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": (
            "Plan a 5-day Tokyo trip for a family of four "
            "with a 6-year-old who gets motion sick. Budget $4000 USD."
        ),
    }],
)

print(response.content[0].text)
