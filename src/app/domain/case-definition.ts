export type Language = 'fr' | 'en';
export type Localized = Readonly<Record<Language, string>>;
export type ArtworkId = number;
export type FactField = 'title' | 'objectDate' | 'artistDisplayName' | 'objectBeginDate' | 'objectEndDate' | 'medium' | 'objectName' | 'department' | 'culture';
export type FactPredicate = Readonly<{ field: FactField; operator: 'equals' | 'contains' | 'at-least' | 'at-most'; value: string | number }>;
export interface ArtworkReference {
  readonly id: ArtworkId;
  readonly title: string;
  readonly artistDisplayName: string;
  readonly objectDate: string;
  readonly objectBeginDate: number;
  readonly objectEndDate: number;
  readonly medium: string;
  readonly objectName: string;
  readonly department: string;
  readonly culture: string;
  readonly objectURL: string;
  readonly creditLine: string;
  readonly isPublicDomain: true;
  readonly primaryImage: string;
  readonly primaryImageSmall: string;
  readonly referencePath: string;
  readonly retrievedAt: string;
  readonly image: Readonly<{ path: string; width: number; height: number; alt: Localized; credit: string }>;
}
export interface DossierPiece {
  readonly id: string;
  readonly title: Localized;
  readonly text: Localized;
  readonly provenance: 'fictional-document' | 'museum-record';
  readonly artworkIds: readonly ArtworkId[];
  readonly fields: readonly FactField[];
}
export interface Clue {
  readonly id: string;
  readonly text: Localized;
  readonly predicates: readonly FactPredicate[];
  readonly sourcePieceId: string;
}
export interface PuzzleBase {
  readonly id: string;
  readonly title: Localized;
  readonly prompt: Localized;
  readonly instructions: Localized;
  readonly hints: readonly [Localized, Localized, Localized];
  readonly explanation: Localized;
  readonly wrongAnswer: Localized;
  readonly witnessIds: readonly ArtworkId[];
  readonly pieces: readonly DossierPiece[];
  readonly clue: Clue;
}
export interface FragmentPuzzle extends PuzzleBase {
  readonly kind: 'fragment';
  readonly fragment: Readonly<{ artworkId: ArtworkId; path: string; crop: Readonly<{ x: number; y: number; width: number; height: number }>; alt: Localized; observation: Localized }>;
  readonly options: readonly Readonly<{ id: string; artworkId: ArtworkId; observation: Localized }>[];
  readonly answer: string;
}
export interface ChronologyPuzzle extends PuzzleBase {
  readonly kind: 'chronology';
  readonly items: readonly Readonly<{ id: string; artworkId: ArtworkId }>[];
  readonly answer: readonly string[];
}
export interface ContradictionPuzzle extends PuzzleBase {
  readonly kind: 'contradiction';
  readonly statements: readonly Readonly<{ id: string; artworkId: ArtworkId; text: Localized; assertion: FactPredicate }>[];
  readonly answer: string;
}
export type LabelRole = 'artist' | 'title' | 'date' | 'medium';
export interface TornLabelPuzzle extends PuzzleBase {
  readonly kind: 'torn-label';
  readonly artworkId: ArtworkId;
  readonly template: readonly LabelRole[];
  readonly fragments: readonly Readonly<{ id: string; text: Localized; role: LabelRole }>[];
  readonly answer: readonly string[];
}
export interface MaterialPuzzle extends PuzzleBase {
  readonly kind: 'materials';
  readonly reports: readonly Readonly<{ id: string; text: Localized; predicate: FactPredicate }>[];
  readonly items: readonly Readonly<{ id: string; artworkId: ArtworkId }>[];
  readonly answer: Readonly<Record<string, string>>;
}
export type InventoryConstraint = Readonly<{ kind: 'at'; itemId: string; position: number }> | Readonly<{ kind: 'before' | 'adjacent'; left: string; right: string }> | Readonly<{ kind: 'not-at'; itemId: string; position: number }>;
export interface InventoryPuzzle extends PuzzleBase {
  readonly kind: 'inventory';
  readonly items: readonly Readonly<{ id: string; artworkId: ArtworkId }>[];
  readonly slots: readonly Readonly<{ id: string; label: Localized }>[];
  readonly constraints: readonly InventoryConstraint[];
  readonly constraintText: readonly Localized[];
  readonly answer: readonly string[];
}
export type Puzzle = FragmentPuzzle | ChronologyPuzzle | ContradictionPuzzle | TornLabelPuzzle | MaterialPuzzle | InventoryPuzzle;
export type PuzzleAnswer = string | readonly string[] | Readonly<Record<string, string>>;
export interface CaseDefinition {
  readonly id: string;
  readonly revision: string;
  readonly title: Localized;
  readonly subtitle: Localized;
  readonly briefing: Localized;
  readonly introduction: Localized;
  readonly difficulty: Localized;
  readonly estimatedMinutes: readonly [number, number];
  readonly accent: 'amber' | 'indigo' | 'stone';
  readonly coverArtworkId: ArtworkId;
  readonly candidateIds: readonly ArtworkId[];
  readonly targetArtworkId: ArtworkId;
  readonly witnessIds: readonly ArtworkId[];
  readonly puzzles: readonly Puzzle[];
  readonly conclusion: Localized;
  readonly assistedConclusion: Localized;
  readonly candidateExplanations: Readonly<Record<number, Localized>>;
}

