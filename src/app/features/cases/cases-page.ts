import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleStore } from '../../core/i18n/locale-store';
import { GameStore } from '../../core/game/game-store';
import { CASES } from '../../data/cases';
import { completedPuzzleCount, caseStars } from '../../domain/game-state';
import { ArtworkImage } from '../../shared/artwork-image';

@Component({
  selector: 'app-cases-page',
  imports: [RouterLink, ArtworkImage],
  templateUrl: './cases-page.html',
})
export class CasesPage {
  readonly locale = inject(LocaleStore);
  readonly game = inject(GameStore);
  readonly cases = CASES;
  readonly completedPuzzleCount = completedPuzzleCount;
  readonly caseStars = caseStars;
}
