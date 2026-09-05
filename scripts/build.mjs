import { createHash } from "node:crypto";
import {
  mkdir,
  cp,
  rm,
  stat,
  readdir,
  readFile,
  writeFile,
} from "node:fs/promises";
import { validateCatalog } from "../src/content.js";
console.log("Validated content:", validateCatalog());
async function files(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const path = dir + "/" + e.name;
    out.push(...(e.isDirectory() ? await files(path) : [path]));
  }
  return out;
}
const assets = ["index.html", "favicon.svg", ...(await files("src"))];
const hash = createHash("sha256");
for (const path of assets.sort()) {
  hash.update(path);
  hash.update(await readFile(path));
}
await writeFile(
  "offline-assets.js",
  `self.ATLAS_RELEASE=${JSON.stringify(hash.digest("hex").slice(0, 16))};\nself.ATLAS_ASSETS=${JSON.stringify(assets.map((p) => "./" + p))};\n`,
);
await rm("dist", { recursive: true, force: true });
await mkdir("dist");
for (const path of [
  "index.html",
  "favicon.svg",
  "src",
  "sw.js",
  "offline-assets.js",
])
  await cp(path, "dist/" + path, { recursive: true });
await mkdir("dist/moonsAndPlanets");
for (const file of ["index.html", "sw.js"])
  await cp("moonsAndPlanets/" + file, "dist/moonsAndPlanets/" + file);
console.log(
  "Static release built in dist; no network assets or runtime dependencies.",
);
