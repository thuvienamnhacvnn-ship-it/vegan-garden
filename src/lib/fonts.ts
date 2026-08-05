import { Cormorant_Garamond, Inter, Dancing_Script } from 'next/font/google'

/**
 * All three families ship the `vietnamese` subset, so Vietnamese diacritics and
 * German umlauts render from the same webfont - no fallback swap mid-sentence.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const inter = Inter({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const scriptHand = Dancing_Script({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500', '600'],
  variable: '--font-script-hand',
  display: 'swap',
})

export const fontVariables = `${cormorant.variable} ${inter.variable} ${scriptHand.variable}`
