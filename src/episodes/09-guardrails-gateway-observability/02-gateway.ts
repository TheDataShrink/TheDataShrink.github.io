/**
 * Episode 9, sample 2 — a minimal model gateway in TypeScript / Node.
 *
 * One chokepoint for all model calls. Owns API keys, rate limits, model
 * routing, retries, fallbacks, and cost accounting. Services don't talk
 * to providers directly — they talk to this gateway.
 *
 * Run:
 *   npm i express undici p-retry
 *   tsx 02-gateway.ts
 *
 * Then POST to http://localhost:8080/v1/messages with:
 *   { user_id, service, messages: [...], hints?: { preferCheap?: boolean } }
 */

import express, { Request, Response } from "express";
import pRetry from "p-retry";
import { fetch } from "undici";

const PORT = Number(process.env.PORT ?? 8080);

// --- types -----------------------------------------------------------------

interface GatewayRequest {
  user_id: string;
  service: string;
  messages: { role: string; content: string }[];
  hints?: { preferCheap?: boolean };
}

interface ProviderUsage { input: number; output: number }
interface GatewayResponse {
  text: string;
  model: string;
  usage: ProviderUsage;
  cost_usd: number;
  latency_ms: number;
}

// --- rate limit (token bucket per user, in-memory) -------------------------

class TokenBucket {
  private tokens: Map<string, { count: number; updatedAt: number }> = new Map();
  constructor(private capacity: number, private refillPerSecond: number) {}

  consume(key: string): boolean {
    const now = Date.now();
    const cur = this.tokens.get(key) ?? { count: this.capacity, updatedAt: now };
    const elapsed = (now - cur.updatedAt) / 1000;
    cur.count = Math.min(this.capacity, cur.count + elapsed * this.refillPerSecond);
    cur.updatedAt = now;
    if (cur.count < 1) { this.tokens.set(key, cur); return false; }
    cur.count -= 1;
    this.tokens.set(key, cur);
    return true;
  }
}

const userLimiter = new TokenBucket(60, 1);   // 60 req burst, 1 req/sec sustained

// --- routing ---------------------------------------------------------------

const CHEAP_MODEL = "claude-haiku-4-5-20251001";
const SMART_MODEL = "claude-sonnet-4-6";

function pickModel(req: GatewayRequest): string {
  if (req.hints?.preferCheap) return CHEAP_MODEL;
  const last = req.messages[req.messages.length - 1]?.content ?? "";
  if (last.length < 200 && !/plan|compare|design|analyze/i.test(last)) return CHEAP_MODEL;
  return SMART_MODEL;
}

// --- pricing (illustrative; consult provider pricing for real numbers) -----

const PRICING: Record<string, { input: number; output: number }> = {
  [CHEAP_MODEL]: { input: 0.80,  output: 4.00  },   // $ per million tokens
  [SMART_MODEL]: { input: 3.00,  output: 15.00 },
};

function costOf(model: string, usage: ProviderUsage): number {
  const p = PRICING[model] ?? { input: 0, output: 0 };
  return (usage.input / 1e6) * p.input + (usage.output / 1e6) * p.output;
}

// --- provider call with retries -------------------------------------------

async function callAnthropic(model: string, messages: any[]): Promise<{ text: string; usage: ProviderUsage }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  return pRetry(async () => {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({ model, max_tokens: 1024, messages }),
    });
    if (r.status >= 500) throw new Error(`provider 5xx: ${r.status}`);
    if (r.status === 429) throw new Error("rate-limited by provider");
    if (!r.ok) {
      const body = await r.text();
      // 4xx other than 429 = don't retry
      const err = new Error(`provider ${r.status}: ${body}`);
      (err as any).abort = true;
      throw err;
    }
    const j: any = await r.json();
    const text = (j.content ?? []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
    return { text, usage: { input: j.usage.input_tokens, output: j.usage.output_tokens } };
  }, {
    retries: 3,
    minTimeout: 250,
    factor: 2,
    onFailedAttempt: (e) => console.warn(`retry: ${e.message}`),
    shouldRetry: (e) => !(e as any).abort,
  });
}

// --- accounting (in-memory; replace with Postgres in production) ----------

const ledger: Array<{ ts: number; user: string; service: string; model: string; cost: number; lat: number }> = [];

// --- HTTP handler ----------------------------------------------------------

const app = express();
app.use(express.json({ limit: "1mb" }));

app.post("/v1/messages", async (req: Request, res: Response) => {
  const body = req.body as GatewayRequest;
  if (!body?.user_id || !body?.service || !Array.isArray(body.messages)) {
    return res.status(400).json({ error: "user_id, service, messages required" });
  }
  if (!userLimiter.consume(body.user_id)) {
    return res.status(429).json({ error: "rate-limited" });
  }

  const model = pickModel(body);
  const start = Date.now();
  try {
    const { text, usage } = await callAnthropic(model, body.messages);
    const latency_ms = Date.now() - start;
    const cost_usd = costOf(model, usage);
    ledger.push({ ts: Date.now(), user: body.user_id, service: body.service, model, cost: cost_usd, lat: latency_ms });
    const out: GatewayResponse = { text, model, usage, cost_usd, latency_ms };
    res.json(out);
  } catch (e: any) {
    res.status(502).json({ error: e.message });
  }
});

app.get("/v1/usage/:user_id", (req, res) => {
  const rows = ledger.filter(r => r.user === req.params.user_id);
  const total = rows.reduce((a, r) => a + r.cost, 0);
  res.json({ user: req.params.user_id, total_usd: total, calls: rows.length });
});

app.listen(PORT, () => console.log(`gateway listening on :${PORT}`));
