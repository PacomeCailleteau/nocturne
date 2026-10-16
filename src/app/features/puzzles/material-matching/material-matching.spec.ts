import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { CASES } from '../../../data/cases';
import { projectCaseEvidence } from '../../../core/met/case-evidence';
import { PROGRESS_STORAGE } from '../../../core/persistence/progress-storage';
import { MaterialMatching } from './material-matching';

describe('Material matching interaction', () => {
  it('swaps an assigned witness and can clear a report without discarding other matches', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), { provide: PROGRESS_STORAGE, useValue: null }],
    });
    const definition = CASES[1];
    const puzzle = definition.puzzles.find((item) => item.kind === 'materials')!;
    const fixture = TestBed.createComponent(MaterialMatching);
    fixture.componentRef.setInput('puzzle', puzzle);
    fixture.componentRef.setInput('evidence', projectCaseEvidence(definition, new Map()));
    fixture.componentRef.setInput('draft', {
      'report-a': 'work-78617',
      'report-b': 'work-37193',
      'report-c': 'work-37189',
    });
    fixture.componentInstance.draftChange.subscribe((draft) => fixture.componentRef.setInput('draft', draft));
    await fixture.whenStable();
    const select = (id: string, value: string): void => {
      const control = (fixture.nativeElement as HTMLElement).querySelector<HTMLSelectElement>(`[data-report-id="${id}"]`)!;
      control.value = value;
      control.dispatchEvent(new Event('change'));
    };
    select('report-a', 'work-37189');
    await fixture.whenStable();
    expect(fixture.componentInstance.draft()).toEqual({
      'report-a': 'work-37189',
      'report-b': 'work-37193',
      'report-c': 'work-78617',
    });
    select('report-b', '');
    await fixture.whenStable();
    expect(fixture.componentInstance.draft()?.['report-a']).toBe('work-37189');
    expect(fixture.componentInstance.draft()?.['report-b']).toBe('');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Woodblock print; ink and color on paper');
  });
});
