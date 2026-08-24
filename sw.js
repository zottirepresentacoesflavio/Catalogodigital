const CACHE_NAME = 'catalogo-v2';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './BANG TOYS - ESPECIAL DIA DAS CRIANÇAS.pdf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
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
