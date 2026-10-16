import { computed, inject, Injectable, signal, type Signal } from '@angular/core';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { ARTWORK_BY_ID } from '../../data/cases';
import type { ArtworkFailure, ArtworkRecordState } from '../../domain/artwork';
import type { ArtworkId } from '../../domain/case-definition';
import { MetClient, MET_API_BASE } from './met-client';
import { normalizeMetArtwork } from './met-normalizer';

const IDLE: ArtworkRecordState = { status: 'idle' };

@Injectable({ providedIn: 'root' })
export class ArtworkRepository {
  private readonly client = inject(MetClient);
  private readonly values = signal<ReadonlyMap<ArtworkId, ArtworkRecordState>>(new Map());
  private readonly views = new Map<ArtworkId, Signal<ArtworkRecordState>>();
  private readonly queue: ArtworkId[] = [];
  private active = 0;
  readonly records = this.values.asReadonly();

  state(id: ArtworkId): Signal<ArtworkRecordState> {
    let view = this.views.get(id);
    if (!view) {
      view = computed(() => this.values().get(id) ?? IDLE);
      this.views.set(id, view);
    }
    return view;
  }

  ensure(id: ArtworkId): Signal<ArtworkRecordState> {
    const view = this.state(id);
    if (view().status === 'idle') this.enqueue(id);
    return view;
  }

  load(ids: readonly ArtworkId[]): void {
    ids.forEach((id) => this.ensure(id));
  }

  retry(id: ArtworkId): void {
    if (this.state(id)().status !== 'loading') this.enqueue(id);
  }

  private set(id: ArtworkId, state: ArtworkRecordState): void {
    const values = new Map(this.values());
    values.set(id, state);
    this.values.set(values);
  }

  private enqueue(id: ArtworkId): void {
    this.set(id, { ...this.state(id)(), status: 'loading' });
    this.queue.push(id);
    this.drain();
  }

  private drain(): void {
    while (this.active < 4 && this.queue.length) {
      const id = this.queue.shift()!;
      this.active++;
      void this.retrieve(id).finally(() => {
        this.active--;
        this.drain();
      });
    }
  }

  private async retrieve(id: ArtworkId): Promise<void> {
    let failure: ArtworkFailure = 'invalid-record';
    try {
      const raw = await firstValueFrom(this.client.getArtwork(id));
      const artwork = normalizeMetArtwork(raw, id);
      if (artwork) {
        this.set(id, { status: 'ready', artwork, provenance: { kind: 'live', retrievedAt: new Date().toISOString(), url: `${MET_API_BASE}/${id}` } });
        return;
      }
    } catch (error) {
      failure = error instanceof TimeoutError ? 'timeout' : 'request-failed';
    }
    const reference = ARTWORK_BY_ID.get(id);
    if (reference) {
      try {
        const raw = await firstValueFrom(this.client.getReference(reference.referencePath));
        const artwork = normalizeMetArtwork(raw, id);
        if (artwork) {
          this.set(id, { status: 'ready', artwork, failure, provenance: { kind: 'reference', retrievedAt: reference.retrievedAt, url: reference.objectURL } });
          return;
        }
      } catch {
        this.set(id, { status: 'unavailable', failure });
        return;
      }
    }
    this.set(id, { status: 'unavailable', failure });
  }
}
