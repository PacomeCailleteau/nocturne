import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { CASES } from '../../data/cases';
import { createGameState } from '../../domain/game-state';
import { confirmFinal, replayCase, requestHint, setDraft, submitPuzzle } from '../../domain/game-transitions';
import { parseProgress, PROGRESS_STORAGE, ProgressStorage, STORAGE_KEY } from './progress-storage';
import { GameStore } from '../game/game-store';
import { LocaleStore } from '../i18n/locale-store';

const dossier = CASES[0];

function memoryStorage(initial: string | null = null) {
  let value = initial;
  return { getItem: () => value, setItem: (_key: string, next: string) => { value = next; } };
}

describe('Versioned local progress', () => {
  it('restores partial selections, assemblies, earned clues and locale without storing derived chart data', () => {
    const label = dossier.puzzles[3];
    if (label.kind !== 'torn-label') throw new Error('Expected a label puzzle');
    let game = createGameState(CASES);
    game = submitPuzzle(game, dossier, dossier.puzzles[0].id, dossier.puzzles[0].answer);
    game = setDraft(game, dossier, label.id, [label.answer[0], '']);
    game = requestHint(game, dossier, label.id);
    const restored = parseProgress(JSON.stringify({ version: 1, locale: 'en', game }), CASES);
    expect(restored.locale).toBe('en');
    expect(restored.game).toEqual(game);
    expect(restored.discarded).toBe(false);
  });

  it.each(['{broken', JSON.stringify({ version: 77, locale: 'en' }), JSON.stringify({ version: 1, locale: 'fr', game: { cases: {}, discoveredArtworkIds: [99999] } })])('rejects incompatible progression without granting clues: %s', (raw) => {
    const result = parseProgress(raw, CASES);
    expect(result.game).toEqual(createGameState(CASES));
    expect(result.discarded).toBe(true);
  });

  it('keeps independent valid cases and language when another case has an unknown answer or incompatible revision', () => {
    let game = createGameState(CASES);
    const second = CASES[1];
    game = submitPuzzle(game, second, second.puzzles[0].id, second.puzzles[0].answer);
    const damaged = structuredClone(game);
    const raw = { ...damaged, cases: { ...damaged.cases, [dossier.id]: { ...damaged.cases[dossier.id], revision: 'unrecognized' } } };
    const result = parseProgress(JSON.stringify({ version: 1, locale: 'en', game: raw }), CASES);
    expect(result.locale).toBe('en');
    expect(result.game.cases[dossier.id]).toEqual(createGameState(CASES).cases[dossier.id]);
    expect(result.game.cases[second.id]).toEqual(game.cases[second.id]);
    expect(result.discarded).toBe(true);
  });

  it('rejects an unknown answer ID without granting progress', () => {
    const fresh = createGameState(CASES);
    const puzzleId = dossier.puzzles[0].id;
    const game = { ...fresh, cases: { ...fresh.cases, [dossier.id]: { ...fresh.cases[dossier.id], puzzles: { ...fresh.cases[dossier.id].puzzles, [puzzleId]: { ...fresh.cases[dossier.id].puzzles[puzzleId], draft: 'unknown-answer' } } } } };
    expect(parseProgress(JSON.stringify({ version: 1, locale: 'fr', game }), CASES).game).toEqual(fresh);
  });

  it('round-trips a concluded case and the retained complete best result after replay', () => {
    let game = createGameState(CASES);
    for (const puzzle of dossier.puzzles) {
      game = requestHint(game, dossier, puzzle.id);
      game = submitPuzzle(game, dossier, puzzle.id, puzzle.answer);
    }
    const wrongId = dossier.candidateIds.find((id) => id !== dossier.targetArtworkId)!;
    game = confirmFinal(game, dossier, wrongId, 'first-confirmation');
    const first = parseProgress(JSON.stringify({ version: 1, locale: 'en', game }), CASES);
    expect(first.game).toEqual(game);
    expect(first.discarded).toBe(false);
    game = confirmFinal(game, dossier, wrongId, 'second-confirmation');
    expect(parseProgress(JSON.stringify({ version: 1, locale: 'en', game }), CASES).game).toEqual(game);
    game = replayCase(game, dossier);
    const replay = parseProgress(JSON.stringify({ version: 1, locale: 'en', game }), CASES);
    expect(replay.game).toEqual(game);
    expect(replay.discarded).toBe(false);
  });

  it('rejects forged clues and inconsistent completion stars', () => {
    const fresh = createGameState(CASES);
    for (const patch of [
      { clueOrder: [dossier.puzzles[0].clue.id] },
      { puzzles: { ...fresh.cases[dossier.id].puzzles, [dossier.puzzles[0].id]: { draft: dossier.puzzles[0].answer, hintLevel: 2, completion: { stars: 3 }, feedback: 'correct' } } },
    ]) {
      const game = { ...fresh, cases: { ...fresh.cases, [dossier.id]: { ...fresh.cases[dossier.id], ...patch } } };
      const result = parseProgress(JSON.stringify({ version: 1, locale: 'fr', game }), CASES);
      expect(result.game.cases[dossier.id]).toEqual(fresh.cases[dossier.id]);
      expect(result.discarded).toBe(true);
    }
  });

  it('rejects duplicate verdict tokens in an otherwise valid completed attempt', () => {
    let game = createGameState(CASES);
    for (const puzzle of dossier.puzzles) game = submitPuzzle(game, dossier, puzzle.id, puzzle.answer);
    const wrongId = dossier.candidateIds.find((id) => id !== dossier.targetArtworkId)!;
    game = confirmFinal(game, dossier, wrongId, 'first-confirmation');
    game = confirmFinal(game, dossier, wrongId, 'second-confirmation');
    const valid = parseProgress(JSON.stringify({ version: 1, locale: 'fr', game }), CASES);
    expect(valid.discarded).toBe(false);
    expect(valid.game).toEqual(game);
    const progress = game.cases[dossier.id];
    const verdicts = progress.final.verdicts.map((verdict) => ({ ...verdict, token: 'first-confirmation' }));
    const damaged = { ...game, cases: { ...game.cases, [dossier.id]: { ...progress, final: { ...progress.final, verdicts } } } };
    const restored = parseProgress(JSON.stringify({ version: 1, locale: 'fr', game: damaged }), CASES);
    expect(restored.discarded).toBe(true);
    expect(restored.game.cases[dossier.id]).toEqual(createGameState(CASES).cases[dossier.id]);
  });

  it('continues in memory when reading or writing storage is refused', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PROGRESS_STORAGE, useValue: { getItem: () => { throw new Error('Denied'); }, setItem: () => { throw new Error('Denied'); } } }] });
    const persistence = TestBed.inject(ProgressStorage);
    const game = TestBed.inject(GameStore);
    game.submitPuzzle(dossier.id, dossier.puzzles[0].id, dossier.puzzles[0].answer);
    expect(persistence.available()).toBe(false);
    expect(game.state().cases[dossier.id].puzzles[dossier.puzzles[0].id].completion?.stars).toBe(3);
  });

  it('retains the current state when a previously available store refuses a write', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PROGRESS_STORAGE, useValue: { getItem: () => null, setItem: () => { throw new Error('Quota exceeded'); } } }] });
    const persistence = TestBed.inject(ProgressStorage);
    expect(persistence.available()).toBe(true);
    const game = TestBed.inject(GameStore);
    game.requestHint(dossier.id, dossier.puzzles[0].id);
    expect(persistence.available()).toBe(false);
    expect(game.state().cases[dossier.id].puzzles[dossier.puzzles[0].id].hintLevel).toBe(1);
  });

  it('changes language and document lang while preserving partial game state across a new store', () => {
    const storage = memoryStorage();
    TestBed.configureTestingModule({ providers: [{ provide: PROGRESS_STORAGE, useValue: storage }] });
    const game = TestBed.inject(GameStore);
    const locale = TestBed.inject(LocaleStore);
    game.setDraft(dossier.id, dossier.puzzles[0].id, dossier.puzzles[0].answer);
    game.requestHint(dossier.id, dossier.puzzles[0].id);
    const before = game.state();
    locale.setLanguage('en');
    expect(document.documentElement.lang).toBe('en');
    expect(game.state()).toBe(before);
    expect(storage.getItem()).toContain('"locale":"en"');
    expect(STORAGE_KEY).toContain('nocturne');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [{ provide: PROGRESS_STORAGE, useValue: storage }] });
    expect(TestBed.inject(GameStore).state()).toEqual(before);
    expect(TestBed.inject(LocaleStore).language()).toBe('en');
  });
});
