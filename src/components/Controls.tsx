import { useState } from 'react'
import { cx } from '../shared/cx'
import { Check, Section, SectionHeading } from '../ui'

const points = [
  ['Quality floor', 'Never route below a score you choose, per project or per request.'],
  ['Cost ceiling', 'Cap what any single request can spend.'],
  ['Pin or block models', 'Force a model for a route, or keep a provider out entirely.'],
  ['Data region', 'Keep traffic on providers that serve the region you need.'],
] as const

/** A small settings panel showing that the customer, not the router, sets the rules. */
export function Controls() {
  const [floor, setFloor] = useState(2)
  const [blocked, setBlocked] = useState<string[]>(['Provider C'])
  const providers = ['Provider A', 'Provider B', 'Provider C', 'Provider D']
  return (
    <Section id="controls" label="Controls">
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <SectionHeading eyebrow="You stay in charge" title="Automatic by default. Your rules always win." lede="RouteBench makes the choice, inside limits you set. Change them any time without touching your code." />
          <ul className="mt-8 grid gap-4">
            {points.map(([t, b]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rb-orange text-white"><Check className="h-3.5 w-3.5" /></span>
                <span className="text-[16px] text-rb-muted"><b className="font-semibold text-rb-ink">{t}.</b> {b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rb-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-rb-line px-6 py-4">
            <p className="font-semibold text-rb-ink">Route settings</p>
            <span className="rounded-full bg-rb-wash px-2.5 py-1 font-mono text-[12px] text-rb-muted">project: support-bot</span>
          </div>
          <div className="grid gap-6 p-6">
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor="rb-floor" className="text-[14px] font-medium text-rb-ink2">Quality floor</label>
                <span className="font-mono text-[13.5px] text-rb-ink">within {floor} pt{floor === 1 ? '' : 's'} of best</span>
              </div>
              <input id="rb-floor" type="range" min={0} max={10} step={1} value={floor} onChange={(e) => setFloor(Number(e.target.value))}
                className="rb-range mt-3 w-full" style={{ background: `linear-gradient(to right, #FF5B1F ${floor * 10}%, #E5E7EE ${floor * 10}%)` }} />
              <div className="mt-1.5 flex justify-between text-[11.5px] text-rb-dim"><span>Strictest</span><span>Cheapest</span></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-rb-line p-3.5"><p className="text-[12px] text-rb-dim">Cost ceiling</p><p className="mt-0.5 font-mono text-[15px] text-rb-ink">$0.05 / request</p></div>
              <div className="rounded-xl border border-rb-line p-3.5"><p className="text-[12px] text-rb-dim">Region</p><p className="mt-0.5 font-mono text-[15px] text-rb-ink">EU only</p></div>
            </div>
            <fieldset>
              <legend className="text-[14px] font-medium text-rb-ink2">Providers</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {providers.map((p) => {
                  const off = blocked.includes(p)
                  return (
                    <button key={p} type="button" aria-pressed={!off} onClick={() => setBlocked((b) => (off ? b.filter((x) => x !== p) : [...b, p]))}
                      className={cx('rounded-full px-3 py-1.5 text-[13px] font-medium ring-1 ring-inset transition', off ? 'bg-white text-rb-dim line-through ring-rb-line' : 'bg-rb-ink text-white ring-rb-ink')}>
                      {p}
                    </button>
                  )
                })}
              </div>
            </fieldset>
            <div className="flex items-center justify-between rounded-xl bg-rb-wash px-4 py-3 text-[13.5px]">
              <span className="text-rb-muted">Pinned for <span className="font-mono text-rb-ink">/legal-review</span></span>
              <span className="font-semibold text-rb-ink">Reasoner</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
