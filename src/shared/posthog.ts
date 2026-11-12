import { site } from './siteConfig'

type PostHogLike = {
  capture: (event: string, props?: Record<string, unknown>) => void
  identify: (id: string, props?: Record<string, unknown>) => void
  register: (props: Record<string, unknown>) => void
}

let ph: PostHogLike | null = null
const pending: Array<(p: PostHogLike) => void> = []

/** Loads PostHog only when a key is configured. Safe to call when it's blocked or off. */
export async function initPostHog(distinctId: string, sessionId: string) {
  if (!site.posthogKey || typeof window === 'undefined') return
  try {
    const { default: posthog } = await import('posthog-js')
    posthog.init(site.posthogKey, {
      api_host: site.posthogHost,
      person_profiles: 'identified_only',
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      persistence: 'localStorage+cookie',
      bootstrap: { distinctID: distinctId, isIdentifiedID: false },
      disable_session_recording: !site.posthogRecordSessions,
      session_recording: { maskAllInputs: true },
    })
    posthog.register({ app: site.appName, lb_session_id: sessionId })
    ph = posthog as unknown as PostHogLike
    pending.splice(0).forEach((fn) => fn(ph!))
  } catch (e) {
    console.warn('PostHog not loaded', e)
  }
}

function withPh(fn: (p: PostHogLike) => void) {
  if (!site.posthogKey) return
  if (ph) { try { fn(ph) } catch { /* never break the page for analytics */ } }
  else if (pending.length < 100) pending.push(fn)
}

export const phCapture = (event: string, props?: Record<string, unknown>) => withPh((p) => p.capture(event, { app: site.appName, ...props }))
export const phIdentify = (id: string, props: Record<string, unknown>) => withPh((p) => p.identify(id, props))
