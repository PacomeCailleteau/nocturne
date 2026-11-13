import { describe, expect, it } from 'vitest';
import { DEFINITIONS } from '../../data/cases/definitions';
import { ANALYTICS_COPY } from '../../features/analytics/analytics-copy';
import { FR, EN } from './dictionaries';
import { displayText } from './display-text';

describe('editorial punctuation', () => {
  it('keeps both languages and case documents free of forbidden punctuation', () => {
    function check(value: unknown): void {
      if (!value || typeof value !== 'object') return;
      for (const [key, item] of Object.entries(value)) {
        if ((key === 'fr' || key === 'en') && typeof item === 'string')
          expect(item).not.toMatch(/[;\u2013\u2014]/);
        else check(item);
      }
    }
    check(DEFINITIONS);
    expect(JSON.stringify([FR, EN, ANALYTICS_COPY])).not.toMatch(/[;\u2013\u2014]/);
  });

  it('formats museum display text without changing the source record or dates', () => {
    const record = { title: 'Embroidery; a study', date: '1882\u201383', begin: -1390 };
    expect(displayText(record.title)).toBe('Embroidery, a study');
    expect(displayText(record.date)).toBe('1882-83');
    expect(displayText(record.begin)).toBe('-1390');
    expect(displayText(null)).toBe('');
    expect(record).toEqual({ title: 'Embroidery; a study', date: '1882\u201383', begin: -1390 });
  });
});
