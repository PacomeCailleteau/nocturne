import type { ArtworkId, FactField } from './case-definition';

export interface Artwork {
  readonly id: ArtworkId;
  readonly title: string | null;
  readonly artistDisplayName: string | null;
  readonly objectDate: string | null;
  readonly objectBeginDate: number | null;
  readonly objectEndDate: number | null;
  readonly medium: string | null;
  readonly objectName: string | null;
  readonly department: string | null;
  readonly culture: string | null;
  readonly dimensions: string | null;
  readonly classification: string | null;
  readonly objectURL: string | null;
  readonly creditLine: string | null;
  readonly isPublicDomain: boolean | null;
  readonly primaryImage: string | null;
  readonly primaryImageSmall: string | null;
  readonly metadataDate: string | null;
}

export interface ArtworkProvenance {
  readonly kind: 'live' | 'reference';
  readonly retrievedAt: string;
  readonly url: string;
}

export type ArtworkFailure = 'request-failed' | 'timeout' | 'invalid-record';

export interface ArtworkRecordState {
  readonly status: 'idle' | 'loading' | 'ready' | 'unavailable';
  readonly artwork?: Artwork;
  readonly provenance?: ArtworkProvenance;
  readonly failure?: ArtworkFailure;
}

export type ArtworkFacts = Readonly<Pick<Artwork, 'id' | FactField>>;

export interface EvidenceArtwork {
  readonly id: ArtworkId;
  readonly facts: ArtworkFacts;
  readonly provenance: ArtworkProvenance;
  readonly reason: 'live' | 'loading' | 'fallback' | 'diverged' | 'unavailable';
  readonly divergentFields: readonly FactField[];
}

export interface CaseEvidence {
  readonly caseId: string;
  readonly revision: string;
  readonly artworks: readonly EvidenceArtwork[];
  readonly byId: ReadonlyMap<ArtworkId, EvidenceArtwork>;
  readonly usesReference: boolean;
}
