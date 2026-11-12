/**
 * Visitor tracking for the landing pages. Sends batches to landing-backend and mirrors the
 * key events to PostHog. Records: source (UTM, click ids, referrer), sections viewed and time
 * in each, scroll depth, active time, button clicks, demo use and the signup form funnel.
 * No cookies are set by this file; ids live in localStorage / sessionStorage.
 */
import { initPostHog, phCapture } from './posthog'
import { api, apiConfigured, site } from './siteConfig'

type Props = Record<string, string | number | boolean | null>
type EventType = 'page_view' | 'section_view' | 'section_time' | 'scroll_depth' | 'click' | 'demo'
  | 'form_start' | 'form_submit' | 'signup_success' | 'signup_error' | 'heartbeat' | 'page_leave' | 'custom'
interface QueuedEvent { type: EventType; ts: number; name?: string; durationMs?: number; props?: Props }

const SESSION_GAP = 30 * 60 * 1000
const FLUSH_MS = 10_000
const IDLE_MS = 45_000
const PREFIX = `lb_${site.appName}_`

function store(kind: 'local' | 'session') {
  try { return kind === 'local' ? window.localStorage : window.sessionStorage } catch { return null }
}
const get = (k: string, kind: 'local' | 'session' = 'local') => { try { return store(kind)?.getItem(PREFIX + k) ?? null } catch { return null } }
const set = (k: string, v: string, kind: 'local' | 'session' = 'local') => { try { store(kind)?.setItem(PREFIX + k, v) } catch { /* private mode */ } }

const newId = () => {
  try { return crypto.randomUUID().replace(/-/g, '') } catch { return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('') }
}

function ids() {
  let anonymousId = get('aid')
  if (!anonymousId) { anonymousId = newId(); set('aid', anonymousId) }
  const last = Number(get('last') ?? 0)
  let sessionId = get('sid', 'session') ?? get('sid')
  if (!sessionId || Date.now() - last > SESSION_GAP) sessionId = newId()
  set('sid', sessionId, 'session'); set('sid', sessionId); set('last', String(Date.now()))
  return { anonymousId, sessionId }
}

function readContext() {
  const u = new URL(window.location.href)
  const q = (k: string) => u.searchParams.get(k) ?? undefined
  const pick = <T extends Record<string, string | undefined>>(o: T) =>
    Object.fromEntries(Object.entries(o).filter(([, v]) => v)) as Partial<Record<keyof T, string>>
  return {
    url: u.href.slice(0, 1000),
    path: u.pathname,
    title: document.title.slice(0, 200),
    referrer: document.referrer.slice(0, 1000) || undefined,
    language: navigator.language,
    timezone: (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone } catch { return undefined } })(),
    screen: { w: window.screen.width, h: window.screen.height },
    viewport: { w: window.innerWidth, h: window.innerHeight },
    utm: pick({ source: q('utm_source'), medium: q('utm_medium'), campaign: q('utm_campaign'), term: q('utm_term'), content: q('utm_content') }),
    clickIds: pick({ gclid: q('gclid'), fbclid: q('fbclid'), msclkid: q('msclkid'), li_fat_id: q('li_fat_id'), ttclid: q('ttclid') }),
    ref: q('ref') ?? q('source'),
  }
}

let state: {
  anonymousId: string
  sessionId: string
  context: ReturnType<typeof readContext>
  queue: QueuedEvent[]
  lastActivity: number
  activeSince: number
  activeMs: number
  sectionMs: Map<string, number>
  visible: Set<string>
  seen: Set<string>
  scrollMarks: Set<number>
} | null = null

/** Current ids, so the signup can be joined to the visit. */
export function identity() {
  return state ? { anonymousId: state.anonymousId, sessionId: state.sessionId, context: state.context } : null
}

const isActive = (now: number) => document.visibilityState === 'visible' && now - (state?.lastActivity ?? 0) < IDLE_MS

/** Moves the time spent since the last tick into the active and per-section counters. */
function tick() {
  if (!state) return
  const now = Date.now()
  if (isActive(now)) {
    const dt = Math.min(now - state.activeSince, FLUSH_MS * 2)
    state.activeMs += dt
    for (const name of state.visible) state.sectionMs.set(name, (state.sectionMs.get(name) ?? 0) + dt)
  }
  state.activeSince = now
}

export function track(type: EventType, name?: string, props?: Props) {
  if (!state) return
  state.queue.push({ type, ts: Date.now(), ...(name ? { name: name.slice(0, 120) } : {}), ...(props ? { props } : {}) })
  if (state.queue.length > 200) state.queue.splice(0, state.queue.length - 200)
}

/** For demo widgets: records what the visitor tried, debounced so sliders don't flood. */
const demoTimers = new Map<string, number>()
export function trackDemo(name: string, props: Props, debounceMs = 0) {
  const send = () => {
    track('demo', name, props)
    phCapture('demo_used', { demo: name, ...props })
  }
  if (!debounceMs) return send()
  window.clearTimeout(demoTimers.get(name))
  demoTimers.set(name, window.setTimeout(send, debounceMs))
}

