import { Injectable, computed, inject, signal } from '@angular/core';
import { CASES, CASE_BY_ID } from '../../data/cases';
import type { PuzzleAnswer } from '../../domain/case-definition';
import type { GameState } from '../../domain/game-state';
import { canInspectArtwork, confirmFinal, discoverArtwork, replayCase, requestHint, setDraft, submitPuzzle } from '../../domain/game-transitions';
import { ProgressStorage } from '../persistence/progress-storage';

@Injectable({ providedIn: 'root' })
export class GameStore {
  private readonly persistence = inject(ProgressStorage);
  private readonly writableState = signal(this.persistence.restored.game);
  readonly state = this.writableState.asReadonly();
  readonly discoveries = computed(() => this.state().discoveredArtworkIds);
  readonly completedCases = computed(() => CASES.filter((definition) => this.state().cases[definition.id].final.outcome !== null).length);

  setDraft(caseId: string, puzzleId: string, draft: PuzzleAnswer): void {
    const definition = CASE_BY_ID.get(caseId);
    if (definition) this.update(setDraft(this.state(), definition, puzzleId, draft));
  }

  submitPuzzle(caseId: string, puzzleId: string, answer?: PuzzleAnswer): void {
    const definition = CASE_BY_ID.get(caseId);
    const draft = answer ?? this.state().cases[caseId]?.puzzles[puzzleId]?.draft;
    if (definition && draft !== null && draft !== undefined) this.update(submitPuzzle(this.state(), definition, puzzleId, draft));
  }

  requestHint(caseId: string, puzzleId: string): void {
    const definition = CASE_BY_ID.get(caseId);
    if (definition) this.update(requestHint(this.state(), definition, puzzleId));
  }

  confirmFinal(caseId: string, candidateId: number, confirmationToken: string): void {
    const definition = CASE_BY_ID.get(caseId);
    if (definition) this.update(confirmFinal(this.state(), definition, candidateId, confirmationToken));
  }

  replayCase(caseId: string): void {
    const definition = CASE_BY_ID.get(caseId);
    if (definition) this.update(replayCase(this.state(), definition));
  }

  discoverArtwork(artworkId: number): void {
    this.update(discoverArtwork(this.state(), CASES, artworkId));
  }

  canInspectArtwork(artworkId: number): boolean {
    return canInspectArtwork(this.state(), CASES, artworkId);
  }

  private update(next: GameState): void {
    if (next === this.state()) return;
    this.writableState.set(next);
    this.persistence.saveGame(next);
  }
}
