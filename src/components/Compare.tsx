import { cx } from '../shared/cx'
import type { Alternative, CompareRow, Support } from '../types'
import { Check, Cross, Section, SectionHeading } from '../ui'

function Mark({ v, ours }: { v: Support; ours: boolean }) {
  if (v === 'yes') return <span className={cx('inline-grid h-6 w-6 place-items-center rounded-full', ours ? 'bg-rb-orange text-white' : 'bg-rb-teal/10 text-rb-teal')}><Check className="h-3.5 w-3.5" /><span className="sr-only">Yes</span></span>
  if (v === 'no') return <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-rb-wash text-rb-dim"><Cross className="h-3.5 w-3.5" /><span className="sr-only">No</span></span>
  return <span className="font-mono text-[12px] text-rb-muted">{v}</span>
}

export function Compare({ alternatives, rows }: { alternatives: Alternative[]; rows: CompareRow[] }) {
  const ours = alternatives.length - 1
  return (
    <Section id="compare" label="Compare" className="bg-rb-wash/60">
      <SectionHeading eyebrow="Why RouteBench" title="Why not just use the best model, or write some rules?" lede="Both work until the bill arrives or the next model ships. Here’s how the usual options compare." />
      <div className="rb-card mt-12 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <caption className="sr-only">RouteBench compared with other ways of choosing models</caption>
          <thead>
            <tr className="border-b border-rb-line align-bottom">
              <th scope="col" className="w-[30%] px-6 py-5"><span className="sr-only">Capability</span></th>
              {alternatives.map((a, i) => (
                <th key={a.name} scope="col" className={cx('px-4 py-5 text-center', i === ours && 'bg-rb-ink')}>
                  <span className={cx('block font-display text-[16px] font-semibold', i === ours ? 'text-white' : 'text-rb-ink')}>{a.name}</span>
                  <span className={cx('mt-1 block text-[12px] font-normal leading-snug', i === ours ? 'text-white/60' : 'text-rb-dim')}>{a.note}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, vals], r) => (
              <tr key={label} className={r < rows.length - 1 ? 'border-b border-rb-line' : ''}>
                <th scope="row" className="px-6 py-4 text-[15px] font-medium text-rb-ink">{label}</th>
                {vals.map((v, i) => <td key={i} className={cx('px-4 py-4 text-center', i === ours && 'bg-rb-orange/[.06]')}><Mark v={v} ours={i === ours} /></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  )
}
