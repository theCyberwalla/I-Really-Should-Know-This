import { shapes, countries } from "./data/world.js";
import { countryStories } from "./data/country-stories.js";
export { countries };
export const geographySources = {
  ...Object.fromEntries(
    countries.map((c) => [
      "country-story-" + c.code.toLowerCase(),
      countryStories[c.code].source,
    ]),
  ),
  membership: [
    "United Nations · Member states",
    "https://www.un.org/about-us/member-states",
  ],
  naturalearth: [
    "Natural Earth · Public-domain map data",
    "https://www.naturalearthdata.com/about/terms-of-use/",
  ],
  regions: [
    "UN Statistics Division · M49 regions",
    "https://unstats.un.org/unsd/methodology/m49/",
  ],
};
export const geographyTopic = {
  id: "world-atlas",
  area: "geography",
  title: "A world to place",
  short: "A world to place",
  question: "What is next to what?",
  description:
    "Explore all 193 UN member states, with regional browsing and short map rounds.",
  type: "map",
  color: "blue",
  range: [0, 1],
  items: countries.map((c) => c.id),
  scope:
    "Natural Earth 1:50m generalized outlines with an equirectangular projection. Shapes stretch toward the poles; small islands and boundaries are simplified. Depicted boundaries are cartographic conventions, not a position on sovereignty. All 193 UN member states are in the catalog. Other map features provide context and are not automatically classified as sovereign states. Tiny countries use enlarged locator dots, which do not represent land area. This membership-based scope excludes UN observers and other territories from practice without making a sovereignty judgment. Regional groupings use UN M49.",
  takeaway:
    "Locate a place through its neighbors, coasts and hemisphere, not its outline alone.",
};
export const geographyConcepts = countries.map((c) => {
  const story = countryStories[c.code];
  return {
    id: c.id,
    topic: "world-atlas",
    title: c.name,
    label: c.name,
    year: 0,
    date: c.region,
    hook: story.hook,
    summary: story.summary,
    why: story.explanation,
    detail: story.question,
    locationDetail: `${c.locator} The point near ${Math.abs(c.lat)}° ${c.lat < 0 ? "S" : "N"}, ${Math.abs(c.lon)}° ${c.lon < 0 ? "W" : "E"} is an approximate teaching locator, not a capital or an official geographic center.`,
    diagram: [
      ["Notice", story.hook],
      ["Follow the connection", story.question],
    ],
    diagramNote:
      "The country highlight locates the country, not the specific landscape described in the story.",
    sources: [
      "country-story-" + c.code.toLowerCase(),
      "naturalearth",
      "regions",
      "membership",
    ],
    related: [["country-" + story.relatedCode.toLowerCase(), story.question]],
  };
});
export const geographyPrompts = countries.map((c) => ({
  id: c.id + "-map",
  concept: c.id,
  family: "map-location",
  method: "map_location",
  question: "Locate " + c.name + " on the regional map.",
  answer: c.code,
  options: countries.map((x) => x.code),
  explanation: `${c.name} is in ${c.region}. ${countryStories[c.code].summary}`,
  hint: c.region,
}));
export const mapRegions = {
  World: "0 0 720 360",
  Africa: "310 95 165 165",
  Americas: "15 15 290 300",
  Asia: "405 10 310 215",
  Europe: "315 5 190 145",
  Oceania: "555 145 245 175",
};
export function worldMap(selected, esc, practice = false, region = "World") {
  const html = `<div class="world-map"><svg viewBox="${mapRegions[region] ?? mapRegions.World}" aria-label="World map, equirectangular projection" role="group"><rect width="720" height="360" fill="#dbe9e7"/>${[-60, -30, 0, 30, 60].map((lat) => `<path d="M0 ${(90 - lat) * 2}H720" stroke="${lat === 0 ? "#739791" : "#c0d2cf"}" stroke-dasharray="3 3"/><text x="3" y="${(90 - lat) * 2 - 3}" font-size="7">${lat}°</text>`).join("")}${shapes
    .map((s) => {
      const c = countries.find((c) => c.code === s.code),
        i = countries.indexOf(c);
      return `<path d="${s.path}" class="land ${c ? "selectable" : ""} ${selected === c?.id ? "chosen" : ""}" ${c ? `tabindex="0" role="button" data-${practice ? "map-answer" : "country"}="${c.code}" aria-label="${practice ? "Region " + (i + 1) : esc(c.name)}"` : 'aria-hidden="true"'}/>`;
    })
    .join("")}${countries
    .filter((c) => c.tiny)
    .map(
      (c) =>
        `<circle cx="${(c.lon + 180) * 2}" cy="${(90 - c.lat) * 2}" r="1.7" class="land selectable locator ${selected === c.id ? "chosen" : ""}" tabindex="0" role="button" data-${practice ? "map-answer" : "country"}="${c.code}" aria-label="${practice ? "Small-country locator " + (countries.indexOf(c) + 1) : esc(c.name) + " locator"}"/>`,
    )
    .join("")}</svg></div>`;
  if (region === "Oceania") {
    const inner = html.slice(html.indexOf(">") + 1);
    const svgInner = inner.slice(
      inner.indexOf(">") + 1,
      inner.indexOf("</svg>"),
    );
    return html.replace(
      "</svg>",
      `<g transform="translate(720 0)">${svgInner}</g></svg>`,
    );
  }
  return html;
}
export function geographyView(selected, esc, q = new URLSearchParams()) {
  const region = q.get("region") ?? "World",
    needle = (q.get("find") ?? "").toLowerCase(),
    filtered = countries.filter(
      (c) =>
        (region === "World" || c.continent === region) &&
        (c.name + " " + c.aliases + " " + c.region)
          .toLowerCase()
          .includes(needle),
    );
  return `<div class="map-toolbar"><label for="map-region">Region</label><select id="map-region">${Object.keys(
    mapRegions,
  )
    .map((r) => `<option ${r === region ? "selected" : ""}>${r}</option>`)
    .join(
      "",
    )}</select><a class="button" href="#/map-round">Play five places →</a></div>${worldMap(selected, esc, false, region)}<p class="small">193 UN member states. Small circles are enlarged locators, not land area. Other outlines provide context.</p><form id="country-search-form"><label for="country-find">Find a country</label><input id="country-find" name="find" value="${esc(q.get("find") ?? "")}" placeholder="Name or region"><button>Find</button></form><label for="country-select">Choose a country (keyboard & text alternative)</label><select id="country-select"><option value="">${filtered.length} matches · choose a country</option>${filtered.map((c) => `<option value="${c.code}" ${c.id === selected ? "selected" : ""}>${esc(c.name)}${c.tiny ? " · locator" : ""}</option>`).join("")}</select>${!filtered.length ? "<p>No matches. Clear the search or choose World.</p>" : ""}<p><a class="text-link" href="#/practice/${selected}">Try locating this country without its label →</a></p>`;
}
