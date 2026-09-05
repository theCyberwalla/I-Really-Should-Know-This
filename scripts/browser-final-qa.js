async (page) => {
  const context = await page
    .context()
    .browser()
    .newContext({ viewport: { width: 1440, height: 1100 } });
  const p = await context.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto("http://127.0.0.1:4173/#/");
  await p.locator("main h1").waitFor();
  await p.screenshot({
    path: "output/playwright/discover-desktop.png",
    fullPage: true,
  });
  await p.goto("http://127.0.0.1:4173/#/topic/presidents?select=term-limits");
  await p.locator(".institution-table").waitFor();
  await p.screenshot({
    path: "output/playwright/presidents-desktop.png",
    fullPage: true,
  });
  await p.goto("http://127.0.0.1:4173/#/topic/world-wars?select=versailles");
  await p.locator("#open-versailles").waitFor();
  await p.screenshot({
    path: "output/playwright/world-wars-desktop.png",
    fullPage: true,
  });
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto("http://127.0.0.1:4173/#/history");
  await p.locator(".area-atlas").waitFor();
  await p.screenshot({
    path: "output/playwright/history-mobile.png",
    fullPage: true,
  });
  await p.goto("http://127.0.0.1:4173/#/topic/europe?select=cooperation");
  await p.locator(".shift-pair").first().waitFor();
  await p.screenshot({
    path: "output/playwright/europe-mobile.png",
    fullPage: true,
  });
  await p.goto("http://127.0.0.1:4173/#/practice/armistice");
  await p.getByRole("button", { name: "A little hint" }).focus();
  await p.keyboard.press("Enter");
  await p.waitForFunction(() => document.activeElement.id === "answer-0");
  await p.getByRole("button", { name: "Show me the explanation" }).focus();
  await p.keyboard.press("Enter");
  await p.waitForFunction(() => document.activeElement.id === "feedback");
  await p.getByRole("link", { name: "My trail", exact: true }).click();
  await p.getByText("Assisted · answer shown", { exact: true }).waitFor();
  if (errors.length) throw Error(errors.join(";"));
  await context.close();
  return {
    finalScreenshots: 5,
    hintFocus: true,
    revealFocus: true,
    answerShownEvidence: true,
    errors,
  };
};
