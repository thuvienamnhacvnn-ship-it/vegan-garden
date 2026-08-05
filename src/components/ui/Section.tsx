'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'
import { cn } from '@/lib/format'

const EASE = [0.22, 1, 0.36, 1] as const

/** Fade-and-rise on scroll. The single reveal used across the whole site. */
export function Rise({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: ElementType
}) {
  const reduced = useReducedMotion()
  const Tag = (motion[as as 'div'] ?? motion.div) as typeof motion.div

  return (
    <Tag
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduced ? 0.25 : 0.7, delay: reduced ? 0 : delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

/** Small gold label that opens a section. */
export function Eyebrow({
  children,
  className,
  tone = 'default',
}: {
  children: ReactNode
  className?: string
  tone?: 'default' | 'onDark'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.26em]',
        tone === 'onDark' ? 'text-gold-on-dark' : 'text-gold',
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn('h-px w-7', tone === 'onDark' ? 'bg-gold-on-dark' : 'bg-gold')}
      />
      {children}
    </span>
  )
}

/**
 * Section header. `align` and `tone` are the only knobs, which keeps every
 * section on the site sharing one rhythm.
 */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'default',
  className,
  as: Tag = 'h2',
}: {
  eyebrow?: string
  title: ReactNode
  lead?: string
  align?: 'left' | 'center'
  tone?: 'default' | 'onDark'
  className?: string
  as?: 'h1' | 'h2'
}) {
  return (
    <div className={cn(align === 'center' && 'mx-auto max-w-2xl text-center', className)}>
      {eyebrow ? (
        <Rise>
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </Rise>
      ) : null}

      <Rise delay={0.06}>
        <Tag
          className={cn(
            'mt-4 text-[2rem] leading-[1.06] sm:text-[2.5rem] lg:text-[3rem]',
            tone === 'onDark' && 'text-ink-inverse'
          )}
        >
          {title}
        </Tag>
      </Rise>

      {lead ? (
        <Rise delay={0.12}>
          <p
            className={cn(
              'mt-5 max-w-xl text-[0.98rem] leading-relaxed',
              align === 'center' && 'mx-auto',
              tone === 'onDark' ? 'text-ink-inverse-muted' : 'text-ink-muted'
            )}
          >
            {lead}
          </p>
        </Rise>
      ) : null}
    </div>
  )
}

/** Consistent card surface. */
export function Card({
  children,
  className,
  interactive = false,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  interactive?: boolean
  as?: ElementType
}) {
  return (
    <Tag
      className={cn(
        'rounded-[var(--radius-lg)] border border-line bg-card shadow-[var(--shadow-sm)]',
        interactive &&
          'transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-luxe)] hover:-translate-y-1 hover:border-gold/50 hover:shadow-[var(--shadow-md)]',
        className
      )}
    >
      {children}
    </Tag>
  )
}

/** Small pill used for dish tags, statuses and counts. */
export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'gold' | 'success' | 'danger'
  className?: string
}) {
  const tones = {
    neutral: 'border-line text-ink-muted',
    gold: 'border-gold/45 text-gold',
    success: 'border-success/45 text-success',
    danger: 'border-danger/45 text-danger',
  } as const

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.1em]',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
