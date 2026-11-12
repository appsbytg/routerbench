import type { ReactNode } from 'react'
import { cx } from './cx'

interface MarqueeProps {
  items: ReactNode[]
  className?: string
  itemClassName?: string
  /** Tailwind `from-*` class matching the background, used for the edge fades. */
  fadeFrom?: string
}

/** Infinite horizontal belt. Items render twice so the loop is seamless. */
export function Marquee({ items, className, itemClassName, fadeFrom = 'from-black' }: MarqueeProps) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <li key={i} className={cx('whitespace-nowrap', itemClassName)}>{it}</li>
      ))}
    </ul>
  )
  return (
    <div className={cx('relative overflow-hidden', className)}>
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {row(false)}
        {row(true)}
      </div>
      <div className={cx('pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r to-transparent', fadeFrom)} />
      <div className={cx('pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l to-transparent', fadeFrom)} />
    </div>
  )
}
