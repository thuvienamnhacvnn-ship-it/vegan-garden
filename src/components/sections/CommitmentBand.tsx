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

        <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
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
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-gold-band/45 text-gold-band">
                  <Icon className="h-9 w-9" />
                </span>
                <h3 className="mt-6 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-gold-band">
                  {t(`brandBar.items.${index}.title`)}
                </h3>
                <p className="mt-3 text-[0.9rem] leading-relaxed text-on-band-muted">
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
