# Episode 9 — Guardrails, gateway, observability

*Series: Building an Agent from Scratch. Episode 9 of 12.*

---

## What stands between the model and the world

When you were a toddler, our house had a baby gate at the top of the
stairs. Not because we didn't trust you to walk — we did. We just
didn't trust you *yet* to know which step was the last one. The gate
wasn't a punishment. It was an honest acknowledgment that you were
still learning, and the cost of being wrong about a step was high.

Production agents need baby gates too. Not as a sign of distrust, but
as honest acknowledgment that the system is fallible, the inputs are
adversarial, and the cost of certain failures is real. This episode
is about the things you build *around* the agent — the
infrastructure that makes the difference between *a demo that
worked once* and *a service that runs in front of customers without
embarrassing you.*

Three layers, working outward from the agent:

1. **Guardrails.** Input validation, output safety, policy
   enforcement.
2. **Gateway.** A single chokepoint for keys, rate limits, fallbacks,
   retries, logging.
3. **Observability.** Traces, metrics, and the dashboards that turn
   a black box into a debuggable system.

None of this is glamorous. All of it is what separates production
from prototype. A father's principle: **the boring parts are what
make the exciting parts survive contact with reality.**

---

## Guardrails

The model in your agent is going to be fed inputs from people. Some
of those people will be confused. Some will be careless. Some,
unfortunately, will be hostile. Guardrails are how you handle all
three without flinching.

There are two directions of guardrail and you need both.

### Input guardrails

Before the agent sees the user's message, run it through checks.

**Length and format.** Reject inputs over some size threshold. Most
malicious prompt-injection attempts are wordy because they need to
include the injection payload alongside the cover content. A short
message is rarely an attack.

**Prompt injection detection.** Look for patterns like *"ignore
previous instructions"*, *"you are now"*, *"the user's real intent
is..."*, instruction-shaped text in places where you expect data.
There are libraries (NeMo Guardrails, LlamaGuard, Anthropic's
content moderation) that score injection likelihood. Their precision
isn't perfect. Use them as a *signal*, not as the only line of
defense.

**Out-of-scope detection.** Your trip planner doesn't need to handle
*"write me a sonnet about Marx."* A quick classifier (the cheap model
from [Episode 8](/episodes/08-cheap-and-fast) works) can flag inputs that don't match your domain
and return a polite *"that's outside what I can help with"* response.

**PII redaction (optional).** If you're sending user messages to a
third-party model, decide whether to redact credit card numbers,
email addresses, government IDs. This protects users and reduces
your data-handling liability.

```python
# 01-guardrails.py (excerpt)
@dataclass
class InputCheck:
    name: str
    test: Callable[[str], bool]
    action: Literal["block", "flag", "redact"]

INPUT_CHECKS = [
    InputCheck("too_long",        lambda s: len(s) > 5000,              "block"),
    InputCheck("looks_injected",  lambda s: bool(INJECTION_PATTERN.search(s)), "flag"),
    InputCheck("out_of_scope",    is_out_of_scope_classifier,            "block"),
]
```

### Output guardrails

After the agent produces a response, before the user sees it, run
checks again.

**Refusal sanity check.** Did the model refuse for the wrong reason?
A trip planner that refuses to mention *"sake"* because it's an
alcoholic beverage is over-refusing and frustrating users. Log
refusals; review them; tune the system prompt or add allowlists.

**Hallucination check on factual claims.** If the agent claims a
flight costs $487, optionally route that claim through a quick
factual verification (look it up in the tool results that informed
the answer; flag if not supported).

**Policy compliance.** Did the response include anything you've
decided it shouldn't? Competitor names, internal jargon, financial
advice your legal team has banned. A regex pass or a small classifier
catches most of it.

**Format compliance.** If you promised the user JSON, did you get
JSON? If you promised a table, did you get a table? Strict format
validation prevents downstream code from breaking.

