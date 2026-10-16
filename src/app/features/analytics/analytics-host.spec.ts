import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expect } from 'vitest';
import { registerAnalyticsElement, type AnalyticsElement } from '../../../integrations/analytics/analytics-element';
import { GameStore } from '../../core/game/game-store';
import { LocaleStore } from '../../core/i18n/locale-store';
import { PROGRESS_STORAGE } from '../../core/persistence/progress-storage';
import { ARTWORK_BY_ID } from '../../data/cases';
import { AnalyticsHost } from './analytics-host';

describe('Angular analytics host', () => {
  it('passes immutable projections to React and updates locale and live game progress', async () => {
    registerAnalyticsElement();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), { provide: PROGRESS_STORAGE, useValue: null }] });
    const fixture = TestBed.createComponent(AnalyticsHost);
    document.body.append(fixture.nativeElement);
    await fixture.whenStable();
    const element = (fixture.nativeElement as HTMLElement).querySelector<AnalyticsElement>('nocturne-analytics')!;
    expect(element.isConnected).toBe(true);
    await expect.poll(() => element.shadowRoot!.querySelectorAll('.tabs button').length).toBe(4);
    expect(Object.isFrozen(element.model)).toBe(true);
    const http = TestBed.inject(HttpTestingController);
    http.expectNone((request) => request.url.includes('/objects/'));
    TestBed.inject(LocaleStore).setLanguage('en');
    const game = TestBed.inject(GameStore);
    for (let hint = 0; hint < 3; hint++) game.requestHint('the-silent-frame', 'silent-fragment');
    await fixture.whenStable();
    const requests = http.match((request) => request.url.includes('/objects/'));
    expect(requests.map((request) => Number(request.request.url.split('/').at(-1))).sort()).toEqual([334652, 435876, 436535, 437655]);
    for (const request of requests) {
      const id = Number(request.request.url.split('/').at(-1));
      request.flush({ ...ARTWORK_BY_ID.get(id), objectID: id });
    }
    await fixture.whenStable();
    await expect.poll(() => element.shadowRoot!.querySelector('h2')?.textContent).toBe('Timeline');
    const stars = [...element.shadowRoot!.querySelectorAll('button')].find((item) => item.textContent?.includes('Stars by puzzle'))!;
    stars.click();
    await expect.poll(() => element.shadowRoot!.textContent?.includes('1 / 3')).toBe(true);
    expect(element.model!.cases[0].candidates).toHaveLength(2);
    expect(element.model!.cases[0].candidateSource).toBe('Met · current record');
    http.verify();
    fixture.destroy();
    expect(element.isConnected).toBe(false);
    expect(element.shadowRoot!.querySelectorAll('button')).toHaveLength(0);
  });
});
