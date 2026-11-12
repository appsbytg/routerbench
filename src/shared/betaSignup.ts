import { identity } from './analytics'
import { checkApi, reportApiFailure } from './apiStatus'
import { api, apiConfigured, site } from './siteConfig'

export type BetaFields = Record<string, string>

export class SignupError extends Error {
  constructor(public code: 'unavailable' | 'invalid_email' | 'rate_limited' | 'rejected') {
    super(code)
  }
}

type Caps = [ClaudeDb | null, ClaudeUser | null]
let capsPromise: Promise<Caps> | null = null
function artifactStore(): Promise<Caps> {
  if (capsPromise) return capsPromise
  const claude = typeof window !== 'undefined' ? window.claude : undefined
  capsPromise = claude
    ? Promise.race<Caps>([
        Promise.all([claude.use('db'), claude.use('user')]),
        new Promise<Caps>((r) => setTimeout(() => r([null, null]), 10_000)),
      ]).catch((): Caps => [null, null])
    : Promise.resolve<Caps>([null, null])
  return capsPromise
}

/** Sends a beta request to landing-backend. Falls back to the Artifact store only inside claude.ai. */
export async function submitBetaSignup(email: string, fields: BetaFields, honeypot = ''): Promise<{ duplicate: boolean }> {
  const who = identity()
  if (apiConfigured) {
    let res: Response | null = null
    try {
      res = await fetch(api(`/v1/apps/${site.appName}/signups`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({ email, fields, website: honeypot, anonymousId: who?.anonymousId, sessionId: who?.sessionId, context: who?.context }),
      })
    } catch { res = null }
    if (res?.ok) {
      void checkApi()
      const data = (await res.json().catch(() => ({}))) as { duplicate?: boolean }
      return { duplicate: !!data.duplicate }
    }
    if (res?.status === 400) {
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      throw new SignupError(data.error === 'invalid_email' ? 'invalid_email' : 'rejected')
    }
    if (res?.status === 429) throw new SignupError('rate_limited')
    if (res && res.status < 500 && res.status !== 404) throw new SignupError('rejected')
    reportApiFailure()
  }
  const [db, user] = await artifactStore()
  if (db && user) {
    const id = await user.id()
    await db.doc(`signups/${id}`).set({ product: site.appName, email, ...fields, at: new Date().toISOString() })
    return { duplicate: false }
  }
  throw new SignupError('unavailable')
}
