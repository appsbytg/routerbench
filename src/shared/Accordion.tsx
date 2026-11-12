import { useId, useState } from 'react'
import { cx } from './cx'

export interface FaqItem {
  q: string
  a: string
}

export interface AccordionClasses {
  root?: string
  item?: string
  button?: string
  icon?: string
  answer?: string
}

interface AccordionProps {
  items: FaqItem[]
  classes?: AccordionClasses
}

/** Accessible single-open accordion. Styling comes from the caller. */
export function Accordion({ items, classes = {} }: AccordionProps) {
  const [open, setOpen] = useState(0)
  const base = useId()
  return (
    <div className={classes.root}>
      {items.map((it, i) => {
        const isOpen = open === i
        const id = `${base}-${i}`
        return (
          <div key={it.q} className={classes.item}>
            <h3 className="m-0">
              <button
                type="button"
                className={cx('flex w-full items-center justify-between gap-6 text-left', classes.button)}
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <span>{it.q}</span>
                <span
                  aria-hidden
                  className={cx('grid h-7 w-7 shrink-0 place-items-center rounded-full transition-transform duration-300', classes.icon, isOpen && 'rotate-45')}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                </span>
              </button>
            </h3>
            <div
              id={id}
              role="region"
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className={classes.answer}>{it.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
