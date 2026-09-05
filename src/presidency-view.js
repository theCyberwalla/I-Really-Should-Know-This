import { presidents, presidencyConcepts } from "./presidents.js";
export function presidencyView(q, escape) {
  const era = q.get("era") ?? "all",
    ranges = {
      all: [1789, 2027],
      founding: [1789, 1861],
      civil: [1861, 1901],
      industrial: [1901, 1946],
      modern: [1946, 2027],
    },
    range = ranges[era] ?? ranges.all;
  const list = presidents.filter(
    (p) =>
      Number(p.start.slice(0, 4)) >= range[0] &&
      Number(p.start.slice(0, 4)) < range[1],
  );
  const n = Number(
    (q.get("select") ?? "presidency-47").replace("presidency-", ""),
  );
  const selected = list.find((p) => p.number === n) ?? list[0];
  const concept = presidencyConcepts.find(
    (c) => c.id === "presidency-" + selected.number,
  );
  return `<div class="topic-intro"><div><p class="eyebrow">History / the complete presidential chronology</p><h1>47 presidencies.<br><em>45 different people.</em></h1><p class="lede">Every numbered presidency, from Washington to the current officeholder. Select a term to place it in context.</p></div></div><nav class="lens-tabs" aria-label="Presidential lens"><a aria-current="page" href="#/topic/presidents">All presidents</a><a href="#/topic/presidents?lens=institutions">How the office works</a></nav><div class="president-toolbar"><label for="president-era">Browse an era</label><select id="president-era">${Object.entries(
    {
      all: "All 47 presidencies",
      founding: "1789–1860 · Early republic",
      civil: "1861–1900 · Civil War and after",
      industrial: "1901–1945 · A changing world",
      modern: "1946–present · Postwar to today",
    },
  )
    .map(
      ([id, label]) =>
        `<option value="${id}" ${era === id ? "selected" : ""}>${label}</option>`,
    )
    .join(
      "",
    )}</select><span>${list.length} presidencies shown</span></div><section class="presidential-atlas"><div class="president-list" aria-label="Presidencies in chronological order">${list.map((p) => `<button id="term-${p.number}" data-president="${p.number}" aria-pressed="${p.number === selected.number}"><span class="president-number">${p.number}</span><span><strong>${escape(p.name)}</strong><small>${p.start} → ${p.end ?? "present"}</small></span><span class="term-duration" aria-hidden="true"><i style="width:${Math.max(1, ((Date.parse(p.end ?? "2026-09-05") - Date.parse(p.start)) / 86400000 / 4422) * 100)}%"></i></span></button>`).join("")}</div><aside class="president-context" aria-live="polite"><span class="eyebrow">Number ${selected.number} · in focus</span><div class="president-monogram" aria-hidden="true">${selected.name
    .split(" ")
    .filter((w) => w.length > 2)
    .map((w) => w[0])
    .slice(0, 2)
    .join(
      "",
    )}</div><h2>${escape(selected.name)}</h2><p class="small">${selected.start} — ${selected.end ?? "present · verified 5 Sep 2026"}</p><p>${escape(selected.context)}</p><p>${escape(concept.why)}</p><a class="button" href="#/concept/presidency-${selected.number}">Explore this presidency ↗</a><p class="small">${[22, 24, 45, 47].includes(selected.number) ? "Nonconsecutive presidencies: Cleveland is 22 and 24; Trump is 45 and 47." : "Term bars show elapsed time in office on a shared scale, with Franklin D. Roosevelt’s service as the longest reference."}</p><a class="small" target="_blank" rel="noreferrer" href="${selected.source}">University of Virginia biography ↗</a></aside></section><p class="scope">Numbering follows presidencies, not unique people or election cycles. Current officeholder verified with the White House and Congress on 5 September 2026. Public oath ceremonies can occur on a different day from a term boundary. These entries offer factual starting points, not evaluations of presidents.</p>`;
}
