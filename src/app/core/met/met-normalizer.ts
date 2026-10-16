import type { Artwork } from '../../domain/artwork';

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function number(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function url(value: unknown): string | null {
  const candidate = text(value);
  if (!candidate) return null;
  try {
    return new URL(candidate).protocol === 'https:' ? candidate : null;
  } catch {
    return null;
  }
}

export function normalizeMetArtwork(raw: unknown, expectedId: number): Artwork | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  if (!Number.isSafeInteger(record['objectID']) || record['objectID'] !== expectedId || expectedId <= 0) return null;
  if (!text(record['title']) && !text(record['objectName']) && !text(record['medium'])) return null;
  return {
    id: expectedId,
    title: text(record['title']),
    artistDisplayName: text(record['artistDisplayName']),
    objectDate: text(record['objectDate']),
    objectBeginDate: number(record['objectBeginDate']),
    objectEndDate: number(record['objectEndDate']),
    medium: text(record['medium']),
    objectName: text(record['objectName']),
    department: text(record['department']),
    culture: text(record['culture']),
    dimensions: text(record['dimensions']),
    classification: text(record['classification']),
    objectURL: url(record['objectURL']),
    creditLine: text(record['creditLine']),
    isPublicDomain: typeof record['isPublicDomain'] === 'boolean' ? record['isPublicDomain'] : null,
    primaryImage: url(record['primaryImage']),
    primaryImageSmall: url(record['primaryImageSmall']),
    metadataDate: text(record['metadataDate']),
  };
}
