'use client'

import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/format'

type Variant = 'primary' | 'secondary' | 'ghost' | 'onDark' | 'onBand'
type Size = 'sm' | 'md' | 'lg'

/**
 * One button. Every variant is defined in semantic tokens, so it is correct in
 * both the day and the night theme without a single conditional.
 */
const variants: Record<Variant, string> = {
  primary: 'bg-gold text-gold-ink border border-gold hover:bg-gold-hover hover:border-gold-hover',
  secondary: 'bg-transparent text-ink border border-line-strong hover:bg-ink hover:text-ink-inverse hover:border-ink',
  ghost: 'bg-transparent text-gold border border-transparent hover:bg-gold/10',
  onDark:
    'bg-transparent text-ink-inverse border border-ink-inverse/45 hover:bg-ink-inverse hover:text-ink hover:border-ink-inverse',
  /* For the forest-green brand band, which keeps its colour in both themes -
     so this variant must not flip with the theme the way `onDark` does. */
  onBand:
    'bg-transparent text-on-band border border-on-band/45 hover:bg-on-band hover:text-band hover:border-on-band',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-[0.75rem] tracking-[0.1em] gap-2',
  md: 'h-12 px-6 text-[0.8rem] tracking-[0.1em] gap-2.5',
  lg: 'h-14 px-8 text-[0.85rem] tracking-[0.1em] gap-3',
}

const base =
  'inline-flex items-center justify-center rounded-full font-semibold uppercase ' +
  'transition-[background-color,border-color,color,transform] duration-300 ease-[var(--ease-out-luxe)] ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap'

interface Shared {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  /** Rendered after the label; nudges right on hover. */
  trailing?: ReactNode
  leading?: ReactNode
}

function content(children: ReactNode, leading?: ReactNode, trailing?: ReactNode) {
  return (
    <>
      {leading}
      <span>{children}</span>
      {trailing ? (
        <span className="transition-transform duration-300 ease-[var(--ease-out-luxe)] group-hover:translate-x-1">
          {trailing}
        </span>
      ) : null}
    </>
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  leading,
  trailing,
  ...rest
}: Shared & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn('group', base, variants[variant], sizes[size], className)} {...rest}>
      {content(children, leading, trailing)}
    </button>
  )
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  leading,
  trailing,
  onClick,
  ...rest
}: Shared & {
  href: string
  onClick?: () => void
  target?: string
  rel?: string
  'aria-label'?: string
}) {
  const classes = cn('group', base, variants[variant], sizes[size], className)
  const external = /^(https?:|tel:|mailto:)/.test(href)

  if (external) {
    return (
      <a href={href} className={classes} onClick={onClick} {...rest}>
        {content(children, leading, trailing)}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} onClick={onClick} {...rest}>
      {content(children, leading, trailing)}
    </Link>
  )
}

/** Square icon button used for close, prev/next, cart and theme controls. */
export function IconButton({
  label,
  className,
  children,
  tone = 'default',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  children: ReactNode
  tone?: 'default' | 'onDark'
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300',
        tone === 'onDark'
          ? 'border-ink-inverse/40 text-ink-inverse hover:border-gold hover:bg-gold hover:text-gold-ink'
          : 'border-line-strong text-ink hover:border-gold hover:bg-gold hover:text-gold-ink',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
