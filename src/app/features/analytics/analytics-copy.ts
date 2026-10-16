import type { AnalyticsText } from '../../../integrations/analytics/analytics-types';

export const ANALYTICS_COPY: Readonly<
  Record<'fr' | 'en', Readonly<Record<AnalyticsText, string>>>
> = {
  fr: {
    timeline: 'Chronologie',
    types: 'Types d’œuvres',
    candidates: 'Candidates compatibles',
    stars: 'Étoiles par épreuve',
    scope: 'Périmètre de l’analyse',
    allCases: 'Toutes les affaires',
    values: 'Consulter les valeurs',
    hideValues: 'Masquer les valeurs',
    sample: 'Échantillon',
    works: 'œuvres',
    puzzles: 'épreuves',
    locked: 'Résolvez l’épreuve de chronologie de cette affaire pour ouvrir sa frise.',
    empty: 'Pas encore de données pour cette analyse.',
    unknown: 'Non renseigné',
    bounds: 'Bornes chronologiques',
    museumDate: 'Datation du musée',
    source: 'Source',
    count: 'Effectif',
    step: 'Indice obtenu',
    initial: 'Avant les indices',
    attempt: 'Tentative',
    pending: 'À explorer',
    earned: 'Étoiles acquises',
    timelineNote:
      'Les segments conservent les intervalles documentés. Le libellé du musée et ses bornes numériques peuvent différer.',
    typesNote:
      'Œuvres volontairement découvertes. Le type provient de la fiche actuelle du Met ou de sa copie de secours ; une information absente reste non renseignée.',
    candidatesNote:
      'Chaque série suit l’ordre réel des indices de sa propre affaire et leur intersection. Seuls les effectifs sont présentés.',
    starsNote:
      'Étoiles figées à la résolution, pour la tentative actuelle. Une épreuve à explorer n’a pas encore d’étoiles.',
    eligible: 'affaires avec une frise ouverte',
    live: 'Met · fiche actuelle',
    reference: 'Référence datée',
    unavailable: 'Fiche non disponible',
    bce: 'av. J.-C.',
    ce: 'apr. J.-C.',
  },
  en: {
    timeline: 'Timeline',
    types: 'Artwork types',
    candidates: 'Compatible candidates',
    stars: 'Stars by puzzle',
    scope: 'Analysis scope',
    allCases: 'All cases',
    values: 'View the values',
    hideValues: 'Hide the values',
    sample: 'Sample',
    works: 'artworks',
    puzzles: 'puzzles',
    locked: 'Solve this case’s chronology puzzle to open its timeline.',
    empty: 'No data for this analysis yet.',
    unknown: 'Not documented',
    bounds: 'Chronological bounds',
    museumDate: 'Museum date label',
    source: 'Source',
    count: 'Count',
    step: 'Clue earned',
    initial: 'Before the clues',
    attempt: 'Attempt',
    pending: 'To explore',
    earned: 'Stars earned',
    timelineNote:
      'Segments preserve documented intervals. The museum’s date label and numeric bounds may differ.',
    typesNote:
      'Deliberately discovered artworks. Types come from the current Met record or its backup; absent information remains undocumented.',
    candidatesNote:
      'Each series follows its own case’s actual clue acquisition order and their intersection. Only counts are presented.',
    starsNote:
      'Stars frozen on completion, for the current attempt. Unexplored puzzles have not earned stars yet.',
    eligible: 'cases with an open timeline',
    live: 'Met · current record',
    reference: 'Dated reference',
    unavailable: 'Record unavailable',
    bce: 'BCE',
    ce: 'CE',
  },
};
