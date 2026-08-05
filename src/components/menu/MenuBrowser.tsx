'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import type { Dish, DishTag, MenuCategory } from '@/types'
import { dishes, menuCategories } from '@/data/menu'
import { useLocale } from '@/i18n/LocaleProvider'
import { cn } from '@/lib/format'
import { DishCard } from './DishCard'
import { DishModal } from './DishModal'
import { LotusMarkIcon } from '@/components/ui/Icons'

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
 * Menu browser: category tabs, free-text search, diet filters and the dish
 * detail modal. All filters combine; every one of them is a plain URL-free
 * client state so the page stays instant.
 */
export function MenuBrowser({ onAdd }: { onAdd?: (dish: Dish) => void }) {
  const { t } = useLocale()
  const [category, setCategory] = useState<MenuCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const [diets, setDiets] = useState<DietFilter[]>([])
  const [selected, setSelected] = useState<Dish | null>(null)

  const deferredQuery = useDeferredValue(query)

  const results = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase()

    return dishes.filter((dish) => {
      if (category !== 'all' && dish.category !== category) return false
      if (diets.length && !diets.every((filter) => matchesDiet(dish, filter))) return false
      if (!needle) return true

      const haystack = [
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

      return haystack.includes(needle)
    })
  }, [category, deferredQuery, diets])

  const toggleDiet = (filter: DietFilter) =>
    setDiets((current) =>
      current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]
    )

  const hasFilters = category !== 'all' || diets.length > 0 || query.trim().length > 0

  return (
    <>
      {/* --------------------------------------------------------- controls */}
      <div className="sticky top-16 z-30 -mx-5 border-y border-gold/15 bg-night/92 px-5 py-4 md:top-[4.25rem] md:mx-0 md:rounded-sm md:border md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* categories - horizontally scrollable on small screens */}
          <div className="-mx-1 overflow-x-auto no-scrollbar">
            <ul className="flex min-w-max items-center gap-2 px-1" role="tablist">
              {(['all', ...menuCategories] as const).map((key) => {
                const active = category === key
                return (
                  <li key={key}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setCategory(key)}
                      className={cn(
                        'min-h-11 whitespace-nowrap rounded-full border px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.14em] transition-all duration-400 ease-luxe',
                        active
                          ? 'border-gold bg-gold text-charcoal'
                          : 'border-gold/30 text-cream-dim/75 hover:border-gold/70 hover:text-gold-soft'
                      )}
                    >
                      {t(`menuPage.categories.${key}`)}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* search */}
          <div className="relative lg:w-72">
            <label htmlFor="dish-search" className="sr-only">
              {t('menuPage.searchPlaceholder')}
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/70"
              strokeWidth={1.5}
            />
            <input
              id="dish-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('menuPage.searchPlaceholder')}
              className="min-h-11 w-full rounded-full border border-gold/30 bg-night/50 py-2.5 pl-10 pr-10 text-sm text-cream-dim placeholder:text-cream-dim/40 focus:border-gold/70 focus:outline-none focus:ring-1 focus:ring-gold/40"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label={t('common.clear')}
                className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-cream-dim/60 transition-colors hover:text-gold"
              >
                <X className="h-4 w-4" strokeWidth={1.6} />
              </button>
            ) : null}
          </div>
        </div>

        {/* diet filters */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5 border-t border-gold/10 pt-4">
          <span className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.18em] text-gold/70">
            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
            {t('menuPage.filterDiet')}
          </span>

          {dietFilters.map((filter) => {
            const active = diets.includes(filter)
            return (
              <button
                key={filter}
                type="button"
                aria-pressed={active}
                onClick={() => toggleDiet(filter)}
                className={cn(
                  'min-h-9 rounded-full border px-3.5 py-1.5 text-[0.65rem] uppercase tracking-[0.12em] transition-all duration-400',
                  active
                    ? 'border-gold bg-gold/15 text-gold-soft'
                    : 'border-gold/25 text-cream-dim/65 hover:border-gold/60 hover:text-gold-soft'
                )}
              >
                {t(`menuPage.filters.${filter}`)}
              </button>
            )
          })}

          <span className="ml-auto text-[0.7rem] text-cream-dim/50">
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
              className="text-[0.7rem] text-gold underline-offset-4 transition-colors hover:underline"
            >
              {t('common.clear')}
            </button>
          ) : null}
        </div>
      </div>

      {/* ----------------------------------------------------------- results */}
      {results.length === 0 ? (
        <div className="py-24 text-center">
          <LotusMarkIcon className="mx-auto h-12 w-20 text-gold/40" />
          <p className="mt-6 font-display text-2xl text-cream">{t('menuPage.empty')}</p>
          <p className="mt-2 text-sm text-cream-dim/60">{t('menuPage.emptyHint')}</p>
        </div>
      ) : (
        <motion.ul layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {results.map((dish, index) => (
              <motion.li
                key={dish.id}
                layout
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index * 0.035, 0.3),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <DishCard
                  dish={dish}
                  onOpen={setSelected}
                  onAdd={onAdd}
                  priority={index < 4}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      <p className="mt-12 rounded-sm border border-gold/20 bg-charcoal/50 p-5 text-center text-sm text-cream-dim/70">
        {t('menuPage.allergyNote')}
      </p>

      <DishModal
        dish={selected}
        onClose={() => setSelected(null)}
        onAdd={
          onAdd
            ? (dish) => {
                onAdd(dish)
                setSelected(null)
              }
            : undefined
        }
      />

      <span className="sr-only" aria-live="polite">
        {t('menuPage.resultCount', { count: results.length })}
      </span>
    </>
  )
}
