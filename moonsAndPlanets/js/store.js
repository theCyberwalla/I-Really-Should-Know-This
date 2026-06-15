/* store.js — app state, persistence, gamification */
(function () {
  const KEY = 'moons_planets_state_v1';
  const DATA = window.APP_DATA;

  const DEFAULT = {
    xp: 0,
    streak: 0,
    lastActiveDay: null,
    mastery: {},        // planetId -> 0..100
    badges: {},         // badgeId -> true
    bestScores: {},     // gameId -> number
    seenMoons: {}       // moonId -> true (flashcards "got it")
  };

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return Object.assign({}, DEFAULT, JSON.parse(raw));
    } catch (e) {}
    return JSON.parse(JSON.stringify(DEFAULT));
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function todayKey() {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }
  function dayDiff(a, b) {
    const pa = a.split('-').map(Number), pb = b.split('-').map(Number);
    const da = new Date(pa[0], pa[1] - 1, pa[2]);
    const db = new Date(pb[0], pb[1] - 1, pb[2]);
    return Math.round((db - da) / 86400000);
  }

  // Record activity for the day; update streak.
  function touchStreak() {
    const t = todayKey();
    if (state.lastActiveDay === t) return;
    if (state.lastActiveDay && dayDiff(state.lastActiveDay, t) === 1) state.streak += 1;
    else state.streak = 1;
    state.lastActiveDay = t;
    save();
  }

  const BADGES = [
    { id: 'galilean', icon: '🌋', name: 'Galilean Master', desc: 'Master Jupiter', test: (s) => (s.mastery.jupiter || 0) >= 100 },
    { id: 'ocean', icon: '🌊', name: 'Ocean Hunter', desc: 'See Europa, Enceladus & Titan', test: (s) => s.seenMoons.europa && s.seenMoons.enceladus && s.seenMoons.titan },
    { id: 'top10', icon: '🏆', name: 'Top 10 Scholar', desc: 'See all Top 10 moons', test: (s) => DATA.top10.every((m) => s.seenMoons[m.moonId]) },
    { id: 'quizace', icon: '🎯', name: 'Quiz Ace', desc: 'Score 100 in a quiz', test: (s) => (s.bestScores.quiz || 0) >= 100 },
    { id: 'streak7', icon: '🔥', name: '7-Day Streak', desc: 'Play 7 days running', test: (s) => s.streak >= 7 },
    { id: 'explorer', icon: '🪐', name: 'System Explorer', desc: 'Reach level 5', test: (s) => level(s.xp).level >= 5 }
  ];

  function checkBadges() {
    const newly = [];
    BADGES.forEach((b) => {
      if (!state.badges[b.id] && b.test(state)) { state.badges[b.id] = true; newly.push(b); }
    });
    if (newly.length) save();
    return newly;
  }

  function level(xp) {
    // 100 xp per level, gently scaling
    let lvl = 1, need = 100, total = xp;
    while (total >= need) { total -= need; lvl += 1; need = Math.round(need * 1.25); }
    return { level: lvl, into: total, need, pct: Math.round((total / need) * 100) };
  }

  function addXp(n) { state.xp += n; touchStreak(); save(); }

  function bumpMastery(planetId, delta) {
    const cur = state.mastery[planetId] || 0;
    state.mastery[planetId] = Math.max(0, Math.min(100, cur + delta));
    save();
  }
  function setBest(gameId, score) {
    if (score > (state.bestScores[gameId] || 0)) { state.bestScores[gameId] = score; save(); }
  }
  function markSeen(moonId) { if (moonId) { state.seenMoons[moonId] = true; save(); } }

  function reset() { state = JSON.parse(JSON.stringify(DEFAULT)); save(); }

  // ---- data helpers ----
  const allMoons = [];
  DATA.planets.forEach((p) => p.moons.forEach((m) => allMoons.push(Object.assign({ planetId: p.id, planetName: p.name }, m))));
  function planet(id) { return DATA.planets.find((p) => p.id === id); }
  function moon(id) { return allMoons.find((m) => m.id === id); }
  function planetsWithMoons() { return DATA.planets.filter((p) => p.moons.length); }

  window.Store = {
    DATA, BADGES, get: () => state, save,
    touchStreak, checkBadges, level, addXp, bumpMastery, setBest, markSeen, reset,
    allMoons, planet, moon, planetsWithMoons
  };
})();
