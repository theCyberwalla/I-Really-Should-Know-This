// Retire only this app's old worker and caches. Never touch another app's caches.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys())
        if (key.startsWith("moons-planets-")) await caches.delete(key);
      await self.registration.unregister();
      await self.clients.claim();
    })(),
  ),
);
// No offline response substitution. Requests go to the network unchanged.
