import de from '@/messages/de.json'
import vi from '@/messages/vi.json'
import type { Locale } from '@/types'

/**
 * German is the reference language: its shape defines the translation contract,
 * so a missing key in vi.json becomes a TypeScript error rather than a blank
 * string on the page.
 */
export type Messages = typeof de

export const messages: Record<Locale, Messages> = {
  de,
  vi: vi as Messages,
}
