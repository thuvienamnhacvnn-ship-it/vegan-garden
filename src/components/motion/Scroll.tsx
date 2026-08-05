'use client'

import Image from 'next/image'
import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { cn } from '@/lib/format'

const EASE = [0.22, 1, 0.36, 1] as const

/* -------------------------------------------------------------------------- */
/*  Parallax image                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Image that drifts against the scroll inside its own frame. The image is
 * rendered oversized and moved within an `overflow-hidden` box, so the frame
 * itself never shifts and the layout stays stable.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  strength = 14,
  priority = false,
  sizes = '100vw',
  objectPosition,
}: {
  src: string
  alt: string
  className?: string
  /** Drift in percent of the frame height. */
  strength?: number
  priority?: boolean
  sizes?: string
  objectPosition?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`])

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div
        style={reduced ? undefined : { y }}
        className="absolute inset-0"
        // grown so the drift never exposes an edge
        {...(reduced ? {} : { initial: false })}
      >
        <div className={reduced ? 'absolute inset-0' : 'absolute -inset-y-[18%] inset-x-0'}>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            quality={90}
            style={objectPosition ? { objectPosition } : undefined}
            className="object-cover"
          />
        </div>
      </motion.div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Heading that reveals word by word                                          */
/* -------------------------------------------------------------------------- */

export function WordReveal({
  text,
  className,
  as: Tag = 'h2',
  delay = 0,
}: {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  delay?: number
}) {
  const reduced = useReducedMotion()
  const words = text.split(' ')

  if (reduced) return <Tag className={className}>{text}</Tag>

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.75, delay: delay + index * 0.055, ease: EASE }}
          >
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/* -------------------------------------------------------------------------- */
/*  Marquee                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Endless horizontal ticker. The track is duplicated once and translated by
 * exactly -50%, so the loop is seamless without measuring anything.
 */
export function Marquee({
  items,
  className,
  speed = 38,
  reverse = false,
}: {
  items: ReactNode[]
  className?: string
  /** Seconds for one full pass. */
  speed?: number
  reverse?: boolean
}) {
  const reduced = useReducedMotion()
  const track = [...items, ...items]

  return (
    <div className={cn('relative overflow-hidden', className)} aria-hidden="true">
      <motion.div
        className="flex w-max items-center gap-12"
        animate={reduced ? undefined : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={
          reduced ? undefined : { duration: speed, ease: 'linear', repeat: Infinity }
        }
      >
        {track.map((item, index) => (
          <span key={index} className="flex shrink-0 items-center gap-12">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Scale-in on scroll                                                         */
/* -------------------------------------------------------------------------- */

/** Frame that grows to full width as it enters - used for the opening image. */
export function ScrollGrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.25'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1])
  const radius = useTransform(scrollYProgress, [0, 1], [48, 16])

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={reduced ? undefined : { scale, borderRadius: radius as MotionValue<number> }}
        className="overflow-hidden"
      >
        {children}
      </motion.div>
    </div>
  )
}
