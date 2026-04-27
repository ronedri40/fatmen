// Minimal cache-first service worker for Fat Man. Precaches the app shell on
// install; serves from cache when offline; falls through to network for
// everything else and updates the cache opportunistically.
const VERSION = 'fatman-v1'
const SHELL = ['/', '/index.html', '/icon.svg', '/manifest.webmanifest']

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return

  // Network-first for HTML so they always get the latest UI when online
  if (req.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone()
          caches.open(VERSION).then(c => c.put(req, copy))
          return res
        })
        .catch(() => caches.match(req).then(r => r || caches.match('/')))
    )
    return
  }

  // Cache-first for everything else (assets)
  e.respondWith(
    caches.match(req).then(cached => {
      const fresh = fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone()
          caches.open(VERSION).then(c => c.put(req, copy))
        }
        return res
      }).catch(() => cached)
      return cached || fresh
    })
  )
})
