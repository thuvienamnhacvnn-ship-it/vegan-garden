'use client'

import { Phone, Check } from 'lucide-react'
import { site } from '@/data/site'
import { useLocale } from '@/i18n/LocaleProvider'
import { PageHero } from '@/components/sections/PageHero'
import { ReservationForm } from '@/components/forms/ReservationForm'
import { OpeningHoursTable } from '@/components/ui/OpeningHoursTable'
import { Reveal } from '@/components/ui/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { BotanicalCorner, LotusMarkIcon } from '@/components/ui/Icons'

export function ReservationPageContent() {
  const { t, tx } = useLocale()
  const sideItems = tx<string[]>('reservationPage.sideItems') ?? []

  return (
    <>
      <PageHero
        eyebrow={t('reservationPage.eyebrow')}
        title={t('reservationPage.title')}
        intro={t('reservationPage.intro')}
        image="/images/gallery/evening-atmosphere.jpg"
        imageAlt={t('hero.slides.3.alt')}
        imagePosition="50% 45%"
      />

      <section className="relative overflow-hidden bg-night section-pad">
        <BotanicalCorner className="pointer-events-none absolute -left-8 top-20 h-[26rem] w-56 text-gold/12" />
        <BotanicalCorner className="pointer-events-none absolute -right-8 bottom-20 h-[26rem] w-56 -scale-x-100 text-gold/12" />

        <div className="container-luxe relative grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
          <Reveal>
            <ReservationForm />
          </Reveal>

          <Reveal delay={0.12} direction="left" className="space-y-8">
            <div className="tile p-7">
              <div className="flex items-center gap-3">
                <LotusMarkIcon className="h-5 w-9 text-gold" />
                <h2 className="font-display text-xl uppercase tracking-[0.14em] text-gold-soft">
                  {t('reservationPage.sideTitle')}
                </h2>
              </div>

              <ul className="mt-6 space-y-3.5">
                {sideItems.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.88rem] leading-relaxed text-cream-dim/75">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.6} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="tile p-7">
              <h2 className="font-display text-xl uppercase tracking-[0.14em] text-gold-soft">
                {t('common.openingHours')}
              </h2>
              <OpeningHoursTable className="mt-6" />
            </div>

            <div className="tile p-7 text-center">
              <p className="text-sm text-cream-dim/75">{t('reservationCta.note')}</p>
              <p className="mt-3 font-display text-2xl text-gold tabular-nums">{site.phone}</p>
              <ButtonLink
                href={`tel:${site.phoneHref}`}
                variant="secondary"
                size="sm"
                className="mt-5 w-full"
                trailing={<Phone className="h-4 w-4" strokeWidth={1.5} />}
              >
                {t('common.callUs')}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
