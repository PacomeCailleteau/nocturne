import { describe, expect, it } from 'vitest';
import { ARTWORK_BY_ID, CASES } from '../../data/cases';
import { normalizeMetArtwork } from '../../core/met/met-normalizer';
import type { ArtworkRecordState } from '../../domain/artwork';
import { createGameState } from '../../domain/game-state';
import { discoverArtwork, replayCase, requestHint, submitPuzzle } from '../../domain/game-transitions';
import { projectAnalytics } from './analytics-model';

function live(id: number, changes: Record<string, unknown> = {}): ArtworkRecordState {
  return { status: 'ready', artwork: normalizeMetArtwork({ ...ARTWORK_BY_ID.get(id), objectID: id, ...changes }, id)!, provenance: { kind: 'live', retrievedAt: '2026-10-17', url: 'https://collectionapi.metmuseum.org' } };
}

describe('Analytics disclosure projection', () => {
  it('transfers no timeline facts before each individual chronology is completed', () => {
    let state = createGameState(CASES);
    const chronology = CASES[0].puzzles.find((puzzle) => puzzle.kind === 'chronology')!;
    const locked = projectAnalytics(CASES, state, new Map(), 'fr');
    expect(locked.cases.every((item) => item.timeline.length === 0 && !item.timelineEligible)).toBe(true);
    expect(JSON.stringify(locked)).not.toContain('Young Woman with a Water Pitcher');
    state = submitPuzzle(state, CASES[0], chronology.id, chronology.answer);
    const model = projectAnalytics(CASES, state, new Map(), 'en');
    expect(model.cases[0].timeline).toHaveLength(3);
    expect(model.cases[0].timeline[0]).toMatchObject({ begin: 1657, end: 1667 });
    expect(model.cases[1].timeline).toEqual([]);
    expect(model.cases[2].timeline).toEqual([]);
    expect(JSON.stringify(model)).not.toContain('544512');
    expect(Object.isFrozen(model.cases[0].timeline[0])).toBe(true);
  });

  it('keeps display date labels separate from ancient numeric intervals', () => {
    let state = createGameState(CASES);
    const definition = CASES[2];
    const chronology = definition.puzzles.find((puzzle) => puzzle.kind === 'chronology')!;
    state = submitPuzzle(state, definition, chronology.id, chronology.answer);
    const row = projectAnalytics(CASES, state, new Map(), 'en').cases[2].timeline.find((item) => item.title === ARTWORK_BY_ID.get(544498)!.title)!;
    expect(row.begin).toBe(ARTWORK_BY_ID.get(544498)!.objectBeginDate);
    expect(row.end).toBe(ARTWORK_BY_ID.get(544498)!.objectEndDate);
    expect(row.begin).toBeLessThan(0);
    expect(row.dateLabel).toBe(ARTWORK_BY_ID.get(544498)!.objectDate);
    expect(row.source).toContain('2026-10-16');
  });

  it('uses eligible live museum facts and labels dated type copies with an exact sample', () => {
    let state = createGameState(CASES);
    const definition = CASES[0];
    const chronology = definition.puzzles[1];
    state = submitPuzzle(state, definition, chronology.id, chronology.answer);
    state = discoverArtwork(state, CASES, 437881);
    const record = live(437881, { title: 'Current museum witness title' });
    const records = new Map([[437881, record]]);
    const model = projectAnalytics(CASES, state, records, 'en');
    expect(model.cases[0].timeline[0]).toMatchObject({ title: 'Current museum witness title', begin: 1657, end: 1667, source: 'Met · current record' });
    const fallback = { ...record, provenance: { kind: 'reference' as const, retrievedAt: '2026-10-16', url: 'https://www.metmuseum.org' } };
    const distribution = projectAnalytics(CASES, state, new Map([[437881, fallback]]), 'en').distributions[0];
    expect(distribution.sample).toBe(1);
    expect(distribution.rows).toEqual([{ label: 'Painting', count: 1, live: 0, reference: 1, unavailable: 0, referenceDates: ['2026-10-16'] }]);
  });

  it('counts actual normalized types, including missing records and absent optional fields', () => {
    const initial = createGameState(CASES);
    const state = { ...initial, discoveredArtworkIds: [437881, 436964, 436451] };
    const records = new Map([[437881, live(437881, { objectName: 'API-controlled type' })], [436964, live(436964, { objectName: '' })]]);
    const distribution = projectAnalytics(CASES, state, records, 'en').distributions[0];
    expect(distribution.sample).toBe(3);
    expect(distribution.rows).toContainEqual({ label: 'API-controlled type', count: 1, live: 1, reference: 0, unavailable: 0, referenceDates: [] });
    expect(distribution.rows).toContainEqual({ label: null, count: 2, live: 1, reference: 0, unavailable: 1, referenceDates: [] });
    expect(projectAnalytics(CASES, state, records, 'en').distributions[2].sample).toBe(0);
  });

  it('does not turn downloads into discoveries or transfer undiscovered target identities', () => {
    const records = new Map([[436535, live(436535)], [437881, live(437881)]]);
    const model = projectAnalytics(CASES, createGameState(CASES), records, 'en');
    expect(model.distributions[0].sample).toBe(0);
    const serialized = JSON.stringify(model);
    for (const definition of CASES) {
      expect(serialized).not.toContain(String(definition.targetArtworkId));
      expect(serialized).not.toContain(ARTWORK_BY_ID.get(definition.targetArtworkId)!.title);
    }
    expect(serialized).not.toMatch(/candidateIds|targetArtworkId|predicates|answer|verdicts/);
  });

  it('intersects constraints in the real earned order and uses common evidence on source drift', () => {
    let state = createGameState(CASES);
    const definition = CASES[0];
    const fragment = definition.puzzles[0];
    const chronology = definition.puzzles[1];
    state = submitPuzzle(state, definition, chronology.id, chronology.answer);
    state = submitPuzzle(state, definition, fragment.id, fragment.answer);
    const records = new Map([[436535, live(436535, { objectEndDate: 2099, objectName: 'Drawing' })]]);
    const points = projectAnalytics(CASES, state, records, 'en').cases[0].candidates;
    expect(points).toEqual([
      { label: 'Before the clues', count: 4 },
      { label: 'The chronological archive', count: 3 },
      { label: 'The recovered fragment', count: 2 },
    ]);
    expect(JSON.stringify(points)).not.toContain('436535');
    expect(projectAnalytics(CASES, state, records, 'en').cases[1].candidates).toEqual([{ label: 'Before the clues', count: 4 }]);
  });

  it('replay closes only that timeline and clears current histories and stars while retaining discoveries', () => {
    let state = createGameState(CASES);
    for (const definition of CASES.slice(0, 2)) {
      const chronology = definition.puzzles.find((puzzle) => puzzle.kind === 'chronology')!;
      state = submitPuzzle(state, definition, chronology.id, chronology.answer);
    }
    state = discoverArtwork(state, CASES, 437881);
    state = replayCase(state, CASES[0]);
    const model = projectAnalytics(CASES, state, new Map([[437881, live(437881)]]), 'en');
    expect(model.cases[0].timeline).toEqual([]);
    expect(model.cases[0].candidates).toEqual([{ label: 'Before the clues', count: 4 }]);
    expect(model.cases[0].stars.every((row) => row.value === 0 && !row.completed)).toBe(true);
    expect(model.cases[0].attempt).toBe(2);
    expect(model.cases[1].timeline).toHaveLength(3);
    expect(model.distributions[0].sample).toBe(1);
  });

  it('projects frozen earned stars and language without leaking a puzzle answer', () => {
    const definition = CASES[0];
    const puzzle = definition.puzzles[0];
    let state = requestHint(createGameState(CASES), definition, puzzle.id);
    state = submitPuzzle(state, definition, puzzle.id, puzzle.answer);
    const french = projectAnalytics(CASES, state, new Map(), 'fr');
    const english = projectAnalytics(CASES, state, new Map(), 'en');
    expect(french.cases[0].stars[0]).toEqual({ label: 'Le fragment retrouvé', value: 2, completed: true });
    expect(english.cases[0].stars[0]).toEqual({ label: 'The recovered fragment', value: 2, completed: true });
    expect(JSON.stringify(english)).not.toContain('work-436964');
  });
});
