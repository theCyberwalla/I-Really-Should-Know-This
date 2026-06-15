# Moons & Planets — Learning PWA Specification (v1)

**Status:** Draft for review
**Date:** 14 June 2026
**Audience:** General / all ages
**Stack:** Vanilla HTML, CSS, JavaScript — installable PWA, no build step, fully offline-capable

---

## 1. Purpose & goals

A Progressive Web App that teaches the planets and their notable moons through two complementary experiences:

1. **Explore** — a browsable reference of the solar system (planets, dwarf planet Pluto, and their major moons) with memorable facts and real imagery.
2. **Play** — four game modes that turn the same content into active recall practice, with progress tracking and light gamification to reward repeat use.

All content derives from `info.md`. The app must work offline once installed, install to a phone or desktop home screen, and require no account or network connection to function.

---

## 2. Content scope

Sourced entirely from `info.md`:

- **8 planets:** Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune
- **1 dwarf planet:** Pluto
- **Moons with facts:** Moon (Earth); Phobos, Deimos (Mars); Io, Europa, Ganymede, Callisto, Amalthea (Jupiter); Titan, Enceladus, Mimas, Iapetus, Hyperion, Phoebe, Rhea (Saturn); Titania, Oberon, Miranda, Ariel, Umbriel (Uranus); Triton, Proteus, Nereid (Neptune); Charon, Hydra, Nix, Kerberos, Styx (Pluto)
- **Mercury & Venus:** no moons — represented with their "memorable fact."
- **Top 10 most memorable moons** list (used as a study highlight and a quiz pool).
- **Mnemonic memory tricks:** Mars "Tiny twins," Jupiter "Big Four," Saturn "Weird Worlds," Uranus "Shakespeare moons," Neptune "Triton steals the show," Pluto "Charon is almost Pluto's equal."

---

## 3. Data model

A single `data.json` is the source of truth for both Explore and Play. Proposed shape:

```json
{
  "planets": [
    {
      "id": "jupiter",
      "name": "Jupiter",
      "order": 5,
      "type": "planet",
      "image": "assets/img/jupiter.jpg",
      "imageCredit": "NASA/JPL",
      "summary": "The largest planet, with the 'Big Four' Galilean moons.",
      "memorableFact": null,
      "mnemonic": { "label": "The Big Four", "members": ["Io", "Europa", "Ganymede", "Callisto"] },
      "moons": [
        {
          "id": "europa",
          "name": "Europa",
          "image": "assets/img/europa.jpg",
          "imageCredit": "NASA/JPL",
          "facts": [
            "Ice-covered ocean world.",
            "May contain more water than Earth.",
            "One of the best places to search for extraterrestrial life."
          ],
          "top10": { "rank": 1, "hook": "Ocean beneath ice; possible life." }
        }
      ]
    }
  ],
  "top10": ["europa", "titan", "io", "enceladus", "ganymede", "triton", "moon", "miranda", "iapetus", "phobos"],
  "quizQuestions": []
}
```

Notes:
- `quizQuestions` can be generated at runtime from facts (no need to hand-author every question), with a small set of curated questions optionally added.
- Mercury/Venus carry `memorableFact` and an empty `moons` array.
- Each fact is short and self-contained, which makes it reusable as a flashcard back or quiz prompt.

---

## 4. Imagery plan

Real public-domain photography (NASA / JPL / public sources). The temporary OpenAI URLs in `info.md` will be discarded.

- One representative image per planet and per major moon (~30 images).
- Images fetched once, optimized (resized/compressed), and **bundled locally** under `assets/img/` so the app stays fully offline.
- Each image stores a credit string shown in the UI.
- Fallback: if a specific moon image can't be sourced, use a styled placeholder tile rather than a broken link.

*Open item for your call later: exact image dimensions / file size budget. Default plan: max ~1200px, WebP/JPEG, aiming under ~150 KB each.*

---

## 5. Screens & navigation

Bottom (mobile) / side (desktop) nav with four primary destinations:

**5.1 Home**
- Title, brief intro, and an at-a-glance solar-system row (tap a planet to jump to it).
- Quick-start buttons for each game.
- Progress snapshot: current streak, XP, badges earned.

