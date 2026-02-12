const CACHE_NAME = 'artemis-v1';
const assets = [
  './',
  './index.html',
  'https://files.catbox.moe/5xh10y.mp4' // Cache the boot video
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
