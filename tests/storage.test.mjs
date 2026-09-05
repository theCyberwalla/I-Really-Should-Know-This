import test from "node:test";
import assert from "node:assert/strict";
import {
  empty,
  validateBackup,
  parseBackup,
  legacySnapshots,
  AtlasStore,
  MAX_BYTES,
} from "../src/storage.js";
import { makeEvent } from "../src/learning.js";
const local = () => {
  const map = new Map([
    ["irstk_v2", '{"xp":42,"unknown":"kept"}'],
    ["moons_planets_state_v1", "malformed{"],
    ["cg.user.alice", '{"notes":"private"}'],
    ["unrelated", "untouched"],
  ]);
  return {
    map,
    get length() {
      return map.size;
    },
    key: (i) => [...map.keys()][i],
    getItem: (k) => map.get(k),
  };
};
const fixture = () => {
  const d = empty();
  d.events = [makeEvent("opened", "armistice")];
  return d;
};
test("backup round trip preserves complete provenance", () => {
  const d = fixture();
  assert.deepEqual(parseBackup(JSON.stringify(d)), d);
});
test("corrupt, primitive, arrays, new versions, orphan profiles and oversize fail", () => {
  for (const s of [
    "{",
    "null",
    "[]",
    "42",
    JSON.stringify({ ...empty(), version: 5 }),
  ])
    assert.throws(() => parseBackup(s));
  assert.throws(() => parseBackup(" ".repeat(MAX_BYTES + 1)));
  const d = fixture();
  d.events[0].profileId = "other";
  assert.throws(() => validateBackup(d));
});
test("duplicate immutable event IDs cannot conflict", () => {
  const d = fixture();
  d.events.push({ ...d.events[0], conceptId: "crisis", objectiveId: "crisis" });
  assert.throws(() => validateBackup(d));
});
test("legacy snapshots preserve malformed and unknown values without touching originals", async () => {
  const s = local(),
    before = [...s.map];
  const a = await legacySnapshots(s, "https://example.com", 100),
    b = await legacySnapshots(s, "https://example.com", 200);
  assert.equal(a.length, 3);
  assert.equal(a[1].raw, "malformed{");
  assert.deepEqual(
    a.map((x) => x.id),
    b.map((x) => x.id),
  );
  assert.deepEqual([...s.map], before);
});
test("a failed write remains exportable and retryable; source never removed", async () => {
  const s = new AtlasStore();
  s.channel?.close();
  s.transaction = async () => {
    throw Error("quota");
  };
  const e = makeEvent("opened", "crisis");
  assert.equal(await s.add(e), false);
  assert.equal(s.temporary, true);
  assert.equal(s.backup().events[0].id, e.id);
  assert.equal(s.pending.length, 1);
});
test("failed imports do not modify memory or claim success", async () => {
  const s = new AtlasStore();
  s.channel?.close();
  s.transaction = async () => {
    throw Error("quota");
  };
  const before = s.backup();
  await assert.rejects(() => s.importBackup(fixture()));
  assert.deepEqual(s.data.events, before.events);
  assert.equal(s.pending.length, 0);
});
test("separate import retains profile boundaries and is deterministic", async () => {
  const s = new AtlasStore();
  s.channel?.close();
  let records;
  s.transaction = async (r) => {
    records = r;
  };
  s.refresh = async () => {};
  const d = fixture();
  d.profiles.push({ id: "second", name: "Someone else" });
  d.events.push(makeEvent("saved", "crisis", { profileId: "second" }));
  await s.importBackup(d);
  const first = structuredClone(records);
  await s.importBackup(d);
  assert.deepEqual(records, first);
  const profiles = records.filter((r) => r.key.startsWith("profile:"));
  assert.equal(profiles.length, 2);
  assert.notEqual(profiles[0].value.id, "local");
  assert.notEqual(profiles[0].value.id, profiles[1].value.id);
});
test("identical duplicate events are deduplicated before a transaction", () => {
  const d = fixture();
  d.events.push(structuredClone(d.events[0]));
  assert.equal(validateBackup(d).events.length, 1);
});
