/* explore.js — Home + Explore + detail views */
(function () {
  const S = window.Store, DATA = S.DATA;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function articleBlock(title, paras) {
    if (!paras || !paras.length) return '';
    return `<div class="section-title">${esc(title)}</div>
      <div class="article">${paras.map((p) => `<p>${esc(p)}</p>`).join('')}</div>`;
  }

  function planetCard(p) {
    const sub = p.moons.length
      ? `<span class="badge-moons">${p.moons.length} moon${p.moons.length > 1 ? 's' : ''}</span>`
      : `<span class="sub">No moons</span>`;
    return `<button class="card" data-route="#/planet/${p.id}">
      <div class="thumb"><img src="${p.image}" alt="${esc(p.name)}" loading="lazy"></div>
      <div class="title">${esc(p.name)} ${p.type === 'dwarf' ? '<span class="pill">dwarf</span>' : ''}</div>
      ${sub}
    </button>`;
  }

  function home() {
    const st = S.get(), lv = S.level(st.xp);
    const orbit = DATA.planets.map((p) =>
      `<button data-route="#/planet/${p.id}"><img src="${p.image}" alt="${esc(p.name)}"><span>${esc(p.name)}</span></button>`
    ).join('');
    return `
    <div class="hero-home">
      <div class="sun"></div>
      <h1>Moons &amp; Planets</h1>
      <p class="lead">Explore the Solar System's most notable moons — then test yourself with four games.</p>
    </div>
    <div class="orbit-row">${orbit}</div>

    <div class="section-title">Jump into a game</div>
    <div class="quick">
      <button data-route="#/game/flashcards"><span class="qi">🃏</span><span class="qt">Flashcards</span><span class="qd">Flip to learn moons &amp; facts</span></button>
      <button data-route="#/game/quiz"><span class="qi">🎯</span><span class="qt">Quiz</span><span class="qd">Multiple-choice trivia</span></button>
      <button data-route="#/game/match"><span class="qi">🔗</span><span class="qt">Match</span><span class="qd">Pair moons to planets</span></button>
      <button data-route="#/game/mnemonic"><span class="qi">🧠</span><span class="qt">Mnemonics</span><span class="qd">Recall each moon group</span></button>
    </div>

    <div class="section-title">Your progress</div>
    <div class="stat-grid">
      <div class="stat"><div class="v">${lv.level}</div><div class="l">Level</div></div>
      <div class="stat"><div class="v">${st.xp}</div><div class="l">XP</div></div>
      <div class="stat"><div class="v">${st.streak}🔥</div><div class="l">Day streak</div></div>
    </div>`;
  }

  function explore() {
    const cards = DATA.planets.map(planetCard).join('');
    return `
    <h1>Explore</h1>
    <p class="lead">Tap a planet to meet its moons.</p>
    <div class="btn-row">
      <button class="btn alt" data-route="#/top10">🏆 Top 10 Moons</button>
      <button class="btn alt" data-route="#/tricks">🧠 Memory Tricks</button>
    </div>
    <div class="section-title">Planets &amp; dwarf planet</div>
    <div class="grid planets">${cards}</div>`;
  }

  function planetView(id) {
    const p = S.planet(id);
    if (!p) return `<p>Not found.</p>`;
    const mnem = p.mnemonic
      ? `<div class="mnemonic-chip">🧠 <b>${esc(p.mnemonic.label)}</b> — ${p.mnemonic.members.map(esc).join(', ')}</div>` : '';
    const factBlock = p.memorableFact
      ? `<ul class="facts"><li>${esc(p.memorableFact)}</li></ul>` : '';
    const moons = p.moons.length
      ? `<div class="section-title">Moons (${p.moons.length})</div>
         <div class="grid moons">${p.moons.map((m) => `
           <button class="card" data-route="#/moon/${m.id}">
             <div class="thumb"><img src="${m.image}" alt="${esc(m.name)}" loading="lazy"></div>
             <div class="title">${esc(m.name)}</div>
             ${m.top10 ? `<span class="pill gold">Top 10 · #${m.top10.rank}</span>` : `<span class="sub">${esc(m.facts[0])}</span>`}
           </button>`).join('')}</div>`
      : `<p class="lead">${esc(p.name)} has no moons.</p>`;
    return `
    <button class="back" data-route="#/explore">← Explore</button>
    <div class="hero">
      <img src="${p.image}" alt="${esc(p.name)}">
      <div class="h-meta">
        <h1>${esc(p.name)} ${p.type === 'dwarf' ? '<span class="pill">dwarf planet</span>' : ''}</h1>
        <p class="lead">${esc(p.summary)}</p>
        ${mnem}
      </div>
    </div>
    ${factBlock}
    ${moons}
    ${articleBlock('About ' + p.name, p.article)}`;
  }

  function moonView(id) {
    const m = S.moon(id);
    if (!m) return `<p>Not found.</p>`;
    S.markSeen(m.id);
    const facts = m.facts.map((f) => `<li>${esc(f)}</li>`).join('');
    return `
    <button class="back" data-route="#/planet/${m.planetId}">← ${esc(m.planetName)}</button>
    <div class="hero">
      <img src="${m.image}" alt="${esc(m.name)}">
      <div class="h-meta">
        <h1>${esc(m.name)}</h1>
        <p class="lead">Moon of ${esc(m.planetName)}</p>
        ${m.top10 ? `<span class="pill gold">Top 10 · #${m.top10.rank} — ${esc(m.top10.hook)}</span>` : ''}
      </div>
    </div>
    <div class="section-title">Memorable facts</div>
    <ul class="facts">${facts}</ul>
    ${articleBlock('About ' + m.name, m.article)}`;
  }

  function top10() {
    const rows = DATA.top10.map((t) => {
      const m = S.moon(t.moonId);
      return `<button class="card" data-route="#/moon/${t.moonId}" style="flex-direction:row;align-items:center;gap:12px">
        <div style="font-size:22px;font-weight:900;color:var(--gold);width:34px">#${t.rank}</div>
        <img src="${m.image}" alt="${esc(t.name)}" style="width:48px;height:48px;object-fit:contain">
        <div style="text-align:left"><div class="title">${esc(t.name)}</div><div class="sub">${esc(t.hook)}</div></div>
      </button>`;
    }).join('');
    return `<button class="back" data-route="#/explore">← Explore</button>
      <h1>🏆 Top 10 Memorable Moons</h1>
      <div class="grid" style="margin-top:10px">${rows}</div>`;
  }

  function tricks() {
    const cards = DATA.planets.filter((p) => p.mnemonic).map((p) => `
      <div class="card" style="cursor:default">
        <div class="title">${esc(p.name)} — ${esc(p.mnemonic.label)}</div>
        <div class="sub">${p.mnemonic.members.map(esc).join(' · ')}</div>
      </div>`).join('');
    return `<button class="back" data-route="#/explore">← Explore</button>
      <h1>🧠 Memory Tricks</h1>
      <p class="lead">Mnemonic groupings to remember which moons belong to which planet.</p>
      <div class="grid" style="margin-top:10px">${cards}</div>`;
  }

  window.Explore = { home, explore, planetView, moonView, top10, tricks };
})();
