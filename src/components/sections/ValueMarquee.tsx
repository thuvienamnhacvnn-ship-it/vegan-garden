'use client'

import { brandValues } from '@/data/values'
import { useT } from '@/i18n/LocaleProvider'
import { valueIconMap } from '@/components/ui/Icons'
import { Marquee } from '@/components/motion/Scroll'

/**
 * Ticker of the five brand values. Purely decorative movement, so it is
 * aria-hidden inside Marquee - the same five values are listed as real text
 * in the bento grid below.
 */
export function ValueMarquee() {
  const t = useT()

  const items = brandValues.map((value, index) => {
    const Icon = valueIconMap[value.icon]
    return (
      <span key={value.id} className="flex items-center gap-4">
        <Icon className="h-7 w-7 shrink-0 text-gold" />
        <span className="whitespace-nowrap font-display text-2xl text-ink md:text-3xl">
          {t(`brandBar.items.${index}.title`)}
        </span>
        <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/60" />
      </span>
    )
  })

  return (
    <div className="border-y border-line bg-surface-2 py-7 md:py-9">
      <Marquee items={items} speed={44} />
    </div>
  )
}
