'use client'

import type { ReactNode } from 'react'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { ThemeProvider } from './ThemeProvider'

/**
 * App-wide context only: language and theme. Everything visual lives in
 * SiteChrome, so /admin can share the tokens without the guest header.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LocaleProvider>
  )
}
