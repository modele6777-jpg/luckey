// Fallback service worker for dev and static environments.
// In production builds, vite-plugin-pwa generates a full Workbox SW; this file
// keeps offline resilience (cached app shell + stale-while-revalidate assets)
// for environments where only the public/ static bundle is served.
const RUNTIME_CACHE = 'prism-fallback-runtime-v1';
const SHELL_CACHE = 'prism-fallback-shell-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith('prism-fallback-') && name !== RUNTIME_CACHE && name !== SHELL_CACHE)
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch (err) {
    const stale = await cache.match(request, { ignoreSearch: true, ignoreVary: true });
    if (stale) return stale;
    throw err;
  }
}

async function networkFirstDocument(request) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch (err) {
    // Offline: serve the last known document, then the cached app shell.
    const cachedDoc = await cache.match(request, { ignoreSearch: true, ignoreVary: true });
    if (cachedDoc) return cachedDoc;
    const shell =
      (await cache.match('/')) ||
      (await cache.match('/index.html')) ||
      (await caches.open(RUNTIME_CACHE).then((c) => c.match('/index.html')));
    if (shell) return shell;
    throw err;
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }
  if (url.origin !== self.location.origin) return;
  // Never intercept API / dynamic data requests
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/trpc/')) return;

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirstDocument(request).catch(() => Response.error()));
    return;
  }

  if (['script', 'style', 'image', 'font', 'worker'].includes(request.destination)) {
    event.respondWith(cacheFirst(request).catch(() => Response.error()));
  }
});
