import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PuzzleRenderer } from './puzzle-renderer';
import { CASES } from '../../data/cases';
import { projectCaseEvidence } from '../../core/met/case-evidence';
import { PROGRESS_STORAGE } from '../../core/persistence/progress-storage';
import { LocaleStore } from '../../core/i18n/locale-store';
import type { PuzzleAnswer } from '../../domain/case-definition';

describe('Puzzle interaction', () => {
  it('restores a partial label with an empty slot and continues after switching language', async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), { provide: PROGRESS_STORAGE, useValue: null }] });
    const definition = CASES[0];
    const puzzle = definition.puzzles.find((item) => item.kind === 'torn-label')!;
    const fixture = TestBed.createComponent(PuzzleRenderer);
    fixture.componentRef.setInput('puzzle', puzzle);
    fixture.componentRef.setInput('evidence', projectCaseEvidence(definition, new Map()));
    fixture.componentRef.setInput('draft', ['label-artist', '']);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('[data-order-id]')).toHaveLength(1);
    TestBed.inject(LocaleStore).setLanguage('en');
    await fixture.whenStable();
    let changed: PuzzleAnswer | undefined;
    fixture.componentInstance.draftChange.subscribe((draft) => { changed = draft; fixture.componentRef.setInput('draft', draft); });
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('[data-fragment-id="label-title"]')!.click();
    await fixture.whenStable();
    expect(changed).toEqual(['label-artist', 'label-title']);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Young Lady in 1866');
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('[data-order-id]')).toHaveLength(2);
  });
});
