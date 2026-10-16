import { Component, computed, effect, inject, untracked } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocaleStore } from '../../core/i18n/locale-store';
import { GameStore } from '../../core/game/game-store';
import { ArtworkRepository } from '../../core/met/artwork-repository';
import { CASES, ARTWORK_BY_ID } from '../../data/cases';
import { ArtworkImage } from '../../shared/artwork-image';
import { DialogComponent } from '../../shared/dialog';
import type { Artwork } from '../../domain/artwork';
import type { TranslationKey } from '../../core/i18n/dictionaries';

@Component({
  selector: 'app-artwork-page',
  imports: [RouterLink, ArtworkImage, DialogComponent],
  templateUrl: './artwork-page.html',
})
export class ArtworkPage {
  readonly locale = inject(LocaleStore);
  readonly game = inject(GameStore);
  readonly repository = inject(ArtworkRepository);
  private readonly params = toSignal(inject(ActivatedRoute).paramMap);
  readonly id = computed(() => Number(this.params()?.get('artworkId')));
  readonly eligible = computed(
    () => ARTWORK_BY_ID.has(this.id()) && this.game.canInspectArtwork(this.id()),
  );
  readonly record = computed(() =>
    this.eligible() ? this.repository.state(this.id())() : undefined,
  );
  readonly relatedCase = computed(() =>
    CASES.find(
      (definition) =>
        definition.witnessIds.includes(this.id()) || definition.candidateIds.includes(this.id()),
    ),
  );
  readonly fields: readonly { key: keyof Artwork; label: TranslationKey }[] = [
    { key: 'artistDisplayName', label: 'artist' },
    { key: 'objectDate', label: 'date' },
    { key: 'medium', label: 'medium' },
    { key: 'objectName', label: 'objectType' },
    { key: 'culture', label: 'culture' },
    { key: 'department', label: 'department' },
    { key: 'creditLine', label: 'credit' },
  ];

  constructor() {
    effect(() => {
      const id = this.id();
      if (this.eligible())
        untracked(() => {
          this.game.discoverArtwork(id);
          this.repository.ensure(id);
        });
    });
  }
}
