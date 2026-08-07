'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { brandValues } from '@/data/values'
import { valueIconMap, LotusDivider } from '@/components/ui/Icons'
import { useLocale } from '@/i18n/LocaleProvider'

/**
 * "Our commitment to you" - the five brand values on the forest green band,
 * each in a ringed gold glyph. Straight out of mock-up v2, and the piece that
 * gives the home page its dark anchor between two cream sections.
 */
export function CommitmentBand() {
  const { t } = useLocale()
  const reduced = useReducedMotion()

  return (
    <section className="section-tight bg-band text-on-band">
      <div className="container-page">
        <div className="flex flex-col items-center text-center">
          <h2 className="display-md font-display text-gold-band">{t('commitment.title')}</h2>
          <LotusDivider className="mt-5 h-6 w-44 text-gold-band/70" />
          <p className="mt-4 max-w-xl text-[0.98rem] text-on-band-muted">
            {t('commitment.subtitle')}
          </p>
        </div>

        {/* Two columns on a phone. One column made this band 1315px — three
            screens of scrolling for five short lines of copy. */}
        <ul className="mt-9 grid grid-cols-2 gap-x-5 gap-y-8 sm:mt-14 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-5">
          {brandValues.map((value, index) => {
            const Icon = valueIconMap[value.icon]
            return (
              <motion.li
                key={value.id}
                initial={reduced ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center px-2 text-center"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold-band/45 text-gold-band sm:h-20 sm:w-20">
                  <Icon className="h-7 w-7 sm:h-9 sm:w-9" />
                </span>
                <h3 className="mt-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-gold-band sm:mt-6 sm:text-[0.8rem] sm:tracking-[0.14em]">
                  {t(`brandBar.items.${index}.title`)}
                </h3>
                <p className="mt-2 text-[0.8rem] leading-relaxed text-on-band-muted sm:mt-3 sm:text-[0.9rem]">
                  {t(`brandBar.items.${index}.text`)}
                </p>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
