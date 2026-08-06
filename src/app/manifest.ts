import type { MetadataRoute } from 'next'
import de from '@/messages/de.json'

/**
 * Installable-app metadata. German is the manifest language because that is
 * what the site server-renders; the in-app language switch is unaffected.
 *
 * `standalone` is what removes the browser chrome once a guest adds the site
 * to their home screen, which is the point of the whole mobile pass.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vegan Garden Berlin',
    short_name: 'Vegan Garden',
    description: de.meta.home.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    lang: 'de',
    dir: 'ltr',
    categories: ['food', 'lifestyle'],
    // Matches --c-band, so the status bar continues the hero instead of
    // cutting a white strip across the top of it.
    theme_color: '#132213',
    background_color: '#132213',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      { name: de.nav.menu, url: '/menu' },
      { name: de.nav.reservation, url: '/reservation' },
      { name: de.nav.order, url: '/order' },
    ],
  }
}
