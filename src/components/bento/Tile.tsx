'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/format'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * A bento cell. Everything on the home grid is one of these, so radius,
 * border, elevation and hover behaviour stay identical across the page.
 *
 * `tone="inverse"` flips to the opposite-brightness surface; `tone="accent"`
 * is the single gold tile that carries the primary action.
 */
export function Tile({
  children,
  className,
  tone = 'card',
  href,
  interactive = false,
  delay = 0,
  padded = true,
}: {
  children: ReactNode
  className?: string
  tone?: 'card' | 'surface' | 'inverse' | 'accent'
  href?: string
  interactive?: boolean
  delay?: number
  padded?: boolean
}) {
  const reduced = useReducedMotion()

  const tones = {
    card: 'bg-card border-line',
    surface: 'bg-surface-2 border-line',
    inverse: 'bg-inverse border-transparent text-ink-inverse-muted',
    accent: 'bg-gold border-transparent text-gold-ink',
  } as const

  // The span classes belong to the grid item (the motion wrapper below); the
  // tile body just fills whatever cell it was given.
  const classes = cn(
    'relative flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-lg)] border',
    'shadow-[var(--shadow-sm)]',
    tones[tone],
    (interactive || href) &&
      'transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-luxe)] hover:-translate-y-1 hover:shadow-[var(--shadow-md)]',
    (interactive || href) && tone === 'card' && 'hover:border-gold/50',
    padded && 'p-6'
  )

  const inner = href ? (
    <Link href={href} className={cn('group', classes)}>
      {children}
    </Link>
  ) : (
    <div className={cn('group', classes)}>{children}</div>
  )

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduced ? 0.25 : 0.6, delay: reduced ? 0 : delay, ease: EASE }}
      className={cn('flex min-w-0', className)}
    >
      {inner}
    </motion.div>
  )
}

/** Heading used inside a tile - one size, one weight, everywhere. */
export function TileTitle({
  children,
  className,
  tone = 'default',
}: {
  children: ReactNode
  className?: string
  tone?: 'default' | 'onDark' | 'onAccent'
}) {
  return (
    <h2
      className={cn(
        'font-display text-[1.6rem] leading-tight sm:text-[1.9rem]',
        tone === 'onDark' && 'text-ink-inverse',
        tone === 'onAccent' && 'text-gold-ink',
        className
      )}
    >
      {children}
    </h2>
  )
}

/** Small uppercase label at the top of a tile. */
export function TileLabel({
  children,
  className,
  tone = 'default',
}: {
  children: ReactNode
  className?: string
  tone?: 'default' | 'onDark' | 'onAccent'
}) {
  return (
    <span
      className={cn(
        'text-[0.66rem] font-semibold uppercase tracking-[0.22em]',
        tone === 'default' && 'text-gold',
        tone === 'onDark' && 'text-gold-on-dark',
        tone === 'onAccent' && 'text-gold-ink/70',
        className
      )}
    >
      {children}
    </span>
  )
}
