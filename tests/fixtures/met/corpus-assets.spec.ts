import { readFileSync, existsSync } from 'node:fs';
import { it, expect } from 'vitest';
import { ARTWORKS, CASES } from '../../../src/app/data/cases';

  it('preserves museum metadata, approved images, raw fixtures and dated public-domain source records', () => {
    for (const artwork of ARTWORKS) {
      const bytes = readFileSync(`public${artwork.referencePath}`, 'utf8').replace(/^\uFEFF/, '');
      const source = JSON.parse(bytes) as Record<string, unknown>;
      expect(readFileSync(`tests/fixtures/met/${artwork.id}.json`, 'utf8').replace(/^\uFEFF/, '')).toBe(bytes);
      expect(source['objectID']).toBe(artwork.id);
      expect(source['isPublicDomain']).toBe(true);
      for (const field of ['title', 'artistDisplayName', 'objectDate', 'objectBeginDate', 'objectEndDate', 'medium', 'objectName', 'department', 'culture', 'creditLine', 'objectURL'] as const) expect(artwork[field]).toBe(source[field]);
      expect(existsSync(`public${artwork.image.path}`)).toBe(true);
    }
    for (const puzzle of CASES.flatMap((item) => item.puzzles)) if (puzzle.kind === 'fragment') expect(existsSync(`public${puzzle.fragment.path}`)).toBe(true);
  });