**5.2 Explore**
- Grid/list of planets in orbital order + Pluto.
- Tap a planet → planet detail: hero image, summary, mnemonic chip, and its moons as cards.
- Tap a moon → moon detail: image, facts, "Top 10" badge if applicable.
- Dedicated sub-views: **Top 10 Moons** and **Memory Tricks**.

**5.3 Play (games hub)**
- Cards for the four modes (below), each showing best score / mastery.

**5.4 Progress**
- XP total, streak calendar, badges, and per-planet mastery bars.

---

## 6. Game modes & rules

All four are in scope for v1. Each draws from `data.json`.

**6.1 Flashcards**
- Card front: a moon (name + image) or a fact prompt; flip to reveal the answer.
- User self-rates "Got it" / "Review again," which feeds the mastery/spaced-repetition queue.
- Deck options: by planet, Top 10, or all.

**6.2 Multiple-choice quiz**
- Question types auto-generated: "Which moon has methane lakes?", "Which planet does Triton orbit?", "How many moons does Venus have?"
- 4 options, one correct. 10 questions per round.
- Scoring: +10 per correct; optional speed bonus; streak multiplier within a round.
- End-of-round summary with correct answers and a "review missed" shortcut.

**6.3 Match game**
- Pair moons to their parent planet (tap-to-pair or drag).
- One board = a set of moons across several planets; complete to win.
- Scoring: time-based + penalty for mismatches.

**6.4 Mnemonic challenge**
- Show a planet's mnemonic label ("The Big Four") and ask the user to recall/select its member moons in order.
- Reinforces the memory tricks from `info.md`.
- Scoring: all-correct bonus; partial credit per member.

---

## 7. Gamification & progress

- **XP:** earned from quiz/match/flashcard activity; drives a simple level.
- **Streak:** consecutive days with any activity (date-based).
- **Badges:** e.g. "Galilean Master" (all Big Four), "Ocean Hunter" (Europa + Enceladus + Titan), "Top 10 Complete," "7-Day Streak."
- **Mastery:** per planet and per moon, advanced by correct recall; shown as bars in Progress.
- **Persistence:** all state in `localStorage` (no login, no server). Includes a reset option.

---

## 8. PWA / technical requirements

- **Installable:** web app manifest (name, icons, theme color, standalone display).
- **Offline:** service worker pre-caches the app shell, `data.json`, and all images on install; app fully usable with no network.
- **Responsive:** mobile-first, scales to tablet/desktop.
- **Theme:** dark space aesthetic (starfield background, planet accent colors), readable typography, accessible contrast.
- **No external runtime dependencies:** no frameworks, no CDN calls at runtime → reliable offline behavior.
- **Performance:** fast first load; lazy-load non-critical images where possible while keeping them cached for offline.

### Proposed file structure
```
moonsAndPlanets/
  index.html
  manifest.webmanifest
  sw.js                  (service worker)
  css/styles.css
  js/
    app.js               (routing, shell)
    explore.js
    games/
      flashcards.js
      quiz.js
      match.js
      mnemonic.js
    progress.js
    store.js             (localStorage helpers)
  data/data.json
  assets/
    img/                 (planet & moon photos)
    icons/               (PWA icons)
```

---

## 9. Build phases

1. **Data** — parse `info.md` → `data.json`; verify every planet/moon/fact captured.
2. **Imagery** — source, optimize, and bundle NASA/public-domain images with credits.
3. **Shell + Explore** — PWA scaffold, manifest, service worker, navigation, Explore screens.
4. **Games** — implement the four modes against `data.json`.
5. **Gamification** — XP, streaks, badges, mastery, Progress screen.
6. **Verify** — offline install test, quiz/match logic checks, content-accuracy review, cross-device layout check.

---

## 10. Out of scope for v1 (possible later)

- User accounts / cloud sync across devices.
- Audio narration or 3D/orbital animations.
- Full moon catalogs (Saturn's 200+ moons) — v1 covers the notable ones in `info.md`.
- Leaderboards / social sharing.

---

## 11. Open items to confirm

1. Image size/quality budget (default proposed in §4).
2. Any branding — app name as shown on the home screen and icon (default: "Moons & Planets").
3. Whether spaced-repetition in flashcards should be simple ("review again" queue) or a fuller SRS schedule.
