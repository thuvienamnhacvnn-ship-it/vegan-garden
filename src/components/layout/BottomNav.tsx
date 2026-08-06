'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarCheck, Home, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { useLocale } from '@/i18n/LocaleProvider'
import { cn } from '@/lib/format'

/**
 * The phone's primary navigation.
 *
 * Styled like a native tab bar rather than a website nav, which comes down to
 * three details: sentence-case labels (uppercase with letter-spacing is the
 * tell that gives a web menu away), 24px icons, and an active state you read
 * without looking for it - a gold pill behind the icon plus a gold label.
 *
 * Desktop keeps the header nav and never renders this. The matching bottom
 * padding lives on `<main>` in SiteChrome, so no page ends underneath the bar.
 */
const TABS = [
  { href: '/', labelKey: 'tabs.home', Icon: Home },
  { href: '/menu', labelKey: 'tabs.menu', Icon: UtensilsCrossed },
  { href: '/reservation', labelKey: 'tabs.reserve', Icon: CalendarCheck },
] as const

const itemBase =
  'flex min-h-[3.25rem] w-full flex-col items-center justify-center gap-[3px] pb-1 pt-1.5 transition-colors duration-200'
const labelBase = 'text-[0.7rem] leading-none tracking-[0.01em]'
const pill = 'relative flex h-8 w-16 items-center justify-center'

export function BottomNav() {
  const { t } = useLocale()
  const pathname = usePathname()
  const { count, open, hydrated } = useCart()

  return (
    <nav
      aria-label={t('a11y.mainNav')}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface lg:hidden',
        'shadow-[0_-10px_28px_-20px_rgba(0,0,0,0.5)]',
        // clears the iOS home indicator without leaving a gap on Android
        'pb-[env(safe-area-inset-bottom)]'
      )}
    >
      <ul className="mx-auto flex max-w-lg items-stretch">
        {TABS.map(({ href, labelKey, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(itemBase, active ? 'text-gold' : 'text-ink-subtle')}
              >
                <span className={pill}>
                  {active ? (
                    <motion.span
                      layoutId="tab-pill"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 rounded-full bg-gold/16"
                    />
                  ) : null}
                  <Icon
                    className="relative h-6 w-6"
                    strokeWidth={active ? 2.15 : 1.7}
                    aria-hidden="true"
                  />
                </span>
                <span className={cn(labelBase, active ? 'font-semibold' : 'font-medium')}>
                  {t(labelKey)}
                </span>
              </Link>
            </li>
          )
        })}

        {/* The cart is a panel, not a page, so it is a button in the same row. */}
        <li className="flex-1">
          <button
            type="button"
            onClick={open}
            aria-label={t('a11y.openCart')}
            className={cn(itemBase, 'text-ink-subtle')}
          >
            <span className={pill}>
              <ShoppingBag className="relative h-6 w-6" strokeWidth={1.7} aria-hidden="true" />
              <AnimatePresence>
                {hydrated && count > 0 ? (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-3 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-gold px-1 text-[0.58rem] font-bold text-gold-ink"
                  >
                    {count > 99 ? '99+' : count}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </span>
            <span className={cn(labelBase, 'font-medium')}>{t('tabs.cart')}</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
