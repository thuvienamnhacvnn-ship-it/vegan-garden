'use client'

import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from './ThemeProvider'
import { useT } from '@/i18n/LocaleProvider'
import { cn } from '@/lib/format'

/** Day / night switch. Both themes are first-class, so this is a plain toggle. */
export function ThemeToggle({
  className,
  tone = 'default',
}: {
  className?: string
  tone?: 'default' | 'onDark'
}) {
  const { theme, toggle } = useTheme()
  const t = useT()
  const isDark = theme === 'dark'
  const label = isDark ? t('a11y.themeDay') : t('a11y.themeNight')

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border transition-colors duration-300',
        tone === 'onDark'
          ? 'border-ink-inverse/40 text-ink-inverse hover:border-gold hover:bg-gold hover:text-gold-ink'
          : 'border-line-strong text-ink hover:border-gold hover:bg-gold hover:text-gold-ink',
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: -50, scale: 0.65 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 50, scale: 0.65 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex"
        >
          {isDark ? (
            <Moon className="h-[17px] w-[17px]" strokeWidth={1.6} />
          ) : (
            <Sun className="h-[17px] w-[17px]" strokeWidth={1.6} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
