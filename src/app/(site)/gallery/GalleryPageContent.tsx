'use client'

import { useLocale } from '@/i18n/LocaleProvider'
import { PageHero } from '@/components/sections/PageHero'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { ValueStrip } from '@/components/sections/ValueStrip'
import { ReservationCta } from '@/components/sections/ReservationCta'

export function GalleryPageContent() {
  const { t, tx } = useLocale()
  const titleParts = tx<string[]>('galleryPage.titleParts') ?? []

  return (
    <>
      <PageHero
        eyebrow={t('galleryPage.eyebrow')}
        title={titleParts.join(' ')}
        intro={t('galleryPage.intro')}
        image="/images/gallery/dining-hall-green-wall.jpg"
        imageAlt={t('storyTeaser.imageAlt')}
        imagePosition="50% 42%"
      />

      <section className="bg-night section-pad">
        <div className="container-luxe">
          <GalleryGrid />
        </div>
      </section>

      <ValueStrip />
      <ReservationCta />
    </>
  )
}
