'use client'

import Image from 'next/image'
import { useDeferredValue, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, Plus, SlidersHorizontal } from 'lucide-react'
import type { Dish, DishTag, MenuCategory } from '@/types'
import { dishes, menuCategories } from '@/data/menu'
import { useLocale } from '@/i18n/LocaleProvider'
import { formatPrice, cn } from '@/lib/format'
import { Badge } from '@/components/ui/Section'
import { DishDrawer } from './DishDrawer'

type DietFilter = 'glutenFree' | 'spicy' | 'mild' | 'bestseller'

const dietFilters: DietFilter[] = ['glutenFree', 'spicy', 'mild', 'bestseller']

function matchesDiet(dish: Dish, filter: DietFilter) {
  switch (filter) {
    case 'glutenFree':
      return dish.tags.includes('glutenFree')
    case 'bestseller':
      return dish.tags.includes('bestseller')
    case 'spicy':
      return dish.spice === 'medium' || dish.spice === 'hot'
    case 'mild':
      return dish.spice === 'mild'
    default:
      return true
  }
}

/**
 * Split-screen menu.
 *
 * Left: a sticky category rail. Right: the dishes for that category, swapped
 * in place with no navigation. Selecting a dish opens the detail drawer, so
 * the guest keeps their place in the list.
 */
