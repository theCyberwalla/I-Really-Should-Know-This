async (page) => {
  const context = await page
    .context()
    .browser()
    .newContext({
      serviceWorkers: "block",
      viewport: { width: 1440, height: 1100 },
    });
  page = await context.newPage();
  const check = (ok, message) => {
    if (!ok) throw Error(message);
  };
  await page.goto("http://127.0.0.1:4173/#/");
  await page.reload();
  await page.locator("main h1").waitFor();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.getByRole("link", { name: "Explore the collection" }).click();
  await page.locator('.area-card[href="#/area/history"]').click();
  await page.locator('.topic-tile[href="#/topic/world-wars"]').click();
  await page.locator("#moment-versailles").focus();
  await page.keyboard.press("Enter");
  await page.locator("#open-versailles").waitFor();
  await page.locator("#open-versailles").focus();
  const before = await page.evaluate(() => ({
    y: scrollY,
    focus: document.activeElement.id,
  }));
  await page.keyboard.press("Enter");
  await page
    .getByRole("heading", {
      name: "Making a settlement is a separate task",
      exact: true,
    })
    .waitFor();
  await page
    .getByRole("link", { name: "Explore a later approach to peace" })
    .click();
  await page
    .getByRole("heading", {
      name: "Why start with coal and steel?",
      exact: true,
    })
    .waitFor();
  await page.goBack();
  await page
    .getByRole("heading", {
      name: "Making a settlement is a separate task",
      exact: true,
    })
    .waitFor();
  await page.goBack();
  await page.locator("#open-versailles").waitFor();
  await page.waitForFunction(
    () => document.activeElement.id === "open-versailles",
  );
  const after = await page.evaluate(() => ({
    y: scrollY,
    focus: document.activeElement.id,
    selection: location.hash,
  }));
  check(after.selection.includes("select=versailles"), "Back lost selection");
  check(Math.abs(after.y - before.y) < 3, "Back lost scroll");
  await page.screenshot({
    path: "output/playwright/world-wars-desktop.png",
    fullPage: true,
  });
  await page
    .getByText("Text version & scope of this visual", { exact: true })
    .click();
  check(
    (await page.locator(".text-equivalent").getAttribute("open")) !== null,
    "Text equivalent did not open",
  );
  await page.getByRole("link", { name: "Try an optional question" }).click();
  await page.getByRole("button", { name: "A little hint" }).click();
  await page.locator("#answer-0").click();
  await page.getByText("That connection fits.", { exact: true }).waitFor();
  await page.getByRole("link", { name: "My trail", exact: true }).click();
  await page
    .getByText("Practiced · assisted · correct", { exact: true })
    .first()
    .waitFor();
  check(
    await page
      .locator(".trail-stats")
      .innerText()
      .then((t) => t.includes("0\nSuccessful later checks")),
    "Assisted answer claimed retention",
  );
  await page.getByRole("link", { name: "Search the collection" }).click();
  await page.getByRole("searchbox").fill("1951");
  check(
    (await page.locator(".search-result").count()) > 0,
    "Search missing year",
  );
  await page.getByRole("searchbox").fill("not-an-existing-concept");
  await page
    .getByText("Nothing in this small collection matches yet.", {
      exact: false,
    })
    .waitFor();
  const routes = [
    "#/",
    "#/history",
    "#/topic/world-wars",
    "#/topic/presidents",
    "#/topic/europe",
    "#/concept/cooperation",
    "#/trail",
    "#/about",
  ];
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto("http://127.0.0.1:4173/" + route);
      await page.locator("main h1").waitFor();
      const layout = await page.evaluate(() => ({
        over: document.documentElement.scrollWidth > innerWidth + 1,
        duplicates: [...document.querySelectorAll("[id]")]
          .map((e) => e.id)
          .filter((id, i, a) => a.indexOf(id) !== i),
      }));
      check(!layout.over, "Horizontal overflow at " + width + " " + route);
      check(
        !layout.duplicates.length,
        "Duplicate IDs on " + route + ": " + layout.duplicates.join(","),
      );
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://127.0.0.1:4173/#/topic/europe?select=cooperation");
  await page.locator("#open-cooperation").waitFor();
  await page.screenshot({
    path: "output/playwright/europe-mobile.png",
    fullPage: true,
  });
  check(errors.length === 0, "Browser errors: " + errors.join(";"));
  await context.close();
  return {
    passed:
      "Navigation, keyboard selection, selected deep links, connected concept, Back focus and scroll, text equivalent, assisted practice, trail, search, 24 viewport/route checks",
    errors,
  };
};
