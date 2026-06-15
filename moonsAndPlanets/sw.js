// Service worker — precache app shell + assets for full offline use
const CACHE = 'moons-planets-v4';
const ASSETS = [
  "./index.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./js/data.js",
  "./js/store.js",
  "./js/explore.js",
  "./js/games/flashcards.js",
  "./js/games/quiz.js",
  "./js/games/match.js",
  "./js/games/mnemonic.js",
  "./js/progress.js",
  "./js/app.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-512.png",
  "./assets/img/amalthea.svg",
  "./assets/img/ariel.svg",
  "./assets/img/callisto.svg",
  "./assets/img/charon.svg",
  "./assets/img/deimos.svg",
  "./assets/img/earth.svg",
  "./assets/img/enceladus.svg",
  "./assets/img/europa.svg",
  "./assets/img/ganymede.svg",
  "./assets/img/hydra.svg",
  "./assets/img/hyperion.svg",
  "./assets/img/iapetus.svg",
  "./assets/img/io.svg",
  "./assets/img/jupiter.svg",
  "./assets/img/kerberos.svg",
  "./assets/img/mars.svg",
  "./assets/img/mercury.svg",
  "./assets/img/mimas.svg",
  "./assets/img/miranda.svg",
  "./assets/img/moon.svg",
  "./assets/img/neptune.svg",
  "./assets/img/nereid.svg",
  "./assets/img/nix.svg",
  "./assets/img/oberon.svg",
  "./assets/img/phobos.svg",
  "./assets/img/phoebe.svg",
  "./assets/img/pluto.svg",
  "./assets/img/proteus.svg",
  "./assets/img/rhea.svg",
  "./assets/img/saturn.svg",
  "./assets/img/styx.svg",
  "./assets/img/titan.svg",
  "./assets/img/titania.svg",
  "./assets/img/triton.svg",
  "./assets/img/umbriel.svg",
  "./assets/img/uranus.svg",
  "./assets/img/venus.svg"
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Safari/Chrome refuse to serve a *redirected* response to a page navigation
// from a service worker. Rebuild any redirected response as a plain one.
async function noRedirect(response) {
  if (!response || !response.redirected) return response;
  const body = await response.clone().arrayBuffer();
  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Page navigations: always serve the clean app shell, never a redirected response.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const shell = await caches.match('./index.html');
      if (shell) return noRedirect(shell);
      try { return await noRedirect(await fetch(req)); }
      catch { return (await caches.match('./index.html')) || Response.error(); }
    })());
    return;
  }

  // Other GETs: cache-first, then network (and cache the result).
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
