# Series: Building an Agent from Scratch

A 12-episode arc on building a working, evaluated, production-shaped AI agent.
Curated from Chip Huyen's *AI Engineering: Building Applications with Foundation Models*
(O'Reilly, Dec 2024) — used as one source among others. Voice is the author's own;
the book is cited where it's the best reference, not the spine.

**Format:** long-form (~20–30 min read), multiple code samples per episode,
mixed languages (Python is the backbone; R for stats; SQL for retrieval/memory;
JS/D3 for visualizations).

**Through-line:** each episode adds *one capability* to the agent built in the prior
episode. By Ep 5 you have a real ReAct loop. By Ep 10 you have something that could
plausibly run in production.

---

## Episode 0 — What even is an agent?

- **Hook:** Most people use "agent" to mean four different things. Pick one before you build.
- **Source:** Huyen Ch 1 (intro), Ch 6 §Agents Overview p275–278.
- **Sections:**
  1. The pre-LLM history (RL agents, expert systems) — what carries over, what doesn't.
  2. The minimum viable definition: *LLM in a loop that can take actions and observe results.*
  3. Four common uses of the word "agent" (chatbot wrapper, function-caller, autonomous worker, multi-agent system) — and which one this series is about.
  4. The diagram that the rest of the series fills in.
- **Code samples:** none.
- **Visual:** D3 — the agent loop (perceive → plan → act → observe), interactively expandable to show what each box becomes by Ep 10.
- **Language:** D3.

---

## Episode 1 — The cheapest version: a prompted LLM

- **Hook:** Before any framework, before any tool — can a single well-written prompt solve 60% of your problem? Usually yes. Start there.
- **Source:** Huyen Ch 5 (Prompt Engineering) — esp. §Best Practices p220–235, §Defensive Prompt Engineering p235–251.
- **Sections:**
  1. Why "just prompt it" is a real baseline, not a strawman.
  2. The five prompt patterns that earn their keep (clear instructions, context, decomposition, give-it-time-to-think, examples).
  3. Iterating on a prompt like an engineer: versioned prompts, regression tests, diffable changes.
  4. Defensive prompting: jailbreaks and injection in 200 words.
- **Code samples:**
  - `01-baseline.py` — minimal Anthropic / OpenAI call, no framework.
  - `02-prompt-template.py` — typed prompt template with variables.
  - `03-prompt-eval.py` — running the same prompt over a fixture set and diffing outputs.
- **Visual:** Static — table of "prompt version → eval score" across iterations.
- **Language:** Python.

---

## Episode 2 — Giving it eyes: tools and function calling

- **Hook:** An LLM that can't act is a search engine with extra steps. Tools are how it acts.
- **Source:** Huyen Ch 6 §Tools p278–281.
- **Sections:**
  1. What a tool actually is (a typed function the model can request to call).
  2. The function-calling protocol: schema → request → response → result.
  3. Designing tools the model can actually use (small, orthogonal, named for the verb).
  4. Tool failure modes: hallucinated args, wrong tool, infinite loops.
- **Code samples:**
  - `01-tool-schema.py` — defining tools as JSON schemas + Python functions.
  - `02-tool-loop.py` — minimal request-tool-result-respond loop.
  - `03-bad-tools.py` — three tools that confuse the model, and why.
- **Visual:** Static — sequence diagram of one tool-call round-trip.
- **Language:** Python.

---

## Episode 3 — Giving it knowledge: RAG from first principles

- **Hook:** Stuffing the whole knowledge base into the prompt is wasteful and slow. Retrieval is the cheap fix.
- **Source:** Huyen Ch 6 §RAG p253–273 (architecture, retrieval algorithms, optimization).
- **Sections:**
  1. Why RAG works (lower latency, lower cost, fresher data, citations).
  2. The two retrieval families: lexical (BM25) and semantic (embeddings). When each wins.
  3. Building a tiny retriever with `pgvector` — no framework.
  4. Chunking decisions that bite you later.
  5. Evaluating retrieval (recall@k, MRR) before you evaluate the agent.
- **Code samples:**
  - `01-schema.sql` — pgvector table, indexes.
  - `02-ingest.py` — chunk + embed + insert.
  - `03-retrieve.py` — hybrid retrieval (BM25 + cosine).
  - `04-rag-eval.py` — recall@k on a labelled set.
- **Visual:** Static — chunking strategies side-by-side with recall@k bars.
- **Language:** Python + SQL.

---

## Episode 4 — Giving it memory: short and long term

- **Hook:** Context windows are short-term memory. Long-term memory is something else, and most agents fake it badly.
- **Source:** Huyen Ch 6 §Memory p300–305.
- **Sections:**
  1. The taxonomy: scratchpad, conversation buffer, summary memory, vector memory, structured memory.
  2. What each kind costs (tokens, latency, accuracy of recall).
  3. Building a hybrid memory: rolling summary + vector store for facts.
  4. The eviction question — what gets forgotten and why.
- **Code samples:**
  - `01-memory-types.py` — four memory strategies, same interface.
  - `02-hybrid-memory.py` — summary + vector recall.
  - `03-memory.sql` — schema for episodic memory.
- **Visual:** D3 — interactive: drag conversation length, see token cost and recall accuracy across strategies.
- **Language:** Python + SQL + D3.

---

## Episode 5 — The planning loop: ReAct, plans, replanning

- **Hook:** A loop of "think → act → observe" beats a fixed pipeline for any task you can't fully script. ReAct is the simplest version that works.
- **Source:** Huyen Ch 6 §Planning p281–298.
- **Sections:**
  1. Why a loop, not a chain. Why replanning beats planning.
  2. ReAct in 30 lines of Python. No framework.
  3. The three planning styles: zero-shot ReAct, plan-then-execute, hierarchical.
  4. Stopping conditions that actually stop.
- **Code samples:**
  - `01-react.py` — ReAct loop from scratch, no LangChain.
  - `02-plan-execute.py` — explicit plan tree.
  - `03-budget.py` — token / step budgets and termination logic.
- **Visual:** D3 — animated trace of one ReAct run, expandable per step.
- **Language:** Python + D3.

---

## Episode 6 — How do I know it works? Evaluation

- **Hook:** Most agent demos pass on a handful of inputs and fail in production. Eval is the difference.
- **Source:** Huyen Ch 3 (Eval Methodology) + Ch 4 (Evaluate AI Systems).
- **Sections:**
  1. Why agent eval is harder than model eval (multi-step, stochastic, expensive).
  2. The four eval families: exact-match, similarity, AI-as-judge, human review. When each is honest.
  3. Building an eval harness: fixtures, replays, scoring.
  4. Statistics: how many runs do you need to call a regression real? (R for the calc.)
- **Code samples:**
  - `01-eval-harness.py` — replay + score.
  - `02-llm-judge.py` — AI-as-judge with self-consistency.
  - `03-significance.R` — bootstrap confidence intervals on score deltas.
- **Visual:** Static — score distributions across two prompt versions with CI overlay.
- **Language:** Python + R.

---

## Episode 7 — When agents go wrong: a failure-mode taxonomy

- **Hook:** Catalog the failures before you try to fix them. Most "agent bugs" are five recurring shapes.
- **Source:** Huyen Ch 6 §Agent Failure Modes p298–300.
- **Sections:**
  1. The taxonomy: planning failures, tool failures, perception failures, memory failures, termination failures.
  2. Real traces of each, annotated.
  3. Detection: which failures need monitors, which need evals.
  4. Mitigations that actually help vs. mitigations that just move the failure.
- **Code samples:** small Python snippets per failure (no large file).
- **Visual:** D3 — failure-mode treemap sized by frequency from a real run set.
- **Language:** D3 + Python.

---

## Episode 8 — Making it cheap and fast: inference, caching, routing

- **Hook:** A working agent that costs $0.40 per turn is a prototype, not a product. Cost is a design constraint.
- **Source:** Huyen Ch 9 (Inference Optimization) + Ch 10 step 4 (caches).
- **Sections:**
  1. Where the cost actually goes (prefill vs decode, model size, tool calls).
  2. The three caches that matter: prompt cache, semantic cache, result cache.
  3. Model routing: cheap model first, escalate only when confidence is low.
  4. Latency budgets and the streaming UX trick that hides them.
- **Code samples:**
  - `01-prompt-cache.py` — using provider prompt caching correctly.
  - `02-semantic-cache.py` — embedding-based result cache with SQL backing.
  - `03-router.py` — confidence-based escalation.
- **Visual:** D3 — interactive cost-vs-latency Pareto, points labelled with config.
- **Language:** Python + D3.

---

## Episode 9 — Guardrails, gateway, observability

- **Hook:** What stands between the model and the user, and between the model and your wallet.
- **Source:** Huyen Ch 10 steps 1–3 (Enhance Context, Guardrails, Model Router & Gateway), §Monitoring p465–472.
- **Sections:**
  1. Guardrails: input filtering, output filtering, policy enforcement.
  2. The gateway pattern: one chokepoint for keys, rate limits, fallbacks, logging.
  3. Observability: traces, not logs. The four signals that matter for agents.
  4. A minimal dashboard that catches regressions in production.
- **Code samples:**
  - `01-guardrails.py` — input / output validators.
  - `02-gateway.ts` — tiny Node gateway in front of providers.
  - `03-trace-export.py` — OpenTelemetry-shaped traces.
- **Visual:** D3 — live-ish trace timeline of one agent run with span detail on hover.
- **Language:** Python + JS + D3.

---

## Episode 10 — The feedback loop: getting better over time

- **Hook:** The agent you ship in week 1 is your worst agent. Feedback is how week 12's is better.
- **Source:** Huyen Ch 10 §User Feedback p474–490.
- **Sections:**
  1. Conversational feedback (thumbs, regenerations, edits) vs explicit feedback.
  2. Schema for storing feedback so it's useful six months later.
  3. Turning feedback into eval fixtures (this is the loop).
  4. Feedback's limits: selection bias, sycophancy, the silent majority.
- **Code samples:**
  - `01-feedback-schema.sql` — events + ratings + linked traces.
  - `02-feedback-to-fixtures.py` — promoting failure traces to the eval set.
  - `03-feedback-dash.py` — weekly digest of what got worse.
- **Visual:** Static — week-over-week eval score with feedback-driven fixtures added.
- **Language:** Python + SQL.

---

## Episode 11 *(optional)* — When finetuning earns its keep

- **Hook:** Almost never as early as you think. Here's the test.
- **Source:** Huyen Ch 7 (Finetuning) + Ch 8 (Dataset Engineering).
- **Sections:**
  1. The four conditions that justify finetuning (and how to verify each).
  2. Dataset quality as the actual blocker — not the training run.
  3. PEFT / LoRA in 50 lines, on a small open model.
  4. When to merge models instead.
- **Code samples:**
  - `01-when-not-to.py` — decision checklist as a script.
  - `02-data-quality.R` — dedup, leakage, coverage stats.
  - `03-lora.py` — minimal LoRA finetune.
- **Visual:** Static — before/after eval scores with cost annotation.
- **Language:** Python + R.

---

## Open questions before drafting

- Are case studies real (your own agents) or constructed for the series? Real ones add credibility but expose IP / clients.
- One repo of code samples, or one repo per episode?
- Comment policy on the site (Disqus, Giscus, none)?
- License on the code samples (MIT default)?

## Status

- **2026-05-23**: Outline locked.
- **2026-05-23**: All 12 episodes drafted (Episode 0 through Episode 11). ~70k words of prose + 26 code files across Python, R, SQL, TypeScript, and D3/HTML. Each episode under `src/episodes/<slug>/` with `prose.md` and code samples colocated. Trip-planner running example accretes across the arc.
- **Pending**: Episode infrastructure on the site itself — the `Episode` TypeScript model, the `/episodes` and `/episodes/:slug` routes, the language adapters, the `<CodeBlock />` and `<LiveSandbox />` components from the architecture-review v2. Prose and code exist on disk; the site cannot render them yet. This is the next blocker before publishing.
- **Pending**: Cross-folder imports in code samples (e.g., Ep 5 imports from Ep 2) work for the accretion narrative but won't make sense when each episode renders as a standalone page. Decide between a shared `src/episodes/_lib/` folder, inline duplication, or keeping as-is and flagging in prose.
- **Pending**: Filenames with leading digits (`01-baseline.py`) force `importlib.util` ugliness in dependent samples. Consider renaming to module-friendly names and using ordering in the prose only.

## Files written

```
src/episodes/
  00-what-is-an-agent/                       prose.md
  01-just-a-prompt/                          prose.md  01-baseline.py  02-prompt-template.py  03-prompt-eval.py  fixtures.json
  02-give-it-hands/                          prose.md  01-tool-schema.py  02-tool-loop.py  03-bad-tools.py
  03-rag-from-first-principles/              prose.md  01-schema.sql  02-ingest.py  03-retrieve.py  04-rag-eval.py
  04-memory/                                 prose.md  01-memory-types.py  02-hybrid-memory.py  03-memory.sql  04-memory-viz.html
  05-the-planning-loop/                      prose.md  01-react.py  02-plan-execute.py  03-budget.py
  06-evaluation/                             prose.md  01-eval-harness.py  02-llm-judge.py  03-significance.R
  07-failure-modes/                          prose.md  01-failure-treemap.html  02-classify.py
  08-cheap-and-fast/                         prose.md  01-prompt-cache.py  02-semantic-cache.py  03-router.py  04-pareto.html
  09-guardrails-gateway-observability/       prose.md  01-guardrails.py  02-gateway.ts  03-trace-export.py
  10-feedback-loop/                          prose.md  01-feedback-schema.sql  02-feedback-to-fixtures.py  03-feedback-dash.py
  11-when-finetuning-earns-its-keep/         prose.md  01-when-not-to.py  02-data-quality.R  03-lora.py
```
