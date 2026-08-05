'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { galleryImages } from '@/data/gallery'
import { useLocale } from '@/i18n/LocaleProvider'
import { Eyebrow } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'

/**
 * The room, as a strip that slides sideways while the page scrolls down.
 * On touch it is a normal swipeable rail, so nothing is hidden behind an
 * effect the device cannot drive.
 */
export function GalleryStrip() {
  const { t, pick } = useLocale()
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['4%', '-22%'])

  const images = galleryImages.filter((image) => image.category === 'space').slice(0, 6)

  return (
    <section ref={ref} className="overflow-hidden bg-surface section">
      <div className="container-page">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>{t('galleryPreview.eyebrow')}</Eyebrow>
            <h2 className="display-lg mt-6">
              {t('galleryPreview.titleParts.0')}{' '}
              <span className="text-gold">{t('galleryPreview.titleParts.1')}</span>{' '}
              {t('galleryPreview.titleParts.2')}
            </h2>
          </div>

          <ButtonLink
            href="/gallery"
            variant="secondary"
            size="lg"
            className="shrink-0"
            trailing={<ArrowUpRight className="h-4 w-4" strokeWidth={2} />}
          >
            {t('common.viewGallery')}
          </ButtonLink>
        </div>
      </div>

      <motion.ul
        style={reduced ? undefined : { x }}
        className="mt-14 flex gap-5 overflow-x-auto px-6 no-scrollbar md:mt-20 md:overflow-visible md:px-0 lg:gap-8"
      >
        {images.map((image, index) => (
          <li
            key={image.id}
            className={
              index % 2 === 0
                ? 'w-[78vw] shrink-0 sm:w-[46vw] lg:w-[34vw]'
                : 'w-[78vw] shrink-0 sm:w-[36vw] lg:w-[26vw] md:mt-16'
            }
          >
            <Link href="/gallery" className="group block">
              <span className="relative block aspect-4/5 overflow-hidden rounded-[var(--radius-xl)] border border-line">
                <Image
                  src={image.src}
                  alt={pick(image.alt)}
                  fill
                  sizes="(min-width: 1024px) 34vw, 78vw"
                  quality={88}
                  className="object-cover transition-transform duration-[1100ms] ease-[var(--ease-out-luxe)] group-hover:scale-[1.05]"
                />
              </span>
              <span className="mt-4 block text-[0.95rem] text-ink-muted">
                {pick(image.caption)}
              </span>
            </Link>
          </li>
        ))}
      </motion.ul>
    </section>
  )
}
