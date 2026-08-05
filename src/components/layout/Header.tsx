'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { navigation, site } from '@/data/site'
import { useT } from '@/i18n/LocaleProvider'
import { cn } from '@/lib/format'
import { LogoWordmark } from '@/components/ui/Logo'
import { ButtonLink } from '@/components/ui/Button'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { MobileMenu } from './MobileMenu'
import { CartButton } from '@/components/cart/CartButton'

/**
 * Sticky header. Solid in both themes - the page surface, a hairline and a
 * shadow that appears on scroll. Nothing translucent, nothing blurred.
 */
export function Header() {
  const pathname = usePathname()
  const t = useT()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-gold-ink"
      >
        {t('a11y.skipToContent')}
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b bg-surface transition-shadow duration-300',
          scrolled ? 'border-line shadow-[var(--shadow-sm)]' : 'border-line/60'
        )}
      >
        <div
          className={cn(
            'container-page flex items-center justify-between gap-6 transition-[height] duration-300',
            scrolled ? 'h-16' : 'h-[4.5rem] md:h-20'
          )}
        >
          <Link
            href="/"
            aria-label={t('a11y.logoHome')}
            className="shrink-0 rounded-lg transition-opacity duration-300 hover:opacity-80"
          >
            <LogoWordmark compact={scrolled} />
          </Link>

          <nav aria-label={t('a11y.mainNav')} className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {navigation.map((item) => {
                const active = isActive(item.href)
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative block whitespace-nowrap rounded-lg px-3 py-2 text-[0.74rem] font-semibold uppercase tracking-[0.11em] transition-colors duration-300',
                        active ? 'text-gold' : 'text-ink-muted hover:text-ink'
                      )}
                    >
                      {t(`nav.${item.key}`)}
                      {active ? (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gold"
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        />
                      ) : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <ButtonLink
              href={`tel:${site.phoneHref}`}
              variant="secondary"
              size="sm"
              className="hidden 2xl:inline-flex"
              leading={<Phone className="h-3.5 w-3.5" strokeWidth={1.8} />}
            >
              {t('common.callUs')}
            </ButtonLink>

            <LanguageSwitcher className="hidden sm:flex" />
            <ThemeToggle />
            <CartButton />

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t('a11y.openMenu')}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong text-ink transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-gold-ink xl:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
