import { startOffline, refreshOffline } from "./offline.js";
import {
  model,
  growthChart,
  percentModel,
  marketChart,
  skyModel,
} from "./models.js";
import { countries, worldMap } from "./geography.js";
import { normalizeRecall } from "./learning.js";
import { presidencyView } from "./presidency-view.js";
import {
  areas,
  topics,
  topicById,
  concepts,
  byId,
  sources,
  prompts,
  validateCatalog,
} from "./content.js";
import { AtlasStore, parseBackup } from "./storage.js";
import { makeEvent, evidence, dueConcepts, selectPrompt } from "./learning.js";
validateCatalog();
const main = document.querySelector("main"),
  store = new AtlasStore();
let round = null;
let profile = "local",
  encounter = null,
  pendingImport = null,
  lastExposure = "",
  renderToken = 0;
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const events = () => store.data.events.filter((e) => e.profileId === profile);
const href = (id) => "#/concept/" + id;
const link = (id, label) =>
  `<a href="${href(id)}">${esc(label ?? byId[id].title)} <span aria-hidden="true">↗</span></a>`;
const sourceLinks = (c) =>
  `<div class="sources"><span>Sources · reviewed 5 Sep 2026</span>${c.sources.map((id) => `<a target="_blank" rel="noreferrer" href="${sources[id][1]}">${esc(sources[id][0])} ↗</a>`).join("")}</div>`;
function route() {
  const [path, q = ""] = (location.hash.slice(1) || "/").split("?");
  return {
    path,
    parts: path.split("/").filter(Boolean),
    q: new URLSearchParams(q),
  };
}
function announce(text) {
  const n = document.querySelector("#notice");
  n.textContent = text;
  n.hidden = false;
  clearTimeout(announce.timer);
  announce.timer = setTimeout(() => (n.hidden = true), 5000);
}
function status() {
  const node = document.querySelector("#storage-status");
  node.innerHTML = store.message
    ? `<div class="storage-warning">${esc(store.message)} ${store.temporary ? '<button data-action="retry-save">Retry saving</button> <a href="#/about">Export your session</a>' : ""}</div>`
    : "";
}
store.onchange = () => {
  status();
  if (route().path === "/trail") render(false);
};
function capture() {
  history.replaceState(
    {
      ...history.state,
      y: scrollY,
      focus: document.activeElement?.id ?? "",
      panels: Object.fromEntries(
        ["president-list", "country-directory"].map((cls) => [
          cls,
          document.querySelector("." + cls)?.scrollTop ?? 0,
        ]),
      ),
    },
    "",
  );
}
function navigate(url, replace = false) {
  capture();
  history[replace ? "replaceState" : "pushState"](
    {
      atlas: true,
      y: replace ? scrollY : 0,
      focus: replace ? document.activeElement?.id : "",
      from: location.hash,
      panels: replace ? history.state?.panels : {},
    },
    "",
    url,
  );
  render(!replace, replace);
}
window.addEventListener("popstate", () => render(false, true));
window.addEventListener("hashchange", () => {
  if (location.hash !== render.lastHash) render(false, true);
});
async function record(kind, id, extra = {}) {
  const event = makeEvent(kind, id, {
    ...extra,
    profileId: extra.profileId ?? profile,
  });
  await store.add(event);
  status();
  return event;
}
function expose(id, key) {
  key = profile + ":" + key;
  if (lastExposure !== key) {
    lastExposure = key;
    void record("opened", id);
  }
}
function crumbs(t, c) {
  const area = areas.find((a) => a.id === (t?.area ?? "history"));
  return `<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Discover</a><span>/</span><a href="#/catalog">Collection</a><span>/</span><a href="#/area/${area.id}">${esc(area.title)}</a>${t ? `<span>/</span><a href="#/topic/${t.id}">${esc(t.title)}</a>` : ""}${c ? '<span>/</span><span aria-current="page">In focus</span>' : ""}</nav>`;
}
function areaTiles() {
  return `<div class="area-grid">${areas.map((a, i) => `<a class="area-card" href="#/area/${a.id}"><span class="eyebrow">${String(i + 1).padStart(2, "0")} / ${topics.filter((t) => t.area === a.id).length} topics</span><div class="area-motif motif-${a.id}" aria-hidden="true">${esc(a.motif)}</div><h2>${esc(a.title)}</h2><p>${esc(a.description)}</p><span class="text-link">Follow a question ↗</span></a>`).join("")}</div>`;
}
function catalog() {
  return `<div class="page-intro"><p class="eyebrow">The collection · ${areas.length} areas / ${topics.length} topics</p><h1>A world worth<br><em>getting to know.</em></h1><p class="lede">Pick a place, a mechanism or a question. Everything connects.</p></div>${areaTiles()}`;
}
function areaPage(a) {
  const ts = topics.filter((t) => t.area === a.id);
  return `<nav class="crumbs"><a href="#/">Discover</a><span>/</span><a href="#/catalog">Collection</a><span>/</span><span>${esc(a.title)}</span></nav><div class="page-intro"><p class="eyebrow">${esc(a.title)}</p><h1>${esc(a.question)}</h1><p class="lede">${esc(a.description)}</p></div>${a.id === "history" ? '<p class="scope">The History selection focuses on European turning points and US presidencies. It is not a complete world history.</p>' : ""}${topicTiles(ts)}<section class="gentle-invite"><h2>Try a connection.</h2><p>Optional practice teaches with an explanation. Opening a lesson never counts as knowing it.</p><a href="#/practice/${prompts.find((p) => ts.some((t) => t.id === byId[p.concept].topic))?.concept ?? "armistice"}">One question from this area →</a></section>`;
}

