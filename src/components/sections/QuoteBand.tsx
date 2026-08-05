'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { useLocale } from '@/i18n/LocaleProvider'
import { ButtonLink } from '@/components/ui/Button'
import { BowlIcon, LotusMarkIcon } from '@/components/ui/Icons'

/**
 * The closing band from mock-up v3: the house motto, the Hippocrates line, and
 * the reservation prompt - three beats across one forest green strip, so the
 * page ends on the brand colour rather than trailing off into cream.
 */
export function QuoteBand() {
  const { t, tx } = useLocale()
  const reduced = useReducedMotion()
  const motto = tx<string[]>('quoteBand.motto') ?? []

  return (
    <section className="section-tight bg-band text-on-band">
      <div className="container-page">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="grid items-center gap-12 lg:grid-cols-[auto_1fr_auto] lg:gap-16"
        >
          {/* motto ---------------------------------------------------------- */}
          <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
            <BowlIcon className="h-12 w-12 text-gold-band" />
            <p className="text-[0.8rem] font-semibold uppercase leading-relaxed tracking-[0.14em] text-gold-band">
              {motto.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          {/* quote ---------------------------------------------------------- */}
          <blockquote className="border-line-band/40 text-center lg:border-x lg:px-14">
            <Quote
              aria-hidden="true"
              className="mx-auto h-7 w-7 text-gold-band/70"
              strokeWidth={1.6}
            />
            <p className="display-sm mt-5 font-display leading-snug text-on-band">
              {t('quoteBand.quote')}
            </p>
            <footer className="mt-5 text-[0.85rem] text-on-band-muted">
              – {t('quoteBand.author')} –
            </footer>
          </blockquote>

          {/* cta ------------------------------------------------------------ */}
          <div className="flex flex-col items-center gap-5 rounded-[var(--radius-md)] border border-gold-band/40 px-8 py-9 text-center">
            <LotusMarkIcon className="h-7 w-7 text-gold-band" />
            <p className="max-w-[15rem] text-[0.85rem] font-semibold uppercase leading-relaxed tracking-[0.12em] text-gold-band">
              {t('quoteBand.ctaTitle')}
            </p>
            <ButtonLink href="/reservation" variant="onBand" size="md">
              {t('quoteBand.cta')}
            </ButtonLink>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
