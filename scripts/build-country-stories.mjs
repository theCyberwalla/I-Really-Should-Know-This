import fs from "node:fs";
import { countries } from "../src/data/world.js";
const selections = JSON.parse(
  fs.readFileSync("editorial/unesco-selections.json"),
);
const records = JSON.parse(
  fs.readFileSync("editorial/unesco-source-index.json"),
);
const stories = {};
for (const line of fs
  .readFileSync("editorial/country-stories.txt", "utf8")
  .trim()
  .split("\n")) {
  const [
    code,
    hook,
    summary,
    explanation,
    relatedCode,
    question,
    externalUrl,
    externalTitle,
  ] = line.split("|");
  const record = records.find(
    (r) => String(r.id_no) === String(selections[code]),
  );
  const url = externalUrl || `https://whc.unesco.org/en/list/${record.id_no}/`;
  const title = externalTitle || `UNESCO · ${record.name_en}`;
  if (stories[code]) throw Error("Duplicate " + code);
  stories[code] = {
    hook,
    summary,
    explanation,
    relatedCode,
    question,
    source: [title, url],
    review: {
      date: "2026-09-05",
      support: url.includes("/tentativelists/")
        ? "National submission; descriptive geographic claims only, not a World Heritage designation."
        : "Institutional description or published research; durable descriptive claims. Related-country comparison is editorial synthesis.",
      evidence:
        record && !externalUrl
          ? "UNESCO DataHub whc001: short_description_en and, where needed, description_en / justification_en; record " +
            record.id_no
          : "Linked page or indexed passage reviewed; historical observations retain their dates.",
      confidence:
        "Supported within the stated local scope; not a whole-country characterization.",
    },
  };
}
for (const c of countries) {
  if (!stories[c.code]) throw Error("Missing " + c.code);
  if (
    !countries.some(
      (n) => n.code === stories[c.code].relatedCode && n.code !== c.code,
    )
  )
    throw Error("Bad connection " + c.code);
}
fs.writeFileSync(
  "src/data/country-stories.js",
  "// Researched editorial content. Source text and generation notes: editorial/.\nexport const countryStories = " +
    JSON.stringify(stories, null, 2) +
    ";\n",
);
console.log(`Built ${Object.keys(stories).length} sourced country stories`);
