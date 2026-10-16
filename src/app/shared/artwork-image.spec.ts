import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ArtworkRepository } from '../core/met/artwork-repository';
import { MET_API_BASE } from '../core/met/met-client';
import { LocaleStore } from '../core/i18n/locale-store';
import { PROGRESS_STORAGE } from '../core/persistence/progress-storage';
import { ARTWORK_BY_ID } from '../data/cases';
import { ArtworkImage } from './artwork-image';

beforeEach(() => {
  TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), { provide: PROGRESS_STORAGE, useValue: null }] });
});

describe('Rendered artwork image failures', () => {
  it('replaces a failed local-first image and recovers when the artwork changes', async () => {
    const fixture = TestBed.createComponent(ArtworkImage);
    fixture.componentRef.setInput('artworkId', 437881);
    fixture.componentRef.setInput('localOnly', true);
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('img')?.getAttribute('src')).toBe('/artworks/437881.webp');
    host.querySelector('img')!.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(host.querySelector('img')).toBeNull();
    expect(host.querySelector('.missing-image')?.textContent).toContain('Image momentanément indisponible');
    fixture.componentRef.setInput('artworkId', 436964);
    await fixture.whenStable();
    expect(host.querySelector('img')?.getAttribute('src')).toBe('/artworks/436964.webp');
    expect(host.querySelector('.missing-image')).toBeNull();
  });

  it('uses the local copy after a live image error, reports its failure, and recovers on a refreshed record', async () => {
    const fixture = TestBed.createComponent(ArtworkImage);
    fixture.componentRef.setInput('artworkId', 437881);
    const repository = TestBed.inject(ArtworkRepository);
    const http = TestBed.inject(HttpTestingController);
    const reference = ARTWORK_BY_ID.get(437881)!;
    repository.ensure(437881);
    http.expectOne(`${MET_API_BASE}/437881`).flush({ ...reference, objectID: 437881 });
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('img')?.getAttribute('src')).toBe(reference.primaryImageSmall);
    host.querySelector('img')!.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(host.querySelector('img')?.getAttribute('src')).toBe('/artworks/437881.webp');
    expect(host.querySelector('.image-notice')?.textContent).toContain('Reproduction locale');
    host.querySelector('img')!.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(host.querySelector('img')).toBeNull();
    TestBed.inject(LocaleStore).setLanguage('en');
    await fixture.whenStable();
    expect(host.querySelector('.missing-image')?.textContent).toContain('Image temporarily unavailable');
    repository.retry(437881);
    http.expectOne(`${MET_API_BASE}/437881`).flush({ ...reference, objectID: 437881, primaryImageSmall: 'https://images.metmuseum.org/recovered.jpg' });
    await fixture.whenStable();
    expect(host.querySelector('img')?.getAttribute('src')).toBe('https://images.metmuseum.org/recovered.jpg');
    expect(host.querySelector('.missing-image')).toBeNull();
    expect(host.querySelector('.image-notice')).toBeNull();
    http.verify();
  });
});
