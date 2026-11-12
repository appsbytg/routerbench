import { useEffect, useSyncExternalStore } from 'react'
import { api, apiConfigured } from './siteConfig'

/**
 * Whether the signup backend can be reached.
 * - checking: first check in flight
 * - up: /health answered OK
 * - down: no answer, an error, or the API URL isn't set yet
 * - fallback: down, but the page runs as a claude.ai Artifact and can save there instead
 */
export type ApiStatus = 'checking' | 'up' | 'down' | 'fallback'

let status: ApiStatus = 'checking'
const subs = new Set<() => void>()
let timer: number | undefined
let inFlight: Promise<ApiStatus> | null = null

const emit = (s: ApiStatus) => { status = s; subs.forEach((f) => f()) }
const artifactFallback = () => typeof window !== 'undefined' && !!window.claude

export function checkApi(): Promise<ApiStatus> {
  if (inFlight) return inFlight
  inFlight = (async () => {
    let ok = false
    if (apiConfigured) {
      const ctl = new AbortController()
      const t = window.setTimeout(() => ctl.abort(), 5000)
      try {
        const r = await fetch(api('/health'), { cache: 'no-store', signal: ctl.signal, credentials: 'omit' })
        ok = r.ok
      } catch { ok = false }
      window.clearTimeout(t)
    }
    const next: ApiStatus = ok ? 'up' : artifactFallback() ? 'fallback' : 'down'
    emit(next)
    window.clearTimeout(timer)
    if (next !== 'up') timer = window.setTimeout(() => void checkApi(), 30_000) // keep checking while down
    return next
  })().finally(() => { inFlight = null })
  return inFlight
}

/** Marks the API down after a failed request, and starts re-checking. */
export function reportApiFailure() {
  emit(artifactFallback() ? 'fallback' : 'down')
  window.clearTimeout(timer)
  timer = window.setTimeout(() => void checkApi(), 30_000)
}

export function useApiStatus() {
  const s = useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb) }, () => status, () => status)
  useEffect(() => {
    if (status === 'checking') void checkApi()
    const onVisible = () => { if (document.visibilityState === 'visible' && status === 'down') void checkApi() }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])
  return { status: s, recheck: checkApi }
}
