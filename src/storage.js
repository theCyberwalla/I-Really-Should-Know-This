import { validateEvent } from "./learning.js";
export const MAX_BYTES = 5 * 1024 * 1024;
export const empty = () => ({
  format: "curiosity-atlas",
  version: 1,
  profiles: [{ id: "local", name: "This device" }],
  events: [],
  legacy: [],
});
const object = (x) => x !== null && typeof x === "object" && !Array.isArray(x);
export function validateBackup(data) {
  if (
    !object(data) ||
    data.format !== "curiosity-atlas" ||
    data.version !== 1 ||
    !Array.isArray(data.events) ||
    !Array.isArray(data.profiles) ||
    !Array.isArray(data.legacy) ||
    !data.profiles.length
  )
    throw Error("Use a version 1 Curiosity Atlas backup. Nothing has changed.");
  if (JSON.stringify(data).length > MAX_BYTES)
    throw Error("This backup exceeds the 5 MB import limit.");
  const profiles = new Set();
  for (const p of data.profiles) {
    if (
      !object(p) ||
      typeof p.id !== "string" ||
      !p.id ||
      p.id.length > 180 ||
      profiles.has(p.id) ||
      typeof p.name !== "string" ||
      p.name.length > 100
    )
      throw Error("Invalid or duplicate profile.");
    profiles.add(p.id);
  }
  const ids = new Map();
  for (const e of data.events) {
    validateEvent(e);
    if (!profiles.has(e.profileId)) throw Error("An event has no profile.");
    if (ids.has(e.id) && JSON.stringify(ids.get(e.id)) !== JSON.stringify(e))
      throw Error("Conflicting event IDs.");
    ids.set(e.id, e);
  }
  const legacyIds = new Set();
  for (const l of data.legacy) {
    if (
      !object(l) ||
      typeof l.id !== "string" ||
      legacyIds.has(l.id) ||
      typeof l.key !== "string" ||
      typeof l.raw !== "string" ||
      typeof l.origin !== "string" ||
      !Number.isFinite(l.capturedAt)
    )
      throw Error("Invalid legacy snapshot.");
    legacyIds.add(l.id);
  }
  return structuredClone({ ...data, events: [...ids.values()] });
}
export function parseBackup(text) {
  if (new TextEncoder().encode(text).length > MAX_BYTES)
    throw Error("Backup too large (maximum 5 MB).");
  let d;
  try {
    d = JSON.parse(text);
  } catch {
    throw Error("This file is not valid JSON. Nothing has changed.");
  }
  return validateBackup(d);
}
export async function fingerprint(text) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return [...new Uint8Array(bytes)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
export async function legacySnapshots(storage, origin, now = Date.now()) {
  const keys = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (
      [
        "irstk_v2",
        "moons_planets_state_v1",
        "cg.users",
        "cg.v1",
        "cg.study.notes",
      ].includes(key) ||
      /^cg\.user\./.test(key) ||
      /^cg\..*notes/.test(key)
    )
      keys.push(key);
  }
  const records = [];
  for (const key of keys) {
    const raw = storage.getItem(key);
    if (raw === null) continue;
    if (raw.length > MAX_BYTES)
      throw Error(
        "A legacy record exceeds 5 MB. Its original is untouched; export it from the old app.",
      );
    records.push({
      id: await fingerprint(origin + "\n" + key + "\n" + raw),
      key,
      raw,
      origin,
      capturedAt: now,
    });
  }
  return records;
}
const request = (r) =>
  new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