function topicArt(t) {
  if (t.area !== "history")
    return `<div class="topic-motif" aria-hidden="true">${{ map: "⌖", solar: "☉  ·  ○", moons: "○ ◯ ●", cycle: "↻", comparison: "↔", compound: "↗", energy: "100 → 30 + 70", probability: "½ × ½", percent: "10% → 15%", market: "╲ ╱", sky: "◐ ● ◑" }[t.type] ?? "01 → 02 → 03"}</div>`;
  if (t.id === "world-wars")
    return `<div class="mini-periods" aria-hidden="true"><span style="width:13%">1914</span><span style="width:68%">1918</span><span style="width:19%">1939</span><small>WAR · BETWEEN WARS · WAR</small></div>`;
  if (t.id === "presidents")
    return `<div class="mini-office" aria-hidden="true"><span>PRECEDENT</span><b>↔</b><span>WRITTEN RULE</span></div>`;
  return `<div class="mini-europe" aria-hidden="true"><span>1789</span><i>●—●—●—●</i><span>1989</span></div>`;
}
function topicTiles(list = topics.filter((t) => t.area === "history")) {
  return `<div class="topic-grid">${list.map((t, i) => `<a class="topic-tile ${t.color}" href="#/topic/${t.id}"><span class="eyebrow">0${i + 1} / ${esc(areas.find((a) => a.id === t.area).title)}</span>${topicArt(t)}<h3>${esc(t.title)}</h3><p>${esc(t.description)}</p><span class="tile-bottom">${t.id === "presidents" ? 47 : t.items.length} ${t.id === "presidents" ? "presidencies" : "connections"} <b aria-hidden="true">↗</b></span></a>`).join("")}</div>`;
}
function heroVisual(selected = "armistice") {
  const ids = ["crisis", "armistice", "versailles"],
    c = byId[ids.includes(selected) ? selected : "armistice"];
  return `<section class="hero-visual" aria-label="Explore the ending of the First World War"><div class="visual-top"><span class="eyebrow">A closer look / 01</span><span>1914—1919</span></div><div class="hero-axis"><span>WAR</span><span>AFTERMATH</span></div><div class="hero-points">${ids.map((id) => `<button id="hero-${id}" data-select-home="${id}" aria-pressed="${id === c.id}"><span class="point"></span><b>${byId[id].year}</b><span>${esc(byId[id].label)}</span></button>`).join("")}</div><p class="visual-caption">Selected milestones in order · spacing is not a time scale</p><div class="hero-selected" aria-live="polite"><span class="eyebrow">${c.date}</span><h2>${esc(c.title)}</h2><p>${esc(c.summary)}</p>${link(c.id, "Follow this thread")}</div><span class="orbital" aria-hidden="true">✳</span></section>`;
}
function home(q) {
  const featured = ["crisis", "armistice", "versailles"].includes(
    q.get("select"),
  )
    ? q.get("select")
    : "armistice";
  expose(featured, location.hash || "#/");
  const ev = events(),
    opened = new Set(
      ev.filter((e) => e.kind === "opened").map((e) => e.conceptId),
    ),
    fresh = concepts.find((c) => !opened.has(c.id)),
    last = [...ev].reverse().find((e) => e.kind === "opened"),
    due = dueConcepts(ev).filter((id) => id !== featured);
  return `<section class="home-intro"><div><p class="eyebrow">An atlas for a curious mind</p><h1>There’s a world<br>behind <em>“why?”</em></h1><p class="lede">Follow a question. See the connections.<br>Leave knowing a little more.</p><a class="button" href="#/catalog">Explore the collection <span>↗</span></a><p class="small intro-note">No test to begin. No right place to start.</p></div>${heroVisual(q.get("select"))}</section><section class="collection-section"><div class="section-heading"><div><p class="eyebrow">Twelve ways in</p><h2>Where will curiosity take you?</h2></div><span class="small">Open a topic. Make a connection.</span></div>${areaTiles()}</section>${last ? `<section class="return-strip"><div><span class="eyebrow">Your next little discovery</span><h2>${fresh ? "Something new, something connected." : "There’s more in a second look."}</h2></div><div>${link(fresh?.id ?? last.conceptId, fresh ? "Not yet opened: " + fresh.label : "Revisit: " + byId[last.conceptId].label)}${link(byId[last.conceptId].related[0][0], "Connected to your last visit")}${due.length ? `<a href="#/practice/${due[0]}">Ready to revisit · optional practice →</a>` : '<a href="#/trail">See your trail →</a>'}</div></section>` : ""}`;
}
function selectButton(id, selected, inner, cls = "") {
  return `<button id="${cls === "moment" ? "moment" : "select"}-${id}" class="${cls}" data-select="${id}" aria-pressed="${id === selected}">${inner}</button>`;
}
function artifact(t, selected) {
  if (t.type === "periods")
    return `<div class="period-artifact"><div class="artifact-heading"><span class="eyebrow">The big picture</span><h2>War is only part<br>of the timeline.</h2></div><div class="axis"><span>1914</span><span>1924</span><span>1934</span><span>1945</span></div>${t.periods.map(([label, start, end, id], i) => selectButton(id, selected, `<span class="range-label">${label}<small>${start}—${end}</small></span><span class="range-track"><i style="left:${((start - 1914) / 31) * 100}%;width:${((end - start) / 31) * 100}%" class="range-fill fill-${i}"></i></span>`, "period")).join("")}<p class="visual-caption">Shared year scale · bar lengths represent duration.<br>Choose a period, or a milestone below.</p></div>`;
  if (t.type === "institutions")
    return `<div class="institution-artifact"><span class="eyebrow">Compare the instruments</span><h2>Different powers.<br>Different limits.</h2><div class="institution-columns" aria-hidden="true"><span>Instrument</span><span>What it means</span></div><div class="institution-table">${t.items.map((id, i) => selectButton(id, selected, `<span><small>${byId[id].year}</small><strong>${["Precedent", "Proclamation", "Amendment XXII", "Amendment XXV"][i]}</strong></span><span>${["A practice that influences successors", "A wartime action with limited reach", "A written limit on elections", "A rule for continuity in office"][i]}</span>`)).join("")}</div><p class="visual-caption">Compare the source and scope of authority. These are selected examples, not a ranking of power or presidents.</p></div>`;
  const shifts = [
    ["Representation by estate", "A claim to speak for the nation"],
    ["Napoleon’s return", "Defeat by coalition forces"],
    ["National industries", "Shared coal and steel management"],
    ["Restricted crossings", "An open Berlin border"],
  ];
  return `<div class="transformation-artifact"><span class="eyebrow">Compare what changed</span><h2>Power can shift<br>in different ways.</h2><div class="transformation-path">${t.items.map((id, i) => selectButton(id, selected, `<span class="transform-date">${byId[id].year || esc(byId[id].date)}</span><span class="shift-pair"><span>${shifts[i][0]}</span><b aria-hidden="true">→</b><strong>${shifts[i][1]}</strong></span>`)).join("")}</div><p class="visual-caption">Four distinct transformations, ordered by date—not one causal chain. The 1951 treaty took effect in 1952.</p></div>`;
}
function selectedPanel(c) {
  return `<aside class="selected-panel" aria-live="polite"><span class="eyebrow">In focus · ${esc(c.date)}</span><h2>${esc(c.title)}</h2>${c.hook ? `<h3>${esc(c.hook)}</h3>` : ""}<p>${esc(c.summary)}</p><p class="small">${esc(c.why)}</p><a class="button" id="open-${c.id}" href="${href(c.id)}">Explore this connection <span>↗</span></a>${c.hook ? `<p>${link(c.related[0][0], c.related[0][1])}</p>` : ""}<span class="small">${c.sources.map((id) => esc(sources[id][0].split(" · ")[0])).join(" · ")}</span></aside>`;
}
function topicPage(t, q) {
  if (
    t.id === "presidents" &&
    q.get("lens") !== "institutions" &&
    (!q.get("select") || q.get("select").startsWith("presidency-"))
  ) {
    const id = q.get("select") ?? "presidency-47";
    if (byId[id]) expose(id, location.hash);
    return crumbs(t) + presidencyView(q, esc);
  }
  if (t.area !== "history") return generalTopic(t, q);
  const selected = t.items.includes(q.get("select"))
      ? q.get("select")
      : t.items[0],
    c = byId[selected];
  expose(c.id, location.hash);
  return `${crumbs(t)}<div class="topic-intro"><div><p class="eyebrow">History / ${String(topics.indexOf(t) + 1).padStart(2, "0")}</p><h1>${esc(t.short)}</h1><p class="lede">${esc(t.question)}</p></div><span class="date-stamp">${t.range[0]}<br><span>—</span> ${t.range[1]}</span></div><section class="topic-canvas ${t.color}" aria-label="${esc(t.title)} interactive visual">${artifact(t, selected)}${selectedPanel(c)}</section><p class="takeaway"><span aria-hidden="true">↳</span> ${esc(t.takeaway)}</p><section class="moments"><div class="section-heading"><h2>Look a little closer.</h2><span class="small">Select a moment</span></div><div class="moment-list">${t.items.map((id) => selectButton(id, selected, `<span>${byId[id].year || esc(byId[id].date)}</span><strong>${esc(byId[id].label)}</strong><b aria-hidden="true">↗</b>`, "moment")).join("")}</div></section><details class="text-equivalent"><summary>Text version & scope of this visual</summary><p>${esc(t.scope)}</p><p>${esc(t.takeaway)}</p>${t.periods ? `<ul>${t.periods.map(([label, start, end]) => `<li>${label}: ${start} to ${end}</li>`).join("")}</ul>` : ""}<ol>${t.items.map((id) => `<li><h3>${byId[id].date} · ${esc(byId[id].label)}</h3><p>${esc(byId[id].summary)} ${esc(byId[id].why)}</p>${link(id, "Open this concept")}${sourceLinks(byId[id])}</li>`).join("")}</ol></details><section class="gentle-invite"><span class="eyebrow">A small experiment</span><h2>What might stick?</h2><p>Try one question about a connection. The explanation is part of the experience.</p><a href="#/practice/${t.id === "world-wars" ? "armistice" : t.id === "presidents" ? "term-limits" : "cooperation"}">Try an optional question →</a></section>`;
}
function generalTopic(t, q) {
  const id = t.items.includes(q.get("select")) ? q.get("select") : t.items[0],
    c = byId[id];
  expose(id, location.hash);
  return `${crumbs(t)}<div class="topic-intro"><div><p class="eyebrow">${esc(areas.find((a) => a.id === t.area).title)}</p><h1>${esc(t.title)}</h1><p class="lede">${esc(t.question)}</p></div><span class="date-stamp">${String(t.items.length).padStart(2, "0")}<br><small>connections</small></span></div><section class="topic-canvas ${t.color}" aria-label="${esc(t.title)} interactive visual"><div class="model-wrap">${model(t, c, esc, q)}</div>${selectedPanel(c)}</section><p class="takeaway">↳ ${esc(t.takeaway)}</p><div class="moment-list ${t.type === "map" ? "country-directory" : ""}">${t.items.map((id, i) => `<button id="moment-${id}" class="moment" data-select="${id}" aria-pressed="${id === c.id}"><span>${String(i + 1).padStart(2, "0")}</span><strong>${esc(byId[id].label)}</strong><b aria-hidden="true">↗</b></button>`).join("")}</div><details class="text-equivalent"><summary>Text version, sources & scope</summary><p>${esc(t.scope)}</p>${t.items.map((id) => `<h3>${esc(byId[id].label)}</h3><p>${esc(byId[id].summary)}</p>${sourceLinks(byId[id])}`).join("")}</details><section class="gentle-invite"><h2>Let it settle. Try it later.</h2><p>Practice is optional, and assistance stays visible in your trail.</p><a href="#/practice/${prompts.find((p) => p.concept === c.id)?.concept ?? prompts.find((p) => t.items.includes(p.concept))?.concept ?? "armistice"}">Try a question →</a></section>`;
}
function countryPage(c, t, saved) {
  return `${crumbs(t, c)}<div class="concept-toolbar"><button class="text-button" data-action="back" data-fallback="#/topic/${t.id}?select=${c.id}">← Back to exploration</button><button class="text-button" data-save="${c.id}" ${saved ? "disabled" : ""}>${saved ? "✓ Saved to your trail" : "+ Save this connection"}</button></div><article><header class="concept-intro"><p class="eyebrow">${esc(c.title)} · ${esc(c.date)}</p><h1>${esc(c.hook)}</h1><p class="lede">${esc(c.summary)}</p></header><div class="concept-body"><div><p class="eyebrow">Look a little closer</p><h2>How the landscape works.</h2></div><div><p>${esc(c.why)}</p><p>${link(c.related[0][0], c.related[0][1])}</p><button class="text-button" data-familiar="${c.id}">This feels familiar</button><span class="small"> Self-reported only; no knowledge score.</span></div></div>${sourceLinks({ ...c, sources: c.sources.slice(0, 1) })}<section class="concept-model" aria-label="Locate ${esc(c.title)}">${model(t, c, esc)}</section><p class="small">${esc(c.diagramNote)}</p><details class="text-equivalent"><summary>Map location, coordinates & scope</summary><p>${esc(c.locationDetail)}</p><p>${esc(t.scope)}</p>${sourceLinks({ ...c, sources: c.sources.slice(1) })}<p>${link("coordinates", "How do latitude and longitude work?")}</p></details><p><a class="button" href="#/practice/${c.id}">Try locating ${esc(c.title)} →</a></p></article><section class="connections"><p class="eyebrow">Keep the thread going</p><h2>Follow this landscape.</h2><div>${c.related.map(([id, label]) => `<a class="connection" href="${href(id)}"><span class="small">${esc(byId[id].title)}</span><h3>${esc(label)}</h3><span aria-hidden="true">↗</span></a>`).join("")}</div><a class="text-link" href="#/topic/${t.id}?select=${c.id}">Return to the world atlas →</a></section>`;
}
function conceptPage(c) {
  const t = topicById[c.topic];
  expose(c.id, location.hash);
  const saved = evidence(events()).states[c.id]?.saved;
  if (c.hook) return countryPage(c, t, saved);
  return `${crumbs(t, c)}<div class="concept-toolbar"><button class="text-button" data-action="back" data-fallback="#/topic/${t.id}?select=${c.id}">← Back to exploration</button><button class="text-button" data-save="${c.id}" ${saved ? "disabled" : ""}>${saved ? "✓ Saved to your trail" : "+ Save this connection"}</button></div><article><header class="concept-intro"><p class="eyebrow">${esc(t.title)} · ${esc(c.date)}</p><h1>${esc(c.title)}</h1><p class="lede">${esc(c.summary)}</p></header>${t.area !== "history" ? `<section class="concept-model">${model(t, c, esc)}</section>` : ""}<section class="concept-diagram ${t.color}" aria-label="${esc(c.label)} relationship diagram"><div class="diagram-nodes">${c.diagram.map(([label, body], i) => `<div><span class="diagram-number">0${i + 1}</span><h2>${esc(label)}</h2><p>${esc(body)}</p></div>`).join("")}</div><p class="visual-caption">${esc(c.diagramNote)}</p></section><div class="concept-body"><div><p class="eyebrow">Why it matters</p><h2>A useful distinction.</h2></div><div><p>${esc(c.why)}</p><p>${esc(c.detail)}</p><button class="text-button" data-familiar="${c.id}">This feels familiar</button><span class="small"> Self-reported only; no knowledge score.</span></div></div>${sourceLinks(c)}${prompts.some((p) => p.concept === c.id) ? `<p><a class="button" href="#/practice/${c.id}">Try this connection →</a></p>` : ""}</article><section class="connections"><p class="eyebrow">Keep the thread going</p><h2>Now that’s connected.</h2><div>${c.related.map(([id, label]) => `<a class="connection" href="${href(id)}"><span class="small">${esc(topicById[byId[id].topic].title)} · ${byId[id].year || esc(byId[id].date)}</span><h3>${esc(label)}</h3><span aria-hidden="true">↗</span></a>`).join("")}</div><a class="text-link" href="#/topic/${t.id}?select=${c.id}">See this connection in the ${esc(t.title)} visual →</a></section>`;
}
function practicePage(id) {
  if (!prompts.some((p) => p.concept === id)) return notFound();
  if (
    !encounter ||
    encounter.concept !== id ||
    encounter.route !== location.hash
  ) {
    encounter = {
      concept: id,
      prompt: selectPrompt(events(), id),
      id: crypto.randomUUID(),
      profileId: profile,
      assistance: "none",
      attempts: 0,
      feedback: null,
      route: location.hash,
    };
  }
  const { prompt: p } = encounter;
  return `<nav class="crumbs"><a href="#/">Discover</a><span>/</span><span>Optional practice</span></nav><section class="practice"><p class="eyebrow">One connection · no timer</p><h1>Give curiosity<br>a little <em>room.</em></h1><p class="small">${p.method === "recall" ? "Recall practice · type a short answer without choices." : p.method === "map_location" ? "Location practice · select a region on the unlabeled map." : "Recognition practice · selecting an answer is different from recalling it unaided."}</p><div class="question-box"><span class="eyebrow">${esc(topicById[byId[id].topic].title)}</span><h2>${esc(p.question)}</h2>${p.method === "recall" ? `<form id="recall-form"><label for="recall-answer">Your answer</label><input id="recall-answer" autocomplete="off" spellcheck="false" ${encounter.feedback ? "disabled" : ""}><button class="button" ${encounter.feedback ? "disabled" : ""}>Check answer</button><p class="small">Case and punctuation are ignored. Only the stated name is checked; your typed text is not saved.</p></form>` : p.method === "map_location" ? `${`<label for="practice-map-region">Map region</label><select id="practice-map-region">${["World", "Africa", "Americas", "Asia", "Europe", "Oceania"].map((r) => `<option ${r === (encounter.mapRegion ?? countries.find((c) => c.id === id)?.continent) ? "selected" : ""}>${r}</option>`).join("")}</select><div id="practice-map">${practiceMap(id)}</div>`}<p class="small">Use the map with pointer or Tab and Enter. For a nonvisual alternative, <a href="#/concept/${id}">read the geographic explanation</a>; this activity specifically checks map location.</p>` : `<div class="answers">${p.options.map((o, i) => `<button id="answer-${i}" aria-describedby="feedback" data-answer="${i}" ${encounter.feedback ? "disabled" : ""}><span>${String.fromCharCode(65 + i)}</span>${esc(o)}</button>`).join("")}</div>`}${p.method === "map_location" && countries.find((c) => c.id === id)?.tiny ? `<p class="small">This small country uses an enlarged locator dot, not a land-area circle. <button class="text-button" data-action="map-zoom" ${encounter.feedback ? "disabled" : ""}>Zoom near it (hint)</button></p>` : ""}<div class="practice-tools"><button data-action="hint" ${encounter.feedback ? "disabled" : ""}>A little hint</button><button data-action="reveal" ${encounter.feedback ? "disabled" : ""}>Show me the explanation</button></div><div id="feedback" tabindex="-1" role="status">${encounter.hint && !encounter.feedback ? `<p class="hint">${esc(p.hint ?? "Think about what each institution or agreement actually does.")}</p>` : ""}${encounter.feedback ? `<div class="feedback"><span class="eyebrow">${esc(encounter.feedback)}</span><p>${esc(p.explanation)}</p>${encounter.result === "incorrect" ? '<button class="text-button" data-action="try-again">Try again with the explanation in mind →</button>' : ""}${link(id, "Explore the visual explanation")}<p>${round ? `<button class="text-button" data-action="round-next">${round.index === 4 ? "See this round" : "Next place"} →</button>` : `<a href="#/practice/${nextPractice(id)}">Try a different connection →</a>`}</p></div>` : ""}</div></div><div class="practice-exit"><button class="text-button" data-action="back" data-fallback="#/topic/${byId[id].topic}">← Return to exploring</button><a href="#/catalog">Skip this question →</a></div><p class="small">Leaving never records a wrong answer. Hints and retries stay labeled as assisted practice.</p></section>`;
}
function trail() {
  const ev = events(),
    { states, labels } = evidence(ev),
    due = dueConcepts(ev),
    saved = Object.keys(states).filter((id) => states[id].saved);
  return `<div class="page-intro"><p class="eyebrow">A record of your curiosity</p><h1>Your trail,<br><em>at your pace.</em></h1><p class="lede">Things you opened, saved and tried. No universal score.</p></div><div class="profile-line"><label for="profile">Local profile</label><select id="profile">${store.data.profiles.map((p) => `<option value="${esc(p.id)}" ${p.id === profile ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</select><a href="#/about">Backup & import →</a></div><div class="trail-stats"><div><b>${Object.values(states).filter((s) => s.opened).length}</b><span>Connections opened</span></div><div><b>${ev.filter((e) => e.kind === "attempt").length}</b><span>Practice attempts</span></div><div><b>${Object.values(states).reduce((n, s) => n + s.later, 0)}</b><span>Successful later checks</span></div></div><p class="small">“Opened” does not mean understood. “Recognized later” means a correct first unaided choice, after at least 24 hours and when due, using a different question family from the last shown practice prompt. Bounded name recall and map-location checks have separate labels and method histories. They do not establish general mastery. A single-family activity cannot keep advancing through repeated identical checks.</p>${due.length ? `<section class="return-strip"><h2>Ready for another look?</h2><div>${due.map((id) => `<a href="#/practice/${id}">${esc(byId[id].label)} · optional question →</a>`).join("")}</div></section>` : ""}<section class="trail-section"><h2>Kept for later.</h2>${saved.length ? `<div class="saved-list">${saved.map((id) => link(id)).join("")}</div>` : "<p>Save a connection from any concept page to find it here.</p>"}</section><section class="trail-section"><h2>Little steps, honestly recorded.</h2>${
    ev.length
      ? `<ol class="event-list">${[...ev]
          .sort((a, b) => b.observedAt - a.observedAt)
          .slice(0, 100)
          .map(
            (e) =>
              `<li><div>${link(e.conceptId, byId[e.conceptId].label)}<span>${esc(labels[e.id] ?? "Observed")}${e.kind === "attempt" ? " · " + e.outcome : ""}</span></div><time datetime="${new Date(e.observedAt).toISOString()}">${esc(new Date(e.observedAt).toLocaleString())}</time></li>`,
          )
          .join("")}</ol>`
      : '<p>Your trail starts with a question. <a href="#/history">Explore History →</a></p>'
  }</section>`;
}
function about() {
  return `<div class="page-intro"><p class="eyebrow">About this edition</p><h1>A small atlas.<br><em>An open invitation.</em></h1><p class="lede">${concepts.length} connections across ${topics.length} topics and ${areas.length} knowledge areas. All are open to explore.</p></div><div class="about-grid"><section><h2>Deliberately a beginning.</h2><p>This introductory collection spans the original eleven knowledge areas plus numbers and evidence. History focuses on the US and Europe; geography includes all 193 UN member states; astronomy includes eight planets, Pluto and six selected moons. These are defined starting points, not exhaustive coverage.</p><p>All diagrams are original and use text, shapes and sourced historical facts. Each concept links to its evidence. Political figures are presented through factual events and institutions, without scores or rankings.</p><p>No account, advertising, analytics or automatic upload. Source links leave this site. After the offline copy has finished downloading, previously installed lessons are available without a connection. External sources still require Internet access. The offline status is shown below.</p><p id="offline-status" role="status">Checking offline availability…</p><h2>How your trail works.</h2><p>Activity is stored on this browser and origin. Recognition practice is scheduled with simple intervals of 1, 3, 7, 21 and 60 days; these are product defaults, not a calibrated measure of memory. Opening an answer delays the next eligible recognition check by at least a day. Missing a visit is not recorded as forgetting.</p></section><section class="data-panel"><h2>Your data stays yours.</h2><p>Backups contain all local profiles, learning events and preserved legacy records. Legacy records can include private notes. Keep the downloaded file somewhere you trust.</p><button class="button" data-action="export">Download local backup ↓</button><label class="file-label" for="import-file">Preview a backup to restore</label><input id="import-file" type="file" accept=".json,application/json"><div id="import-preview" aria-live="polite"></div><h3>Historical app data</h3><p>${store.data.legacy.length} unchanged source snapshots preserved. Old scores are historical activity, never converted into new learning evidence.</p><p class="small">Same-origin records are preserved automatically. Progress on another website cannot be read here; cross-origin transfer needs an export from that site. This importer accepts new Atlas backups only.</p><details><summary>View preserved records</summary>${store.data.legacy.length ? store.data.legacy.map((l) => `<details><summary>${esc(l.key)} · ${esc(l.origin)}</summary><pre>${esc(l.raw)}</pre></details>`).join("") : "<p>No known legacy records were found on this origin.</p>"}</details></section></div>`;
}
function searchPage(q) {
  return `<div class="page-intro"><p class="eyebrow">Follow a question</p><h1>What caught<br><em>your curiosity?</em></h1></div><label class="search-label" for="search-input">Search topics, dates and connections</label><input class="search-input" id="search-input" type="search" placeholder="Try “peace”, “1789” or “presidents”…" value="${esc(q.get("q") ?? "")}" autocomplete="off"><div id="search-results" aria-live="polite"></div>`;
}
function updateSearch(value) {
  const needle = value.toLowerCase().trim();
  const items = [
    {
      id: "history",
      title: "The collection",
      description: "Explore the selected collection",
      url: "#/catalog",
    },
    ...topics.map((t) => ({
      title: t.title,
      description: t.description,
      url: "#/topic/" + t.id,
    })),
    ...concepts.map((c) => ({
      title: c.title,
      description: c.date + " · " + c.label + " · " + c.summary,
      url: href(c.id),
    })),
    ...areas.map((a) => ({
      title: a.title,
      description: a.description,
      url: "#/area/" + a.id,
    })),
  ].filter(
    (c) =>
      !needle || (c.title + " " + c.description).toLowerCase().includes(needle),
  );
  document.querySelector("#search-results").innerHTML =
    `<p class="small">${items.length} ${items.length === 1 ? "connection" : "connections"}${needle ? " found" : " to explore"}</p>${items.map((c) => `<a class="search-result" href="${c.url}"><h2>${esc(c.title)}</h2><p>${esc(c.description)}</p><span aria-hidden="true">↗</span></a>`).join("")}${!items.length ? '<p>Nothing in this small collection matches yet. Try a broader word or <a href="#/catalog">browse the collection</a>.</p>' : ""}`;
}
function notFound() {
  return '<section class="page-intro"><p class="eyebrow">A path outside this collection</p><h1>Let’s find<br>another thread.</h1><p>This link does not match a published page.</p><a class="button" href="#/catalog">Explore the collection →</a></section>';
}
function render(focus = true, restore = false) {
  const token = ++renderToken,
    { parts, q } = route();
  render.lastHash = location.hash;
  const [page, id] = parts;
  if (!["practice", "map-round"].includes(page)) encounter = null;
  if (page !== "map-round") round = null;
  if (page && !["topic", "concept"].includes(page)) lastExposure = "";
  let html,
    title = "A curiosity atlas";
  if (!page) html = home(q);
  else if (page === "history") {
    html = areaPage(areas[0]);
    title = "History";
  } else if (page === "catalog") {
    html = catalog();
    title = "The collection";
  } else if (page === "area" && areas.some((a) => a.id === id)) {
    const area = areas.find((a) => a.id === id);
    html = areaPage(area);
    title = area.title;
  } else if (page === "topic" && topicById[id]) {
    html = topicPage(topicById[id], q);
    title = topicById[id].title;
  } else if (page === "concept" && byId[id]) {
    html = conceptPage(byId[id]);
    title = byId[id].title;
  } else if (page === "map-round") {
    html = mapRound();
    title = "Five places";
  } else if (page === "practice") {
    html = practicePage(id);
    title = "Optional practice";
  } else if (page === "trail") {
    html = trail();
    title = "My trail";
  } else if (page === "about") {
    html = about();
    title = "About & your data";
  } else if (page === "search") {
    html = searchPage(q);
    title = "Search";
  } else html = notFound();
  main.innerHTML = html;
  main.className = page ?? "home";
  document.title = title + " · I Really Should Know This";
  document.querySelectorAll("[data-nav]").forEach((a) => {
    const active =
      a.dataset.nav ===
      (page === "trail"
        ? "trail"
        : ["history", "catalog", "area", "topic", "concept"].includes(page)
          ? "history"
          : "discover");
    if (active) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  if (page === "search") updateSearch(q.get("q") ?? "");
  requestAnimationFrame(() => {
    if (token !== renderToken) return;
    if (!restore && page === "topic" && id === "presidents") {
      const list = document.querySelector(".president-list"),
        selected = list?.querySelector('[aria-pressed="true"]');
      if (list && selected)
        list.scrollTop +=
          selected.getBoundingClientRect().top -
          list.getBoundingClientRect().top;
    }

    if (restore) {
      const saved = history.state ?? {};
      document.getElementById(saved.focus)?.focus({ preventScroll: true });
      for (const [cls, y] of Object.entries(saved.panels ?? {})) {
        const el = document.querySelector("." + cls);
        if (el) el.scrollTop = y;
      }
      window.scrollTo(0, saved.y ?? 0);
    } else if (focus) {
      window.scrollTo(0, 0);
      main.focus({ preventScroll: true });
    }
  });
  status();
  refreshOffline();
}
document.addEventListener("click", async (event) => {
  const a = event.target.closest('a[href^="#/"]');
  if (
    a &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    event.button === 0
  ) {
    event.preventDefault();
    navigate(a.getAttribute("href"));
    return;
  }
  const mapAnswer = event.target.closest("[data-map-answer]");
  if (mapAnswer && encounter && !encounter.feedback) {
    await answer(mapAnswer.dataset.mapAnswer === encounter.prompt.answer);
    return;
  }
  const country = event.target.closest("[data-country]");
  if (country) {
    chooseCountry(country.dataset.country);
    return;
  }
  const b = event.target.closest("button");
  if (!b || b.disabled) return;
  if (b.dataset.president) {
    const q = route().q;
    q.set("select", "presidency-" + b.dataset.president);
    navigate("#/topic/presidents?" + q, true);
    return;
  }
  if (b.dataset.select) {
    const r = route();
    if (r.parts[0] === "concept") {
      navigate(
        "#/topic/" + byId[r.parts[1]].topic + "?select=" + b.dataset.select,
      );
      return;
    }
    const q = r.q;
    q.set("select", b.dataset.select);
    navigate("#" + r.path + "?" + q, true);
    return;
  }
  if (b.dataset.selectHome) {
    navigate("#/?select=" + b.dataset.selectHome, true);
    return;
  }
  if (b.dataset.save) {
    b.disabled = true;
    await record("saved", b.dataset.save);
    b.textContent = "✓ Saved to your trail";
    announce(
      store.temporary
        ? "Kept in this temporary session. Export to preserve it."
        : "Saved to your trail.",
    );
    return;
  }
  if (b.dataset.familiar) {
    b.disabled = true;
    await record("self_report", b.dataset.familiar, { method: "self_report" });
    b.textContent = "✓ Marked familiar";
    return;
  }
  if (b.dataset.answer !== undefined && encounter && !encounter.feedback) {
    await answer(Number(b.dataset.answer) === encounter.prompt.answer);
    return;
  }
  const action = b.dataset.action;
  if (action === "round-next" && round) {
    round.results.push({
      id: round.ids[round.index],
      outcome: encounter?.result ?? "unscored",
      assisted: encounter?.assistance !== "none" || encounter?.attempts > 1,
    });
    round.index++;
    encounter = null;
    render();
    return;
  }
  if (action === "round-restart") {
    round = null;
    encounter = null;
    render();
    return;
  }
  if (action === "back") {
    if (history.state?.from) history.back();
    else navigate(b.dataset.fallback);
  }
  if (action === "retry-save") {
    announce((await store.retry()) ? "Saved successfully." : store.message);
    status();
  }
  if (
    ["hint", "map-zoom"].includes(action) &&
    encounter &&
    !encounter.feedback
  ) {
    const c = encounter;
    if (action === "map-zoom") c.mapZoom = true;
    c.assistance = "hint";
    c.hint = true;
    await record("hint", c.concept, {
      encounterId: c.id,
      profileId: c.profileId,
      promptId: c.prompt.id,
      family: c.prompt.family,
    });
    if (encounter === c) {
      render(false);
      document.querySelector("#answer-0")?.focus({ preventScroll: true });
    }
  }
  if (action === "reveal" && encounter && !encounter.feedback) {
    const c = encounter;
    c.assistance = "answer_visible";
    c.feedback = "Exploration counts, too.";
    await record("revealed", c.concept, {
      encounterId: c.id,
      profileId: c.profileId,
      promptId: c.prompt.id,
      family: c.prompt.family,
    });
    if (encounter === c) {
      render(false);
      document.querySelector("#feedback")?.focus({ preventScroll: true });
    }
  }
  if (action === "try-again" && encounter) {
    encounter.assistance = "retry";
    encounter.feedback = null;
    render(false);
    document.querySelector("#answer-0")?.focus({ preventScroll: true });
  }
  if (action === "export") {
    const blob = new Blob([JSON.stringify(store.backup(), null, 2)], {
        type: "application/json",
      }),
      url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download =
      "curiosity-atlas-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce("Backup downloaded. It may contain private legacy notes.");
  }
  if (action === "import-confirm" && pendingImport) {
    b.disabled = true;
    try {
      profile = await store.importBackup(
        pendingImport,
        document.querySelector("#merge-import").checked,
      );
      pendingImport = null;
      navigate("#/trail");
      announce("Backup saved. Your imported profile is selected.");
    } catch (e) {
      b.disabled = false;
      document.querySelector("#import-error").textContent = e.message;
    }
  }
});
document.addEventListener(
  "toggle",
  (event) => {
    if (event.target.matches(".text-equivalent") && event.target.open) {
      const t = topicById[route().parts[1]];
      for (const id of t?.items ?? []) void record("opened", id);
    }
  },
  true,
);
document.addEventListener("input", (event) => {
  const id = event.target.id,
    v = Number(event.target.value);
  if (id === "growth-rate") {
    document.querySelector("#rate-label").textContent = v + "%";
    document.querySelector("#growth-chart").innerHTML = growthChart(v);
  }
  if (id === "efficiency-value") {
    document.querySelector("#efficiency-label").textContent =
      v + " J · " + v + "%";
    for (const [sel, n] of [
      ["useful-bar", v],
      ["other-bar", 100 - v],
    ]) {
      const el = document.getElementById(sel);
      el.style.width = n + "%";
      el.textContent = n + " J";
    }
  }
  if (id === "percent-rate") {
    document.querySelector("#percent-label").textContent = v + "%";
    document.querySelector("#percent-model").innerHTML = percentModel(v);
  }
  if (id === "demand-shift") {
    document.querySelector("#demand-label").textContent = v;
    document.querySelector("#market-chart").innerHTML = marketChart(v);
  }
  if (id === "sky-position") {
    const mode = document.querySelector("#sky-mode").value;
    document.querySelector("#sky-model").innerHTML = skyModel(mode, v);
    document.querySelector("#sky-label").textContent = (
      mode === "seasons"
        ? [
            "March equinox",
            "June solstice",
            "September equinox",
            "December solstice",
          ]
        : ["New Moon", "First quarter", "Full Moon", "Last quarter"]
    )[v];
  }
  if (event.target.id === "search-input") {
    const value = event.target.value;
    history.replaceState(
      history.state,
      "",
      "#/search?q=" + encodeURIComponent(value),
    );
    render.lastHash = location.hash;
    updateSearch(value);
  }
});
document.addEventListener("change", async (event) => {
  if (event.target.id === "country-select") chooseCountry(event.target.value);
  if (event.target.id === "orbit-scale") {
    const q = route().q;
    q.set("scale", event.target.value);
    navigate("#" + route().path + "?" + q, true);
  }
  if (event.target.id === "sky-mode") {
    document.querySelector("#sky-position").value = 0;
    document.querySelector("#sky-model").innerHTML = skyModel(
      event.target.value,
      0,
    );
    document.querySelector("#sky-label").textContent =
      event.target.value === "seasons" ? "March equinox" : "New Moon";
  }
  if (event.target.id === "president-era") {
    const q = route().q;
    q.set("era", event.target.value);
    q.set(
      "select",
      "presidency-" +
        { all: 47, founding: 1, civil: 16, industrial: 26, modern: 34 }[
          event.target.value
        ],
    );
    navigate("#/topic/presidents?" + q, true);
  }
  if (event.target.id === "map-region") {
    const q = route().q;
    q.set("region", event.target.value);
    navigate("#" + route().path + "?" + q, true);
  }
  if (event.target.id === "practice-map-region" && encounter) {
    encounter.mapRegion = event.target.value;
    encounter.mapZoom = false;
    document.querySelector("#practice-map").innerHTML = practiceMap(
      encounter.concept,
    );
  }
  if (event.target.id === "profile") {
    profile = event.target.value;
    render(false);
  }
  if (event.target.id === "import-file") {
    pendingImport = null;
    const node = document.querySelector("#import-preview");
    try {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024)
        throw Error("File exceeds 5 MB. Nothing was imported.");
      const data = parseBackup(await file.text());
      pendingImport = data;
      node.innerHTML = `<div class="import-summary"><h3>Ready to review</h3><p>${data.profiles.length} profiles · ${data.events.length} events · ${data.legacy.length} legacy snapshots</p><p>Default: preserve as separate imported profiles. Reimporting the identical backup is idempotent.</p><label><input id="merge-import" type="checkbox"> Merge matching stable profile IDs (only for your own backup)</label><button class="button" data-action="import-confirm">Import this backup</button><p id="import-error" role="alert"></p></div>`;
    } catch (e) {
      node.textContent = e.message;
    }
  }
});
function practiceMap(id) {
  const c = countries.find((c) => c.id === id);
  let html = worldMap(
    encounter.feedback ? id : null,
    esc,
    !encounter.feedback,
    encounter.mapZoom ? "World" : (encounter.mapRegion ?? c?.continent),
  );
  if (encounter.mapZoom && c)
    html = html.replace(
      /viewBox="[^"]+"/,
      `viewBox="${(c.lon + 180) * 2 - 8} ${(90 - c.lat) * 2 - 8} 16 16"`,
    );
  return html;
}
function mapRound() {
  if (!round) {
    const ids = countries.map((c) => c.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const values = new Uint32Array(1);
      crypto.getRandomValues(values);
      const j = values[0] % (i + 1);
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    round = { ids: ids.slice(0, 5), index: 0, results: [] };
  }
  if (round.index >= 5)
    return `<section class="page-intro"><p class="eyebrow">Five places · a small journey</p><h1>Keep the map<br><em>in mind.</em></h1><p>These are the places you encountered. Untouched countries remain unknown.</p><div class="saved-list">${round.results.map((r) => `<div>${link(r.id)}<p>${r.outcome === "unscored" ? "Explored with answer shown" : r.assisted ? "Assisted practice" : r.outcome === "correct" ? "Located this time" : "Tried · revisit the explanation"}</p></div>`).join("")}</div><button class="button" data-action="round-restart">Five more places →</button> <a href="#/topic/world-atlas">Explore the full atlas →</a></section>`;
  return `<p class="round-progress">Place ${round.index + 1} of 5 · no timer · all 193 UN member states eligible</p>${practicePage(round.ids[round.index])}<p class="small">End the round whenever you like. Leaving adds no misses for remaining targets.</p>`;
}
function nextPractice(current) {
  const due = dueConcepts(events()).filter((id) => id !== current);
  if (due.length) return due[0];
  const practiced = new Set(
    events()
      .filter((e) => e.kind === "attempt")
      .map((e) => e.conceptId),
  );
  const currentArea = topicById[byId[current].topic].area;
  const fresh = prompts.filter(
    (p) => p.concept !== current && !practiced.has(p.concept),
  );
  return (
    fresh.find((p) => topicById[byId[p.concept].topic].area !== currentArea) ??
    fresh[0] ??
    prompts.find((p) => p.concept !== current)
  ).concept;
}
function chooseCountry(code) {
  const c = countries.find((c) => c.code === code);
  if (c) {
    const q = route().q;
    q.set("select", c.id);
    navigate("#/topic/world-atlas?" + q, true);
  }
}
async function answer(correct) {
  const current = encounter;
  if (!current || current.feedback) return;
  current.result = correct ? "correct" : "incorrect";
  current.feedback = correct
    ? "That connection fits."
    : "Here’s the useful distinction.";
  current.attempts++;
  const p = current.prompt;
  await record("attempt", current.concept, {
    encounterId: current.id,
    profileId: current.profileId,
    promptId: p.id,
    promptRevision: 1,
    family: p.family,
    method: p.method ?? "recognition",
    outcome: current.result,
    assistance: current.attempts > 1 ? "retry" : current.assistance,
    priorAttemptCount: current.attempts - 1,
  });
  if (encounter === current) {
    render(false);
    document.querySelector("#feedback")?.focus({ preventScroll: true });
    document.querySelector("#feedback")?.scrollIntoView({ block: "nearest" });
  }
}
document.addEventListener("submit", async (e) => {
  if (e.target.id === "country-search-form") {
    e.preventDefault();
    const q = route().q;
    q.set("find", document.querySelector("#country-find").value);
    navigate("#" + route().path + "?" + q, true);
  }
  if (e.target.id === "recall-form") {
    e.preventDefault();
    if (encounter && !encounter.feedback) {
      const value = normalizeRecall(
        document.querySelector("#recall-answer").value,
      );
      if (!value) return;
      await answer(
        encounter.prompt.accepted.some((x) => normalizeRecall(x) === value),
      );
    }
  }
});
document.addEventListener("keydown", (e) => {
  if (
    e.target.matches("[data-country],[data-map-answer]") &&
    ["Enter", " "].includes(e.key)
  ) {
    e.preventDefault();
    e.target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
});
// Old astronomy registrations have their own scope. Update only the known same-site worker.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((rs) => {
      const target = new URL("../moonsAndPlanets/", import.meta.url).href;
      for (const r of rs) if (r.scope === target) r.update().catch(() => {});
    })
    .catch(() => {});
}
await store.init();
history.replaceState({ ...history.state, atlas: true }, "");
render(false);

void startOffline();
