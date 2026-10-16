import { Injectable, InjectionToken, inject, signal } from '@angular/core';
import { CASES } from '../../data/cases';
import type { CaseDefinition, Language, Puzzle } from '../../domain/case-definition';
import { answerMatches } from '../../domain/content-validation';
import { createGameState, finalAvailable, starsForHints } from '../../domain/game-state';
import type { CaseProgress, CompletedAttempt, FinalVerdict, GameState, HintLevel, PuzzleProgress, Stars } from '../../domain/game-state';
import { isPuzzleDraft, preferredAttempt } from '../../domain/game-transitions';

export const STORAGE_KEY = 'nocturne.progress.v1';

export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface RestoredProgress {
  readonly game: GameState;
  readonly locale: Language;
  readonly discarded: boolean;
}

export const PROGRESS_STORAGE = new InjectionToken<StoragePort | null>('Nocturne progress storage', {
  providedIn: 'root',
  factory: () => {
    try { return globalThis.localStorage; } catch { return null; }
  },
});

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function positiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 1;
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

function parsePuzzle(value: unknown, puzzle: Puzzle): PuzzleProgress | undefined {
  if (!record(value) || !Number.isInteger(value['hintLevel']) || ![0, 1, 2, 3].includes(value['hintLevel'] as number)) return undefined;
  const hintLevel = value['hintLevel'] as HintLevel;
  const draft = value['draft'];
  if (draft !== null && !isPuzzleDraft(puzzle, draft)) return undefined;
  const feedback = value['feedback'];
  if (feedback !== null && feedback !== 'correct' && feedback !== 'incorrect') return undefined;
  const completion = value['completion'];
  if (completion !== null) {
    if (!record(completion) || completion['stars'] !== starsForHints(hintLevel) || draft === null || !isPuzzleDraft(puzzle, draft) || !answerMatches(puzzle, draft) || feedback !== 'correct') return undefined;
    return { draft, hintLevel, completion: { stars: completion['stars'] as Stars }, feedback };
  }
  if (hintLevel === 3 || feedback === 'correct' || (feedback === 'incorrect' && (draft === null || answerMatches(puzzle, draft)))) return undefined;
  return { draft: draft as PuzzleProgress['draft'], hintLevel, completion: null, feedback };
}

function parseBest(value: unknown, definition: CaseDefinition, attemptNumber: number): CompletedAttempt | null | undefined {
  if (value === null) return null;
  if (!record(value) || !positiveInteger(value['attemptNumber']) || value['attemptNumber'] > attemptNumber || typeof value['finalAssisted'] !== 'boolean') return undefined;
  const puzzleStars = value['puzzleStars'];
  if (!record(puzzleStars) || !exactKeys(puzzleStars, definition.puzzles.map((puzzle) => puzzle.id)) || !Object.values(puzzleStars).every((stars) => stars === 1 || stars === 2 || stars === 3)) return undefined;
  return { attemptNumber: value['attemptNumber'], puzzleStars: puzzleStars as Readonly<Record<string, Stars>>, finalAssisted: value['finalAssisted'] };
}

