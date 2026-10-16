import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ARTWORK_BY_ID } from '../../data/cases';
import { ArtworkRepository } from './artwork-repository';

const endpoint = (id: number) => `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
const raw = (id: number) => ({ objectID: id, title: `Live work ${id}`, medium: 'Oil on canvas' });

describe('Artwork repository', () => {
  let repository: ArtworkRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    repository = TestBed.inject(ArtworkRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.useRealTimers();
  });

  it('shares a live request and its received values between simultaneous consumers', async () => {
    const first = repository.ensure(436535);
    const second = repository.ensure(436535);
    expect(first).toBe(second);
    expect(first().status).toBe('loading');
    http.expectOne(endpoint(436535)).flush(raw(436535));
    await vi.waitFor(() => expect(first().status).toBe('ready'));
    expect(first().artwork?.title).toBe('Live work 436535');
    expect(first().provenance?.kind).toBe('live');
    repository.ensure(436535);
    http.expectNone(endpoint(436535));
  });

  it('limits the shared queue to four in-flight records', async () => {
    repository.load([436535, 437881, 436964, 436451, 437655]);
    const active = http.match((request) => request.url.startsWith('https://collectionapi.metmuseum.org'));
    expect(active).toHaveLength(4);
    http.expectNone(endpoint(437655));
    active[0].flush(raw(436535));
    const next = await vi.waitFor(() => http.expectOne(endpoint(437655)));
    next.flush(raw(437655));
    active.slice(1).forEach((request, index) => request.flush(raw([437881, 436964, 436451][index])));
    await vi.waitFor(() => expect(repository.state(437655)().status).toBe('ready'));
  });

  it('uses a dated copy after an HTTP failure and replaces it after an explicit successful retry', async () => {
    const record = repository.ensure(436535);
    http.expectOne(endpoint(436535)).flush('Unavailable', { status: 503, statusText: 'Unavailable' });
    const copy = await vi.waitFor(() => http.expectOne(ARTWORK_BY_ID.get(436535)!.referencePath));
    copy.flush({ ...raw(436535), title: 'Dated work' });
    await vi.waitFor(() => expect(record().provenance?.kind).toBe('reference'));
    expect(record().artwork?.title).toBe('Dated work');
    expect(record().provenance?.retrievedAt).toBe(ARTWORK_BY_ID.get(436535)!.retrievedAt);
    expect(record().failure).toBe('request-failed');
    repository.retry(436535);
    http.expectOne(endpoint(436535)).flush({ ...raw(436535), title: 'Restored live work' });
    await vi.waitFor(() => expect(record().provenance?.kind).toBe('live'));
    expect(record().artwork?.title).toBe('Restored live work');
    expect(record().failure).toBeUndefined();
  });

  it('falls back for unusable JSON but keeps optional missing fields in a direct record', async () => {
    const missing = repository.ensure(436535);
    http.expectOne(endpoint(436535)).flush({ objectID: 436535, title: 'Live work', medium: '' });
    await vi.waitFor(() => expect(missing().status).toBe('ready'));
    expect(missing().artwork?.medium).toBeNull();
    expect(missing().provenance?.kind).toBe('live');
    http.expectNone(ARTWORK_BY_ID.get(436535)!.referencePath);
    const malformed = repository.ensure(437881);
    http.expectOne(endpoint(437881)).flush({ message: 'Not a record' });
    const copy = await vi.waitFor(() => http.expectOne(ARTWORK_BY_ID.get(437881)!.referencePath));
    copy.flush(raw(437881));
    await vi.waitFor(() => expect(malformed().status).toBe('ready'));
    expect(malformed().failure).toBe('invalid-record');
  });

  it('uses a copy after the request deadline without leaving the request active', async () => {
    vi.useFakeTimers();
    const record = repository.ensure(436535);
    const request = http.expectOne(endpoint(436535));
    await vi.advanceTimersByTimeAsync(12000);
    expect(request.cancelled).toBe(true);
    http.expectOne(ARTWORK_BY_ID.get(436535)!.referencePath).flush(raw(436535));
    await vi.advanceTimersByTimeAsync(0);
    expect(record().provenance?.kind).toBe('reference');
    expect(record().failure).toBe('timeout');
  });

  it('exposes unavailable when neither live data nor a usable copy exists', async () => {
    const record = repository.ensure(436535);
    http.expectOne(endpoint(436535)).flush(null, { status: 404, statusText: 'Not Found' });
    const copy = await vi.waitFor(() => http.expectOne(ARTWORK_BY_ID.get(436535)!.referencePath));
    copy.flush({ message: 'No copy' });
    await vi.waitFor(() => expect(record().status).toBe('unavailable'));
    expect(record().artwork).toBeUndefined();
    repository.retry(436535);
    http.expectOne(endpoint(436535)).flush(raw(436535));
    await vi.waitFor(() => expect(record().status).toBe('ready'));
  });

  it('keeps another route independent from a late previous response', async () => {
    const previous = repository.ensure(436535);
    const next = repository.ensure(437881);
    http.expectOne(endpoint(437881)).flush(raw(437881));
    await vi.waitFor(() => expect(next().status).toBe('ready'));
    http.expectOne(endpoint(436535)).flush(raw(436535));
    await vi.waitFor(() => expect(previous().status).toBe('ready'));
    expect(next().artwork?.id).toBe(437881);
    expect(next().artwork?.title).toBe('Live work 437881');
  });
});