function flush(final = false) {
  if (!state) return
  tick()
  const events = state.queue.splice(0, 50)
  for (const [name, ms] of state.sectionMs) if (ms >= 500) events.push({ type: 'section_time', ts: Date.now(), name, durationMs: Math.round(ms) })
  state.sectionMs.clear()
  if (state.activeMs >= 500) events.push({ type: final ? 'page_leave' : 'heartbeat', ts: Date.now(), durationMs: Math.round(state.activeMs) })
  state.activeMs = 0
  if (!events.length || !apiConfigured) return
  set('last', String(Date.now()))
  const body = JSON.stringify({ anonymousId: state.anonymousId, sessionId: state.sessionId, context: state.context, events: events.slice(0, 50) })
  const url = api(`/v1/apps/${site.appName}/collect`)
  // text/plain keeps this a "simple" request: no CORS preflight, and sendBeacon works on page exit.
  const blob = new Blob([body], { type: 'text/plain' })
  try {
    if (final && navigator.sendBeacon?.(url, blob)) return
    void fetch(url, { method: 'POST', body: blob, keepalive: true, mode: 'cors', credentials: 'omit' }).catch(() => {})
  } catch { /* offline or blocked: drop silently */ }
}

const sectionName = (el: Element) => {
  const raw = el.getAttribute('data-section') || (el.id === 'top' ? 'hero' : el.id) || el.getAttribute('aria-label') || ''
  return raw.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
}

function observeSections() {
  if (!state || !('IntersectionObserver' in window)) return
  const io = new IntersectionObserver((entries) => {
    if (!state) return
    tick()
    for (const e of entries) {
      const name = sectionName(e.target)
      if (!name) continue
      const vh = window.innerHeight
      const shown = e.intersectionRect.height
      // "in view" = fills half the screen, or half of a short section is visible
      const inView = e.isIntersecting && (shown >= vh * 0.5 || shown >= e.boundingClientRect.height * 0.5)
      if (inView) {
        state.visible.add(name)
        if (!state.seen.has(name)) {
          state.seen.add(name)
          track('section_view', name)
          phCapture('section_viewed', { section: name })
        }
      } else state.visible.delete(name)
    }
  }, { threshold: Array.from({ length: 11 }, (_, i) => i / 10) })
  const watched = new WeakSet<Element>()
  const scan = () => document.querySelectorAll('main section, [data-section]').forEach((el) => {
    if (!watched.has(el)) { watched.add(el); io.observe(el) }
  })
  scan()
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true })
}

function onScroll() {
  if (!state) return
  const doc = document.documentElement
  const pct = Math.round(((window.scrollY + window.innerHeight) / Math.max(doc.scrollHeight, 1)) * 100)
  for (const mark of [25, 50, 75, 90, 100]) {
    if (pct >= mark && !state.scrollMarks.has(mark)) {
      state.scrollMarks.add(mark)
      track('scroll_depth', undefined, { percent: mark })
    }
  }
}

function onClick(ev: MouseEvent) {
  const el = (ev.target as Element | null)?.closest?.('a, button, [data-track]')
  if (!el || el.closest('input, select, textarea')) return
  const label = (el.getAttribute('data-track') || el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80)
  if (!label) return
  const href = el.getAttribute('href') ?? ''
  const cta = el.hasAttribute('data-cta') || href === '#beta' || /beta|access|notified|join|sign ?up|get started/i.test(label)
  const section = sectionName(el.closest('main section, [data-section]') ?? document.body) || 'page'
  track('click', label, { href: href.slice(0, 200), section, cta })
  if (cta) phCapture('cta_clicked', { label, href, section })
}

/** Call once after the app has rendered. */
export function startTracking() {
  if (state || typeof window === 'undefined') return
  const { anonymousId, sessionId } = ids()
  const now = Date.now()
  state = {
    anonymousId, sessionId, context: readContext(), queue: [], lastActivity: now, activeSince: now, activeMs: 0,
    sectionMs: new Map(), visible: new Set(), seen: new Set(), scrollMarks: new Set(),
  }
  void initPostHog(anonymousId, sessionId)
  track('page_view')

  const activity = () => {
    if (!state) return
    const t = Date.now()
    if (!isActive(t)) { tick(); state.activeSince = t } // resume after idle without counting the gap
    state.lastActivity = t
  }
  for (const ev of ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'scroll'] as const) {
    window.addEventListener(ev, activity, { passive: true })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onClick, { capture: true })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush(true)
    else { activity(); if (state) state.activeSince = Date.now() }
  })
  window.addEventListener('pagehide', () => flush(true))
  window.setInterval(() => flush(false), FLUSH_MS)
  observeSections()
  window.setTimeout(() => flush(false), 3000) // first batch soon, so even short visits are counted
}
