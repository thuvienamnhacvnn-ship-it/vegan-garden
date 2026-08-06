'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Minus, Plus, Trash2, X, StickyNote } from 'lucide-react'
import { useCart, useCartItems } from './CartProvider'
import { useLocale } from '@/i18n/LocaleProvider'
import { useScrollLock } from '@/hooks/useScrollLock'
import { useIsHandset } from '@/hooks/useMediaQuery'
import { formatPrice, cn } from '@/lib/format'
import { site } from '@/data/site'
import { dishes } from '@/data/menu'
import { ButtonLink } from '@/components/ui/Button'
import { LotusMarkIcon } from '@/components/ui/Icons'

const EASE = [0.22, 1, 0.36, 1] as const

export function CartDrawer() {
  const { isOpen, close, subtotal, count, clear, setQuantity, remove, setNote } = useCart()
  const items = useCartItems()
  const { t, locale, pick } = useLocale()
  const reduced = useReducedMotion()
  // On a phone the cart is a bottom sheet you can flick away; on a laptop it
  // stays the side drawer, where a downward drag would mean nothing.
  const sheet = useIsHandset()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [noteFor, setNoteFor] = useState<string | null>(null)

  useScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
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
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, close])

  const missingForFreeDelivery = Math.max(0, site.delivery.freeFrom - subtotal)

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[70]">
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label={t('a11y.closeCart')}
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 h-full w-full cursor-default bg-night/70"
          />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('orderPage.cart.title')}
            initial={reduced ? { opacity: 0 } : sheet ? { y: '100%' } : { x: '100%' }}
            animate={reduced ? { opacity: 1 } : { x: 0, y: 0 }}
            exit={reduced ? { opacity: 0 } : sheet ? { y: '100%' } : { x: '100%' }}
            transition={{ duration: reduced ? 0.2 : 0.5, ease: EASE }}
            drag={sheet && !reduced ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              // A short flick counts as much as a long drag, which is what
              // makes it feel native rather than like a resizable box.
              if (info.offset.y > 130 || info.velocity.y > 650) close()
            }}
            className={cn(
              'absolute flex flex-col bg-charcoal',
              sheet
                ? 'inset-x-0 bottom-0 max-h-[88svh] rounded-t-[var(--radius-xl)] border-t border-gold/25'
                : 'right-0 top-0 h-full w-full max-w-md border-l border-gold/25'
            )}
          >
            {/* grab handle - the affordance that says "you can drag this" */}
            {sheet ? (
              <span
                aria-hidden="true"
                className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-cream-dim/35"
              />
            ) : null}

            <header className="flex items-center justify-between border-b border-gold/20 px-6 py-5">
              <div>
                <h2 className="font-display text-2xl text-cream">
                  {t('orderPage.cart.title')}
                </h2>
                <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-gold/80">
                  {count === 1
                    ? t('orderPage.cart.itemCountOne')
                    : t('orderPage.cart.itemCount', { count })}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label={t('a11y.closeCart')}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/45 text-gold transition-colors duration-400 hover:bg-gold hover:text-charcoal"
              >
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <LotusMarkIcon className="h-12 w-20 text-gold/45" />
                <div>
                  <p className="font-display text-xl text-cream">
                    {t('orderPage.cart.empty')}
                  </p>
                  <p className="mt-2 text-sm text-cream-dim/60">{t('orderPage.cart.emptyHint')}</p>
                </div>
                <ButtonLink href="/order" variant="secondary" size="sm">
                  {t('orderPage.cart.browse')}
                </ButtonLink>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-gold/10 overflow-y-auto px-6">
                  {items.map((item) => {
                    const dish = dishes.find((entry) => entry.id === item.dishId)
                    return (
                      <li key={item.dishId} className="flex gap-4 py-5">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-gold/20">
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-display text-lg leading-tight text-gold-soft">
                            {item.nameVi}
                          </p>
                          {dish ? (
                            <p className="truncate text-xs text-cream-dim/55">{pick(dish.name)}</p>
                          ) : null}

                          <div className="mt-3 flex items-center gap-3">
                            <div className="flex items-center rounded-sm border border-gold/30">
                              <button
                                type="button"
                                aria-label={t('a11y.decrease')}
                                onClick={() => setQuantity(item.dishId, item.quantity - 1)}
                                className="flex h-11 w-11 items-center justify-center text-gold transition-colors hover:bg-gold/10 md:h-9 md:w-9"
                              >
                                <Minus className="h-3.5 w-3.5" strokeWidth={1.6} />
                              </button>
                              <span className="w-8 text-center text-sm tabular-nums text-cream-dim">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label={t('a11y.increase')}
                                onClick={() => setQuantity(item.dishId, item.quantity + 1)}
                                className="flex h-11 w-11 items-center justify-center text-gold transition-colors hover:bg-gold/10 md:h-9 md:w-9"
                              >
                                <Plus className="h-3.5 w-3.5" strokeWidth={1.6} />
                              </button>
                            </div>

                            <span className="ml-auto text-sm tabular-nums text-gold-soft">
                              {formatPrice(item.lineTotal, locale)}
                            </span>
                          </div>

                          <div className="mt-2.5 flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() =>
                                setNoteFor(noteFor === item.dishId ? null : item.dishId)
                              }
                              className="inline-flex items-center gap-1.5 text-[0.7rem] text-cream-dim/55 transition-colors hover:text-gold"
                            >
                              <StickyNote className="h-3.5 w-3.5" strokeWidth={1.4} />
                              {t('orderPage.addNote')}
                            </button>
                            <button
                              type="button"
                              onClick={() => remove(item.dishId)}
                              aria-label={t('a11y.remove')}
                              className="inline-flex items-center gap-1.5 text-[0.7rem] text-cream-dim/55 transition-colors hover:text-red-300"
                            >
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.4} />
                              {t('a11y.remove')}
                            </button>
                          </div>

                          {noteFor === item.dishId ? (
                            <label className="mt-2.5 block">
                              <span className="sr-only">{t('orderPage.noteLabel')}</span>
                              <textarea
                                rows={2}
                                value={item.note}
                                onChange={(event) => setNote(item.dishId, event.target.value)}
                                placeholder={t('orderPage.notePlaceholder')}
                                maxLength={160}
                                className="w-full rounded-sm border border-gold/30 bg-night/50 px-3 py-2 text-xs text-cream-dim placeholder:text-cream-dim/35 focus:border-gold/70 focus:outline-none"
                              />
                            </label>
                          ) : item.note ? (
                            <p className="mt-2 text-[0.7rem] italic text-cream-dim/50">“{item.note}”</p>
                          ) : null}
                        </div>
                      </li>
                    )
                  })}
                </ul>

                <footer className="border-t border-gold/20 px-6 py-5">
                  {missingForFreeDelivery > 0 ? (
                    <p className="mb-3 text-xs text-gold/80">
                      {t('orderPage.cart.freeDeliveryHint', {
                        amount: formatPrice(missingForFreeDelivery, locale),
                      })}
                    </p>
                  ) : null}

                  <div className="flex items-baseline justify-between">
                    <span className="text-sm uppercase tracking-[0.16em] text-cream-dim/70">
                      {t('orderPage.cart.subtotal')}
                    </span>
                    <span className="font-display text-2xl text-gold-soft tabular-nums">
                      {formatPrice(subtotal, locale)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    <ButtonLink
                      href="/order/checkout"
                      className="w-full"
                      onClick={close}
                    >
                      {t('orderPage.cart.checkout')}
                    </ButtonLink>
                    <div className="flex items-center justify-between">
                      <Link
                        href="/order"
                        onClick={close}
                        className="text-xs text-cream-dim/60 underline-offset-4 transition-colors hover:text-gold hover:underline"
                      >
                        {t('orderPage.cart.continue')}
                      </Link>
                      <button
                        type="button"
                        onClick={clear}
                        className={cn(
                          'text-xs text-cream-dim/45 underline-offset-4 transition-colors',
                          'hover:text-red-300 hover:underline'
                        )}
                      >
                        {t('orderPage.cart.clear')}
                      </button>
                    </div>
                  </div>
                </footer>
              </>
            )}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