export function MenuSplit({ onAdd }: { onAdd?: (dish: Dish, quantity: number, note: string) => void }) {
  const { t, pick, locale } = useLocale()
  const [category, setCategory] = useState<MenuCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const [diets, setDiets] = useState<DietFilter[]>([])
  const [selected, setSelected] = useState<Dish | null>(null)

  const deferredQuery = useDeferredValue(query)

  const countFor = useMemo(() => {
    const counts = new Map<string, number>()
    counts.set('all', dishes.length)
    for (const dish of dishes) {
      counts.set(dish.category, (counts.get(dish.category) ?? 0) + 1)
    }
    return counts
  }, [])

  const results = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase()

    return dishes.filter((dish) => {
      if (category !== 'all' && dish.category !== category) return false
      if (diets.length && !diets.every((filter) => matchesDiet(dish, filter))) return false
      if (!needle) return true

      return [
        dish.nameVi,
        dish.name.de,
        dish.name.vi,
        dish.description.de,
        dish.description.vi,
        ...dish.ingredients.de,
        ...dish.ingredients.vi,
      ]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
  }, [category, deferredQuery, diets])

  const toggleDiet = (filter: DietFilter) =>
    setDiets((current) =>
      current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]
    )

  const hasFilters = category !== 'all' || diets.length > 0 || query.trim().length > 0

  return (
    <>
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
        {/* ------------------------------------------------------- category rail */}
        {/* min-w-0: as a grid child this defaults to min-width:auto, so the
            category row's `min-w-max` stretched the whole column to 950px and
            the entire page could be swiped sideways on a phone. */}
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold">
            {t('menuPage.filterCategory')}
          </h2>

          {/* horizontal on mobile, vertical rail from lg */}
          <div className="-mx-1 mt-4 overflow-x-auto no-scrollbar lg:mx-0 lg:overflow-visible">
            <ul className="flex min-w-max gap-2 px-1 lg:min-w-0 lg:flex-col lg:px-0">
              {(['all', ...menuCategories] as const).map((key) => {
                const active = category === key
                return (
                  <li key={key}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCategory(key)}
                      className={cn(
                        'flex w-full items-center justify-between gap-3 whitespace-nowrap rounded-full border px-4 py-2.5 text-[0.8rem] font-medium transition-colors duration-300 lg:rounded-[var(--radius-sm)]',
                        active
                          ? 'border-gold bg-gold text-gold-ink'
                          : 'border-line text-ink-muted hover:border-gold/60 hover:text-ink'
                      )}
                    >
                      {t(`menuPage.categories.${key}`)}
                      <span className={cn('text-[0.72rem] tabular-nums', active ? 'text-gold-ink/70' : 'text-ink-subtle')}>
                        {countFor.get(key) ?? 0}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="mt-6 hidden lg:block">
            <h2 className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold">
              <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
              {t('menuPage.filterDiet')}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {dietFilters.map((filter) => {
                const active = diets.includes(filter)
                return (
                  <li key={filter}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleDiet(filter)}
                      className={cn(
                        'rounded-full border px-3.5 py-1.5 text-[0.72rem] transition-colors duration-300',
                        active
                          ? 'border-gold bg-gold/15 text-gold'
                          : 'border-line text-ink-muted hover:border-gold/60 hover:text-ink'
                      )}
                    >
                      {t(`menuPage.filters.${filter}`)}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

        {/* --------------------------------------------------------- dish panel */}
        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative sm:max-w-xs sm:flex-1">
              <label htmlFor="dish-search" className="sr-only">
                {t('menuPage.searchPlaceholder')}
              </label>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold"
                strokeWidth={1.8}
              />
              <input
                id="dish-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('menuPage.searchPlaceholder')}
                className="h-12 w-full rounded-full border border-line bg-well pl-11 pr-10 text-[0.9rem] text-ink placeholder:text-ink-subtle focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label={t('common.clear')}
                  className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-subtle transition-colors hover:text-gold"
                >
                  <X className="h-4 w-4" strokeWidth={1.8} />
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[0.8rem] text-ink-subtle">
                {results.length === 1
                  ? t('menuPage.resultCountOne')
                  : t('menuPage.resultCount', { count: results.length })}
              </span>
              {hasFilters ? (
                <button
                  type="button"
                  onClick={() => {
                    setCategory('all')
                    setDiets([])
                    setQuery('')
                  }}
                  className="text-[0.8rem] font-semibold text-gold underline-offset-4 hover:underline"
                >
                  {t('common.clear')}
                </button>
              ) : null}
            </div>
          </div>

          {/* diet filters on small screens */}
          <ul className="mt-4 flex flex-wrap gap-2 lg:hidden">
            {dietFilters.map((filter) => {
              const active = diets.includes(filter)
              return (
                <li key={filter}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleDiet(filter)}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-[0.72rem] transition-colors duration-300',
                      active
                        ? 'border-gold bg-gold/15 text-gold'
                        : 'border-line text-ink-muted hover:border-gold/60'
                    )}
                  >
                    {t(`menuPage.filters.${filter}`)}
                  </button>
                </li>
              )
            })}
          </ul>

          {results.length === 0 ? (
            <div className="mt-10 rounded-[var(--radius-lg)] border border-dashed border-line p-12 text-center">
              <p className="font-display text-2xl text-ink">{t('menuPage.empty')}</p>
              <p className="mt-2 text-[0.88rem] text-ink-muted">{t('menuPage.emptyHint')}</p>
            </div>
          ) : (
            <motion.ul layout className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {results.map((dish, index) => (
                  <motion.li
                    key={dish.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(index * 0.025, 0.2),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-card shadow-[var(--shadow-sm)] transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-luxe)] hover:-translate-y-1 hover:border-gold/50 hover:shadow-[var(--shadow-md)]">
                      <button
                        type="button"
                        onClick={() => setSelected(dish)}
                        aria-label={`${t('common.details')}: ${dish.nameVi}`}
                        className="relative block aspect-4/3 w-full overflow-hidden"
                      >
                        <Image
                          src={dish.image}
                          alt={`${dish.nameVi} – ${pick(dish.name)}`}
                          fill
                          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 40vw, 92vw"
                          loading={index < 6 ? 'eager' : 'lazy'}
                          className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-luxe)] group-hover:scale-[1.05]"
                        />
                        {dish.tags.includes('bestseller') ? (
                          <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-gold-ink">
                            {t('signature.bestseller')}
                          </span>
                        ) : null}
                      </button>

                      <div className="flex flex-1 flex-col p-5">
                        <button
                          type="button"
                          onClick={() => setSelected(dish)}
                          className="text-left"
                        >
                          <h3 className="font-display text-xl leading-tight text-ink">
                            {dish.nameVi}
                          </h3>
                          <p className="mt-1 text-[0.74rem] uppercase tracking-[0.1em] text-ink-subtle">
                            {pick(dish.name)}
                          </p>
                        </button>

                        <p className="mt-3 flex-1 text-[0.85rem] leading-relaxed text-ink-muted">
                          {pick(dish.description)}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {(dish.tags.filter((tag) => tag !== 'vegan') as DishTag[])
                            .slice(0, 2)
                            .map((tag) => (
                              <Badge key={tag}>{t(`menuPage.tags.${tag}`)}</Badge>
                            ))}
                          <Badge>{t(`menuPage.spice.${dish.spice}`)}</Badge>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                          <span className="font-display text-2xl text-ink tabular-nums">
                            {formatPrice(dish.price, locale)}
                          </span>
                          {onAdd ? (
                            <button
                              type="button"
                              onClick={() => onAdd(dish, 1, '')}
                              aria-label={`${t('common.addToCart')}: ${dish.nameVi}`}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold text-gold-ink transition-colors duration-300 hover:bg-gold-hover"
                            >
                              <Plus className="h-4 w-4" strokeWidth={2.4} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelected(dish)}
                              className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-gold hover:text-gold-hover"
                            >
                              {t('common.details')}
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}

          <p className="mt-8 rounded-[var(--radius-md)] border border-line bg-surface-2 p-5 text-center text-[0.85rem] text-ink-muted">
            {t('menuPage.allergyNote')}
          </p>
        </div>
      </div>

      <DishDrawer
        dish={selected}
        onClose={() => setSelected(null)}
        onAdd={
          onAdd
            ? (dish, quantity, note) => {
                onAdd(dish, quantity, note)
                setSelected(null)
              }
            : undefined
        }
      />
    </>
  )
}
