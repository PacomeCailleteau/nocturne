import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocaleStore } from '../core/i18n/locale-store';

@Component({
  selector: 'app-unavailable-page',
  imports: [RouterLink],
  template: `<section class="page empty-state">
    <span class="ornament" aria-hidden="true">◇</span>
    <p class="eyebrow">NOCTURNE</p>
    <h1>{{ locale.t('unavailablePage') }}</h1>
    <a class="button" routerLink="/">{{ locale.t('backToCases') }} →</a>
  </section>`,
})
export class UnavailablePage {
  readonly locale = inject(LocaleStore);
}
