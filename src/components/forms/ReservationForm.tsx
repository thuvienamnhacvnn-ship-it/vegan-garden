'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Clock, Users, User, Mail, Phone, Leaf, CheckCircle2, AlertCircle } from 'lucide-react'

import { site } from '@/data/site'
import { useLocale } from '@/i18n/LocaleProvider'
import { createReservationSchema, todayInput } from '@/lib/validation'
import { reservationSlots } from '@/lib/hours'
import { addDays, formatDate, toDateInput, cn } from '@/lib/format'
import { Button } from '@/components/ui/Button'
import { CheckboxField, SelectField, TextField, TextareaField } from './Field'
import { LotusMarkIcon } from '@/components/ui/Icons'

interface FormValues {
  date: string
  time: string
  guests: string
  name: string
  email: string
  phone: string
  notes: string
  allergies: string
  consent: boolean
}

interface Success {
  code: string
  date: string
  time: string
  guests: number
  name: string
}

/**
 * Full reservation form. `variant="compact"` renders the shorter card used on
 * the contact screen of the mock-up; "full" is the reservation page.
 */
export function ReservationForm({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  const { t, locale } = useLocale()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState<Success | null>(null)

  const schema = useMemo(() => createReservationSchema(t), [t])

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- RHF input type vs. zod output type
    resolver: zodResolver(schema as any),
    mode: 'onTouched',
    defaultValues: {
      date: '',
      time: '',
      guests: '2',
      name: '',
      email: '',
      phone: '',
      notes: '',
      allergies: '',
      consent: false,
    },
  })

  const selectedDate = watch('date')
  const selectedTime = watch('time')

  // Slots depend on the weekday, so recompute whenever the date changes.
  const slots = useMemo(
    () => (selectedDate ? reservationSlots(selectedDate) : []),
    [selectedDate]
  )

  useEffect(() => {
    if (selectedTime && !slots.includes(selectedTime)) setValue('time', '')
  }, [slots, selectedTime, setValue])

  const min = todayInput()
  const max = toDateInput(addDays(new Date(), site.reservation.horizonDays))

  async function onSubmit(values: FormValues) {
    setServerError(null)
    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, guests: Number(values.guests), locale }),
      })

      const payload = (await response.json()) as { ok?: boolean; code?: string }
      if (!response.ok || !payload.ok || !payload.code) throw new Error('rejected')

      setSuccess({
        code: payload.code,
        date: values.date,
        time: values.time,
        guests: Number(values.guests),
        name: values.name,
      })
      reset()
    } catch {
      setServerError(t('reservationPage.errors.generic'))
    }
  }

  /* ------------------------------------------------------------- success */
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        role="status"
        aria-live="polite"
        className="tile p-7 text-center sm:p-9"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold" strokeWidth={1.2} />
        <h3 className="mt-5 font-display text-2xl text-gold-soft sm:text-3xl">
          {t('reservationPage.success.title')}
        </h3>
        <p className="mt-3 text-sm text-cream-dim/75">{t('reservationPage.success.text')}</p>

        <div className="mt-7 rounded-sm border border-gold/35 bg-night/50 p-5">
          <p className="text-[0.68rem] uppercase tracking-[0.2em] text-gold/80">
            {t('reservationPage.success.codeLabel')}
          </p>
          <p className="mt-2 font-display text-3xl tracking-[0.14em] text-gold">{success.code}</p>
        </div>

        <dl className="mt-6 space-y-2 text-left text-sm">
          <div className="flex justify-between gap-4 border-b border-gold/10 pb-2">
            <dt className="text-cream-dim/60">{t('reservationPage.fields.name')}</dt>
            <dd className="text-cream-dim">{success.name}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-gold/10 pb-2">
            <dt className="text-cream-dim/60">{t('reservationPage.fields.date')}</dt>
            <dd className="text-right text-cream-dim">{formatDate(success.date, locale)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-gold/10 pb-2">
            <dt className="text-cream-dim/60">{t('reservationPage.fields.time')}</dt>
            <dd className="text-cream-dim tabular-nums">{success.time}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-cream-dim/60">{t('reservationPage.fields.guests')}</dt>
            <dd className="text-cream-dim tabular-nums">{success.guests}</dd>
          </div>
        </dl>

        <Button
          variant="secondary"
          className="mt-7 w-full"
          onClick={() => setSuccess(null)}
        >
          {t('reservationPage.success.again')}
        </Button>
      </motion.div>
    )
  }

  /* ---------------------------------------------------------------- form */
  const compact = variant === 'compact'

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn('tile p-6 sm:p-8', compact && '')}
    >
      {compact ? (
        <div className="mb-7 text-center">
          <h3 className="font-display text-2xl uppercase tracking-[0.14em] text-gold-soft">
            {t('contactBlock.quickReservation')}
          </h3>
          <LotusMarkIcon className="mx-auto mt-3 h-5 w-9 text-gold/80" />
        </div>
      ) : null}

      <div className={cn('grid gap-5', compact ? 'grid-cols-1' : 'sm:grid-cols-2')}>
        <TextField
          {...register('date')}
          type="date"
          label={t('reservationPage.fields.date')}
          required
          min={min}
          max={max}
          error={errors.date?.message}
          icon={<CalendarDays className="h-4 w-4" strokeWidth={1.5} />}
          wrapperClassName={compact ? undefined : 'sm:col-span-1'}
        />

        <SelectField
          {...register('time')}
          label={t('reservationPage.fields.time')}
          required
          disabled={!selectedDate}
          error={errors.time?.message}
          hint={selectedDate && slots.length === 0 ? t('reservationPage.errors.timeClosed') : undefined}
          icon={<Clock className="h-4 w-4" strokeWidth={1.5} />}
        >
          <option value="">{t('reservationPage.placeholders.time')}</option>
          {slots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </SelectField>

        <SelectField
          {...register('guests')}
          label={t('reservationPage.fields.guests')}
          required
          error={errors.guests?.message}
          hint={t('reservationPage.guestsMore', { n: site.reservation.maxGuests })}
          icon={<Users className="h-4 w-4" strokeWidth={1.5} />}
          wrapperClassName={compact ? undefined : 'sm:col-span-2'}
        >
          {Array.from({ length: site.reservation.maxGuests }, (_, index) => index + 1).map((n) => (
            <option key={n} value={n}>
              {n === 1
                ? t('reservationPage.guestsOptionOne')
                : t('reservationPage.guestsOption', { n })}
            </option>
          ))}
        </SelectField>

        <TextField
          {...register('name')}
          label={t('reservationPage.fields.name')}
          required
          autoComplete="name"
          placeholder={t('reservationPage.placeholders.name')}
          error={errors.name?.message}
          icon={<User className="h-4 w-4" strokeWidth={1.5} />}
          wrapperClassName={compact ? undefined : 'sm:col-span-2'}
        />

        <TextField
          {...register('email')}
          type="email"
          label={t('reservationPage.fields.email')}
          required
          autoComplete="email"
          placeholder={t('reservationPage.placeholders.email')}
          error={errors.email?.message}
          icon={<Mail className="h-4 w-4" strokeWidth={1.5} />}
        />

        <TextField
          {...register('phone')}
          type="tel"
          label={t('reservationPage.fields.phone')}
          required
          autoComplete="tel"
          placeholder={t('reservationPage.placeholders.phone')}
          error={errors.phone?.message}
          icon={<Phone className="h-4 w-4" strokeWidth={1.5} />}
        />

        {!compact ? (
          <TextField
            {...register('allergies')}
            label={t('reservationPage.fields.allergies')}
            placeholder={t('reservationPage.placeholders.allergies')}
            error={errors.allergies?.message}
            icon={<Leaf className="h-4 w-4" strokeWidth={1.5} />}
            wrapperClassName="sm:col-span-2"
          />
        ) : null}

        <TextareaField
          {...register('notes')}
          label={t('reservationPage.fields.notes')}
          placeholder={t('reservationPage.placeholders.notes')}
          error={errors.notes?.message}
          rows={compact ? 2 : 3}
          wrapperClassName={compact ? undefined : 'sm:col-span-2'}
        />
      </div>

      <div className="mt-6">
        <CheckboxField
          {...register('consent')}
          id="reservation-consent"
          error={errors.consent?.message}
          label={
            <>
              {t('reservationPage.fields.consent')}{' '}
              <Link
                href="/privacy"
                className="text-gold underline-offset-4 hover:underline"
                target="_blank"
              >
                {t('nav.privacy')}
              </Link>
            </>
          }
        />
      </div>

      <AnimatePresence>
        {serverError ? (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="alert"
            className="mt-5 flex items-start gap-2.5 rounded-sm border border-red-400/40 bg-red-950/25 p-3.5 text-sm text-red-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.6} />
            {serverError}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <Button type="submit" disabled={isSubmitting} className="mt-6 w-full" size="lg">
        {isSubmitting ? t('reservationPage.submitting') : t('reservationPage.submit')}
      </Button>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-gold/75">
        <Leaf className="h-3.5 w-3.5" strokeWidth={1.5} />
        {t('contactBlock.confirmationNote')}
      </p>
    </form>
  )
}
