import { Accordion, type FaqItem } from '../shared/Accordion'
import { Section, SectionHeading } from '../ui'

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <Section id="faq" label="Questions">
      <div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
        <SectionHeading eyebrow="FAQ" title="Questions teams ask first." />
        <Accordion items={items} classes={{
          root: 'border-t border-rb-line2', item: 'border-b border-rb-line2',
          button: 'py-5 text-[17px] font-semibold text-rb-ink', icon: 'bg-rb-wash text-rb-ink',
          answer: 'max-w-[40rem] pb-6 text-[15.5px] leading-relaxed text-rb-muted',
        }} />
      </div>
    </Section>
  )
}
