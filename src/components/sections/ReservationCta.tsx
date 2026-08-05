'use client'

import Image from 'next/image'
import { ArrowRight, Phone } from 'lucide-react'
import { site } from '@/data/site'
import { useT } from '@/i18n/LocaleProvider'
import { Rise, Eyebrow } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'

/** Dark anchor band with the room photograph beside it, never underneath it. */
export function ReservationCta() {
  const t = useT()

  return (
    <section className="grid border-y border-line lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
      <div className="flex items-center bg-inverse px-6 py-16 sm:px-10 md:py-20 lg:pl-[max(2rem,calc((100vw-82rem)/2+3rem))] lg:pr-14">
        <Rise className="max-w-xl">
          <Eyebrow tone="onDark">{t('reservationCta.eyebrow')}</Eyebrow>

          <h2 className="mt-4 text-[1.9rem] leading-[1.06] text-ink-inverse sm:text-[2.4rem] lg:text-[2.8rem]">
            {t('reservationCta.title')}
          </h2>

          <p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-ink-inverse-muted">
            {t('reservationCta.text')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink
              href="/reservation"
              size="lg"
              className="w-full sm:w-auto"
              trailing={<ArrowRight className="h-4 w-4" strokeWidth={1.8} />}
            >
              {t('common.reserveNow')}
            </ButtonLink>
            <ButtonLink
              href={`tel:${site.phoneHref}`}
              variant="onDark"
              size="lg"
              className="w-full sm:w-auto"
              leading={<Phone className="h-4 w-4" strokeWidth={1.7} />}
            >
              {t('common.callUs')}
            </ButtonLink>
          </div>

          <p className="mt-5 text-[0.8rem] text-ink-inverse-muted">{t('reservationCta.note')}</p>
        </Rise>
      </div>

      <div className="relative min-h-[16rem] lg:min-h-[30rem]">
        <Image
          src="/images/contact/restaurant-evening.jpg"
          alt={t('hero.slides.3.alt')}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          quality={88}
          className="object-cover"
        />
      </div>
    </section>
  )
}
