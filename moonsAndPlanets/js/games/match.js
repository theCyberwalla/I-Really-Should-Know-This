/* match.js — pair moons to their planet */
(function () {
  const S = window.Store, DATA = S.DATA;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; };

  function mount(c) {
    const planets = shuffle(S.planetsWithMoons().slice()).slice(0, 5);
    const pairs = planets.map((p) => ({ planetId: p.id, planetName: p.name, moon: shuffle(p.moons.slice())[0] }));
    const moons = shuffle(pairs.map((x) => ({ id: x.moon.id, name: x.moon.name, image: x.moon.image, planetId: x.planetId })));
    const planetTiles = shuffle(pairs.map((x) => ({ planetId: x.planetId, name: x.planetName })));
    let selMoon = null, matched = 0, misses = 0;
    const start = Date.now();

    c.innerHTML = `
      <div class="game-wrap">
        <button class="back" data-route="#/play">← Games</button>
        <div class="game-head"><h1>🔗 Match</h1><span class="pill" id="hud">0 / ${pairs.length}</span></div>
        <p class="lead">Tap a moon, then its planet.</p>
        <div class="match-grid">
          <div class="match-col"><h4>Moons</h4>${moons.map((m) =>
            `<button class="mtile" data-kind="moon" data-id="${m.id}" data-planet="${m.planetId}">
               <img src="${m.image}" alt=""><span>${esc(m.name)}</span></button>`).join('')}</div>
          <div class="match-col"><h4>Planets</h4>${planetTiles.map((p) =>
            `<button class="mtile" data-kind="planet" data-planet="${p.planetId}">🪐 ${esc(p.name)}</button>`).join('')}</div>
        </div>
      </div>`;

    const hud = c.querySelector('#hud');
    c.querySelectorAll('.mtile').forEach((t) => {
      t.onclick = () => {
        if (t.dataset.kind === 'moon') {
          c.querySelectorAll('[data-kind=moon]').forEach((x) => x.classList.remove('sel'));
          t.classList.add('sel'); selMoon = t;
        } else {
          if (!selMoon) return;
          if (selMoon.dataset.planet === t.dataset.planet) {
            selMoon.classList.add('done'); t.classList.add('done');
            selMoon = null; matched++; hud.textContent = `${matched} / ${pairs.length}`;
            if (matched === pairs.length) finish();
          } else {
            misses++;
            t.classList.add('miss'); selMoon.classList.add('miss');
            const sm = selMoon;
            setTimeout(() => { t.classList.remove('miss'); sm.classList.remove('miss'); }, 320);
          }
        }
      };
    });

    function finish() {
      const secs = Math.round((Date.now() - start) / 1000);
      const score = Math.max(10, 100 - misses * 10 - Math.max(0, secs - 15) * 2);
      S.addXp(score); S.setBest('match', score);
      planets.forEach((p) => S.bumpMastery(p.id, 5));
      const newly = S.checkBadges();
      setTimeout(() => {
        c.innerHTML = `
          <div class="result">
            <div class="score">${score}</div>
            <p class="lead">${secs}s · ${misses} mismatch${misses === 1 ? '' : 'es'}</p>
            <div class="xp">+${score} XP · best ${S.get().bestScores.match}</div>
          </div>
          <div class="btn-row">
            <button class="btn block" data-route="#/game/match">Play again</button>
            <button class="btn alt block" data-route="#/play">Back to games</button>
          </div>`;
        window.App.afterGame(newly);
      }, 450);
    }
  }
  window.GameMatch = { mount };
})();
