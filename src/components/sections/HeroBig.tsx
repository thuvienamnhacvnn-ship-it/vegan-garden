'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'
import { ButtonLink } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { brandValues } from '@/data/values'
import { valueIconMap } from '@/components/ui/Icons'

const EASE = [0.22, 1, 0.36, 1] as const

interface Slide {
  titleLines: string[]
  subtitle: string
  text: string
  alt: string
}

/**
 * The opening, built the way mock-up v1 reads: gold display type on the
 * brand's forest green, the signature bowl at full brightness beside it.
 *
 * It is a split rather than type-over-photo on purpose. The rule on this site
 * is that nothing dims a photograph, so the headline gets its own solid panel
 * instead of a scrim - and the food keeps every bit of its light.
 *
 * The section carries the header's height as top padding: the header is
 * `fixed` and opaque, so without it the first 72px of the photo would sit
 * behind the chrome (which is what used to slice the wall sign in half).
 */
export function HeroBig() {
  const { t, tx } = useLocale()
  const reduced = useReducedMotion()

  const copy = tx<Slide[]>('hero.slides')?.[0]
  const values = brandValues.slice(0, 3)

  return (
    <section
      aria-label={t('hero.eyebrow')}
      className="bg-band pt-14 text-on-band sm:pt-[4.5rem] md:pt-20"
    >
      {/* On a phone the hero owns the first screen: header (4.5rem) and tab bar
          (3.5rem) come off, the photo takes a fixed slice, and the brand block
          centres itself in whatever is left - so it sits optically in the
          middle instead of hugging the photo. */}
      <div className="grid min-h-[calc(100svh-7rem)] grid-rows-[auto_1fr] lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[1.05fr_1fr] lg:grid-rows-1">
        {/* ---------------------------------------------------------- photo */}
        {/* The cell states its own height at every width: `fill` children are
            absolutely positioned, so a grid item holding only an Image has no
            content height of its own to stretch from. */}
        <div className="relative order-1 h-[43svh] sm:h-[48svh] lg:order-2 lg:h-full lg:min-h-[calc(100svh-5rem)]">
          <Image
            src="/images/hero/hero-signature-bowl.jpg"
            alt={copy?.alt ?? ''}
            fill
            priority
            quality={90}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: '58% 50%' }}
          />
        </div>

        {/* ------------------------------------------------- type · mobile */}
        {/* A phone gets the brand and the two things it can act on, nothing
            else. The headline and the value row are desktop-only: on a small
            screen they push the buttons below the fold for no gain. */}
        <div className="order-2 flex flex-col items-center justify-center px-6 py-9 text-center lg:hidden">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex flex-col items-center"
          >
            <Logo variant="mark" priority alt="" className="h-16 w-auto" />
            <p className="mt-4 font-display text-[1.6rem] font-light tracking-[0.2em] text-on-band">
              VEGAN GARDEN
            </p>
            <p className="mt-2 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-gold-band">
              {t('hero.badge')}
            </p>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="mt-8 flex w-full max-w-xs flex-col gap-3"
          >
            <ButtonLink
              href="/menu"
              size="lg"
              className="w-full"
              trailing={<ArrowUpRight className="h-4 w-4" strokeWidth={2} />}
            >
              {t('common.viewMenu')}
            </ButtonLink>
            <ButtonLink href="/reservation" variant="onBand" size="lg" className="w-full">
              {t('common.reserveTable')}
            </ButtonLink>
          </motion.div>
        </div>

        {/* ------------------------------------------------ type · desktop */}
        <div className="order-2 hidden flex-col justify-center px-6 py-14 md:px-10 lg:order-1 lg:flex lg:py-20 xl:px-16 2xl:px-24">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <Logo variant="mark" priority alt="" className="h-14 w-auto md:h-16" />
          </motion.div>

          <p className="mt-7 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-gold-band">
            {t('hero.eyebrow')}
          </p>

          <h1 className="display-lg mt-5 font-display text-on-band">
            {copy?.titleLines.map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className={index === 1 ? 'inline-block text-gold-band' : 'inline-block'}
                  initial={reduced ? false : { y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.15 + index * 0.12, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          >
            <p className="lead mt-7 max-w-lg text-on-band-muted">
              <span className="font-semibold text-on-band">{copy?.subtitle}</span>{' '}
              {copy?.text}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink
                href="/menu"
                size="lg"
                trailing={<ArrowUpRight className="h-4 w-4" strokeWidth={2} />}
              >
                {t('common.viewMenu')}
              </ButtonLink>
              <ButtonLink href="/reservation" variant="onBand" size="lg">
                {t('common.reserveTable')}
              </ButtonLink>
            </div>

            {/* the three-value row that closes the mock-up's hero */}
            <ul className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line-band/40 pt-7">
              {values.map((value, index) => {
                const Icon = valueIconMap[value.icon]
                return (
                  <li key={value.id} className="flex items-center gap-2.5">
                    <Icon className="h-5 w-5 shrink-0 text-gold-band" />
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-on-band-muted">
                      {t(`brandBar.items.${index}.title`)}
                    </span>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
