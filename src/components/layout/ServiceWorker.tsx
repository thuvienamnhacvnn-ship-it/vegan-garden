'use client'

import { useEffect } from 'react'

/**
 * Registers /sw.js after the page has settled.
 *
 * Registration waits for `load` so it never competes with the hero image for
 * bandwidth, and it is skipped in development, where an active worker only
 * gets in the way of hot reloading.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* offline support is a bonus - never surface this to a guest */
      })
    }

    if (document.readyState === 'complete') register()
    else window.addEventListener('load', register, { once: true })

    return () => window.removeEventListener('load', register)
  }, [])

  return null
}
