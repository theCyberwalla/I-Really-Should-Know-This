// Service worker — precache app shell + assets for full offline use
const CACHE = 'moons-planets-v1';
const ASSETS = [
  "./",
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

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
