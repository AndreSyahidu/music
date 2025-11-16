/**
 * MBD MUSIC PLAYER PRO v4.0
 * Service Worker for PWA Support
 * - Offline Mode
 * - Cache Management
 * - Background Sync
 */

const CACHE_VERSION = 'mbd-music-v4.0.0';
const CACHE_STATIC = 'mbd-static-v4';
const CACHE_DYNAMIC = 'mbd-dynamic-v4';
const CACHE_AUDIO = 'mbd-audio-v4';

// Files to cache immediately on install
const STATIC_ASSETS = [
    '/player/',
    '/player/index.php',
    '/player/style.css',
    '/player/script.js',
    '/player/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('[SW] Installing Service Worker...', CACHE_VERSION);

    event.waitUntil(
        caches.open(CACHE_STATIC)
            .then(cache => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {
                    cache: 'no-cache'
                })));
            })
            .then(() => self.skipWaiting())
            .catch(err => console.error('[SW] Cache install failed:', err))
    );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    console.log('[SW] Activating Service Worker...', CACHE_VERSION);

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_STATIC &&
                            cacheName !== CACHE_DYNAMIC &&
                            cacheName !== CACHE_AUDIO) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip chrome-extension and non-http requests
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return;
    }

    // Audio files - cache with special strategy
    if (request.url.match(/\.(mp3|wav|ogg|m4a|flac)$/i)) {
        event.respondWith(cacheFirstAudio(request));
        return;
    }

    // Static assets - cache first
    if (STATIC_ASSETS.includes(url.pathname) ||
        url.hostname === 'cdnjs.cloudflare.com' ||
        url.hostname === 'fonts.googleapis.com' ||
        url.hostname === 'fonts.gstatic.com') {
        event.respondWith(cacheFirst(request));
        return;
    }

    // API/PHP requests - network first
    if (request.url.includes('playlist.json') || request.url.includes('.php')) {
        event.respondWith(networkFirst(request));
        return;
    }

    // Default - network first with cache fallback
    event.respondWith(networkFirst(request));
});

// Cache First Strategy (for static assets)
async function cacheFirst(request) {
    try {
        const cached = await caches.match(request);
        if (cached) {
            console.log('[SW] Cache hit:', request.url);
            return cached;
        }

        const response = await fetch(request);

        if (response && response.status === 200) {
            const cache = await caches.open(CACHE_STATIC);
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.error('[SW] Cache first failed:', error);
        return new Response('Offline - Asset not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network First Strategy (for dynamic content)
async function networkFirst(request) {
    try {
        const response = await fetch(request);

        if (response && response.status === 200) {
            const cache = await caches.open(CACHE_DYNAMIC);
            cache.put(request, response.clone());
        }

        return response;
    } catch (error) {
        console.log('[SW] Network failed, trying cache:', request.url);
        const cached = await caches.match(request);

        if (cached) {
            return cached;
        }

        return new Response('Offline - No cached version', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Cache First for Audio (with size limit)
async function cacheFirstAudio(request) {
    try {
        const cached = await caches.match(request);
        if (cached) {
            console.log('[SW] Audio cache hit:', request.url);
            return cached;
        }

        const response = await fetch(request);

        if (response && response.status === 200) {
            // Only cache audio files smaller than 50MB
            const contentLength = response.headers.get('content-length');
            if (contentLength && parseInt(contentLength) < 50 * 1024 * 1024) {
                const cache = await caches.open(CACHE_AUDIO);
                cache.put(request, response.clone());
                console.log('[SW] Audio cached:', request.url);
            } else {
                console.log('[SW] Audio too large to cache:', request.url);
            }
        }

        return response;
    } catch (error) {
        console.error('[SW] Audio fetch failed:', error);
        const cached = await caches.match(request);
        return cached || new Response('Audio offline', { status: 503 });
    }
}

// Background Sync for analytics/stats
self.addEventListener('sync', event => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'sync-stats') {
        event.waitUntil(syncStats());
    }
});

async function syncStats() {
    try {
        // Sync listening stats when back online
        console.log('[SW] Syncing stats...');
        // Implementation would go here
        return Promise.resolve();
    } catch (error) {
        console.error('[SW] Sync failed:', error);
        return Promise.reject(error);
    }
}

// Message handler for cache management
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                );
            })
        );
    }

    if (event.data && event.data.type === 'CACHE_AUDIO') {
        const audioUrl = event.data.url;
        event.waitUntil(
            caches.open(CACHE_AUDIO).then(cache => {
                return cache.add(audioUrl);
            })
        );
    }
});

console.log('[SW] Service Worker loaded successfully');
