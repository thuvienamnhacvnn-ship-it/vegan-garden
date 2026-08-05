'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, ShoppingBag } from 'lucide-react'
import type { Dish } from '@/types'
import { site } from '@/data/site'
import { getDish } from '@/data/menu'
import { useLocale } from '@/i18n/LocaleProvider'
import { useCart } from '@/components/cart/CartProvider'
import { formatPrice } from '@/lib/format'
import { PageHero } from '@/components/sections/PageHero'
import { MenuBrowser } from '@/components/menu/MenuBrowser'
import { Button } from '@/components/ui/Button'

export function OrderPageContent() {
  const { t, locale } = useLocale()
  const { add, open, count, subtotal, lastAdded, hydrated } = useCart()

  const handleAdd = (dish: Dish) => add(dish.id)

  return (
    <>
      <PageHero
        eyebrow={t('orderPage.eyebrow')}
        title={t('orderPage.title')}
        intro={t('orderPage.intro')}
        image="/images/dishes/lemongrass-bowl.jpg"
        imageAlt={t('hero.slides.0.alt')}
        imagePosition="50% 55%"
      >
        <ul className="flex flex-wrap gap-x-8 gap-y-2 text-xs uppercase tracking-[0.14em] text-gold/85">
          <li>
            {t('orderPage.checkout.pickup')} · {site.address.street}
          </li>
          <li>
            {t('orderPage.checkout.delivery')} ·{' '}
            {t('orderPage.cart.minimumHint', {
              amount: formatPrice(site.delivery.minimumOrder, locale),
            })}
          </li>
        </ul>
      </PageHero>

      <section className="bg-night section-pad">
        <div className="container-luxe">
          <MenuBrowser onAdd={handleAdd} />
        </div>
      </section>

      {/* sticky order summary bar once something is in the cart */}
      <AnimatePresence>
        {hydrated && count > 0 ? (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/30 bg-night/95"
          >
            <div className="container-luxe flex items-center justify-between gap-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/45 text-gold">
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-sm text-cream-dim">
                    {count === 1
                      ? t('orderPage.cart.itemCountOne')
                      : t('orderPage.cart.itemCount', { count })}
                  </p>
                  <p className="font-display text-lg text-gold tabular-nums">
                    {formatPrice(subtotal, locale)}
                  </p>
                </div>
              </div>

              <Button onClick={open} size="sm">
                {t('orderPage.cart.title')}
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* "added to cart" toast */}
      <AnimatePresence>
        {lastAdded ? (
          <motion.p
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-gold/50 bg-charcoal/95 px-5 py-3 text-sm text-gold-soft shadow-lg"
          >
            <Check className="h-4 w-4" strokeWidth={2} />
            {t('orderPage.added', { name: getDish(lastAdded)?.nameVi ?? '' })}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </>
  )
}
