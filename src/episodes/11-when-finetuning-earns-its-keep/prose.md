# Episode 11 — When finetuning earns its keep

*Series: Building an Agent from Scratch. Episode 11 of 12 (optional).*

---

## A note before we start

Most agents don't need finetuning. I want to say that first, because
the rest of the series taught you many things, and people who learn
many things sometimes want to use all of them. You don't. The
default answer to *"should I finetune?"* is *no.* This episode is
about recognizing the small minority of cases where the default
answer is wrong.

A father's principle, and an honest one: **the most expensive tool
in the box is rarely the right one.** Reach for it last, with
intention, after you've genuinely exhausted the cheaper options.
The cheaper options here are everything in Episodes 1–10. Most
agents that get reached-for-finetuning have not yet exhausted
those.

---

## The four conditions

In my experience, finetuning earns its keep when *all four* of these
are true. Not three. All four.

### 1. You've hit a quality ceiling with prompting

You've iterated on prompts. You've used the best available model.
You've added retrieval (Episode 3), memory (Episode 4), and the
planner (Episode 5). Your eval harness (Episode 6) shows you're
plateauing — the same fixtures keep failing, and no prompt change
moves the needle.

If you haven't done all of this, you haven't hit a prompting
ceiling. You've hit a *current effort* ceiling. Push more on
prompting first; it's an order of magnitude cheaper than finetuning
and the gains are usually still on the table.

### 2. The failures share a pattern you can describe

Vague *"the answers feel off"* is not a finetuning case. Specific
*"the model uses the wrong terminology for our domain in 30% of
responses"* or *"the model doesn't follow our specific output
format reliably"* — that's a finetuning case.

If you can't describe the pattern in a sentence, you can't build a
dataset to fix it. The pattern is the spec.

### 3. You have, or can get, real training data

The lower bound is *a few hundred high-quality examples,* the upper
bound depends on the technique. Real, in-distribution data — from
production usage, from your domain experts, from the eval fixture
set you've been accumulating since Episode 10.

If you're tempted to generate the training data with another model,
think carefully. Synthetic data can work, but a finetune on synthetic
data is one step further from reality than a prompt with synthetic
examples in it. Don't take that step lightly.

### 4. The economics actually work

A finetune costs money to train, deploy, and maintain. It locks you
to a specific model version (or family) until you re-finetune. It
makes A/B comparisons harder. It complicates rollbacks.

If your call volume is low, the savings (cheaper smaller model
matching the quality of a bigger one) won't pay for the engineering.
If your domain shifts quickly, the finetune will go stale faster
than you can refresh it.

The threshold I use: finetuning becomes worth considering at
**~1M model calls per week** *or* a clear specific behavior you
can't achieve any other way. Below that, the engineering rarely
pencils out.

---

## Decide first, then start

Before any training, write down:

- The pattern you're trying to fix (one sentence).
- The baseline metric on that pattern from your eval harness.
- The target metric after finetuning (be honest about realistic
  gains — usually 5–15 percentage points on the targeted slice).
- The data you'll use, where it came from, how it was cleaned.
- The budget for the experiment (dollars and time).
- The rollback plan.

This document is the equivalent of the eval rubric from Episode 6.
It's the difference between a finetune you can justify and a
finetune that just makes everyone feel busy.

```python
# 01-when-not-to.py (excerpt)
def should_we_finetune(state: ProjectState) -> Verdict:
    blockers = []
    if not state.prompting_plateaued:
        blockers.append("Not yet plateaued on prompting.")
    if not state.pattern_describable_in_one_sentence:
        blockers.append("Failure pattern is not specific enough.")
    if state.training_examples_count < 200:
        blockers.append(f"Only {state.training_examples_count} examples; need 200+.")
    if state.weekly_call_volume < 1_000_000 and not state.behavior_unachievable_otherwise:
        blockers.append("Volume too low to amortize finetune cost.")
    return Verdict(
        recommendation="finetune" if not blockers else "do_not_finetune",
        reasons=blockers or ["all four conditions met"],
    )
```

