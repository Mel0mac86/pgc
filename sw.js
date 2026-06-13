/* Service worker — Macro AI (versione single-file)
   Mette in cache la pagina: icona e manifest sono incorporati nell'HTML,
   quindi l'app funziona completamente offline. */
const CACHE = 'macroai-offline-v1';
const ASSETS = ['./', './index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
      if (r && r.status === 200 && e.request.url.startsWith(self.location.origin)) {
        const cp = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, cp));
      }
      return r;
    }).catch(() => caches.match('./index.html')))
  );
});
