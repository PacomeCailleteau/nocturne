import { expect, test } from '@playwright/test';
import { CASES } from '../../src/app/data/cases';
import { createGameState } from '../../src/app/domain/game-state';
import { mockMuseum, arrange, openPuzzle, assistFirstCase } from './helpers';

test.beforeEach(async ({ page }) => { await mockMuseum(page); });

test('solves the first case with keyboard ordering, retains language and replay best result', async ({ page }) => {
  await openPuzzle(page, 'silent-label');
  await page.locator('[data-fragment-id="label-artist"]').click();
  await page.getByTestId('language-toggle').click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('[data-order-id="label-artist"]')).toBeVisible();
  for (const id of ['label-title', 'label-date', 'label-medium']) {
    await page.locator(`[data-fragment-id="${id}"]`).focus();
    await page.keyboard.press('Enter');
  }
  await page.getByRole('button', { name: 'Check my answer' }).click();
  await expect(page.locator('.feedback.success')).toBeVisible();
  await openPuzzle(page, 'silent-fragment');
  await page.locator('[data-choice-id="work-436964"]').click();
  await page.getByRole('button', { name: 'Check my answer' }).click();
  await openPuzzle(page, 'silent-chronology');
  const chronology = CASES[0].puzzles.find((item) => item.kind === 'chronology')!;
  if (chronology.kind !== 'chronology') throw new Error('Missing chronology');
  await arrange(page, chronology.answer);
  await page.getByRole('button', { name: 'Check my answer' }).click();
  await expect(page.locator('.feedback.success')).toBeVisible();
  await openPuzzle(page, 'silent-report');
  await page.locator('[data-choice-id="landscape-support"]').click();
  await page.getByRole('button', { name: 'Check my answer' }).click();
  await page.goto('/#/cases/the-silent-frame');
  await page.locator('[data-candidate-id="436535"]').click();
  await page.getByRole('button', { name: 'Confirm this identification', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Case solved', exact: true })).toBeVisible();
  await expect(page.locator('.result-stars')).toContainText('12');
  await page.getByRole('button', { name: 'Replay this case' }).click();
  await page.getByRole('button', { name: 'Start a new attempt', exact: true }).click();
  await expect(page.locator('.clue-list li')).toHaveCount(0);
  await page.goto('/#/notebook');
  await expect(page.locator('.notebook-case').first()).toContainText('Best complete result : 12/12');
});

test('explains the first final error then concludes with assistance without changing stars', async ({ page }) => {
  await assistFirstCase(page);
  await page.locator('[data-candidate-id="437655"]').click();
  await page.getByRole('button', { name: 'Confirmer cette identification', exact: true }).click();
  await expect(page.locator('.feedback.incorrect')).toContainText('1881');
  await expect(page.locator('.final-section')).toContainText('1 tentative finale restante');
  await page.locator('[data-candidate-id="334652"]').click();
  await page.getByRole('button', { name: 'Confirmer cette identification', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Affaire résolue avec assistance finale', exact: true })).toBeVisible();
  await expect(page.locator('.result-stars')).toContainText('4');
});

test('uses current API values in artwork detail and notebook search without discovering by preload', async ({ page }) => {
  await mockMuseum(page, { 437881: { title: 'API-controlled witness title', primaryImage: '', primaryImageSmall: '' } });
  await page.goto('/#/cases/the-silent-frame');
  await page.goto('/#/notebook');
  await expect(page.locator('.notebook-artwork')).toHaveCount(0);
  await page.goto('/#/artworks/436535');
  await expect(page.locator('h1')).toContainText('pas encore consultable');
  await page.goto('/#/artworks/437881');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('API-controlled witness title');
  await expect(page.locator('.image-notice').first()).toContainText('Reproduction locale');
  await page.goto('/#/notebook');
  await expect(page.locator('.notebook-artwork')).toContainText('API-controlled witness title');
  await page.getByRole('searchbox').fill('no-matching-artwork');
  await expect(page.getByRole('status')).toContainText('Aucune œuvre');
});

test('rules and artwork zoom restore focus, and unknown routes remain neutral', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
  const rules = page.getByRole('button', { name: 'Règles du jeu', exact: true });
  await rules.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(rules).toBeFocused();
  await page.goto('/#/artworks/437881');
  const zoom = page.getByRole('button', { name: 'Agrandir l’image' });
  await zoom.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(zoom).toBeFocused();
  await page.goto('/#/unknown-gallery');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cette page n’est pas disponible');
  await expect(page.locator('body')).not.toContainText('Wheat Field with Cypresses');
});

test('resumes a supported partial label with an empty slot and continues in English', async ({ page }) => {
  const game = createGameState(CASES);
  const progress = game.cases['the-silent-frame'];
  const saved = { version: 1, locale: 'fr', game: { ...game, cases: { ...game.cases, 'the-silent-frame': { ...progress, puzzles: { ...progress.puzzles, 'silent-label': { ...progress.puzzles['silent-label'], draft: ['label-artist', ''] } } } } } };
  await page.addInitScript((value) => { localStorage.setItem('nocturne.progress.v1', JSON.stringify(value)); }, saved);
  await openPuzzle(page, 'silent-label');
  await expect(page.locator('[data-order-id]')).toHaveCount(1);
  await page.getByTestId('language-toggle').click();
  await page.locator('[data-fragment-id="label-title"]').click();
  for (const id of ['label-date', 'label-medium']) await page.locator(`[data-fragment-id="${id}"]`).click();
  await page.getByRole('button', { name: 'Check my answer' }).click();
  await expect(page.locator('.feedback.success')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
