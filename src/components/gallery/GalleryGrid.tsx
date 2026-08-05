'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Maximize2 } from 'lucide-react'
import type { GalleryCategory } from '@/types'
import { galleryCategories, galleryImages } from '@/data/gallery'
import { useLocale } from '@/i18n/LocaleProvider'
import { cn } from '@/lib/format'
import { Lightbox } from './Lightbox'

/** Masonry (CSS columns) gallery with category filter and a full-screen viewer. */
export function GalleryGrid() {
  const { t, pick } = useLocale()
  const [category, setCategory] = useState<GalleryCategory | 'all'>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const images = useMemo(
    () =>
      category === 'all'
        ? galleryImages
        : galleryImages.filter((image) => image.category === category),
    [category]
  )

  return (
    <>
      {/* filters - horizontally scrollable on mobile */}
      <div className="-mx-1 overflow-x-auto no-scrollbar">
        <ul className="flex min-w-max items-center justify-start gap-2 px-1 md:justify-center">
          {(['all', ...galleryCategories] as const).map((key) => {
            const active = category === key
            return (
              <li key={key}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(key)}
                  className={cn(
                    'min-h-11 whitespace-nowrap rounded-full border px-5 py-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] transition-all duration-400 ease-luxe',
                    active
                      ? 'border-gold bg-gold text-charcoal'
                      : 'border-gold/30 text-cream-dim/75 hover:border-gold/70 hover:text-gold-soft'
                  )}
                >
                  {t(`galleryPage.categories.${key}`)}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <motion.div
        layout
        className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-4"
      >
        <AnimatePresence mode="popLayout">
          {images.map((image, index) => (
            <motion.figure
              key={image.id}
              layout
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{
                duration: 0.5,
                delay: Math.min(index * 0.03, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="break-inside-avoid"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`${pick(image.caption)} – ${t('galleryPage.zoomHint')}`}
                className="group relative block w-full overflow-hidden rounded-sm border border-gold/20 transition-all duration-600 ease-luxe hover:border-gold/60"
              >
                {/* Its own clip box: the zoom must not bleed over the caption. */}
                <span className="block overflow-hidden">
                  <Image
                    src={image.src}
                    alt={pick(image.alt)}
                    width={image.width}
                    height={image.height}
                    sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 32vw, (min-width: 640px) 48vw, 92vw"
                    loading={index < 6 ? 'eager' : 'lazy'}
                    className="h-auto w-full transition-transform duration-[1200ms] ease-luxe group-hover:scale-[1.05]"
                  />
                </span>

                {/* Caption sits on its own solid panel under the photo - never
                    as a wash over it, so the image keeps full brightness. */}
                <span className="flex items-center justify-between gap-3 bg-card p-4">
                  <span className="text-left text-sm leading-snug text-ink-muted">
                    {pick(image.caption)}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold transition-colors duration-400 ease-luxe group-hover:bg-gold group-hover:text-gold-ink">
                    <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.6} />
                  </span>
                </span>
              </button>
            </motion.figure>
          ))}
        </AnimatePresence>
      </motion.div>

      <Lightbox
        images={images}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </>
  )
}
