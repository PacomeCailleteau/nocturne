import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ARTWORK_BY_ID } from '../data/cases';
import { ArtworkRepository } from '../core/met/artwork-repository';
import { LocaleStore } from '../core/i18n/locale-store';

@Component({
  selector: 'app-artwork-image',
  host: { '[class.image-cover]': 'cover()', '[class.image-compact]': 'compact()' },
  template: `@if (source()) {
      <img
        [src]="source()"
        [alt]="altText()"
        [attr.loading]="eager() ? 'eager' : 'lazy'"
        decoding="async"
        (error)="imageFailed()"
      />
    } @else {
      <div class="missing-image">
        <span aria-hidden="true">◇</span><span>{{ locale.t('imageUnavailable') }}</span>
      </div>
    }
    @if (backupVisible()) {
      <span class="image-notice">{{
        locale.t(source() ? 'localImageCopy' : 'imageUnavailable')
      }}</span>
    }`,
})
export class ArtworkImage {
  readonly artworkId = input.required<number>();
  readonly alt = input<string>();
  readonly cover = input(false);
  readonly compact = input(false);
  readonly eager = input(false);
  readonly localOnly = input(false);
  readonly locale = inject(LocaleStore);
  private readonly repository = inject(ArtworkRepository);
  readonly failed = signal(0);
  readonly source = computed(() => {
    if (this.failed() > 1) return null;
    const reference = ARTWORK_BY_ID.get(this.artworkId());
    const record = this.repository.state(this.artworkId())();
    if (
      !this.localOnly() &&
      !this.failed() &&
      record.provenance?.kind === 'live' &&
      (record.artwork?.primaryImageSmall || record.artwork?.primaryImage)
    )
      return record.artwork.primaryImageSmall || record.artwork.primaryImage;
    return reference?.image.path ?? null;
  });
  readonly backupVisible = computed(() => {
    const record = this.repository.state(this.artworkId())();
    return (
      !this.localOnly() &&
      (this.failed() > 0 ||
        (record.status === 'ready' &&
          (record.provenance?.kind === 'reference' ||
            (!record.artwork?.primaryImageSmall && !record.artwork?.primaryImage))))
    );
  });
  readonly altText = computed(
    () => this.alt() ?? this.locale.pick(ARTWORK_BY_ID.get(this.artworkId())!.image.alt),
  );

  constructor() {
    effect(() => {
      this.artworkId();
      this.repository.state(this.artworkId())();
      this.failed.set(0);
    });
  }

  imageFailed(): void {
    const local = ARTWORK_BY_ID.get(this.artworkId())?.image.path;
    this.failed.set(this.source() === local ? 2 : 1);
  }
}
