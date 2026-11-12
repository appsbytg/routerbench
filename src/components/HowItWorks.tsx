import type { Step } from '../types'
import { Section, SectionHeading } from '../ui'

const stopColors = ['#6A4BFF', '#FF5B1F', '#00A38C']

/** Three stops on one line: a literal route diagram of the request's journey. */
export function HowItWorks({ steps }: { steps: Step[] }) {
  return (
    <Section id="how" label="How it works" className="bg-rb-wash/60">
      <SectionHeading align="center" eyebrow="How it works" title="Three stops, a few milliseconds." lede="You keep calling an API the way you do today. Everything else happens on our side." />
      <ol className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
        <span aria-hidden className="absolute left-[22px] top-6 hidden h-[4px] rounded-full bg-gradient-to-r from-[#6A4BFF] via-[#FF5B1F] to-[#00A38C] md:block" style={{ width: 'calc(100% - 44px)' }} />
        <span aria-hidden className="absolute bottom-6 left-[22px] top-6 w-[4px] rounded-full bg-gradient-to-b from-[#6A4BFF] via-[#FF5B1F] to-[#00A38C] md:hidden" />
        {steps.map((s, i) => (
          <li key={s.title} className="relative pl-16 md:pl-0">
            <span className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-full border-[5px] bg-white font-display text-[17px] font-bold text-rb-ink md:relative" style={{ borderColor: stopColors[i] }}>{i + 1}</span>
            <h3 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-rb-ink md:mt-6">{s.title}</h3>
            <p className="mt-2 max-w-[22rem] text-[15.5px] leading-relaxed text-rb-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
