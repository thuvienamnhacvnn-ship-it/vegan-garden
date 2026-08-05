'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X, Plus } from 'lucide-react'
import type { Dish } from '@/types'
import { useLocale } from '@/i18n/LocaleProvider'
import { useScrollLock } from '@/hooks/useScrollLock'
import { formatPrice } from '@/lib/format'
import { ButtonLink, Button } from '@/components/ui/Button'
import { ChiliIcon, LeafIcon, LotusDivider } from '@/components/ui/Icons'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Dish detail. A centred dialog on desktop, a bottom sheet on mobile.
 * Focus is trapped while open and returned to the trigger on close.
 */
export function DishModal({
  dish,
  onClose,
  onAdd,
}: {
  dish: Dish | null
  onClose: () => void
  onAdd?: (dish: Dish) => void
}) {
  const { t, pick, locale } = useLocale()
  const reduced = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  useScrollLock(Boolean(dish))

  useEffect(() => {
    if (!dish) return
    restoreRef.current = document.activeElement as HTMLElement | null
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      restoreRef.current?.focus?.()
    }
  }, [dish, onClose])

  return (
    <AnimatePresence>
      {dish ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label={t('menuPage.modal.close')}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 h-full w-full cursor-default bg-night/80"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dish-modal-title"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: reduced ? 0.2 : 0.5, ease: EASE }}
            className="relative flex max-h-[92svh] w-full max-w-4xl flex-col overflow-hidden rounded-t-xl border border-gold/30 bg-charcoal sm:max-h-[88svh] sm:rounded-lg"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t('menuPage.modal.close')}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-night/80 text-gold transition-colors duration-400 hover:bg-gold hover:text-charcoal"
            >
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>

            <div className="grid overflow-y-auto md:grid-cols-2">
              <div className="relative aspect-4/3 md:aspect-auto md:min-h-[30rem]">
                <Image
                  src={dish.image}
                  alt={`${dish.nameVi} – ${pick(dish.name)}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  {dish.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-gold/35 px-3 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-gold/90"
                    >
                      {t(`menuPage.tags.${tag}`)}
                    </span>
                  ))}
                </div>

                <h2
                  id="dish-modal-title"
                  className="mt-5 font-display text-3xl text-gold-soft sm:text-4xl"
                >
                  {dish.nameVi}
                </h2>
                <p className="mt-1 text-sm uppercase tracking-[0.14em] text-cream-dim/55">
                  {pick(dish.name)}
                </p>

                <LotusDivider className="my-6" />

                <p className="text-[0.95rem] leading-relaxed text-cream-dim/80">
                  {pick(dish.description)}
                </p>

                <div className="mt-6 flex items-center gap-6 text-[0.7rem] uppercase tracking-[0.14em] text-gold/85">
                  <span className="flex items-center gap-1.5">
                    <LeafIcon className="h-4 w-4" />
                    {t('menuPage.plantBased')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ChiliIcon className="h-4 w-4" />
                    {t('menuPage.spice.label')}: {t(`menuPage.spice.${dish.spice}`)}
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-gold">
                    {t('menuPage.modal.ingredients')}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-dim/70">
                    {pick(dish.ingredients).join(' · ')}
                  </p>
                </div>

                {dish.allergens ? (
                  <div className="mt-5">
                    <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.2em] text-gold">
                      {t('menuPage.modal.allergens')}
                    </h3>
                    <p className="mt-2 text-sm text-cream-dim/70">
                      {pick(dish.allergens).join(', ')}
                    </p>
                  </div>
                ) : null}

                <p className="mt-7 font-display text-3xl text-gold tabular-nums">
                  {formatPrice(dish.price, locale)}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {onAdd ? (
                    <Button
                      onClick={() => onAdd(dish)}
                      className="w-full sm:w-auto"
                      trailing={<Plus className="h-4 w-4" strokeWidth={2} />}
                    >
                      {t('common.addToCart')}
                    </Button>
                  ) : (
                    <ButtonLink href="/order" className="w-full sm:w-auto">
                      {t('common.orderOnline')}
                    </ButtonLink>
                  )}
                  <ButtonLink
                    href="/reservation"
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    {t('common.reserveTable')}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
