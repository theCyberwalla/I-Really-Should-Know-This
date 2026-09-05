async (page) => {
  const context = await page.context().browser().newContext(),
    p = await context.newPage();
  await p.goto("http://127.0.0.1:4174/#/about");
  await p.evaluate(() => navigator.serviceWorker.ready);
  await p.reload();
  await p.waitForFunction(() => !!navigator.serviceWorker.controller);
  const before = await p.evaluate(async () => {
    const { AtlasStore } = await import("/src/storage.js");
    const s = new AtlasStore();
    await s.init();
    await caches.open("countryguess-untouched");
    await caches.open("other-app-untouched");
    await caches.open("curiosity-atlas-stale-test");
    return { events: s.data.events.length, keys: await caches.keys() };
  });
  await context.setOffline(true);
  await p.reload();
  await p.locator("h1").waitFor();
  await p.goto("http://127.0.0.1:4174/#/topic/world-atlas");
  await p.locator("#country-select").waitFor();
  const offlineCountries = await p.locator("#country-select option").count();
  await p.goto("http://127.0.0.1:4174/#/practice/planet-earth");
  await p.locator("#recall-answer").fill("Earth");
  await p.locator("#recall-form button").click();
  await p.locator(".feedback").waitFor();
  await context.setOffline(false);
  await p.request.post("http://127.0.0.1:4174/advance");
  const upgrade = await p.evaluate(async () => {
    const r = await navigator.serviceWorker.getRegistration();
    return await new Promise(async (resolve, reject) => {
      const timer = setTimeout(
        () =>
          reject(
            Error(
              "Upgrade timeout: " +
                r.installing?.state +
                " / " +
                r.waiting?.state,
            ),
          ),
        10000,
      );
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        () => {
          clearTimeout(timer);
          resolve("activated");
        },
        { once: true },
      );
      function observe() {
        const w = r.installing;
        if (w)
          w.addEventListener("statechange", () => {
            if (w.state === "installed") w.postMessage("ACTIVATE_ATLAS_UPDATE");
          });
      }
      r.addEventListener("updatefound", observe);
      observe();
      await r.update();
      if (r.waiting) r.waiting.postMessage("ACTIVATE_ATLAS_UPDATE");
    });
  });
  await p.evaluate(async () => {
    for (let i = 0; i < 50; i++) {
      if (!(await caches.keys()).includes("curiosity-atlas-stale-test")) return;
      await new Promise((r) => setTimeout(r, 100));
    }
    throw Error("Old own cache survived activation");
  });
  const after = await p.evaluate(async () => {
    const { AtlasStore } = await import("/src/storage.js");
    const s = new AtlasStore();
    await s.init();
    return {
      keys: await caches.keys(),
      attempts: s.data.events.filter((e) => e.kind === "attempt").length,
    };
  });
  if (
    after.keys.includes("curiosity-atlas-stale-test") ||
    !after.keys.includes("countryguess-untouched") ||
    !after.keys.includes("other-app-untouched") ||
    after.attempts !== 1 ||
    offlineCountries !== 194
  )
    throw Error("Offline assertion failed: " + JSON.stringify(after));
  await context.close();
  return { offlineCountries, before, after };
};
