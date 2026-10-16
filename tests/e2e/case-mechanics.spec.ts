import { expect, test, type Page } from '@playwright/test';
import { CASES } from '../../src/app/data/cases';
import type { CaseDefinition } from '../../src/app/domain/case-definition';
import { createGameState } from '../../src/app/domain/game-state';
import { arrange, mockMuseum } from './helpers';

test.beforeEach(async ({ page }) => { await mockMuseum(page); });

test('matches the material reports and preserves stable assignments across languages', async ({ page }) => {
  await page.goto('/#/cases/ink-after-midnight/puzzles/ink-materials');
  const reportA = page.locator('select[data-report-id="report-a"]');
  await expect(reportA).toBeVisible();
  await reportA.selectOption('work-78617');
  await page.getByTestId('language-toggle').click();
  await expect(reportA).toHaveValue('work-78617');
  await page.reload();
  await expect(reportA).toHaveValue('work-78617');
  await page.locator('select[data-report-id="report-b"]').selectOption('work-37193');
  await page.locator('select[data-report-id="report-c"]').selectOption('work-37189');
  await page.getByRole('button', { name: 'Check my answer' }).click();
  await expect(page.locator('.feedback.incorrect')).toBeVisible();
  await reportA.selectOption('work-37189');
  await expect(page.locator('select[data-report-id="report-c"]')).toHaveValue('work-78617');
  await page.getByRole('button', { name: 'Check my answer' }).click();
  await expect(page.locator('.feedback.success')).toContainText('3 / 3');
  await solveCommonPuzzles(page, CASES[1], 'Check my answer');
  await conclude(page, CASES[1], CASES[1].targetArtworkId, 'Confirm this identification');
  await expect(page.getByRole('heading', { name: 'Case solved', exact: true })).toBeVisible();
  await expect(page.locator('.result-stars')).toContainText('12');
});

test('opens the antiquities case first and solves its inventory by keyboard without losing stars after a mistake', async ({ page }) => {
  const definition = CASES[2];
  await page.goto(`/#/cases/${definition.id}/puzzles/inventory-arrangement`);
  await expect(page.locator('.order-slot-label')).toHaveText(['I · Gauche', 'II · Milieu', 'III · Droite']);
  await page.getByRole('button', { name: 'Vérifier ma réponse' }).click();
  await expect(page.locator('.feedback.incorrect')).toBeVisible();
  await expect(page.locator('.constraint-feedback')).toContainText('La tête royale est à côté du torse.');
  const puzzle = definition.puzzles.find((item) => item.kind === 'inventory')!;
  await arrange(page, puzzle.answer);
  await page.getByRole('button', { name: 'Vérifier ma réponse' }).click();
  await expect(page.locator('.feedback.success')).toContainText('3 / 3');
  await solveCommonPuzzles(page, definition, 'Vérifier ma réponse');
  await conclude(page, definition, definition.targetArtworkId, 'Confirmer cette identification');
  await expect(page.getByRole('heading', { name: 'Affaire résolue', exact: true })).toBeVisible();
  await expect(page.locator('.result-stars')).toContainText('12');
  await expect(page.locator('.conclusion-copy')).toContainText('−1390');
  await expect(page.locator('.conclusion-copy')).toContainText('1386–1347 BCE');
});

test('submits the displayed inventory order after restoring a partial saved arrangement', async ({ page }) => {
  const definition = CASES[2];
  const game = createGameState(CASES);
  const progress = game.cases[definition.id];
  const puzzleId = 'inventory-arrangement';
  const saved = {
    version: 1,
    locale: 'fr',
    game: {
      ...game,
      cases: {
        ...game.cases,
        [definition.id]: {
          ...progress,
          puzzles: {
            ...progress.puzzles,
            [puzzleId]: { ...progress.puzzles[puzzleId], draft: ['work-544498', 'work-544752', ''] },
          },
        },
      },
    },
  };
  await page.addInitScript((value) => { localStorage.setItem('nocturne.progress.v1', JSON.stringify(value)); }, saved);
  await page.goto(`/#/cases/${definition.id}/puzzles/${puzzleId}`);
  await expect(page.locator('[data-order-id]')).toHaveCount(3);
  expect(await page.locator('[data-order-id]').evaluateAll((items) => items.map((item) => item.getAttribute('data-order-id')))).toEqual(['work-544498', 'work-544752', 'work-548360']);
  await page.getByRole('button', { name: 'Vérifier ma réponse' }).click();
  await expect(page.locator('.feedback.success')).toContainText('3 / 3');
});

