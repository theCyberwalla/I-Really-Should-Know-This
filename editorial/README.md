# Country story research and maintenance

Reviewed 5 September 2026. All 193 UN-member entries have an individually authored hook, summary, why/how explanation, specific onward question and supporting source. These are concise geographic stories about a particular landscape, not comprehensive or representative national portraits.

## Inputs and regeneration

- `country-stories.txt`: one pipe-delimited row per country: code, hook, summary, explanation, related country code, question, optional external URL, optional external title. No pipes inside fields.
- `unesco-selections.json`: 131 country-to-World-Heritage-record selections.
- `unesco-source-index.json`: selected UNESCO record IDs/titles, sufficient for offline generation. Source text is not copied into the application.
- `node scripts/build-country-stories.mjs` regenerates `src/data/country-stories.js`; run `npm run check` afterward to refresh the release. Ordinary builds do not fetch sources.

The 131 UNESCO selections were researched using official [UNESCO DataHub whc001](https://data.unesco.org/explore/dataset/whc001/) English descriptions, with full descriptions/justifications where needed, and link to the corresponding property page. Source metadata is attributed to UNESCO; its dataset is distributed under CC BY-SA 4.0. This app uses original explanatory prose, not copied descriptions. A shared/transboundary property may support more than one country when the story explicitly concerns its part or shared feature.

The remaining 62 separately selected stories use specific NASA observations, geological or environmental agencies, national submissions and scientific research. UNESCO tentative-list entries are national submissions, not World Heritage designations. Indexed passages were used when institutional servers rejected automated access. Dates in historical observations were retained; the review does not turn old measurements into current statistics.

To refresh the raw UNESCO research export, create `output/research/country-stories/` and run `scripts/research-country-stories.py` with Python and requests. Raw downloads and HTTP logs stay in ignored `output/`. Recheck changed claims against source text before editing; a working link alone does not verify a claim.

## Editorial limits

No claim that the selected landscape characterizes all of a country, no generic regional replacement text, no culture/personality stereotypes, and no unsupported ranking language. Cross-country questions are editorial connections between independently sourced stories. Avoid treating a cited institution as an endorsement of its entire framing.

Country ID, practice target, evidence method, map geometry and locator scope stay independent from story text. The map marks the country, not the exact landmark. Geography practice remains location evidence, not evidence of having recalled the new story.