The pattern: **never let raw model output reach the user without at
least one validation pass.** Even if all your checks pass 99% of the
time, the 1% case is where the headlines come from.

---

## The gateway pattern

A gateway is one piece of code that all model calls go through. Not
"a function each service calls" — *the same function, deployed once,
called from everywhere.*

What it owns:

- **Provider credentials.** API keys live in the gateway. No service
  has direct keys. Rotating keys is a one-place change.
- **Routing.** [Episode 8](/episodes/08-cheap-and-fast)'s cheap-vs-smart logic lives here, not in
  each agent.
- **Rate limiting.** Per user, per service, per provider. Prevents
  one runaway loop from exhausting the org-wide quota.
- **Fallbacks.** Provider A is down? Retry on Provider B. The agent
  code doesn't know there are multiple providers — that's the
  gateway's job.
- **Retries with backoff.** Transient errors get retried;
  permanent ones get surfaced.
- **Cost accounting.** Every call's cost is recorded against the
  calling service / user / conversation.
- **Logging.** The request, the response, latency, cost, model
  used — all in one place, in one format.

```javascript
// 02-gateway.ts (sketch — full file alongside)
async function gatewayCall(req: GatewayRequest): Promise<GatewayResponse> {
  await rateLimit.consume(req.user_id);
  const model = router.pick(req);
  const provider = providers.get(model);

  const start = Date.now();
  let response;
  try {
    response = await withRetries(() => provider.complete(req), { maxAttempts: 3 });
  } catch (e) {
    if (fallback.available(model)) return await fallback.run(req);
    throw e;
  }
  const latency = Date.now() - start;

  await tracker.record({
    user_id: req.user_id, service: req.service, model,
    input_tokens: response.usage.input, output_tokens: response.usage.output,
    latency_ms: latency, cost_usd: cost(model, response.usage),
  });

  return response;
}
```

Why a gateway and not a "smart SDK"? Because cross-cutting concerns
(rate limits, accounting, fallbacks) need *organization-level state.*
A library deployed inside each service has each service's view of the
world, not the whole world's view. A gateway with shared state can do
things no library can: enforce a global rate limit, share a cache
across services, retry on a different provider mid-call.

The cost is one network hop. For agent workloads where every call
already costs hundreds of milliseconds, that hop is invisible.

---

## Observability that actually helps

"Logging" is what you have when you wish you had observability.
Logging gives you grep over text. Observability gives you the ability
to ask questions like *"what was the p99 latency of trip-planning
conversations that used the cheap-model router this week, sliced by
user country?"* and get an answer in under a minute.

The shape of agent observability has three pieces.

### 1. Traces

Every agent run produces a trace: a tree of spans, where each span is
one unit of work (a model call, a tool call, a database query). Spans
have start/end times, attributes, and a parent.

This is the *thing* you'll look at when something is broken.
**Without a trace, you can't debug an agent.** The trace from
[Episode 5](/episodes/05-the-planning-loop) — thought, action, observation per step — formalized as
spans, exportable to a standard format (OpenTelemetry), viewable in
a standard tool (Jaeger, Tempo, Honeycomb, Datadog).

```python
# 03-trace-export.py (excerpt)
@contextmanager
def span(name: str, **attrs):
    spn = tracer.start_span(name)
    for k, v in attrs.items():
        spn.set_attribute(k, v)
    try:
        yield spn
        spn.set_status(StatusCode.OK)
    except Exception as e:
        spn.set_status(StatusCode.ERROR, str(e))
        raise
    finally:
        spn.end()
```

The agent gets sprinkled with `with span(...)` blocks. The output
goes to your observability backend. The investment is small. The
returns when something breaks are enormous.

### 2. Metrics

Aggregates of what's happening across all runs:

- Requests per minute.
- p50, p95, p99 latency.
- Cost per request.
- Error rate.
- Tool call frequency.
- Cache hit rate.
- Eval-fixture pass rate ([Episode 6](/episodes/06-evaluation), run on a schedule, recorded).