function parseCase(value: unknown, definition: CaseDefinition): CaseProgress | undefined {
  if (!record(value) || value['revision'] !== definition.revision || !positiveInteger(value['attemptNumber'])) return undefined;
  const rawPuzzles = value['puzzles'];
  if (!record(rawPuzzles) || !exactKeys(rawPuzzles, definition.puzzles.map((puzzle) => puzzle.id))) return undefined;
  const puzzles: Record<string, PuzzleProgress> = {};
  for (const puzzle of definition.puzzles) {
    const parsed = parsePuzzle(rawPuzzles[puzzle.id], puzzle);
    if (!parsed) return undefined;
    puzzles[puzzle.id] = parsed;
  }
  const clueOrder = value['clueOrder'];
  const earnedClues = definition.puzzles.filter((puzzle) => puzzles[puzzle.id].completion).map((puzzle) => puzzle.clue.id);
  if (!Array.isArray(clueOrder) || clueOrder.length !== earnedClues.length || new Set(clueOrder).size !== clueOrder.length || !clueOrder.every((id: unknown) => typeof id === 'string' && earnedClues.includes(id))) return undefined;
  const best = parseBest(value['best'], definition, value['attemptNumber']);
  if (best === undefined) return undefined;
  const rawFinal = value['final'];
  if (!record(rawFinal) || !Array.isArray(rawFinal['verdicts']) || rawFinal['verdicts'].length > 2) return undefined;
  const verdicts: FinalVerdict[] = [];
  for (const verdict of rawFinal['verdicts']) {
    if (!record(verdict) || typeof verdict['token'] !== 'string' || !verdict['token'].trim() || typeof verdict['candidateId'] !== 'number' || !definition.candidateIds.includes(verdict['candidateId']) || verdicts.some((previous) => previous.token === verdict['token'])) return undefined;
    if (verdicts.some((previous) => previous.candidateId === definition.targetArtworkId)) return undefined;
    verdicts.push({ token: verdict['token'], candidateId: verdict['candidateId'] });
  }
  const expectedOutcome = verdicts.at(-1)?.candidateId === definition.targetArtworkId ? 'solved' : verdicts.length === 2 ? 'assisted' : null;
  if (rawFinal['outcome'] !== expectedOutcome) return undefined;
  const progress: CaseProgress = { revision: definition.revision, attemptNumber: value['attemptNumber'], puzzles, clueOrder, final: { verdicts, outcome: expectedOutcome }, best };
  if (verdicts.length && !finalAvailable(progress, definition)) return undefined;
  if (expectedOutcome) {
    if (!best) return undefined;
    const result: CompletedAttempt = { attemptNumber: progress.attemptNumber, puzzleStars: Object.fromEntries(definition.puzzles.map((puzzle) => [puzzle.id, puzzles[puzzle.id].completion!.stars])), finalAssisted: expectedOutcome === 'assisted' };
    if (preferredAttempt(best, result) !== best) return undefined;
    if (best.attemptNumber === progress.attemptNumber && (best.finalAssisted !== result.finalAssisted || definition.puzzles.some((puzzle) => best.puzzleStars[puzzle.id] !== result.puzzleStars[puzzle.id]))) return undefined;
  } else if (best?.attemptNumber === progress.attemptNumber) return undefined;
  return progress;
}

export function parseProgress(raw: string | null, definitions: readonly CaseDefinition[]): RestoredProgress {
  const fresh = createGameState(definitions);
  if (raw === null) return { game: fresh, locale: 'fr', discarded: false };
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return { game: fresh, locale: 'fr', discarded: true }; }
  if (!record(value)) return { game: fresh, locale: 'fr', discarded: true };
  const locale = value['locale'] === 'en' ? 'en' : 'fr';
  const game = value['game'];
  if (value['version'] !== 1 || !record(game) || !record(game['cases']) || !Array.isArray(game['discoveredArtworkIds'])) return { game: fresh, locale, discarded: true };
  let discarded = value['locale'] !== 'fr' && value['locale'] !== 'en';
  const cases: Record<string, CaseProgress> = {};
  for (const definition of definitions) {
    const parsed = parseCase(game['cases'][definition.id], definition);
    cases[definition.id] = parsed ?? fresh.cases[definition.id];
    if (!parsed) discarded = true;
  }
  if (Object.keys(game['cases']).some((id) => !definitions.some((definition) => definition.id === id))) discarded = true;
  const allowed = new Set(definitions.flatMap((definition) => [...definition.witnessIds, ...(cases[definition.id].best ? [definition.targetArtworkId] : [])]));
  const discoveredArtworkIds: number[] = [];
  for (const id of game['discoveredArtworkIds']) {
    if (typeof id === 'number' && allowed.has(id) && !discoveredArtworkIds.includes(id)) discoveredArtworkIds.push(id);
    else discarded = true;
  }
  for (const definition of definitions) {
    if (cases[definition.id].best && !discoveredArtworkIds.includes(definition.targetArtworkId)) {
      discoveredArtworkIds.push(definition.targetArtworkId);
      discarded = true;
    }
  }
  return { game: { cases, discoveredArtworkIds }, locale, discarded };
}

@Injectable({ providedIn: 'root' })
export class ProgressStorage {
  private readonly storage = inject(PROGRESS_STORAGE);
  private readonly writableAvailable = signal(this.storage !== null);
  readonly available = this.writableAvailable.asReadonly();
  readonly restored: RestoredProgress;
  private game: GameState;
  private locale: Language;

  constructor() {
    let raw: string | null = null;
    try { raw = this.storage?.getItem(STORAGE_KEY) ?? null; } catch { this.writableAvailable.set(false); }
    this.restored = parseProgress(raw, CASES);
    this.game = this.restored.game;
    this.locale = this.restored.locale;
  }

  saveGame(game: GameState): void {
    this.game = game;
    this.persist();
  }

  saveLocale(locale: Language): void {
    this.locale = locale;
    this.persist();
  }

  private persist(): void {
    if (!this.available()) return;
    try { this.storage!.setItem(STORAGE_KEY, JSON.stringify({ version: 1, locale: this.locale, game: this.game })); }
    catch { this.writableAvailable.set(false); }
  }
}
