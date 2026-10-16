import { describe, expect, it } from 'vitest';
import { CASES } from '../data/cases';
import { caseStars, createGameState, finalAvailable, puzzleStars } from './game-state';
import { confirmFinal, discoverArtwork, replayCase, requestHint, setDraft, submitPuzzle } from './game-transitions';
import type { GameState } from './game-state';

const dossier = CASES[0];
const puzzle = dossier.puzzles[0];
const wrongCandidate = dossier.candidateIds.find((id) => id !== dossier.targetArtworkId)!;

function completePuzzles(state = createGameState(CASES), hints = 0): GameState {
  for (const item of dossier.puzzles) {
    for (let level = 0; level < hints; level++) state = requestHint(state, dossier, item.id);
    state = submitPuzzle(state, dossier, item.id, item.answer);
  }
  return state;
}

describe('Museum investigation transitions', () => {
  it.each([[0, 3], [1, 2], [2, 2], [3, 1]] as const)('freezes %i hints at %i stars, irrespective of earlier mistakes', (hints, stars) => {
    let state = createGameState(CASES);
    const incorrect = puzzle.kind === 'fragment' ? puzzle.options.find((option) => option.id !== puzzle.answer)!.id : '';
    state = submitPuzzle(state, dossier, puzzle.id, incorrect);
    expect(state.cases[dossier.id].puzzles[puzzle.id].feedback).toBe('incorrect');
    expect(puzzleStars(state.cases[dossier.id].puzzles[puzzle.id])).toBe(0);
    for (let level = 0; level < hints; level++) state = requestHint(state, dossier, puzzle.id);
    state = submitPuzzle(state, dossier, puzzle.id, puzzle.answer);
    expect(puzzleStars(state.cases[dossier.id].puzzles[puzzle.id])).toBe(stars);
    const finished = state;
    state = requestHint(state, dossier, puzzle.id);
    state = submitPuzzle(state, dossier, puzzle.id, puzzle.answer);
    expect(state).toBe(finished);
    expect(state.cases[dossier.id].clueOrder).toEqual([puzzle.clue.id]);
  });

  it('opens the final only after the fourth completion, including an explained solution', () => {
    let state = createGameState(CASES);
    for (const item of dossier.puzzles.slice(0, 3)) state = submitPuzzle(state, dossier, item.id, item.answer);
    expect(finalAvailable(state.cases[dossier.id], dossier)).toBe(false);
    expect(confirmFinal(state, dossier, dossier.targetArtworkId, 'early')).toBe(state);
    for (let count = 0; count < 3; count++) state = requestHint(state, dossier, dossier.puzzles[3].id);
    expect(finalAvailable(state.cases[dossier.id], dossier)).toBe(true);
    expect(caseStars(state.cases[dossier.id])).toBe(10);
  });

  it('counts deliberate verdicts once and ends the second error with assistance without changing stars', () => {
    let state = completePuzzles();
    state = confirmFinal(state, dossier, wrongCandidate, 'confirmation-one');
    expect(state.cases[dossier.id].final.verdicts).toHaveLength(1);
    const firstError = state;
    expect(confirmFinal(state, dossier, wrongCandidate, 'confirmation-one')).toBe(firstError);
    expect(state.cases[dossier.id].final.outcome).toBeNull();
    state = confirmFinal(state, dossier, wrongCandidate, 'confirmation-two');
    expect(state.cases[dossier.id].final.outcome).toBe('assisted');
    expect(caseStars(state.cases[dossier.id])).toBe(12);
    expect(state.discoveredArtworkIds).toContain(dossier.targetArtworkId);
    expect(confirmFinal(state, dossier, dossier.targetArtworkId, 'third')).toBe(state);
  });

  it('starts a fresh replay while retaining discoveries and the best whole complete attempt', () => {
    let state = discoverArtwork(createGameState(CASES), CASES, dossier.witnessIds[0]);
    state = completePuzzles(state, 1);
    state = confirmFinal(state, dossier, dossier.targetArtworkId, 'first');
    const best = state.cases[dossier.id].best;
    expect(best?.puzzleStars).toEqual(Object.fromEntries(dossier.puzzles.map((item) => [item.id, 2])));
    state = replayCase(state, dossier);
    expect(state.cases[dossier.id].attemptNumber).toBe(2);
    expect(state.cases[dossier.id].clueOrder).toEqual([]);
    expect(caseStars(state.cases[dossier.id])).toBe(0);
    expect(state.discoveredArtworkIds).toEqual(expect.arrayContaining([dossier.witnessIds[0], dossier.targetArtworkId]));
    for (const item of dossier.puzzles.slice(0, 3)) state = submitPuzzle(state, dossier, item.id, item.answer);
    expect(caseStars(state.cases[dossier.id])).toBe(9);
    expect(state.cases[dossier.id].best).toBe(best);
    state = submitPuzzle(state, dossier, dossier.puzzles[3].id, dossier.puzzles[3].answer);
    state = confirmFinal(state, dossier, dossier.targetArtworkId, 'second');
    expect(state.cases[dossier.id].best?.attemptNumber).toBe(2);
  });

  it('prefers an unassisted conclusion on equal stars and retains an earlier fully tied attempt', () => {
    let state = completePuzzles();
    state = confirmFinal(state, dossier, wrongCandidate, 'one');
    state = confirmFinal(state, dossier, wrongCandidate, 'two');
    expect(state.cases[dossier.id].best?.finalAssisted).toBe(true);
    state = completePuzzles(replayCase(state, dossier));
    state = confirmFinal(state, dossier, dossier.targetArtworkId, 'three');
    expect(state.cases[dossier.id].best?.attemptNumber).toBe(2);
    const best = state.cases[dossier.id].best;
    state = completePuzzles(replayCase(state, dossier));
    state = confirmFinal(state, dossier, dossier.targetArtworkId, 'four');
    expect(state.cases[dossier.id].best).toBe(best);
  });

  it('retains independent partial selections and assemblies and records clues in earned order', () => {
    let state = createGameState(CASES);
    const chronology = dossier.puzzles[1];
    const label = dossier.puzzles[3];
    if (label.kind !== 'torn-label') throw new Error('Expected the label puzzle');
    const partial = [label.answer[0], ''];
    state = setDraft(state, dossier, puzzle.id, puzzle.answer);
    state = setDraft(state, dossier, label.id, partial);
    expect(state.cases[dossier.id].puzzles[label.id].draft).toEqual(partial);
    state = submitPuzzle(state, dossier, chronology.id, chronology.answer);
    state = submitPuzzle(state, dossier, puzzle.id, puzzle.answer);
    expect(state.cases[dossier.id].clueOrder).toEqual([chronology.clue.id, puzzle.clue.id]);
    expect(state.cases[dossier.id].puzzles[label.id].draft).toEqual(partial);
  });

  it('discovers intentionally inspected witnesses but never a hidden target before conclusion', () => {
    const state = createGameState(CASES);
    expect(discoverArtwork(state, CASES, dossier.targetArtworkId)).toBe(state);
    expect(discoverArtwork(state, CASES, 999999)).toBe(state);
    const inspected = discoverArtwork(state, CASES, dossier.witnessIds[0]);
    expect(inspected.discoveredArtworkIds).toEqual([dossier.witnessIds[0]]);
    expect(discoverArtwork(inspected, CASES, dossier.witnessIds[0])).toBe(inspected);
  });
});
