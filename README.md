# Nocturne

**A museum after closing. Three missing works. Your eye for detail.**

A responsive investigation game built with Angular and an interactive React observatory. Real artworks from The Metropolitan Museum of Art support fictional mysteries. The interface starts in French and can switch to English without losing progress.

## Run locally

Use **Node.js 24.22.0 and npm 11.19.1**, recorded in `.node-version` and `package.json`. No global Angular CLI, API key, backend or account is required. Activate a compatible Node installation before installing dependencies; the project does not change your global Node version.

```sh
npm ci
npm start
```

Open `http://localhost:4200/`. To inspect the actual static production build:

```sh
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/`. Preview serves `dist/nocturne/browser`, rather than recompiling through the development server. Hash routes support direct navigation and refresh on a basic static server.

## Play

All three cases and their four puzzles are open immediately. Follow the suggested order or explore any mechanism directly. Each case ends with an identification unlocked by its four earned clues.

| Case               | Collection                            | Distinctive fourth puzzle                        |
| ------------------ | ------------------------------------- | ------------------------------------------------ |
| The Silent Frame   | European paintings                    | Reassemble a torn museum label                   |
| Ink After Midnight | Japanese prints and illustrated books | Match conservation reports to works              |
| The Last Inventory | Egyptian antiquities                  | Arrange an inventory under placement constraints |

Each case also includes a recovered image fragment, an interval-based chronology and a contradictory report. Visual fragments have written observation alternatives. Ordering uses earlier/later buttons, and report matching uses native selects. No dragging is required.

- Solve independently for **3 stars**. A nudge or precise hint limits a puzzle to **2**; the explained solution completes it for **1**. Stars freeze at completion, up to 12 per case.
- Wrong puzzle answers and time spent reading do not cost stars.
- Final identification has two explicit confirmations. A first mistake explains a contradiction; a second provides an assisted resolution. Final assistance does not change puzzle stars.
- Deliberately inspect a witness record to collect it. Preloading does not add discoveries. Candidate records become inspectable after all four puzzles; the missing work joins the notebook after the conclusion.
- Progress, drafts, hints and language are saved in this browser. Replay resets the current attempt while retaining discoveries and the best **whole completed attempt**. Ties prefer an unassisted final, then the older result.

Complete rules remain available from the navigation. A case targets 10–15 minutes, but that duration has not been validated through independent human playtests.

## Notebook and observatory

The notebook searches discovered records and shows progress and best results. Artwork pages include available attribution, dates, materials, credits, image enlargement and the official museum link. Missing information remains unknown.

Four interactive SVG analyses include scope controls and accessible value tables:

| Analysis              | Data and disclosure rule                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| Timeline              | Documented intervals, only after that case's chronology is completed in the current attempt     |
| Artwork types         | Actual normalized types of intentionally discovered works, including unknowns and source counts |
| Compatible candidates | Intersections in actual earned-clue order; no candidate identities are transferred to React     |
| Stars by puzzle       | Frozen earned stars and unfinished puzzles for the current attempt                              |

Aggregated timelines gate each case independently. Replay closes that case's timeline and resets its clue history and stars while retaining notebook discoveries. Scope, sample size and source information accompany the analyses. Tables provide detailed alternatives to graphics.

## Real museum API

