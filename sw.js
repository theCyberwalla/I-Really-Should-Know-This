importScripts("./offline-assets.js");
const CACHE = "curiosity-atlas-" + self.ATLAS_RELEASE;
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(self.ATLAS_ASSETS)),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("curiosity-atlas-") && key !== CACHE)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});
self.addEventListener("message", (event) => {
  if (event.data === "ACTIVATE_ATLAS_UPDATE") self.skipWaiting();
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url),
    scope = new URL(self.registration.scope);
  if (event.request.method !== "GET" || url.origin !== scope.origin) return;
  const pathname =
    url.pathname === scope.pathname
      ? scope.pathname + "index.html"
      : url.pathname;
  const allowed = self.ATLAS_ASSETS.some(
    (path) => new URL(path, scope).pathname === pathname,
  );
  if (!allowed) return;
  event.respondWith(
    caches
      .open(CACHE)
      .then(
        async (cache) =>
          (await cache.match(new URL(pathname, scope).href)) ??
          fetch(event.request),
      ),
  );
});
