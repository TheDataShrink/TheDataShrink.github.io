// Email capture client helper.
// Posts to the Cloudflare Worker at VITE_EMAIL_ENDPOINT.
// When the env var is unset (stealth-mode local dev), falls back to console.log
// so nothing breaks.

const ENDPOINT = import.meta.env.VITE_EMAIL_ENDPOINT as string | undefined

export type DiagnosticPayload = {
  email: string
  archetype: string
  scores: { pain: number; data: number; noise: number }
  likert_responses: Record<string, number>
  situational_responses: Record<string, string>
}

export async function submitDiagnostic(payload: DiagnosticPayload): Promise<{ ok: boolean }> {
  const body = {
    ...payload,
    client_timestamp: new Date().toISOString(),
    referrer: typeof window !== 'undefined' ? window.location.href : null,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
  }

  if (!ENDPOINT) {
    console.log('[email/diagnostic] dry-run (VITE_EMAIL_ENDPOINT unset)', body)
    return { ok: true }
  }

  try {
    const res = await fetch(`${ENDPOINT}/api/diagnostic`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      console.error('[email/diagnostic] failed', res.status)
      return { ok: false }
    }
    return { ok: true }
  } catch (err) {
    console.error('[email/diagnostic] network error', err)
    return { ok: false }
  }
}

export async function submitWaitlist(email: string, source = 'community-waitlist'): Promise<{ ok: boolean }> {
  const body = { email, source, client_timestamp: new Date().toISOString() }

  if (!ENDPOINT) {
    console.log('[email/waitlist] dry-run (VITE_EMAIL_ENDPOINT unset)', body)
    return { ok: true }
  }

  try {
    const res = await fetch(`${ENDPOINT}/api/waitlist`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      console.error('[email/waitlist] failed', res.status)
      return { ok: false }
    }
    return { ok: true }
  } catch (err) {
    console.error('[email/waitlist] network error', err)
    return { ok: false }
  }
}