The nominal source is the [Met Collection API](https://metmuseum.github.io/):

```text
GET https://collectionapi.metmuseum.org/public/collection/v1/objects/{id}
```

Opening a case, eligible artwork, notebook or eligible analysis requests the necessary records with Angular `HttpClient`. A shared session cache deduplicates records and limits concurrency to four requests. The home page uses local witness reproductions and does not download the collection. Search was used to author the bounded corpus; runtime does not need global search.

Responses feed displayed titles, attribution, dates, materials, detail pages, notebook search and analytics. The requests are not decorative. A record has a 12-second timeout. Failed requests or unusable records activate that work's sourced backup from **2026-10-16**, visibly dated with a retry action. A successful retry restores the live record without changing progress. An absent optional field stays unknown rather than silently borrowing a backup value.

Puzzle constraints depend on reviewed facts. If a live record changes a critical fact, the puzzle evidence explicitly uses the dated reference consistently across documents, clue intersections and timeline. Artwork detail still exposes the current museum record. Pending requests identify reference facts as such. This avoids treating a catalogue edit or network error as a player's mistake.

Images are separate resources: available live reproductions are preferred once a live record loads; optimized local public-domain copies preserve continuity and are identified when used as fallback. If both image sources fail, a visible missing-image state remains.

Museum display dates (`objectDate`) and numeric bounds (`objectBeginDate`, `objectEndDate`) remain separate. Some ancient records have differing display wording and numeric ranges. Chronologies compare numeric intervals, never parse an approximate label or invent an exact year. Negative bounds represent BCE years. Missing artist names are not inferred. Metadata remains in its source language; translated game documents are editorial writing, and fictional reports are visibly identified.

## Architecture

| Area                         | Responsibility                                                              |
| ---------------------------- | --------------------------------------------------------------------------- |
| `src/app/domain`             | Typed definitions, puzzle predicates, deterministic transitions and scoring |
| `src/app/data/cases`         | Three bilingual cases and the reviewed 21-work corpus                       |
| `src/app/core/met`           | HTTP client, normalization, bounded cache and evidence provenance           |
| `src/app/core/game`          | Angular Signals store; one owner for game state                             |
| `src/app/core/persistence`   | Versioned save validation and synchronous persistence                       |
| `src/app/core/i18n`          | Typed runtime dictionaries and language selection                           |
| `src/app/features`           | Routed case, puzzle, artwork, notebook and analytics views                  |
| `src/integrations/analytics` | React presentation behind `nocturne-analytics`                              |
| `public/artworks`            | Optimized reproductions, fragments and source manifest                      |

Angular 22.2.3 standalone components, strict TypeScript and hash routing form the application. React 19.3.1 owns chart selection, scope and table visibility. Angular passes an immutable, disclosure-filtered DTO through a custom-element property; React receives neither game mutation methods nor puzzle answers. Its bundle loads only on entering analytics. Shadow DOM isolates styles; disconnecting unmounts the React root, and returning mounts a fresh root.

There is no server, account, tracker, leaderboard, generated puzzle system or exported save format. Application source and bundled references can be inspected. Disclosure rules protect ordinary navigation from spoilers; they are not a security boundary against source inspection.

## Verification

```sh
npm run lint
npm run build
npm test -- --watch=false
npm run test:assets
npm exec playwright install chromium
npm run test:e2e -- --workers=2
```

Linux CI installs browser/system dependencies with `npm exec playwright install --with-deps chromium`. The workflow runs installation, lint, production compilation, unit/integration tests, assets and Chromium desktop/mobile journeys against the compiled production preview, retaining failure screenshots and traces. Local journeys use the development server; setting `CI=true` requires building first and uses the production preview. No secret is required.

Tests cover unique solutions and clue orders, uncertain chronology, scoring, idempotent final confirmation, whole-attempt best results, save recovery, HTTP failures/retries, source drift, language retention, all six mechanisms, all three conclusions, replay, React lifecycle/property integration and disclosure gates. Playwright controls external responses for reproducibility. Accessibility checks combine axe scans, keyboard/focus assertions, enlarged text, reduced motion and responsive layouts; they do not certify complete accessibility or replace human usability testing.

Check the external service separately:

```sh
npm run check:api
```

This probes a small representative set of real records and image URLs and prints a dated result. It is separate from deterministic CI: a service outage is not proof of a regression. Also inspect production preview in a browser to verify CORS and live records.

```sh
npm exec playwright show-report
npm exec playwright show-trace path/to/trace.zip
```

## Design, sources and credits

The custom night-gallery design uses green-black, ivory and brass, framed artworks, paper evidence and amber, indigo and bronze accents. Layouts adapt to narrow screens, controls expose visible keyboard focus, native dialogs support Escape and nonessential motion respects reduced-motion preferences. Fonts are local.

- Artworks and metadata: [The Metropolitan Museum of Art Open Access](https://www.metmuseum.org/about-the-met/policies-and-documents/open-access), through its [Collection API](https://metmuseum.github.io/). Selected records identify the images as public domain. Individual object links, credits, retrieval dates and image sources are in [the artwork manifest](public/artworks/manifest.json), the reference records and artwork pages. WebP copies and observation fragments derive from those images.
- Fonts: [Cormorant Garamond](https://github.com/google/fonts/tree/main/ofl/cormorantgaramond) and [DM Sans](https://github.com/google/fonts/tree/main/ofl/dmsans), under the SIL Open Font License. Notices are retained in `public/fonts`.
- Documentation: [Angular](https://angular.dev/), [React](https://react.dev/), [Playwright](https://playwright.dev/) and [native HTML dialogs](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element).

Cases, characters, reports and missing-work scenarios are fictional. No real museum theft or staff conduct is asserted. No generated artwork is presented as a museum object.

## Challenges and limits

The main challenges were coherent uncertain dates, puzzles solvable from their documents, state retention across languages/replay and a real second framework without shared business authority or answer leakage. Reviewed critical fields and a single evidence projection keep puzzles and analyses consistent. Stable identifiers keep translations independent from validation. An immutable DTO and lifecycle tests define the Angular/React boundary.

Progress is browser-local. Clearing storage, changing browsers or opening a different origin starts a separate save. If storage fails, a visible notice explains that play continues only in memory. Museum records/images depend on an external service; dated backups preserve play but do not guarantee a complete offline installation. Human timing, screen-reader evaluation and broader browser/device testing remain useful follow-up validation.

## AI assistance

OpenAI Codex assisted throughout: analysing assignment and assessment material, comparing concepts and visual directions, structuring scope, checking official technical sources, curating museum records, writing bilingual fictional cases, implementing Angular/React and CSS, authoring tests/CI, running local verification, reviewing changes and writing this README. Compound Engineering skills structured brainstorming, planning, implementation and review. Additional AI reviewers examined bounded planning/code changes; the primary agent checked findings before integration.

The project owner selected the concept, atmosphere, interaction/scoring rules, languages, scope and publication choices. Angular CLI generated the initial configuration. Museum metadata and images come from the cited sources, not AI image generation. Automated tests and agent-operated browser checks are implementation evidence, not independent human playtests or accessibility certification.
