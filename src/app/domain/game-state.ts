import type { ArtworkId, CaseDefinition, PuzzleAnswer } from './case-definition';

export type HintLevel = 0 | 1 | 2 | 3;
export type Stars = 1 | 2 | 3;
export type FinalOutcome = 'solved' | 'assisted';

export interface PuzzleProgress {
  readonly draft: PuzzleAnswer | null;
  readonly hintLevel: HintLevel;
  readonly completion: Readonly<{ stars: Stars }> | null;
  readonly feedback: 'incorrect' | 'correct' | null;
}

export interface FinalVerdict {
  readonly token: string;
  readonly candidateId: ArtworkId;
}

export interface CompletedAttempt {
  readonly attemptNumber: number;
  readonly puzzleStars: Readonly<Record<string, Stars>>;
  readonly finalAssisted: boolean;
}

export interface CaseProgress {
  readonly revision: string;
  readonly attemptNumber: number;
  readonly puzzles: Readonly<Record<string, PuzzleProgress>>;
  readonly clueOrder: readonly string[];
  readonly final: Readonly<{ verdicts: readonly FinalVerdict[]; outcome: FinalOutcome | null }>;
  readonly best: CompletedAttempt | null;
}

export interface GameState {
  readonly cases: Readonly<Record<string, CaseProgress>>;
  readonly discoveredArtworkIds: readonly ArtworkId[];
}

export function createCaseProgress(definition: CaseDefinition, attemptNumber = 1, best: CompletedAttempt | null = null): CaseProgress {
  return {
    revision: definition.revision,
    attemptNumber,
    puzzles: Object.fromEntries(definition.puzzles.map((puzzle) => [puzzle.id, { draft: null, hintLevel: 0, completion: null, feedback: null }])),
    clueOrder: [],
    final: { verdicts: [], outcome: null },
    best,
  };
}

export function createGameState(definitions: readonly CaseDefinition[]): GameState {
  return { cases: Object.fromEntries(definitions.map((definition) => [definition.id, createCaseProgress(definition)])), discoveredArtworkIds: [] };
}

export function starsForHints(hints: HintLevel): Stars {
  return hints === 3 ? 1 : hints === 0 ? 3 : 2;
}

export function puzzleStars(progress: PuzzleProgress): number {
  return progress.completion?.stars ?? 0;
}

export function caseStars(progress: CaseProgress): number {
  return Object.values(progress.puzzles).reduce((sum, puzzle) => sum + puzzleStars(puzzle), 0);
}

export function completedPuzzleCount(progress: CaseProgress): number {
  return Object.values(progress.puzzles).filter((puzzle) => puzzle.completion !== null).length;
}

export function finalAvailable(progress: CaseProgress, definition: CaseDefinition): boolean {
  return definition.puzzles.every((puzzle) => progress.puzzles[puzzle.id]?.completion !== null && progress.puzzles[puzzle.id]?.completion !== undefined);
}

export function bestStars(attempt: CompletedAttempt | null): number {
  return attempt ? Object.values(attempt.puzzleStars).reduce<number>((sum, stars) => sum + stars, 0) : 0;
}
