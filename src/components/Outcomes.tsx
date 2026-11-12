import type { Outcome } from '../types'
import { Section, SectionHeading } from '../ui'

const colors = ['#FF5B1F', '#6A4BFF', '#00A38C', '#1D8CF0']

/** "What you get": four concrete results, each with a line of evidence. */
export function Outcomes({ items }: { items: Outcome[] }) {
  return (
    <Section id="get" label="What you get">
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
        <SectionHeading eyebrow="What you get" title="Better answers per dollar, with nothing to maintain." />
        <p className="max-w-[32rem] text-[17px] leading-relaxed text-rb-muted md:pb-2">
          Teams usually send everything to their most expensive model because choosing is hard. RouteBench makes the choice for every request, so you stop overpaying for easy work.
        </p>
      </div>
      <ul className="mt-14 grid gap-5 md:grid-cols-2">
        {items.map((o, i) => (
          <li key={o.title} className="rb-card relative flex flex-col overflow-hidden p-7 md:p-9">
            <span aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: colors[i] }} />
            <h3 className="font-display text-[24px] font-semibold leading-tight tracking-[-0.025em] text-rb-ink">{o.title}</h3>
            <p className="mt-3 flex-1 text-[15.5px] leading-relaxed text-rb-muted">{o.body}</p>
            <p className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg bg-rb-wash px-3 py-2 font-mono text-[12.5px] text-rb-ink2">
              <span className="h-2 w-2 rounded-full" style={{ background: colors[i] }} aria-hidden />{o.proof}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
