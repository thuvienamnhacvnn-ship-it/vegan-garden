'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 34 },
  down: { x: 0, y: -34 },
  left: { x: 34, y: 0 },
  right: { x: -34, y: 0 },
  none: { x: 0, y: 0 },
}

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: Direction
  as?: ElementType
  once?: boolean
  amount?: number
}

/** Fade-up on scroll. Collapses to a plain fade when reduced motion is on. */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  direction = 'up',
  as = 'div',
  once = true,
  amount = 0.25,
}: RevealProps) {
  const reduced = useReducedMotion()
  const offset = reduced ? offsets.none : offsets[direction]
  const MotionTag = motion[as as 'div'] ?? motion.div

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: reduced ? 0.25 : duration, delay: reduced ? 0 : delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  )
}

/** Parent that staggers its <RevealItem> children. */
export function RevealGroup({
  children,
  className,
  stagger = 0.12,
  delay = 0,
  amount = 0.2,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  amount?: number
  as?: ElementType
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as as 'div'] ?? motion.div

  const variants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : delay,
      },
    },
  }

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({
  children,
  className,
  direction = 'up',
  duration = 0.75,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  direction?: Direction
  duration?: number
  as?: ElementType
}) {
  const reduced = useReducedMotion()
  const offset = reduced ? offsets.none : offsets[direction]
  const MotionTag = motion[as as 'div'] ?? motion.div

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, ...offset },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: reduced ? 0.2 : duration, ease: EASE },
        },
      }}
    >
      {children}
    </MotionTag>
  )
}

/** Clip-path image reveal used for the editorial photos. */
export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0.4 }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.15, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
