'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  CalendarDays,
  Check,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  User,
} from 'lucide-react'

import { site } from '@/data/site'
import { useLocale } from '@/i18n/LocaleProvider'
import { useCart, useCartItems } from '@/components/cart/CartProvider'
import { createOrderSchema, todayInput } from '@/lib/validation'
import { orderSlots } from '@/lib/hours'
import { addDays, formatPrice, toDateInput, cn } from '@/lib/format'
import { Button, ButtonLink } from '@/components/ui/Button'
import { CheckboxField, SelectField, TextField, TextareaField } from '@/components/forms/Field'
import { LotusDivider, LotusMarkIcon } from '@/components/ui/Icons'

interface FormValues {
  method: 'pickup' | 'delivery'
  date: string
  time: string
  name: string
  email: string
  phone: string
  street: string
  postalCode: string
  city: string
  floor: string
  notes: string
  consent: boolean
}

interface Confirmation {
  code: string
  method: 'pickup' | 'delivery'
  time: string
  total: number
}

export function CheckoutContent() {
  const { t, locale } = useLocale()
  const cart = useCart()
  const items = useCartItems()
  const [serverError, setServerError] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const [step, setStep] = useState(0)

  const schema = useMemo(() => createOrderSchema(t), [t])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- RHF input type vs. zod output type
    resolver: zodResolver(schema as any),
    mode: 'onTouched',
    defaultValues: {
      method: 'pickup',
      date: todayInput(),
      time: '',
      name: '',
      email: '',
      phone: '',
      street: '',
      postalCode: '',
      city: site.address.city,
      floor: '',
      notes: '',
      consent: false,
    },
  })

  const method = watch('method')
  const date = watch('date')
  const time = watch('time')

  // Keep the cart's delivery-fee calculation in sync with the chosen method.
  const { setMethod } = cart
  useEffect(() => {
    setMethod(method)
  }, [method, setMethod])

  const slots = useMemo(() => (date ? orderSlots(date) : []), [date])

  // `items` lives on the zod schema but not on the form's field set, so its
  // error (empty cart / below minimum) is read off the error map directly.
  const itemsError = (errors as Record<string, { message?: string } | undefined>).items?.message

  useEffect(() => {
    if (time && !slots.includes(time)) setValue('time', '')
  }, [slots, time, setValue])

  // Walk the demo order through its states after submission.
  useEffect(() => {
    if (!confirmation) return
    const timers = [1, 2, 3].map((index) =>
      window.setTimeout(() => setStep(index), index * 2600)
    )
    return () => timers.forEach(window.clearTimeout)
  }, [confirmation])

  async function onSubmit(values: FormValues) {
    setServerError(null)
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          locale,
          subtotal: cart.subtotal,
          items: cart.lines.map((line) => ({
            dishId: line.dishId,
            quantity: line.quantity,
            note: line.note ?? '',
          })),
        }),
      })

      const payload = (await response.json()) as { ok?: boolean; code?: string }
      if (!response.ok || !payload.ok || !payload.code) throw new Error('rejected')

      setConfirmation({
        code: payload.code,
        method: values.method,
        time: values.time,
        total: cart.total,
      })
      cart.clear()
    } catch {
      setServerError(t('orderPage.errors.generic'))
    }
  }

  /* ------------------------------------------------------- confirmation */
  if (confirmation) {
    return (
      <section className="bg-night px-5 pb-24 pt-36 md:pt-44">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="container-luxe max-w-2xl"
        >
          <div className="tile p-8 text-center sm:p-10">
            <LotusMarkIcon className="mx-auto h-10 w-16 text-gold" />
            <h1 className="mt-6 font-display text-3xl text-gold-soft sm:text-4xl">
              {t('orderPage.confirmation.title')}
            </h1>
            <p className="mt-3 text-sm text-cream-dim/75">{t('orderPage.confirmation.text')}</p>

            <div className="mt-8 rounded-sm border border-gold/35 bg-night/50 p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-gold/80">
                {t('orderPage.confirmation.codeLabel')}
              </p>
              <p className="mt-2 font-display text-3xl tracking-[0.12em] text-gold">
                {confirmation.code}
              </p>
            </div>

            <p className="mt-5 text-sm text-cream-dim/80">
              {confirmation.method === 'pickup'
                ? t('orderPage.confirmation.etaPickup', { time: confirmation.time })
                : t('orderPage.confirmation.etaDelivery', { time: confirmation.time })}
              {' · '}
              <span className="text-gold-soft tabular-nums">
                {formatPrice(confirmation.total, locale)}
              </span>
            </p>

            <LotusDivider className="my-8" />

            <h2 className="text-[0.7rem] uppercase tracking-[0.2em] text-gold">
              {t('orderPage.confirmation.statusTitle')}
            </h2>

            <ol className="mt-6 space-y-4 text-left">
              {(['0', '1', '2', '3'] as const).map((key, index) => {
                const done = index <= step
                return (
                  <li key={key} className="flex items-center gap-4">
                    <span
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-600',
                        done
                          ? 'border-gold bg-gold text-charcoal'
                          : 'border-gold/30 text-gold/40'
                      )}
                    >
                      {done ? (
                        <Check className="h-4 w-4" strokeWidth={2.2} />
                      ) : (
                        <span className="text-xs tabular-nums">{index + 1}</span>
                      )}
                    </span>
                    <span
                      className={cn(
                        'text-sm transition-colors duration-600',
                        done ? 'text-cream-dim' : 'text-cream-dim/45'
                      )}
                    >
                      {t(`orderPage.confirmation.steps.${index}`)}
                    </span>
                  </li>
                )
              })}
            </ol>

            <p className="mt-8 rounded-sm border border-gold/20 bg-night/40 p-3.5 text-xs text-cream-dim/60">
              {t('orderPage.confirmation.demoNote')}
            </p>

            <ButtonLink href="/order" variant="secondary" className="mt-7 w-full">
              {t('orderPage.confirmation.again')}
            </ButtonLink>
          </div>
        </motion.div>
      </section>
    )
  }

  /* -------------------------------------------------------- empty cart */
  if (cart.hydrated && items.length === 0) {
    return (
      <section className="flex min-h-[70vh] items-center bg-night px-5 pb-24 pt-36">
        <div className="container-luxe max-w-lg text-center">
          <LotusMarkIcon className="mx-auto h-12 w-20 text-gold/45" />
          <h1 className="mt-7 font-display text-3xl text-cream">
            {t('orderPage.cart.empty')}
          </h1>
          <p className="mt-3 text-sm text-cream-dim/65">{t('orderPage.cart.emptyHint')}</p>
          <ButtonLink href="/order" className="mt-8">
            {t('orderPage.cart.browse')}
          </ButtonLink>
        </div>
      </section>
    )
  }

  const min = todayInput()
  const max = toDateInput(addDays(new Date(), 14))

  return (
    <section className="bg-night px-0 pb-24 pt-32 md:pt-40">
      <div className="container-luxe">
        <div className="mb-10">
          <span className="eyebrow">{t('orderPage.eyebrow')}</span>
          <h1 className="mt-4 text-[2.2rem] text-cream sm:text-[2.8rem]">
            {t('orderPage.checkout.title')}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-10"
        >
          <div className="space-y-8">
            {/* ------------------------------------------------ method */}
            <fieldset className="tile p-6 sm:p-7">
              <legend className="px-2 font-display text-xl uppercase tracking-[0.14em] text-gold-soft">
                {t('orderPage.checkout.methodTitle')}
              </legend>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {(['pickup', 'delivery'] as const).map((option) => (
                  <label
                    key={option}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-sm border p-4 transition-all duration-400',
                      method === option
                        ? 'border-gold bg-gold/10'
                        : 'border-gold/25 hover:border-gold/55'
                    )}
                  >
                    <input
                      {...register('method')}
                      type="radio"
                      value={option}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                        method === option ? 'border-gold bg-gold' : 'border-gold/45'
                      )}
                    >
                      {method === option ? (
                        <Check className="h-3 w-3 text-charcoal" strokeWidth={3} />
                      ) : null}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-cream-dim">
                        {t(`orderPage.checkout.${option}`)}
                      </span>
                      <span className="mt-1 block text-xs text-cream-dim/60">
                        {t(`orderPage.checkout.${option}Hint`)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* -------------------------------------------------- time */}
            <fieldset className="tile p-6 sm:p-7">
              <legend className="px-2 font-display text-xl uppercase tracking-[0.14em] text-gold-soft">
                {t('orderPage.checkout.timeTitle')}
              </legend>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <TextField
                  {...register('date')}
                  type="date"
                  label={t('reservationPage.fields.date')}
                  required
                  min={min}
                  max={max}
                  error={errors.date?.message}
                  icon={<CalendarDays className="h-4 w-4" strokeWidth={1.5} />}
                />
                <SelectField
                  {...register('time')}
                  label={t('reservationPage.fields.time')}
                  required
                  error={errors.time?.message}
                  hint={
                    slots.length === 0 ? t('reservationPage.errors.timeClosed') : undefined
                  }
                  icon={<Clock className="h-4 w-4" strokeWidth={1.5} />}
                >
                  <option value="">{t('reservationPage.placeholders.time')}</option>
                  {slots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </SelectField>
              </div>
            </fieldset>

            {/* ----------------------------------------------- contact */}
            <fieldset className="tile p-6 sm:p-7">
              <legend className="px-2 font-display text-xl uppercase tracking-[0.14em] text-gold-soft">
                {t('orderPage.checkout.contactTitle')}
              </legend>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <TextField
                  {...register('name')}
                  label={t('orderPage.checkout.fields.name')}
                  required
                  autoComplete="name"
                  error={errors.name?.message}
                  icon={<User className="h-4 w-4" strokeWidth={1.5} />}
                  wrapperClassName="sm:col-span-2"
                />
                <TextField
                  {...register('email')}
                  type="email"
                  label={t('orderPage.checkout.fields.email')}
                  required
                  autoComplete="email"
                  error={errors.email?.message}
                  icon={<Mail className="h-4 w-4" strokeWidth={1.5} />}
                />
                <TextField
                  {...register('phone')}
                  type="tel"
                  label={t('orderPage.checkout.fields.phone')}
                  required
                  autoComplete="tel"
                  error={errors.phone?.message}
                  icon={<Phone className="h-4 w-4" strokeWidth={1.5} />}
                />
              </div>
            </fieldset>

            {/* ----------------------------------------------- address */}
            {method === 'delivery' ? (
              <motion.fieldset
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="tile p-6 sm:p-7"
              >
                <legend className="px-2 font-display text-xl uppercase tracking-[0.14em] text-gold-soft">
                  {t('orderPage.checkout.addressTitle')}
                </legend>

                <div className="mt-5 grid gap-5 sm:grid-cols-6">
                  <TextField
                    {...register('street')}
                    label={t('orderPage.checkout.fields.street')}
                    required
                    autoComplete="street-address"
                    placeholder={t('orderPage.checkout.placeholders.street')}
                    error={errors.street?.message}
                    icon={<MapPin className="h-4 w-4" strokeWidth={1.5} />}
                    wrapperClassName="sm:col-span-6"
                  />
                  <TextField
                    {...register('postalCode')}
                    label={t('orderPage.checkout.fields.postalCode')}
                    required
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder={t('orderPage.checkout.placeholders.postalCode')}
                    error={errors.postalCode?.message}
                    wrapperClassName="sm:col-span-2"
                  />
                  <TextField
                    {...register('city')}
                    label={t('orderPage.checkout.fields.city')}
                    required
                    autoComplete="address-level2"
                    placeholder={t('orderPage.checkout.placeholders.city')}
                    error={errors.city?.message}
                    wrapperClassName="sm:col-span-4"
                  />
                  <TextField
                    {...register('floor')}
                    label={t('orderPage.checkout.fields.floor')}
                    placeholder={t('orderPage.checkout.placeholders.floor')}
                    error={errors.floor?.message}
                    wrapperClassName="sm:col-span-6"
                  />
                </div>
              </motion.fieldset>
            ) : null}

            <div className="tile p-6 sm:p-7">
              <TextareaField
                {...register('notes')}
                label={t('orderPage.checkout.fields.notes')}
                placeholder={t('orderPage.checkout.placeholders.notes')}
                error={errors.notes?.message}
                rows={3}
              />

              <div className="mt-6">
                <CheckboxField
                  {...register('consent')}
                  id="order-consent"
                  error={errors.consent?.message}
                  label={
                    <>
                      {t('orderPage.checkout.fields.consent')}{' '}
                      <Link
                        href="/privacy"
                        target="_blank"
                        className="text-gold underline-offset-4 hover:underline"
                      >
                        {t('nav.privacy')}
                      </Link>
                      {' · '}
                      <Link
                        href="/terms"
                        target="_blank"
                        className="text-gold underline-offset-4 hover:underline"
                      >
                        {t('nav.terms')}
                      </Link>
                    </>
                  }
                />
              </div>
            </div>
          </div>

          {/* ------------------------------------------------- summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="tile p-6 sm:p-7">
              <h2 className="flex items-center gap-3 font-display text-xl uppercase tracking-[0.14em] text-gold-soft">
                <ShoppingBag className="h-5 w-5 text-gold" strokeWidth={1.5} />
                {t('orderPage.checkout.summaryTitle')}
              </h2>

              <ul className="mt-6 divide-y divide-gold/10">
                {items.map((item) => (
                  <li key={item.dishId} className="flex gap-3 py-3.5">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-gold/20">
                      <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-cream-dim">
                        <span className="text-gold-soft tabular-nums">{item.quantity}×</span>{' '}
                        {item.nameVi}
                      </p>
                      {item.note ? (
                        <p className="mt-0.5 truncate text-[0.7rem] italic text-cream-dim/50">
                          {item.note}
                        </p>
                      ) : null}
                    </div>
                    <span className="text-sm text-cream-dim/85 tabular-nums">
                      {formatPrice(item.lineTotal, locale)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-2 border-t border-gold/15 pt-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-cream-dim/65">{t('orderPage.cart.subtotal')}</dt>
                  <dd className="text-cream-dim tabular-nums">{formatPrice(cart.subtotal, locale)}</dd>
                </div>
                {method === 'delivery' ? (
                  <div className="flex justify-between">
                    <dt className="text-cream-dim/65">{t('orderPage.cart.deliveryFee')}</dt>
                    <dd className="text-cream-dim tabular-nums">
                      {cart.deliveryFee === 0
                        ? t('orderPage.cart.free')
                        : formatPrice(cart.deliveryFee, locale)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex items-baseline justify-between border-t border-gold/15 pt-3">
                  <dt className="text-sm uppercase tracking-[0.14em] text-cream-dim/80">
                    {t('orderPage.cart.total')}
                  </dt>
                  <dd className="font-display text-2xl text-gold tabular-nums">
                    {formatPrice(cart.total, locale)}
                  </dd>
                </div>
              </dl>

              {itemsError ? (
                <p role="alert" className="mt-4 text-xs text-red-300">
                  {itemsError}
                </p>
              ) : null}

              {serverError ? (
                <p
                  role="alert"
                  className="mt-4 flex items-start gap-2.5 rounded-sm border border-red-400/40 bg-red-950/25 p-3.5 text-sm text-red-200"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.6} />
                  {serverError}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="mt-6 w-full"
              >
                {isSubmitting
                  ? t('orderPage.checkout.submitting')
                  : t('orderPage.checkout.submit')}
              </Button>

              <p className="mt-4 text-center text-xs text-cream-dim/55">
                {t('orderPage.checkout.payLater')}
              </p>

              {/* prepared for a future Stripe / PayPal integration */}
              <div className="mt-5 flex items-center gap-2.5 rounded-sm border border-dashed border-gold/25 p-3.5 text-xs text-cream-dim/45">
                <CreditCard className="h-4 w-4 shrink-0 text-gold/60" strokeWidth={1.5} />
                {t('orderPage.checkout.paymentSoon')}
              </div>
            </div>
          </aside>
        </form>
      </div>
    </section>
  )
}
