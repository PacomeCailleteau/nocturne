import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LocaleStore } from '../core/i18n/locale-store';
import { GameStore } from '../core/game/game-store';
import type { CaseDefinition } from '../domain/case-definition';

@Component({
  selector: 'app-puzzle-navigation',
  imports: [RouterLink, RouterLinkActive],
  template: `<nav class="puzzle-navigation" [attr.aria-label]="locale.t('dossier')">
    @for (puzzle of definition().puzzles; track puzzle.id; let index = $index) {
      <a [routerLink]="['/cases', definition().id, 'puzzles', puzzle.id]" routerLinkActive="active"
        ><span class="step-number">{{
          game.state().cases[definition().id].puzzles[puzzle.id].completion
            ? '✓'
            : '0' + (index + 1)
        }}</span
        ><span
          ><strong>{{ locale.pick(puzzle.title) }}</strong
          ><small>{{
            locale.t(
              game.state().cases[definition().id].puzzles[puzzle.id].completion
                ? 'completed'
                : 'notStarted'
            )
          }}</small></span
        ></a
      >
    }
  </nav>`,
})
export class PuzzleNavigation {
  readonly definition = input.required<CaseDefinition>();
  readonly locale = inject(LocaleStore);
  readonly game = inject(GameStore);
}
