"""
Episode 4, sample 1 — four memory strategies behind one interface.

Each strategy implements the same protocol (record, recall) so the
agent can be wired up against any of them and compared.

This file is for reading and unit testing, not for production. The
production wiring is in 02-hybrid-memory.py.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
class Turn:
    role: str
    content: str


class Memory(ABC):
    @abstractmethod
    def record(self, turn: Turn) -> None: ...

    @abstractmethod
    def recall(self, user_query: str) -> list[Turn]:
        """Return whatever context should be added to the next prompt."""


# 1. NoMemory — baseline. Every call is amnesia.
class NoMemory(Memory):
    def record(self, turn: Turn) -> None: return
    def recall(self, user_query: str) -> list[Turn]: return []


# 2. FullHistory — perfect recall, unbounded cost.
@dataclass
class FullHistory(Memory):
    history: list[Turn] = field(default_factory=list)
    def record(self, turn: Turn) -> None: self.history.append(turn)
    def recall(self, user_query: str) -> list[Turn]: return list(self.history)


# 3. RollingSummary — bounded cost, lossy recall.
@dataclass
class RollingSummary(Memory):
    window: int = 10
    summarize: callable = None        # injected: (old_summary, rolled_turn) -> new_summary
    history: list[Turn] = field(default_factory=list)
    summary: str = ""

    def record(self, turn: Turn) -> None:
        self.history.append(turn)
        if len(self.history) > self.window:
            rolled = self.history.pop(0)
            self.summary = self.summarize(self.summary, rolled) if self.summarize else self.summary

    def recall(self, user_query: str) -> list[Turn]:
        prefix = [Turn("system", f"Conversation summary so far: {self.summary}")] if self.summary else []
        return prefix + list(self.history)


# 4. Hybrid — summary for flow, vector recall for specific facts.
#    Full implementation lives in 02-hybrid-memory.py; this is the protocol stub.
@dataclass
class Hybrid(Memory):
    summary_mem: RollingSummary
    fact_store: object              # has .add(fact_text), .search(query, k) -> list[str]
    extractor: callable             # (recent_turns) -> list[str]  (new facts)

    def record(self, turn: Turn) -> None:
        self.summary_mem.record(turn)
        # extract facts from the last few turns (cheap, runs every N turns in production)
        recent = self.summary_mem.history[-4:]
        for fact in self.extractor(recent):
            self.fact_store.add(fact)

    def recall(self, user_query: str) -> list[Turn]:
        context = self.summary_mem.recall(user_query)
        facts = self.fact_store.search(user_query, k=5)
        if facts:
            context = [Turn("system", "Relevant facts about this user:\n- " + "\n- ".join(facts))] + context
        return context


# A tiny sanity check.
if __name__ == "__main__":
    m = FullHistory()
    m.record(Turn("user", "I prefer aisle seats."))
    m.record(Turn("assistant", "Noted."))
    print(m.recall("any seat preferences?"))
