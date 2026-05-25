# Episode 6 — How do I know it works? Evaluation

*Series: Building an Agent from Scratch. Episode 6 of 12.*

---

## Why this is the episode most people skip

If I asked you, *was your day good?*, you could answer. But if I asked
you *was today better than yesterday?*, you'd hesitate. Better at what?
Better for whom? Better by how much? Vague feelings don't compare.

That hesitation is, I'm sorry to say, the entire problem of evaluation
in AI. Most people building agents have a vague feeling that their
system is good. The feeling rises and falls with each demo. When
someone asks *did your last change help or hurt?*, they shrug. They've
been working on it for weeks. They have no idea.

This episode is about replacing the shrug with a number. Not a perfect
number — perfect doesn't exist in this work — but a defensible one.
Defensible enough that when you make a change and the number moves,
you can say *the change is responsible*, and mean it.

A father's principle: **what you don't measure, you assume you've
done well.** You haven't. Nobody has. Measurement is how you find
out, and finding out is how you improve. There is no shortcut.

This is the most important episode in the series. If you skip
everything else and only read this one, you'll still build better
agents than most people.

---

## Why agent evaluation is hard

A traditional ML model produces a single output for a single input.
You compare the output to a label, count the matches, divide. That's
accuracy. It's been refined into a thousand variants — F1, AUC,
calibration, fairness slices — but the shape is the same: deterministic
function, fixed comparison.

An agent doesn't work like that. The complications:

- **The output is text.** "Correct" isn't a class label; it's a
  judgment about whether the response is helpful, accurate, complete,
  and on-tone. Two correct answers can be completely different
  strings.
- **The process matters.** Two agents might both arrive at the right
  answer, but one took two tool calls and the other took fifteen. The
  second is worse even though the output is "the same."
- **It's stochastic.** Run the same prompt twice and you get two
  different responses. A single trial tells you almost nothing.
- **It's expensive.** Each evaluation run costs real money (API
  calls). You can't run 10,000 trials. You have to design carefully.
- **Failures are diverse.** A single number ("accuracy = 0.82") hides
  whether the 18% failures are wrong-but-confident hallucinations, or
  graceful "I don't know" responses, or system errors. Aggregate
  numbers can lull you to sleep while the failure mix gets worse.

The discipline that handles all of this exists. It's borrowed from
software testing, from traditional ML, from social science, and from a
few new techniques specific to language models. The combination is
sometimes called *evaluation engineering* — a job title that didn't
exist three years ago and is now everywhere in serious AI teams.

---

## Decide what "good" means before you measure

This is the step everyone wants to skip and everyone pays for. Before
you write a single line of evaluation code, write down what you mean
by good. Concretely. In a doc. Reviewed by another person.

A useful structure: for each kind of input your agent handles, write
down:

- **The intent.** What is the user trying to accomplish?
- **The must-haves.** What absolutely must be in the output?
- **The must-not-haves.** What would make the output wrong even if
  everything else were right?
- **The nice-to-haves.** What would make this output better than
  acceptable?
- **The acceptable failure modes.** When the agent can't do the task,
  what's the right way to say so?

For our trip planner:

- **Intent:** produce a travel plan that respects budget, constraints,
  and family composition.
- **Must-have:** day-by-day structure; total cost; explicit
  acknowledgment of constraints.
- **Must-not-have:** flights or hotels that don't exist; activities
  that violate constraints (e.g., long bus ride for the
  motion-sick child).
- **Nice-to-have:** explanations of why each choice was made; backup
  options; risk notes.
- **Acceptable failure:** *"This trip can't be done within $4000 in
  May; here's what would change with $4800 or a different month."*
  Refusing to plan is acceptable. Inventing a plan that doesn't fit is
  not.

This document is your **evaluation rubric.** Everything downstream —
the fixtures you build, the scorers you write, the judge prompts you
design — derives from it. Skip it, and you'll evaluate the wrong
thing.

---

## The four families of evaluation

Once you have a rubric, you can pick the right tool for each
criterion. There are four families and they're not interchangeable.

### 1. Exact match

Cheap, fast, certain. Used when the right answer is exactly one
string (a database lookup, a structured field). You can't use it for
freeform text, but where it applies, prefer it — it has zero
ambiguity.

### 2. Reference-based similarity

You have a "gold" answer and you compare the model's output to it.
Older methods: BLEU, ROUGE. Newer: embedding cosine similarity.
Useful for translation, summarization, anything with a defensible
"target output." Limitation: the model can be correct in a way that
doesn't match your reference, and you'll mark it wrong.

### 3. Functional correctness

