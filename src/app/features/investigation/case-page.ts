import { Component, computed, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocaleStore } from '../../core/i18n/locale-store';
import { GameStore } from '../../core/game/game-store';
import { ArtworkRepository } from '../../core/met/artwork-repository';
import { projectCaseEvidence } from '../../core/met/case-evidence';
import { CASE_BY_ID, ARTWORK_BY_ID } from '../../data/cases';
import {
  caseStars,
  completedPuzzleCount,
  finalAvailable,
  bestStars,
} from '../../domain/game-state';
import { ArtworkImage } from '../../shared/artwork-image';
import { PuzzleNavigation } from '../../shared/puzzle-navigation';
import { DialogComponent } from '../../shared/dialog';
import { SourceStatus } from '../../shared/source-status';
import { UnavailablePage } from '../../shared/unavailable-page';

@Component({
  selector: 'app-case-page',
  imports: [
    RouterLink,
    ArtworkImage,
    PuzzleNavigation,
    DialogComponent,
    SourceStatus,
    UnavailablePage,
  ],
  templateUrl: './case-page.html',
})
export class CasePage {
  readonly locale = inject(LocaleStore);
  readonly game = inject(GameStore);
  readonly repository = inject(ArtworkRepository);
  private readonly params = toSignal(inject(ActivatedRoute).paramMap);
  readonly definition = computed(() => CASE_BY_ID.get(this.params()?.get('caseId') ?? ''));
  readonly progress = computed(() => this.game.state().cases[this.definition()?.id ?? '']);
  readonly evidence = computed(() =>
    this.definition()
      ? projectCaseEvidence(this.definition()!, this.repository.records())
      : undefined,
  );
  readonly selected = signal<number | null>(null);
  private token = '';
  private readonly confirmation = viewChild.required<DialogComponent>('confirmation');
  private readonly replay = viewChild.required<DialogComponent>('replay');
  readonly caseStars = caseStars;
  readonly completedPuzzleCount = completedPuzzleCount;
  readonly finalAvailable = finalAvailable;
  readonly bestStars = bestStars;
  readonly reference = ARTWORK_BY_ID;
  readonly lastWrong = computed(() => {
    const progress = this.progress();
    return progress && !progress.final.outcome
      ? progress.final.verdicts.at(-1)?.candidateId
      : undefined;
  });

  constructor() {
    effect(() => {
      const definition = this.definition();
      if (definition)
        untracked(() =>
          this.repository.load([...definition.witnessIds, ...definition.candidateIds]),
        );
      this.selected.set(null);
    });
  }

  selectCandidate(id: number): void {
    this.selected.set(id);
    this.token = crypto.randomUUID();
    this.confirmation().open();
  }

  confirm(): void {
    const definition = this.definition();
    if (definition && this.selected() !== null)
      this.game.confirmFinal(definition.id, this.selected()!, this.token);
    this.confirmation().close();
  }

  openReplay(): void {
    this.replay().open();
  }
  replayCase(): void {
    this.game.replayCase(this.definition()!.id);
    this.selected.set(null);
    this.replay().close();
  }
}
