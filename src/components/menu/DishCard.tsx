'use client'

import Image from 'next/image'
import { Plus } from 'lucide-react'
import type { Dish } from '@/types'
import { useLocale } from '@/i18n/LocaleProvider'
import { formatPrice, cn } from '@/lib/format'
import { ChiliIcon, LeafIcon } from '@/components/ui/Icons'
import { Badge } from '@/components/ui/Section'

/**
 * Dish card: photo, Vietnamese name, localised name, description, markers and
 * price. The whole card opens the detail view; the add button is a separate
 * control so it does not fight the card click target.
 */
export function DishCard({
  dish,
  onOpen,
  onAdd,
  priority = false,
  showPrice = true,
}: {
  dish: Dish
  onOpen: (dish: Dish) => void
  onAdd?: (dish: Dish) => void
  priority?: boolean
  showPrice?: boolean
}) {
  const { t, pick, locale } = useLocale()
  const isBestseller = dish.tags.includes('bestseller')

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)]',
        'border border-line bg-card shadow-[var(--shadow-sm)]',
        'transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-luxe)]',
        'hover:-translate-y-1 hover:border-gold/50 hover:shadow-[var(--shadow-md)]'
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(dish)}
        className="relative block aspect-4/3 w-full overflow-hidden text-left"
        aria-label={`${t('common.details')}: ${dish.nameVi}`}
      >
        <Image
          src={dish.image}
          alt={`${dish.nameVi} – ${pick(dish.name)}`}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 92vw"
          className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-luxe)] group-hover:scale-[1.05]"
        />
        {isBestseller ? (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-gold-ink">
            {t('signature.bestseller')}
          </span>
        ) : null}
      </button>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl leading-tight text-ink">{dish.nameVi}</h3>
        <p className="mt-1 text-[0.75rem] uppercase tracking-[0.1em] text-ink-subtle">
          {pick(dish.name)}
        </p>

        <p className="mt-3 flex-1 text-[0.86rem] leading-relaxed text-ink-muted">
          {pick(dish.description)}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone="gold">
            <LeafIcon className="mr-1.5 h-3.5 w-3.5" />
            {t('menuPage.plantBased')}
          </Badge>
          <Badge>
            <ChiliIcon className="mr-1.5 h-3.5 w-3.5" />
            {t(`menuPage.spice.${dish.spice}`)}
          </Badge>
          {dish.tags.includes('glutenFree') ? <Badge>{t('menuPage.tags.glutenFree')}</Badge> : null}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          {showPrice ? (
            <span className="font-display text-2xl text-ink tabular-nums">
              {formatPrice(dish.price, locale)}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onOpen(dish)}
              className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-gold transition-colors duration-300 hover:text-gold-hover"
            >
              {t('common.details')}
            </button>
          )}

          {onAdd ? (
            <button
              type="button"
              onClick={() => onAdd(dish)}
              aria-label={`${t('common.addToCart')}: ${dish.nameVi}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold text-gold-ink transition-colors duration-300 hover:bg-gold-hover"
            >
              <Plus className="h-4 w-4" strokeWidth={2.4} />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}
