/*
 * Deliberately minimal.
 *
 * The only thing this worker does is answer a *navigation* that failed because
 * the device is offline. Every other request is passed straight through - we
 * never call respondWith for them, so nothing is cached and the site can never
 * serve a stale page or a stale price.
 *
 * Its second job is simply to exist: Chrome requires a fetch handler before it
 * will offer "Add to Home Screen".
 */
const CACHE = 'vg-offline-v1'
const OFFLINE_URL = '/offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL, '/icons/icon-192.png']))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return

  event.respondWith(
    fetch(event.request).catch(() => caches.match(OFFLINE_URL, { ignoreSearch: true }))
  )
})
