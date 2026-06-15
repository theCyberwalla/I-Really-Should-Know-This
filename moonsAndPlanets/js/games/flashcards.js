/* flashcards.js */
(function () {
  const S = window.Store;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function mount(c) {
    let deck = S.allMoons.slice();
    // shuffle
    for (let i = deck.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[deck[i], deck[j]] = [deck[j], deck[i]]; }
    let i = 0, got = 0, flipped = false;

    function render() {
      if (i >= deck.length) return finish();
      const m = deck[i];
      c.innerHTML = `
        <div class="game-wrap">
          <button class="back" data-route="#/play">← Games</button>
          <div class="game-head"><h1>🃏 Flashcards</h1><span class="pill">${i + 1} / ${deck.length}</span></div>
          <div class="progressbar"><i style="width:${(i / deck.length) * 100}%"></i></div>
          <div class="flash" id="flash">
            <div class="flash-inner">
              <div class="flash-face front">
                <img src="${m.image}" alt="${esc(m.name)}">
                <div class="big">${esc(m.name)}</div>
                <div class="flash-hint">Moon of ${esc(m.planetName)} · tap to reveal</div>
              </div>
              <div class="flash-face back">
                <div class="big">${esc(m.name)}</div>
                <ul class="facts" style="text-align:left">${m.facts.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
              </div>
            </div>
          </div>
          <div class="btn-row">
            <button class="btn alt block" id="again">↻ Review again</button>
            <button class="btn block" id="got">✓ Got it</button>
          </div>
        </div>`;
      flipped = false;
      const flash = c.querySelector('#flash');
      flash.onclick = () => { flipped = !flipped; flash.classList.toggle('flipped', flipped); };
      c.querySelector('#got').onclick = () => { got++; S.markSeen(m.id); S.bumpMastery(m.planetId, 8); next(); };
      c.querySelector('#again').onclick = () => { deck.push(m); next(); };
    }
    function next() { i++; render(); }
    function finish() {
      const xp = got * 5; S.addXp(xp);
      const newly = S.checkBadges();
      c.innerHTML = `
        <div class="result">
          <div class="score">${got}</div>
          <p class="lead">cards mastered</p>
          <div class="xp">+${xp} XP</div>
        </div>
        <div class="btn-row">
          <button class="btn block" data-route="#/game/flashcards">Play again</button>
          <button class="btn alt block" data-route="#/play">Back to games</button>
        </div>`;
      window.App.afterGame(newly);
    }
    render();
  }
  window.GameFlashcards = { mount };
})();
