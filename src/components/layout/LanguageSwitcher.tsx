'use client'

import { LOCALES, type Locale } from '@/types'
import { useLocale } from '@/i18n/LocaleProvider'
import { cn } from '@/lib/format'

const labels: Record<Locale, string> = { de: 'DE', en: 'EN', vi: 'VI' }
const names: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  vi: 'Tiếng Việt',
}

/** DE / EN / VI segmented control. */
export function LanguageSwitcher({
  className,
  tone = 'default',
}: {
  className?: string
  tone?: 'default' | 'onDark'
}) {
  const { locale, setLocale, t } = useLocale()
  const order: Locale[] = ['de', 'en', 'vi']

  return (
    <div
      role="group"
      aria-label={t('a11y.switchLanguage')}
      className={cn(
        'flex items-center gap-0.5 rounded-full border p-0.5',
        tone === 'onDark' ? 'border-ink-inverse/35' : 'border-line-strong',
        className
      )}
    >
      {order
        .filter((code) => LOCALES.includes(code))
        .map((code) => {
          const active = locale === code
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              aria-pressed={active}
              title={names[code]}
              className={cn(
                'rounded-full px-3 py-1.5 text-[0.7rem] font-semibold tracking-[0.1em] transition-colors duration-300',
                active
                  ? 'bg-gold text-gold-ink'
                  : tone === 'onDark'
                    ? 'text-ink-inverse-muted hover:text-ink-inverse'
                    : 'text-ink-muted hover:text-ink'
              )}
            >
              {labels[code]}
              <span className="sr-only">
                {' '}
                – {names[code]}
                {active ? ` (${t('a11y.currentLanguage')})` : ''}
              </span>
            </button>
          )
        })}
    </div>
  )
}
