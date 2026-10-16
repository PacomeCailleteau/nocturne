import { expect, test } from '@playwright/test';
import { mockMuseum } from './helpers';
import { ARTWORK_BY_ID, CASES } from '../../src/app/data/cases';
import { createGameState } from '../../src/app/domain/game-state';
import { confirmFinal, discoverArtwork, submitPuzzle } from '../../src/app/domain/game-transitions';
import type { AnalyticsElement } from '../../src/integrations/analytics/analytics-element';

test('analytics opens the React observatory with four analysis controls', async ({ page }) => {
  await mockMuseum(page);
  await page.goto('/#/analytics');
  await expect(page.getByRole('heading', { name: 'L’observatoire' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Chronologie', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Types d’œuvres', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Candidates compatibles', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Étoiles par épreuve', exact: true })).toBeVisible();
});

test('analytics uses current API types and unknowns and keeps the React selection across languages', async ({ page }) => {
  await mockMuseum(page, { 437881: { objectName: 'API-controlled sculpture' }, 436964: { objectName: '' } });
  for (const id of [437881, 436964]) {
    await page.goto(`/#/artworks/${id}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(ARTWORK_BY_ID.get(id)!.title);
  }
  await page.goto('/#/analytics');
  await page.getByRole('button', { name: 'Types d’œuvres', exact: true }).click();
  const analytics = page.locator('nocturne-analytics');
  await expect(analytics.locator('table')).toContainText('API-controlled sculpture');
  await expect(analytics.locator('table')).toContainText('Non renseigné');
  await expect(analytics.locator('tbody tr')).toHaveCount(2);
  await expect(analytics.locator('.metric strong')).toHaveText('2');
  await analytics.getByRole('combobox').selectOption('the-silent-frame');
  await page.getByTestId('language-toggle').click();
  await expect(analytics.getByRole('heading', { name: 'Artwork types', exact: true })).toBeVisible();
  await expect(analytics.getByRole('combobox')).toHaveValue('the-silent-frame');
  await expect(analytics.locator('table')).toContainText('Not documented');
  await expect(page).toHaveTitle('The observatory — Nocturne');
  const values = analytics.getByRole('button', { name: 'Hide the values' });
  await values.focus();
  await page.keyboard.press('Enter');
  await expect(analytics.locator('table')).toHaveCount(0);
  await expect(analytics.getByRole('img')).toBeVisible();
  await expect(page.locator('body')).not.toContainText('Wheat Field with Cypresses');
});

test('aggregate timelines filter each case before transfer and replay closes the timeline while keeping discoveries', async ({ page }) => {
  await mockMuseum(page);
  let game = createGameState(CASES);
  for (const puzzle of CASES[0].puzzles) game = submitPuzzle(game, CASES[0], puzzle.id, puzzle.answer);
  game = confirmFinal(game, CASES[0], CASES[0].targetArtworkId, 'analytics-conclusion');
  game = discoverArtwork(game, CASES, 437881);
  const saved = { version: 1, locale: 'fr', game };
  await page.addInitScript((value) => { if (!localStorage.getItem('nocturne.progress.v1')) localStorage.setItem('nocturne.progress.v1', JSON.stringify(value)); }, saved);
  await page.goto('/#/analytics');
  const analytics = page.locator('nocturne-analytics');
  await expect(analytics.locator('table')).toHaveCount(1);
  await expect(analytics.locator('table')).toContainText('1657 – 1667');
  await expect(analytics.getByRole('img')).toHaveCount(1);
  const transferred = await analytics.evaluate((element) => JSON.stringify((element as AnalyticsElement).model));
  expect(transferred).not.toContain(ARTWORK_BY_ID.get(CASES[1].witnessIds[0])!.title);
  expect(transferred).not.toContain(ARTWORK_BY_ID.get(544512)!.title);
  await page.goto('/#/cases/the-silent-frame');
  await page.getByRole('button', { name: 'Rejouer cette affaire' }).click();
  await page.getByRole('button', { name: 'Commencer une nouvelle tentative', exact: true }).click();
  await page.goto('/#/analytics');
  await expect(analytics.getByRole('img')).toHaveCount(0);
  await expect(analytics.locator('table')).toHaveCount(0);
  await analytics.getByRole('button', { name: 'Candidates compatibles', exact: true }).click();
  await expect(analytics.locator('.panel').first().locator('tbody tr')).toHaveCount(1);
  await expect(analytics.locator('.panel').first()).toContainText('Tentative 2');
  await analytics.getByRole('button', { name: 'Types d’œuvres', exact: true }).click();
  await expect(analytics.locator('.metric strong')).toHaveText('2');
});

test('candidate series follow actual earned order without identities and stars share current attempt values', async ({ page }) => {
  await mockMuseum(page);
  for (const id of ['silent-chronology', 'silent-fragment']) {
    await page.goto(`/#/cases/the-silent-frame/puzzles/${id}`);
    await expect(page.locator('app-puzzle-renderer')).toBeVisible();
    for (let hint = 0; hint < 3; hint++) await page.getByTestId('request-hint').click();
    await expect(page.locator('.feedback.success')).toBeVisible();
  }
  await page.goto('/#/analytics');
  const analytics = page.locator('nocturne-analytics');
  await analytics.getByRole('combobox').selectOption('the-silent-frame');
  await analytics.getByRole('button', { name: 'Candidates compatibles', exact: true }).click();
  const rows = analytics.locator('tbody tr');
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0)).toContainText('Avant les indices');
  await expect(rows.nth(0).locator('td')).toHaveText('4');
  await expect(rows.nth(1)).toContainText('Les archives chronologiques');
  await expect(rows.nth(1).locator('td')).toHaveText('3');
  await expect(rows.nth(2)).toContainText('Le fragment retrouvé');
  await expect(rows.nth(2).locator('td')).toHaveText('2');
  const serialized = await analytics.evaluate((element) => JSON.stringify((element as AnalyticsElement).model));
  for (const id of CASES[0].candidateIds) expect(serialized).not.toContain(String(id));
  await expect(analytics).not.toContainText('Wheat Field with Cypresses');
  await analytics.getByRole('button', { name: 'Étoiles par épreuve', exact: true }).click();
  await expect(rows.nth(0)).toContainText('1 / 3');
  await expect(rows.nth(1)).toContainText('1 / 3');
  await expect(rows.nth(2)).toContainText('À explorer');
  const widths = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, viewport: innerWidth }));
  expect(widths.page).toBeLessThanOrEqual(widths.viewport);
});

test('ancient intervals remain readable and keep distinct museum date labels', async ({ page }) => {
  await mockMuseum(page);
  let game = createGameState(CASES);
  const definition = CASES[2];
  const chronology = definition.puzzles.find((puzzle) => puzzle.kind === 'chronology')!;
  game = submitPuzzle(game, definition, chronology.id, chronology.answer);
  await page.addInitScript((value) => { localStorage.setItem('nocturne.progress.v1', JSON.stringify(value)); }, { version: 1, locale: 'fr', game });
  await page.goto('/#/analytics');
  const analytics = page.locator('nocturne-analytics');
  await analytics.getByRole('combobox').selectOption(definition.id);
  const row = analytics.getByRole('row').filter({ hasText: 'Sphinx of Amenhotep III' });
  await expect(row).toContainText('1390 av. J.-C. – 1352 av. J.-C.');
  await expect(row).toContainText('ca. 1386–1347 BCE');
  await page.getByTestId('language-toggle').click();
  await expect(row).toContainText('1390 BCE – 1352 BCE');
  await expect(analytics.getByRole('img')).toBeVisible();
});
