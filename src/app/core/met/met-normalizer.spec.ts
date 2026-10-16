import { describe, expect, it } from 'vitest';
import { normalizeMetArtwork } from './met-normalizer';

describe('Met normalization', () => {
  it('uses received values and keeps display dates separate from numeric bounds', () => {
    const artwork = normalizeMetArtwork({ objectID: 544512, title: 'Kohl tube', objectDate: 'ca. 1386–1347 B.C.', objectBeginDate: -1390, objectEndDate: -1352, medium: 'Faience', artistDisplayName: '' }, 544512);
    expect(artwork?.objectDate).toBe('ca. 1386–1347 B.C.');
    expect(artwork?.objectBeginDate).toBe(-1390);
    expect(artwork?.objectEndDate).toBe(-1352);
    expect(artwork?.medium).toBe('Faience');
    expect(artwork?.artistDisplayName).toBeNull();
    expect(artwork?.primaryImage).toBeNull();
  });

  it('keeps optional facts unknown instead of completing them from the authored case', () => {
    const artwork = normalizeMetArtwork({ objectID: 436535, title: 'Current title', medium: '', objectBeginDate: '1889', primaryImage: 'javascript:alert(1)' }, 436535);
    expect(artwork?.title).toBe('Current title');
    expect(artwork?.medium).toBeNull();
    expect(artwork?.objectBeginDate).toBeNull();
    expect(artwork?.primaryImage).toBeNull();
  });

  it('rejects unusable and mismatched records', () => {
    expect(normalizeMetArtwork({ message: 'ObjectID not found' }, 1)).toBeNull();
    expect(normalizeMetArtwork({ objectID: 2, title: 'Other work' }, 1)).toBeNull();
    expect(normalizeMetArtwork(null, 1)).toBeNull();
  });
});
