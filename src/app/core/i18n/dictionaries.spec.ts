import { describe, expect, it } from 'vitest';
import { EN, FR } from './dictionaries';
import type { TranslationKey } from './dictionaries';

describe('Runtime interface dictionaries', () => {
  it('provides nonempty French and English text with matching parameter names', () => {
    expect(Object.keys(EN).sort()).toEqual(Object.keys(FR).sort());
    for (const key of Object.keys(FR) as TranslationKey[]) {
      expect(FR[key].trim()).not.toBe('');
      expect(EN[key].trim()).not.toBe('');
      const placeholders = (text: string) => text.match(/\{\w+\}/g)?.sort() ?? [];
      expect(placeholders(EN[key]), key).toEqual(placeholders(FR[key]));
    }
  });
});
