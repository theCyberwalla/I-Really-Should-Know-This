# I Really Should Know This — Curiosity Atlas

A complete introductory learning site spanning the original eleven knowledge areas plus Thinking with Numbers: **12 areas, 36 topics, 328 concepts and 377 practice prompts**. Browse first, follow a visual explanation, and optionally practice. No login, setup test, scores or locked lessons.

See [COVERAGE.md](COVERAGE.md) for the exact inventory and route links, and [VALIDATION.md](VALIDATION.md) for observed checks.

## Run

Node.js 22 or later. No install step or runtime dependencies.

```sh
npm run dev        # http://127.0.0.1:4173
npm run check      # Node tests, then static build
npm run build      # creates dist/ and refreshes offline-assets.js
```

The preview remains on port 4173. To serve the built release separately: `PORT=4175 node scripts/serve.mjs --dist`. Hash routes work on static hosts and under a subdirectory. Use local HTTP or production HTTPS, not file URLs. No public deployment or push was performed.

After editing application files, run the build to regenerate the offline manifest. An installed older edition offers a button to load an available update. For browser development, use an isolated context with service workers blocked when checking fresh source changes.

## Included experiences

- Discover, the full area catalog, topic and concept views, source links, cross-area connections, search, and a saved trail.
- All 47 officially numbered US presidencies, 45 stable person identities, exact term boundaries, era filters, factual context, institutional explanations and optional name recall. Current identity verified on 5 September 2026.
- A new Natural Earth map covering all 193 UN member states, each with a sourced geographic curiosity, why/how explanation and related-country question; region and name search; text/dropdown browsing; 35 small-country locator alternatives; five-place rounds that start immediately. Pacific regional maps cross the date line. Map context is not a sovereignty classification.
- All eight planets plus Pluto, six selected moons, separate logarithmic/linear distance and linear diameter comparisons, seasons and lunar phases. Quantities, scale choices and uncertainty are explicit.
- Energy conservation, compound growth, percentage change and market models with working controls; probability outcomes; process, cycle and role comparisons throughout the other areas.
- 122 recognition variants, 62 bounded recall prompts and 193 map-location prompts. Correct and incorrect attempts teach through feedback. Typed recall text is not stored. Leaving does not record misses for untouched targets.
- Browser Back restores selection, trigger focus, page scroll and scroll within the presidency list. Controls use native labels, keyboard activation, responsive layouts and reduced-motion support.
- Offline installation for all local lessons and assets; explicit update activation; cache cleanup restricted to the Atlas namespace. External source sites still need a connection.

## Evidence and personal data

IndexedDB database `curiosity-atlas`, schema 1, stores immutable events, profiles and legacy snapshots. Activity stays on this browser and origin; nothing is automatically uploaded. Failed writes retain an exportable temporary session, with a visible retry path. Imports validate first and commit atomically.

Opening, saving, self-reported familiarity, hints, reveals, recognition, bounded recall and map location remain distinct. A successful later check requires a first unaided correct attempt, at least 24 hours since answer exposure, a due date, and a different family from the preceding practice within that method. Single-family activities cannot repeatedly advance through identical checks. The 1/3/7/21/60-day intervals are product defaults, not calibrated measurements of memory or mastery. A missed visit is not evidence of forgetting.

Version-1 Atlas backups remain compatible. Exports preserve profile boundaries and unchanged legacy snapshots, including malformed old content. Default import creates separate profiles; merging matching stable IDs is explicit. Identical events deduplicate; conflicting IDs abort the transaction. Files over 5 MB and invalid schemas are rejected before writes.

Known same-origin legacy keys are captured verbatim with source origin, capture time and SHA-256 identity. Originals are never removed; legacy scores never become new knowledge evidence. Cross-origin Cyberwalla records cannot be read here automatically. No Cyberwalla checkout files were changed.

The old astronomy entry links to the new collection and data tools. Its retirement worker deletes only `moons-planets-*` caches and unregisters. The new root worker deletes only older `curiosity-atlas-*` caches. Neither cache cleanup clears learning storage.

## Structure

| Module                                        | Responsibility                                                                     |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| `src/content.js`, `src/curriculum.js`         | Stable content IDs, authored lessons, sources, practice and publication validation |
| `src/presidents.js`, `src/presidency-view.js` | Complete presidential records and chronology interface                             |
| `src/geography.js`, `src/data/world.js`       | Country inventory, geometry, regional maps and locator alternatives                |
| `src/astronomy.js`, `src/models.js`           | Astronomy data and domain-specific educational models                              |
| `src/app.js`, `src/style.css`                 | Routing, rendering, interaction, focus and responsive visual design                |
| `src/learning.js`                             | Pure event validation/replay, evidence labels and due selection                    |
| `src/storage.js`                              | Durable transactions, profile isolation, migration and backups                     |
| `src/offline.js`, `sw.js`                     | Offline installation, update UI and scoped asset caching                           |
| `scripts/`, `tests/`                          | Static build/server, reproducible browser walkthroughs and Node checks             |

Instructional prose and UI graphics were newly authored. Map geometry is public-domain Natural Earth data; it is not copied from the old game. No old game engine or decorative asset is required by the new build. Remaining legacy files are reference material and are excluded from `dist/`.

The site is a complete introductory curriculum with defined boundaries, not an encyclopedia. Native VoiceOver, Safari/Firefox, real touch hardware and a deployed-host upgrade remain unverified platform checks; the completed local implementation has been exercised in Chromium at desktop and mobile widths.

Country research inputs, scope and regeneration: [editorial/README.md](editorial/README.md). The editorial completeness pass is recorded in [VALIDATION.md](VALIDATION.md).
