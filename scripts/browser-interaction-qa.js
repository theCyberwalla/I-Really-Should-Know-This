async (page) => {
  const context = await page
      .context()
      .browser()
      .newContext({
        viewport: { width: 390, height: 844 },
        serviceWorkers: "block",
      }),
    p = await context.newPage(),
    checks = [];
  p.on("pageerror", (e) => checks.push(e.message));
  await p.goto("http://127.0.0.1:4173/#/topic/growth");
  await p.locator("#growth-rate").fill("10");
  if (
    !(await p
      .locator("#growth-chart")
      .textContent()
      .then((x) => x.includes("6,727")))
  )
    checks.push("growth arithmetic");
  await p.goto("http://127.0.0.1:4173/#/topic/energy");
  await p.locator("#efficiency-value").fill("85");
  if ((await p.locator("#other-bar").textContent()) !== "15 J")
    checks.push("energy conservation");
  await p.goto("http://127.0.0.1:4173/#/topic/percentages");
  await p.locator("#percent-rate").fill("20");
  if (
    !(await p
      .locator("#percent-model")
      .textContent()
      .then((x) => x.includes("100%")))
  )
    checks.push("percent ratio");
  await p.goto("http://127.0.0.1:4173/#/topic/prices");
  await p.locator("#demand-shift").fill("20");
  if (
    !(await p
      .locator("#market-chart")
      .textContent()
      .then((x) => x.includes("60")))
  )
    checks.push("market");
  await p.goto("http://127.0.0.1:4173/#/topic/solar-system");
  await p.locator("#orbit-scale").selectOption("size");
  const ratios = await p.evaluate(() => {
    const sizes = [...document.querySelectorAll(".planet-size")].map(
      (n) => n.getBoundingClientRect().width,
    );
    return { jupiter: sizes[4], earth: sizes[2], ratio: sizes[4] / sizes[2] };
  });
  if (Math.abs(ratios.ratio - 142984 / 12756) > 0.15)
    checks.push({ sizeScale: ratios });
  await p.screenshot({
    path: "output/playwright/solar-size-mobile.png",
    fullPage: true,
  });
  await p.goto("http://127.0.0.1:4173/#/topic/sky-patterns");
  await p.locator("#sky-mode").selectOption("seasons");
  await p.locator("#sky-position").fill("1");
  if (
    !(await p
      .locator("#sky-model")
      .textContent()
      .then((x) => x.includes("North toward Sun")))
  )
    checks.push("seasons");
  await p.screenshot({
    path: "output/playwright/seasons-mobile.png",
    fullPage: true,
  });
  await p.goto("http://127.0.0.1:4173/#/practice/country-mco");
  await p.locator('[data-action="map-zoom"]').click();
  const marker = p.locator('circle[data-map-answer="MCO"]').first();
  await marker.click();
  await p.locator(".feedback").waitFor();
  await p.goto("http://127.0.0.1:4173/#/trail");
  if (
    !(await p
      .locator("main")
      .textContent()
      .then((x) => x.includes("Practiced · assisted")))
  )
    checks.push("small locator assistance");
  await p.goto("http://127.0.0.1:4173/#/practice/country-wsm");
  const visible = await p
    .locator('[data-map-answer="WSM"]')
    .evaluateAll((nodes) =>
      nodes.some((n) => {
        const r = n.getBoundingClientRect(),
          svg = n.ownerSVGElement.getBoundingClientRect();
        return (
          r.right > svg.left &&
          r.left < svg.right &&
          r.bottom > svg.top &&
          r.top < svg.bottom
        );
      }),
    );
  if (!visible) checks.push("Samoa date-line visibility");
  await p.screenshot({
    path: "output/playwright/oceania-practice-mobile.png",
    fullPage: true,
  });
  await p.goto("http://127.0.0.1:4173/#/topic/presidents");
  await p.locator("#president-era").selectOption("founding");
  if (
    !(await p
      .locator(".president-context h2")
      .textContent()
      .then((x) => x === "George Washington"))
  )
    checks.push("era selection");
  await p.locator("#term-10").click();
  const scroll = await p
    .locator(".president-list")
    .evaluate((n) => n.scrollTop);
  await p.locator(".president-context .button").click();
  await p.goBack();
  await p.locator("#term-10").waitFor();
  const scroll2 = await p
    .locator(".president-list")
    .evaluate((n) => n.scrollTop);
  if (Math.abs(scroll - scroll2) > 2)
    checks.push({ presidencyScroll: scroll, restored: scroll2 });
  await p.goto("http://127.0.0.1:4173/#/practice/presidency-1");
  await p.locator("#recall-answer").fill("washington");
  await p.locator("#recall-form button").click();
  await p.locator(".feedback").waitFor();
  if (
    !(await p
      .locator("#feedback")
      .textContent()
      .then((x) => x.includes("fits")))
  )
    checks.push("presidency recall");
  await p.goto("http://127.0.0.1:4173/#/concept/planet-earth");
  await p.locator('[data-select="planet-mars"]').click();
  if (!p.url().includes("/topic/solar-system?select=planet-mars"))
    checks.push("concept visual navigation");
  await p.goto("http://127.0.0.1:4173/");
  await p.screenshot({
    path: "output/playwright/full-discover-mobile.png",
    fullPage: true,
  });
  await p.setViewportSize({ width: 1440, height: 1000 });
  await p.screenshot({
    path: "output/playwright/full-discover-desktop.png",
    fullPage: true,
  });
  await context.close();
  return { checks, ratios };
};
