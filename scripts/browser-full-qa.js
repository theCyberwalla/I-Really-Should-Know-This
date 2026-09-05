async (page) => {
  const context = await page
      .context()
      .browser()
      .newContext({
        serviceWorkers: "block",
        viewport: { width: 1440, height: 1000 },
      }),
    p = await context.newPage(),
    errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto("http://127.0.0.1:4173/");
  await p.waitForSelector(".area-grid");
  const catalog = await p.evaluate(async () => {
    const c = await import("/src/content.js");
    return {
      areas: c.areas,
      topics: c.topics.map((t) => ({ id: t.id, items: t.items })),
      concepts: c.concepts.map((c) => c.id),
      prompts: c.prompts.map((p) => ({
        id: p.id,
        concept: p.concept,
        method: p.method,
        answer: p.answer,
        accepted: p.accepted,
      })),
    };
  });
  const checks = [];
  for (const width of [1440, 390, 320]) {
    await p.setViewportSize({ width, height: 1000 });
    for (const route of [
      "#/",
      "#/catalog",
      ...catalog.areas.map((a) => "#/area/" + a.id),
      ...catalog.topics.map((t) => "#/topic/" + t.id),
      "#/trail",
      "#/about",
      "#/search",
    ]) {
      await p.goto("http://127.0.0.1:4173/" + route);
      await p.waitForTimeout(30);
      const state = await p.evaluate(() => ({
        h1: document.querySelector("h1")?.textContent,
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        duplicate: [...document.querySelectorAll("[id]")]
          .map((n) => n.id)
          .filter((v, i, a) => a.indexOf(v) !== i),
      }));
      if (!state.h1 || state.overflow || state.duplicate.length)
        checks.push({ width, route, ...state });
    }
  }
  await p.setViewportSize({ width: 1440, height: 1000 });
  for (const id of catalog.concepts) {
    await p.goto("http://127.0.0.1:4173/#/concept/" + id);
    await p.waitForTimeout(10);
    if (!(await p.locator("article").count()))
      checks.push({ missingConcept: id });
  }
  await p.goto("http://127.0.0.1:4173/#/topic/presidents");
  if ((await p.locator("[data-president]").count()) !== 47)
    checks.push("presidency count");
  await p.screenshot({
    path: "output/playwright/full-presidents.png",
    fullPage: true,
  });
  await p.goto("http://127.0.0.1:4173/#/topic/world-atlas");
  await p.screenshot({
    path: "output/playwright/full-geography.png",
    fullPage: true,
  });
  await p.locator("#map-region").selectOption("Europe");
  await p.locator("#country-find").fill("Monaco");
  await p.locator("#country-search-form button").click();
  if ((await p.locator("#country-select option").count()) !== 2)
    checks.push("country search");
  await p.locator("#country-select").selectOption("MCO");
  if (
    !(await p
      .locator(".selected-panel h2")
      .textContent()
      .then((x) => x === "Monaco"))
  )
    checks.push("Monaco drillthrough");
  await p.goto("http://127.0.0.1:4173/#/practice/planet-venus");
  await p.locator("#recall-answer").fill(" Venus! ");
  await p.locator("#recall-form button").click();
  await p.locator(".feedback").waitFor();
  if (
    !(await p
      .locator("#feedback")
      .textContent()
      .then((x) => x.includes("fits")))
  )
    checks.push("recall");
  await p.goto("http://127.0.0.1:4173/#/practice/country-bra");
  await p.locator('[data-map-answer="BRA"]').first().press("Enter");
  await p.locator(".feedback").waitFor();
  if (
    !(await p
      .locator("#feedback")
      .textContent()
      .then((x) => x.includes("fits")))
  )
    checks.push("map keyboard");
  await p.goto("http://127.0.0.1:4173/#/map-round");
  for (let i = 0; i < 5; i++) {
    await p.locator('[data-action="reveal"]').click();
    await p.locator('[data-action="round-next"]').click();
  }
  if (
    !(await p
      .locator("h1")
      .textContent()
      .then((x) => x.includes("Keep the map")))
  )
    checks.push("round completion");
  for (const id of [
    "growth",
    "energy",
    "percentages",
    "prices",
    "solar-system",
    "moon-worlds",
    "sky-patterns",
  ]) {
    await p.goto("http://127.0.0.1:4173/#/topic/" + id);
    await p.screenshot({
      path: "output/playwright/model-" + id + ".png",
      fullPage: true,
    });
  }
  await context.close();
  return {
    routes: catalog.topics.length,
    concepts: catalog.concepts.length,
    widths: 3,
    errors,
    checks,
  };
};
