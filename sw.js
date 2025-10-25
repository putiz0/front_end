// Service Worker para GlobalAfiliados
// Versão: 1.0.0

const CACHE_NAME = 'globalafiliados-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativar Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia de Cache: Network First, Fall back to Cache
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições não-GET
  if (request.method !== 'GET') {
    return;
  }

  // Para requisições de API, usar Network First
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache a resposta bem-sucedida
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then(c => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Se falhar, tentar cache
          return caches.match(request);
        })
    );
    return;
  }

  // Para assets estáticos, usar Cache First
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
            return response;
          });
      })
      .catch(() => {
        // Fallback para página offline (opcional)
        return new Response('Offline - Página não disponível', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      })
  );
});

// Background Sync (sincronização em background)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-products') {
    event.waitUntil(
      fetch('/api/products')
        .then(response => response.json())
        .then(data => {
          // Armazenar dados em IndexedDB ou localStorage
          localStorage.setItem('products', JSON.stringify(data));
        })
        .catch(err => console.log('Sync failed:', err))
    );
  }
});

// Push Notifications (notificações push)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação',
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%231565c0" width="192" height="192"/><text x="96" y="130" font-size="120" fill="white" text-anchor="middle" font-weight="bold">GA</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect fill="%231565c0" width="96" height="96"/><text x="48" y="65" font-size="60" fill="white" text-anchor="middle">GA</text></svg>',
    tag: 'globalafiliados-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('GlobalAfiliados', options)
  );
});

// Notificação click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
