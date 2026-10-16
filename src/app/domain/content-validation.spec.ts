import { describe, expect, it } from 'vitest';
import { CASES, ARTWORKS } from '../data/cases';
import type { CaseDefinition, FragmentPuzzle, Puzzle } from './case-definition';
import { answerMatches, compatibleCandidateIds, evaluatePredicate, permutations, puzzleSolutions, validateContent } from './content-validation';

const replaceFirstPuzzle = (replacement: Puzzle): readonly CaseDefinition[] => CASES.map((item, index) => index === 0 ? { ...item, puzzles: [replacement, ...item.puzzles.slice(1)] } : item);

describe('Authored case corpus', () => {
  it('proves all twelve puzzles and three candidate intersections', () => {
    expect(CASES).toHaveLength(3);
    expect(CASES.flatMap((item) => item.puzzles)).toHaveLength(12);
    expect(new Set(CASES.flatMap((item) => item.puzzles.map((puzzle) => puzzle.kind)))).toHaveLength(6);
    expect(validateContent(CASES, ARTWORKS)).toEqual([]);
  });

  it.each(CASES)('preserves the unique conclusion through all 24 clue orders in $id', (item) => {
    const orders = permutations(item.puzzles.map((puzzle) => puzzle.clue.id));
    expect(orders).toHaveLength(24);
    for (const order of orders) {
      let previous = item.candidateIds.length;
      for (let count = 0; count <= 4; count++) {
        const candidates = compatibleCandidateIds(item, order.slice(0, count), ARTWORKS);
        expect(candidates).toContain(item.targetArtworkId);
        expect(candidates.length).toBeLessThanOrEqual(previous);
        previous = candidates.length;
        if (count === 4) expect(candidates).toEqual([item.targetArtworkId]);
      }
    }
  });

  it('accepts the same canonical answers in both languages and rejects altered answers', () => {
    for (const puzzle of CASES.flatMap((item) => item.puzzles)) {
      expect(puzzleSolutions(puzzle, ARTWORKS)).toHaveLength(1);
      for (const language of ['fr', 'en'] as const) {
        expect(puzzle.prompt[language]).not.toBe('');
        expect(answerMatches(puzzle, puzzle.answer)).toBe(true);
      }
      expect(answerMatches(puzzle, 'unlisted-answer')).toBe(false);
    }
  });

  it('rejects chronology when documented intervals overlap', () => {
    const changed = ARTWORKS.map((artwork) => artwork.id === 437881 ? { ...artwork, objectEndDate: 1870 } : artwork);
    expect(validateContent(CASES, changed)).toContain('silent-chronology: expected one canonical solution, found 0');
  });

  it('does not treat an absent field as a contradiction', () => {
    expect(evaluatePredicate({ medium: '' }, { field: 'medium', operator: 'contains', value: 'bronze' })).toBeUndefined();
    const changed = ARTWORKS.map((artwork) => artwork.id === 436451 ? { ...artwork, medium: '' } : artwork);
    expect(validateContent(CASES, changed)).toContain('silent-report: undocumented assertion');
  });

  it('rejects an ambiguous complete material association', () => {
    const original = CASES[1];
    const puzzle = original.puzzles[3];
    if (puzzle.kind !== 'materials') throw new Error('Expected material puzzle');
    const changed = { ...puzzle, reports: puzzle.reports.map((report) => ({ ...report, predicate: { field: 'medium' as const, operator: 'contains' as const, value: 'ink and color on paper' } })) };
    const cases = CASES.map((item, index) => index === 1 ? { ...item, puzzles: [...item.puzzles.slice(0, 3), changed] } : item);
    expect(validateContent(cases, ARTWORKS)).toContain('ink-materials: expected one canonical solution, found 6');
  });

  it('proves label roles and rejects source text drift', () => {
    const puzzle = CASES[0].puzzles[3];
    if (puzzle.kind !== 'torn-label') throw new Error('Expected torn label');
    expect(puzzleSolutions({ ...puzzle, fragments: puzzle.fragments.map((fragment) => ({ ...fragment, role: 'artist' as const })) }, ARTWORKS)).toEqual([]);
    const changed = { ...puzzle, fragments: puzzle.fragments.map((fragment, index) => index ? fragment : { ...fragment, text: { ...fragment.text, en: 'Oil on wood' } }) };
    const cases = CASES.map((item, index) => index === 0 ? { ...item, puzzles: [...item.puzzles.slice(0, 3), changed] } : item);
    expect(validateContent(cases, ARTWORKS)).toContain('silent-label: label text differs from its source');
  });

  it('enumerates inventory constraints rather than assuming the stored answer', () => {
    const puzzle = CASES[2].puzzles[3];
    if (puzzle.kind !== 'inventory') throw new Error('Expected inventory puzzle');
    expect(puzzleSolutions({ ...puzzle, constraints: [] }, ARTWORKS)).toHaveLength(6);
    expect(puzzleSolutions(puzzle, ARTWORKS)).toEqual([puzzle.answer]);
    expect(answerMatches(puzzle, [...puzzle.answer].reverse())).toBe(false);
  });

  it('rejects missing witness records and image credits', () => {
    expect(validateContent(CASES, ARTWORKS.filter((artwork) => artwork.id !== 436964))).toContain('the-silent-frame: missing artwork 436964');
    const changed = ARTWORKS.map((artwork) => artwork.id === 436964 ? { ...artwork, image: { ...artwork.image, credit: '' } } : artwork);
    expect(validateContent(CASES, changed)).toContain('Artwork 436964: missing rights, image or provenance');
  });

  it('rejects untranslated help', () => {
    const puzzle = CASES[0].puzzles[0] as FragmentPuzzle;
    const changed: FragmentPuzzle = { ...puzzle, hints: [{ ...puzzle.hints[0], en: '' }, puzzle.hints[1], puzzle.hints[2]] };
    expect(validateContent(replaceFirstPuzzle(changed), ARTWORKS)).toContain('the-silent-frame.puzzles.0.hints.0: missing translation');
  });

  it('rejects a crop outside its source image', () => {
    const puzzle = CASES[0].puzzles[0] as FragmentPuzzle;
    const changed = { ...puzzle, fragment: { ...puzzle.fragment, crop: { ...puzzle.fragment.crop, x: 1.1 } } };
    expect(validateContent(replaceFirstPuzzle(changed), ARTWORKS)).toContain('silent-fragment: invalid fragment crop');
  });

  it('keeps target works out of witnesses and covers and supplies a factual rejection for every other candidate', () => {
    for (const item of CASES) {
      expect(item.witnessIds).not.toContain(item.targetArtworkId);
      expect(item.coverArtworkId).not.toBe(item.targetArtworkId);
      for (const id of item.candidateIds.filter((id) => id !== item.targetArtworkId)) {
        const artwork = ARTWORKS.find((entry) => entry.id === id)!;
        expect(item.puzzles.some((puzzle) => puzzle.clue.predicates.some((predicate) => evaluatePredicate(artwork, predicate) === false))).toBe(true);
        expect(item.candidateExplanations[id]).toBeDefined();
      }
    }
  });

});