The output is checked by running it. The clearest case is code: the
model writes code, you run the tests, you see what passes. Same idea
for SQL (does the query run, do the results match), for plans (does
the planned itinerary's cost actually sum to the budget), for any
output that's *executable* in any sense.

This is the most underused family. If your agent produces something
that can be checked mechanically, *do that.* It's cheap and it's
honest in a way the next family isn't.

### 4. AI-as-judge

You hand the model's output, the input, and a rubric to a different
(usually more powerful) model and ask: *did this meet the rubric?*
The judge model returns a score and a justification.

This is the only honest way to evaluate freeform outputs at scale.
It's also the most dangerous, because the judge can be wrong, biased,
or game-able.

Rules for using AI judges without lying to yourself:

- **Use the strongest model you can afford** for judging, even if
  your agent uses a cheaper one. The judge needs to be smarter than
  the judged.
- **Run each judgment 3–5 times and take the median.** Single
  judgments are too noisy.
- **Validate the judge against humans** on a sample of 50–100 cases.
  If the judge and humans agree less than 80% of the time, your judge
  is unreliable for that task.
- **Never use the same model to do the work and to judge it.**
  Self-judgment is biased upward.

---

## The harness

The harness is the program that runs all of this. Inputs go in,
agent runs over each, scorers score each output, results aggregate
into a report.

```python
# 01-eval-harness.py (excerpt)
@dataclass
class Fixture:
    id: str
    input: dict                 # what to feed the agent
    rubric: dict                # criteria to apply
    expected: dict | None = None  # for reference-based scoring

@dataclass
class Score:
    fixture_id: str
    metric: str
    value: float
    details: dict = field(default_factory=dict)

def run_eval(agent: Callable, fixtures: list[Fixture], scorers: list[Callable]) -> list[Score]:
    scores: list[Score] = []
    for fx in fixtures:
        output = agent(**fx.input)
        for scorer in scorers:
            scores.extend(scorer(fx, output))
    return scores
```

The shape that matters:

- **The agent is a function.** It takes typed inputs, returns a typed
  output. Same shape as Episode 1's `plan_trip(req)`. If your real
  agent isn't a function (it's a server, it's stateful), wrap it in a
  thin function for evaluation.
- **The scorer is a function.** It takes a fixture and an output and
  returns a list of scores. One scorer per metric. Composable.
- **Scores are typed records.** Each has a fixture id, a metric name,
  a value, and optional details. This makes downstream analysis
  trivial.
- **Nothing happens implicitly.** No hidden state, no global config,
  no surprises six months from now.

---

## Building the fixture set

The fixture set is everything. A bad fixture set will tell you your
agent is great when it isn't, or terrible when it's fine. Treat it
with the seriousness of test data, because that's what it is.

Sources, in order of preference:

1. **Real user inputs from production.** Sample broadly. Anonymize.
   Include the boring queries, not just the spicy ones. The boring
   queries are most of the traffic.
2. **Real user inputs that failed.** Every reported bug becomes a
   fixture. This is how the eval set grows over time, and it's where
   it gets most of its teeth.
3. **Constructed adversarial cases.** Inputs you know are hard:
   ambiguous, contradictory, near-the-edge-of-the-rubric. These catch
   regressions in the corners.
4. **Synthetic inputs.** A model generates plausible queries. Useful
   for coverage, weakest signal. Use last.

Size: 30 fixtures is the minimum for any signal at all. 100 is the
threshold below which I don't trust deltas between agent versions.
1000 is where you start being able to slice by category. Most teams
have 50 and pretend they have 500.

A father's principle, painfully relevant: **the fixtures you don't
include are the bugs you don't catch.** Bias toward including the
ugly, embarrassing, or boring cases. Especially the boring ones.

---

## A judge that doesn't lie

Here's a working pattern for an AI judge with self-consistency.

```python
# 02-llm-judge.py (excerpt)
JUDGE_PROMPT = """\
You are evaluating a trip plan against a rubric.

Original request:
{request}

Rubric:
{rubric}

Plan produced by the agent:
{output}

For each rubric criterion, decide PASS or FAIL and explain in one
sentence. Then give an overall score from 1 (unusable) to 5
(excellent).

Return JSON:
{{
  "criteria": [
    {{"name": "...", "verdict": "PASS"|"FAIL", "reason": "..."}}
  ],
  "overall": 1-5,
  "overall_reason": "..."
}}

Be strict. If a criterion is borderline, FAIL it. We can always
relax later.
"""

def judge(request: str, rubric: str, output: str, n_samples: int = 5) -> dict:
    client = anthropic.Anthropic()
    judgments = []
    for _ in range(n_samples):
        resp = client.messages.create(
            model="claude-opus-4-7",     # judge with the strongest available
            max_tokens=1500,
            messages=[{"role": "user", "content":
                JUDGE_PROMPT.format(request=request, rubric=rubric, output=output)}],
        )
        try:
            judgments.append(json.loads(resp.content[0].text))
        except json.JSONDecodeError:
            continue
    # take the median overall score; aggregate per-criterion verdicts by majority
    overall = sorted(j["overall"] for j in judgments)[len(judgments)//2]
    return {"overall": overall, "n_samples": len(judgments),
            "criteria": _aggregate_criteria(judgments)}
```

Key choices:

- **Strong judge model, fixed.** Don't change it per run — you'll
  introduce variance you can't attribute. Pin it.
- **N samples, take median.** Five is the cheap sweet spot. The
  median is robust to one outlier judgment.
- **Per-criterion verdicts.** A scalar overall score hides which
  criterion is failing. Track both.
- **Bias toward strictness.** Loose judges drift upward over time
  as you tune your agent to pass the judge. Strict judges give
  honest signal longer.

---

## How many runs is enough?

You ran your fixture set with the old prompt. Average score: 3.8.
You ran it again with the new prompt. Average score: 3.9. Is the new
one better?

You don't know. Maybe it is. Maybe the stochastic noise of LLM outputs
plus stochastic noise of judge outputs accounts for the entire delta.
You need to know how big a delta you'd expect by *pure chance.*

This is where statistics earns its keep. The right tool here is
**bootstrap confidence intervals**: re-sample your fixture results
with replacement many times, compute the metric on each resample, and
look at the distribution.

```r
# 03-significance.R
library(boot)

# scores: a data frame with columns (fixture_id, version, score)
delta_stat <- function(d, idx) {
  d <- d[idx, ]
  mean(d$score[d$version == "new"]) - mean(d$score[d$version == "old"])
}

b <- boot(scores, delta_stat, R = 2000, strata = scores$version)
ci <- boot.ci(b, type = "perc")
cat("delta =", b$t0, "  95% CI:", ci$percent[4], "to", ci$percent[5], "\n")
```

If the 95% confidence interval crosses zero, you cannot claim the new
version is better. You might *suspect* it. You can't claim it.

R is the right tool for this because R was built for exactly this
kind of inferential work. You can do it in Python (`scipy.stats` or
`scipy.stats.bootstrap`) — fine, do that if your stack is Python. The
shape of the answer is the same.

A father's principle: **a real improvement survives the confidence
interval. Don't ship the ones that don't.**

---

## Slices

A single "the agent is good" number is rarely actionable. What you
want is *the agent is good on Tokyo trips, mediocre on Iceland trips,
and terrible on multi-stop trips*. That tells you where to spend the
next week.

Bake slicing into the harness from day one. Tag every fixture with
attributes (`region`, `complexity`, `language`, `length`,
`user_segment`). When you report, report per slice and look for
outliers.

The most expensive bugs hide in slices. The aggregate number says
*82%*. The slice says *Mandarin queries are at 48%*. Without slices,
you ship.

---

## The eval flywheel

The bigger insight, after you've done all this for a while: **the
fixture set is itself a product.** It grows with every user complaint,
every regression caught, every new use case. A team's eval set is
often worth more than its prompt, because the prompt is easy to write
once you can measure the change.

The loop:

1. User reports a bad output → fixture added.
2. Internal trace of a bad output → fixture added.
3. New feature shipped → fixtures for the feature added.
4. Periodic review → unused or stale fixtures pruned.
5. Eval runs on every prompt/model change in CI.

Over months, this set becomes the institutional memory of *what's
hard about your problem.* New engineers run the eval and understand
the system in a way that no documentation could teach them. The
hardest fixtures become the textbook of the work.

This is the part of AI engineering that looks most like ordinary
engineering: slow, accumulative, deeply unglamorous, the difference
between systems that work and systems that don't.

---

## What you have now

The agent now has:

- A written rubric for what "good" means.
- A growing fixture set of real and adversarial inputs.
- A harness that runs the agent over fixtures and applies scorers.
- A mix of exact-match, functional, and AI-judge scoring, used where
  each fits.
- Statistical tests to tell signal from noise when comparing
  versions.
- Per-slice reporting to catch the failures that hide in averages.

This is *real* engineering discipline applied to AI. It's also where
most teams' AI quality plateau actually breaks. They were tuning
prompts on vibes; with measurement, the vibes resolve into a list of
things to actually fix.

---

## Where we go next

Episode 7 takes the failures the evaluation surfaces and sorts them
into a small taxonomy: the five shapes of agent failure that account
for most of what goes wrong. You'll find that "the agent is bad" is
almost never the right diagnosis. There are five real diagnoses, and
each has its own fix.

— Dad

---

*Code: `01-eval-harness.py` (the runner), `02-llm-judge.py` (judge
with self-consistency), `03-significance.R` (bootstrap confidence
intervals on score deltas).*

*Source: Chip Huyen,* AI Engineering, *Chapter 3 (Evaluation
Methodology) and Chapter 4 (Evaluate AI Systems). Recommended
papers: "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena"
(Zheng et al., 2023); "The Reliability of LLMs as Annotators"
(Wang et al., 2023). Recommended tool: OpenAI's `evals` framework as a
reference for the harness shape, even if you don't use it.*
