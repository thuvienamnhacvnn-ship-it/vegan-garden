'use client'

import { useEffect, useState } from 'react'
import { openingHours, weekOrder } from '@/data/site'
import { isOpenAt } from '@/lib/hours'
import { useT } from '@/i18n/LocaleProvider'
import { cn } from '@/lib/format'

export function OpeningHoursTable({ className }: { className?: string }) {
  const t = useT()
  // Resolved after mount so the server-rendered markup stays deterministic.
  const [today, setToday] = useState<number | null>(null)
  const [open, setOpen] = useState<boolean | null>(null)

  useEffect(() => {
    const now = new Date()
    setToday(now.getDay())
    setOpen(isOpenAt(now))
  }, [])

  return (
    <div className={className}>
      <dl className="space-y-2.5">
        {weekOrder.map((day) => {
          const entry = openingHours.find((item) => item.day === day)
          const isToday = today === day
          return (
            <div
              key={day}
              className={cn(
                'flex items-baseline justify-between gap-4 border-b border-gold/10 pb-2 text-sm',
                isToday && 'text-gold-soft'
              )}
            >
              <dt className={cn('whitespace-nowrap text-cream-dim/80', isToday && 'font-medium text-gold-soft')}>
                {t(`weekdays.${day}`)}
                {isToday ? (
                  <span className="ml-2 text-[0.65rem] uppercase tracking-[0.16em] text-gold/70">
                    {t('common.today')}
                  </span>
                ) : null}
              </dt>
              <dd
                className={cn(
                  'whitespace-nowrap tabular-nums text-cream-dim/90',
                  isToday && 'text-gold-soft'
                )}
              >
                {entry ? `${entry.opens} – ${entry.closes}` : t('common.closed')}
              </dd>
            </div>
          )
        })}
      </dl>

      {open !== null ? (
        <p className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.16em]">
          <span
            className={cn(
              'inline-block h-1.5 w-1.5 rounded-full',
              open ? 'bg-gold' : 'bg-cream-dim/40'
            )}
          />
          <span className={open ? 'text-gold' : 'text-cream-dim/55'}>
            {open ? t('common.openNow') : t('common.closedNow')}
          </span>
        </p>
      ) : null}
    </div>
  )
}
