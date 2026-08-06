import type { Metadata, Viewport } from 'next'
import './globals.css'
import { fontVariables } from '@/lib/fonts'
import { Providers } from '@/components/layout/Providers'
import { pageMetadata, restaurantJsonLd } from '@/lib/seo'
import { siteUrl } from '@/data/site'
import { themeInitScript } from '@/components/layout/ThemeProvider'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...pageMetadata('home', '/'),
  applicationName: 'Vegan Garden Berlin',
  authors: [{ name: 'Vegan Garden Berlin' }],
  creator: 'Vegan Garden Berlin',
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/logo/vegan-garden-mark.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  // Lets iOS run the site full-screen once it is added to the home screen.
  appleWebApp: {
    capable: true,
    title: 'Vegan Garden',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Matches the two page surfaces so the browser chrome follows the theme.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6efe4' },
    { media: '(prefers-color-scheme: dark)', color: '#15100c' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" data-theme="light" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Applies the stored day/night choice before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          // JSON-LD is generated from our own data, never from user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd()) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
