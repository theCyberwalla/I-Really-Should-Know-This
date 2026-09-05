import { planets, moons } from "./astronomy.js";
import { geographyView } from "./geography.js";
export function compound(principal, rate, years) {
  return principal * (1 + rate / 100) ** years;
}
export function model(t, c, esc, q = new URLSearchParams()) {
  if (t.type === "map") return geographyView(c.id, esc, q);
  if (t.type === "solar") {
    const scale = q.get("scale") ?? "log",
      max = 40;
    return `<div class="space-model"><p class="eyebrow">One solar neighborhood</p><h2>Distance is the story.</h2><div class="model-controls"><label for="orbit-scale">Compare</label><select id="orbit-scale"><option value="log" ${scale === "log" ? "selected" : ""}>Distance · logarithmic</option><option value="linear" ${scale === "linear" ? "selected" : ""}>Distance · linear</option><option value="size" ${scale === "size" ? "selected" : ""}>Planet diameter · linear</option></select></div><div class="planet-rows">${planets.map((p) => `<button id="select-${p.id}" data-select="${p.id}" aria-pressed="${p.id === c.id}"><b>${p.name}</b><span class="orbit-track">${scale === "size" ? `<i class="planet-size" style="width:${(p.diameter / 142984) * 100}%;aspect-ratio:1"></i>` : `<i class="orbit-dot" style="left:${(scale === "linear" ? p.au / max : Math.log10(p.au / 0.3) / Math.log10(max / 0.3)) * 96}%"></i>`}</span><small>${scale === "size" ? p.diameter.toLocaleString("en-US") + " km" : p.au + " AU"}</small></button>`).join("")}</div><p class="visual-caption">${scale === "size" ? "Diameters share one linear scale. Small worlds really are small beside Jupiter." : scale === "linear" ? "Positions are proportional to mean distance from the Sun (0 at left; 40 AU at right). Each row is separate so inner worlds remain selectable." : "Logarithmic axis: equal spatial intervals mean equal distance ratios. This makes inner and outer worlds readable together."}</p></div>`;
  }
  if (t.type === "moons")
    return `<div class="space-model"><p class="eyebrow">Six satellite worlds</p><h2>A moon can be larger<br>than a planet.</h2><p class="small">Shared diameter scale · Ganymede = 100%</p>${moons.map((m) => `<button class="moon-row" data-select="${m.id}" id="select-${m.id}" aria-pressed="${m.id === c.id}"><span class="moon-track"><i style="width:${(m.diameter / 5268) * 100}%"></i></span><span><strong>${m.name}</strong><small>${m.parent} · ${m.diameter.toLocaleString("en-US")} km</small></span></button>`).join("")}<p class="small">Ganymede is wider than Mercury, but less massive. Size alone does not determine whether a body is a planet or moon.</p></div>`;
  if (t.type === "compound")
    return `<div class="interactive-model"><p class="eyebrow">Try a hypothetical rate</p><h2>Watch time do the work.</h2><label for="growth-rate">Annual rate: <output id="rate-label">5%</output></label><input id="growth-rate" type="range" min="0" max="12" value="5" step="1"><div id="growth-chart">${growthChart(5)}</div><p class="small">$1,000 initially, annual compounding, no later deposits, tax or fees. Constant hypothetical growth is not a return forecast.</p></div>`;
  if (t.type === "energy")
    return `<div class="interactive-model"><p class="eyebrow">100 joules in</p><h2>Every joule<br>goes somewhere.</h2><label for="efficiency-value">Useful output: <output id="efficiency-label">30 J · 30%</output></label><input id="efficiency-value" type="range" min="0" max="100" value="30"><div class="energy-bar"><span id="useful-bar" style="width:30%">30 J</span><span id="other-bar" style="width:70%">70 J</span></div><div class="legend"><span>Useful output</span><span>Other transfers</span></div><p class="small">The two outputs always sum to 100 J. “Other” energy has not disappeared; it is less useful for this defined task.</p></div>`;
  if (t.type === "percent")
    return `<div class="interactive-model"><p class="eyebrow">An invented rate</p><h2>Keep the baseline<br>in view.</h2><label for="percent-rate">Change 10% to: <output id="percent-label">15%</output></label><input id="percent-rate" type="range" min="0" max="30" value="15"><div id="percent-model">${percentModel(15)}</div><p class="small">Percent change = (new − old) ÷ old × 100. Percentage points = new − old.</p></div>`;
  if (t.type === "probability")
    return `<div class="interactive-model"><p class="eyebrow">Four equally likely outcomes</p><h2>Two independent<br>fair coin tosses.</h2><div class="coin-grid">${["HH", "HT", "TH", "TT"].map((x) => `<div class="${x === "HH" ? "chosen" : ""}"><b>${x[0]}</b><b>${x[1]}</b><small>${x === "HH" ? "Both heads" : "Not both heads"} · 25%</small></div>`).join("")}</div><p>One of four outcomes is HH, so the chance of both heads is 25%.</p><details><summary>Compare the invented testing example</summary><table><caption>1,000 people · invented test</caption><tr><th></th><th>Positive</th><th>Negative</th></tr><tr><th>Condition present</th><td>9</td><td>1</td></tr><tr><th>Condition absent</th><td>99</td><td>891</td></tr></table><p>9 ÷ (9 + 99) = 8.3% of positive results are true positives.</p></details></div>`;
  if (t.type === "market")
    return `<div class="interactive-model"><p class="eyebrow">A simplified market</p><h2>Shift demand.<br>Find a new balance.</h2><label for="demand-shift">Demand shift: <output id="demand-label">0</output></label><input id="demand-shift" type="range" min="-20" max="20" value="0"><div id="market-chart">${marketChart(0)}</div><p class="small">Invented linear curves: supply P = Q; demand P = 100 + shift − Q. Other conditions are fixed. Not an estimate of a real market.</p></div>`;
  if (t.type === "sky")
    return `<div class="space-model"><p class="eyebrow">A change in geometry</p><h2>Same sunlight.<br>A changing view.</h2><label for="sky-mode">Explore</label><select id="sky-mode"><option value="phases">Moon phases</option><option value="seasons">Earth’s seasons</option></select><div id="sky-model">${skyModel("phases", 0)}</div><label for="sky-position">Position: <output id="sky-label">New Moon</output></label><input id="sky-position" type="range" min="0" max="3" step="1" value="0"></div>`;
  const kind =
    t.type === "cycle"
      ? "cycle"
      : t.type === "comparison"
        ? "comparison"
        : "flow";
  return `<div class="mechanism ${kind}"><p class="eyebrow">${kind === "cycle" ? "Follow the transfers" : kind === "comparison" ? "Compare the roles" : "Follow the mechanism"}</p><h2>${esc(c.label)}</h2><div class="mechanism-steps">${c.diagram.map(([label, body], i) => `<div><span class="step-index">${String(i + 1).padStart(2, "0")}</span><h3>${esc(label)}</h3><p>${esc(body)}</p>${kind === "flow" && i < c.diagram.length - 1 ? '<b class="flow-arrow" aria-hidden="true">↓</b>' : ""}</div>`).join("")}</div><p class="visual-caption">${esc(c.diagramNote)}</p></div>`;
}
export function growthChart(rate) {
  const pts = Array.from(
      { length: 21 },
      (_, i) => `${40 + i * 20},${220 - (compound(1000, rate, i) / 1000) * 18}`,
    ).join(" "),
    end = compound(1000, rate, 20);
  return `<svg viewBox="0 0 480 250" role="img" aria-label="Balance grows from 1000 dollars to ${end.toFixed(0)} dollars over 20 years"><path d="M40 20V220H450" fill="none" stroke="currentColor"/><polyline points="${pts}" fill="none" stroke="#b45836" stroke-width="4"/><text x="42" y="242">0 years</text><text x="384" y="242">20 years</text><text x="44" y="20">Fixed vertical scale: $0–$11,000</text></svg><p class="model-result">After 20 years: <strong>$${Math.round(end).toLocaleString("en-US")}</strong></p>`;
}
export function percentModel(value) {
  return `<div class="percent-bars"><div><b>Before · 10%</b><i style="width:33.33%"></i></div><div><b>After · ${value}%</b><i style="width:${(value / 30) * 100}%"></i></div></div><p class="model-result"><strong>${value - 10} percentage points</strong><br>${(value - 10) * 10}% relative change from 10%</p>`;
}
export function marketChart(shift) {
  const q = (100 + shift) / 2,
    p = q;
  return `<svg viewBox="0 0 300 250" role="img" aria-label="Illustrative equilibrium quantity ${q}, price ${p}"><path d="M40 20V210H280" fill="none" stroke="currentColor"/><path d="M40 210L260 30" stroke="#39776b" stroke-width="3"/><path d="M40 ${30 - shift * 1.8}L260 ${210 - shift * 1.8}" stroke="#b45836" stroke-width="3"/><circle cx="${40 + q * 2.2}" cy="${210 - p * 1.8}" r="6" fill="#142f2b"/><text x="10" y="18">Price</text><text x="210" y="240">Quantity</text><text x="210" y="30">Supply</text><text x="185" y="${205 - shift * 1.8}">Demand</text></svg><p class="model-result">Equilibrium: quantity <strong>${q}</strong>, price <strong>${p}</strong> (arbitrary units).</p>`;
}
export function skyModel(mode, pos) {
  if (mode === "seasons") {
    const labels = [
      "March equinox",
      "June solstice",
      "September equinox",
      "December solstice",
    ];
    return `<svg viewBox="0 0 420 230" role="img" aria-label="${labels[pos]}. ${pos === 1 ? "Northern hemisphere tilted toward the Sun" : pos === 3 ? "Southern hemisphere tilted toward the Sun" : "Neither hemisphere tilted toward the Sun"}"><circle cx="210" cy="110" r="27" fill="#e9c576"/><ellipse cx="210" cy="110" rx="145" ry="75" stroke="#a4b5ae" fill="none"/>${[
      [210, 35],
      [355, 110],
      [210, 185],
      [65, 110],
    ]
      .map(
        ([x, y], i) =>
          `<g opacity="${i === pos ? 1 : 0.3}"><circle cx="${x}" cy="${y}" r="17" fill="#7aab9b"/><path d="M${x - 11} ${y - 26}L${x + 11} ${y + 26}" stroke="white" stroke-width="3"/><text x="${x - 17}" y="${y - 30}" fill="white">N</text></g>`,
      )
      .join(
        "",
      )}</svg><p>${labels[pos]} · ${pos === 1 ? "North toward Sun; south away." : pos === 3 ? "South toward Sun; north away." : "Neither hemisphere tilted toward Sun."}</p><p class="small">Schematic orbital view. Axis direction stays fixed; positions are not to scale.</p>`;
  }
  return `<div class="phase-disk phase-${pos}" role="img" aria-label="${["New Moon", "First quarter", "Full Moon", "Last quarter"][pos]}"></div><p>${["New Moon · visible disk mostly dark", "First quarter · half of visible disk lit", "Full Moon · visible disk lit", "Last quarter · half of visible disk lit"][pos]}</p><p class="small">Sunlight illuminates half the Moon; we see different fractions of that half. Simplified Northern Hemisphere orientation, not tonight’s phase.</p>`;
}
