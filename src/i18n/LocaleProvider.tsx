'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEFAULT_LOCALE, LOCALES, type Locale, type Localized } from '@/types'
import { messages, type Messages } from './messages'

const STORAGE_KEY = 'vegan-garden.locale'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  /** Dot-path lookup into the message tree, e.g. t('nav.menu'). */
  t: (path: string, vars?: Record<string, string | number>) => string
  /** Same lookup, but for arrays / objects (slides, lists, …). */
  tx: <T>(path: string) => T
  /** Picks the active language out of a bilingual data field. */
  pick: <T>(value: Localized<T>) => T
  messages: Messages
  /** False until the stored preference has been read on the client. */
  ready: boolean
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as string[]).includes(value)
}

function lookup(tree: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((node, key) => {
    if (node && typeof node === 'object') return (node as Record<string, unknown>)[key]
    return undefined
  }, tree)
}

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match
  )
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [ready, setReady] = useState(false)

  // Restore the visitor's choice. Runs once, after hydration, so the server and
  // the first client render always agree on the default locale.
  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      stored = null
    }

    if (isLocale(stored)) {
      setLocaleState(stored)
    } else if (typeof navigator !== 'undefined') {
      // No stored choice: honour the browser for the two non-default languages
      // and leave everyone else on German, the language of the neighbourhood.
      const tag = navigator.language?.toLowerCase() ?? ''
      if (tag.startsWith('vi')) setLocaleState('vi')
      else if (tag.startsWith('en')) setLocaleState('en')
    }
    setReady(true)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* private mode - the choice simply does not persist */
    }
  }, [])

  const value = useMemo<LocaleContextValue>(() => {
    const active = messages[locale]

    const t = (path: string, vars?: Record<string, string | number>) => {
      const found = lookup(active, path) ?? lookup(messages[DEFAULT_LOCALE], path)
      if (typeof found === 'string') return interpolate(found, vars)
      if (typeof found === 'number') return String(found)
      if (process.env.NODE_ENV === 'development' && found === undefined) {
        console.warn(`[i18n] missing key: ${path}`)
      }
      return path
    }

    const tx = <T,>(path: string): T =>
      (lookup(active, path) ?? lookup(messages[DEFAULT_LOCALE], path)) as T

    const pick = <T,>(field: Localized<T>): T => field[locale] ?? field[DEFAULT_LOCALE]

    return { locale, setLocale, t, tx, pick, messages: active, ready }
  }, [locale, setLocale, ready])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>')
  return ctx
}

/** Convenience alias for components that only need the translate function. */
export function useT() {
  return useLocale().t
}
