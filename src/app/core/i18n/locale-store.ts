import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import type { Language, Localized } from '../../domain/case-definition';
import { ProgressStorage } from '../persistence/progress-storage';
import { EN, FR } from './dictionaries';
import type { TranslationKey } from './dictionaries';

@Injectable({ providedIn: 'root' })
export class LocaleStore {
  private readonly persistence = inject(ProgressStorage);
  private readonly document = inject(DOCUMENT);
  private readonly writableLanguage = signal<Language>(this.persistence.restored.locale);
  readonly language = this.writableLanguage.asReadonly();

  constructor() {
    this.document.documentElement.lang = this.language();
  }

  setLanguage(language: Language): void {
    if (language === this.language()) return;
    this.writableLanguage.set(language);
    this.document.documentElement.lang = language;
    this.persistence.saveLocale(language);
  }

  toggle(): void {
    this.setLanguage(this.language() === 'fr' ? 'en' : 'fr');
  }

  pick(value: Localized): string {
    return value[this.language()];
  }

  t(key: TranslationKey, parameters: Readonly<Record<string, string | number>> = {}): string {
    const dictionary = this.language() === 'fr' ? FR : EN;
    return dictionary[key].replace(/\{(\w+)\}/g, (placeholder: string, name: string) => String(parameters[name] ?? placeholder));
  }
}
