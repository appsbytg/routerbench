import { useState } from 'react'
import { formatCost } from '../routing'
import { Container } from '../shared/Container'
import { cx } from '../shared/cx'
import type { ChangeLogEntry, Model, TaskProfile } from '../types'
import { LineDot, SectionHeading } from '../ui'
import { trackDemo } from '../shared/analytics'

interface BenchProps { models: Model[]; tasks: TaskProfile[]; changelog: ChangeLogEntry[] }

/** A departures-board style leaderboard: the benchmarking that runs behind every route. */
export function Bench({ models, tasks, changelog }: BenchProps) {
  const [k, setK] = useState(0)
  const task = tasks[k] ?? tasks[0]!
  const ranked = [...models].sort((a, b) => task.scores[b.id].quality - task.scores[a.id].quality || task.scores[a.id].cost - task.scores[b.id].cost)
  return (
    <section id="bench" aria-labelledby="rb-bench" className="relative overflow-hidden bg-rb-night text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:32px_32px]" />
      <Container className="relative py-24 md:py-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr]">
          <div>
            <SectionHeading dark eyebrow="The bench" title={<span id="rb-bench">The benchmark never stops running.</span>}
              lede="Public leaderboards go stale and rarely match real work. We test every model in the catalogue on the task types our customers actually send, and re-run the bench whenever a model changes." />
            <ul className="mt-10 grid gap-0 border-t border-white/10">
              {changelog.map((c) => (
                <li key={c.date} className="grid grid-cols-[64px_1fr] gap-4 border-b border-white/10 py-4 text-[14.5px]">
                  <span className="font-mono text-[12.5px] text-rb-yellow">{c.date}</span>
                  <span className="text-white/75">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 self-start overflow-hidden rounded-2xl border border-white/10 bg-white/[.03]">
            <div role="tablist" aria-label="Task type" className="flex gap-1 overflow-x-auto border-b border-white/10 p-2">
              {tasks.map((t, i) => (
                <button key={t.kind} role="tab" type="button" aria-selected={i === k} onClick={() => { setK(i); trackDemo('bench_tab', { task: t.kind }) }}
                  className={cx('shrink-0 rounded-lg px-3.5 py-2 text-[13.5px] font-semibold transition', i === k ? 'bg-white text-rb-ink' : 'text-white/60 hover:text-white')}>
                  {t.intent[0]?.[1]}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left font-mono text-[13px]">
                <caption className="sr-only">Benchmark leaderboard for {task.label}</caption>
                <thead className="text-[11.5px] text-white/45">
                  <tr><th className="px-5 py-3 font-normal">#</th><th className="py-3 font-normal">Model</th><th className="py-3 font-normal">Quality</th><th className="py-3 text-right font-normal">Cost / task</th><th className="px-5 py-3 text-right font-normal">p50</th></tr>
                </thead>
                <tbody>
                  {ranked.map((m, i) => {
                    const s = task.scores[m.id]
                    return (
                      <tr key={m.id} className="border-t border-white/[.07]">
                        <td className={cx('px-5 py-3.5 tabular-nums', i === 0 ? 'text-rb-yellow' : 'text-white/40')}>{String(i + 1).padStart(2, '0')}</td>
                        <td className="py-3.5"><span className="inline-flex items-center gap-2.5 font-sans text-[14px] font-semibold text-white"><LineDot color={m.color} className="[&>span:last-child]:bg-rb-night" />{m.name}</span></td>
                        <td className="py-3.5">
                          <span className="flex items-center gap-3">
                            <span className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full" style={{ width: `${s.quality}%`, background: m.color }} /></span>
                            <span className="tabular-nums text-white">{s.quality}</span>
                          </span>
                        </td>
                        <td className="py-3.5 text-right tabular-nums text-white/80">{formatCost(s.cost)}</td>
                        <td className="px-5 py-3.5 text-right tabular-nums text-white/50">{s.latency}s</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap justify-between gap-2 border-t border-white/10 px-5 py-3 text-[12px] text-white/45">
              <span>Last run: 2 days ago · 1,840 test cases for this task type</span>
              <span>Illustrative data</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
