import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  computed,
  effect,
  inject,
  untracked,
  viewChild,
  type OnDestroy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { AnalyticsElement } from '../../../integrations/analytics/analytics-element';
import { GameStore } from '../../core/game/game-store';
import { LocaleStore } from '../../core/i18n/locale-store';
import { ArtworkRepository } from '../../core/met/artwork-repository';
import { CASES } from '../../data/cases';
import { projectAnalytics } from './analytics-model';

@Component({
  selector: 'app-analytics-host',
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="page analytics-page">
      <header class="page-heading">
        <div>
          <p class="eyebrow">{{ locale.t('analyticsEyebrow') }}</p>
          <h1>{{ locale.t('analyticsTitle') }}</h1>
          <p class="lead">{{ locale.t('analyticsIntroduction') }}</p>
        </div>
        <a class="text-button" routerLink="/notebook">{{ locale.t('notebook') }} ↗</a>
      </header>
      <nocturne-analytics #analytics />
    </section>
  `,
})
export class AnalyticsHost implements OnDestroy {
  readonly locale = inject(LocaleStore);
  private readonly game = inject(GameStore);
  private readonly repository = inject(ArtworkRepository);
  private readonly element = viewChild<ElementRef<AnalyticsElement>>('analytics');
  readonly model = computed(() =>
    projectAnalytics(CASES, this.game.state(), this.repository.records(), this.locale.language()),
  );

  constructor() {
    effect(() => {
      const model = this.model();
      const element = this.element();
      if (element) element.nativeElement.model = model;
    });
    effect(() => {
      const state = this.game.state();
      const eligibleWitnesses = CASES.flatMap((definition) => {
        const chronology = definition.puzzles.find((puzzle) => puzzle.kind === 'chronology');
        return chronology && state.cases[definition.id].puzzles[chronology.id].completion
          ? chronology.items.map((item) => item.artworkId)
          : [];
      });
      const earnedCandidatePools = CASES.flatMap((definition) =>
        state.cases[definition.id].clueOrder.length ? definition.candidateIds : [],
      );
      untracked(() =>
        this.repository.load([
          ...state.discoveredArtworkIds,
          ...eligibleWitnesses,
          ...earnedCandidatePools,
        ]),
      );
    });
  }

  ngOnDestroy(): void {
    this.element()?.nativeElement.remove();
  }
}
