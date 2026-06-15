# Moons & Planets — Learning PWA

An installable, offline-capable Progressive Web App for learning the planets and their notable moons, with four built-in games. All content comes from `info.md`.

## Run it

**Quick look:** double-click `index.html` — the Explore section and all four games work immediately (data is embedded in `js/data.js`).

**Full PWA (install + offline):** the service worker needs the files served over `http`. From this folder:

```
python -m http.server 8000
```

Then open `http://localhost:8000/` and use your browser's "Install app" option. Once installed it runs full-screen and works with no connection.

## What's inside

- **Explore** — every planet + Pluto, their moons, memorable facts, a Top 10 list, and the mnemonic memory tricks.
- **Games** — Flashcards, Multiple-choice Quiz, Match (moon→planet), and Mnemonic Challenge.
- **Progress** — XP, levels, day streak, per-planet mastery bars, and badges. Saved locally in your browser; reset any time from the Progress tab.

## Structure

```
index.html              app shell
manifest.webmanifest    PWA manifest
sw.js                   service worker (offline cache)
css/styles.css          space theme
js/                     app logic (router, explore, games, store)
data/data.json          source of truth  (also embedded as js/data.js)
assets/img/             stylized SVG artwork for each body
assets/icons/           app icons
SPEC.md                 the design spec this was built from
```

## Note on imagery

Bodies use stylized procedural **SVG artwork** (generated locally) so the app is fully offline with no broken images. To swap in real NASA/public-domain photos later, drop files into `assets/img/`, update the `image` paths in `data/data.json`, and regenerate `js/data.js` and the `sw.js` cache list.
