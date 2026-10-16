import { describe, expect, it } from 'vitest';
import { ARTWORK_BY_ID, CASES } from '../../data/cases';
import type { ArtworkRecordState } from '../../domain/artwork';
import { normalizeMetArtwork } from './met-normalizer';
import { projectCaseEvidence } from './case-evidence';

const liveRecord = (id: number, changes: Record<string, unknown> = {}): ArtworkRecordState => {
  const reference = ARTWORK_BY_ID.get(id)!;
  const artwork = normalizeMetArtwork({ ...reference, objectID: id, ...changes }, id)!;
  return { status: 'ready', artwork, provenance: { kind: 'live', retrievedAt: '2026-10-17T12:00:00Z', url: 'https://collectionapi.metmuseum.org' } };
};

describe('Common case evidence projection', () => {
  it('uses matching live facts rather than an ignored live response', () => {
    const definition = CASES[0];
    const records = new Map([...definition.witnessIds, ...definition.candidateIds].map((id) => [id, liveRecord(id)]));
    const evidence = projectCaseEvidence(definition, records);
    expect(evidence.byId.get(436535)?.provenance.kind).toBe('live');
    expect(evidence.byId.get(436535)?.facts.medium).toBe('Oil on canvas');
    expect(evidence.byId.get(436535)?.divergentFields).toEqual([]);
  });

  it('selects one dated reference projection for all puzzle consumers when critical source facts drift', () => {
    const records = new Map([[436535, liveRecord(436535, { objectBeginDate: 1900, medium: 'Oil on wood', artistDisplayName: 'Changed attribution' })]]);
    const evidence = projectCaseEvidence(CASES[0], records).byId.get(436535)!;
    expect(evidence.provenance.kind).toBe('reference');
    expect(evidence.reason).toBe('diverged');
    expect(evidence.divergentFields).toEqual(expect.arrayContaining(['objectBeginDate', 'medium', 'artistDisplayName']));
    expect(evidence.facts.objectBeginDate).toBe(1889);
    expect(evidence.facts.medium).toBe('Oil on canvas');
    expect(records.get(436535)?.artwork?.medium).toBe('Oil on wood');
  });
});
