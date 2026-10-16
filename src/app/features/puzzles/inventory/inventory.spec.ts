import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { CASES } from '../../../data/cases';
import { projectCaseEvidence } from '../../../core/met/case-evidence';
import { PROGRESS_STORAGE } from '../../../core/persistence/progress-storage';
import { Inventory } from './inventory';

describe('Inventory interaction', () => {
  it('keeps slot labels fixed when moving a witness and explains a violated constraint only after submission', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), { provide: PROGRESS_STORAGE, useValue: null }],
    });
    const definition = CASES[2];
    const puzzle = definition.puzzles.find((item) => item.kind === 'inventory')!;
    const fixture = TestBed.createComponent(Inventory);
    fixture.componentRef.setInput('puzzle', puzzle);
    fixture.componentRef.setInput('evidence', projectCaseEvidence(definition, new Map()));
    fixture.componentInstance.draftChange.subscribe((draft) => fixture.componentRef.setInput('draft', draft));
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.constraint-feedback')).toBeNull();
    element.querySelector<HTMLButtonElement>('[data-order-id="work-544752"] button')!.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.draft()).toEqual(['work-548360', 'work-544752', 'work-544498']);
    expect([...element.querySelectorAll('.order-slot-label')].map((item) => item.textContent?.trim())).toEqual(['I · Gauche', 'II · Milieu', 'III · Droite']);
    fixture.componentRef.setInput('incorrect', true);
    await fixture.whenStable();
    expect(element.querySelector('.constraint-feedback')?.textContent).toContain('Le sphinx précède la tête royale.');
    fixture.componentRef.setInput('draft', puzzle.answer);
    await fixture.whenStable();
    expect(element.querySelector('.constraint-feedback')).toBeNull();
  });
});
