import { useState } from 'react'
import { trackDemo } from '../shared/analytics'
import { cx } from '../shared/cx'
import type { Delivery as DeliveryContent } from '../types'
import { Button, Check, Section, SectionHeading } from '../ui'

function Stop({ title, items, color, highlight = false }: { title: string; items: string[]; color: string; highlight?: boolean }) {
  return (
    <div className={cx('relative rounded-2xl border bg-white p-5', highlight ? 'border-transparent shadow-[0_14px_34px_-18px_rgba(12,14,20,.45)]' : 'border-rb-line')}
      style={highlight ? { boxShadow: `0 0 0 2px ${color}, 0 14px 34px -18px rgba(12,14,20,.45)` } : undefined}>
      <span className="flex items-center gap-2.5">
        <span aria-hidden className="h-4 w-4 shrink-0 rounded-full border-[3px] bg-white" style={{ borderColor: color }} />
        <span className="text-[13px] font-semibold text-rb-ink2">{title}</span>
      </span>
      <ul className="mt-3 grid gap-1.5 text-[14px] text-rb-ink">
        {items.map((t) => <li key={t}>{t}</li>)}
      </ul>
    </div>
  )
}

/** "How you'll use it": the one way RouteBench is delivered, what runs where, and the setup. */
export function Delivery({ content: d }: { content: DeliveryContent }) {
  const [tab, setTab] = useState(0)
  const [copied, setCopied] = useState(false)
  const code = d.code[tab] ?? d.code[0]!

  async function copy() {
    try { await navigator.clipboard.writeText(code.body); setCopied(true); window.setTimeout(() => setCopied(false), 1600) } catch { setCopied(false) }
    trackDemo('delivery_copy', { snippet: code.label })
  }

  return (
    <Section id="delivery" label="How you'll use it">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-12">
        <SectionHeading eyebrow="How you’ll use it" title="One API. Change the base URL, set the model to auto." />
        <p className="max-w-[32rem] text-[17px] leading-relaxed text-rb-muted lg:pb-2">{d.summary}</p>
      </div>

      {/* what runs where, drawn as one route */}
      <div className="relative mt-12 grid gap-3 md:mt-14 md:grid-cols-[1fr_1.25fr_1fr] md:gap-6">
        <span aria-hidden className="absolute left-6 right-6 top-[29px] hidden h-[3px] rounded-full bg-gradient-to-r from-[#6A4BFF] via-[#FF5B1F] to-[#00A38C] md:block" />
        <span aria-hidden className="absolute bottom-6 left-[27px] top-6 w-[3px] rounded-full bg-gradient-to-b from-[#6A4BFF] via-[#FF5B1F] to-[#00A38C] md:hidden" />
        <Stop title={d.yourSide.title} items={d.yourSide.items} color="#6A4BFF" />
        <Stop title={d.ourSide.title} items={d.ourSide.items} color="#FF5B1F" highlight />
        <Stop title={d.reaches.title} items={d.reaches.items} color="#00A38C" />
      </div>

      <div className="rb-card mt-6 overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_1.15fr]">
          <div className="p-6 md:p-8">
            <p className="text-[13px] font-semibold text-rb-muted">What you get</p>
            <ul className="mt-3 grid gap-2.5 text-[15px] leading-snug text-rb-ink2">
              {d.youGet.map((t) => <li key={t} className="flex gap-2.5"><Check className="mt-0.5 shrink-0 text-rb-teal" />{t}</li>)}
            </ul>
            <p className="mt-7 text-[13px] font-semibold text-rb-muted">Setup, about five minutes</p>
            <ol className="mt-3 grid gap-3 text-[15px] leading-snug text-rb-ink2">
              {d.steps.map((t, i) => (
                <li key={t} className="flex gap-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rb-orange font-display text-[12px] font-bold text-white">{i + 1}</span><span>{t}</span></li>
              ))}
            </ol>
          </div>
          <div className="flex min-w-0 flex-col gap-4 border-t border-rb-line bg-rb-wash/60 p-5 md:p-8 lg:border-l lg:border-t-0">
            <div className="overflow-hidden rounded-xl bg-rb-night">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 p-2">
                <div role="tablist" aria-label="Language" className="flex gap-1 overflow-x-auto">
                  {d.code.map((c, i) => (
                    <button key={c.label} role="tab" type="button" aria-selected={tab === i} onClick={() => { setTab(i); trackDemo('code_tab', { language: c.label }) }}
                      className={cx('shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition', tab === i ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white')}>{c.label}</button>
                  ))}
                </div>
                <button type="button" onClick={copy} className="shrink-0 rounded-md bg-white/10 px-2.5 py-1 text-[12px] font-semibold text-white/80 transition hover:bg-white/15">{copied ? 'Copied' : 'Copy'}</button>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-6 text-white/90">
                <code>{code.body.split('\n').map((line, i) => (
                  <span key={i} className={cx('block', /#|\/\//.test(line) && /^\s*(#|\/\/)/.test(line) ? 'text-white/40' : '')}>{line || ' '}</span>
                ))}</code>
              </pre>
            </div>
            <div>
              <p className="text-[12.5px] font-semibold text-rb-muted">Works with</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {d.worksWith.map((w) => <li key={w} className="rounded-full bg-white px-2.5 py-1 text-[12.5px] font-medium text-rb-ink2 ring-1 ring-inset ring-rb-line">{w}</li>)}
              </ul>
            </div>
            <Button href="#beta" variant="orange" className="w-full sm:w-auto sm:self-start" data-cta="" onClick={() => trackDemo('delivery_request', { method: 'hosted-api' })}>Get early API access</Button>
            <p className="text-[12.5px] text-rb-dim">Preview: names may change before launch.</p>
          </div>
        </div>
      </div>
    </Section>
  )
}
