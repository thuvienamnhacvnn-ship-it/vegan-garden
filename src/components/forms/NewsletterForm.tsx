'use client'

import { useState, type FormEvent } from 'react'
import { Check, Send } from 'lucide-react'
import { useT } from '@/i18n/LocaleProvider'
import { cn } from '@/lib/format'

type State = 'idle' | 'loading' | 'success' | 'error'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function NewsletterForm({
  className,
  tone = 'default',
}: {
  className?: string
  tone?: 'default' | 'onDark'
}) {
  const t = useT()
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('idle')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!EMAIL.test(email.trim())) {
      setState('error')
      return
    }

    setState('loading')
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!response.ok) throw new Error('request failed')
      setState('success')
      setEmail('')
    } catch {
      setState('error')
    }
  }

  const onDark = tone === 'onDark'

  return (
    <form onSubmit={onSubmit} className={cn('w-full', className)} noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        {t('newsletter.placeholder')}
      </label>

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (state === 'error') setState('idle')
          }}
          placeholder={t('newsletter.placeholder')}
          aria-invalid={state === 'error'}
          aria-describedby="newsletter-status"
          className={cn(
            'h-12 flex-1 rounded-[var(--radius-sm)] border px-4 text-[0.92rem] transition-colors duration-200',
            'focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/25',
            onDark
              ? 'border-line-inverse/25 bg-inverse text-ink-inverse placeholder:text-ink-inverse-muted'
              : 'border-line bg-well text-ink placeholder:text-ink-subtle',
            state === 'error' && 'border-danger'
          )}
        />
        <button
          type="submit"
          disabled={state === 'loading' || state === 'success'}
          className={cn(
            'group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6',
            'bg-gold text-gold-ink text-[0.75rem] font-semibold uppercase tracking-[0.1em]',
            'transition-colors duration-300 hover:bg-gold-hover',
            'disabled:cursor-not-allowed disabled:opacity-60'
          )}
        >
          {state === 'success' ? (
            <Check className="h-4 w-4" strokeWidth={2.2} />
          ) : (
            <Send
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
              strokeWidth={1.8}
            />
          )}
          {state === 'loading' ? t('common.sending') : t('newsletter.submit')}
        </button>
      </div>

      <p
        id="newsletter-status"
        role="status"
        aria-live="polite"
        className={cn(
          'mt-2.5 text-[0.78rem]',
          state === 'error' && 'text-danger',
          state === 'success' && (onDark ? 'text-gold-on-dark' : 'text-success'),
          state !== 'error' && state !== 'success' && (onDark ? 'opacity-70' : 'text-ink-subtle')
        )}
      >
        {state === 'error'
          ? t('newsletter.error')
          : state === 'success'
            ? t('newsletter.success')
            : t('newsletter.consent')}
      </p>
    </form>
  )
}
