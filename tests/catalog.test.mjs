import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  areas,
  topics,
  concepts,
  prompts,
  validateCatalog,
} from "../src/content.js";
import { countries, shapes } from "../src/data/world.js";
import { presidents, validatePresidents } from "../src/presidents.js";
import { planets, moons } from "../src/astronomy.js";
import { compound } from "../src/models.js";
import {
  DAY,
  evidence,
  makeEvent,
  validateEvent,
  normalizeRecall,
} from "../src/learning.js";
test("all original areas plus numeracy have at least three complete topics", () => {
  assert.equal(areas.length, 12);
  for (const a of areas)
    assert.ok(topics.filter((t) => t.area === a.id).length >= 3, a.id);
  assert.equal(new Set(topics.map((t) => t.id)).size, topics.length);
  assert.equal(new Set(prompts.map((p) => p.id)).size, prompts.length);
  validateCatalog();
});
test("193-member inventory has exact geometry, concept and target parity", async () => {
  const ids = JSON.parse(await readFile("src/data/un-members.json", "utf8"));
  assert.equal(ids.length, 193);
  assert.deepEqual(countries.map((c) => c.code).sort(), ids);
  assert.equal(shapes.length, 242);
  assert.equal(countries.filter((c) => c.tiny).length, 35);
  for (const c of countries) {
    assert.equal(shapes.filter((s) => s.code === c.code).length, 1);
    assert.equal(concepts.filter((x) => x.id === c.id).length, 1);
    assert.equal(
      prompts.filter((p) => p.concept === c.id && p.method === "map_location")
        .length,
      1,
    );
    assert.ok(
      Number.isFinite(c.lon) &&
        Number.isFinite(c.lat) &&
        c.description &&
        c.region,
    );
  }
  assert.ok(
    !ids.includes("TWN") && !ids.includes("PSX") && !ids.includes("VAT"),
  );
});
test("all 47 presidential entries have continuous boundaries and person identity", () => {
  assert.equal(validatePresidents(), true);
  assert.equal(presidents[21].personId, presidents[23].personId);
  assert.equal(presidents[44].personId, presidents[46].personId);
  assert.equal(presidents[29].start, "1923-08-02");
  assert.equal(presidents[11].start, "1849-03-04");
});
test("astronomy model scales use positive increasing distances and explicit categories", () => {
  assert.equal(planets.length, 9);
  assert.equal(planets.filter((p) => p.kind === "Dwarf planet").length, 1);
  assert.equal(moons.length, 6);
  for (let i = 1; i < planets.length; i++)
    assert.ok(planets[i].au > planets[i - 1].au);
  assert.ok(
    moons.find((m) => m.slug === "ganymede").diameter > planets[0].diameter,
  );
  assert.equal(compound(1000, 0, 20), 1000);
  assert.ok(Math.abs(compound(1000, 5, 20) - 2653.2977) < 0.001);
});
test("recall accepts normalized names without importing answer text or recognition labels", () => {
  assert.equal(normalizeRecall("  Vénus! "), "venus");
  const t = Date.UTC(2026, 0, 1),
    open = makeEvent("opened", "planet-venus", {}, t),
    attempt = makeEvent(
      "attempt",
      "planet-venus",
      {
        method: "recall",
        promptId: "planet-venus-recall",
        promptRevision: 1,
        family: "name-recall",
        outcome: "correct",
      },
      t + DAY,
    );
  validateEvent(attempt);
  assert.equal(
    evidence([open, attempt], t + DAY).labels[attempt.id],
    "Recalled later",
  );
  assert.equal(
    evidence([open, attempt], t + DAY).states["planet-venus"].methods
      .recognition,
    undefined,
  );
  assert.throws(() => validateEvent({ ...attempt, method: "recognition" }));
});
test("a single map family cannot inflate later evidence on repeated checks", () => {
  const t = Date.UTC(2026, 0, 1),
    events = [makeEvent("opened", "country-bra", {}, t)];
  for (let n = 1; n <= 10; n++)
    events.push(
      makeEvent(
        "attempt",
        "country-bra",
        {
          method: "map_location",
          promptId: "country-bra-map",
          promptRevision: 1,
          family: "map-location",
          outcome: "correct",
        },
        t + n * 5 * DAY,
      ),
    );
  events.forEach(validateEvent);
  assert.equal(evidence(events, t + 60 * DAY).states["country-bra"].later, 1);
  assert.equal(Object.keys(evidence(events, t + 60 * DAY).states).length, 1);
});
test("recall questions never contain their accepted answer as a whole word", () => {
  for (const p of prompts.filter((p) => p.method === "recall"))
    for (const answer of p.accepted)
      assert.ok(
        !new RegExp("\\b" + answer + "\\b", "i").test(p.question),
        p.id,
      );
});