If this function returns *do_not_finetune*, listen to it. The
function is doing the dispassionate accounting that you, after a
month of frustration with a hard problem, may not be able to do.

---

## Dataset quality is the real blocker

Almost every team that successfully finetunes will tell you the
same thing: **the model training was the easy part. The data work
was the hard part.**

The data work means:

- **Sourcing.** Where do high-quality examples come from? Real
  production traces, expert-written examples, manually labelled
  edge cases. Pure synthetic data is the weakest source.
- **Cleaning.** Dedup. Remove personally-identifying information.
  Remove examples that don't actually demonstrate the target
  behavior. Remove examples that contradict each other.
- **Coverage.** Are all the slices represented? If your eval harness
  shows the agent struggles on Mandarin and on multi-stop trips,
  the training set must include Mandarin examples and multi-stop
  examples.
- **Quality.** Each example should be the kind of response you'd be
  proud to ship. *"Pretty close"* is not good enough; you're
  teaching the model your standard, and the standard you teach is
  the standard you'll get back.
- **Held-out test set.** A slice that is *never seen* during
  training, used only for evaluation. Without this you can't tell
  if you're overfitting.

```r
# 02-data-quality.R (excerpt)
library(dplyr)

dataset <- read.csv("training_examples.csv")

cat("rows                  :", nrow(dataset), "\n")
cat("duplicate inputs      :",
    nrow(dataset) - length(unique(dataset$input)), "\n")
cat("avg input length      :", mean(nchar(dataset$input)), "\n")
cat("avg output length     :", mean(nchar(dataset$output)), "\n")
cat("coverage by tag       :\n")
print(dataset %>% count(tag) %>% arrange(desc(n)))
cat("leakage with eval set :",
    sum(dataset$input %in% read.csv("eval_fixtures.csv")$input), "\n")
```

The leakage check is critical. If a training example appears in
your eval set, your "improvement" after finetuning will be partly
the model memorizing the answer. A leak of even a few percent can
make a finetune look much better than it is.

A father's principle: **the test is a test only if the student
hasn't seen it.** Holds for school. Holds for models.

---

## PEFT / LoRA in fifty lines

When the four conditions are met and the dataset is ready, the
actual training is anticlimactic. **Parameter-Efficient Fine-Tuning
(PEFT)** — specifically, the **LoRA** technique — has made
finetuning a small open model something a single engineer can do
on a single GPU.

LoRA trains a small set of additional matrices that are added to
the base model's weights, instead of updating all the weights.
Result: training is faster, the artifact is smaller (often
megabytes instead of gigabytes), and the base model can be swapped
or upgraded without invalidating prior work.

```python
# 03-lora.py (excerpt)
from datasets import load_dataset
from peft import LoraConfig, get_peft_model, TaskType
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer

BASE = "meta-llama/Llama-3.1-8B-Instruct"   # or your chosen base

tok = AutoTokenizer.from_pretrained(BASE)
base_model = AutoModelForCausalLM.from_pretrained(BASE, torch_dtype="auto", device_map="auto")

lora_cfg = LoraConfig(
    r=16, lora_alpha=32, lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"],
    task_type=TaskType.CAUSAL_LM,
)
model = get_peft_model(base_model, lora_cfg)
model.print_trainable_parameters()    # prints e.g. 0.3% trainable

ds = load_dataset("json", data_files="training_examples.jsonl")
def fmt(ex):
    text = f"<|user|>\n{ex['input']}\n<|assistant|>\n{ex['output']}"
    return tok(text, truncation=True, max_length=2048, padding="max_length")
ds = ds.map(fmt, remove_columns=ds["train"].column_names)

args = TrainingArguments(
    output_dir="./lora-out", num_train_epochs=3,
    per_device_train_batch_size=4, gradient_accumulation_steps=4,
    learning_rate=2e-4, fp16=True, logging_steps=10, save_steps=200,
)
Trainer(model=model, args=args, train_dataset=ds["train"]).train()

model.save_pretrained("./lora-out/final")
```

