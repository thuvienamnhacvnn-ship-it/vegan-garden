import de from '@/messages/de.json'
import vi from '@/messages/vi.json'

/**
 * Message lookup for route handlers, so API validation errors come back in the
 * visitor's language without pulling the React provider into the server bundle.
 */
export function serverTranslate(locale: string) {
  const tree = locale === 'vi' ? vi : de

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

export function localeFromBody(body: unknown): 'de' | 'vi' {
  if (body && typeof body === 'object' && (body as { locale?: string }).locale === 'vi') return 'vi'
  return 'de'
}
