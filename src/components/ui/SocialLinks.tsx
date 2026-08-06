'use client'

import { site } from '@/data/site'
import { socialIconMap } from './Icons'
import { useT } from '@/i18n/LocaleProvider'
import { cn } from '@/lib/format'

/** Circled social icons. `tone` picks the palette side, nothing else changes. */
export function SocialLinks({
  className,
  tone = 'default',
  size = 'md',
}: {
  className?: string
  tone?: 'default' | 'onDark'
  size?: 'sm' | 'md'
}) {
  const t = useT()

  return (
    <ul className={cn('flex items-center gap-2.5', className)}>
      {site.social.map((network) => {
        const Icon = socialIconMap[network.id]
        return (
          <li key={network.id}>
            <a
              href={network.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('a11y.socialLink', { network: network.label })}
              title={network.label}
              className={cn(
                'inline-flex items-center justify-center rounded-full border transition-colors duration-300',
                size === 'sm' ? 'h-11 w-11 md:h-9 md:w-9' : 'h-11 w-11 md:h-10 md:w-10',
                tone === 'onDark'
                  ? 'border-ink-inverse/35 text-ink-inverse hover:border-gold hover:bg-gold hover:text-gold-ink'
                  : 'border-line-strong text-ink hover:border-gold hover:bg-gold hover:text-gold-ink'
              )}
            >
              <Icon className={size === 'sm' ? 'h-[15px] w-[15px]' : 'h-[17px] w-[17px]'} />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
