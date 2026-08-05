'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X, Phone, ArrowRight } from 'lucide-react'
import { navigation, legalNavigation, site } from '@/data/site'
import { useT } from '@/i18n/LocaleProvider'
import { useScrollLock } from '@/hooks/useScrollLock'
import { cn } from '@/lib/format'
import { Logo } from '@/components/ui/Logo'
import { SocialLinks } from '@/components/ui/SocialLinks'
import { ButtonLink } from '@/components/ui/Button'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'

const EASE = [0.22, 1, 0.36, 1] as const

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  const t = useT()
  const reduced = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useScrollLock(open)

  // Escape closes, Tab stays inside the panel.
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
  }, [open, onClose])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <motion.button
            type="button"
            aria-label={t('a11y.closeMenu')}
            tabIndex={-1}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 h-full w-full cursor-default bg-inverse/45"
          />

          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('a11y.mainNav')}
            initial={reduced ? { opacity: 0 } : { x: '100%' }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: reduced ? 0.2 : 0.45, ease: EASE }}
            className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col overflow-y-auto border-l border-line bg-surface"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <Link href="/" onClick={onClose} aria-label={t('a11y.logoHome')}>
                <Logo variant="mark" alt="" className="h-10 w-auto" />
              </Link>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={t('a11y.closeMenu')}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-gold-ink"
              >
                <X className="h-5 w-5" strokeWidth={1.6} />
              </button>
            </div>

            <nav aria-label={t('a11y.mainNav')} className="flex-1 px-6 py-6">
              <ul>
                {navigation.map((item, index) => (
                  <motion.li
                    key={item.key}
                    initial={reduced ? false : { opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: reduced ? 0 : 0.1 + index * 0.05,
                      duration: 0.45,
                      ease: EASE,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className={cn(
                        'flex min-h-14 items-center justify-between border-b border-line py-3 font-display text-2xl transition-colors duration-300',
                        isActive(item.href) ? 'text-gold' : 'text-ink hover:text-gold'
                      )}
                    >
                      {t(`nav.${item.key}`)}
                      <ArrowRight className="h-4 w-4 opacity-40" strokeWidth={1.6} />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-7 space-y-3">
                <ButtonLink href="/reservation" size="md" className="w-full" onClick={onClose}>
                  {t('common.reserveTable')}
                </ButtonLink>
                <ButtonLink
                  href={`tel:${site.phoneHref}`}
                  variant="secondary"
                  size="md"
                  className="w-full"
                  leading={<Phone className="h-4 w-4" strokeWidth={1.7} />}
                >
                  {t('common.callUs')}
                </ButtonLink>
              </div>
            </nav>

            <div className="border-t border-line px-6 py-6">
              <div className="flex items-center justify-between gap-3">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>

              <SocialLinks className="mt-5" size="sm" />

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {legalNavigation.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="text-[0.78rem] text-ink-subtle transition-colors duration-300 hover:text-gold"
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
