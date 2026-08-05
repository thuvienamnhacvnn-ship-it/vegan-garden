'use client'

import { brandValues } from '@/data/values'
import { useT } from '@/i18n/LocaleProvider'
import { valueIconMap } from '@/components/ui/Icons'
import { Rise } from '@/components/ui/Section'

/**
 * The five brand values, as a quiet band between the hero and the menu.
 * Deliberately low-contrast: it is a rhythm break, not a headline.
 */
export function ValueStrip() {
  const t = useT()

  return (
    <section className="border-b border-line bg-surface-2">
      <div className="container-page section-tight">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-9 md:grid-cols-3 lg:grid-cols-5">
          {brandValues.map((value, index) => {
            const Icon = valueIconMap[value.icon]
            return (
              <Rise as="li" key={value.id} delay={index * 0.06} className="flex flex-col items-center text-center">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/45 text-gold">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-ink">
                  {t(`brandBar.items.${index}.title`)}
                </h3>
                <p className="mt-2 max-w-[15rem] text-[0.82rem] leading-relaxed text-ink-muted">
                  {t(`brandBar.items.${index}.text`)}
                </p>
              </Rise>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
