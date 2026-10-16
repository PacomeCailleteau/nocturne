import type {
  AnalyticsCase,
  AnalyticsModel,
  DistributionDatum,
} from '../../../integrations/analytics/analytics-types';
import { projectCaseEvidence } from '../../core/met/case-evidence';
import type { ArtworkRecordState } from '../../domain/artwork';
import type { ArtworkReference, CaseDefinition, Language } from '../../domain/case-definition';
import { evaluatePredicate } from '../../domain/content-validation';
import { puzzleStars, type GameState } from '../../domain/game-state';
import { ANALYTICS_COPY } from './analytics-copy';

function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

export function projectAnalytics(
  definitions: readonly CaseDefinition[],
  state: GameState,
  records: ReadonlyMap<number, ArtworkRecordState>,
  language: Language,
): AnalyticsModel {
  const copy = ANALYTICS_COPY[language];
  const cases: AnalyticsCase[] = definitions.map((definition) => {
    const progress = state.cases[definition.id];
    const evidence = projectCaseEvidence(definition, records);
    const chronology = definition.puzzles.find((puzzle) => puzzle.kind === 'chronology');
    const timelineEligible = !!chronology && !!progress.puzzles[chronology.id].completion;
    const timeline = timelineEligible
      ? chronology.items
          .map((item) => {
            const work = evidence.byId.get(item.artworkId)!;
            return {
              title: work.facts.title ?? copy.unknown,
              dateLabel: work.facts.objectDate,
              begin: work.facts.objectBeginDate,
              end: work.facts.objectEndDate,
              source:
                work.provenance.kind === 'live'
                  ? copy.live
                  : `${copy.reference} · ${work.provenance.retrievedAt.slice(0, 10)}`,
            };
          })
          .sort((left, right) => (left.begin ?? Infinity) - (right.begin ?? Infinity))
      : [];
    let compatible = [...definition.candidateIds];
    const candidates = [{ label: copy.initial, count: compatible.length }];
    for (const clueId of progress.clueOrder) {
      const puzzle = definition.puzzles.find((item) => item.clue.id === clueId)!;
      compatible = compatible.filter((id) => {
        const facts = evidence.byId.get(id)!.facts;
        const knownFacts = Object.fromEntries(
          Object.entries(facts).filter(([, value]) => value !== null),
        ) as Partial<ArtworkReference>;
        return puzzle.clue.predicates.every(
          (predicate) => evaluatePredicate(knownFacts, predicate) === true,
        );
      });
      candidates.push({ label: puzzle.title[language], count: compatible.length });
    }
    const sources = [
      ...new Set(
        definition.candidateIds.map((id) => {
          const provenance = evidence.byId.get(id)!.provenance;
          return provenance.kind === 'live'
            ? copy.live
            : `${copy.reference} · ${provenance.retrievedAt.slice(0, 10)}`;
        }),
      ),
    ];
    return {
      id: definition.id,
      title: definition.title[language],
      attempt: progress.attemptNumber,
      timelineEligible,
      timeline,
      candidates,
      candidateSource: sources.join(' / '),
      stars: definition.puzzles.map((puzzle) => ({
        label: puzzle.title[language],
        value: puzzleStars(progress.puzzles[puzzle.id]),
        completed: !!progress.puzzles[puzzle.id].completion,
      })),
    };
  });
  const distributions = ['all', ...definitions.map((definition) => definition.id)].map((scope) => {
    const definition = definitions.find((item) => item.id === scope);
    const ids = state.discoveredArtworkIds.filter(
      (id) =>
        !definition || definition.witnessIds.includes(id) || definition.candidateIds.includes(id),
    );
    const categories = new Map<string | null, DistributionDatum>();
    for (const id of ids) {
      const record = records.get(id);
      const label = record?.artwork?.objectName ?? null;
      const row = categories.get(label) ?? {
        label,
        count: 0,
        live: 0,
        reference: 0,
        unavailable: 0,
        referenceDates: [],
      };
      const source =
        record?.artwork && record.provenance
          ? record.provenance.kind === 'live'
            ? 'live'
            : 'reference'
          : 'unavailable';
      const referenceDates =
        source === 'reference'
          ? [...new Set([...row.referenceDates, record!.provenance!.retrievedAt.slice(0, 10)])]
          : row.referenceDates;
      categories.set(label, {
        ...row,
        count: row.count + 1,
        [source]: row[source] + 1,
        referenceDates,
      });
    }
    return {
      scope,
      sample: ids.length,
      rows: [...categories.values()].sort(
        (left, right) =>
          right.count - left.count || (left.label ?? '').localeCompare(right.label ?? ''),
      ),
    };
  });
  return freeze({ language, copy, cases, distributions });
}
