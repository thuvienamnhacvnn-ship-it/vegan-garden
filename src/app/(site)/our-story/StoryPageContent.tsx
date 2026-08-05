'use client'

import Image from 'next/image'
import { useLocale } from '@/i18n/LocaleProvider'
import { PageHero } from '@/components/sections/PageHero'
import { StoryTeaser } from '@/components/sections/StoryTeaser'
import { ValueStrip } from '@/components/sections/ValueStrip'
import { ReservationCta } from '@/components/sections/ReservationCta'
import { Reveal, ImageReveal } from '@/components/ui/Reveal'
import { BotanicalCorner, LotusMarkIcon } from '@/components/ui/Icons'

export function StoryPageContent() {
  const { t, tx } = useLocale()
  const titleLines = tx<string[]>('storyTeaser.titleLines') ?? []

  return (
    <>
      <PageHero
        eyebrow={t('storyTeaser.eyebrow')}
        title={titleLines.join(' ')}
        intro={tx<string[]>('storyTeaser.paragraphs')?.[0]}
        image="/images/gallery/window-greenery.jpg"
        imageAlt={t('storyTeaser.imageAlt')}
        imagePosition="50% 40%"
      />

      <StoryTeaser withCta={false} />

      {/* the two supporting photos plus the pull quote */}
      <section className="relative overflow-hidden bg-night section-pad">
        <BotanicalCorner className="pointer-events-none absolute -right-8 top-16 h-[26rem] w-56 -scale-x-100 text-gold/12" />

        <div className="container-luxe relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="grid grid-cols-2 gap-4">
            <ImageReveal>
              <div className="relative aspect-3/4 overflow-hidden rounded-sm border border-gold/20">
                <Image
                  src="/images/misc/vase-greenery.jpg"
                  alt={t('brandBar.items.1.title')}
                  fill
                  sizes="(min-width: 1024px) 24vw, 45vw"
                  className="object-cover"
                />
              </div>
            </ImageReveal>
            <ImageReveal delay={0.12}>
              <div className="relative mt-10 aspect-3/4 overflow-hidden rounded-sm border border-gold/20">
                <Image
                  src="/images/gallery/buddha-alcove.jpg"
                  alt={t('brandBar.items.4.title')}
                  fill
                  sizes="(min-width: 1024px) 24vw, 45vw"
                  className="object-cover"
                />
              </div>
            </ImageReveal>
          </div>

          <div>
            <Reveal>
              <LotusMarkIcon className="h-8 w-14 text-gold/80" />
            </Reveal>
            <Reveal delay={0.08}>
              <blockquote className="mt-6 font-display text-[1.8rem] leading-snug text-cream sm:text-[2.3rem]">
                <span className="text-gold">“</span>
                {t('storyTeaser.quote')}
                <span className="text-gold">”</span>
              </blockquote>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-7 font-script text-2xl text-gold">{t('storyTeaser.script')}</p>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-7 max-w-lg text-[0.95rem] leading-relaxed text-cream-dim/75">
                {tx<string[]>('storyTeaser.paragraphs')?.[1]}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <ValueStrip />
      <ReservationCta />
    </>
  )
}
