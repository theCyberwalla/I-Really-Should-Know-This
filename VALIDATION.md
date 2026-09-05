# Validation — 5 September 2026

## Automated checks

`npm run check`: **29 passing Node tests** and successful static build.

Coverage includes complete area/topic/concept/source integrity; unique prompt IDs; all 193 country IDs mapped exactly to concepts, geometry and playable targets; 242 context features and 35 locator alternatives; all 47 continuous presidential boundaries and 45 identities; astronomy scale arithmetic; recall normalization and no answer leakage; method-specific evidence labels; single-family repetition limits; 24-hour due boundaries; same-day exposure; intervals; hints/reveals/retries; future clocks; deterministic replay; no misses for untouched targets; backup compatibility and profile isolation; conflicting immutable IDs; legacy preservation; failure recovery; and old astronomy worker cache isolation.

## Browser checks

Playwright CLI and installed Chromium test runtime, with isolated synthetic-data contexts. Source inspection contexts block service workers; offline tests use a separate fixture server on 4174. The user's preview/profile is not the test fixture.

- All **36 topic routes and 328 concept routes** render without captured page errors. Catalog, all 12 areas, topics, search, about and trail checked at **1440, 390 and 320 px**; no horizontal document overflow or duplicate IDs.
- Complete 47-row presidency list; era filtering and selected context; name recall; scroll and focus restored through drillthrough and Back.
- Geography region/search/dropdown, Monaco drillthrough, keyboard map answer, small-locator close-view hint and assisted evidence, Samoa visibility across the date line, and a full five-place round with post-round exploration links.
- Bounded recall accepts normalized input and does not persist its raw text. Question variants were reviewed and corrected where their answer wording mismatched the question.
- Interactive arithmetic: 10% compound growth yields $6,727 after 20 years from $1,000; 85 J useful output leaves 15 J other transfers; 10% to 20% is 100% relative growth; a +20 demand shift yields the illustrative (60, 60) equilibrium.
- Planet diameter ratio measured in the mobile DOM: Jupiter/Earth about 11.212, matching the data ratio within rendering precision. Linear/log distance modes, moon comparisons and season/phase controls exercised.
- Original World Wars exploration, related-concept navigation, Back selection/focus/scroll, text equivalent, assisted practice and search regression.
- Actual IndexedDB: unchanged legacy keys, three exact synthetic source snapshots, repeated migration, concurrent writes, default profile separation, idempotent imports, atomic conflicting-ID rollback, injected quota failure with exportable pending data and successful durable retry.
- Backup download, file-picker preview and import exercised through UI. Browsing remains available with IndexedDB and localStorage access denied.

## Offline and upgrade evidence

An isolated fixture serves the actual built app and worker, changing only the release marker/import URL between editions. After installation, network-offline reload opened the geography catalog (193 country options plus placeholder) and saved a correct Earth recall attempt.

After upgrading, the observed cache inventory contained the new `curiosity-atlas-fixture-*` edition, `countryguess-untouched`, and `other-app-untouched`. The prior Atlas edition and deliberately stale Atlas cache were gone. The learning attempt remained in IndexedDB. The harness waits for completed cleanup; an earlier transient lifecycle snapshot was corrected before claiming success.

`scripts/browser-offline-qa.js` uses `scripts/serve-offline-fixture.mjs`; this is an observed isolated browser upgrade, not a claim about an existing production installation. The old scoped astronomy retirement also has a unit check against its actual script.

## Source and visual review

Presidential identities/terms were checked against University of Virginia biographies, National Archives, and official current-inauguration sources. An erroneous end year in the upstream overview was not copied. Membership scope was checked against UN membership material; geography geometry and locator metadata come from Natural Earth 1:50m. NASA supports astronomical data; lessons link to relevant primary institutional and documentation sources.

The automated source-link pass initially found stale NIST and Pluto URLs; both were replaced with verified working sources. Some institutional hosts block automated HTTP requests or time out, so an HTTP status alone was not treated as a factual verification. Full research-page downloads remain local and are excluded from the release.

Reviewed screenshots are in `output/playwright/` (ignored by git): `full-discover-desktop.png`, `full-discover-mobile.png`, `full-presidents.png`, `full-geography.png`, `model-*.png`, `solar-size-mobile.png`, `seasons-mobile.png`, `oceania-practice-mobile.png`, and `world-wars-desktop.png`. The JSON backup in that folder contains synthetic test data only.

## Editorial completeness pass

After the country-story and related-content changes, `npm run check` again passed all 29 tests and the static build. `scripts/browser-editorial-qa.js` visited **all 193 country pages and all 135 other concept pages**. It checked visible explanations, source-backed story headings, supporting map details and onward links; result: zero failures and zero captured page errors.

A further **87 responsive route cases** at 1440, 390 and 320 px covered 12 varied countries in map/concept views plus presidency, astronomy and lesson examples. No document overflow was observed; the 72 country route cases also checked duplicate IDs. A real Afghanistan-to-Croatia click reached the connected story. The map focus headline was checked explicitly.

Visually reviewed current captures: `editorial-geography-desktop.png`, `editorial-afghanistan-desktop.png`, `editorial-afghanistan-mobile.png`, `editorial-monaco-mobile.png`, `editorial-presidents-desktop.png`, and `editorial-europa-mobile.png`. The story precedes geographic controls on country concept pages; map scope and coordinates are collapsed supporting details.

All 193 stories have distinct hooks, explicit explanations and valid different-country connections. Source research is described in `editorial/README.md`. The 62 separately reviewed source URLs returned this automated HTTP distribution: 47 HTTP 200, 14 HTTP 403 and one read timeout. Blocked/timed-out institutional sources were reviewed through indexed passages or other available institutional text; these statuses are recorded as access limits, not silently counted as successful downloads. The 131 selected UNESCO descriptions were available in the official DataHub export.

All 47 presidencies, 15 astronomical profiles and 73 explanatory lessons were inspected for generic explanations or weak links. This pass supplied 47 tailored presidential explanations, replaced two trivia-led presidential summaries with sourced historical context, deepened all 15 world profiles, and replaced generic/duplicated related labels in 58 lessons. The remaining 15 explanatory lessons retained their existing substantive links. IDs, practice objectives and evidence/storage semantics are unchanged.

## Limits and delivery state

The tests establish application behavior, not human learning outcomes. Native screen-reader use, Safari/Firefox, real touch devices and production-host headers/routing remain unverified. Map reading has a nonvisual explanatory alternative, but that alternative is not falsely recorded as map-location evidence.

No deployment, push, commit, or Cyberwalla saved-checkout change was performed. The work is a reviewable uncommitted worktree. The main preview remains at **http://127.0.0.1:4173**. The originating task can collect the result through this task's final response; the earlier blocked callback was not retried.
