'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import type { GalleryImage } from '@/types'
import { useLocale } from '@/i18n/LocaleProvider'
import { useScrollLock } from '@/hooks/useScrollLock'

const EASE = [0.22, 1, 0.36, 1] as const
const SWIPE_THRESHOLD = 60

/** Full-screen viewer with keyboard, swipe and zoom support. */
export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: GalleryImage[]
  index: number | null
  onClose: () => void
  onNavigate: (next: number) => void
}) {
  const { t, pick } = useLocale()
  const reduced = useReducedMotion()
  const [zoomed, setZoomed] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)
  const touchStart = useRef<number | null>(null)

  const open = index !== null
  const image = open ? images[index] : null

  useScrollLock(open)

  const next = useCallback(() => {
    if (index === null) return
    setZoomed(false)
    onNavigate((index + 1) % images.length)
  }, [index, images.length, onNavigate])

  const prev = useCallback(() => {
    if (index === null) return
    setZoomed(false)
    onNavigate((index - 1 + images.length) % images.length)
  }, [index, images.length, onNavigate])

  useEffect(() => {
    if (!open) return
    restoreRef.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowRight') next()
      else if (event.key === 'ArrowLeft') prev()
      else if (event.key === ' ') {
        event.preventDefault()
        setZoomed((value) => !value)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      restoreRef.current?.focus?.()
    }
  }, [open, onClose, next, prev])

  return (
    <AnimatePresence>
      {open && image ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={pick(image.alt)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[85] flex flex-col bg-night/97"
          onTouchStart={(event) => {
            touchStart.current = event.touches[0].clientX
          }}
          onTouchEnd={(event) => {
            if (touchStart.current === null) return
            const delta = event.changedTouches[0].clientX - touchStart.current
            if (delta < -SWIPE_THRESHOLD) next()
            else if (delta > SWIPE_THRESHOLD) prev()
            touchStart.current = null
          }}
        >
          {/* ------------------------------------------------------- top bar */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8">
            <p className="text-xs uppercase tracking-[0.2em] text-gold/80 tabular-nums">
              {t('galleryPage.lightboxCount', {
                current: index + 1,
                total: images.length,
              })}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomed((value) => !value)}
                aria-label={t('a11y.zoomImage')}
                aria-pressed={zoomed}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors duration-400 hover:bg-gold hover:text-charcoal"
              >
                {zoomed ? (
                  <ZoomOut className="h-4 w-4" strokeWidth={1.5} />
                ) : (
                  <ZoomIn className="h-4 w-4" strokeWidth={1.5} />
                )}
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={t('common.close')}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors duration-400 hover:bg-gold hover:text-charcoal"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* --------------------------------------------------------- stage */}
          <div className="relative flex flex-1 items-center justify-center overflow-auto px-4 pb-4 md:px-20">
            <button
              type="button"
              onClick={prev}
              aria-label={t('a11y.previousImage')}
              className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-night/70 text-gold transition-colors duration-400 hover:bg-gold hover:text-charcoal md:left-6"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <AnimatePresence mode="wait">
              <motion.figure
                key={image.id}
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: reduced ? 0.15 : 0.4, ease: EASE }}
                className="flex max-h-full flex-col items-center"
              >
                <Image
                  src={image.src}
                  alt={pick(image.alt)}
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 768px) 80vw, 100vw"
                  quality={88}
                  className={
                    zoomed
                      ? 'max-h-none w-auto max-w-none cursor-zoom-out rounded-sm'
                      : 'max-h-[70svh] w-auto cursor-zoom-in rounded-sm object-contain'
                  }
                  onClick={() => setZoomed((value) => !value)}
                />
                <figcaption className="mt-4 max-w-2xl px-2 text-center text-sm text-cream-dim/75">
                  {pick(image.caption)}
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            <button
              type="button"
              onClick={next}
              aria-label={t('a11y.nextImage')}
              className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-night/70 text-gold transition-colors duration-400 hover:bg-gold hover:text-charcoal md:right-6"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* ------------------------------------------------------ filmstrip */}
          <div className="hidden overflow-x-auto no-scrollbar border-t border-gold/15 px-6 py-3 md:block">
            <ul className="flex min-w-max items-center gap-2">
              {images.map((thumb, thumbIndex) => (
                <li key={thumb.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setZoomed(false)
                      onNavigate(thumbIndex)
                    }}
                    aria-label={pick(thumb.caption)}
                    aria-current={thumbIndex === index}
                    className={
                      thumbIndex === index
                        ? 'relative block h-14 w-20 overflow-hidden rounded-sm border border-gold ring-1 ring-gold/50'
                        : 'relative block h-14 w-20 overflow-hidden rounded-sm border border-gold/20 opacity-55 transition-opacity hover:opacity-100'
                    }
                  >
                    <Image src={thumb.src} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
