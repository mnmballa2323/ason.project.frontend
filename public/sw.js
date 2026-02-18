// ============================================================
// Service Worker — Ason Verification Cockpit PWA
// Liberty Center One — Offline-Capable Cache
// ZERO EXTERNAL APIs. All assets cached locally.
// ============================================================

const CACHE_NAME = 'ason-cockpit-v2.0.0';
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
];

// --- Install: Pre-cache critical assets ---
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_URLS);
        })
    );
    self.skipWaiting();
});

// --- Activate: Clean old caches ---
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// --- Fetch: Network-first with cache fallback ---
self.addEventListener('fetch', (event) => {
    // Skip non-GET and API calls
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('/api/') || event.request.url.includes('/verify/') ||
        event.request.url.includes('/health/') || event.request.url.includes('/audit/') ||
        event.request.url.includes('/ws/')) {
        return; // Never cache API responses
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cache successful responses
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() => {
                // Offline: serve from cache
                return caches.match(event.request).then((cached) => {
                    return cached || new Response('Offline — cached version not available', {
                        status: 503,
                        headers: { 'Content-Type': 'text/plain' },
                    });
                });
            })
    );
});
