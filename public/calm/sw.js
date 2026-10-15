const CACHE_NAME = 'calm-pwa-v34';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 네트워크 우선 전략 (Network First): 최신 변경사항을 항상 먼저 받아오고 오프라인일 때만 캐시 사용
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    return; // API 요청은 Service Worker 캐시를 거치지 않고 직접 네트워크 통신
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
