import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { PROGRESS_STORAGE } from './core/persistence/progress-storage';

describe('Application entry', () => {
  it('offers case navigation and switches the shell language at runtime', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([]), { provide: PROGRESS_STORAGE, useValue: null }] });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('nav')?.textContent).toContain('Les affaires');
    expect(element.querySelector('nav')?.textContent).toContain('Mon carnet');
    const languageButton = element.querySelector<HTMLButtonElement>('[data-testid="language-toggle"]');
    expect(languageButton).not.toBeNull();
    languageButton!.click();
    await fixture.whenStable();
    expect(element.querySelector('nav')?.textContent).toContain('The cases');
    expect(document.documentElement.lang).toBe('en');
  });
});
