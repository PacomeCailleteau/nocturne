import type { ArtworkId, CaseDefinition, Puzzle, PuzzleAnswer } from './case-definition';
import { answerMatches } from './content-validation';
import { bestStars, caseStars, createCaseProgress, finalAvailable, starsForHints } from './game-state';
import type { CaseProgress, CompletedAttempt, GameState, HintLevel, PuzzleProgress, Stars } from './game-state';

export function isPuzzleDraft(puzzle: Puzzle, draft: unknown): draft is PuzzleAnswer {
  if (puzzle.kind === 'fragment' || puzzle.kind === 'contradiction') {
    const ids = puzzle.kind === 'fragment' ? puzzle.options.map((option) => option.id) : puzzle.statements.map((statement) => statement.id);
    return typeof draft === 'string' && (draft === '' || ids.includes(draft));
  }
  if (puzzle.kind === 'materials') {
    if (!draft || typeof draft !== 'object' || Array.isArray(draft)) return false;
    const entries = Object.entries(draft);
    const values = entries.map(([, value]) => value).filter((value) => value !== '');
    return entries.every(([key, value]) => puzzle.reports.some((report) => report.id === key) && typeof value === 'string' && (value === '' || puzzle.items.some((item) => item.id === value))) && new Set(values).size === values.length;
  }
  const ids = puzzle.kind === 'torn-label' ? puzzle.fragments.map((fragment) => fragment.id) : puzzle.items.map((item) => item.id);
  if (!Array.isArray(draft) || draft.length > ids.length) return false;
  const chosen = draft.filter((id) => id !== '');
  return draft.every((id: unknown) => typeof id === 'string' && (id === '' || ids.includes(id))) && new Set(chosen).size === chosen.length;
}

function replaceCase(state: GameState, definition: CaseDefinition, progress: CaseProgress): GameState {
  return { ...state, cases: { ...state.cases, [definition.id]: progress } };
}

function replacePuzzle(state: GameState, definition: CaseDefinition, puzzle: Puzzle, progress: PuzzleProgress): GameState {
  const current = state.cases[definition.id];
  const earned = progress.completion !== null && !current.clueOrder.includes(puzzle.clue.id);
  return replaceCase(state, definition, { ...current, puzzles: { ...current.puzzles, [puzzle.id]: progress }, clueOrder: earned ? [...current.clueOrder, puzzle.clue.id] : current.clueOrder });
}

export function setDraft(state: GameState, definition: CaseDefinition, puzzleId: string, draft: PuzzleAnswer): GameState {
  const puzzle = definition.puzzles.find((item) => item.id === puzzleId);
  const current = state.cases[definition.id]?.puzzles[puzzleId];
  if (!puzzle || !current || current.completion || !isPuzzleDraft(puzzle, draft)) return state;
  return replacePuzzle(state, definition, puzzle, { ...current, draft: structuredClone(draft), feedback: null });
}

export function submitPuzzle(state: GameState, definition: CaseDefinition, puzzleId: string, answer: PuzzleAnswer): GameState {
  const puzzle = definition.puzzles.find((item) => item.id === puzzleId);
  const current = state.cases[definition.id]?.puzzles[puzzleId];
  if (!puzzle || !current || current.completion || !isPuzzleDraft(puzzle, answer)) return state;
  const correct = answerMatches(puzzle, answer);
  return replacePuzzle(state, definition, puzzle, {
    ...current,
    draft: structuredClone(answer),
    completion: correct ? { stars: starsForHints(current.hintLevel) } : null,
    feedback: correct ? 'correct' : 'incorrect',
  });
}

export function requestHint(state: GameState, definition: CaseDefinition, puzzleId: string): GameState {
  const puzzle = definition.puzzles.find((item) => item.id === puzzleId);
  const current = state.cases[definition.id]?.puzzles[puzzleId];
  if (!puzzle || !current || current.completion || current.hintLevel === 3) return state;
  const hintLevel = (current.hintLevel + 1) as HintLevel;
  return replacePuzzle(state, definition, puzzle, {
    ...current,
    hintLevel,
    ...(hintLevel === 3 ? { draft: structuredClone(puzzle.answer), completion: { stars: 1 as const }, feedback: 'correct' as const } : {}),
  });
}

export function preferredAttempt(previous: CompletedAttempt | null, candidate: CompletedAttempt): CompletedAttempt {
  const currentStars = bestStars(candidate);
  const previousStars = bestStars(previous);
  return previous === null || currentStars > previousStars || (currentStars === previousStars && previous.finalAssisted && !candidate.finalAssisted) ? candidate : previous;
}

export function confirmFinal(state: GameState, definition: CaseDefinition, candidateId: ArtworkId, token: string): GameState {
  const current = state.cases[definition.id];
  if (!current || !finalAvailable(current, definition) || current.final.outcome || !token.trim() || !definition.candidateIds.includes(candidateId) || current.final.verdicts.some((verdict) => verdict.token === token)) return state;
  const verdicts = [...current.final.verdicts, { token, candidateId }];
  const outcome = candidateId === definition.targetArtworkId ? 'solved' : verdicts.length === 2 ? 'assisted' : null;
  const result: CompletedAttempt | null = outcome ? {
    attemptNumber: current.attemptNumber,
    puzzleStars: Object.fromEntries(definition.puzzles.map((puzzle) => [puzzle.id, current.puzzles[puzzle.id].completion!.stars as Stars])),
    finalAssisted: outcome === 'assisted',
  } : null;
  const next = replaceCase(state, definition, { ...current, final: { verdicts, outcome }, best: result ? preferredAttempt(current.best, result) : current.best });
  return outcome && !next.discoveredArtworkIds.includes(definition.targetArtworkId) ? { ...next, discoveredArtworkIds: [...next.discoveredArtworkIds, definition.targetArtworkId] } : next;
}

export function replayCase(state: GameState, definition: CaseDefinition): GameState {
  const current = state.cases[definition.id];
  return current ? replaceCase(state, definition, createCaseProgress(definition, current.attemptNumber + 1, current.best)) : state;
}

export function discoverArtwork(state: GameState, definitions: readonly CaseDefinition[], artworkId: ArtworkId): GameState {
  if (state.discoveredArtworkIds.includes(artworkId) || !definitions.some((definition) => definition.witnessIds.includes(artworkId))) return state;
  return { ...state, discoveredArtworkIds: [...state.discoveredArtworkIds, artworkId] };
}

export function canInspectArtwork(state: GameState, definitions: readonly CaseDefinition[], artworkId: ArtworkId): boolean {
  return state.discoveredArtworkIds.includes(artworkId) || definitions.some((definition) => definition.witnessIds.includes(artworkId) || (definition.candidateIds.includes(artworkId) && finalAvailable(state.cases[definition.id], definition)));
}

export function currentCaseResult(progress: CaseProgress): Readonly<{ stars: number; completed: number; finalAssisted: boolean }> {
  return { stars: caseStars(progress), completed: Object.values(progress.puzzles).filter((puzzle) => puzzle.completion).length, finalAssisted: progress.final.outcome === 'assisted' };
}
