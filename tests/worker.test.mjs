import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";
test("retiring the astronomy worker deletes only its own caches and unregisters", async () => {
  const handlers = {},
    deleted = [];
  let unregistered = false,
    pending;
  const context = {
    self: {
      addEventListener: (kind, fn) => (handlers[kind] = fn),
      skipWaiting() {},
      registration: {
        unregister: async () => {
          unregistered = true;
        },
      },
      clients: { claim: async () => {} },
    },
    caches: {
      keys: async () => [
        "moons-planets-v4",
        "countryguess-v1",
        "unrelated-cache",
      ],
      delete: async (name) => deleted.push(name),
    },
  };
  vm.runInNewContext(await readFile("moonsAndPlanets/sw.js", "utf8"), context);
  handlers.activate({ waitUntil: (p) => (pending = p) });
  await pending;
  assert.deepEqual(deleted, ["moons-planets-v4"]);
  assert.equal(unregistered, true);
  assert.equal(handlers.fetch, undefined);
});
