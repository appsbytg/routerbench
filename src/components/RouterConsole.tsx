import { useEffect, useId, useMemo, useState, type FormEvent } from 'react'
import { BASELINE } from '../content'
import { formatCost, guessKind, pickModel } from '../routing'
import { cx } from '../shared/cx'
import { useInterval, useReducedMotion } from '../shared/hooks'
import type { Model, Strategy, TaskProfile } from '../types'
import { LineDot } from '../ui'
import { trackDemo } from '../shared/analytics'

const STRATEGIES: Array<[Strategy, string]> = [['balanced', 'Balanced'], ['quality', 'Best quality'], ['cost', 'Lowest cost']]
const ROW = 64

interface Props { models: Model[]; tasks: TaskProfile[] }

/**
 * Hero demo: pick or type a task, watch the intent get read, then see the request take its route.
 * Uses illustrative scores only; nothing is sent anywhere.
 */
export function RouterConsole({ models, tasks }: Props) {
  const reduced = useReducedMotion()
  const inputId = useId()
  const [taskIdx, setTaskIdx] = useState(0)
  const [text, setText] = useState(tasks[0]?.example ?? '')
  const [strategy, setStrategy] = useState<Strategy>('balanced')
  const [phase, setPhase] = useState(reduced ? 99 : 0) // 0..n = intent rows revealed, 99 = routed
  const [touched, setTouched] = useState(false)
  const [replay, setReplay] = useState(0)

  const task = tasks[taskIdx] ?? tasks[0]!
  const chosen = useMemo(() => pickModel(task, models, strategy), [task, models, strategy])
  const routed = phase >= task.intent.length + 1

  // reveal the intent one row at a time, then draw the route
  useEffect(() => {
    if (reduced) { setPhase(99); return }
    setPhase(0)
    let n = 0
    const id = window.setInterval(() => {
      n += 1
      setPhase(n)
      if (n > task.intent.length) window.clearInterval(id)
    }, 380)
    return () => window.clearInterval(id)
  }, [taskIdx, replay, reduced, task.intent.length])

  // until the visitor interacts, cycle through the example tasks
  useInterval(() => {
    if (touched) return
    const next = (taskIdx + 1) % tasks.length
    setTaskIdx(next)
    setText(tasks[next]?.example ?? '')
  }, touched ? null : 7000)

  function choose(i: number) {
    trackDemo('router_preset', { task: tasks[i]?.kind ?? '', strategy })
    setTouched(true)
    setTaskIdx(i)
    setText(tasks[i]?.example ?? '')
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setTouched(true)
    const kind = guessKind(text)
    trackDemo('router_custom_task', { text: text.slice(0, 200), detected: kind, strategy })
    const i = tasks.findIndex((t) => t.kind === kind)
    if (i === taskIdx) setReplay((r) => r + 1) // same profile: replay the animation
    else setTaskIdx(Math.max(i, 0))
  }

  const base = task.scores[BASELINE]
  const win = task.scores[chosen]
  const winModel = models.find((m) => m.id === chosen)!
  const baseModel = models.find((m) => m.id === BASELINE)!
  const saving = Math.round((1 - win.cost / base.cost) * 100)
  const qDelta = win.quality - base.quality
  const height = models.length * ROW

  return (
    <div className="rb-card overflow-hidden text-left">
      {/* top bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-rb-line bg-rb-wash/70 px-4 py-3 sm:px-5">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-rb-ink"><span className="h-2 w-2 animate-pulseDot rounded-full bg-rb-orange motion-reduce:animate-none" />Router demo</span>
        <div role="radiogroup" aria-label="Optimise for" className="ml-auto flex rounded-full bg-white p-1 ring-1 ring-inset ring-rb-line">
          {STRATEGIES.map(([id, label]) => (
            <button key={id} type="button" role="radio" aria-checked={strategy === id} onClick={() => { setTouched(true); setStrategy(id); trackDemo('router_strategy', { strategy: id, task: task.kind }) }}
              className={cx('rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition sm:px-3.5', strategy === id ? 'bg-rb-ink text-white' : 'text-rb-muted hover:text-rb-ink')}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* task input */}
      <form onSubmit={onSubmit} className="border-b border-rb-line p-4 sm:p-5">
        <label htmlFor={inputId} className="text-[12.5px] font-semibold text-rb-muted">Describe a task</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input id={inputId} value={text} onChange={(e) => { setTouched(true); setText(e.target.value) }}
            className="h-12 min-w-0 flex-1 rounded-xl border border-rb-line2 bg-white px-4 text-[15.5px] text-rb-ink placeholder:text-rb-dim focus:border-rb-orange focus:outline-none focus:ring-4 focus:ring-rb-orange/15"
            placeholder="e.g. Translate our release notes into German" />
          <button type="submit" className="h-12 shrink-0 rounded-xl bg-rb-ink px-5 text-[15px] font-semibold text-white transition hover:bg-rb-ink2">Route it</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {tasks.map((t, i) => (
            <button key={t.kind} type="button" onClick={() => choose(i)} aria-pressed={i === taskIdx}
              className={cx('rounded-full px-3 py-1.5 text-[13px] font-medium transition', i === taskIdx ? 'bg-rb-orange/10 text-rb-orange ring-1 ring-inset ring-rb-orange/40' : 'bg-rb-wash text-rb-ink2 hover:bg-rb-line')}>
              {t.label}
            </button>
          ))}
        </div>
      </form>

      <div className="grid lg:grid-cols-[260px_1fr]">
        {/* intent read */}
        <div className="border-b border-rb-line p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <p className="text-[12.5px] font-semibold text-rb-muted">What RouteBench read</p>
          <dl className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
            {task.intent.map(([k, v], i) => (
              <div key={k} className={cx('rounded-lg border border-rb-line px-3 py-2 transition-all duration-300', phase > i ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-30')}>
                <dt className="text-[11.5px] text-rb-dim">{k}</dt>
                <dd className="text-[14px] font-semibold text-rb-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* route board */}
        <div className="min-w-0 p-4 sm:p-5">
          <div className="mb-2 flex items-center justify-between gap-3 text-[12px] text-rb-dim">
            <span className="font-semibold text-rb-muted">Candidates for this task</span>
            <span className="hidden sm:inline">quality · cost per task · speed</span>
          </div>
          <div className="relative" style={{ height }}>
            <svg aria-hidden className="absolute left-0 top-0 h-full w-[56px] sm:w-[120px]" viewBox={`0 0 120 ${height}`} preserveAspectRatio="none" fill="none">
              {models.map((m, i) => {
                const y = i * ROW + ROW / 2
                const on = routed && m.id === chosen
                const d = `M10 ${height / 2} C 64 ${height / 2}, 60 ${y}, 120 ${y}`
                return (
                  <g key={m.id}>
                    <path d={d} stroke={on ? m.color : '#E5E7EE'} strokeWidth={on ? 5 : 2} vectorEffect="non-scaling-stroke" className="transition-all duration-500" />
                    {on && !reduced && <path d={d} stroke="#fff" strokeWidth={2} strokeDasharray="4 8" vectorEffect="non-scaling-stroke" className="animate-dash" />}
                  </g>
                )
              })}
            </svg>
            <span aria-hidden className="absolute left-[2px] top-1/2 z-10 grid h-4 w-4 -translate-y-1/2 place-items-center rounded-full bg-rb-ink ring-4 ring-white">
              <span className="h-1.5 w-1.5 rounded-full bg-rb-orange" />
            </span>
            <ol className="relative ml-[56px] sm:ml-[120px]" aria-label="Candidate models">
              {models.map((m) => {
                const s = task.scores[m.id]
                const on = routed && m.id === chosen
                return (
                  <li key={m.id} className="flex items-center" style={{ height: ROW }}>
                    <div className={cx('flex h-[54px] w-full min-w-0 items-center gap-3 rounded-xl border px-3 transition-all duration-500', on ? 'border-transparent bg-white shadow-[0_8px_24px_-12px_rgba(12,14,20,.35)]' : 'border-rb-line bg-white/70')}
                      style={on ? { boxShadow: `0 0 0 2px ${m.color}, 0 10px 26px -14px ${m.color}` } : undefined}>
                      <LineDot color={m.color} />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-2 truncate text-[14px] font-semibold text-rb-ink">
                          {m.name}
                          {on && <span className="hidden rounded-full px-2 py-0.5 sm:inline text-[10.5px] font-bold text-white" style={{ background: m.color }}>Routed</span>}
                          {m.id === BASELINE && !on && <span className="hidden rounded-full bg-rb-wash px-2 py-0.5 text-[10.5px] font-semibold text-rb-muted sm:inline">Top model</span>}
                        </p>
                        <p className="hidden truncate text-[12px] text-rb-dim sm:block">{m.kind}</p>
                      </div>
                      <div className="hidden w-[110px] items-center gap-2 md:flex">
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-rb-wash"><span className="block h-full rounded-full" style={{ width: `${s.quality}%`, background: m.color }} /></span>
                      </div>
                      <span className="w-8 text-right font-mono text-[13px] tabular-nums text-rb-ink">{s.quality}</span>
                      <span className="w-[64px] text-right font-mono text-[13px] tabular-nums text-rb-ink2">{formatCost(s.cost)}</span>
                      <span className="hidden w-[44px] text-right font-mono text-[12.5px] tabular-nums text-rb-dim sm:inline">{s.latency}s</span>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* result */}
      <div aria-live="polite" className={cx('flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-rb-line px-4 py-4 transition-colors duration-500 sm:px-5', routed ? 'bg-rb-ink text-white' : 'bg-rb-wash text-rb-muted')}>
        {routed ? (
          chosen === BASELINE ? (
            <p className="text-[15px]"><b className="font-semibold">{baseModel.name}</b> is the best fit for this one, so it stays there. RouteBench only moves traffic when it pays off.</p>
          ) : (
            <>
              <p className="w-full min-w-0 text-[15px] leading-snug sm:w-auto sm:flex-1">
                Routed to <b className="font-semibold" style={{ color: winModel.color === '#F2B400' ? '#FFD155' : undefined }}>{winModel.name}</b>: {win.quality} quality vs {base.quality} on {baseModel.name}, at {formatCost(win.cost)} a task instead of {formatCost(base.cost)}.
              </p>
              <div className="flex items-baseline gap-5">
                <p><span className="font-display text-[30px] font-bold tabular-nums text-rb-orange">{saving}%</span> <span className="text-[13px] text-white/60">cheaper</span></p>
                <p><span className="font-display text-[30px] font-bold tabular-nums">{qDelta >= 0 ? `+${qDelta}` : qDelta}</span> <span className="text-[13px] text-white/60">quality</span></p>
              </div>
            </>
          )
        ) : (
          <p className="text-[14.5px]">Reading the task…</p>
        )}
      </div>
      <p className="border-t border-rb-line bg-white px-5 py-2.5 text-[12px] text-rb-dim">Demo with illustrative benchmark scores and prices. Nothing you type leaves this page.</p>
    </div>
  )
}
