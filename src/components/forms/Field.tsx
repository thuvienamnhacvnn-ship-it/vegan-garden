'use client'

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/lib/format'

/** Shared control shell: same height, radius, border and focus ring everywhere. */
const control =
  'w-full rounded-[var(--radius-sm)] border bg-well px-4 text-[0.95rem] text-ink ' +
  'placeholder:text-ink-subtle transition-colors duration-200 ' +
  'focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/25 ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

const ok = 'border-line'
const bad = 'border-danger'

function Shell({
  label,
  htmlFor,
  error,
  hint,
  required,
  className,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-muted"
      >
        {label}
        {required ? <span className="ml-1 text-gold">*</span> : null}
      </label>

      {children}

      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-[0.78rem] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-[0.78rem] text-ink-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}

/** Optional leading glyph, vertically centred inside the control. */
function LeadingIcon({ icon }: { icon: ReactNode }) {
  return (
    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gold">
      {icon}
    </span>
  )
}

export function TextField({
  label,
  error,
  hint,
  required,
  icon,
  wrapperClassName,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
  icon?: ReactNode
  wrapperClassName?: string
}) {
  const id = props.id ?? props.name ?? label
  return (
    <Shell
      label={label}
      htmlFor={id}
      error={error}
      hint={hint}
      required={required}
      className={wrapperClassName}
    >
      <div className="relative">
        {icon ? <LeadingIcon icon={icon} /> : null}
        <input
          {...props}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(control, 'h-12', icon && 'pl-11', error ? bad : ok, props.className)}
        />
      </div>
    </Shell>
  )
}

export function SelectField({
  label,
  error,
  hint,
  required,
  icon,
  wrapperClassName,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string
  hint?: string
  icon?: ReactNode
  wrapperClassName?: string
}) {
  const id = props.id ?? props.name ?? label
  return (
    <Shell
      label={label}
      htmlFor={id}
      error={error}
      hint={hint}
      required={required}
      className={wrapperClassName}
    >
      <div className="relative">
        {icon ? <LeadingIcon icon={icon} /> : null}
        <select
          {...props}
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(
            control,
            'h-12 appearance-none pr-10',
            icon && 'pl-11',
            error ? bad : ok,
            props.className
          )}
        >
          {children}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </Shell>
  )
}

export function TextareaField({
  label,
  error,
  hint,
  required,
  wrapperClassName,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  error?: string
  hint?: string
  wrapperClassName?: string
}) {
  const id = props.id ?? props.name ?? label
  return (
    <Shell
      label={label}
      htmlFor={id}
      error={error}
      hint={hint}
      required={required}
      className={wrapperClassName}
    >
      <textarea
        {...props}
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(control, 'min-h-28 resize-y py-3', error ? bad : ok, props.className)}
      />
    </Shell>
  )
}

export function CheckboxField({
  label,
  error,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; error?: string; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          {...props}
          id={id}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            'mt-0.5 h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-[5px] border bg-well',
            'transition-colors duration-200 checked:border-gold checked:bg-gold',
            'focus:outline-none focus:ring-2 focus:ring-gold/25',
            error ? bad : 'border-line-strong'
          )}
        />
        <span className="text-[0.85rem] leading-relaxed text-ink-muted">{label}</span>
      </label>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[0.78rem] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/** Radio-style choice card used by the booking wizard and the checkout. */
export function ChoiceCard({
  selected,
  title,
  description,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  selected: boolean
  title: string
  description?: string
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border p-4 transition-colors duration-300',
        selected ? 'border-gold bg-gold/10' : 'border-line hover:border-gold/60',
        className
      )}
    >
      <input {...props} type="radio" className="sr-only" />
      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
          selected ? 'border-gold bg-gold' : 'border-line-strong'
        )}
      >
        {selected ? <span className="h-2 w-2 rounded-full bg-gold-ink" /> : null}
      </span>
      <span className="min-w-0">
        <span className="block text-[0.92rem] font-semibold text-ink">{title}</span>
        {description ? (
          <span className="mt-1 block text-[0.8rem] text-ink-muted">{description}</span>
        ) : null}
      </span>
    </label>
  )
}
