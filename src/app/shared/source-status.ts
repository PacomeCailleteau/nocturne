import { Component, inject, input } from '@angular/core';
import { LocaleStore } from '../core/i18n/locale-store';
import { ArtworkRepository } from '../core/met/artwork-repository';
import type { EvidenceArtwork } from '../domain/artwork';

@Component({
  selector: 'app-source-status',
  template: `@if (evidence(); as item) {
    <div class="source-status" [class.reference-notice]="item.reason !== 'live'">
      @switch (item.reason) {
        @case ('live') {
          <span class="source-dot"></span>{{ locale.t('sourceLive') }}
        }
        @case ('loading') {
          {{ locale.t('loading') }} ·
          {{ locale.t('sourceReference', { date: item.provenance.retrievedAt.slice(0, 10) }) }}
        }
        @case ('diverged') {
          <p>
            {{ locale.t('sourceReference', { date: item.provenance.retrievedAt.slice(0, 10) }) }}
          </p>
          <p>{{ locale.t('sourceReferenceExplanation') }}</p>
        }
        @default {
          <p>
            {{ locale.t('sourceFallback', { date: item.provenance.retrievedAt.slice(0, 10) }) }}
          </p>
          <p>{{ locale.t('sourceFallbackExplanation') }}</p>
          <button type="button" class="text-button" (click)="repository.retry(item.id)">
            {{ locale.t('retry') }} ↻
          </button>
        }
      }
    </div>
  }`,
})
export class SourceStatus {
  readonly evidence = input<EvidenceArtwork>();
  readonly locale = inject(LocaleStore);
  readonly repository = inject(ArtworkRepository);
}
