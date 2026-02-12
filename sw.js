const CACHE_NAME = 'olympus-v1';

// The "High Sugar" Asset List
// Includes the Core OS, the Nexus Hub, styling, and the boot video.
const assets = [
  '/',
  '/index.html',
  '/nexus.html',       // The App Store
  '/style.css',        // (If you separate CSS later)
  '/script.js',        // (If you separate JS later)
  '/manifest.json',    // The App Identity
  '/assets/boot-video.mp4', // Local video
  'https://files.catbox.moe/5xh10y.mp4' // External fallback video
];

// 1. INSTALL: Cache everything immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[OLYMPUS] Caching Core Assets');
      return cache.addAll(assets);
    })
  );
});

// 2. FETCH: The "Stale-While-Revalidate" Strategy
// This serves the cached version INSTANTLY (fast), but checks the network
// in the background to see if you updated the code.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if found, otherwise fetch from network
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update the cache with the new version for next time
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });

      // Return cached response immediately, or wait for network if cache is empty
      return cachedResponse || fetchPromise;
    })
  );
});

// 3. ACTIVATE: Clean up old caches (Good for when you release v2)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => {
          return name !== CACHE_NAME;
        }).map((name) => {
          return caches.delete(name);
        })
      );
    })
  );
});

