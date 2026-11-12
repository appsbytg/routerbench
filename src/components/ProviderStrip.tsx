import { Container } from '../shared/Container'
import { Marquee } from '../shared/Marquee'

export function ProviderStrip({ items }: { items: string[] }) {
  return (
    <section aria-label="Providers in the catalogue" className="border-t border-rb-line">
      <Container className="grid items-center gap-6 py-10 md:grid-cols-[230px_1fr]">
        <p className="text-[14px] font-medium leading-snug text-rb-muted">We benchmark models from every major provider</p>
        <Marquee items={items} fadeFrom="from-white" itemClassName="font-display text-[22px] font-semibold tracking-[-0.02em] text-rb-ink/35" />
      </Container>
    </section>
  )
}
