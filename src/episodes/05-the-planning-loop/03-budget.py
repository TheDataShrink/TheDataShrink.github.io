"""
Episode 5, sample 3 — budgets and termination conditions.

A loop without a budget is a slot machine. This file wraps the ReAct
loop with hard caps on steps, tokens, and dollars; a no-progress
detector; and a clean shutdown that always returns a result with an
explicit completion status.

This is what you actually want to ship.
"""

import time
from dataclasses import dataclass, field
from typing import Callable


@dataclass
class Budget:
    max_steps: int = 12
    max_tokens: int = 50_000
    max_dollars: float = 1.00
    max_wall_seconds: float = 60.0
    max_repeated_observations: int = 3   # spinning detector

    # mutable counters
    steps: int = 0
    tokens: int = 0
    dollars: float = 0.0
    started_at: float = field(default_factory=time.time)
    seen_observations: list[str] = field(default_factory=list)

    def spend(self, tokens_in: int, tokens_out: int, price_per_mtok_in: float, price_per_mtok_out: float) -> None:
        self.tokens += tokens_in + tokens_out
        self.dollars += (tokens_in / 1_000_000) * price_per_mtok_in
        self.dollars += (tokens_out / 1_000_000) * price_per_mtok_out

    def record_observation(self, obs: str) -> None:
        self.seen_observations.append(obs[:200])

    def reason_to_stop(self) -> str | None:
        if self.steps >= self.max_steps: return "step_budget"
        if self.tokens >= self.max_tokens: return "token_budget"
        if self.dollars >= self.max_dollars: return "dollar_budget"
        if time.time() - self.started_at >= self.max_wall_seconds: return "wall_clock"
        # spinning: same observation N times in a row
        tail = self.seen_observations[-self.max_repeated_observations:]
        if len(tail) == self.max_repeated_observations and len(set(tail)) == 1:
            return "no_progress"
        return None


@dataclass
class Result:
    answer: str | None
    status: str            # "ok" | "step_budget" | "token_budget" | ...
    steps: int
    tokens: int
    dollars: float
    trace: list[dict] = field(default_factory=list)


def run_with_budget(
    react_step: Callable[[list[dict]], dict],
    initial_messages: list[dict],
    budget: Budget,
) -> Result:
    """
    react_step(messages) -> {
        "kind": "tool_use" | "final",
        "messages_out": [...],            # to append for the next iteration
        "tokens_in": int, "tokens_out": int,
        "observation_summary": str | None,
        "final_text": str | None,
    }
    """
    messages = list(initial_messages)
    trace: list[dict] = []

    while True:
        stop = budget.reason_to_stop()
        if stop:
            return Result(answer=None, status=stop, steps=budget.steps,
                          tokens=budget.tokens, dollars=budget.dollars, trace=trace)

        step = react_step(messages)
        budget.steps += 1
        budget.spend(step["tokens_in"], step["tokens_out"],
                     price_per_mtok_in=3.0, price_per_mtok_out=15.0)  # Sonnet pricing example
        trace.append(step)

        if step["kind"] == "final":
            return Result(answer=step["final_text"], status="ok",
                          steps=budget.steps, tokens=budget.tokens,
                          dollars=budget.dollars, trace=trace)

        messages.extend(step["messages_out"])
        if step.get("observation_summary"):
            budget.record_observation(step["observation_summary"])


# Usage sketch (the react_step would be adapted from 01-react.py):
#
#   result = run_with_budget(react_step, initial_messages, Budget(max_steps=8))
#   if result.status == "ok":
#       print(result.answer)
#   else:
#       print(f"stopped: {result.status} after {result.steps} steps, ${result.dollars:.4f}")
#       # partial result still available in result.trace; surface what you can
