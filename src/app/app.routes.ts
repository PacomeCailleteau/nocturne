import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/cases/cases-page').then((module) => module.CasesPage),
  },
  {
    path: 'cases/:caseId/puzzles/:puzzleId',
    loadComponent: () =>
      import('./features/puzzles/puzzle-page').then((module) => module.PuzzlePage),
  },
  {
    path: 'cases/:caseId',
    loadComponent: () =>
      import('./features/investigation/case-page').then((module) => module.CasePage),
  },
  {
    path: 'notebook',
    loadComponent: () =>
      import('./features/notebook/notebook-page').then((module) => module.NotebookPage),
  },
  {
    path: 'analytics',
    loadComponent: async () => {
      const integration = await import('../integrations/analytics/analytics-element');
      integration.registerAnalyticsElement();
      return (await import('./features/analytics/analytics-host')).AnalyticsHost;
    },
  },
  {
    path: 'artworks/:artworkId',
    loadComponent: () =>
      import('./features/artwork/artwork-page').then((module) => module.ArtworkPage),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/unavailable-page').then((module) => module.UnavailablePage),
  },
];
