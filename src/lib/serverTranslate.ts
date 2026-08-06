import de from '@/messages/de.json'
import en from '@/messages/en.json'
import vi from '@/messages/vi.json'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/types'

/**
 * Message lookup for route handlers, so API validation errors come back in the
 * visitor's language without pulling the React provider into the server bundle.
 */
const trees: Record<Locale, unknown> = { de, en, vi }

export function serverTranslate(locale: string) {
  const tree = trees[locale as Locale] ?? de

  return (path: string, vars?: Record<string, string | number>) => {
    const value = path.split('.').reduce<unknown>((node, key) => {
      if (node && typeof node === 'object') return (node as Record<string, unknown>)[key]
      return undefined
    }, tree)

    if (typeof value !== 'string') return path
    return vars
      ? value.replace(/\{(\w+)\}/g, (match, key: string) =>
          key in vars ? String(vars[key]) : match
        )
      : value
  }
}

export function localeFromBody(body: unknown): Locale {
  const sent = (body as { locale?: string } | null)?.locale
  return LOCALES.includes(sent as Locale) ? (sent as Locale) : DEFAULT_LOCALE
}
