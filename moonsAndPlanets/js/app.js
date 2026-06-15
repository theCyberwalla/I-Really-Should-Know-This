/* app.js — router, shell wiring, service worker registration */
(function () {
  const S = window.Store;
  const appEl = document.getElementById('app');
  const tabbar = document.getElementById('tabbar');
  const topstats = document.getElementById('topstats');

  (function stars() {
    const box = document.getElementById('stars');
    let html = '';
    for (let i = 0; i < 70; i++) {
      const s = (Math.random() * 2 + 1).toFixed(1);
      html += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 100).toFixed(1) +
        '%;width:' + s + 'px;height:' + s + 'px;animation-delay:' + (Math.random() * 4).toFixed(1) + 's"></i>';
    }
    box.innerHTML = html;
  })();

  function renderTop() {
    const st = S.get(), lv = S.level(st.xp);
    topstats.innerHTML =
      '<span class="chip">Lv <b>' + lv.level + '</b></span>' +
      '<span class="chip">⚡<b>' + st.xp + '</b></span>' +
      '<span class="chip">🔥<b>' + st.streak + '</b></span>';
  }

  function setActiveTab(hash) {
    const base = '#/' + (hash.split('/')[1] || 'home');
    const exploreLike = base.indexOf('#/planet') === 0 || base.indexOf('#/moon') === 0 || base === '#/top10' || base === '#/tricks';
    const playLike = base.indexOf('#/game') === 0;
    tabbar.querySelectorAll('.tab').forEach(function (t) {
      const r = t.dataset.route;
      const on = r === base || (exploreLike && r === '#/explore') || (playLike && r === '#/play');
      t.classList.toggle('active', on);
    });
  }

  const games = {
    flashcards: function () { window.GameFlashcards.mount(appEl); },
    quiz: function () { window.GameQuiz.mount(appEl); },
    match: function () { window.GameMatch.mount(appEl); },
    mnemonic: function () { window.GameMnemonic.mount(appEl); }
  };

  function route() {
    const hash = location.hash || '#/home';
    const parts = hash.slice(2).split('/');
    const name = parts[0] || 'home';
    appEl.scrollTop = 0;
    try { window.scrollTo(0, 0); } catch (e) {}

    if (name === 'home') appEl.innerHTML = window.Explore.home();
    else if (name === 'explore') appEl.innerHTML = window.Explore.explore();
    else if (name === 'planet') appEl.innerHTML = window.Explore.planetView(parts[1]);
    else if (name === 'moon') appEl.innerHTML = window.Explore.moonView(parts[1]);
    else if (name === 'top10') appEl.innerHTML = window.Explore.top10();
    else if (name === 'tricks') appEl.innerHTML = window.Explore.tricks();
    else if (name === 'play') appEl.innerHTML = window.Progress.play();
    else if (name === 'progress') { appEl.innerHTML = window.Progress.progress(); window.Progress.bind(appEl); }
    else if (name === 'game' && games[parts[1]]) games[parts[1]]();
    else appEl.innerHTML = window.Explore.home();

    renderTop();
    setActiveTab(hash);
  }

  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }

  document.addEventListener('click', function (e) {
    const t = e.target.closest('[data-route]');
    if (t) { e.preventDefault(); go(t.dataset.route); }
  });

  function toast(msg) {
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2600);
  }

  function afterGame(newBadges) {
    renderTop();
    if (newBadges && newBadges.length) {
      newBadges.forEach(function (b, i) {
        setTimeout(function () { toast(b.icon + ' Badge: ' + b.name); }, i * 1400);
      });
    }
  }

  window.App = { go: go, route: route, toast: toast, afterGame: afterGame };

  window.addEventListener('hashchange', route);
  route();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
})();