test('submits the displayed chronology after restoring a partial saved order', async ({ page }) => {
  const definition = CASES[1];
  const puzzle = definition.puzzles.find((item) => item.kind === 'chronology')!;
  const game = createGameState(CASES);
  const progress = game.cases[definition.id];
  const saved = {
    version: 1,
    locale: 'fr',
    game: {
      ...game,
      cases: {
        ...game.cases,
        [definition.id]: {
          ...progress,
          puzzles: {
            ...progress.puzzles,
            [puzzle.id]: { ...progress.puzzles[puzzle.id], draft: [...puzzle.answer.slice(0, 2), ''] },
          },
        },
      },
    },
  };
  await page.addInitScript((value) => { localStorage.setItem('nocturne.progress.v1', JSON.stringify(value)); }, saved);
  await page.goto(`/#/cases/${definition.id}/puzzles/${puzzle.id}`);
  await expect(page.locator('[data-order-id]')).toHaveCount(3);
  expect(await page.locator('[data-order-id]').evaluateAll((items) => items.map((item) => item.getAttribute('data-order-id')))).toEqual(puzzle.answer);
  await page.getByRole('button', { name: 'Vérifier ma réponse' }).click();
  await expect(page.locator('.feedback.success')).toContainText('3 / 3');
});

for (const definition of CASES.slice(1)) {
  test(`completes ${definition.id} with explained puzzles and a guided final resolution`, async ({ page }) => {
    for (const puzzle of definition.puzzles) {
      await page.goto(`/#/cases/${definition.id}/puzzles/${puzzle.id}`);
      for (let level = 0; level < 3; level++) await page.getByTestId('request-hint').click();
      await expect(page.locator('.feedback.success')).toContainText('1 / 3');
      if (puzzle.kind === 'materials') {
        for (const [reportId, itemId] of Object.entries(puzzle.answer)) {
          await expect(page.locator(`select[data-report-id="${reportId}"]`)).toHaveValue(itemId);
          await expect(page.locator(`select[data-report-id="${reportId}"]`)).toBeDisabled();
        }
      }
      if (puzzle.kind === 'inventory') {
        await expect(page.locator('[data-order-id]')).toHaveCount(3);
        expect(await page.locator('[data-order-id]').evaluateAll((items) => items.map((item) => item.getAttribute('data-order-id')))).toEqual(puzzle.answer);
      }
    }
    const incorrect = definition.candidateIds.filter((id) => id !== definition.targetArtworkId);
    await conclude(page, definition, incorrect[0], 'Confirmer cette identification');
    await expect(page.locator('.feedback.incorrect')).toBeVisible();
    await page.locator(`[data-candidate-id="${incorrect[1]}"]`).click();
    await page.getByRole('button', { name: 'Confirmer cette identification', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Affaire résolue avec assistance finale', exact: true })).toBeVisible();
    await expect(page.locator('.result-stars')).toContainText('4');
  });
}

async function solveCommonPuzzles(page: Page, definition: CaseDefinition, submitLabel: string): Promise<void> {
  for (const puzzle of definition.puzzles) {
    if (puzzle.kind !== 'fragment' && puzzle.kind !== 'chronology' && puzzle.kind !== 'contradiction') continue;
    await page.goto(`/#/cases/${definition.id}/puzzles/${puzzle.id}`);
    await expect(page.locator('app-puzzle-renderer')).toBeVisible();
    if (puzzle.kind === 'chronology') await arrange(page, puzzle.answer);
    else await page.locator(`[data-choice-id="${puzzle.answer}"]`).click();
    await page.getByRole('button', { name: submitLabel }).click();
    await expect(page.locator('.feedback.success')).toBeVisible();
  }
}

async function conclude(page: Page, definition: CaseDefinition, candidateId: number, confirmLabel: string): Promise<void> {
  await page.goto(`/#/cases/${definition.id}`);
  await page.locator(`[data-candidate-id="${candidateId}"]`).click();
  await page.getByRole('button', { name: confirmLabel, exact: true }).click();
}
