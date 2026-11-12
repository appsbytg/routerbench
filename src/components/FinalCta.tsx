import { BetaForm } from '../shared/BetaForm'
import { Container } from '../shared/Container'
import { Check } from '../ui'

export function FinalCta() {
  return (
    <section id="beta" aria-labelledby="rb-beta" className="relative overflow-hidden bg-rb-night text-white">
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" fill="none">
        <path d="M-40 560 C 300 560, 380 200, 760 200 S 1200 80, 1500 80" stroke="#FF5B1F" strokeOpacity=".35" strokeWidth="3" />
        <path d="M-40 620 C 340 620, 420 300, 780 300 S 1240 260, 1500 260" stroke="#6A4BFF" strokeOpacity=".3" strokeWidth="3" />
        <path d="M-40 660 C 380 660, 460 400, 800 400 S 1260 440, 1500 440" stroke="#00A38C" strokeOpacity=".3" strokeWidth="3" />
      </svg>
      <Container className="relative grid gap-14 py-24 md:py-32 lg:grid-cols-2">
        <div>
          <h2 id="rb-beta" className="font-display text-[clamp(2.5rem,5.6vw,4.4rem)] font-bold leading-[0.98] tracking-tightest">Stop paying top-model prices for every request.</h2>
          <p className="mt-6 max-w-[30rem] text-[17.5px] leading-relaxed text-white/65">We’re onboarding a small group of teams with real LLM traffic. We’ll help you send a slice of it through RouteBench and measure the savings before you switch everything.</p>
          <ul className="mt-8 grid gap-3 text-[15.5px] text-white/80">
            {['Help measuring savings on your own traffic', 'Free routing for the whole beta', 'Help setting quality floors per route'].map((t) => (
              <li key={t} className="flex items-center gap-3"><span className="grid h-5 w-5 place-items-center rounded-full bg-rb-orange text-white"><Check className="h-3 w-3" /></span>{t}</li>
            ))}
          </ul>
        </div>
        <BetaForm
          product="RouteBench"
          fields={[
            { id: 'company', label: 'Company', type: 'text', placeholder: 'Acme Inc.', autoComplete: 'organization' },
            { id: 'spend', label: 'Monthly LLM spend', type: 'select', options: ['Under $1k', '$1k–10k', '$10k–50k', '$50k–250k', '$250k+'] },
            { id: 'useCase', label: 'Main use case', type: 'select', options: ['Agents', 'Chat / support', 'Document processing', 'Coding tools', 'Other'] },
            { id: 'providers', label: 'Providers today', type: 'select', options: ['One provider', 'Two or three', 'Many', 'Self-hosted models too'] },
          ]}
          footnote="We’ll only use your email to contact you about the beta."
          classes={{
            form: 'grid gap-4 self-start rounded-2xl bg-white p-6 text-rb-ink shadow-[0_30px_70px_-30px_rgba(0,0,0,.8)] sm:p-8',
            grid: 'grid gap-4 sm:grid-cols-2',
            label: 'grid gap-2 text-[13.5px] font-semibold text-rb-ink2',
            input: 'h-11 w-full rounded-xl border border-rb-line2 bg-white px-3.5 text-[15px] font-normal text-rb-ink placeholder:text-rb-dim focus:border-rb-orange focus:outline-none focus:ring-4 focus:ring-rb-orange/15 disabled:opacity-60',
            button: 'mt-2 h-12 rounded-full bg-rb-orange text-[15px] font-semibold text-white transition hover:bg-[#F04E14] disabled:opacity-70',
            ok: 'rounded-xl bg-rb-teal/10 px-3.5 py-3 text-[14px] text-rb-teal',
            error: 'rounded-xl bg-rb-pink/10 px-3.5 py-3 text-[14px] text-[#C22B5F]',
            footnote: 'text-[12.5px] text-rb-dim',
            notice: 'mt-2 rounded-xl border border-rb-orange/30 bg-rb-orange/[.06] p-4 text-[14px] leading-relaxed text-rb-ink',
            noticeButton: 'mt-3 h-10 rounded-full bg-rb-ink px-4 text-[14px] font-semibold text-white transition hover:bg-rb-ink2 disabled:opacity-60',
          }}
        />
      </Container>
    </section>
  )
}
