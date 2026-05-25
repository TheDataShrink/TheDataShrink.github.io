"""
Episode 11, sample 1 — the "should we finetune" decision checklist as a script.

A small, opinionated function that takes the state of your project and
returns a verdict. The point is the disposition, not the implementation —
the function is doing the dispassionate accounting that you may not be
able to do after a month of frustration with a hard problem.

Run:
    python 01-when-not-to.py
"""

from dataclasses import dataclass


@dataclass
class ProjectState:
    prompting_plateaued: bool                       # Episodes 1, 5 done thoroughly?
    pattern_describable_in_one_sentence: bool       # can you state the failure?
    training_examples_count: int                    # real, in-distribution
    weekly_call_volume: int                         # 1M+ is the rough threshold
    behavior_unachievable_otherwise: bool           # is this the only way?
    legal_ok_to_use_data: bool = True               # don't skip this one
    rollback_plan_exists: bool = False


@dataclass
class Verdict:
    recommendation: str        # "finetune" | "do_not_finetune"
    reasons: list[str]


def should_we_finetune(state: ProjectState) -> Verdict:
    blockers: list[str] = []

    if not state.prompting_plateaued:
        blockers.append(
            "You haven't plateaued on prompting. Push prompt engineering, "
            "retrieval, memory, and the planner before reaching for finetuning."
        )

    if not state.pattern_describable_in_one_sentence:
        blockers.append(
            "Failure pattern is too vague. Describe it in one sentence "
            "before building a dataset to fix it."
        )

    if state.training_examples_count < 200:
        blockers.append(
            f"Only {state.training_examples_count} examples; need ~200+ "
            "in-distribution, high-quality, deduplicated."
        )

    if state.weekly_call_volume < 1_000_000 and not state.behavior_unachievable_otherwise:
        blockers.append(
            "Call volume is below ~1M/week. Finetune engineering cost is "
            "unlikely to amortize unless this is a behavior you can't get "
            "any other way."
        )

    if not state.legal_ok_to_use_data:
        blockers.append("Legal review of training data not cleared. Stop.")

    if not state.rollback_plan_exists:
        blockers.append(
            "No rollback plan documented. Don't ship a finetune you can't "
            "back out of in under an hour."
        )

    if not blockers:
        return Verdict("finetune", ["all conditions met; proceed with documented experiment"])
    return Verdict("do_not_finetune", blockers)


def report(verdict: Verdict) -> None:
    print(f"\nrecommendation: {verdict.recommendation.upper()}\n")
    for r in verdict.reasons:
        print(f"  - {r}")


if __name__ == "__main__":
    # plug your real numbers in here
    state = ProjectState(
        prompting_plateaued=True,
        pattern_describable_in_one_sentence=True,
        training_examples_count=420,
        weekly_call_volume=2_500_000,
        behavior_unachievable_otherwise=False,
        legal_ok_to_use_data=True,
        rollback_plan_exists=True,
    )
    report(should_we_finetune(state))

    print("\n--- contrast: a project that should NOT finetune ---")
    weak = ProjectState(
        prompting_plateaued=False,
        pattern_describable_in_one_sentence=False,
        training_examples_count=40,
        weekly_call_volume=20_000,
        behavior_unachievable_otherwise=False,
    )
    report(should_we_finetune(weak))
