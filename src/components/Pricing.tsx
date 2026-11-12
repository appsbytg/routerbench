import { Button, Check, Section, SectionHeading } from '../ui'

const plans = [
  { name: 'Beta', price: 'Free', unit: 'routing, for the whole beta', cta: 'Request beta access', featured: true,
    items: ['Unlimited routed requests', 'Full catalogue and live bench', 'Savings report every week', 'Direct line to the team'] },
  { name: 'Usage', price: 'Share of savings', unit: 'final terms set with beta teams', cta: 'Get notified', featured: false,
    items: ['You only pay when we save you money', 'Provider tokens at list price', 'Quality floors and cost caps', 'SSO, audit log and EU region'] },
]

export function Pricing() {
  return (
    <Section id="pricing" label="Pricing">
      <SectionHeading align="center" eyebrow="Pricing" title="If we don’t save you money, you don’t pay us." />
      <div className="mx-auto mt-14 grid max-w-[880px] gap-5 md:grid-cols-2">
        {plans.map((p) => (
          <div key={p.name} className={p.featured ? 'flex flex-col rounded-2xl bg-rb-ink p-8 text-white shadow-[0_30px_60px_-30px_rgba(12,14,20,.7)]' : 'rb-card flex flex-col p-8'}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[18px] font-semibold">{p.name}</h3>
              {p.featured && <span className="rounded-full bg-rb-orange px-2.5 py-0.5 text-[12px] font-semibold text-white">Open now</span>}
            </div>
            <p className="mt-6 font-display text-[40px] font-bold leading-none tracking-tightest">{p.price}</p>
            <p className={p.featured ? 'mt-2 text-[14px] text-white/60' : 'mt-2 text-[14px] text-rb-muted'}>{p.unit}</p>
            <ul className={p.featured ? 'mt-7 grid flex-1 gap-3 text-[15px] text-white/85' : 'mt-7 grid flex-1 gap-3 text-[15px] text-rb-ink2'}>
              {p.items.map((it) => <li key={it} className="flex items-center gap-2.5"><Check className="text-rb-orange" />{it}</li>)}
            </ul>
            <Button href="#beta" variant={p.featured ? 'orange' : 'ghost'} className="mt-8 w-full">{p.cta}</Button>
          </div>
        ))}
      </div>
    </Section>
  )
}
