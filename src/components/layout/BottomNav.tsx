'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarCheck, Home, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { useLocale } from '@/i18n/LocaleProvider'
import { cn } from '@/lib/format'

/**
 * The phone's primary navigation: a fixed tab bar with the four things a guest
 * actually came to do. It replaces a trip through the burger menu, which is
 * what made the site feel like a website rather than an app.
 *
 * Desktop keeps the header nav and never renders this. The matching bottom
 * padding lives on `<main>` in SiteChrome, so no page ends underneath the bar.
 */
/* `tabs.*` rather than `nav.*`: the header's wording ("Online bestellen",
   "Reservierung") wraps to two lines in a quarter-width tab. */
const TABS = [
  { href: '/', labelKey: 'tabs.home', Icon: Home },
  { href: '/menu', labelKey: 'tabs.menu', Icon: UtensilsCrossed },
  { href: '/reservation', labelKey: 'tabs.reserve', Icon: CalendarCheck },
] as const

export function BottomNav() {
  const { t } = useLocale()
  const pathname = usePathname()
  const { count, open, hydrated } = useCart()

  return (
    <nav
      aria-label={t('a11y.mainNav')}
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface lg:hidden',
        'shadow-[0_-8px_24px_-18px_rgba(0,0,0,0.45)]',
        // clears the iOS home indicator without leaving a gap on Android
        'pb-[env(safe-area-inset-bottom)]'
      )}
    >
      <ul className="mx-auto flex max-w-lg items-stretch px-1 pt-1.5">
        {TABS.map(({ href, labelKey, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-[3.25rem] flex-col items-center justify-center gap-1 rounded-xl px-1 pb-1.5 transition-colors duration-200',
                  active ? 'text-gold' : 'text-ink-subtle'
                )}
              >
                {/* the pill is what makes the active tab read at a glance,
                    the way a native tab bar does */}
                <span className="relative flex h-7 w-14 items-center justify-center">
                  {active ? (
                    <motion.span
                      layoutId="tab-pill"
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 rounded-full bg-gold/14"
                    />
                  ) : null}
                  <Icon
                    className="relative h-[21px] w-[21px]"
                    strokeWidth={active ? 2.2 : 1.7}
                    aria-hidden="true"
                  />
                </span>
                <span
                  className={cn(
                    'text-[0.6rem] uppercase tracking-[0.06em]',
                    active ? 'font-bold' : 'font-semibold'
                  )}
                >
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
            className="flex min-h-[3.25rem] w-full flex-col items-center justify-center gap-1 rounded-xl px-1 pb-1.5 text-ink-subtle transition-colors duration-200"
          >
            <span className="relative flex h-7 w-14 items-center justify-center">
              <ShoppingBag className="h-[21px] w-[21px]" strokeWidth={1.7} aria-hidden="true" />
              <AnimatePresence>
                {hydrated && count > 0 ? (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-2.5 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-gold px-1 text-[0.58rem] font-bold text-gold-ink"
                  >
                    {count > 99 ? '99+' : count}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </span>
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.06em]">
              {t('tabs.cart')}
            </span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
