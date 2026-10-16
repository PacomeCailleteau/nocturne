import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CASE_BY_ID } from '../../data/cases';
import { LocaleStore } from '../../core/i18n/locale-store';
import { GameStore } from '../../core/game/game-store';
import { ArtworkRepository } from '../../core/met/artwork-repository';
import { projectCaseEvidence } from '../../core/met/case-evidence';
import type { PuzzleAnswer } from '../../domain/case-definition';
import { PuzzleNavigation } from '../../shared/puzzle-navigation';
import { PuzzleRenderer } from './puzzle-renderer';
import { completeOrder, initialChronology } from './order-controls';
import { ArtworkImage } from '../../shared/artwork-image';
import { SourceStatus } from '../../shared/source-status';
import { UnavailablePage } from '../../shared/unavailable-page';

@Component({
  selector: 'app-puzzle-page',
  imports: [
    RouterLink,
    PuzzleNavigation,
    PuzzleRenderer,
    ArtworkImage,
    SourceStatus,
    UnavailablePage,
  ],
  templateUrl: './puzzle-page.html',
})
export class PuzzlePage {
  private readonly injector = inject(Injector);
  private readonly continuation = viewChild<ElementRef<HTMLAnchorElement>>('continuation');
  readonly locale = inject(LocaleStore);
  readonly game = inject(GameStore);
  readonly repository = inject(ArtworkRepository);
  private readonly params = toSignal(inject(ActivatedRoute).paramMap);
  readonly definition = computed(() => CASE_BY_ID.get(this.params()?.get('caseId') ?? ''));
  readonly puzzle = computed(() =>
    this.definition()?.puzzles.find((puzzle) => puzzle.id === this.params()?.get('puzzleId')),
  );
  readonly progress = computed(
    () => this.game.state().cases[this.definition()?.id ?? '']?.puzzles[this.puzzle()?.id ?? ''],
  );
  readonly evidence = computed(() =>
    this.definition()
      ? projectCaseEvidence(this.definition()!, this.repository.records())
      : undefined,
  );
  readonly explanationOpen = signal(false);
  readonly hintKeys = ['hintOrientation', 'hintPrecise', 'hintSolution'] as const;
  readonly nextHintKey = computed(() => {
    const level = this.progress()?.hintLevel ?? 0;
    return level === 0 ? 'hintOrientation' : level === 1 ? 'hintPrecise' : 'hintSolution';
  });
  readonly nextPuzzle = computed(() => {
    const definition = this.definition();
    if (!definition) return undefined;
    return definition.puzzles.find(
      (puzzle) =>
        puzzle.id !== this.puzzle()?.id &&
        !this.game.state().cases[definition.id].puzzles[puzzle.id].completion,
    );
  });

  constructor() {
    effect(() => {
      const puzzle = this.puzzle();
      if (puzzle) untracked(() => this.repository.load(puzzle.witnessIds));
      this.explanationOpen.set(false);
    });
  }

  setDraft(answer: PuzzleAnswer): void {
    this.game.setDraft(this.definition()!.id, this.puzzle()!.id, answer);
  }
  submit(): void {
    const puzzle = this.puzzle()!;
    let draft = this.progress().draft;
    if (puzzle.kind === 'chronology' || puzzle.kind === 'inventory') {
      const items = puzzle.kind === 'chronology' ? initialChronology(puzzle.items) : puzzle.items;
      draft = completeOrder(
        items.map((item) => item.id),
        Array.isArray(draft) ? draft : null,
      );
    }
    if (draft !== null) this.game.submitPuzzle(this.definition()!.id, puzzle.id, draft);
    this.focusContinuation();
  }
  private focusContinuation(): void {
    if (this.progress()?.completion) {
      afterNextRender(() => this.continuation()?.nativeElement.focus(), {
        injector: this.injector,
      });
    }
  }
  hint(): void {
    this.game.requestHint(this.definition()!.id, this.puzzle()!.id);
    this.focusContinuation();
  }
}
