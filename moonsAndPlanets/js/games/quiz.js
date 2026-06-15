/* quiz.js — auto-generated multiple-choice quiz */
(function () {
  const S = window.Store, DATA = S.DATA;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (arr, n, not) => shuffle(arr.filter((x) => x !== not).slice()).slice(0, n);

  function buildQuestions(n) {
    const moons = S.allMoons, planets = DATA.planets;
    const qs = [];
    // fact -> moon
    shuffle(moons.slice()).forEach((m) => {
      const fact = m.facts[0];
      const opts = pick(moons.map((x) => x.name), 3, m.name).concat(m.name);
      qs.push({ type: 'fact', q: `Which moon is described: "${fact}"`, correct: m.name, options: shuffle(opts), planetId: m.planetId });
    });
    // moon -> planet
    shuffle(moons.slice()).forEach((m) => {
      const opts = pick(planets.map((p) => p.name), 3, m.planetName).concat(m.planetName);
      qs.push({ type: 'orbit', q: `Which planet does ${m.name} orbit?`, correct: m.planetName, options: shuffle(opts), planetId: m.planetId });
    });
    // no-moon planets
    [['Mercury', DATA.planets.find(p=>p.id==='mercury')], ['Venus', DATA.planets.find(p=>p.id==='venus')]].forEach(([nm, p]) => {
      qs.push({ type: 'count', q: `How many moons does ${nm} have?`, correct: 'None', options: shuffle(['None', 'One', 'Two', 'Four']), planetId: p.id });
    });
    return shuffle(qs).slice(0, n);
  }

  function mount(c) {
    const qs = buildQuestions(10);
    let i = 0, score = 0, streak = 0, missed = [];

    function render() {
      if (i >= qs.length) return finish();
      const q = qs[i];
      c.innerHTML = `
        <div class="game-wrap">
          <button class="back" data-route="#/play">← Games</button>
          <div class="game-head"><h1>🎯 Quiz</h1><span class="pill">${i + 1} / ${qs.length} · ${score} pts</span></div>
          <div class="progressbar"><i style="width:${(i / qs.length) * 100}%"></i></div>
          <div class="q-text">${esc(q.q)}</div>
          <div class="options" id="opts">
            ${q.options.map((o, idx) => `<button class="opt" data-i="${idx}">${esc(o)}</button>`).join('')}
          </div>
          <div class="feedback" id="fb"></div>
          <button class="btn block" id="nextq" style="display:none">Next →</button>
        </div>`;
      const fb = c.querySelector('#fb');
      const nextBtn = c.querySelector('#nextq');
      c.querySelectorAll('.opt').forEach((btn) => {
        btn.onclick = () => {
          const chosen = q.options[+btn.dataset.i];
          const ok = chosen === q.correct;
          c.querySelectorAll('.opt').forEach((b) => {
            b.disabled = true;
            if (q.options[+b.dataset.i] === q.correct) b.classList.add('correct');
            else if (b === btn) b.classList.add('wrong');
          });
          if (ok) {
            streak++;
            const pts = 10 + Math.min(streak - 1, 5) * 2;
            score += pts;
            fb.textContent = `Correct! +${pts}` + (streak > 1 ? ` (streak ×${streak})` : '');
            fb.className = 'feedback good';
            S.bumpMastery(q.planetId, 6);
          } else {
            streak = 0; missed.push(q);
            fb.textContent = `Answer: ${q.correct}`;
            fb.className = 'feedback bad';
          }
          nextBtn.style.display = 'block';
        };
      });
      nextBtn.onclick = () => { i++; render(); };
    }
    function finish() {
      S.addXp(score); S.setBest('quiz', score);
      const newly = S.checkBadges();
      c.innerHTML = `
        <div class="result">
          <div class="score">${score}</div>
          <p class="lead">points · ${qs.length - missed.length}/${qs.length} correct</p>
          <div class="xp">+${score} XP · best ${S.get().bestScores.quiz}</div>
        </div>
        <div class="btn-row">
          <button class="btn block" data-route="#/game/quiz">Play again</button>
          <button class="btn alt block" data-route="#/play">Back to games</button>
        </div>`;
      window.App.afterGame(newly);
    }
    render();
  }
  window.GameQuiz = { mount };
})();
