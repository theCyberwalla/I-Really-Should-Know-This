import test from "node:test";
import assert from "node:assert/strict";
import {
  DAY,
  makeEvent,
  validateEvent,
  evidence,
  dueConcepts,
  selectPrompt,
} from "../src/learning.js";
import { validateCatalog } from "../src/content.js";
let n = 0;
const start = Date.UTC(2026, 0, 1);
const open = (time = start) =>
  makeEvent("opened", "armistice", { id: "event-" + ++n }, time);
const attempt = (time, extra = {}) =>
  makeEvent(
    "attempt",
    "armistice",
    {
      id: "event-" + ++n,
      method: "recognition",
      outcome: "correct",
      promptId: "peace-a",
      promptRevision: 1,
      family: "definition",
      ...extra,
    },
    time,
  );
test("all published concepts, artifacts, sources and variants resolve", () =>
  assert.deepEqual(validateCatalog(), { topics: 36, concepts: 328, prompts: 377 }));
test("opening is not practice or knowledge; due after 24 hours", () => {
  const e = [open()];
  assert.equal(evidence(e, start).states.armistice.later, 0);
  assert.deepEqual(dueConcepts(e, start + DAY - 1), []);
  assert.deepEqual(dueConcepts(e, start + DAY), ["armistice"]);
});
test("same-day recognition never creates later evidence", () => {
  const e = [open(), attempt(start + 1000), attempt(start + 5000)];
  assert.equal(evidence(e, start + DAY).states.armistice.later, 0);
});
test("a qualifying success is recognized later and schedules 3 days", () => {
  const a = attempt(start + DAY);
  const e = [open(), a];
  const { states, labels } = evidence(e, start + DAY);
  assert.equal(labels[a.id], "Recognized later");
  assert.equal(states.armistice.due, start + 4 * DAY);
  assert.equal(selectPrompt(e, "armistice", start + DAY).id, "peace-b");
});
test("day 4 alternative advances to day 11; repeats do not advance", () => {
  const a = attempt(start + DAY),
    b = attempt(start + 4 * DAY, {
      promptId: "peace-b",
      family: "application",
    });
  const e = [open(), a, b];
  assert.equal(
    evidence(e, start + 4 * DAY).states.armistice.due,
    start + 11 * DAY,
  );
  const repeat = attempt(start + 11 * DAY, {
    promptId: "peace-b",
    family: "application",
  });
  assert.notEqual(
    evidence([...e, repeat], start + 11 * DAY).labels[repeat.id],
    "Recognized later",
  );
});
test("hints, reveals and prior wrong attempts prevent later claims", () => {
  for (const assistance of ["hint", "answer_visible", "retry"]) {
    const a = attempt(start + DAY, { assistance });
    assert.notEqual(
      evidence([open(), a], start + DAY).labels[a.id],
      "Recognized later",
    );
  }
  const wrong = attempt(start + DAY, {
    outcome: "incorrect",
    encounterId: "same",
  });
  const retry = attempt(start + DAY + 1, {
    encounterId: "same",
    priorAttemptCount: 1,
    assistance: "retry",
  });
  assert.equal(
    evidence([open(), wrong, retry], start + 2 * DAY).states.armistice.later,
    0,
  );
});
test("answer exposure postpones eligibility; future clocks do not advance", () => {
  const a = attempt(start + DAY);
  assert.notEqual(
    evidence([open(), open(start + DAY - 1000), a], start + DAY).labels[a.id],
    "Recognized later",
  );
  assert.equal(evidence([open(), a], start).states.armistice.later, 0);
});
test("no untouched objective gets a miss; opening times survive timezone metadata", () => {
  const e = open();
  e.timezone = "Pacific/Auckland";
  const s = evidence([e], start + DAY).states;
  assert.deepEqual(Object.keys(s), ["armistice"]);
  assert.equal(s.armistice.due, start + DAY);
});
test("replay is independent of input ordering", () => {
  const e = [
    open(),
    attempt(start + DAY),
    attempt(start + 4 * DAY, { promptId: "peace-b", family: "application" }),
  ];
  assert.deepEqual(
    evidence(e, start + 5 * DAY),
    evidence(e.reverse(), start + 5 * DAY),
  );
});
test("last interval remains finite; lapse preserves prior successes", () => {
  let e = [open()],
    now = start;
  for (let i = 0; i < 8; i++) {
    now = evidence(e, now).states.armistice.due;
    const family = i % 2 ? "application" : "definition";
    e.push(attempt(now, { family, promptId: i % 2 ? "peace-b" : "peace-a" }));
  }
  let state = evidence(e, now).states.armistice;
  assert.equal(state.later, 8);
  assert.equal(state.due, now + 60 * DAY);
  e.push(attempt(state.due, { outcome: "incorrect" }));
  state = evidence(e, state.due).states.armistice;
  assert.equal(state.later, 8);
  assert.equal(state.level, 0);
});
test("malformed scored events are rejected", () => {
  assert.throws(() =>
    validateEvent({ ...attempt(start), conceptId: "unknown" }),
  );
  assert.throws(() =>
    validateEvent({ ...attempt(start), method: "exploration" }),
  );
  assert.throws(() => validateEvent({ ...open(), outcome: "correct" }));
});
test("later practice varies the last shown prompt even without a prior success", () => {
  const e = [open(), attempt(start + 1000, { outcome: "incorrect" })];
  assert.equal(selectPrompt(e, "armistice", start + 2 * DAY).id, "peace-b");
  const a = attempt(start + 2 * DAY);
  assert.notEqual(
    evidence([...e, a], start + 2 * DAY).labels[a.id],
    "Recognized later",
  );
});
test("same-day repetitions neither advance nor shorten an established interval", () => {
  const first = attempt(start + DAY);
  const e = [
    open(),
    first,
    attempt(start + DAY + 100),
    attempt(start + DAY + 200),
  ];
  const s = evidence(e, start + 2 * DAY).states.armistice;
  assert.equal(s.later, 1);
  assert.equal(s.level, 1);
  assert.equal(s.due, start + 4 * DAY);
});
