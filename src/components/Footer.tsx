import { Container } from '../shared/Container'
import type { FooterContent } from '../types'
import { Logo } from './Logo'

export function Footer({ content }: { content: FooterContent }) {
  return (
    <footer className="overflow-hidden bg-white">
      <Container className="grid gap-12 pb-10 pt-16 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[18rem] text-[14px] leading-relaxed text-rb-muted">{content.tagline}</p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-rb-line px-3 py-1.5 text-[12.5px] font-medium text-rb-muted">
            <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-rb-teal motion-reduce:animate-none" /> Bench running · private beta
          </p>
        </div>
        {content.columns.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="text-[13px] font-semibold text-rb-ink">{c.title}</p>
            <ul className="mt-4 grid gap-2.5 text-[14px] text-rb-muted">
              {c.links.map(([l, h]) => <li key={l}><a href={h} className="transition hover:text-rb-ink">{l}</a></li>)}
            </ul>
          </nav>
        ))}
      </Container>
      <Container className="flex flex-wrap justify-between gap-3 border-t border-rb-line py-6 text-[12.5px] text-rb-muted">
        <span>© 2026 RouteBench</span>
        <span>Model names and scores on this page are illustrative.</span>
      </Container>
      <Container aria-hidden className="pointer-events-none select-none">
        <p className="-mb-[0.2em] text-center font-display text-[clamp(4rem,18vw,15rem)] font-bold leading-none tracking-tightest text-rb-ink/[.05]">RouteBench</p>
      </Container>
    </footer>
  )
}
