'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X, Minus, Plus } from 'lucide-react'
import type { Dish } from '@/types'
import { useLocale } from '@/i18n/LocaleProvider'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useIsHandset } from '@/hooks/useMediaQuery'
import { formatPrice } from '@/lib/format'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Section'
import { ChiliIcon, LeafIcon } from '@/components/ui/Icons'

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Dish detail as a right-hand drawer: the guest never leaves the menu, so the
 * category they were browsing is still there when the drawer closes.
 * Full-height sheet on desktop, bottom sheet on small screens.
 */
export function DishDrawer({
  dish,
  onClose,
  onAdd,
}: {
  dish: Dish | null
  onClose: () => void
  onAdd?: (dish: Dish, quantity: number, note: string) => void
}) {
  const { t, pick, locale } = useLocale()
  const reduced = useReducedMotion()
  // Below `sm` this is a bottom sheet; above it, a side panel that must not
  // slide away when the guest scrolls its content.
  const sheet = useIsHandset()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)

  const [quantity, setQuantity] = useState(1)
  const [note, setNote] = useState('')

  useScrollLock(Boolean(dish))

  // Reset the picker whenever a different dish is opened.
  useEffect(() => {
    if (!dish) return
    setQuantity(1)
    setNote('')
  }, [dish])

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
        <div className="fixed inset-0 z-[75] flex items-end justify-end sm:items-stretch">
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label={t('common.close')}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 h-full w-full cursor-default bg-inverse/45"
          />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dish-drawer-title"
            initial={reduced ? { opacity: 0 } : { y: '100%' }}
            animate={reduced ? { opacity: 1 } : { y: 0, x: 0 }}
            exit={reduced ? { opacity: 0 } : { y: '100%' }}
            transition={{ duration: reduced ? 0.2 : 0.45, ease: EASE }}
            drag={sheet && !reduced ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 130 || info.velocity.y > 650) onClose()
            }}
            className="relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-[var(--radius-xl)] border border-line bg-card sm:max-h-none sm:h-full sm:max-w-lg sm:rounded-none sm:rounded-l-[var(--radius-xl)] sm:border-l"
          >
            {/* grab handle - only where the panel is actually draggable */}
            {sheet ? (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-3 z-10 mx-auto h-1 w-10 rounded-full bg-ink-subtle/40"
              />
            ) : null}

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t('common.close')}
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-card text-ink transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-gold-ink"
            >
              <X className="h-5 w-5" strokeWidth={1.8} />
            </button>

            <div className="flex-1 overflow-y-auto">
              <div className="relative aspect-4/3 w-full">
                <Image
                  src={dish.image}
                  alt={`${dish.nameVi} – ${pick(dish.name)}`}
                  fill
                  sizes="(min-width: 640px) 32rem, 100vw"
                  quality={90}
                  className="object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  {dish.tags.map((tag) => (
                    <Badge key={tag} tone={tag === 'bestseller' ? 'gold' : 'neutral'}>
                      {t(`menuPage.tags.${tag}`)}
                    </Badge>
                  ))}
                </div>

                <h2 id="dish-drawer-title" className="mt-4 font-display text-3xl text-ink">
                  {dish.nameVi}
                </h2>
                <p className="mt-1 text-[0.82rem] uppercase tracking-[0.12em] text-ink-subtle">
                  {pick(dish.name)}
                </p>

                <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-muted">
                  {pick(dish.description)}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-[0.8rem] text-ink-muted">
                  <span className="flex items-center gap-1.5">
                    <LeafIcon className="h-4 w-4 text-gold" />
                    {t('menuPage.plantBased')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ChiliIcon className="h-4 w-4 text-gold" />
                    {t('menuPage.spice.label')}: {t(`menuPage.spice.${dish.spice}`)}
                  </span>
                </div>

                <section className="mt-6">
                  <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold">
                    {t('menuPage.modal.ingredients')}
                  </h3>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-ink-muted">
                    {pick(dish.ingredients).join(' · ')}
                  </p>
                </section>

                {dish.allergens ? (
                  <section className="mt-5">
                    <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold">
                      {t('menuPage.modal.allergens')}
                    </h3>
                    <p className="mt-2 text-[0.88rem] text-ink-muted">
                      {pick(dish.allergens).join(', ')}
                    </p>
                  </section>
                ) : null}

                {onAdd ? (
                  <label className="mt-6 block">
                    <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                      {t('orderPage.noteLabel')}
                    </span>
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      maxLength={160}
                      placeholder={t('orderPage.notePlaceholder')}
                      className="w-full rounded-[var(--radius-sm)] border border-line bg-well px-4 py-3 text-[0.9rem] text-ink placeholder:text-ink-subtle focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25"
                    />
                  </label>
                ) : null}
              </div>
            </div>

            {/* sticky action bar ------------------------------------------ */}
            <div className="border-t border-line bg-card p-5">
              {onAdd ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      aria-label={t('a11y.decrease')}
                      onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:text-gold"
                    >
                      <Minus className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <span className="w-8 text-center text-[0.95rem] font-semibold tabular-nums text-ink">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={t('a11y.increase')}
                      onClick={() => setQuantity((value) => Math.min(30, value + 1))}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:text-gold"
                    >
                      <Plus className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>

                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={() => onAdd(dish, quantity, note)}
                  >
                    {t('common.addToCart')} · {formatPrice(dish.price * quantity, locale)}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-2xl text-ink tabular-nums">
                    {formatPrice(dish.price, locale)}
                  </span>
                  <ButtonLink href="/order" size="lg">
                    {t('common.orderOnline')}
                  </ButtonLink>
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
