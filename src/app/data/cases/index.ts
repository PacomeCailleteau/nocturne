import { ARTWORKS as REFERENCES } from './artworks';
import { DEFINITIONS } from './definitions';
import type { ArtworkReference, CaseDefinition } from '../../domain/case-definition';

export const ARTWORKS: readonly ArtworkReference[] = REFERENCES;
export const CASES: readonly CaseDefinition[] = DEFINITIONS;
export const ARTWORK_BY_ID: ReadonlyMap<number, ArtworkReference> = new Map(ARTWORKS.map((artwork) => [artwork.id, artwork]));
export const CASE_BY_ID: ReadonlyMap<string, CaseDefinition> = new Map(CASES.map((caseDefinition) => [caseDefinition.id, caseDefinition]));
