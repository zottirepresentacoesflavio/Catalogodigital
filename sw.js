const CACHE = 'zotti-v1';
const ARQUIVOS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instala e cacheia tudo
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ARQUIVOS))
  );
  self.skipWaiting();
});

// Limpa caches antigos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Serve do cache primeiro, tenta rede se não encontrar
// Se tiver rede, atualiza o cache em segundo plano (stale-while-revalidate)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request);
      const fetchPromise = fetch(e.request)
        .then(resp => {
          if (resp && resp.status === 200)
            cache.put(e.request, resp.clone());
          return resp;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
