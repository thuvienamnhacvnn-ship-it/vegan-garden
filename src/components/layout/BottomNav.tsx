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
                className={cn(
                  'flex min-h-[3.5rem] flex-col items-center justify-center gap-1 px-1 py-2 transition-colors duration-200',
                  active ? 'text-gold' : 'text-ink-subtle'
                )}
              >
                <Icon
                  className="h-[22px] w-[22px]"
                  strokeWidth={active ? 2.1 : 1.6}
                  aria-hidden="true"
                />
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.08em]">
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
            className="relative flex min-h-[3.5rem] w-full flex-col items-center justify-center gap-1 px-1 py-2 text-ink-subtle transition-colors duration-200"
          >
            <span className="relative">
              <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.6} aria-hidden="true" />
              <AnimatePresence>
                {hydrated && count > 0 ? (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-bold text-gold-ink"
                  >
                    {count > 99 ? '99+' : count}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </span>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.08em]">
              {t('tabs.cart')}
            </span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
