import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleStore } from '../../core/i18n/locale-store';
import { GameStore } from '../../core/game/game-store';
import { ArtworkRepository } from '../../core/met/artwork-repository';
import { CASES } from '../../data/cases';
import { caseStars, completedPuzzleCount, bestStars } from '../../domain/game-state';
import { ArtworkImage } from '../../shared/artwork-image';

@Component({
  selector: 'app-notebook-page',
  imports: [RouterLink, ArtworkImage],
  templateUrl: './notebook-page.html',
})
export class NotebookPage {
  readonly locale = inject(LocaleStore);
  readonly game = inject(GameStore);
  readonly repository = inject(ArtworkRepository);
  readonly cases = CASES;
  readonly query = signal('');
  readonly type = signal('');
  readonly caseStars = caseStars;
  readonly completedPuzzleCount = completedPuzzleCount;
  readonly bestStars = bestStars;
  readonly discoveries = computed(() =>
    this.game.discoveries().map((id) => ({ id, record: this.repository.state(id)() })),
  );
  readonly types = computed(() =>
    [
      ...new Set(
        this.discoveries()
          .map((item) => item.record.artwork?.objectName)
          .filter((value): value is string => !!value),
      ),
    ].sort(),
  );
  readonly filtered = computed(() => {
    const query = this.query().trim().toLocaleLowerCase(this.locale.language());
    return this.discoveries().filter(
      ({ record }) =>
        (!this.type() || record.artwork?.objectName === this.type()) &&
        (!query ||
          [record.artwork?.title, record.artwork?.artistDisplayName, record.artwork?.medium].some(
            (value) => value?.toLocaleLowerCase(this.locale.language()).includes(query),
          )),
    );
  });

  constructor() {
    effect(() => {
      const ids = this.game.discoveries();
      untracked(() => this.repository.load(ids));
    });
  }
  search(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
  filterType(event: Event): void {
    this.type.set((event.target as HTMLSelectElement).value);
  }
}
