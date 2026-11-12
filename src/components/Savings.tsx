import { useId, useState } from 'react'
import { useEffect } from 'react'
import { trackDemo } from '../shared/analytics'
import { Section, SectionHeading } from '../ui'

interface SliderProps { label: string; hint?: string; value: number; min: number; max: number; step: number; format: (n: number) => string; onChange: (n: number) => void }

function Slider({ label, hint, value, min, max, step, format, onChange }: SliderProps) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[14.5px] font-medium text-rb-ink2">{label}</label>
        <output htmlFor={id} className="font-mono text-[16px] font-medium tabular-nums text-rb-ink">{format(value)}</output>
      </div>
      {hint && <p className="mt-0.5 text-[12.5px] text-rb-dim">{hint}</p>}
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="rb-range mt-3 w-full" style={{ background: `linear-gradient(to right, #FF5B1F ${pct}%, #E5E7EE ${pct}%)` }} />
    </div>
  )
}

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US')
// Cautious example assumptions, shown to the visitor.
const ROUTINE_SAVING = 0.8 // routine requests move to much cheaper models
const HARD_SAVING = 0.15 // hard requests mostly stay on large models

export function Savings() {
  const [spend, setSpend] = useState(20000)
  const [routine, setRoutine] = useState(60)
  const saved = spend * (routine / 100) * ROUTINE_SAVING + spend * (1 - routine / 100) * HARD_SAVING
  const after = spend - saved
  const pct = Math.round((saved / spend) * 100)
  const [moved, setMoved] = useState(false)
  useEffect(() => { if (moved) trackDemo('savings_calculator', { monthlySpend: spend, routinePct: routine, estSavings: Math.round(saved) }, 1200) }, [moved, spend, routine, saved])
  return (
    <Section id="savings" label="Savings estimate">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <div>
          <SectionHeading eyebrow="Your savings" title="See what routing is worth on your bill." lede="Two numbers are enough for a first estimate. Beta teams get a measured figure from a replay of their own traffic before anything changes." />
          <p className="mt-6 max-w-[30rem] text-[13.5px] leading-relaxed text-rb-dim">
            Assumes routine requests cost {Math.round(ROUTINE_SAVING * 100)}% less on a well-chosen model and hard ones {Math.round(HARD_SAVING * 100)}% less. Your mix will differ.
          </p>
        </div>
        <div className="rb-card overflow-hidden">
          <div className="grid gap-8 p-7 md:p-9">
            <Slider label="Monthly spend on LLM APIs" value={spend} min={1000} max={250000} step={1000} format={money} onChange={(n) => { setMoved(true); setSpend(n) }} />
            <Slider label="Share of requests that are routine" hint="Extraction, classification, short replies, formatting" value={routine} min={10} max={90} step={5} format={(n) => `${n}%`} onChange={(n) => { setMoved(true); setRoutine(n) }} />
          </div>
          <div className="border-t border-rb-line p-7 md:p-9">
            <div className="flex h-10 overflow-hidden rounded-lg" role="img" aria-label={`Spend drops from ${money(spend)} to ${money(after)} a month`}>
              <div className="grid place-items-center bg-rb-ink font-mono text-[12.5px] text-white transition-all duration-300" style={{ width: `${100 - pct}%` }}>{money(after)}</div>
              <div className="grid place-items-center bg-rb-orange/15 font-mono text-[12.5px] text-rb-orange transition-all duration-300" style={{ width: `${pct}%` }}>−{pct}%</div>
            </div>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium text-rb-muted">Estimated savings</p>
                <p className="font-display text-[44px] font-bold leading-none tracking-tightest text-rb-ink tabular-nums" aria-live="polite">{money(saved)}<span className="text-[18px] font-semibold text-rb-muted"> /month</span></p>
              </div>
              <p className="text-right text-[13.5px] text-rb-muted">{money(saved * 12)} a year</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
