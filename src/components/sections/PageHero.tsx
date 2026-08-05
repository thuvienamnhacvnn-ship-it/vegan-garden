'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Sub-page opener. Split layout: the copy lives on a solid panel and the
 * photograph runs at full brightness beside it - no wash, no tint, no blur.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  imagePosition = '50% 50%',
  children,
}: {
  eyebrow: string
  title: string
  intro?: string
  image: string
  imageAlt: string
  imagePosition?: string
  children?: ReactNode
}) {
  const reduced = useReducedMotion()

  return (
    <section className="border-b border-wood-light bg-night pt-[4.5rem] md:pt-[5.25rem]">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="flex items-center px-6 py-14 sm:px-10 md:py-20 lg:pl-[max(2.5rem,calc((100vw-90rem)/2+4rem))] lg:pr-14">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="max-w-xl"
          >
            <span className="eyebrow">{eyebrow}</span>

            <h1 className="mt-5 text-[2.4rem] leading-[1.04] text-cream sm:text-[3.2rem] lg:text-[3.7rem]">
              {title}
            </h1>

            <span className="mt-7 block h-px w-24 bg-gold" />

            {intro ? (
              <p className="mt-6 max-w-lg text-[1rem] leading-relaxed text-cream-dim">{intro}</p>
            ) : null}

            {children ? <div className="mt-8">{children}</div> : null}
          </motion.div>
        </div>

        <div className="relative min-h-[16rem] lg:min-h-[30rem]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 52vw, 100vw"
            quality={88}
            style={{ objectPosition: imagePosition }}
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
