async (page) => {
  const browser = page.context().browser();
  const context = await browser.newContext({ serviceWorkers: "block" });
  const p = await context.newPage();
  await p.addInitScript(() => {
    localStorage.setItem("irstk_v2", '{"xp":42,"unknown":"preserved"}');
    localStorage.setItem("moons_planets_state_v1", "malformed{");
    localStorage.setItem("cg.user.alice", '{"notes":"private note"}');
    localStorage.setItem("other-app", "keep");
  });
  await p.goto("http://127.0.0.1:4173/#/about");
  await p.getByRole("heading", { name: "Your data stays yours." }).waitFor();
  const result = await p.evaluate(async () => {
    const { AtlasStore, empty } = await import("/src/storage.js");
    const { makeEvent } = await import("/src/learning.js");
    const check = (ok, message) => {
      if (!ok) throw Error(message);
    };
    const a = await new AtlasStore().init(),
      b = await new AtlasStore().init();
    check(
      a.data.legacy.length === 3,
      "Legacy migration did not capture all sources",
    );
    check(
      localStorage.getItem("irstk_v2") === '{"xp":42,"unknown":"preserved"}',
      "Legacy key changed",
    );
    check(
      localStorage.getItem("moons_planets_state_v1") === "malformed{",
      "Malformed legacy lost",
    );
    check(localStorage.getItem("other-app") === "keep", "Other app modified");
    await a.init();
    check(a.data.legacy.length === 3, "Repeat migration duplicated snapshots");
    const first = makeEvent("opened", "crisis"),
      second = makeEvent("saved", "berlin");
    await Promise.all([a.add(first), b.add(second)]);
    await a.refresh();
    await b.refresh();
    check(
      a.data.events.some((e) => e.id === second.id) &&
        b.data.events.some((e) => e.id === first.id),
      "Concurrent write lost an event",
    );
    const backup = a.backup();
    const profile = await a.importBackup(backup);
    const count = a.data.events.length;
    await a.importBackup(backup);
    check(a.data.events.length === count, "Duplicate import duplicated events");
    check(profile !== "local", "Default import merged identities");
    const conflict = empty();
    conflict.profiles.push({ id: "must-rollback", name: "Rolled back" });
    conflict.events = [{ ...first, kind: "saved" }];
    let rejected = false;
    try {
      await a.importBackup(conflict, true);
    } catch {
      rejected = true;
    }
    check(rejected, "Conflicting event accepted");
    await a.refresh();
    check(
      !a.data.profiles.some((p) => p.id === "must-rollback"),
      "Atomic import left partial profile",
    );
    check(
      a.data.events.find((e) => e.id === first.id).kind === "opened",
      "Conflict overwrote immutable event",
    );
    const original = a.transaction.bind(a);
    a.transaction = async () => {
      throw new DOMException("Quota", "QuotaExceededError");
    };
    const failed = makeEvent("opened", "revolution");
    check((await a.add(failed)) === false, "Failed save reported success");
    check(
      a.backup().events.some((e) => e.id === failed.id),
      "Unsaved event not exportable",
    );
    a.transaction = original;
    check(await a.retry(), "Retry did not commit pending record");
    await b.refresh();
    check(
      b.data.events.some((e) => e.id === failed.id),
      "Retry not durable",
    );
    a.channel?.close();
    b.channel?.close();
    a.db.close();
    b.db.close();
    return {
      legacySnapshots: 3,
      concurrentWrites: true,
      idempotentImport: true,
      atomicRollback: true,
      quotaFailureRecovery: true,
    };
  });
  await p.reload();
  await p.getByRole("heading", { name: "Your data stays yours." }).waitFor();
  const downloadPromise = p.waitForEvent("download");
  await p.getByRole("button", { name: "Download local backup" }).click();
  const download = await downloadPromise;
  await download.saveAs("output/playwright/qa-backup.json");
  await p
    .locator("#import-file")
    .setInputFiles("output/playwright/qa-backup.json");
  await p.getByRole("heading", { name: "Ready to review" }).waitFor();
  await p.getByRole("button", { name: "Import this backup" }).click();
  await p
    .getByRole("heading", { name: "Little steps, honestly recorded." })
    .waitFor();
  await context.close();
  const denied = await browser.newContext({ serviceWorkers: "block" });
  await denied.addInitScript(() => {
    Object.defineProperty(window, "indexedDB", {
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    });
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    });
  });
  const d = await denied.newPage();
  await d.goto("http://127.0.0.1:4173/#/history");
  await d.getByRole("heading", { name: "How did we get here?" }).waitFor();
  const warning = await d.locator("#storage-status").innerText();
  if (!warning.includes("attention") && !warning.includes("Temporary"))
    throw Error("Storage denial not visible");
  await denied.close();
  return { ...result, uiExportImport: true, deniedStorageExploration: true };
};
