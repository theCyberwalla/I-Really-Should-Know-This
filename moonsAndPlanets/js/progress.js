/* progress.js — Play hub + Progress dashboard */
(function () {
  const S = window.Store, DATA = S.DATA;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function play() {
    const b = S.get().bestScores;
    const game = (route, icon, title, desc, key) => `
      <button class="quick" style="display:flex" data-route="${route}">
        <div style="display:flex;gap:12px;align-items:center;width:100%">
          <span class="qi">${icon}</span>
          <span style="text-align:left;flex:1">
            <span class="qt" style="display:block">${title}</span>
            <span class="qd">${desc}</span>
          </span>
          ${key && b[key] != null ? `<span class="pill gold">best ${b[key]}</span>` : ''}
        </div>
      </button>`;
    return `
      <h1>🎮 Play</h1>
      <p class="lead">Four ways to lock in the planets and moons.</p>
      <div class="grid" style="gap:12px;margin-top:8px">
        ${game('#/game/flashcards', '🃏', 'Flashcards', 'Flip cards to study moons and their facts')}
        ${game('#/game/quiz', '🎯', 'Multiple-choice Quiz', '10 questions, streak bonuses', 'quiz')}
        ${game('#/game/match', '🔗', 'Match Game', 'Pair moons to their planets, beat the clock', 'match')}
        ${game('#/game/mnemonic', '🧠', 'Mnemonic Challenge', 'Recall each planet’s moon group in order', 'mnemonic')}
      </div>`;
  }

  function progress() {
    const st = S.get(), lv = S.level(st.xp);
    const masteryRows = DATA.planets.filter((p) => p.moons.length).map((p) => {
      const v = st.mastery[p.id] || 0;
      return `<div class="row">
        <img src="${p.image}" alt=""><span class="nm">${esc(p.name)}</span>
        <span class="bar"><i style="width:${v}%"></i></span>
        <span class="sub" style="width:36px;text-align:right">${v}%</span>
      </div>`;
    }).join('');
    const badges = S.BADGES.map((bd) => `
      <div class="badge ${st.badges[bd.id] ? 'earned' : ''}">
        <div class="bi">${bd.icon}</div><div class="bn">${esc(bd.name)}</div><div class="bd">${esc(bd.desc)}</div>
      </div>`).join('');
    const earned = Object.keys(st.badges).length;
    return `
      <h1>⭐ Progress</h1>
      <div class="stat-grid">
        <div class="stat"><div class="v">${lv.level}</div><div class="l">Level</div></div>
        <div class="stat"><div class="v">${st.streak}🔥</div><div class="l">Day streak</div></div>
        <div class="stat"><div class="v">${earned}/${S.BADGES.length}</div><div class="l">Badges</div></div>
      </div>
      <div class="section-title">Level ${lv.level} · ${lv.into}/${lv.need} XP to next</div>
      <div class="progressbar"><i style="width:${lv.pct}%"></i></div>

      <div class="section-title">Planet mastery</div>
      <div class="mastery">${masteryRows}</div>

      <div class="section-title">Badges</div>
      <div class="badges">${badges}</div>

      <div class="btn-row" style="margin-top:22px">
        <button class="btn alt block" id="resetBtn">Reset all progress</button>
      </div>`;
  }

  function bind(c) {
    const r = c.querySelector('#resetBtn');
    if (r) r.onclick = () => {
      if (confirm('Reset all XP, streak, mastery and badges?')) { S.reset(); window.App.go('#/progress'); }
    };
  }

  window.Progress = { play, progress, bind };
})();
