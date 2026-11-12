import { useRef, useState, type FormEvent } from 'react'
import { identity, track } from './analytics'
import { useApiStatus } from './apiStatus'
import { SignupError, submitBetaSignup, type BetaFields } from './betaSignup'
import { phCapture, phIdentify } from './posthog'
import { cx } from './cx'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type BetaField =
  | { id: string; label: string; type: 'text'; placeholder?: string; autoComplete?: string }
  | { id: string; label: string; type: 'select'; options: string[] }

export interface BetaFormClasses {
  form?: string
  grid?: string
  label?: string
  input?: string
  button?: string
  ok?: string
  error?: string
  footnote?: string
  /** The "signup is unavailable" panel */
  notice?: string
  noticeButton?: string
}

interface BetaFormProps {
  product: string
  fields?: BetaField[]
  classes?: BetaFormClasses
  submitLabel?: string
  footnote?: string
}

type Status = 'idle' | 'sending' | 'done' | 'error'

/** Beta signup form. Disables itself with a clear message while the signup service is unreachable. */
export function BetaForm({ product, fields = [], classes = {}, submitLabel = 'Request beta access', footnote }: BetaFormProps) {
  const { status: api, recheck } = useApiStatus()
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [checking, setChecking] = useState(false)
  const started = useRef(false)
  const slug = product.toLowerCase().replace(/\W+/g, '-')
  const unavailable = api === 'down'
  const done = status === 'done'

  function onFocus() {
    if (started.current) return
    started.current = true
    track('form_start', 'beta')
    phCapture('signup_form_started')
  }

  async function onRecheck() {
    setChecking(true)
    await recheck()
    setChecking(false)
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (unavailable) return
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    const value = String(form.get('email') ?? '').trim()
    if (!EMAIL.test(value)) {
      setStatus('error')
      setMessage('Enter a work email address, like you@company.com.')
      formEl.querySelector<HTMLInputElement>('[name=email]')?.focus()
      return
    }
    setStatus('sending')
    setMessage('')
    const values: BetaFields = {}
    fields.forEach((f) => { values[f.id] = String(form.get(f.id) ?? '').trim() })
    track('form_submit', 'beta')
    try {
      const { duplicate } = await submitBetaSignup(value, values, String(form.get('website') ?? ''))
      setStatus('done')
      setMessage(duplicate
        ? `You’re already on the list. We’ve updated your details and will email ${value} when a slot opens.`
        : `You’re on the list. We’ll email ${value} when a beta slot opens.`)
      track('signup_success', 'beta')
      const who = identity()
      if (who) phIdentify(who.anonymousId, { email: value, ...values })
      phCapture('beta_signup_submitted', { duplicate, ...values })
    } catch (err) {
      const code = err instanceof SignupError ? err.code : 'unavailable'
      track('signup_error', code)
      phCapture('beta_signup_failed', { reason: code })
      setStatus('error')
      setMessage(
        code === 'invalid_email' ? 'That email address doesn’t look right. Check it and try again.'
        : code === 'rate_limited' ? 'Too many attempts from your network. Wait a minute, then try again.'
        : code === 'rejected' ? 'We couldn’t accept that request. Check your details and try again.'
        : '',
      )
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} onFocus={onFocus} className={classes.form}>
      <label htmlFor={`${slug}-email`} className={classes.label}>
        Work email
        <input
          id={`${slug}-email`} name="email" type="email" autoComplete="email" placeholder="you@company.com"
          value={email} onChange={(e) => setEmail(e.target.value)} className={classes.input} disabled={done} required
        />
      </label>
      <div className={classes.grid}>
        {fields.map((f) => (
          <label key={f.id} htmlFor={`${slug}-${f.id}`} className={classes.label}>
            {f.label}
            {f.type === 'select' ? (
              <select id={`${slug}-${f.id}`} name={f.id} className={classes.input} disabled={done}>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input id={`${slug}-${f.id}`} name={f.id} type="text" placeholder={f.placeholder} autoComplete={f.autoComplete} className={classes.input} disabled={done} />
            )}
          </label>
        ))}
      </div>
      {/* Honeypot for bots: hidden from people and screen readers */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label>Website<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {unavailable && !done ? (
        <div role="alert" className={classes.notice}>
          <p className="font-semibold">Signups are paused for a moment</p>
          <p className="mt-1 opacity-80">Our signup service isn’t responding right now, so we can’t take your request yet. Please try again in a few minutes. Your details stay in the form.</p>
          <button type="button" onClick={onRecheck} disabled={checking} className={classes.noticeButton}>
            {checking ? 'Checking…' : 'Try again'}
          </button>
        </div>
      ) : (
        <button type="submit" className={classes.button} disabled={status === 'sending' || done}>
          {done ? 'Request sent' : status === 'sending' ? 'Sending request…' : submitLabel}
        </button>
      )}
      <div role="status" aria-live="polite">
        {message && <p className={cx(done ? classes.ok : classes.error)}>{message}</p>}
      </div>
      {footnote && <p className={classes.footnote}>{footnote}</p>}
    </form>
  )
}
