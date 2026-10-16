import { Component, effect, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { LocaleStore } from './core/i18n/locale-store';
import { ProgressStorage } from './core/persistence/progress-storage';
import { DialogComponent } from './shared/dialog';
import { CASE_BY_ID } from './data/cases';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, DialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly locale = inject(LocaleStore);
  readonly storage = inject(ProgressStorage);
  readonly menuOpen = signal(false);
  private readonly routeUrl = signal(inject(Router).url);
  readonly ruleKeys = [
    'ruleOpen',
    'ruleStars',
    'ruleErrors',
    'ruleFinal',
    'ruleAssistance',
    'ruleSave',
    'ruleMuseum',
  ] as const;

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.routeUrl.set(event.urlAfterRedirects);
        this.menuOpen.set(false);
        document.getElementById('main-content')?.focus({ preventScroll: true });
      });
    effect(() => {
      const parts = this.routeUrl().split(/[/?#]/).filter(Boolean);
      const definition = parts[0] === 'cases' ? CASE_BY_ID.get(parts[1]) : undefined;
      const puzzle = definition?.puzzles.find((item) => item.id === parts[3]);
      const label = puzzle
        ? this.locale.pick(puzzle.title)
        : definition
          ? this.locale.pick(definition.title)
          : parts[0] === 'notebook'
            ? this.locale.t('notebook')
            : parts[0] === 'analytics'
              ? this.locale.t('analyticsTitle')
              : parts[0] === 'artworks'
                ? this.locale.t('artworkDetails')
                : parts.length
                  ? this.locale.t('unavailablePage')
                  : this.locale.t('appSubtitle');
      document.title = `${label} — Nocturne`;
    });
  }

  skipToContent(event: Event): void {
    event.preventDefault();
    document.getElementById('main-content')?.focus();
  }
}
