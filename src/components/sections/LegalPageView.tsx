'use client'

import type { LegalPage } from '@/data/legal'
import { useLocale } from '@/i18n/LocaleProvider'
import { formatDate } from '@/lib/format'
import { Reveal } from '@/components/ui/Reveal'
import { LotusDivider, BotanicalCorner } from '@/components/ui/Icons'

/** Shared reading layout for Impressum, Datenschutz and AGB. */
export function LegalPageView({ page }: { page: LegalPage }) {
  const { pick, locale } = useLocale()

  return (
    <section className="relative overflow-hidden bg-night px-0 pb-24 pt-32 md:pt-44">
      <BotanicalCorner className="pointer-events-none absolute -right-10 top-24 h-[26rem] w-56 -scale-x-100 text-gold/10" />

      <div className="container-luxe relative max-w-3xl">
        <Reveal>
          <h1 className="text-[2.2rem] text-cream sm:text-[2.9rem]">{pick(page.title)}</h1>
        </Reveal>

        <Reveal delay={0.08}>
          <LotusDivider className="mt-7" />
        </Reveal>

        <Reveal delay={0.14}>
          <p className="mt-7 text-[0.95rem] leading-relaxed text-cream-dim/80">{pick(page.intro)}</p>
          <p className="mt-3 text-xs text-cream-dim/45">
            {formatDate(page.updated, locale)}
          </p>
        </Reveal>

        <div className="mt-12 space-y-10">
          {page.sections.map((section, index) => (
            <Reveal key={index} delay={0.05}>
              <article>
                <h2 className="font-display text-xl uppercase tracking-[0.12em] text-gold-soft sm:text-2xl">
                  {pick(section.heading)}
                </h2>
                <span className="mt-3 block h-px w-14 bg-gold/45" />
                <div className="prose-luxe mt-5 text-[0.92rem] text-cream-dim/75">
                  {pick(section.paragraphs).map((paragraph, pIndex) => (
                    <p key={pIndex} className="break-words">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
