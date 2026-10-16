export type Analysis = 'timeline' | 'types' | 'candidates' | 'stars';
export type AnalyticsText =
  | 'timeline'
  | 'types'
  | 'candidates'
  | 'stars'
  | 'scope'
  | 'allCases'
  | 'values'
  | 'hideValues'
  | 'sample'
  | 'works'
  | 'puzzles'
  | 'locked'
  | 'empty'
  | 'unknown'
  | 'bounds'
  | 'museumDate'
  | 'source'
  | 'count'
  | 'step'
  | 'initial'
  | 'attempt'
  | 'pending'
  | 'earned'
  | 'timelineNote'
  | 'typesNote'
  | 'candidatesNote'
  | 'starsNote'
  | 'eligible'
  | 'live'
  | 'reference'
  | 'unavailable'
  | 'bce'
  | 'ce';
export interface TimelineDatum {
  readonly title: string;
  readonly dateLabel: string | null;
  readonly begin: number | null;
  readonly end: number | null;
  readonly source: string;
}
export interface CandidatePoint {
  readonly label: string;
  readonly count: number;
}
export interface AnalyticsCase {
  readonly id: string;
  readonly title: string;
  readonly attempt: number;
  readonly timelineEligible: boolean;
  readonly timeline: readonly TimelineDatum[];
  readonly candidates: readonly CandidatePoint[];
  readonly candidateSource: string;
  readonly stars: readonly Readonly<{ label: string; value: number; completed: boolean }>[];
}
export interface DistributionDatum {
  readonly label: string | null;
  readonly count: number;
  readonly live: number;
  readonly reference: number;
  readonly unavailable: number;
  readonly referenceDates: readonly string[];
}
export interface AnalyticsModel {
  readonly language: 'fr' | 'en';
  readonly copy: Readonly<Record<AnalyticsText, string>>;
  readonly cases: readonly AnalyticsCase[];
  readonly distributions: readonly Readonly<{
    scope: string;
    sample: number;
    rows: readonly DistributionDatum[];
  }>[];
}