export class AtlasStore {
  constructor() {
    this.db = null;
    this.data = empty();
    this.pending = [];
    this.temporary = false;
    this.message = "";
    this.onchange = () => {};
    try {
      this.channel = new BroadcastChannel("curiosity-atlas-v1");
      this.channel.onmessage = () =>
        this.refresh()
          .then(() => this.onchange())
          .catch(() => {
            this.message =
              "Changes from another tab could not be read. Reload to refresh your trail.";
            this.onchange();
          });
    } catch {}
  }
  broadcast() {
    try {
      this.channel?.postMessage("changed");
    } catch {}
  }
  async init(factory, legacy) {
    try {
      factory ??= globalThis.indexedDB;
      if (!factory) throw Error("Storage unavailable");
      const r = factory.open("curiosity-atlas", 1);
      r.onupgradeneeded = () => {
        r.result.createObjectStore("records", { keyPath: "key" });
      };
      this.db = await Promise.race([
        request(r),
        new Promise((_, reject) =>
          setTimeout(() => reject(Error("Storage did not open")), 2500),
        ),
      ]);
      this.db.onversionchange = () => {
        this.db.close();
        this.fail(
          "Another version opened this database. Reload to save again.",
        );
      };
      await this.transaction(
        [{ key: "profile:local", value: { id: "local", name: "This device" } }],
        true,
      );
      await this.refresh();
    } catch {
      this.fail(
        "Temporary session: progress cannot be saved in this browser. You can still explore and export a backup.",
      );
    }
    try {
      const snapshots = await legacySnapshots(
        legacy ?? globalThis.localStorage,
        globalThis.location?.origin ?? "test",
      );
      if (snapshots.length)
        await this.commit(
          snapshots.map((s) => ({ key: "legacy:" + s.id, value: s })),
          true,
        );
    } catch (e) {
      this.message =
        (this.temporary ? "Temporary session. " : "") +
        "Legacy preservation needs attention: " +
        e.message;
    }
    return this;
  }
  fail(message) {
    this.temporary = true;
    this.message = message;
    this.onchange();
  }
  async transaction(records, keepExisting = false) {
    if (!this.db) throw Error("Storage unavailable");
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction("records", "readwrite");
      const store = tx.objectStore("records");
      let failure;
      for (const r of records) {
        const get = store.get(r.key);
        get.onsuccess = () => {
          const old = get.result;
          if (old) {
            if (keepExisting) return;
            if (JSON.stringify(old.value) !== JSON.stringify(r.value)) {
              failure = Error(
                "Conflicting saved record. Import was cancelled.",
              );
              tx.abort();
            }
            return;
          }
          store.add(r);
        };
      }
      tx.oncomplete = resolve;
      tx.onabort = () =>
        reject(failure ?? tx.error ?? Error("Save transaction aborted"));
      tx.onerror = () => {};
    });
  }
  async refresh() {
    if (!this.db) return;
    const tx = this.db.transaction("records", "readonly");
    const rows = await request(tx.objectStore("records").getAll());
    const d = empty();
    d.profiles = [];
    for (const { key, value } of rows) {
      if (key.startsWith("profile:")) d.profiles.push(value);
      if (key.startsWith("event:")) d.events.push(value);
      if (key.startsWith("legacy:")) d.legacy.push(value);
    }
    this.data = d;
    for (const r of this.pending) this.applyMemory(r);
  }
  applyMemory(r) {
    const field = r.key.startsWith("event:")
      ? "events"
      : r.key.startsWith("profile:")
        ? "profiles"
        : "legacy";
    if (!this.data[field].some((x) => x.id === r.value.id))
      this.data[field].push(r.value);
  }
  async commit(records, keepExisting = false) {
    try {
      await this.transaction(records, keepExisting);
      await this.refresh();
      this.broadcast();
      return true;
    } catch {
      for (const r of records) {
        this.applyMemory(r);
        if (!this.pending.some((p) => p.key === r.key)) this.pending.push(r);
      }
      this.fail(
        "Temporary session: the last change could not be saved. Export a backup or retry saving.",
      );
      return false;
    }
  }
  async add(event) {
    validateEvent(event);
    return this.commit([{ key: "event:" + event.id, value: event }]);
  }
  async retry() {
    try {
      if (!this.db)
        throw Error(
          "Reload after enabling browser storage. Export this session first.",
        );
      await this.transaction(this.pending);
      this.pending = [];
      this.temporary = false;
      this.message = "";
      await this.refresh();
      this.onchange();
      return true;
    } catch (e) {
      this.message = e.message;
      return false;
    }
  }
  async importBackup(input, merge = false) {
    const data = validateBackup(input),
      prefix = merge
        ? ""
        : "import-" +
          (await fingerprint(JSON.stringify(data))).slice(0, 16) +
          "-";
    const profiles = data.profiles.map((p) => ({
      ...p,
      id: prefix + p.id,
      name: merge ? p.name : ("Imported · " + p.name).slice(0, 100),
    }));
    const events = data.events.map((e) => ({
      ...e,
      id: prefix + e.id,
      profileId: prefix + e.profileId,
      encounterId: prefix + e.encounterId,
    }));
    const records = [
      ...profiles.map((p) => ({ key: "profile:" + p.id, value: p })),
      ...events.map((e) => ({ key: "event:" + e.id, value: e })),
      ...data.legacy.map((l) => ({ key: "legacy:" + l.id, value: l })),
    ];
    // Imports never fall back silently to memory. Validate and commit everything atomically.
    await this.transaction(records);
    await this.refresh();
    this.broadcast();
    return profiles[0].id;
  }
  backup() {
    return {
      ...structuredClone(this.data),
      exportedAt: new Date().toISOString(),
    };
  }
}
