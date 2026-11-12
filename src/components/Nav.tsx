import { useState } from 'react'
import { Container } from '../shared/Container'
import { cx } from '../shared/cx'
import { useScrolled } from '../shared/hooks'
import type { NavLink } from '../types'
import { Button } from '../ui'
import { Logo } from './Logo'

export function Nav({ links }: { links: NavLink[] }) {
  const scrolled = useScrolled()
  const [open, setOpen] = useState(false)
  return (
    <>
      <div aria-hidden className="fixed inset-x-0 top-0 z-50 bg-white" style={{ height: 'env(safe-area-inset-top, 0px)' }} />
      <header className={cx('sticky z-40 border-b transition-colors duration-300', scrolled ? 'border-rb-line bg-white/85 backdrop-blur-xl' : 'border-transparent bg-transparent')} style={{ top: 'env(safe-area-inset-top, 0px)' }}>
        <Container className="flex h-16 items-center gap-8">
          <a href="#top" aria-label="RouteBench home"><Logo /></a>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1 text-[14.5px] font-medium text-rb-muted">
              {links.map((l) => <li key={l.href}><a href={l.href} className="rounded-full px-3 py-2 transition hover:bg-rb-wash hover:text-rb-ink">{l.label}</a></li>)}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button href="#beta" size="sm">Join the beta</Button>
            <button type="button" className="grid h-9 w-9 place-items-center rounded-full text-rb-muted ring-1 ring-inset ring-rb-line2 lg:hidden" aria-expanded={open} aria-controls="rb-mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path d={open ? 'M3 3l10 10M13 3L3 13' : 'M2 5h12M2 11h12'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
        </Container>
        {open && (
          <nav id="rb-mobile-nav" aria-label="Mobile" className="border-t border-rb-line bg-white lg:hidden">
            <Container as="ul" className="grid py-3">
              {links.map((l) => <li key={l.href}><a onClick={() => setOpen(false)} href={l.href} className="block py-3 text-[15px] font-medium text-rb-muted">{l.label}</a></li>)}
            </Container>
          </nav>
        )}
      </header>
    </>
  )
}
