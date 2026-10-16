import { ARTWORK_BY_ID } from '../../data/cases';
import type { Artwork, ArtworkFacts, ArtworkRecordState, CaseEvidence, EvidenceArtwork } from '../../domain/artwork';
import type { ArtworkReference, CaseDefinition, FactField } from '../../domain/case-definition';

const FACT_FIELDS: readonly FactField[] = ['title', 'objectDate', 'artistDisplayName', 'objectBeginDate', 'objectEndDate', 'medium', 'objectName', 'department', 'culture'];

function facts(artwork: Artwork | ArtworkReference): ArtworkFacts {
  return Object.fromEntries([['id', artwork.id], ...FACT_FIELDS.map((field) => [field, artwork[field] === '' ? null : artwork[field]])]) as unknown as ArtworkFacts;
}

function criticalFields(definition: CaseDefinition, id: number): readonly FactField[] {
  const fields = new Set<FactField>(['objectBeginDate', 'objectEndDate', 'medium', 'artistDisplayName']);
  for (const puzzle of definition.puzzles) {
    for (const piece of puzzle.pieces) {
      if (piece.artworkIds.includes(id)) piece.fields.forEach((field) => fields.add(field));
    }
    if (definition.candidateIds.includes(id)) puzzle.clue.predicates.forEach((predicate) => fields.add(predicate.field));
    if (puzzle.kind === 'contradiction') puzzle.statements.filter((statement) => statement.artworkId === id).forEach((statement) => fields.add(statement.assertion.field));
    if (puzzle.kind === 'materials' && puzzle.items.some((item) => item.artworkId === id)) puzzle.reports.forEach((report) => fields.add(report.predicate.field));
    if (puzzle.kind === 'torn-label' && puzzle.artworkId === id) {
      fields.add('title');
      fields.add('objectDate');
    }
  }
  return [...fields];
}

export function projectCaseEvidence(definition: CaseDefinition, records: ReadonlyMap<number, ArtworkRecordState>): CaseEvidence {
  const ids = [...new Set([...definition.witnessIds, ...definition.candidateIds])];
  const artworks: EvidenceArtwork[] = ids.map((id) => {
    const reference = ARTWORK_BY_ID.get(id)!;
    const record = records.get(id);
    const referenceFacts = facts(reference);
    const currentFacts = record?.artwork ? facts(record.artwork) : undefined;
    const divergentFields = currentFacts ? criticalFields(definition, id).filter((field) => currentFacts[field] !== referenceFacts[field]) : [];
    if (record?.status === 'ready' && record.provenance?.kind === 'live' && currentFacts && !divergentFields.length) {
      return { id, facts: currentFacts, provenance: record.provenance, reason: 'live', divergentFields };
    }
    const reason = record?.status === 'unavailable' ? 'unavailable' : record?.provenance?.kind === 'reference' ? 'fallback' : record?.artwork && divergentFields.length ? 'diverged' : 'loading';
    return { id, facts: referenceFacts, provenance: { kind: 'reference', retrievedAt: reference.retrievedAt, url: reference.objectURL }, reason, divergentFields };
  });
  return { caseId: definition.id, revision: definition.revision, artworks, byId: new Map(artworks.map((artwork) => [artwork.id, artwork])), usesReference: artworks.some((artwork) => artwork.provenance.kind === 'reference') };
}
