'use client'

import type { Dish } from '@/types'
import { useLocale } from '@/i18n/LocaleProvider'
import { useCart } from '@/components/cart/CartProvider'
import { MenuSplit } from '@/components/menu/MenuSplit'
import { Eyebrow } from '@/components/ui/Section'
import { ButtonLink } from '@/components/ui/Button'

export function MenuPageContent() {
  const { t, tx } = useLocale()
  const { add, open } = useCart()
  const titleParts = tx<string[]>('menuPage.titleParts') ?? []
  const highlight = t('menuPage.highlight')

  const handleAdd = (dish: Dish, quantity: number, note: string) => {
    add(dish.id, quantity, note)
    open()
  }

  return (
    <>
      <header className="border-b border-line bg-surface-2">
        <div className="container-page py-10 md:py-14">
          <Eyebrow>{t('menuPage.eyebrow')}</Eyebrow>

          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-[2.2rem] leading-[1.05] sm:text-[2.8rem] lg:text-[3.2rem]">
                {titleParts.map((part, index) => (
                  <span
                    key={part}
                    className={part.trim() === highlight.trim() ? 'text-gold' : undefined}
                  >
                    {part}
                    {index < titleParts.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </h1>
              <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-ink-muted">
                {t('menuPage.intro')}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <ButtonLink href="/order">{t('common.orderOnline')}</ButtonLink>
              <ButtonLink href="/reservation" variant="secondary">
                {t('common.reserveTable')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </header>

      <MenuSplit onAdd={handleAdd} />
    </>
  )
}
