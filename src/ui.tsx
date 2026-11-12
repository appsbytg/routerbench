import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Container } from './shared/Container'
import { cx } from './shared/cx'

type ButtonVariant = 'primary' | 'orange' | 'ghost' | 'light'
type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonBase = { variant?: ButtonVariant; size?: ButtonSize; className?: string; children: ReactNode }
type ButtonProps =
  | (ButtonBase & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBase>)
  | (ButtonBase & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBase>)

const sizes: Record<ButtonSize, string> = { sm: 'h-9 px-4 text-[13.5px]', md: 'h-11 px-5 text-[15px]', lg: 'h-12 px-6 text-[15.5px]' }
const variants: Record<ButtonVariant, string> = {
  primary: 'bg-rb-ink text-white hover:bg-rb-ink2 shadow-[0_10px_24px_-12px_rgba(12,14,20,.7)]',
  orange: 'bg-rb-orange text-white hover:bg-[#F04E14] shadow-[0_10px_24px_-10px_rgba(255,91,31,.75)]',
  ghost: 'bg-white text-rb-ink ring-1 ring-inset ring-rb-line2 hover:bg-rb-wash',
  light: 'bg-white text-rb-ink hover:bg-rb-wash',
}

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: ButtonProps) {
  const cls = cx(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
    sizes[size], variants[variant], className,
  )
  if (rest.href !== undefined) return <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>
  return <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>
}

interface SectionProps { id?: string; label?: string; className?: string; innerClassName?: string; children: ReactNode }

export function Section({ id, label, className, innerClassName, children }: SectionProps) {
  return (
    <section id={id} aria-label={label} className={cx('relative overflow-x-clip border-t border-rb-line', className)}>
      <Container className={cx('py-24 md:py-32', innerClassName)}>{children}</Container>
    </section>
  )
}

interface SectionHeadingProps { eyebrow?: string; title: ReactNode; lede?: ReactNode; align?: 'left' | 'center'; dark?: boolean; className?: string }

/** Eyebrow is a small route marker: a coloured stop on a line. */
export function SectionHeading({ eyebrow, title, lede, align = 'left', dark = false, className }: SectionHeadingProps) {
  return (
    <div className={cx('max-w-[46rem]', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <p className={cx('mb-5 inline-flex items-center gap-2.5 text-[14px] font-semibold', dark ? 'text-white/70' : 'text-rb-ink2')}>
          <span aria-hidden className="relative flex h-3 w-8 items-center">
            <span className="h-[3px] w-full rounded-full bg-rb-orange" />
            <span className={cx('absolute right-0 h-3 w-3 rounded-full border-[3px] border-rb-orange', dark ? 'bg-rb-night' : 'bg-white')} />
          </span>
          {eyebrow}
        </p>
      )}
      <h2 className={cx('font-display text-[clamp(2.2rem,4.8vw,3.6rem)] font-semibold leading-[1.02] tracking-tightest', dark ? 'text-white' : 'text-rb-ink')}>{title}</h2>
      {lede && <p className={cx('mt-5 text-[17.5px] leading-relaxed', dark ? 'text-white/60' : 'text-rb-muted')}>{lede}</p>}
    </div>
  )
}

export const Check = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 16 16" className={cx('h-4 w-4', className)}><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
export const Cross = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 16 16" className={cx('h-4 w-4', className)}><path d="M4.5 4.5l7 7M11.5 4.5l-7 7" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" /></svg>
)

/** Small coloured line-and-dot marker for a model, like a transit line badge. */
export function LineDot({ color, className }: { color: string; className?: string }) {
  return (
    <span aria-hidden className={cx('relative inline-flex h-3 w-5 shrink-0 items-center', className)}>
      <span className="h-[3px] w-full rounded-full" style={{ background: color }} />
      <span className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 bg-white" style={{ borderColor: color }} />
    </span>
  )
}