These don't tell you what went wrong in a specific case — that's
what traces are for. They tell you *whether something is going wrong
in general,* which is what you want to be paged on.

### 3. The four signals

Of the metrics above, four matter most for production agents.
Borrowed from Google's SRE practice and adapted:

- **Latency.** Are users waiting too long?
- **Traffic.** How much work is the system doing?
- **Errors.** How often does the agent fail (any failure mode from
  [Episode 7](/episodes/07-failure-modes))?
- **Cost.** How much is the system spending?

A dashboard with these four signals, broken down per service, is
the minimum production observability setup. Add more later. Don't
launch without these.

A father's principle: **if you can't see it, you can't fix it.**
Build the dashboard before the launch, not after the first incident.

---

## Auth, secrets, and the small things that bite

A few production basics that aren't AI-specific but get forgotten
because everyone's excited about the AI part:

**API keys belong in a secrets manager.** Not in environment files
checked into git. Not in `.env.local` shared on Slack. Use AWS
Secrets Manager, HashiCorp Vault, 1Password's secrets API, or
whatever your team uses. Rotate keys quarterly. The gateway is the
only thing that reads them.

**Per-user authentication and authorization.** Whose conversation is
this? What are they allowed to do? *Anonymous* is a valid answer for
some products. *"Allowed to do anything"* is rarely a valid answer
for any product.

**Audit logs.** Every action with a real-world effect (an email
sent, a record updated, a payment made) is logged with who, what,
when. Independently of the agent trace. Auditable from outside the
agent.

**Cost alarms.** Set a daily cost ceiling. Alert at 80%. Stop new
requests at 100%. Yes, this might inconvenience users. Yes, this is
much better than discovering at the end of the month that a bug
spent your runway.

---

## What you don't put in the gateway

Some things look like they belong in the gateway but don't:

- **Business logic.** The gateway routes and protects. It doesn't
  understand what your agent is for.
- **Memory and retrieval.** These are agent-level concerns
  (Episodes 3 and 4).
- **Domain-specific rubrics.** Evaluation lives where the domain
  lives.

A clean gateway is a thin one. Resist the urge to put everything in
it. The point of a chokepoint is that it stays a chokepoint, not
that it becomes a kitchen sink.

---

## What you have now

The agent now ships with:

- Input validation and output safety checks.
- A central gateway for all model calls, with routing, retries,
  fallbacks, and accounting.
- OpenTelemetry-shaped traces of every conversation.
- The four-signal dashboard (latency, traffic, errors, cost).
- Audit logs of real-world actions.
- Cost alarms and rate limits.

This is what's left between *"works on my machine"* and *"works at
3am when on-call gets paged."* You have the parts.

What's still missing:

- **A feedback loop with actual users.** All the infrastructure in
  this episode tells you when something *broke.* It doesn't tell
  you whether users are getting value. [Episode 10](/episodes/10-feedback-loop) closes that loop.

---

## Where we go next

[Episode 10](/episodes/10-feedback-loop) is the loop that closes the loop. You have an agent that
works, that's measured, that's cheap, that's safe. Now you put it
in front of users and learn from what they actually do with it.
We'll cover conversational feedback (thumbs, edits, regenerations),
explicit feedback, the schema that makes feedback useful six months
later, and the trick that turns bad outputs into eval fixtures
automatically.

— Dad

---

*Code: `01-guardrails.py` (input and output validators with
configurable actions), `02-gateway.ts` (minimal Node gateway with
routing, retries, accounting), `03-trace-export.py` (OpenTelemetry
span helpers wired into the agent loop).*

*Source: Chip Huyen,* AI Engineering, *Chapter 10 steps 1–3 (Enhance
Context, Put in Guardrails, Add Model Router and Gateway) and
Monitoring and Observability (p465–472). Recommended reading: the
OpenTelemetry Semantic Conventions for GenAI (the spec is actually
useful, despite the name); the Google SRE book chapter on monitoring
distributed systems.*
