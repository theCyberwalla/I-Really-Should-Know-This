/* mnemonic.js — recall each planet's moon group in order */
(function () {
  const S = window.Store, DATA = S.DATA;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; };

  function mount(c) {
    const rounds = shuffle(DATA.planets.filter((p) => p.mnemonic && p.mnemonic.members.length > 1).slice());
    let ri = 0, score = 0;

    function render() {
      if (ri >= rounds.length) return finish();
      const p = rounds[ri], members = p.mnemonic.members;
      // distractors: moon names from other planets
      const others = shuffle(S.allMoons.filter((m) => m.planetId !== p.id).map((m) => m.name));
      const distractors = others.slice(0, 2);
      const tokens = shuffle(members.concat(distractors));
      let pos = 0, miss = 0;

      c.innerHTML = `
        <div class="game-wrap">
          <button class="back" data-route="#/play">← Games</button>
          <div class="game-head"><h1>🧠 Mnemonics</h1><span class="pill">${ri + 1} / ${rounds.length} · ${score} pts</span></div>
          <div class="progressbar"><i style="width:${(ri / rounds.length) * 100}%"></i></div>
          <div class="q-text">${esc(p.name)}: “${esc(p.mnemonic.label)}”</div>
          <p class="lead">Tap the moons of ${esc(p.name)} in order.</p>
          <div class="token-row" id="slots">${members.map(() => `<span class="slot">?</span>`).join('')}</div>
          <div class="token-row" id="tokens">${tokens.map((t, i) =>
            `<button class="token" data-name="${esc(t)}" data-i="${i}">${esc(t)}</button>`).join('')}</div>
          <div class="feedback" id="fb"></div>
        </div>`;
      const slots = c.querySelectorAll('#slots .slot');
      const fb = c.querySelector('#fb');

      c.querySelectorAll('.token').forEach((tok) => {
        tok.onclick = () => {
          if (tok.dataset.name === members[pos]) {
            slots[pos].textContent = members[pos];
            tok.classList.add('used');
            pos++;
            if (pos === members.length) {
              const pts = Math.max(5, 20 - miss * 5);
              score += pts; S.bumpMastery(p.id, 10);
              fb.textContent = `Nice! +${pts}`; fb.className = 'feedback good';
              setTimeout(() => { ri++; render(); }, 750);
            }
          } else {
            miss++;
            tok.classList.add('miss');
            fb.textContent = `Not next — try again`; fb.className = 'feedback bad';
            setTimeout(() => tok.classList.remove('miss'), 320);
          }
        };
      });
    }
    function finish() {
      S.addXp(score); S.setBest('mnemonic', score);
      const newly = S.checkBadges();
      c.innerHTML = `
        <div class="result">
          <div class="score">${score}</div>
          <p class="lead">points across ${rounds.length} groups</p>
          <div class="xp">+${score} XP · best ${S.get().bestScores.mnemonic}</div>
        </div>
        <div class="btn-row">
          <button class="btn block" data-route="#/game/mnemonic">Play again</button>
          <button class="btn alt block" data-route="#/play">Back to games</button>
        </div>`;
      window.App.afterGame(newly);
    }
    render();
  }
  window.GameMnemonic = { mount };
})();
