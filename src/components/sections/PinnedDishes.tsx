'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { signatureDishes } from '@/data/menu'
import { useLocale } from '@/i18n/LocaleProvider'
import { formatPrice, cn } from '@/lib/format'
import { ButtonLink } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Section'

/**
 * Signature dishes as a pinned showcase.
 *
 * The photograph sticks while the list scrolls past it; whichever dish is in
 * the middle of the viewport takes over the image. Built on `position: sticky`
 * and an IntersectionObserver rather than a scroll library, so it degrades to
 * an ordinary stacked list when sticky or JS is unavailable.
 */
export function PinnedDishes() {
  const { t, pick, locale } = useLocale()
  const [active, setActive] = useState(0)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const nodes = itemRefs.current.filter(Boolean) as HTMLLIElement[]
    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const index = nodes.indexOf(entry.target as HTMLLIElement)
          if (index !== -1) setActive(index)
        }
      },
      // A narrow band across the middle of the screen decides the active dish.
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const dish = signatureDishes[active]

  return (
    <section className="border-y border-line bg-surface-2">
      <div className="container-page section">
        <div className="max-w-3xl">
          <Eyebrow>{t('signature.eyebrow')}</Eyebrow>
          <h2 className="display-lg mt-6">{t('signature.titleParts.0')}</h2>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* pinned photograph ------------------------------------------- */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-4/5 overflow-hidden rounded-[var(--radius-xl)] border border-line">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={dish?.id}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    {dish ? (
                      <Image
                        src={dish.image}
                        alt={`${dish.nameVi} – ${pick(dish.name)}`}
                        fill
                        sizes="45vw"
                        quality={90}
                        className="object-cover"
                      />
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="font-display text-5xl tabular-nums text-gold">
                  {String(active + 1).padStart(2, '0')}
                </span>
                <span className="h-px flex-1 bg-line-strong" />
                <span className="text-[0.85rem] tabular-nums text-ink-subtle">
                  {String(signatureDishes.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* the list ----------------------------------------------------- */}
          <ol className="space-y-10 sm:space-y-16 lg:space-y-32">
            {signatureDishes.map((entry, index) => (
              <li
                key={entry.id}
                ref={(node) => {
                  itemRefs.current[index] = node
                }}
                className={cn(
                  'transition-opacity duration-500',
                  'lg:opacity-40',
                  index === active && 'lg:opacity-100',
                  // A phone sees two of the four. The bento block further down
                  // lists the same signature dishes with an add-to-cart, so all
                  // four here was the same content twice, 1100px apart.
                  index > 1 && 'hidden sm:block'
                )}
              >
                {/* the image travels with each item on small screens */}
                <div className="relative mb-4 aspect-16/10 overflow-hidden rounded-[var(--radius-lg)] border border-line sm:mb-6 sm:aspect-4/3 lg:hidden">
                  <Image
                    src={entry.image}
                    alt={`${entry.nameVi} – ${pick(entry.name)}`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                <span className="text-[0.8rem] font-semibold tabular-nums text-gold">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3 className="display-md mt-2 sm:mt-3">{entry.nameVi}</h3>
                <p className="mt-1.5 text-[0.8rem] uppercase tracking-[0.14em] text-ink-subtle sm:mt-2 sm:text-[0.9rem]">
                  {pick(entry.name)}
                </p>

                <p className="lead mt-3 max-w-lg text-ink-muted sm:mt-5">
                  {pick(entry.description)}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 sm:mt-7 sm:gap-6">
                  <span className="font-display text-3xl tabular-nums text-ink">
                    {formatPrice(entry.price, locale)}
                  </span>
                  <ButtonLink
                    href="/menu"
                    variant="secondary"
                    trailing={<ArrowUpRight className="h-4 w-4" strokeWidth={2} />}
                  >
                    {t('common.details')}
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
