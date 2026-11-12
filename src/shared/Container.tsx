import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cx } from './cx'

type ContainerProps<T extends ElementType> = {
  as?: T
  className?: string
  children?: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className' | 'children'>

/** Centered max-width column with a safe-area-aware side gutter. */
export function Container<T extends ElementType = 'div'>({ as, className, children, style, ...rest }: ContainerProps<T>) {
  const Tag: ElementType = as ?? 'div'
  return (
    <Tag
      className={cx('mx-auto w-full max-w-[1200px]', className)}
      style={{
        paddingLeft: 'max(20px, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(20px, env(safe-area-inset-right, 0px))',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