Read it carefully — there's almost nothing surprising. The HuggingFace
ecosystem has made this fifty lines instead of a thousand. The
ceremony is gone. What's left is the part that actually matters: the
data.

---

## Model merging: an experimental but interesting alternative

Worth mentioning: **model merging.** Take two or more existing models
(your finetune + the base, or two community finetunes, or a domain
finetune + a base) and combine their weights mathematically. No
training required. Sometimes the merged model is better than either
input.

The technique is newer, more experimental, but cheaper than
finetuning. Worth knowing about. Tools like `mergekit` make it
accessible. I won't go deeper here because the field is moving fast
and what I write today will be wrong in six months. If you're
exploring finetuning seriously, also look at merging — it might
solve your problem without the training step.

---

## Evaluating the finetune honestly

After training, run your full eval harness from Episode 6. Compare
to the baseline. Apply the bootstrap confidence intervals from
Episode 6's `03-significance.R` to confirm the improvement is real.

Specifically check:

- **The target metric improved** on the held-out test slice (not
  the training slice).
- **Other metrics did not regress** by more than 1–2 percentage
  points. Finetuning often improves one thing and quietly degrades
  others. If it does, you need to expand the training set to cover
  those slices too.
- **Cost per call** is what you projected. A poorly-quantized
  finetune can end up slower or larger than the base.
- **Behavior on adversarial inputs** hasn't worsened. Finetuning on
  helpful examples can erode safety training. Re-run your
  guardrail tests (Episode 9).

If any of these fail, you don't ship. You go back to the data or
to the training config. *"Almost"* doesn't deploy.

---

## What you have now

If you've reached this episode and decided to finetune, the agent
now has:

- A specific, measurably-improved behavior on the target slice.
- A documented training process with reproducible data.
- An audit trail of why the finetune was justified.
- A rollback plan if it doesn't hold up in production.

If you've reached this episode and decided *not* to finetune,
congratulations — you've made the right call for the majority of
agent projects. The optionality of finetuning is the value; using
it is the exception.

---

## A closing word

This is the last episode of the build arc. The series went:

- **Episode 0:** what an agent is.
- **Episode 1:** the prompted baseline.
- **Episode 2:** tools — giving it hands.
- **Episode 3:** RAG — giving it knowledge.
- **Episode 4:** memory — letting it remember.
- **Episode 5:** the planning loop — letting it decide.
- **Episode 6:** evaluation — knowing if it works.
- **Episode 7:** failure modes — knowing how it breaks.
- **Episode 8:** cost discipline — making it cheap enough.
- **Episode 9:** guardrails, gateway, observability — wrapping it
  in production.
- **Episode 10:** the feedback loop — getting better over time.
- **Episode 11 (this one):** finetuning, when warranted.

Through-line: from a single API call to a full feedback-driven
system. The agent grew one capability at a time, and each
capability rested on the ones before. Nothing was thrown away.
Nothing was magic.

The way you build everything important works like this. Slowly.
With measurement. With humility about what you don't know yet.
With curiosity about what the world is telling you back. With
the discipline to stop when stopping is the right answer.

I love you both. Go build something kind.

— Dad

---

*Code: `01-when-not-to.py` (decision-checklist script for whether to
finetune), `02-data-quality.R` (dataset quality and leakage stats),
`03-lora.py` (a minimal LoRA finetune on a small open model).*

*Source: Chip Huyen,* AI Engineering, *Chapter 7 (Finetuning) —
especially "When to Finetune" (p311) and "Memory Math" (p322) — and
Chapter 8 (Dataset Engineering). Recommended reading: the original
LoRA paper (Hu et al., 2021); the QLoRA paper (Dettmers et al., 2023);
the `mergekit` documentation for the merging side-track.*
